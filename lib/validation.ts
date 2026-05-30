import type { AIRecommendation, BookingFormData } from "@/types/upload-issue";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidBooking(booking: unknown): booking is BookingFormData {
  if (!booking || typeof booking !== "object") return false;

  const b = booking as Record<string, unknown>;

  return (
    typeof b.fullName === "string" &&
    b.fullName.trim().length > 0 &&
    typeof b.phone === "string" &&
    b.phone.trim().length > 0 &&
    typeof b.email === "string" &&
    EMAIL_PATTERN.test(b.email) &&
    typeof b.address === "string" &&
    b.address.trim().length > 0 &&
    typeof b.preferredDate === "string" &&
    b.preferredDate.length > 0 &&
    typeof b.notes === "string"
  );
}

export function isValidRecommendation(
  value: unknown
): value is AIRecommendation {
  if (!value || typeof value !== "object") return false;

  const r = value as Record<string, unknown>;

  return (
    typeof r.detectedIssue === "string" &&
    typeof r.category === "string" &&
    (r.severity === "low" ||
      r.severity === "medium" ||
      r.severity === "high" ||
      r.severity === "urgent") &&
    typeof r.summary === "string" &&
    Array.isArray(r.solutions) &&
    r.solutions.every((s) => typeof s === "string") &&
    typeof r.estimatedCost === "string" &&
    typeof r.estimatedDuration === "string"
  );
}
