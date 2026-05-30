export type UploadIssueStep = "analyzing" | "results" | "booking";

export type IssueSeverity = "low" | "medium" | "high" | "urgent";

export type HomeServicesDiagnostic = {
  issue_category: string;
  detected_issue: string;
  confidence_score: number;
  severity: IssueSeverity;
  customer_friendly_summary: string;
  visible_observations: string[];
  possible_causes: string[];
  recommended_solution: {
    primary_service_required: string;
    recommended_professional: string;
    repair_approach: string[];
  };
  urgency_reason: string;
  safety_warnings: string[];
  questions_for_customer: string[];
  estimated_service_complexity:
    | "simple"
    | "moderate"
    | "complex"
    | "inspection_required";
  recommended_booking_cta: string;
  limitations: string;
};

export type AIRecommendation = {
  detectedIssue: string;
  category: string;
  severity: IssueSeverity;
  summary: string;
  solutions: string[];
  estimatedCost: string;
  estimatedDuration: string;
  confidenceScore?: number;
  recommendedBookingCta?: string;
  diagnostic?: HomeServicesDiagnostic;
};

export type BookingFormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  preferredDate: string;
  notes: string;
};
