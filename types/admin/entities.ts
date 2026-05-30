import type { ObjectId } from "mongodb";
import type { AIRecommendation, BookingFormData } from "@/types/upload-issue";
import type { AdminRole } from "@/types/admin/auth";

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "scheduled",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type AdminDocument = {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RoleDocument = {
  _id?: ObjectId;
  key: AdminRole;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type PermissionDocument = {
  _id?: ObjectId;
  key: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuditLogDocument = {
  _id?: ObjectId;
  adminId: ObjectId;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
};

export type BookingStatusHistoryDocument = {
  _id?: ObjectId;
  bookingId: ObjectId;
  fromStatus: BookingStatus | null;
  toStatus: BookingStatus;
  changedBy: ObjectId;
  changedByEmail: string;
  note?: string;
  createdAt: Date;
};

export type DashboardSettingsDocument = {
  _id?: ObjectId;
  key: string;
  value: Record<string, unknown>;
  updatedBy: ObjectId | null;
  updatedAt: Date;
  createdAt: Date;
};

export type ExtendedBookingDocument = {
  _id?: ObjectId;
  issueId: ObjectId;
  customerId: ObjectId;
  booking: BookingFormData;
  recommendation: AIRecommendation;
  status: BookingStatus;
  assignedTo: string | null;
  internalNotes: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExtendedIssueDocument = {
  _id?: ObjectId;
  imageId?: ObjectId;
  image?: {
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  };
  recommendation: AIRecommendation;
  status: "analyzed" | "booked";
  archived: boolean;
  archivedAt: Date | null;
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExtendedCustomerDocument = {
  _id?: ObjectId;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  bookingCount: number;
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
};
