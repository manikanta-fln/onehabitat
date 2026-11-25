import type { InteriorTrade } from "@/types/interiors";
import { TRADE_PATTERNS } from "@/lib/interiors/intent";

/**
 * What the customer is actually asking about, so the reply answers that and
 * nothing else. A message can have several focuses ("plywood quantity and
 * labour charges").
 */
export type QuestionFocus =
  | "estimate"
  | "budget"
  | "quantity"
  | "labour"
  | "rate"
  | "brand"
  | "guidance"
  | "colour"
  | "trend";

/** Order the answer sections appear in. */
export const FOCUS_ORDER: QuestionFocus[] = [
  "estimate",
  "budget",
  "quantity",
  "labour",
  "rate",
  "brand",
  "guidance",
  "colour",
  "trend",
];

const MATERIAL_NOUNS =
  "plywood|ply|paint|tiles?|wires?|putty|primer|laminates?|materials?|adhesive|pipes?";

// "kavali" means both "want" and "need", so it only counts next to a material.
const MATERIAL_UNITS = `${MATERIAL_NOUNS}|sheets|litres|liters|boxes|bags|coils|points`;
const QUANTITY_RE = new RegExp(
  `(quantity|\\bqty\\b|qnty|qnta|consum|(how many|number of|no\\.? of) [a-z ]{0,15}(${MATERIAL_UNITS})|how much (${MATERIAL_NOUNS})|(${MATERIAL_UNITS})[a-z ]{0,20}(kavali|kaavali)|entha kavali|materials? (list|needed|required))`
);

const LABOUR_RE = /(labou?r|workmanship|kuli|coolie)/;
/** Phrases like "labour charges" are about labour, not the total cost. */
const LABOUR_PHRASE_RE = /labou?r\s*(charges?|costs?|rates?|price|amount)/g;

const ESTIMATE_RE =
  /(cost|price|charges?|estimat|quote|quotation|expense|total|kharchu|karchu|kharch|how much (will|would|does|is|for|it|do)|entha (avth|avut|padu|ayy)|avthundi|avutundi)/;
const ENTHA_RE = /\b(entha|enta)\b/;

const RATE_RE = /(\brates?\b|per sq|per square|per point|sqft rate|square feet rate)/;

const BRAND_RE = new RegExp(
  `(brands?|compan(y|ies)|which make|(best|good|top) (${MATERIAL_NOUNS}|switch(es)?|taps?|fittings|sanitary)|(which|what) [a-z ]{0,25}(is|are) (the )?(best|good|better))`
);

// "which plywood brand" is a brand question, not a material one.
const GUIDANCE_RE = new RegExp(
  `((which|what) (type|kind|grade|quality) |which (${MATERIAL_NOUNS}) (?!brands?|compan)|difference between|\\bvs\\.?\\b|versus|which is better|suitable|good for|material guidance|waterproof|moisture|\\bbwp\\b|\\bbwr\\b|mr grade|\\b710\\b|\\bgvt\\b|cpvc|frls)`
);

const COLOUR_RE = /(colou?rs?|shades?|palette|combination|rangu|rangulu)/;
const TREND_RE =
  /(trend|trending|latest|modern|in fashion|new style|popular design|current style|design ideas)/;
const BUDGET_RE =
  /(budget(?![- ]?friendly)|afford|enough|sufficient|possible (in|with|within)|within \d|in \d+(\.\d+)? ?(lakh|lakhs|lacs?|l\b|k\b))/;

/**
 * Topics that belong to repairs or other services, so they go to the repair
 * flow and the general assistant instead of the interiors answers.
 */
export const OTHER_TOPIC_RE =
  /(pest|termite|cockroach|rodent|\brats?\b|mosquito|bed ?bugs?|inspection|handover|snag|possession|leak|seep|damp|repair|\bfix|broken|damage|crack|peel|not working|short circuit|tripping|blocked|clog|spark|shock)/;

const QUESTION_RE =
  /(\?|^\s*(what|which|why|how|is|are|can|could|does|do|should|will|when|where|who|tell|suggest|give|share|show|explain|list)\b|\b(entha|enta|enti|ela|emi|enduku|cheppandi|cheppu|cheppara)\b)/;

/** Customer asked where the rates come from. */
export const CITY_QUESTION_RE =
  /(\bcity\b|\bcities\b|which (place|location|area|region|market)|what (place|location|area|region|market)|rates? (based|from) (on|in)|where (are|is) (these|this|the) rates?)/;

/** Telugu written in English letters. */
export const TELUGU_STYLE_RE =
  /\b(entha|enta|kavali|kaavali|cheppandi|cheppu|cheppara|undi|unnayi|avthundi|avutundi|kuda|kooda|naaku|naku|maa|mee|meeru|chesthe|cheyali|cheyyali|ela|enti|emi|ledu|kosam|lo|ki|ayithe|vundi)\b/;

export function detectFocus(message: string): Set<QuestionFocus> {
  const text = message.toLowerCase();
  const focus = new Set<QuestionFocus>();

  const quantity = QUANTITY_RE.test(text);
  const labour = LABOUR_RE.test(text);
  const withoutLabour = text.replace(LABOUR_PHRASE_RE, "labour");

  if (quantity) focus.add("quantity");
  if (labour) focus.add("labour");
  if (
    ESTIMATE_RE.test(withoutLabour) ||
    (ENTHA_RE.test(text) && !quantity && !labour)
  ) {
    focus.add("estimate");
  }
  if (RATE_RE.test(withoutLabour) && !labour) focus.add("rate");
  if (BUDGET_RE.test(text)) focus.add("budget");
  if (BRAND_RE.test(text)) focus.add("brand");
  if (GUIDANCE_RE.test(text)) focus.add("guidance");
  if (COLOUR_RE.test(text)) focus.add("colour");
  if (TREND_RE.test(text)) focus.add("trend");

  return focus;
}

export function isQuestion(message: string): boolean {
  return QUESTION_RE.test(message.toLowerCase());
}

/** Trades named in the message, in the standard order. */
export function mentionedTrades(message: string): InteriorTrade[] {
  const text = message.toLowerCase();
  return TRADE_PATTERNS.filter(([, re]) => re.test(text)).map(([trade]) => trade);
}

export function hasAny(
  focus: Set<QuestionFocus>,
  values: QuestionFocus[]
): boolean {
  return values.some((value) => focus.has(value));
}
