import type { AIRecommendation, BookingFormData } from "@/types/upload-issue";

type ApiErrorBody = {
  error?: string;
};

async function parseError(response: Response): Promise<string> {
  if (response.status === 413) {
    return "Image is too large for upload. Try a smaller photo or retake the picture at lower resolution.";
  }

  try {
    const body = (await response.json()) as ApiErrorBody;
    return body.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export async function analyzeIssue(file: File): Promise<{
  issueId: string | null;
  recommendation: AIRecommendation;
  saved: boolean;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/issues/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<{
    issueId: string | null;
    recommendation: AIRecommendation;
    saved: boolean;
  }>;
}

export async function createBooking(payload: {
  issueId: string;
  booking: BookingFormData;
  recommendation: AIRecommendation;
}): Promise<{ bookingId: string; issueId: string }> {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<{ bookingId: string; issueId: string }>;
}
