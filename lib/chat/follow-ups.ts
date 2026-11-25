import type { InteriorTrade } from "@/types/interiors";
import { mentionedTrades } from "@/lib/interiors/question";

/**
 * "Do you know why others…?" follow-up questions.
 *
 * After answering, the assistant asks one related question. When the customer
 * replies with a short "no / tell me / cheppandi" or "yes / telusu", the next
 * reply answers that exact question instead of guessing from the bare reply.
 */

export type FollowUpId =
  | "painting_prep"
  | "carpentry_bwp"
  | "electrical_safety"
  | "plumbing_pressure_test"
  | "tiling_anti_skid"
  | "site_measurement"
  | "pest_repeat"
  | "seepage_first"
  | "mcb_tripping"
  | "wall_cracks"
  | "handover_inspection";

export type FollowUp = {
  id: FollowUpId;
  question: string;
  answer: string;
};

export const FOLLOW_UPS: Record<FollowUpId, FollowUp> = {
  painting_prep: {
    id: "painting_prep",
    question:
      "💡 Do you know why most homeowners apply primer and putty before painting?",
    answer:
      "Primer seals the wall so the paint sticks evenly, and putty fills small cracks and dents for a smooth finish. Without them, paint patches and peels sooner and you end up repainting earlier. On new walls we do one coat of primer, two coats of putty and then two coats of emulsion.",
  },
  carpentry_bwp: {
    id: "carpentry_bwp",
    question:
      "💡 Do you know why others use BWP plywood for the kitchen instead of normal ply?",
    answer:
      "The kitchen gets water splashes and steam every day. BWP (IS 710) ply is boiling-water proof, so it doesn't swell or rot near the sink. Wardrobes and lofts stay dry, so BWR/MR ply works there and keeps the cost lower.",
  },
  electrical_safety: {
    id: "electrical_safety",
    question:
      "💡 Do you know why others choose FRLS wires and an RCCB when wiring a home?",
    answer:
      "FR/FRLS wires resist fire and give out very little smoke if there is a short circuit. An RCCB on the main board cuts the power instantly when current leaks, which protects your family from shocks. A separate circuit for AC and kitchen loads also stops the wires from overheating.",
  },
  plumbing_pressure_test: {
    id: "plumbing_pressure_test",
    question:
      "💡 Do you know why others pressure-test the pipes before the tiles go on?",
    answer:
      "Once tiles cover the concealed pipes, any leak means breaking the tiles to fix it. A pressure test finds weak joints before that. Using CPVC for hot and cold lines also keeps the pipes from sagging or cracking with hot water.",
  },
  tiling_anti_skid: {
    id: "tiling_anti_skid",
    question:
      "💡 Do you know why others choose anti-skid matt tiles for bathrooms?",
    answer:
      "Glossy tiles get slippery when wet, which is risky for kids and elders. Anti-skid matt tiles give grip even with water on the floor. Epoxy grout in wet areas also stops water seeping into the joints and keeps them from turning black.",
  },
  site_measurement: {
    id: "site_measurement",
    question:
      "💡 Do you know why others get a free site measurement before finalising the budget?",
    answer:
      "Every home is a little different: wall lengths, ceiling height and existing fittings change the actual quantities. A site measurement turns this indicative estimate into an exact quote, so there are no surprise extra costs later. Our measurement visit is free.",
  },
  pest_repeat: {
    id: "pest_repeat",
    question:
      "💡 Do you know why others repeat pest control every few months instead of doing it once?",
    answer:
      "Eggs that hatch after a treatment bring the pests back. A repeat treatment breaks that cycle before it grows again. For termites, treating early saves your woodwork from costly damage.",
  },
  seepage_first: {
    id: "seepage_first",
    question:
      "💡 Do you know why others fix the seepage before repainting the wall?",
    answer:
      "Paint can't stop water coming from inside the wall. If the seepage isn't fixed first, the new paint bubbles and peels within months and the damp keeps spreading. Finding the source and waterproofing it first makes the repaint last.",
  },
  mcb_tripping: {
    id: "mcb_tripping",
    question:
      "💡 Do you know why others call an electrician as soon as the MCB keeps tripping?",
    answer:
      "Repeated tripping is a warning, usually an overloaded circuit, a short circuit or current leaking to earth. Resetting it again and again can overheat the wires and damage appliances. A licensed electrician finds the faulty point safely.",
  },
  wall_cracks: {
    id: "wall_cracks",
    question:
      "💡 Do you know why others get wall cracks checked before painting over them?",
    answer:
      "Hairline cracks are usually only in the plaster, but wider or growing cracks can let water in. Filling and sealing them properly before painting stops them from showing through the new paint again.",
  },
  handover_inspection: {
    id: "handover_inspection",
    question:
      "💡 Do you know why others get a pre-handover inspection before taking possession?",
    answer:
      "Before handover, the builder has to fix defects at no cost to you. Once you move in, the same repairs become your expense. An inspection lists every snag (leaks, uneven tiles, electrical faults) so they are fixed before you take the keys.",
  },
};

