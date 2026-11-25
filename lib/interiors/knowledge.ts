import type { InteriorScope, InteriorTier } from "@/types/interiors";
import {
  COLOUR_COMBINATIONS,
  INTERIOR_TRENDS,
  PROPERTY_PRESETS,
  TRADE_ORDER,
  TRADES,
} from "@/lib/interiors/config";
import { estimateInteriors } from "@/lib/interiors/estimator";
import {
  formatINR,
  formatLakh,
  SCOPE_LABELS,
  TIER_LABELS,
} from "@/lib/interiors/format";

const TIERS: InteriorTier[] = ["economy", "premium", "luxury"];
const SCOPES: InteriorScope[] = ["full_interior", "renovation"];
const SAMPLE_HOMES = ["1bhk", "2bhk", "3bhk"] as const;

function sampleTotal(presetKey: string, tier: InteriorTier, scope: InteriorScope) {
  const preset = PROPERTY_PRESETS[presetKey];
  return estimateInteriors({
    propertyLabel: preset.label,
    carpetAreaSqft: preset.carpetAreaSqft,
    bedrooms: preset.bedrooms,
    bathrooms: preset.bathrooms,
    scope,
    tier,
  });
}

/**
 * Reference block for the chat prompt, generated from the same config and
 * estimator as the estimate card, so the assistant's figures always match it.
 */
export function buildInteriorsKnowledge(): string {
  const packages = SCOPES.flatMap((scope) =>
    SAMPLE_HOMES.map((key) => {
      const preset = PROPERTY_PRESETS[key];
      const totals = TIERS.map((tier) => {
        const e = sampleTotal(key, tier, scope);
        return `${TIER_LABELS[tier].toLowerCase()} ${formatLakh(e.grandTotal)} (≈ ${formatINR(e.perSqft)}/sqft)`;
      }).join(", ");
      return `- ${SCOPE_LABELS[scope]}, ${preset.label} (~${preset.carpetAreaSqft} sqft carpet): ${totals}`;
    })
  );

  const trades = TRADE_ORDER.map((trade) => {
    const cfg = TRADES[trade];
    const rates = TIERS.map(
      (tier) =>
        `${TIER_LABELS[tier].toLowerCase()} material ${formatINR(cfg.materialRate[tier])} + labour ${formatINR(cfg.labourRate[tier])}`
    ).join("; ");
    const brands = TIERS.map(
      (tier) => `${TIER_LABELS[tier].toLowerCase()}: ${cfg.brands[tier].join(", ")}`
    ).join(" | ");
    return `- ${cfg.label}, per ${cfg.rateUnit}: ${rates}. Brands — ${brands}. Guidance: ${cfg.guidance}`;
  });

  return [
    "Typical totals (materials + labour):",
    ...packages,
    "",
    "Rates by trade (material + labour, in the unit contractors quote):",
    ...trades,
    "",
    "Colour combinations:",
    ...TIERS.map(
      (tier) => `- ${TIER_LABELS[tier]}: ${COLOUR_COMBINATIONS[tier].join("; ")}`
    ),
    "",
    "Current interior trends:",
    ...INTERIOR_TRENDS.map((trend) => `- ${trend}`),
  ].join("\n");
}
