import { ObjectId, type Db, type Filter } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import type { CustomerDocument } from "@/types/database";
import type { PaginationParams } from "@/types/admin/api";
import { getSkip, toDateFilter } from "@/lib/admin/utils/pagination";

export type CustomerListFilters = {
  q?: string;
  from?: string;
  to?: string;
};

function buildCustomerFilter(filters: CustomerListFilters): Filter<CustomerDocument> {
  const filter: Filter<CustomerDocument> = {};

  const updatedAt = toDateFilter(filters.from, filters.to);
  if (updatedAt) filter.updatedAt = updatedAt;

  if (filters.q?.trim()) {
    const regex = new RegExp(filters.q.trim(), "i");
    filter.$or = [
      { fullName: regex },
      { email: regex },
      { phone: regex },
      { address: regex },
    ];
  }

  return filter;
}

export async function listCustomers(
  db: Db,
  params: PaginationParams,
  filters: CustomerListFilters
) {
  const filter = buildCustomerFilter(filters);
  const sortField = params.sortBy ?? "updatedAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    db
      .collection<CustomerDocument>(ADMIN_COLLECTIONS.customers)
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(getSkip(params))
      .limit(params.limit)
      .toArray(),
    db.collection<CustomerDocument>(ADMIN_COLLECTIONS.customers).countDocuments(filter),
  ]);

  return { data, total };
}

export async function findCustomerById(db: Db, id: string) {
  if (!ObjectId.isValid(id)) return null;
  return db
    .collection<CustomerDocument>(ADMIN_COLLECTIONS.customers)
    .findOne({ _id: new ObjectId(id) });
}

export async function updateCustomer(
  db: Db,
  id: string,
  updates: Partial<Pick<CustomerDocument, "fullName" | "phone" | "email" | "address">> & {
    adminNotes?: string;
  }
) {
  if (!ObjectId.isValid(id)) return null;

  const set: Record<string, unknown> = { updatedAt: new Date() };
  if (updates.fullName) set.fullName = updates.fullName.trim();
  if (updates.phone) set.phone = updates.phone.trim();
  if (updates.email) set.email = updates.email.trim().toLowerCase();
  if (updates.address) set.address = updates.address.trim();
  if (typeof updates.adminNotes === "string") set.adminNotes = updates.adminNotes;

  return db
    .collection<CustomerDocument>(ADMIN_COLLECTIONS.customers)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );
}

export async function countNewCustomersSince(db: Db, since: Date) {
  return db.collection(ADMIN_COLLECTIONS.customers).countDocuments({
    createdAt: { $gte: since },
  });
}

export async function getCustomerBookings(db: Db, customerId: string) {
  if (!ObjectId.isValid(customerId)) return [];
  return db
    .collection(ADMIN_COLLECTIONS.bookings)
    .find({ customerId: new ObjectId(customerId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getCustomerIssues(db: Db, customerId: string) {
  if (!ObjectId.isValid(customerId)) return [];
  const bookings = await getCustomerBookings(db, customerId);
  const issueIds = bookings.map((b) => b.issueId);
  if (issueIds.length === 0) return [];
  return db
    .collection(ADMIN_COLLECTIONS.issues)
    .find({ _id: { $in: issueIds } })
    .sort({ createdAt: -1 })
    .toArray();
}
