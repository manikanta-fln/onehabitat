import type { ObjectId } from "mongodb";
import type { AIRecommendation, BookingFormData } from "@/types/upload-issue";

export type IssueStatus = "analyzed" | "booked";

/** @deprecated Legacy embedded base64 on older issue documents */
export type StoredIssueImageLegacy = {
  fileName: string;
  mimeType: string;
  data: string;
};

export type IssueImageMeta = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

export type ImageDocument = {
  _id?: ObjectId;
  issueId: ObjectId;
  fileName: string;
  mimeType: string;
  data: Buffer;
  sizeBytes: number;
  createdAt: Date;
};

export type IssueAnalysisResult = {
  issueId: string;
  imageId: string;
  recommendation: AIRecommendation;
  saved: boolean;
  analyzedAt: Date;
};

export type IssueDocument = {
  _id?: ObjectId;
  imageId?: ObjectId;
  image?: IssueImageMeta | StoredIssueImageLegacy;
  recommendation: AIRecommendation;
  analysisResult?: IssueAnalysisResult;
  status: IssueStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerDocument = {
  _id?: ObjectId;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  bookingCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type BookingDocument = {
  _id?: ObjectId;
  issueId: ObjectId;
  customerId: ObjectId;
  booking: BookingFormData;
  recommendation: AIRecommendation;
  notificationEmailSentAt?: Date;
  createdAt: Date;
};

export type ConsultationDocument = {
  _id?: ObjectId;
  fullName: string;
  phone: string;
  address: string;
  email: string;
  source: string;
  createdAt: Date;
};
