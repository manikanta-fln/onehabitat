import type {
  InteriorEstimate,
  InteriorScope,
  InteriorTier,
  InteriorTrade,
  InteriorTradeLine,
} from "@/types/interiors";
import {
  COLOUR_COMBINATIONS,
  INTERIOR_TRENDS,
  MARKET_LABEL,
  PROPERTY_PRESETS,
  TRADE_ORDER,
  TRADES,
} from "@/lib/interiors/config";
import {
  describeWork,
  estimateInteriors,
  homePhrase,
} from "@/lib/interiors/estimator";
import {
  formatINR,
  formatLakh,
  formatNumber,
  TIER_LABELS,
} from "@/lib/interiors/format";
import {
  parseInteriorsSignals,
  resolveEstimateInput,
} from "@/lib/interiors/intent";
import {
  CITY_QUESTION_RE,
  detectFocus,
  FOCUS_ORDER,
  hasAny,
  isQuestion,
  mentionedTrades,
  OTHER_TOPIC_RE,
  type QuestionFocus,
} from "@/lib/interiors/question";

/**
 * Answers interiors / renovation questions directly from the rate config, so
 * every figure, quantity and brand is exact and the reply covers only what the
 * customer asked.
 */

export type InteriorsAnswer = {
  reply: string;
  /** Present when the question is about cost or quantities and the size is known. */
  estimate?: InteriorEstimate;
};

const TIERS: InteriorTier[] = ["economy", "premium", "luxury"];

/** Focuses answered with a cost / quantity card. */
const CARD_FOCUS: QuestionFocus[] = ["estimate", "budget", "quantity", "labour"];

/** Focuses that are about interiors on their own, without other context. */
const INTERIORS_ONLY_FOCUS: QuestionFocus[] = [
  "quantity",
  "labour",
  "rate",
  "brand",
  "colour",
  "trend",
];

type Context = {
  focus: Set<QuestionFocus>;
  /** Trades named in this message. */
  trades: InteriorTrade[];
  tier?: InteriorTier;
  scope?: InteriorScope;
  budget?: number;
  estimate?: InteriorEstimate;
  /** Set once a section has asked for the home size. */
  askedForSize: boolean;
};

function conversationDetails(texts: string[]) {
  let tier: InteriorTier | undefined;
  let scope: InteriorScope | undefined;
  let budget: number | undefined;
  let intent = false;
  for (const text of texts) {
    const s = parseInteriorsSignals(text);
    if (s.tier) tier = s.tier;
    if (s.scope) scope = s.scope;
    if (s.budget) budget = s.budget;
    if (s.intent) intent = true;
  }
  return { tier, scope, budget, intent };
}

/** The focus of the customer's most recent earlier question. */
function previousFocus(texts: string[]): Set<QuestionFocus> | null {
  for (let i = texts.length - 1; i >= 0; i--) {
    const focus = detectFocus(texts[i]);
    if (focus.size > 0) return focus;
  }
  return null;
}

function lcFirst(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function bullets(lines: string[]): string {
  return lines.map((line) => `• ${line}`).join("\n");
}

function tradeLabel(trade: InteriorTrade): string {
  return lcFirst(TRADES[trade].label);
}

/** Trades to talk about: the ones named, else the estimate's, else all. */
function tradesInScope(ctx: Context): InteriorTrade[] {
  if (ctx.trades.length) return ctx.trades;
  if (ctx.estimate) return ctx.estimate.lines.map((line) => line.trade);
  return TRADE_ORDER;
}

function sizeAsk(ctx: Context, purpose: string): string {
  ctx.askedForSize = true;
  const budget = ctx.budget
    ? ` and I'll check what fits in your ${formatLakh(ctx.budget)} budget`
    : "";
  return `To work out ${purpose} I need your home size — for example 2BHK or 1,100 sqft carpet area${budget}.`;
}

function range(values: number[], unit: string): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max
    ? `${formatINR(min)} per ${unit}`
    : `${formatINR(min)}–${formatINR(max)} per ${unit}`;
}

// ---- Sections ------------------------------------------------------------

function estimateSection(ctx: Context): string {
  const e = ctx.estimate;
  if (e) {
    return `${describeWork(e)} for ${homePhrase(e)} (~${formatNumber(e.carpetAreaSqft)} sqft carpet area) at ${e.tier} finishes comes to about ${formatLakh(e.grandTotal)} (≈ ${formatINR(e.perSqft)}/sqft) — ${formatLakh(e.materialTotal)} materials + ${formatLakh(e.labourTotal)} labour.`;
  }

  // No size yet: ask for it and give a reference figure for a typical 2BHK.
  const preset = PROPERTY_PRESETS["2bhk"];
  const sample = (tier: InteriorTier) =>
    estimateInteriors({
      propertyLabel: preset.label,
      carpetAreaSqft: preset.carpetAreaSqft,
      bedrooms: preset.bedrooms,
      bathrooms: preset.bathrooms,
      scope: ctx.scope ?? "full_interior",
      tier,
      trades: ctx.trades.length ? ctx.trades : undefined,
    });
  const what = lcFirst(describeWork(sample("premium")));
  const guide = ctx.tier
    ? `about ${formatLakh(sample(ctx.tier).grandTotal)} at ${ctx.tier} finishes`
    : `about ${TIERS.map((tier) => `${formatLakh(sample(tier).grandTotal)} (${tier})`).join(", ")}`;

  return `${sizeAsk(ctx, "the cost")} As a guide, ${what} for a typical 2BHK (~${formatNumber(preset.carpetAreaSqft)} sqft) costs ${guide}.`;
}

