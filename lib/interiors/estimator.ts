import type {
  BudgetFit,
  InteriorEstimate,
  InteriorEstimateInput,
  InteriorTier,
  InteriorTrade,
  InteriorTradeLine,
  MaterialQuantity,
} from "@/types/interiors";
import {
  CONSUMPTION,
  ESSENTIAL_TRADES,
  ESTIMATE_DISCLAIMER,
  SLIGHTLY_OVER_BUDGET_RATIO,
  TRADE_ORDER,
  TRADES,
} from "@/lib/interiors/config";
import {
  formatINR,
  formatLakh,
  formatNumber,
  SCOPE_LABELS,
  TIER_LABELS,
} from "@/lib/interiors/format";

const TIER_ORDER: InteriorTier[] = ["economy", "premium", "luxury"];

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * Work quantity in the trade's rate unit: woodwork unit area, points,
 * tiled area, or wall + ceiling area.
 */
function workQuantity(
  trade: InteriorTrade,
  input: InteriorEstimateInput,
  factor: number
): number {
  const area = input.carpetAreaSqft;
  const c = CONSUMPTION;

  switch (trade) {
    case "carpentry":
      return Math.max(10, roundTo(area * c.carpentryUnitAreaFactor * factor, 5));
    case "electrical":
      return Math.max(1, Math.round((area / c.sqftPerElectricalPoint) * factor));
    case "plumbing":
      return Math.max(
        1,
        Math.round(
          (input.bathrooms * c.plumbingPointsPerBathroom +
            c.plumbingPointsKitchenAndUtility) *
            factor
        )
      );
    case "tiling":
      return Math.max(10, roundTo(area * c.tileAreaFactor * factor, 10));
    case "painting":
      return Math.max(10, roundTo(area * c.paintAreaFactor * factor, 10));
  }
}

function materialQuantities(
  trade: InteriorTrade,
  work: number,
  input: InteriorEstimateInput
): MaterialQuantity[] {
  const c = CONSUMPTION;

  switch (trade) {
    case "carpentry":
      return [
        {
          item: "Plywood (8×4 ft)",
          quantity: Math.ceil(work * c.plywoodSheetsPerUnitSqft),
          unit: "sheets",
        },
        {
          item: "Decorative laminate (8×4 ft)",
          quantity: Math.ceil((work * c.laminateSqftPerUnitSqft) / c.sqftPerSheet),
          unit: "sheets",
        },
      ];
    case "electrical": {
      const wire = Math.max(10, roundTo(work * c.wireMetresPerPoint, 10));
      return [
        { item: "Copper wire", quantity: wire, unit: "m" },
        {
          item: "Wire coils (90 m)",
          quantity: Math.ceil(wire / c.metresPerWireCoil),
          unit: "coils",
        },
      ];
    }
    case "plumbing":
      return [
        {
          item: "CPVC / UPVC pipes",
          quantity: work * c.pipeMetresPerPlumbingPoint,
          unit: "m",
        },
      ];
    case "tiling": {
      const tiles = Math.ceil(work * (1 + c.tileWastage));
      return [
        { item: "Tiles incl. 8% wastage", quantity: tiles, unit: "sqft" },
        {
          item: "Tile boxes (600×600 mm)",
          quantity: Math.ceil(tiles / c.sqftPerTileBox),
          unit: "boxes",
        },
        {
          item: "Tile adhesive (20 kg)",
          quantity: Math.ceil(work / c.sqftPerAdhesiveBag),
          unit: "bags",
        },
      ];
    }
    case "painting": {
      // Repaints usually need putty only for touch-ups.
      const puttyFactor = input.scope === "renovation" ? 0.3 : 1;
      return [
        {
          item: "Emulsion paint",
          quantity: Math.ceil((work * c.paintCoats) / c.paintCoveragePerLitre),
          unit: "litres",
        },
        {
          item: "Primer",
          quantity: Math.ceil(work / c.primerCoveragePerLitre),
          unit: "litres",
        },
        {
          item: "Wall putty",
          quantity: Math.max(5, roundTo((work / c.puttyCoveragePerKg) * puttyFactor, 5)),
          unit: "kg",
        },
      ];
    }
  }
}

