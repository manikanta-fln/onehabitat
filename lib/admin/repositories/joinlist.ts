import type { Db, Filter } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import type { JoinlistDocument } from "@/types/database";
import type { PaginationParams } from "@/types/admin/api";
import { getSkip, toDateFilter } from "@/lib/admin/utils/pagination";

export type JoinlistFilters = {
  q?: string;
  from?: string;
  to?: string;
};

function buildJoinlistFilter(filters: JoinlistFilters): Filter<JoinlistDocument> {
  const filter: Filter<JoinlistDocument> = {};
  const createdAt = toDateFilter(filters.from, filters.to);
  if (createdAt) filter.createdAt = createdAt;

  if (filters.q?.trim()) {
    const regex = new RegExp(filters.q.trim(), "i");
    filter.$or = [{ fullName: regex }, { email: regex }];
  }

  return filter;
}

export async function listJoinlist(
  db: Db,
  params: PaginationParams,
  filters: JoinlistFilters
) {
  const filter = buildJoinlistFilter(filters);
  const sortField = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    db
      .collection<JoinlistDocument>(ADMIN_COLLECTIONS.joinlist)
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(getSkip(params))
      .limit(params.limit)
      .toArray(),
    db
      .collection<JoinlistDocument>(ADMIN_COLLECTIONS.joinlist)
      .countDocuments(filter),
  ]);

  return { data, total };
}
