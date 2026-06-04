import { getDb } from "@/lib/mongodb";
import { listJoinlist } from "@/lib/admin/repositories/joinlist";
import type { JoinlistFilters } from "@/lib/admin/repositories/joinlist";
import { buildPaginationResult } from "@/lib/admin/utils/pagination";
import { serializeDate, serializeId } from "@/lib/admin/utils/serialize";
import type { PaginationParams } from "@/types/admin/api";

export async function getJoinlist(
  params: PaginationParams,
  filters: JoinlistFilters
) {
  const db = await getDb();
  const { data, total } = await listJoinlist(db, params, filters);

  return buildPaginationResult(
    data.map((row) => ({
      id: serializeId(row._id),
      fullName: row.fullName,
      email: row.email,
      source: row.source,
      createdAt: serializeDate(row.createdAt) ?? "",
    })),
    total,
    params
  );
}
