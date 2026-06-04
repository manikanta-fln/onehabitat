import { getDb } from "@/lib/mongodb";
import { listConsultations } from "@/lib/admin/repositories/consultations";
import type { ConsultationListFilters } from "@/lib/admin/repositories/consultations";
import { buildPaginationResult } from "@/lib/admin/utils/pagination";
import { serializeDate, serializeId } from "@/lib/admin/utils/serialize";
import type { PaginationParams } from "@/types/admin/api";

export async function getConsultationsList(
  params: PaginationParams,
  filters: ConsultationListFilters
) {
  const db = await getDb();
  const { data, total } = await listConsultations(db, params, filters);

  return buildPaginationResult(
    data.map((row) => ({
      id: serializeId(row._id),
      fullName: row.fullName,
      phone: row.phone,
      address: row.address,
      email: row.email || "—",
      source: row.source,
      createdAt: serializeDate(row.createdAt) ?? "",
    })),
    total,
    params
  );
}
