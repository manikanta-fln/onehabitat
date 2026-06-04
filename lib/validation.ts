import type { ConsultationFormData } from "@/types/consultation";
import type { WaitlistFormData } from "@/types/waitlist";
import type { AIRecommendation, BookingFormData } from "@/types/upload-issue";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[\d\s+\-()]{10,20}$/;

export function isValidConsultation(
  value: unknown
): value is ConsultationFormData {
  if (!value || typeof value !== "object") return false;

  const c = value as Record<string, unknown>;

  if (typeof c.fullName !== "string" || c.fullName.trim().length < 2) {
    return false;
  }
  if (typeof c.phone !== "string" || !PHONE_PATTERN.test(c.phone.trim())) {
    return false;
  }
  if (typeof c.address !== "string" || c.address.trim().length < 5) {
    return false;
  }
  if (typeof c.email !== "string") return false;

  const email = c.email.trim();
  if (email.length > 0 && !EMAIL_PATTERN.test(email)) {
    return false;
  }

  return true;
}

export function isValidWaitlist(value: unknown): value is WaitlistFormData {
  if (!value || typeof value !== "object") return false;

  const w = value as Record<string, unknown>;

  return (
    typeof w.fullName === "string" &&
    w.fullName.trim().length >= 2 &&
    typeof w.email === "string" &&
    EMAIL_PATTERN.test(w.email.trim())
  );
}

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
