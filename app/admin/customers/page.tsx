"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, TablePagination, type DataTableColumn } from "@/components/admin/DataTable";
import { SearchBar } from "@/components/admin/SearchBar";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { useDebouncedValue } from "@/features/admin/providers";
import { adminFetch, buildQuery } from "@/services/admin/api-client";
import type { PaginatedResult } from "@/types/admin/api";

type CustomerRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bookingCount: number;
  lastActivity: string;
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q);

  const listQuery = useQuery({
    queryKey: ["admin", "customers", page, debouncedQ],
    queryFn: () =>
      adminFetch<PaginatedResult<CustomerRow>>(
        `/api/admin/customers${buildQuery({ page, limit: 20, q: debouncedQ, sortBy: "updatedAt" })}`
      ),
  });

  const columns: DataTableColumn<CustomerRow>[] = [
    { key: "name", header: "Name", render: (row) => row.fullName },
    { key: "email", header: "Email", render: (row) => row.email },
    { key: "phone", header: "Phone", render: (row) => row.phone },
    { key: "bookingCount", header: "Bookings", render: (row) => row.bookingCount },
    {
      key: "lastActivity",
      header: "Last Activity",
      render: (row) => new Date(row.lastActivity).toLocaleString(),
    },
  ];

  return (
    <AdminShell title="Customers" subtitle="CRM view of Onehabitat service customers">
      <div className="space-y-6">
        <SearchBar value={q} onChange={setQ} placeholder="Search customers…" />
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
              onRowClick={(row) => router.push(`/admin/customers/${row.id}`)}
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
