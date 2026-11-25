import type {
  InteriorScope,
  InteriorTier,
  InteriorTrade,
} from "@/types/interiors";

/**
 * Bangalore market rates for interiors and renovation (2025–26).
 *
 * Rates are quoted the way Bangalore contractors quote them:
 *  - Carpentry: per sqft of unit area (front face of wardrobes, kitchen, TV unit…)
 *  - Electrical / plumbing: per point
 *  - Tiling: per sqft of tiled area
 *  - Painting: per sqft of wall + ceiling area
 *
 * Material and labour are kept separate so the bot can quote labour rates on
 * their own. Update these when market rates change — the estimate card and the
 * AI assistant both read from this file.
 */

/**
 * Internal only — never shown to customers unless they ask which city or
 * market the rates are based on.
 */
export const MARKET_LABEL = "Bangalore market rates (2025–26)";

type TierValues = Record<InteriorTier, number>;
type TierList = Record<InteriorTier, string[]>;

export type TradeConfig = {
  label: string;
  icon: string;
  /** Unit the rates are quoted in. */
  rateUnit: string;
  /** Label for the work quantity row, e.g. "Wall & ceiling area". */
  workLabel: string;
  /** Unit shown next to the work quantity, e.g. "sqft" or "points". */
  workUnit: string;
  /** Material cost, rupees per rate unit. */
  materialRate: TierValues;
  /** Labour cost, rupees per rate unit. */
  labourRate: TierValues;
  /**
   * Share of this trade a scope usually needs (1 = the whole home).
   * New-flat interiors keep the builder's flooring, wiring and bathrooms;
   * renovations usually redo them. When the customer asks about a specific
   * trade, the whole home is estimated for that trade.
   */
  scopeFactor: Record<InteriorScope, number>;
  brands: TierList;
  guidance: string;
};

export const TRADE_ORDER: InteriorTrade[] = [
  "carpentry",
  "electrical",
  "plumbing",
  "tiling",
  "painting",
];

export const TRADES: Record<InteriorTrade, TradeConfig> = {
  carpentry: {
    label: "Carpentry & plywood",
    icon: "carpenter",
    rateUnit: "sqft of unit area",
    workLabel: "Woodwork unit area",
    workUnit: "sqft",
    // Economy: BWR ply + 1 mm laminate, basic hardware (~₹1,250/sqft)
    // Premium: BWP ply + premium laminate / acrylic, soft-close (~₹1,850/sqft)
    // Luxury: BWP ply + PU / veneer, Blum or Hettich premium (~₹2,850/sqft)
    materialRate: { economy: 950, premium: 1450, luxury: 2300 },
    labourRate: { economy: 300, premium: 400, luxury: 550 },
    scopeFactor: { full_interior: 1, renovation: 0.5 },
    brands: {
      economy: ["Century Sainik 710", "Greenply Ecotec", "Merino laminates", "Ebco hardware"],
      premium: ["CenturyPly", "Greenply Gold", "Greenlam laminates", "Hettich soft-close"],
      luxury: ["CenturyPly Club Prime", "Greenply Platinum", "Blum / Hettich premium", "PU or veneer finish"],
    },
    guidance:
      "Use BWP (IS 710) ply for the kitchen and anything near water, BWR/MR ply for wardrobes and lofts, and soft-close hinges and channels.",
  },
  electrical: {
    label: "Electricals",
    icon: "electrical_services",
    rateUnit: "point",
    workLabel: "Electrical points",
    workUnit: "points",
    // Material: FR wire, conduit, box, modular switch/socket per point
    materialRate: { economy: 700, premium: 1100, luxury: 1800 },
    labourRate: { economy: 350, premium: 450, luxury: 600 },
    scopeFactor: { full_interior: 0.5, renovation: 1 },
    brands: {
      economy: ["Anchor Roma", "Finolex wires", "Goldmedal"],
      premium: ["Havells", "Polycab wires", "Legrand Myrius"],
      luxury: ["Legrand Arteor", "Schneider", "GM Modular"],
    },
    guidance:
      "Use FR/FRLS copper wiring, a separate circuit for AC and kitchen loads, and RCCB protection on the main board.",
  },
  plumbing: {
    label: "Plumbing & CP fittings",
    icon: "plumbing",
    rateUnit: "point",
    workLabel: "Plumbing points",
    workUnit: "points",
    // Material per point includes pipes plus an allowance for CP fittings
    // and sanitaryware at that finish level.
    materialRate: { economy: 4000, premium: 8000, luxury: 16000 },
    labourRate: { economy: 600, premium: 800, luxury: 1100 },
    scopeFactor: { full_interior: 0.25, renovation: 1 },
    brands: {
      economy: ["Cera", "Hindware", "Supreme / Ashirvad pipes"],
      premium: ["Jaquar", "Parryware", "Astral CPVC"],
      luxury: ["Kohler", "Grohe", "Jaquar Artize"],
    },
    guidance:
      "Use CPVC for hot and cold supply lines and pressure-test all concealed lines before tiling over them.",
  },
  tiling: {
    label: "Tiles & ceramic",
    icon: "grid_view",
    rateUnit: "sqft of tiled area",
    workLabel: "Tiled area",
    workUnit: "sqft",
    // Material includes tile adhesive and grout.
    materialRate: { economy: 65, premium: 115, luxury: 220 },
    labourRate: { economy: 40, premium: 50, luxury: 75 },
    scopeFactor: { full_interior: 0.3, renovation: 0.8 },
    brands: {
      economy: ["Somany", "Johnson", "Orientbell"],
      premium: ["Kajaria", "Somany Duragres", "Nitco"],
      luxury: ["Kajaria Eternity", "Simpolo", "RAK Ceramics"],
    },
    guidance:
      "Vitrified or GVT tiles for floors, anti-skid matt tiles in bathrooms, and epoxy grout in wet areas. Large-format tiles cost more to lay.",
  },
  painting: {
    label: "Painting",
    icon: "format_paint",
    rateUnit: "sqft of wall area",
    workLabel: "Wall & ceiling area",
    workUnit: "sqft",
    // Economy: Tractor / Bison emulsion; Premium: Royale / Silk;
    // Luxury: Royale Aspira / Ambiance with accent finishes.
    materialRate: { economy: 7, premium: 14, luxury: 24 },
    labourRate: { economy: 9, premium: 12, luxury: 16 },
    scopeFactor: { full_interior: 1, renovation: 1 },
    brands: {
      economy: ["Asian Paints Tractor Emulsion", "Berger Bison", "Nerolac Beauty"],
      premium: ["Asian Paints Royale", "Berger Silk Glamor", "Dulux Velvet Touch"],
      luxury: ["Asian Paints Royale Aspira", "Dulux Ambiance", "Nerolac Impressions"],
    },
    guidance:
      "One coat of primer, two coats of putty on new walls, then two coats of emulsion. Use washable sheen in the kitchen and kids' rooms.",
  },
};

