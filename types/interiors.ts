/** Finish level the customer is aiming for. */
export type InteriorTier = "economy" | "premium" | "luxury";

/** Full new interiors vs. renovating an existing home. */
export type InteriorScope = "full_interior" | "renovation";

/** Trades covered by the estimator. */
export type InteriorTrade =
  | "carpentry"
  | "electrical"
  | "plumbing"
  | "tiling"
  | "painting";

export type BudgetFit = "within" | "slightly_over" | "over";

/** Inputs the estimator needs. */
export type InteriorEstimateInput = {
  /** Short label for the home, e.g. "2BHK" or "Villa". */
  propertyLabel: string;
  carpetAreaSqft: number;
  bedrooms: number;
  bathrooms: number;
  scope: InteriorScope;
  tier: InteriorTier;
  /** Total budget in rupees, if the customer shared one. */
  budget?: number;
  /** Restrict to these trades; all trades when omitted. */
  trades?: InteriorTrade[];
  /** True when the carpet area came from a BHK preset, not the customer. */
  areaAssumed?: boolean;
  /** True when the customer didn't name a finish level. */
  tierAssumed?: boolean;
};

/** One quantity of material, e.g. "30 sheets of plywood (8×4 ft)". */
export type MaterialQuantity = {
  item: string;
  quantity: number;
  unit: string;
};

export type InteriorTradeLine = {
  trade: InteriorTrade;
  label: string;
  /** Material Symbols icon name. */
  icon: string;
  quantities: MaterialQuantity[];
  materialCost: number;
  labourCost: number;
  total: number;
  /** Material rate applied, rupees per rate unit. */
  materialRate: number;
  /** Labour rate applied, rupees per rate unit. */
  labourRate: number;
  /** Unit the market quotes this trade in, e.g. "sqft of wall area" or "point". */
  rateUnit: string;
  brands: string[];
  guidance: string;
};

export type InteriorEstimate = {
  propertyLabel: string;
  carpetAreaSqft: number;
  scope: InteriorScope;
  tier: InteriorTier;
  lines: InteriorTradeLine[];
  materialTotal: number;
  labourTotal: number;
  grandTotal: number;
  perSqft: number;
  budget?: number;
  budgetFit?: BudgetFit;
  /** What can best be done within the budget. */
  budgetAdvice?: string;
  /** Assumptions the customer may want to correct. */
  assumptions: string[];
  disclaimer: string;
};
