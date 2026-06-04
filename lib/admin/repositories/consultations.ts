import type { Db, Filter } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import type { ConsultationDocument } from "@/types/database";
import type { PaginationParams } from "@/types/admin/api";
import { getSkip, toDateFilter } from "@/lib/admin/utils/pagination";

export type ConsultationListFilters = {
  q?: string;
  from?: string;
  to?: string;
};

function buildConsultationFilter(
  filters: ConsultationListFilters
): Filter<ConsultationDocument> {
  const filter: Filter<ConsultationDocument> = {};
  const createdAt = toDateFilter(filters.from, filters.to);
  if (createdAt) filter.createdAt = createdAt;

  if (filters.q?.trim()) {
    const regex = new RegExp(filters.q.trim(), "i");
    filter.$or = [
      { fullName: regex },
      { phone: regex },
      { email: regex },
      { address: regex },
    ];
  }

  return filter;
}

export async function listConsultations(
  db: Db,
  params: PaginationParams,
  filters: ConsultationListFilters
) {
  const filter = buildConsultationFilter(filters);
  const sortField = params.sortBy ?? "createdAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    db
      .collection<ConsultationDocument>(ADMIN_COLLECTIONS.consultations)
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(getSkip(params))
      .limit(params.limit)
      .toArray(),
    db
      .collection<ConsultationDocument>(ADMIN_COLLECTIONS.consultations)
      .countDocuments(filter),
  ]);

  return { data, total };
}
