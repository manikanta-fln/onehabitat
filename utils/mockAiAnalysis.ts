import type { AIRecommendation } from "@/types/upload-issue";
import { formatInrRange } from "@/utils/currency";

/**
 * Estimated costs for metro/urban India (visit + labour + basic materials).
 * Ranges reflect typical Onehabitat home service pricing, not luxury quotes.
 */
const MOCK_RECOMMENDATIONS: AIRecommendation[] = [
  {
    detectedIssue: "Wall moisture & paint peeling",
    category: "Wall & Ceiling",
    severity: "medium",
    summary:
      "Signs of moisture ingress behind the surface. Early treatment can prevent structural damage and mold growth—common in monsoon-heavy regions across India.",
    solutions: [
      "Dampness check with moisture meter and sealant treatment",
      "Putty, anti-fungal primer, and emulsion repainting (Asian Paints / Berger grade)",
      "1-year workmanship warranty on treated patch",
    ],
    estimatedCost: formatInrRange(4500, 14500),
    estimatedDuration: "1–2 days",
  },
  {
    detectedIssue: "Plumbing leak near fixture",
    category: "Plumbing",
    severity: "high",
    summary:
      "Visible water staining suggests an active or recent leak. Prompt repair is recommended to avoid ceiling damage and higher repair bills during rains.",
    solutions: [
      "Leak tracing and CPVC / GI pipe or joint repair",
      "Tap, angle cock, or waste coupling reseal / replacement if needed",
      "Pressure check and cleanup included",
    ],
    estimatedCost: formatInrRange(650, 4200),
    estimatedDuration: "Same day",
  },
  {
    detectedIssue: "Electrical outlet discoloration",
    category: "Electrical",
    severity: "high",
    summary:
      "Heat marks or discoloration may indicate loose wiring or overload—often seen with high load during summer AC use. A licensed electrician should inspect this soon.",
    solutions: [
      "Socket, plate, and internal wiring safety inspection",
      "Replacement with ISI-marked modular accessories (Havells / Legrand class)",
      "MCB / load check and basic earthing verification",
    ],
    estimatedCost: formatInrRange(550, 2800),
    estimatedDuration: "2–4 hours",
  },
  {
    detectedIssue: "Tile grout deterioration",
    category: "Carpentry & Finishing",
    severity: "low",
    summary:
      "Worn grout in kitchen or bathroom allows seepage. Resealing is cost-effective before tiles need full replacement.",
    solutions: [
      "Grout removal and anti-fungal wash in affected zones",
      "Waterproof grout / epoxy fill and silicone seal at corners",
      "Final polish and 48-hour curing guidance",
    ],
    estimatedCost: formatInrRange(1200, 5500),
    estimatedDuration: "Half day",
  },
  {
    detectedIssue: "AC drain line blockage",
    category: "HVAC & Appliances",
    severity: "medium",
    summary:
      "Water dripping from indoor unit often points to a clogged drain pipe—very common before and during Indian summers.",
    solutions: [
      "Drain pipe flush and vacuum suction",
      "Filter cleaning and cooling coil wash (if required)",
      "Gas pressure check only if cooling is weak (extra if top-up needed)",
    ],
    estimatedCost: formatInrRange(499, 1899),
    estimatedDuration: "1–2 hours",
  },
  {
    detectedIssue: "Wooden door hinge / alignment issue",
    category: "Carpentry",
    severity: "low",
    summary:
      "Dragging doors or gaps affect privacy and AC efficiency. Adjustment is usually quicker than a full frame rework.",
    solutions: [
      "Hinge reset, shimming, and latch alignment",
      "Minor sanding and touch-up polish if needed",
      "Hardware tightening or replacement (hinges extra if rusted)",
    ],
    estimatedCost: formatInrRange(400, 1800),
    estimatedDuration: "1–3 hours",
  },
];

export function mockAnalyzeIssue(): Promise<AIRecommendation> {
  return new Promise((resolve) => {
    const delay = 1800 + Math.random() * 1200;
    setTimeout(() => {
      const index = Math.floor(Math.random() * MOCK_RECOMMENDATIONS.length);
      resolve(MOCK_RECOMMENDATIONS[index]!);
    }, delay);
  });
}
