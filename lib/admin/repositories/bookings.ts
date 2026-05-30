import { ObjectId, type Db, type Filter } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import type { BookingDocument } from "@/types/database";
import type { BookingStatus, BookingStatusHistoryDocument } from "@/types/admin/entities";
import type { PaginationParams } from "@/types/admin/api";
import { getSkip, toDateFilter } from "@/lib/admin/utils/pagination";

export type BookingListFilters = {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  preferredFrom?: string;
  preferredTo?: string;
};

function normalizeBooking(doc: BookingDocument) {
  return {
    ...doc,
    status: ((doc as BookingDocument & { status?: BookingStatus }).status ??
      "pending") as BookingStatus,
    assignedTo:
      (doc as BookingDocument & { assignedTo?: string | null }).assignedTo ?? null,
    internalNotes:
      (doc as BookingDocument & { internalNotes?: string }).internalNotes ?? "",
    updatedAt:
      (doc as BookingDocument & { updatedAt?: Date }).updatedAt ?? doc.createdAt,
  };
}

function buildBookingFilter(filters: BookingListFilters): Filter<BookingDocument> {
  const filter: Filter<BookingDocument> = {};

  if (filters.status) {
    (filter as Record<string, unknown>).status = filters.status;
  }

  const createdAt = toDateFilter(filters.from, filters.to);
  if (createdAt) filter.createdAt = createdAt;

  if (filters.preferredFrom || filters.preferredTo) {
    const preferredFilter: { $gte?: string; $lte?: string } = {};
    if (filters.preferredFrom) preferredFilter.$gte = filters.preferredFrom;
    if (filters.preferredTo) preferredFilter.$lte = filters.preferredTo;
    filter["booking.preferredDate"] = preferredFilter;
  }

  if (filters.q?.trim()) {
    const regex = new RegExp(filters.q.trim(), "i");
    filter.$or = [
      { "booking.fullName": regex },
      { "booking.email": regex },
      { "booking.phone": regex },
      { "booking.address": regex },
      { "recommendation.detectedIssue": regex },
    ];
  }

  return filter;
}

export async function listBookings(
  db: Db,
  params: PaginationParams,
  filters: BookingListFilters
) {
  const filter = buildBookingFilter(filters);
  const sortField = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const [raw, total] = await Promise.all([
    db
      .collection<BookingDocument>(ADMIN_COLLECTIONS.bookings)
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(getSkip(params))
      .limit(params.limit)
      .toArray(),
    db.collection<BookingDocument>(ADMIN_COLLECTIONS.bookings).countDocuments(filter),
  ]);

  return { data: raw.map(normalizeBooking), total };
}

export async function findBookingById(db: Db, id: string) {
  if (!ObjectId.isValid(id)) return null;
  const doc = await db
    .collection<BookingDocument>(ADMIN_COLLECTIONS.bookings)
    .findOne({ _id: new ObjectId(id) });
  return doc ? normalizeBooking(doc) : null;
}

export async function findBookingByIssueId(db: Db, issueId: string) {
  if (!ObjectId.isValid(issueId)) return null;
  const doc = await db
    .collection<BookingDocument>(ADMIN_COLLECTIONS.bookings)
    .findOne({ issueId: new ObjectId(issueId) });
  return doc ? normalizeBooking(doc) : null;
}

export async function updateBooking(
  db: Db,
  id: string,
  updates: {
    status?: BookingStatus;
    assignedTo?: string | null;
    internalNotes?: string;
    preferredDate?: string;
  }
) {
  if (!ObjectId.isValid(id)) return null;

  const set: Record<string, unknown> = { updatedAt: new Date() };
  if (updates.status) set.status = updates.status;
  if (updates.assignedTo !== undefined) set.assignedTo = updates.assignedTo;
  if (typeof updates.internalNotes === "string") {
    set.internalNotes = updates.internalNotes;
  }
  if (updates.preferredDate) {
    set["booking.preferredDate"] = updates.preferredDate;
  }

  const result = await db
    .collection<BookingDocument>(ADMIN_COLLECTIONS.bookings)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );

  return result ? normalizeBooking(result) : null;
}

export async function appendBookingStatusHistory(
  db: Db,
  input: {
    bookingId: ObjectId;
    fromStatus: BookingStatus | null;
    toStatus: BookingStatus;
    changedBy: ObjectId;
    changedByEmail: string;
    note?: string;
  }
) {
  const doc: BookingStatusHistoryDocument = {
    bookingId: input.bookingId,
    fromStatus: input.fromStatus,
    toStatus: input.toStatus,
    changedBy: input.changedBy,
    changedByEmail: input.changedByEmail,
    note: input.note,
    createdAt: new Date(),
  };

  await db
    .collection<BookingStatusHistoryDocument>(ADMIN_COLLECTIONS.bookingStatusHistory)
    .insertOne(doc);
}

export async function listBookingStatusHistory(db: Db, bookingId: string) {
  if (!ObjectId.isValid(bookingId)) return [];
  return db
    .collection<BookingStatusHistoryDocument>(ADMIN_COLLECTIONS.bookingStatusHistory)
    .find({ bookingId: new ObjectId(bookingId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function countTodaysAppointments(db: Db) {
  const today = new Date().toISOString().split("T")[0];
  return db.collection(ADMIN_COLLECTIONS.bookings).countDocuments({
    "booking.preferredDate": today,
    status: { $nin: ["cancelled", "completed"] },
  });
}

export async function listUpcomingAppointments(db: Db, limit = 10) {
  const today = new Date().toISOString().split("T")[0];
  const docs = await db
    .collection<BookingDocument>(ADMIN_COLLECTIONS.bookings)
    .find({
      "booking.preferredDate": { $gte: today },
      status: { $nin: ["cancelled", "completed"] },
    })
    .sort({ "booking.preferredDate": 1 })
    .limit(limit)
    .toArray();

  return docs.map(normalizeBooking);
}
