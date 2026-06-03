/** Maximum time allowed for OpenAI vision analysis (3 minutes). */
export const AI_ANALYSIS_TIMEOUT_MS = 3 * 60 * 1000;

export const AI_ANALYSIS_TIMEOUT_SECONDS = AI_ANALYSIS_TIMEOUT_MS / 1000;

export const AI_ANALYSIS_TIMEOUT_MESSAGE =
  "AI analysis timed out after 3 minutes. Please try again with a clearer photo.";
