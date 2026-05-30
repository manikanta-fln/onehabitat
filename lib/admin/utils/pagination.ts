import type { PaginatedResult, PaginationParams } from "@/types/admin/api";

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") ?? "20") || 20)
  );
  const sortBy = searchParams.get("sortBy") ?? undefined;
  const sortOrder =
    searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  return { page, limit, sortBy, sortOrder };
}

export function buildPaginationResult<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    },
  };
}

export function getSkip(params: PaginationParams): number {
  return (params.page - 1) * params.limit;
}

export function parseDateRange(searchParams: URLSearchParams) {
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;
  return { from, to };
}

export function toDateFilter(from?: string, to?: string) {
  const filter: { $gte?: Date; $lte?: Date } = {};
  if (from) filter.$gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    filter.$lte = end;
  }
  return Object.keys(filter).length > 0 ? filter : undefined;
}
