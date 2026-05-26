export type UploadIssueStep = "analyzing" | "results" | "booking";

export type IssueSeverity = "low" | "medium" | "high";

export type AIRecommendation = {
  detectedIssue: string;
  category: string;
  severity: IssueSeverity;
  summary: string;
  solutions: string[];
  estimatedCost: string;
  estimatedDuration: string;
};

export type BookingFormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  preferredDate: string;
  notes: string;
};
