import type { InteriorScope, InteriorTier } from "@/types/interiors";

/** ₹1,23,456 (Indian digit grouping). */
export function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

/** Compact rupees: ₹13.6 L, ₹1.25 Cr, or ₹78,300 below a lakh. */
export function formatLakh(value: number): string {
  // Number(...) drops trailing zeros: 10.0 → 10, 1.20 → 1.2.
  if (value >= 1e7) return `₹${Number((value / 1e7).toFixed(2))} Cr`;
  if (value >= 1e5) return `₹${Number((value / 1e5).toFixed(1))} L`;
  return formatINR(value);
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-IN");
}

export const TIER_LABELS: Record<InteriorTier, string> = {
  economy: "Economy",
  premium: "Premium",
  luxury: "Luxury",
};

export const SCOPE_LABELS: Record<InteriorScope, string> = {
  full_interior: "Full interiors",
  renovation: "Renovation",
};