function budgetSection(ctx: Context): string | null {
  const e = ctx.estimate;
  if (e?.budgetAdvice) return e.budgetAdvice;
  if (e && !ctx.budget) {
    return "Share your budget and I'll tell you what fits within it.";
  }
  if (!e && !ctx.askedForSize) return sizeAsk(ctx, "what fits your budget");
  return null;
}

function quantityText(line: InteriorTradeLine): string {
  return line.quantities
    .map((q) => `${q.item}: ${formatNumber(q.quantity)} ${q.unit}`)
    .join("; ");
}

function quantitySection(ctx: Context): string | null {
  const e = ctx.estimate;
  if (!e) {
    if (ctx.askedForSize) return null;
    const what = ctx.trades.length
      ? `the ${joinWithAnd(ctx.trades.map(tradeLabel))} quantities`
      : "the material quantities";
    return sizeAsk(ctx, what);
  }

  const where = `${homePhrase(e)} (~${formatNumber(e.carpetAreaSqft)} sqft)`;
  if (e.lines.length === 1) {
    return `Material needed for ${lcFirst(describeWork(e))} of ${where}:\n${bullets(
      e.lines[0].quantities.map(
        (q) => `${q.item}: ${formatNumber(q.quantity)} ${q.unit}`
      )
    )}`;
  }
  return `Material needed for ${lcFirst(describeWork(e))} of ${where}:\n${bullets(
    e.lines.map((line) => `${line.label} — ${quantityText(line)}`)
  )}`;
}

function labourSection(ctx: Context): string {
  const e = ctx.estimate;
  if (e) {
    if (e.lines.length === 1) {
      const line = e.lines[0];
      return `Labour for ${lcFirst(line.label)} comes to about ${formatINR(line.labourCost)} (${formatINR(line.labourRate)} per ${line.rateUnit}).`;
    }
    return `Labour charges for ${homePhrase(e)} (${e.tier} finishes):\n${bullets(
      e.lines.map(
        (line) =>
          `${line.label}: ${formatINR(line.labourCost)} (${formatINR(line.labourRate)} per ${line.rateUnit})`
      )
    )}\nTotal labour: about ${formatLakh(e.labourTotal)}.`;
  }

  const trades = tradesInScope(ctx);
  const rateFor = (trade: InteriorTrade) => {
    const cfg = TRADES[trade];
    return ctx.tier
      ? `${formatINR(cfg.labourRate[ctx.tier])} per ${cfg.rateUnit}`
      : range(TIERS.map((tier) => cfg.labourRate[tier]), cfg.rateUnit);
  };
  const finish = ctx.tier ? `${ctx.tier} finishes` : "economy to luxury finishes";
  const body =
    trades.length === 1
      ? `Labour for ${tradeLabel(trades[0])} is ${rateFor(trades[0])} (${finish}).`
      : `Labour rates (${finish}):\n${bullets(
          trades.map((trade) => `${TRADES[trade].label}: ${rateFor(trade)}`)
        )}`;
  const ask = ctx.askedForSize
    ? ""
    : `\nShare your home size and I'll work out the total labour charges.`;
  ctx.askedForSize = true;
  return body + ask;
}

function rateSection(ctx: Context): string | null {
  const e = ctx.estimate;
  if (e && !ctx.trades.length) {
    return ctx.focus.has("estimate")
      ? null
      : `For ${homePhrase(e)} that works out to about ${formatINR(e.perSqft)} per sqft of carpet area (materials + labour).`;
  }

  const trades = tradesInScope(ctx);
  const rateFor = (trade: InteriorTrade) => {
    const cfg = TRADES[trade];
    if (ctx.tier) {
      const m = cfg.materialRate[ctx.tier];
      const l = cfg.labourRate[ctx.tier];
      return `material ${formatINR(m)} + labour ${formatINR(l)} = ${formatINR(m + l)} per ${cfg.rateUnit}`;
    }
    return `${range(
      TIERS.map((tier) => cfg.materialRate[tier] + cfg.labourRate[tier]),
      cfg.rateUnit
    )} for material + labour`;
  };
  const finish = ctx.tier ? `${ctx.tier} finishes` : "economy to luxury finishes";
  if (trades.length === 1) {
    return `${TRADES[trades[0]].label} costs ${rateFor(trades[0])} (${finish}).`;
  }
  return `Rates (${finish}):\n${bullets(
    trades.map((trade) => `${TRADES[trade].label}: ${rateFor(trade)}`)
  )}`;
}

