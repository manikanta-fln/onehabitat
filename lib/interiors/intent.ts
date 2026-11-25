import type {
  InteriorEstimateInput,
  InteriorScope,
  InteriorTier,
  InteriorTrade,
} from "@/types/interiors";
import { PROPERTY_PRESETS } from "@/lib/interiors/config";

/**
 * Deterministic detection of interiors / renovation estimate requests.
 *
 * Understands English plus common Telugu-in-English words ("entha", "qnta",
 * "kharchu") and spellings like "rennovation".
 */

const GENERAL_INTERIOR_RE =
  /\b(interiors?|interior design\w*|renn?ovat\w*|remodel\w*|refurbish\w*|furnish\w*|modular|woodwork|false ceiling|makeover)\b/;

const COST_RE =
  /(cost|price|rate|charge|estimat|budget|quote|quotation|how much|how many|quantity|\bqty\b|qnty|qnta|kavali|kaavali|needed|required|sheets|litres|material|labou?r|per sq|consum|entha|enta|kharchu|karchu|kharch)/;

/** Repairs go to the diagnostic flow, not the interiors estimator. */
const REPAIR_RE =
  /(leak|repair|fix|broken|damage|crack|seep|peel|short circuit|not working|tripping|blocked|clog)/;

export const TRADE_PATTERNS: Array<[InteriorTrade, RegExp]> = [
  ["carpentry", /(carpent|plywood|\bply\b|wardrobe|cupboard|modular kitchen|kitchen cabinet|woodwork|laminate)/],
  ["electrical", /(electric|wiring|rewiring|\bwires?\b|switch)/],
  ["plumbing", /(plumbing|cp fittings?|sanitary|bathroom fittings|\btaps?\b|cpvc|upvc)/],
  ["tiling", /(\btiles?\b|tiling|ceramic|flooring|vitrified)/],
  ["painting", /(painting|\bpaint\b|paint work|repaint|emulsion|putty)/],
];

const RENOVATION_RE =
  /(renn?ovat|remodel|refurbish|\bredo\b|re-do|old (flat|house|home|apartment))/;
const FULL_INTERIOR_RE =
  /(interiors?|furnish|new (flat|house|home|apartment)|modular|full interior)/;

const LUXURY_RE =
  /(luxury|luxurious|high[- ]end|lavish|premium plus|top[- ]end|best quality)/;
const ECONOMY_RE =
  /(economy|economical|basic|budget[- ]friendly|low[- ]budget|low cost|cheap|affordable|minimal)/;
const PREMIUM_RE = /(premium|mid[- ]range|medium|standard|good quality)/;

type SizeSignal =
  | { kind: "bhk"; bedrooms: number }
  | { kind: "villa" };

export type InteriorsSignals = {
  /** This message asks for an interiors / renovation estimate. */
  intent: boolean;
  /** This message contributes anything the estimator can use. */
  hasSignal: boolean;
  generalInterior: boolean;
  size?: SizeSignal;
  sqft?: number;
  scope?: InteriorScope;
  tier?: InteriorTier;
  budget?: number;
  trades: InteriorTrade[];
};

function parseNumber(raw: string): number {
  return Number(raw.replace(/,/g, ""));
}

function parseSqft(text: string): number | undefined {
  const match = text.match(
    /(\d{1,2},\d{3}|\d{3,5})\s*(?:sq\.?\s*ft|sqft|sq\.?\s*feet|square\s*f(?:ee|oo)t|sft|sq\b)/
  );
  if (!match) return undefined;
  const value = parseNumber(match[1]);
  return value >= 200 && value <= 20000 ? value : undefined;
}

function parseSize(text: string): SizeSignal | undefined {
  const bhk = text.match(/(\d)\s*-?\s*bhk/);
  if (bhk) {
    const bedrooms = Number(bhk[1]);
    if (bedrooms >= 1 && bedrooms <= 9) return { kind: "bhk", bedrooms };
  }
  if (/(villa|independent house|duplex|bungalow)/.test(text)) {
    return { kind: "villa" };
  }
  return undefined;
}

