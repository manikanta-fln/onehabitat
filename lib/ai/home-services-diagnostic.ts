import type { ParsedUploadFile } from "@/lib/form-file";
import type { AIRecommendation, HomeServicesDiagnostic } from "@/types/upload-issue";
import { HOME_SERVICES_DIAGNOSTIC_SYSTEM_PROMPT } from "@/lib/ai/home-services-prompt";
import {
  AI_ANALYSIS_TIMEOUT_MS,
  AI_ANALYSIS_TIMEOUT_MESSAGE,
} from "@/lib/ai/constants";

const OPENAI_VISION_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const ANALYSIS_TIMEOUT_MS = AI_ANALYSIS_TIMEOUT_MS;

const ISSUE_CATEGORIES = new Set([
  "plumbing",
  "electrical",
  "painting",
  "seepage",
  "leakage",
  "waterproofing",
  "wall_damage",
  "ceiling_damage",
  "appliance_related",
  "general_maintenance",
  "unclear",
]);

const SEVERITIES = new Set(["low", "medium", "high", "urgent"]);
const COMPLEXITIES = new Set([
  "simple",
  "moderate",
  "complex",
  "inspection_required",
]);

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
};

function formatCategoryLabel(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function complexityToEstimates(complexity: string): {
  estimatedCost: string;
  estimatedDuration: string;
} {
  switch (complexity) {
    case "simple":
      return {
        estimatedCost: "Basic visit + repair (quote after inspection)",
        estimatedDuration: "Same day",
      };
    case "moderate":
      return {
        estimatedCost: "Moderate repair (inspection required)",
        estimatedDuration: "1–2 days",
      };
    case "complex":
      return {
        estimatedCost: "Multi-step repair (detailed quote after inspection)",
        estimatedDuration: "2–5 days",
      };
    default:
      return {
        estimatedCost: "Inspection required for accurate quote",
        estimatedDuration: "Schedule inspection",
      };
  }
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  return trimmed;
}

function asStringArray(value: unknown, fieldName: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`AI response field "${fieldName}" must be a string array`);
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function validateDiagnostic(raw: unknown): HomeServicesDiagnostic {
  if (!raw || typeof raw !== "object") {
    throw new Error("AI response is not a valid JSON object");
  }

  const data = raw as Record<string, unknown>;
  const recommended = data.recommended_solution;

  if (!recommended || typeof recommended !== "object") {
    throw new Error('AI response field "recommended_solution" is missing');
  }

  const solution = recommended as Record<string, unknown>;

  const issueCategory = String(data.issue_category ?? "").trim();
  const severity = String(data.severity ?? "").trim();
  const complexity = String(data.estimated_service_complexity ?? "").trim();

  if (!ISSUE_CATEGORIES.has(issueCategory)) {
    throw new Error(`AI response field "issue_category" is invalid: ${issueCategory}`);
  }

  if (!SEVERITIES.has(severity)) {
    throw new Error(`AI response field "severity" is invalid: ${severity}`);
  }

  if (!COMPLEXITIES.has(complexity)) {
    throw new Error(
      `AI response field "estimated_service_complexity" is invalid: ${complexity}`
    );
  }

  const confidenceScore = Number(data.confidence_score);
  if (!Number.isFinite(confidenceScore) || confidenceScore < 0 || confidenceScore > 100) {
    throw new Error('AI response field "confidence_score" must be between 0 and 100');
  }

  const detectedIssue = String(data.detected_issue ?? "").trim();
  const summary = String(data.customer_friendly_summary ?? "").trim();
  const urgencyReason = String(data.urgency_reason ?? "").trim();
  const bookingCta = String(data.recommended_booking_cta ?? "").trim();
  const limitations = String(data.limitations ?? "").trim();
  const primaryService = String(solution.primary_service_required ?? "").trim();
  const recommendedProfessional = String(solution.recommended_professional ?? "").trim();

  if (!detectedIssue || !summary || !urgencyReason || !bookingCta || !limitations) {
    throw new Error("AI response is missing required text fields");
  }

  if (!primaryService || !recommendedProfessional) {
    throw new Error("AI response recommended_solution is incomplete");
  }

  return {
    issue_category: issueCategory,
    detected_issue: detectedIssue,
    confidence_score: Math.round(confidenceScore),
    severity: severity as HomeServicesDiagnostic["severity"],
    customer_friendly_summary: summary,
    visible_observations: asStringArray(data.visible_observations, "visible_observations"),
    possible_causes: asStringArray(data.possible_causes, "possible_causes"),
    recommended_solution: {
      primary_service_required: primaryService,
      recommended_professional: recommendedProfessional,
      repair_approach: asStringArray(solution.repair_approach, "repair_approach"),
    },
    urgency_reason: urgencyReason,
    safety_warnings: asStringArray(data.safety_warnings, "safety_warnings"),
    questions_for_customer: asStringArray(
      data.questions_for_customer,
      "questions_for_customer"
    ),
    estimated_service_complexity:
      complexity as HomeServicesDiagnostic["estimated_service_complexity"],
    recommended_booking_cta: bookingCta,
    limitations,
  };
}

export function mapDiagnosticToRecommendation(
  diagnostic: HomeServicesDiagnostic
): AIRecommendation {
  const estimates = complexityToEstimates(diagnostic.estimated_service_complexity);

  return {
    detectedIssue: diagnostic.detected_issue,
    category: formatCategoryLabel(diagnostic.issue_category),
    severity: diagnostic.severity,
    summary: diagnostic.customer_friendly_summary,
    solutions: diagnostic.recommended_solution.repair_approach,
    estimatedCost: estimates.estimatedCost,
    estimatedDuration: estimates.estimatedDuration,
    confidenceScore: diagnostic.confidence_score,
    recommendedBookingCta: diagnostic.recommended_booking_cta,
    diagnostic,
  };
}

export async function analyzeHomeServicesImage(
  file: ParsedUploadFile
): Promise<AIRecommendation> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add it to .env.local or your deployment environment."
    );
  }

  if (!OPENAI_VISION_MIMES.has(file.mimeType)) {
    throw new Error(
      "Please upload a JPG, PNG, WEBP, or GIF image for AI analysis."
    );
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const base64 = file.buffer.toString("base64");
  const dataUrl = `data:${file.mimeType};base64,${base64}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 2200,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: HOME_SERVICES_DIAGNOSTIC_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this home services issue image and return JSON only.",
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl,
                  detail: "high",
                },
              },
            ],
          },
        ],
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(AI_ANALYSIS_TIMEOUT_MESSAGE);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json()) as OpenAIChatResponse;

  if (!response.ok) {
    const message = payload.error?.message ?? `OpenAI request failed (${response.status})`;
    throw new Error(message);
  }

  const content = payload.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    console.error("[home-services-diagnostic] Empty AI response content");
    throw new Error("AI returned an empty response. Please try again.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(extractJson(content));
  } catch {
    console.error("[home-services-diagnostic] Invalid JSON from AI:", content);
    throw new Error("AI returned invalid JSON. Please try again with a clearer photo.");
  }

  try {
    const diagnostic = validateDiagnostic(parsed);
    return mapDiagnosticToRecommendation(diagnostic);
  } catch (error) {
    console.error("[home-services-diagnostic] Validation failed:", error, content);
    throw new Error(
      error instanceof Error
        ? error.message
        : "AI response could not be validated. Please try again."
    );
  }
}