export const FOLLOW_UP_KNOWN_REPLY =
  "Great, you already know this! 👍 Ask me anything else, or use the buttons below to get started.";

const TRADE_FOLLOW_UPS: Record<InteriorTrade, FollowUpId> = {
  painting: "painting_prep",
  carpentry: "carpentry_bwp",
  electrical: "electrical_safety",
  plumbing: "plumbing_pressure_test",
  tiling: "tiling_anti_skid",
};

/** Repair / service topics, checked in order. */
const SERVICE_FOLLOW_UPS: Array<[RegExp, FollowUpId]> = [
  [/(inspection|handover|snag|possession)/, "handover_inspection"],
  [/(pest|termite|cockroach|rodent|\brats?\b|mosquito|bed ?bugs?)/, "pest_repeat"],
  [/(leak|seep|damp|moist|waterproof)/, "seepage_first"],
  [/(tripping|\bmcb\b|short circuit|spark|shock)/, "mcb_tripping"],
  [/(crack|peel|bubbl|flak)/, "wall_cracks"],
];

export function isFollowUpId(value: unknown): value is FollowUpId {
  return typeof value === "string" && value in FOLLOW_UPS;
}

/**
 * Picks one follow-up for this answer, skipping any already asked in the
 * conversation. Returns null when the reply is itself asking the customer
 * something, so the bot never asks two questions at once.
 */
export function pickFollowUp(params: {
  customerMessage: string;
  reply: string;
  hasEstimate: boolean;
  /** True when the interiors flow answered (vs. the general assistant). */
  interiors: boolean;
  alreadyAsked: Set<string>;
}): FollowUp | null {
  if (params.reply.trim().endsWith("?")) return null;

  const text = params.customerMessage.toLowerCase();
  const candidates: FollowUpId[] = [];

  for (const [re, id] of SERVICE_FOLLOW_UPS) {
    if (!params.interiors && re.test(text)) candidates.push(id);
  }
  for (const trade of mentionedTrades(params.customerMessage)) {
    candidates.push(TRADE_FOLLOW_UPS[trade]);
  }
  if (params.interiors && /(colou?rs?|shades?|rangu)/.test(text)) {
    candidates.push("painting_prep");
  }
  if (params.hasEstimate) candidates.push("site_measurement");

  const id = candidates.find((candidate) => !params.alreadyAsked.has(candidate));
  return id ? FOLLOW_UPS[id] : null;
}

/**
 * How a short customer reply answers "Do you know why…?":
 * "explain" (no / tell me / cheppandi / teliyadu) or "known" (yes / telusu).
 * Returns null for anything that looks like a new question.
 */
export type FollowUpReply = "explain" | "known";

const MAX_REPLY_WORDS = 6;

const NEW_QUESTION_RE =
  /\b(what|which|how|when|where|cost|price|rate|charges?|estimate|entha|enta|enti|emi|ela)\b/;

const EXPLAIN_RE =
  /(\b(don'?t|dont|do not) know\b|\bno idea\b|\bnot sure\b|\btell\b|\bexplain\b|\bwhy\b|\bcheppandi\b|\bcheppu\b|\bcheppara\b|\bteliyadu\b|\bteliyadhu\b|\bteledu\b|\btelidu\b|\bthelidu\b|\bthelidhu\b|\bledu\b|\bledhu\b|\bno\b|\bnope\b|\bnah\b|\bnot really\b)/;

const KNOWN_RE =
  /(\byes\b|\byeah\b|\byep\b|\byup\b|\bknow\b|\bknew\b|\btelusu\b|\btelsu\b|\bthelusu\b|\bavunu\b|\bhaa?\b|\bsure\b)/;

/** Telugu words a follow-up reply may use (not all are in TELUGU_STYLE_RE). */
export const TELUGU_FOLLOW_UP_RE =
  /\b(cheppandi|cheppu|cheppara|teliyadu|teliyadhu|teledu|telidu|thelidu|thelidhu|ledu|ledhu|telusu|telsu|thelusu|avunu)\b/;

export function classifyFollowUpReply(message: string): FollowUpReply | null {
  const text = message
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  if (text.split(" ").length > MAX_REPLY_WORDS) return null;
  if (NEW_QUESTION_RE.test(text)) return null;
  if (EXPLAIN_RE.test(text)) return "explain";
  if (KNOWN_RE.test(text)) return "known";
  return null;
}
