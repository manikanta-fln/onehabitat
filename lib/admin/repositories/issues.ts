import { ObjectId, type Db, type Filter } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import type { IssueDocument } from "@/types/database";
import type { AIRecommendation } from "@/types/upload-issue";
import type { PaginationParams } from "@/types/admin/api";
import { getSkip, toDateFilter } from "@/lib/admin/utils/pagination";

export type IssueListFilters = {
  q?: string;
  severity?: string;
  status?: string;
  category?: string;
  archived?: string;
  from?: string;
  to?: string;
};

function buildIssueFilter(filters: IssueListFilters): Filter<IssueDocument> {
  const filter: Filter<IssueDocument> = {};

  if (filters.archived === "true") {
    (filter as Record<string, unknown>).archived = true;
  } else if (filters.archived !== "all") {
    (filter as Record<string, unknown>).archived = { $ne: true };
  }

  if (filters.status) filter.status = filters.status as IssueDocument["status"];
  if (filters.severity) {
    filter["recommendation.severity"] = filters.severity;
  }
  if (filters.category) {
    filter["recommendation.category"] = filters.category;
  }

  const createdAt = toDateFilter(filters.from, filters.to);
  if (createdAt) filter.createdAt = createdAt;

  if (filters.q?.trim()) {
    const regex = new RegExp(filters.q.trim(), "i");
    filter.$or = [
      { "recommendation.detectedIssue": regex },
      { "recommendation.summary": regex },
      { "recommendation.category": regex },
    ];
  }

  return filter;
}

export async function listIssues(
  db: Db,
  params: PaginationParams,
  filters: IssueListFilters
) {
  const filter = buildIssueFilter(filters);
  const sortField = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    db
      .collection<IssueDocument>(ADMIN_COLLECTIONS.issues)
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(getSkip(params))
      .limit(params.limit)
      .toArray(),
    db.collection<IssueDocument>(ADMIN_COLLECTIONS.issues).countDocuments(filter),
  ]);

  return { data, total };
}

export async function findIssueById(db: Db, id: string) {
  if (!ObjectId.isValid(id)) return null;
  return db
    .collection<IssueDocument>(ADMIN_COLLECTIONS.issues)
    .findOne({ _id: new ObjectId(id) });
}

export async function updateIssue(
  db: Db,
  id: string,
  updates: {
    status?: IssueDocument["status"];
    recommendation?: AIRecommendation;
    archived?: boolean;
    adminNotes?: string;
  }
) {
  if (!ObjectId.isValid(id)) return null;

  const set: Record<string, unknown> = { updatedAt: new Date() };
  if (updates.status) set.status = updates.status;
  if (updates.recommendation) set.recommendation = updates.recommendation;
  if (typeof updates.adminNotes === "string") set.adminNotes = updates.adminNotes;
  if (typeof updates.archived === "boolean") {
    set.archived = updates.archived;
    set.archivedAt = updates.archived ? new Date() : null;
  }

  return db
    .collection<IssueDocument>(ADMIN_COLLECTIONS.issues)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: set },
      { returnDocument: "after" }
    );
}

export async function getIssueCategories(db: Db) {
  return db
    .collection(ADMIN_COLLECTIONS.issues)
    .distinct("recommendation.category");
}

export async function countOpenIssues(db: Db) {
  return db.collection(ADMIN_COLLECTIONS.issues).countDocuments({
    status: "analyzed",
    archived: { $ne: true },
  });
}
