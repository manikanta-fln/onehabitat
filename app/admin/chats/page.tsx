"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  DataTable,
  TablePagination,
  type DataTableColumn,
} from "@/components/admin/DataTable";
import {
  FilterBar,
  FilterField,
  filterInputClassName,
} from "@/components/admin/FilterBar";
import { SearchBar } from "@/components/admin/SearchBar";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { DetailDrawer } from "@/components/admin/Modals";
import { useDebouncedValue } from "@/features/admin/providers";
import { adminFetch, buildQuery } from "@/services/admin/api-client";
import type { PaginatedResult } from "@/types/admin/api";
import type { AdminChatMessageView, AdminChatRow } from "@/types/chat";

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default function AdminChatsPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<AdminChatRow | null>(null);
  const debouncedQ = useDebouncedValue(q);

  const listQuery = useQuery({
    queryKey: ["admin", "chats", page, debouncedQ, from, to],
    queryFn: () =>
      adminFetch<PaginatedResult<AdminChatRow>>(
        `/api/admin/chats${buildQuery({
          page,
          limit: 20,
          q: debouncedQ,
          from,
          to,
          sortBy: "updatedAt",
          sortOrder: "desc",
        })}`
      ),
  });

  const columns: DataTableColumn<AdminChatRow>[] = [
    {
      key: "preview",
      header: "Conversation",
      className: "max-w-[22rem]",
      render: (row) => (
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined mt-0.5 shrink-0 text-xl text-primary">
            forum
          </span>
          <span className="line-clamp-2 min-w-0 text-on-surface">
            {row.preview}
          </span>
        </div>
      ),
    },
    {
      key: "messages",
      header: "Messages",
      render: (row) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2.5 py-1 font-label text-label-sm text-on-surface-variant">
          {row.messageCount} total
          <span className="text-on-surface-variant/60">
            · {row.userMessageCount} from customer
          </span>
        </span>
      ),
    },
    {
      key: "lastMessageAt",
      header: "Last activity",
      render: (row) => formatDateTime(row.lastMessageAt),
    },
    {
      key: "createdAt",
      header: "Started",
      render: (row) => formatDateTime(row.createdAt),
    },
  ];

  return (
    <AdminShell
      title="Chats"
      subtitle="Assistant chatbot conversations from the website"
    >
      <div className="space-y-6">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Search conversation text…"
        />
        <FilterBar>
          <FilterField label="From">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={filterInputClassName()}
            />
          </FilterField>
          <FilterField label="To">
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={filterInputClassName()}
            />
          </FilterField>
        </FilterBar>

        {listQuery.isLoading ? <LoadingState /> : null}
        {listQuery.isError ? (
          <ErrorState
            description={
              listQuery.error instanceof Error
                ? listQuery.error.message
                : undefined
            }
            onRetry={() => void listQuery.refetch()}
          />
        ) : null}
        {listQuery.data ? (
          <>
            <DataTable
              columns={columns}
              rows={listQuery.data.data}
              rowKey={(row) => row.id}
              onRowClick={(row) => setSelected(row)}
              emptyMessage="No conversations yet"
            />
            <TablePagination
              page={listQuery.data.pagination.page}
              totalPages={listQuery.data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>

      <DetailDrawer
        open={!!selected}
        title="Conversation"
        onClose={() => setSelected(null)}
      >
        {selected ? <ChatTranscript chat={selected} /> : null}
      </DetailDrawer>
    </AdminShell>
  );
}

function ChatTranscript({ chat }: { chat: AdminChatRow }) {
  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-2 gap-4 rounded-xl bg-surface-container-low p-4">
        <Meta label="Started" value={formatDateTime(chat.createdAt)} />
        <Meta label="Last activity" value={formatDateTime(chat.lastMessageAt)} />
        <Meta label="Messages" value={`${chat.messageCount}`} />
        <Meta
          label="From customer"
          value={`${chat.userMessageCount}`}
        />
        <Meta label="Source" value={chat.source.replace(/_/g, " ")} />
        <Meta label="ID" value={chat.id} />
      </dl>

      <div className="space-y-3">
        {chat.messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 text-left">
      <dt className="font-label text-label-sm text-on-surface-variant">
        {label}
      </dt>
      <dd className="mt-0.5 truncate font-body text-body-sm text-on-surface">
        {value}
      </dd>
    </div>
  );
}

function MessageItem({ message }: { message: AdminChatMessageView }) {
  const time = message.at ? new Date(message.at).toLocaleString() : "";

  if (message.role === "event") {
    return (
      <div className="flex flex-col items-center gap-1 py-1 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border border-outline-variant/20 bg-surface-container px-3 py-1 font-label text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-base">bolt</span>
          {message.content}
        </span>
        {message.meta && Object.keys(message.meta).length > 0 ? (
          <span className="font-body text-[11px] text-on-surface-variant/70">
            {Object.entries(message.meta)
              .map(([key, value]) => `${key}: ${String(value)}`)
              .join(" · ")}
          </span>
        ) : null}
        {time ? (
          <span className="font-body text-[11px] text-on-surface-variant/60">
            {time}
          </span>
        ) : null}
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-[85%] flex-col gap-1">
        <div
          className={`rounded-2xl px-4 py-2.5 font-body text-body-sm leading-relaxed ${
            isUser
              ? "rounded-br-sm bg-primary text-on-primary"
              : "rounded-bl-sm bg-surface-container text-on-surface"
          }`}
        >
          <p className="whitespace-pre-line break-words">{message.content}</p>
        </div>
        <span
          className={`font-body text-[11px] text-on-surface-variant/60 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {isUser ? "Customer" : "Assistant"}
          {time ? ` · ${time}` : ""}
        </span>
      </div>
    </div>
  );
}
