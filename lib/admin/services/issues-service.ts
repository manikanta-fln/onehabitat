import { getDb } from "@/lib/mongodb";
import {
  findIssueById,
  listIssues,
  updateIssue,
  getIssueCategories,
} from "@/lib/admin/repositories/issues";
import {
  findBookingByIssueId,
} from "@/lib/admin/repositories/bookings";
import { findCustomerById } from "@/lib/admin/repositories/customers";
import { listAuditLogsForEntity, createAuditLog } from "@/lib/admin/repositories/audit-logs";
import {
  buildPaginationResult,
} from "@/lib/admin/utils/pagination";
import type { PaginationParams } from "@/types/admin/api";
import type { IssueListFilters } from "@/lib/admin/repositories/issues";
import { serializeDate, serializeId, sanitizeRecord } from "@/lib/admin/utils/serialize";
import type { AdminSession } from "@/types/admin/auth";
import type { AIRecommendation } from "@/types/upload-issue";

function serializeIssue(issue: NonNullable<Awaited<ReturnType<typeof findIssueById>>>) {
  return {
    id: serializeId(issue._id),
    imageId: serializeId(issue.imageId) || null,
    image: issue.image && "fileName" in issue.image
      ? {
          fileName: issue.image.fileName,
          mimeType: issue.image.mimeType,
          sizeBytes: "sizeBytes" in issue.image ? issue.image.sizeBytes : null,
        }
      : null,
    recommendation: issue.recommendation,
    status: issue.status,
    archived: Boolean((issue as { archived?: boolean }).archived),
    archivedAt: serializeDate((issue as { archivedAt?: Date | null }).archivedAt),
    adminNotes: (issue as { adminNotes?: string }).adminNotes ?? "",
    createdAt: serializeDate(issue.createdAt) ?? "",
    updatedAt: serializeDate(issue.updatedAt) ?? "",
    imageUrl: `/api/admin/issues/${serializeId(issue._id)}/image`,
  };
}

export async function getIssuesList(
  params: PaginationParams,
  filters: IssueListFilters
) {
  const db = await getDb();
  const { data, total } = await listIssues(db, params, filters);

  return buildPaginationResult(
    data.map((issue) => ({
      ...serializeIssue(issue),
      bookingStatus: issue.status === "booked" ? "booked" : "none",
    })),
    total,
    params
  );
}

export async function getIssueDetail(id: string) {
  const db = await getDb();
  const issue = await findIssueById(db, id);
  if (!issue) return null;

  const booking = await findBookingByIssueId(db, id);
  const customer = booking
    ? await findCustomerById(db, booking.customerId.toString())
    : null;
  const auditLogs = await listAuditLogsForEntity(db, "issue", id);

  return {
    issue: serializeIssue(issue),
    booking: booking
      ? {
          id: serializeId(booking._id),
          status: booking.status,
          preferredDate: booking.booking.preferredDate,
          createdAt: serializeDate(booking.createdAt) ?? "",
        }
      : null,
    customer: customer
      ? {
          id: serializeId(customer._id),
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
        }
      : null,
    auditLogs: auditLogs.map((log) => ({
      id: serializeId(log._id),
      action: log.action,
      adminEmail: log.adminEmail,
      before: log.before,
      after: log.after,
      createdAt: serializeDate(log.createdAt) ?? "",
    })),
  };
}

export async function patchIssue(
  id: string,
  input: {
    status?: "analyzed" | "booked";
    recommendation?: AIRecommendation;
    archived?: boolean;
    adminNotes?: string;
  },
  session: AdminSession,
  meta?: { ipAddress?: string; userAgent?: string }
) {
  const db = await getDb();
  const before = await findIssueById(db, id);
  if (!before) return null;

  const updated = await updateIssue(db, id, input);
  if (!updated) return null;

  await createAuditLog(db, {
    session,
    action: "issue.update",
    entityType: "issue",
    entityId: id,
    before: sanitizeRecord(before as unknown as Record<string, unknown>),
    after: sanitizeRecord(updated as unknown as Record<string, unknown>),
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return serializeIssue(updated);
}

export async function getIssueFilterOptions() {
  const db = await getDb();
  const categories = await getIssueCategories(db);
  return {
    categories: categories.filter(Boolean).sort(),
    severities: ["low", "medium", "high"],
    statuses: ["analyzed", "booked"],
  };
}

export async function getIssueForImage(id: string) {
  const db = await getDb();
  return findIssueById(db, id);
}
