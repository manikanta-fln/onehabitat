/** Maximum time allowed for OpenAI vision analysis (3 minutes). */
export const AI_ANALYSIS_TIMEOUT_MS = 3 * 60 * 1000;

export const AI_ANALYSIS_TIMEOUT_SECONDS = AI_ANALYSIS_TIMEOUT_MS / 1000;

export const AI_ANALYSIS_TIMEOUT_MESSAGE =
  "AI analysis timed out after 3 minutes. Please try again with a clearer photo.";

/** Maximum time allowed for a text chat reply (30 seconds). */
export const AI_CHAT_TIMEOUT_MS = 30 * 1000;

export const AI_CHAT_TIMEOUT_MESSAGE =
  "The assistant took too long to respond. Please try again.";

/** Maximum characters accepted for a single customer chat message. */
export const CHAT_MESSAGE_MAX_LENGTH = 1000;
