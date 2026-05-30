"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, TablePagination, type DataTableColumn } from "@/components/admin/DataTable";
import {
  FilterBar,
  FilterField,
  filterInputClassName,
  filterSelectClassName,
} from "@/components/admin/FilterBar";
import { SearchBar } from "@/components/admin/SearchBar";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useDebouncedValue } from "@/features/admin/providers";
import { adminFetch, buildQuery } from "@/services/admin/api-client";
import type { PaginatedResult } from "@/types/admin/api";

type IssueRow = {
  id: string;
  imageUrl: string;
  recommendation: { detectedIssue: string; category: string; severity: string };
  status: string;
  bookingStatus: string;
  createdAt: string;
};

type FiltersResponse = {
  categories: string[];
  severities: string[];
  statuses: string[];
};

export default function AdminIssuesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const debouncedQ = useDebouncedValue(q);

  const filtersQuery = useQuery({
    queryKey: ["admin", "issues", "filters"],
    queryFn: () => adminFetch<FiltersResponse>("/api/admin/issues/filters"),
  });

  const listQuery = useQuery({
    queryKey: ["admin", "issues", page, debouncedQ, severity, status, category, from, to],
    queryFn: () =>
      adminFetch<PaginatedResult<IssueRow>>(
        `/api/admin/issues${buildQuery({
          page,
          limit: 20,
          q: debouncedQ,
          severity,
          status,
          category,
          from,
          to,
        })}`
      ),
  });

  const columns: DataTableColumn<IssueRow>[] = [
    {
      key: "image",
      header: "Image",
      render: (row) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.imageUrl}
          alt=""
          className="h-12 w-12 rounded-lg object-cover"
        />
      ),
    },
    {
      key: "issue",
      header: "Issue",
      render: (row) => (
        <div>
          <p className="font-label text-label-lg">{row.recommendation.detectedIssue}</p>
          <p className="text-on-surface-variant">{row.recommendation.category}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => row.recommendation.category,
    },
    {
      key: "severity",
      header: "Severity",
      render: (row) => (
        <StatusBadge label={row.recommendation.severity} tone={row.recommendation.severity} />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge label={row.status} tone={row.status} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "bookingStatus",
      header: "Booking",
      render: (row) => (
        <StatusBadge
          label={row.bookingStatus === "booked" ? "Booked" : "None"}
          tone={row.bookingStatus}
        />
      ),
    },
  ];

  return (
    <AdminShell title="Issues" subtitle="Review AI-analyzed maintenance issues">
      <div className="space-y-6">
        <SearchBar value={q} onChange={setQ} placeholder="Search issues…" />

        <FilterBar>
          <FilterField label="Severity">
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className={filterSelectClassName()}
            >
              <option value="">All</option>
              {filtersQuery.data?.severities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={filterSelectClassName()}
            >
              <option value="">All</option>
              {filtersQuery.data?.statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={filterSelectClassName()}
            >
              <option value="">All</option>
              {filtersQuery.data?.categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </FilterField>
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
            description={listQuery.error instanceof Error ? listQuery.error.message : undefined}
            onRetry={() => void listQuery.refetch()}
          />
        ) : null}

        {listQuery.data ? (
          <>
            <DataTable
              columns={columns}
              rows={listQuery.data.data}
              rowKey={(row) => row.id}
              onRowClick={(row) => router.push(`/admin/issues/${row.id}`)}
            />
            <TablePagination
              page={listQuery.data.pagination.page}
              totalPages={listQuery.data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}
