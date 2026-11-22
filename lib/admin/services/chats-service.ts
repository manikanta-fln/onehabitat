import { getDb } from "@/lib/mongodb";
import { listChats } from "@/lib/admin/repositories/chats";
import type { ChatListFilters } from "@/lib/admin/repositories/chats";
import { buildPaginationResult } from "@/lib/admin/utils/pagination";
import { serializeDate } from "@/lib/admin/utils/serialize";
import type { PaginationParams } from "@/types/admin/api";
import type { ChatMessageRecord } from "@/types/database";
import type { AdminChatMessageView, AdminChatRow } from "@/types/chat";

const PREVIEW_MAX_LENGTH = 120;

function toPreview(messages: ChatMessageRecord[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  const fallback = messages.find((m) => m.role !== "event");
  const source = firstUser ?? fallback ?? messages[0];
  const text = source?.content?.trim() ?? "";
  if (!text) return "—";
  return text.length > PREVIEW_MAX_LENGTH
    ? `${text.slice(0, PREVIEW_MAX_LENGTH)}…`
    : text;
}

function toMessageView(message: ChatMessageRecord): AdminChatMessageView {
  return {
    role: message.role,
    content: message.content,
    event: message.event,
    meta: message.meta,
    at: serializeDate(message.at),
  };
}

export async function getChatsList(
  params: PaginationParams,
  filters: ChatListFilters
) {
  const db = await getDb();
  const { data, total } = await listChats(db, params, filters);

  const rows: AdminChatRow[] = data.map((row) => {
    const messages = Array.isArray(row.messages) ? row.messages : [];
    const lastMessage = messages[messages.length - 1];

    return {
      id: row._id ? row._id.toString() : "",
      source: row.source || "homepage_chatbot",
      preview: toPreview(messages),
      messageCount: messages.length,
      userMessageCount: messages.filter((m) => m.role === "user").length,
      lastMessageAt:
        serializeDate(lastMessage?.at) ?? serializeDate(row.updatedAt),
      createdAt: serializeDate(row.createdAt) ?? "",
      updatedAt: serializeDate(row.updatedAt) ?? "",
      messages: messages.map(toMessageView),
    };
  });

  return buildPaginationResult(rows, total, params);
}
