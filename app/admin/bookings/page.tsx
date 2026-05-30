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
import { BOOKING_STATUSES } from "@/types/admin/entities";

type BookingRow = {
  id: string;
  customerName: string;
  preferredDate: string;
  address: string;
  status: string;
  issue: string;
  createdAt: string;
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [preferredFrom, setPreferredFrom] = useState("");
  const [preferredTo, setPreferredTo] = useState("");
  const debouncedQ = useDebouncedValue(q);

  const listQuery = useQuery({
    queryKey: ["admin", "bookings", page, debouncedQ, status, preferredFrom, preferredTo],
    queryFn: () =>
      adminFetch<PaginatedResult<BookingRow>>(
        `/api/admin/bookings${buildQuery({
          page,
          limit: 20,
          q: debouncedQ,
          status,
          preferredFrom,
          preferredTo,
          sortBy: "booking.preferredDate",
          sortOrder: "asc",
        })}`
      ),
  });

  const columns: DataTableColumn<BookingRow>[] = [
    { key: "customer", header: "Customer", render: (row) => row.customerName },
    { key: "preferredDate", header: "Preferred Date", render: (row) => row.preferredDate },
    { key: "address", header: "Address", render: (row) => row.address },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge label={row.status} tone={row.status} />,
    },
    { key: "issue", header: "Issue", render: (row) => row.issue },
    {
      key: "createdAt",
      header: "Created",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <AdminShell title="Bookings" subtitle="Manage service requests and operational workflow">
      <div className="space-y-6">
        <SearchBar value={q} onChange={setQ} placeholder="Search bookings…" />
        <FilterBar>
          <FilterField label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={filterSelectClassName()}
            >
              <option value="">All</option>
              {BOOKING_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Preferred from">
            <input
              type="date"
              value={preferredFrom}
              onChange={(e) => setPreferredFrom(e.target.value)}
              className={filterInputClassName()}
            />
          </FilterField>
          <FilterField label="Preferred to">
            <input
              type="date"
              value={preferredTo}
              onChange={(e) => setPreferredTo(e.target.value)}
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
              onRowClick={(row) => router.push(`/admin/bookings/${row.id}`)}
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
