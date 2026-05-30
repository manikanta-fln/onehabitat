import { getDb } from "@/lib/mongodb";
import {
  listCustomers,
  findCustomerById,
  updateCustomer,
  getCustomerBookings,
  getCustomerIssues,
} from "@/lib/admin/repositories/customers";
import { listAuditLogsForEntity, createAuditLog } from "@/lib/admin/repositories/audit-logs";
import {
  buildPaginationResult,
} from "@/lib/admin/utils/pagination";
import type { PaginationParams } from "@/types/admin/api";
import type { CustomerListFilters } from "@/lib/admin/repositories/customers";
import { serializeDate, serializeId, sanitizeRecord } from "@/lib/admin/utils/serialize";
import type { AdminSession } from "@/types/admin/auth";

function serializeCustomer(customer: NonNullable<Awaited<ReturnType<typeof findCustomerById>>>) {
  return {
    id: serializeId(customer._id),
    fullName: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    bookingCount: customer.bookingCount,
    adminNotes: (customer as { adminNotes?: string }).adminNotes ?? "",
    createdAt: serializeDate(customer.createdAt) ?? "",
    updatedAt: serializeDate(customer.updatedAt) ?? "",
  };
}

export async function getCustomersList(
  params: PaginationParams,
  filters: CustomerListFilters
) {
  const db = await getDb();
  const { data, total } = await listCustomers(db, params, filters);

  return buildPaginationResult(
    data.map((customer) => ({
      id: serializeId(customer._id),
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      bookingCount: customer.bookingCount,
      lastActivity: serializeDate(customer.updatedAt) ?? "",
      createdAt: serializeDate(customer.createdAt) ?? "",
    })),
    total,
    params
  );
}

export async function getCustomerDetail(id: string) {
  const db = await getDb();
  const customer = await findCustomerById(db, id);
  if (!customer) return null;

  const [bookings, issues, auditLogs] = await Promise.all([
    getCustomerBookings(db, id),
    getCustomerIssues(db, id),
    listAuditLogsForEntity(db, "customer", id),
  ]);

  return {
    customer: serializeCustomer(customer),
    bookings: bookings.map((booking) => ({
      id: serializeId(booking._id),
      issue: booking.recommendation.detectedIssue,
      preferredDate: booking.booking.preferredDate,
      status: (booking as typeof booking & { status?: string }).status ?? "pending",
      createdAt: serializeDate(booking.createdAt) ?? "",
    })),
    issues: issues.map((issue) => ({
      id: serializeId(issue._id),
      detectedIssue: issue.recommendation.detectedIssue,
      category: issue.recommendation.category,
      severity: issue.recommendation.severity,
      status: issue.status,
      createdAt: serializeDate(issue.createdAt) ?? "",
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

export async function patchCustomer(
  id: string,
  input: {
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    adminNotes?: string;
  },
  session: AdminSession,
  meta?: { ipAddress?: string; userAgent?: string }
) {
  const db = await getDb();
  const before = await findCustomerById(db, id);
  if (!before) return null;

  const updated = await updateCustomer(db, id, input);
  if (!updated) return null;

  await createAuditLog(db, {
    session,
    action: "customer.update",
    entityType: "customer",
    entityId: id,
    before: sanitizeRecord(before as unknown as Record<string, unknown>),
    after: sanitizeRecord(updated as unknown as Record<string, unknown>),
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return serializeCustomer(updated);
}