function parseBudget(text: string): number | undefined {
  const crore = text.match(/(\d+(?:\.\d+)?)\s*(?:crores?|cr)\b/);
  if (crore) return Number(crore[1]) * 1e7;

  const lakh = text.match(/(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l)\b/);
  if (lakh) return Number(lakh[1]) * 1e5;

  const rupees = text.match(
    /(?:₹|\brs\.?|\binr|budget)\s*(?:is|of|:|around|approx\.?|upto|up to)?\s*(\d[\d,]{3,})/
  );
  if (rupees) {
    const value = parseNumber(rupees[1]);
    if (value >= 10000) return value;
  }

  const thousands = text.match(/(\d+(?:\.\d+)?)\s*k\b/);
  if (thousands && /(budget|₹|\brs\b)/.test(text)) {
    return Number(thousands[1]) * 1e3;
  }

  return undefined;
}

function parseTier(text: string): InteriorTier | undefined {
  if (LUXURY_RE.test(text)) return "luxury";
  if (ECONOMY_RE.test(text)) return "economy";
  if (PREMIUM_RE.test(text)) return "premium";
  return undefined;
}

function parseScope(text: string): InteriorScope | undefined {
  if (RENOVATION_RE.test(text)) return "renovation";
  if (FULL_INTERIOR_RE.test(text)) return "full_interior";
  return undefined;
}

export function parseInteriorsSignals(message: string): InteriorsSignals {
  const text = message.toLowerCase();

  const generalInterior = GENERAL_INTERIOR_RE.test(text);
  const trades = TRADE_PATTERNS.filter(([, re]) => re.test(text)).map(
    ([trade]) => trade
  );
  const tradeCostQuestion =
    trades.length > 0 && COST_RE.test(text) && !REPAIR_RE.test(text);

  const size = parseSize(text);
  const sqft = parseSqft(text);
  const scope = parseScope(text);
  const tier = parseTier(text);
  const budget = parseBudget(text);

  const intent = generalInterior || tradeCostQuestion;

  return {
    intent,
    hasSignal:
      intent ||
      !!size ||
      !!sqft ||
      !!scope ||
      !!tier ||
      !!budget ||
      tradeCostQuestion,
    generalInterior,
    size,
    sqft,
    scope,
    tier,
    budget,
    trades: tradeCostQuestion || generalInterior ? trades : [],
  };
}

function presetForSize(size: SizeSignal) {
  if (size.kind === "villa") return PROPERTY_PRESETS.villa;
  const preset = PROPERTY_PRESETS[`${size.bedrooms}bhk`];
  if (preset) return preset;
  return {
    label: `${size.bedrooms}BHK`,
    carpetAreaSqft: 1700 + (size.bedrooms - 4) * 450,
    bedrooms: size.bedrooms,
    bathrooms: size.bedrooms,
  };
}

/**
 * Builds estimator input from the customer's messages (oldest first). Later
 * messages override earlier ones, so customers can refine size, budget or tier.
 * Returns null until there is an interiors request and a home size.
 */
export function resolveEstimateInput(
  userMessages: string[]
): InteriorEstimateInput | null {
  let intent = false;
  let size: SizeSignal | undefined;
  let sqft: number | undefined;
  let scope: InteriorScope | undefined;
  let tier: InteriorTier | undefined;
  let budget: number | undefined;
  let trades: InteriorTrade[] | undefined;

  for (const message of userMessages) {
    const s = parseInteriorsSignals(message);
    if (s.intent) intent = true;
    if (s.size) {
      size = s.size;
      // A new BHK without an area replaces any earlier area.
      sqft = s.sqft;
    } else if (s.sqft) {
      sqft = s.sqft;
    }
    if (s.scope) scope = s.scope;
    if (s.tier) tier = s.tier;
    if (s.budget) budget = s.budget;
    if (s.trades.length) trades = s.trades;
    else if (s.generalInterior) trades = undefined;
  }

  if (!intent || (!size && !sqft)) return null;

  const preset = size ? presetForSize(size) : null;
  const carpetAreaSqft = sqft ?? preset!.carpetAreaSqft;
  const bedrooms =
    preset?.bedrooms ?? Math.min(5, Math.max(1, Math.round(carpetAreaSqft / 450)));
  const bathrooms = preset?.bathrooms ?? bedrooms;

  return {
    propertyLabel: preset?.label ?? "Home",
    carpetAreaSqft,
    bedrooms,
    bathrooms,
    scope: scope ?? "full_interior",
    tier: tier ?? "premium",
    budget,
    trades,
    areaAssumed: !sqft,
    tierAssumed: !tier,
  };
}
