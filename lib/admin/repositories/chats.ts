import type { Db, Filter } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import type { ChatDocument } from "@/types/database";
import type { PaginationParams } from "@/types/admin/api";
import { getSkip, toDateFilter } from "@/lib/admin/utils/pagination";

export type ChatListFilters = {
  q?: string;
  from?: string;
  to?: string;
};

function buildChatFilter(filters: ChatListFilters): Filter<ChatDocument> {
  const filter: Filter<ChatDocument> = {};
  const createdAt = toDateFilter(filters.from, filters.to);
  if (createdAt) filter.createdAt = createdAt;

  if (filters.q?.trim()) {
    const regex = new RegExp(filters.q.trim(), "i");
    filter["messages.content"] = regex;
  }

  return filter;
}

export async function listChats(
  db: Db,
  params: PaginationParams,
  filters: ChatListFilters
) {
  const filter = buildChatFilter(filters);
  const sortField = params.sortBy ?? "updatedAt";
  const sortOrder = params.sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    db
      .collection<ChatDocument>(ADMIN_COLLECTIONS.chats)
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(getSkip(params))
      .limit(params.limit)
      .toArray(),
    db
      .collection<ChatDocument>(ADMIN_COLLECTIONS.chats)
      .countDocuments(filter),
  ]);

  return { data, total };
}