function brandSection(ctx: Context): string {
  const trades = tradesInScope(ctx);

  if (!ctx.tier && trades.length <= 2) {
    return trades
      .map(
        (trade) =>
          `Best brands for ${tradeLabel(trade)}:\n${bullets(
            TIERS.map(
              (tier) => `${TIER_LABELS[tier]}: ${TRADES[trade].brands[tier].join(", ")}`
            )
          )}`
      )
      .join("\n\n");
  }

  const tier = ctx.tier ?? "premium";
  const more = ctx.tier
    ? ""
    : "\nAsk if you'd like economy or luxury options.";
  if (trades.length === 1) {
    return `For ${tradeLabel(trades[0])} at ${tier} finishes, go with ${joinWithAnd(TRADES[trades[0]].brands[tier])}.${more}`;
  }
  return `Recommended brands (${tier} finishes):\n${bullets(
    trades.map((trade) => `${TRADES[trade].label}: ${TRADES[trade].brands[tier].join(", ")}`)
  )}${more}`;
}

function guidanceSection(ctx: Context): string {
  const trades = tradesInScope(ctx);
  if (trades.length === 1) return TRADES[trades[0]].guidance;
  return `Material guidance:\n${bullets(
    trades.map((trade) => `${TRADES[trade].label}: ${TRADES[trade].guidance}`)
  )}`;
}

function colourSection(ctx: Context): string {
  const tier = ctx.tier ?? "premium";
  return `Colour combinations that work well:\n${bullets(COLOUR_COMBINATIONS[tier])}`;
}

function trendSection(): string {
  return `Current interior trends:\n${bullets(INTERIOR_TRENDS.slice(0, 5))}`;
}

// ---- Entry point ---------------------------------------------------------

/**
 * Returns a focused answer for interiors / renovation questions, or null when
 * the message is something else (repairs, other services, or a free-form
 * question the AI assistant should handle).
 */
export function answerInteriorsQuestion(
  content: string,
  priorUserTexts: string[]
): InteriorsAnswer | null {
  const text = content.toLowerCase();
  const signals = parseInteriorsSignals(content);
  if (OTHER_TOPIC_RE.test(text) && !signals.generalInterior) return null;

  const all = [...priorUserTexts, content];
  const details = conversationDetails(all);
  const trades = mentionedTrades(content);
  const asksCity = CITY_QUESTION_RE.test(text);
  let focus = detectFocus(content);
  // "Which city are these rates for?" asks about the city, not the rates.
  if (asksCity) focus.delete("rate");

  if (focus.size === 0) {
    if (asksCity && details.intent) {
      return { reply: `These figures are based on ${MARKET_LABEL}.` };
    }
    // A bare detail ("2bhk", "budget 10 lakh", "make it luxury") completes
    // the customer's earlier interiors question.
    if (isQuestion(content) || !signals.hasSignal || !details.intent) {
      return null;
    }
    focus = previousFocus(priorUserTexts) ?? new Set(["estimate"]);
  } else {
    const interiorsContext =
      signals.intent ||
      signals.hasSignal ||
      trades.length > 0 ||
      details.intent ||
      hasAny(focus, INTERIORS_ONLY_FOCUS);
    if (!interiorsContext) return null;
  }

  const input = hasAny(focus, CARD_FOCUS) ? resolveEstimateInput(all) : null;

  const ctx: Context = {
    focus,
    trades,
    tier: details.tier,
    scope: details.scope,
    budget: details.budget,
    estimate: input ? estimateInteriors(input) : undefined,
    askedForSize: false,
  };

  const sections: string[] = [];
  const showEstimate = focus.has("estimate") || focus.has("budget");

  for (const f of FOCUS_ORDER) {
    if (!focus.has(f)) continue;
    let section: string | null = null;
    switch (f) {
      case "estimate":
        section = estimateSection(ctx);
        break;
      case "budget":
        // The budget answer needs the total next to it.
        if (!focus.has("estimate") && showEstimate && ctx.estimate) {
          sections.push(estimateSection(ctx));
        }
        section = budgetSection(ctx);
        break;
      case "quantity":
        section = quantitySection(ctx);
        break;
      case "labour":
        section = labourSection(ctx);
        break;
      case "rate":
        section = rateSection(ctx);
        break;
      case "brand":
        section = brandSection(ctx);
        break;
      case "guidance":
        section = guidanceSection(ctx);
        break;
      case "colour":
        section = colourSection(ctx);
        break;
      case "trend":
        section = trendSection();
        break;
    }
    if (section) sections.push(section);
  }

  if (asksCity) sections.push(`These figures are based on ${MARKET_LABEL}.`);

  return {
    reply: sections.join("\n\n"),
    estimate: ctx.estimate,
  };
}