function buildLine(
  trade: InteriorTrade,
  input: InteriorEstimateInput
): InteriorTradeLine {
  const cfg = TRADES[trade];
  // A trade the customer asked about by name is estimated for the whole home.
  const factor = input.trades?.length ? 1 : cfg.scopeFactor[input.scope];
  const work = workQuantity(trade, input, factor);
  const materialRate = cfg.materialRate[input.tier];
  const labourRate = cfg.labourRate[input.tier];
  const materialCost = roundTo(materialRate * work, 100);
  const labourCost = roundTo(labourRate * work, 100);

  return {
    trade,
    label: cfg.label,
    icon: cfg.icon,
    quantities: [
      { item: cfg.workLabel, quantity: work, unit: cfg.workUnit },
      ...materialQuantities(trade, work, input),
    ],
    materialCost,
    labourCost,
    total: materialCost + labourCost,
    materialRate,
    labourRate,
    rateUnit: cfg.rateUnit,
    brands: cfg.brands[input.tier],
    guidance: cfg.guidance,
  };
}

function selectedTrades(input: InteriorEstimateInput): InteriorTrade[] {
  if (!input.trades?.length) return TRADE_ORDER;
  return TRADE_ORDER.filter((trade) => input.trades?.includes(trade));
}

/** Grand total for an input, without building the full estimate. */
function totalFor(input: InteriorEstimateInput): number {
  return selectedTrades(input).reduce(
    (sum, trade) => sum + buildLine(trade, input).total,
    0
  );
}

function assessBudget(
  input: InteriorEstimateInput,
  grandTotal: number
): { budgetFit?: BudgetFit; budgetAdvice?: string } {
  const budget = input.budget;
  if (!budget || budget <= 0) return {};

  const tierIndex = TIER_ORDER.indexOf(input.tier);

  if (grandTotal <= budget) {
    const higher = TIER_ORDER[tierIndex + 1];
    if (higher) {
      const higherTotal = totalFor({ ...input, tier: higher });
      if (higherTotal <= budget) {
        return {
          budgetFit: "within",
          budgetAdvice: `Your budget of ${formatLakh(budget)} also covers ${TIER_LABELS[higher].toLowerCase()} finishes (about ${formatLakh(higherTotal)}) — worth it for the kitchen, wardrobes and bathrooms.`,
        };
      }
    }
    return {
      budgetFit: "within",
      budgetAdvice: `This fits your budget of ${formatLakh(budget)} with about ${formatLakh(budget - grandTotal)} to spare — keep around 10% as a contingency for site changes.`,
    };
  }

  const budgetFit: BudgetFit =
    grandTotal <= budget * (1 + SLIGHTLY_OVER_BUDGET_RATIO)
      ? "slightly_over"
      : "over";

  // 1. Would a lower finish level fit?
  for (let i = tierIndex - 1; i >= 0; i--) {
    const lower = TIER_ORDER[i];
    const lowerTotal = totalFor({ ...input, tier: lower });
    if (lowerTotal <= budget) {
      return {
        budgetFit,
        budgetAdvice: `To stay within ${formatLakh(budget)}, choose ${TIER_LABELS[lower].toLowerCase()} finishes (about ${formatLakh(lowerTotal)}), and keep ${TIER_LABELS[input.tier].toLowerCase()} materials only where they show — kitchen shutters and bathroom fittings.`,
      };
    }
  }

  // 2. Do the essentials now and carpentry later.
  const trades = selectedTrades(input);
  const essentials = trades.filter((trade) => ESSENTIAL_TRADES.includes(trade));
  if (trades.includes("carpentry") && essentials.length > 0) {
    // Sum the same lines at economy tier, keeping this estimate's scope.
    const economyInput = { ...input, tier: "economy" as const };
    const essentialsTotal = essentials.reduce(
      (sum, trade) => sum + buildLine(trade, economyInput).total,
      0
    );
    if (essentialsTotal <= budget) {
      return {
        budgetFit,
        budgetAdvice: `Even economy finishes go above ${formatLakh(budget)}. Do electricals, plumbing, tiles and painting first (about ${formatLakh(essentialsTotal)}) and add carpentry in a second phase.`,
      };
    }
  }

  // 3. Work room by room.
  const economyPerSqft =
    totalFor({ ...input, tier: "economy" }) / input.carpetAreaSqft;
  const coverableSqft = Math.floor(budget / economyPerSqft / 10) * 10;
  return {
    budgetFit,
    budgetAdvice: `${formatLakh(budget)} covers roughly ${formatNumber(coverableSqft)} sqft at economy finishes. Consider doing it room by room, starting with the kitchen and bathrooms.`,
  };
}

