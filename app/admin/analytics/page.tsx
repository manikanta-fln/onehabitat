"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminBarChart,
  AdminFunnelChart,
  AdminLineChart,
  AdminPieChart,
} from "@/components/admin/Charts";
import { AnalyticsCard } from "@/components/admin/StatsCard";
import { filterInputClassName, FilterBar, FilterField } from "@/components/admin/FilterBar";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { adminFetch, buildQuery } from "@/services/admin/api-client";
import { adminToast, getAdminErrorMessage } from "@/lib/admin/toast";

type AnalyticsResponse = {
  range: { from: string; to: string };
  totals: {
    issues: number;
    bookings: number;
    customers: number;
    conversionRate: number;
  };
  issueTrends: { date: string; count: number }[];
  bookingTrends: { date: string; count: number }[];
  customerAcquisition: { date: string; count: number }[];
  severityBreakdown: { label: string; value: number }[];
  categoryPerformance: { label: string; value: number }[];
  conversionFunnel: { label: string; value: number }[];
};

export default function AdminAnalyticsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [exportType, setExportType] = useState<"issues" | "bookings" | "customers">(
    "bookings"
  );

  const query = useQuery({
    queryKey: ["admin", "analytics", from, to],
    queryFn: () =>
      adminFetch<AnalyticsResponse>(
        `/api/admin/analytics${buildQuery({ from, to })}`
      ),
  });

  async function download(format: "csv" | "xlsx") {
    try {
      const response = await fetch("/api/admin/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, type: exportType, from, to }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Export failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${exportType}-export.${format === "xlsx" ? "xlsx" : "csv"}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      adminToast.error(getAdminErrorMessage(error));
    }
  }

  return (
    <AdminShell
      title="Analytics"
      subtitle="Trend analysis, conversion insights, and operational exports"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={exportType}
            onChange={(e) =>
              setExportType(e.target.value as "issues" | "bookings" | "customers")
            }
            className="admin-select !w-auto !py-2 !pr-8 !text-body-sm"
          >
            <option value="issues">Issues</option>
            <option value="bookings">Bookings</option>
            <option value="customers">Customers</option>
          </select>
          <button
            type="button"
            onClick={() => void download("csv")}
            className="admin-btn-secondary"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => void download("xlsx")}
            className="admin-btn-primary"
          >
            Export Excel
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <FilterBar columns={2}>
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

        {query.isLoading ? <LoadingState /> : null}
        {query.isError ? (
          <ErrorState
            description={query.error instanceof Error ? query.error.message : undefined}
            onRetry={() => void query.refetch()}
          />
        ) : null}

        {query.data ? (
          <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <AnalyticsCard title="Issue Trends">
                <AdminLineChart data={query.data.issueTrends} />
              </AnalyticsCard>
              <AnalyticsCard title="Booking Trends">
                <AdminLineChart data={query.data.bookingTrends} />
              </AnalyticsCard>
              <AnalyticsCard title="Customer Acquisition">
                <AdminLineChart data={query.data.customerAcquisition} />
              </AnalyticsCard>
              <AnalyticsCard title="Severity Breakdown">
                <AdminPieChart data={query.data.severityBreakdown} />
              </AnalyticsCard>
              <AnalyticsCard title="Category Performance">
                <AdminBarChart data={query.data.categoryPerformance} />
              </AnalyticsCard>
              <AnalyticsCard title="Conversion Funnel">
                <AdminFunnelChart data={query.data.conversionFunnel} />
              </AnalyticsCard>
            </div>
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}
