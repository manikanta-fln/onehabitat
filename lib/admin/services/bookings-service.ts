import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  listBookings,
  findBookingById,
  updateBooking,
  appendBookingStatusHistory,
  listBookingStatusHistory,
} from "@/lib/admin/repositories/bookings";
import { findIssueById } from "@/lib/admin/repositories/issues";
import { findCustomerById } from "@/lib/admin/repositories/customers";
import { createAuditLog, listAuditLogsForEntity } from "@/lib/admin/repositories/audit-logs";
import {
  buildPaginationResult,
} from "@/lib/admin/utils/pagination";
import type { PaginationParams } from "@/types/admin/api";
import type { BookingListFilters } from "@/lib/admin/repositories/bookings";
import { serializeDate, serializeId, sanitizeRecord } from "@/lib/admin/utils/serialize";
import type { AdminSession } from "@/types/admin/auth";
import type { BookingStatus } from "@/types/admin/entities";
import { BOOKING_STATUSES } from "@/types/admin/entities";

function serializeBooking(booking: NonNullable<Awaited<ReturnType<typeof findBookingById>>>) {
  return {
    id: serializeId(booking._id),
    issueId: serializeId(booking.issueId),
    customerId: serializeId(booking.customerId),
    booking: booking.booking,
    recommendation: booking.recommendation,
    status: booking.status,
    assignedTo: booking.assignedTo,
    internalNotes: booking.internalNotes,
    createdAt: serializeDate(booking.createdAt) ?? "",
    updatedAt: serializeDate(booking.updatedAt) ?? "",
  };
}

export async function getBookingsList(
  params: PaginationParams,
  filters: BookingListFilters
) {
  const db = await getDb();
  const { data, total } = await listBookings(db, params, filters);

  return buildPaginationResult(
    data.map((booking) => ({
      id: serializeId(booking._id),
      customerName: booking.booking.fullName,
      customerEmail: booking.booking.email,
      preferredDate: booking.booking.preferredDate,
      address: booking.booking.address,
      status: booking.status,
      issue: booking.recommendation.detectedIssue,
      category: booking.recommendation.category,
      createdAt: serializeDate(booking.createdAt) ?? "",
    })),
    total,
    params
  );
}

export async function getBookingDetail(id: string) {
  const db = await getDb();
  const booking = await findBookingById(db, id);
  if (!booking) return null;

  const [issue, customer, statusHistory, auditLogs] = await Promise.all([
    findIssueById(db, booking.issueId.toString()),
    findCustomerById(db, booking.customerId.toString()),
    listBookingStatusHistory(db, id),
    listAuditLogsForEntity(db, "booking", id),
  ]);

  return {
    booking: serializeBooking(booking),
    issue: issue
      ? {
          id: serializeId(issue._id),
          detectedIssue: issue.recommendation.detectedIssue,
          category: issue.recommendation.category,
          severity: issue.recommendation.severity,
          imageUrl: `/api/admin/issues/${serializeId(issue._id)}/image`,
        }
      : null,
    customer: customer
      ? {
          id: serializeId(customer._id),
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          bookingCount: customer.bookingCount,
        }
      : null,
    statusHistory: statusHistory.map((entry) => ({
      id: serializeId(entry._id),
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      changedByEmail: entry.changedByEmail,
      note: entry.note ?? "",
      createdAt: serializeDate(entry.createdAt) ?? "",
    })),
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

export async function patchBooking(
  id: string,
  input: {
    status?: BookingStatus;
    assignedTo?: string | null;
    internalNotes?: string;
    preferredDate?: string;
    note?: string;
  },
  session: AdminSession,
  meta?: { ipAddress?: string; userAgent?: string }
) {
  if (input.status && !BOOKING_STATUSES.includes(input.status)) {
    throw new Error("Invalid booking status");
  }

  const db = await getDb();
  const before = await findBookingById(db, id);
  if (!before) return null;

  const updated = await updateBooking(db, id, input);
  if (!updated) return null;

  if (input.status && input.status !== before.status) {
    await appendBookingStatusHistory(db, {
      bookingId: new ObjectId(id),
      fromStatus: before.status,
      toStatus: input.status,
      changedBy: new ObjectId(session.adminId),
      changedByEmail: session.email,
      note: input.note,
    });
  }

  await createAuditLog(db, {
    session,
    action: "booking.update",
    entityType: "booking",
    entityId: id,
    before: sanitizeRecord(before as unknown as Record<string, unknown>),
    after: sanitizeRecord(updated as unknown as Record<string, unknown>),
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return serializeBooking(updated);
}

export { BOOKING_STATUSES };
