"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, TablePagination, type DataTableColumn } from "@/components/admin/DataTable";
import {
  FilterBar,
  FilterField,
  filterInputClassName,
} from "@/components/admin/FilterBar";
import { SearchBar } from "@/components/admin/SearchBar";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { useDebouncedValue } from "@/features/admin/providers";
import { adminFetch, buildQuery } from "@/services/admin/api-client";
import type { PaginatedResult } from "@/types/admin/api";

type ConsultationRow = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  email: string;
  source: string;
  createdAt: string;
};

export default function AdminConsultationsPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const debouncedQ = useDebouncedValue(q);

  const listQuery = useQuery({
    queryKey: ["admin", "consultations", page, debouncedQ, from, to],
    queryFn: () =>
      adminFetch<PaginatedResult<ConsultationRow>>(
        `/api/admin/consultations${buildQuery({
          page,
          limit: 20,
          q: debouncedQ,
          from,
          to,
          sortBy: "createdAt",
          sortOrder: "desc",
        })}`
      ),
  });

  const columns: DataTableColumn<ConsultationRow>[] = [
    { key: "name", header: "Name", render: (row) => row.fullName },
    { key: "phone", header: "Mobile", render: (row) => row.phone },
    { key: "address", header: "Address", render: (row) => row.address },
    { key: "email", header: "Email", render: (row) => row.email },
    {
      key: "createdAt",
      header: "Submitted",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <AdminShell
      title="Consultations"
      subtitle="Free consultation requests from the website"
    >
      <div className="space-y-6">
        <SearchBar value={q} onChange={setQ} placeholder="Search consultations…" />
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
              listQuery.error instanceof Error ? listQuery.error.message : undefined
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