export function estimateInteriors(input: InteriorEstimateInput): InteriorEstimate {
  const lines = selectedTrades(input).map((trade) => buildLine(trade, input));
  const materialTotal = lines.reduce((sum, line) => sum + line.materialCost, 0);
  const labourTotal = lines.reduce((sum, line) => sum + line.labourCost, 0);
  const grandTotal = materialTotal + labourTotal;

  const assumptions: string[] = [];
  if (input.areaAssumed) {
    assumptions.push(
      `Carpet area assumed at about ${formatNumber(input.carpetAreaSqft)} sqft for a ${input.propertyLabel} — share the exact sqft for a closer estimate.`
    );
  }
  if (!input.areaAssumed) {
    assumptions.push(
      `${formatNumber(input.carpetAreaSqft)} sqft is treated as carpet area. If it's the super built-up area, the carpet area is usually about 25% less.`
    );
  }
  if (input.tierAssumed) {
    assumptions.push(
      `${TIER_LABELS[input.tier]} finishes assumed — ask for economy or luxury to compare.`
    );
  }
  if (input.scope === "full_interior" && !input.trades?.length) {
    assumptions.push(
      "New-flat interiors assume the builder's flooring, wiring and bathrooms stay — it covers woodwork, painting, kitchen/balcony tiles and extra electrical and plumbing points."
    );
  }

  return {
    propertyLabel: input.propertyLabel,
    carpetAreaSqft: input.carpetAreaSqft,
    scope: input.scope,
    tier: input.tier,
    lines,
    materialTotal,
    labourTotal,
    grandTotal,
    perSqft: Math.round(grandTotal / input.carpetAreaSqft),
    budget: input.budget,
    ...assessBudget(input, grandTotal),
    assumptions,
    disclaimer: ESTIMATE_DISCLAIMER,
  };
}

/** "Full interiors", "Painting", or "Electricals and tiles & ceramic (renovation)". */
export function describeWork(estimate: InteriorEstimate): string {
  if (estimate.lines.length === TRADE_ORDER.length) {
    return SCOPE_LABELS[estimate.scope];
  }
  const labels = estimate.lines.map((line, i) =>
    i === 0 ? line.label : line.label.toLowerCase()
  );
  const joined =
    labels.length > 1
      ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
      : labels[0];
  return estimate.scope === "renovation" ? `${joined} (renovation)` : joined;
}

/** "your 2BHK" / "your home". */
export function homePhrase(estimate: InteriorEstimate): string {
  return estimate.propertyLabel === "Home"
    ? "your home"
    : `your ${estimate.propertyLabel}`;
}

/**
 * Plain-text breakdown stored in the transcript. It lets the admin console show
 * the full estimate and lets the assistant answer follow-up questions about it.
 */
export function estimateToText(estimate: InteriorEstimate): string {
  const header = `[Interior estimate] ${estimate.propertyLabel}, ${formatNumber(estimate.carpetAreaSqft)} sqft, ${SCOPE_LABELS[estimate.scope]}, ${TIER_LABELS[estimate.tier]} finishes`;

  const lines = estimate.lines.map((line) => {
    const qty = line.quantities
      .map((q) => `${q.item} ${formatNumber(q.quantity)} ${q.unit}`)
      .join(", ");
    return `- ${line.label}: ${formatINR(line.total)} (materials ${formatINR(line.materialCost)} @ ${formatINR(line.materialRate)}/${line.rateUnit}, labour ${formatINR(line.labourCost)} @ ${formatINR(line.labourRate)}/${line.rateUnit}). Qty: ${qty}. Brands: ${line.brands.join(", ")}.`;
  });

  const footer = [
    `Total: ${formatINR(estimate.grandTotal)} (≈ ${formatINR(estimate.perSqft)}/sqft; materials ${formatINR(estimate.materialTotal)}, labour ${formatINR(estimate.labourTotal)}).`,
  ];
  if (estimate.budget) {
    footer.push(`Budget: ${formatINR(estimate.budget)} — ${estimate.budgetFit ?? "n/a"}.`);
  }

  return [header, ...lines, ...footer].join("\n");
}