/**
 * Typical Bangalore apartment carpet areas, used when the customer gives only
 * a BHK. (Super built-up area is usually ~25–30% more.)
 */
export const PROPERTY_PRESETS: Record<
  string,
  { label: string; carpetAreaSqft: number; bedrooms: number; bathrooms: number }
> = {
  "1bhk": { label: "1BHK", carpetAreaSqft: 500, bedrooms: 1, bathrooms: 1 },
  "2bhk": { label: "2BHK", carpetAreaSqft: 900, bedrooms: 2, bathrooms: 2 },
  "3bhk": { label: "3BHK", carpetAreaSqft: 1250, bedrooms: 3, bathrooms: 3 },
  "4bhk": { label: "4BHK", carpetAreaSqft: 1750, bedrooms: 4, bathrooms: 4 },
  villa: { label: "Villa", carpetAreaSqft: 2400, bedrooms: 4, bathrooms: 4 },
};

/** How work quantities and materials are derived from carpet area. */
export const CONSUMPTION = {
  /** Woodwork unit area as a share of carpet area (kitchen, wardrobes, TV unit, crockery, shoe rack). */
  carpentryUnitAreaFactor: 0.38,
  /** 8×4 ft plywood sheets per sqft of unit area (carcass, shelves, shutters). */
  plywoodSheetsPerUnitSqft: 0.13,
  /** Decorative laminate area per sqft of unit area (shutters + exposed sides). */
  laminateSqftPerUnitSqft: 1.5,
  sqftPerSheet: 32,
  /** Carpet sqft per electrical point (lights, fans, sockets, AC, geyser). */
  sqftPerElectricalPoint: 16,
  wireMetresPerPoint: 12,
  metresPerWireCoil: 90,
  plumbingPointsPerBathroom: 6,
  plumbingPointsKitchenAndUtility: 4,
  pipeMetresPerPlumbingPoint: 6,
  /** Tiled area as a multiple of carpet area (floors + bathroom/kitchen walls). */
  tileAreaFactor: 1.1,
  tileWastage: 0.08,
  /** One box of 600×600 mm tiles (4 tiles). */
  sqftPerTileBox: 15.5,
  /** Tiled sqft per 20 kg bag of tile adhesive. */
  sqftPerAdhesiveBag: 45,
  /** Paintable wall + ceiling area as a multiple of carpet area. */
  paintAreaFactor: 3.3,
  paintCoats: 2,
  /** Emulsion coverage per litre per coat, sqft. */
  paintCoveragePerLitre: 120,
  primerCoveragePerLitre: 150,
  /** Putty coverage per kg for two coats, sqft. */
  puttyCoveragePerKg: 12,
};

/** Within this much over budget counts as "slightly over". */
export const SLIGHTLY_OVER_BUDGET_RATIO = 0.12;

/** Trades that matter most when the budget is tight. */
export const ESSENTIAL_TRADES: InteriorTrade[] = [
  "electrical",
  "plumbing",
  "painting",
  "tiling",
];

export const COLOUR_COMBINATIONS: TierList = {
  economy: [
    "Off-white walls + light oak laminate + grey accents — clean and easy to maintain",
    "Warm beige + white + teak-finish woodwork — classic and budget-friendly",
    "Soft sage green on one feature wall + white + natural wood",
  ],
  premium: [
    "Warm white + walnut wood + brushed brass hardware",
    "Sage green + ivory + natural oak with cane accents",
    "Greige (grey-beige) + charcoal + matte black fittings",
    "Dusty blue-grey + white + light ash wood",
  ],
  luxury: [
    "Ivory + deep emerald accent wall + fluted walnut + gold details",
    "Greige + white marble look + champagne gold hardware",
    "Terracotta + cream + travertine textures + rattan",
    "Charcoal + smoked oak + bronze glass for a moody contemporary look",
  ],
};

export const INTERIOR_TRENDS: string[] = [
  "Fluted wood or louvered panels on TV units and feature walls",
  "Handleless modular kitchens with quartz countertops and matt finishes",
  "Cove and profile lighting in a simple false ceiling instead of heavy designs",
  "Large-format tiles (800×1600 mm) and marble-look GVT for a seamless floor",
  "Earthy, muted palettes — sage, terracotta, greige — with natural textures",
  "Cane, rattan and fluted glass for wardrobe and crockery shutters",
  "Smart switches and warm 3000K lighting for a cosy ambience",
];

export const ESTIMATE_DISCLAIMER =
  "Indicative estimate at typical market rates, not a quotation. Final cost depends on site measurement, design and the exact brands selected.";
