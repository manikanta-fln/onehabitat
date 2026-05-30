"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminBarChart,
  AdminLineChart,
  AdminPieChart,
} from "@/components/admin/Charts";
import { AnalyticsCard, StatsCard } from "@/components/admin/StatsCard";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { filterInputClassName, FilterBar, FilterField } from "@/components/admin/FilterBar";
import { adminFetch, buildQuery } from "@/services/admin/api-client";
import type { DashboardResponse } from "@/types/admin/dashboard";

function defaultFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 29);
  return date.toISOString().split("T")[0]!;
}

export default function AdminDashboardPage() {
  const [from, setFrom] = useState(defaultFromDate());
  const [to, setTo] = useState(new Date().toISOString().split("T")[0]!);

  const query = useQuery({
    queryKey: ["admin", "dashboard", from, to],
    queryFn: () =>
      adminFetch<DashboardResponse>(
        `/api/admin/dashboard${buildQuery({ from, to })}`
      ),
  });

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Operational overview for Onehabitat service activity"
      actions={
        <button
          type="button"
          onClick={() => void query.refetch()}
          className="admin-btn-secondary"
        >
          Refresh
        </button>
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

        {query.isLoading ? <LoadingState label="Loading dashboard…" /> : null}
        {query.isError ? (
          <ErrorState
            description={query.error instanceof Error ? query.error.message : undefined}
            onRetry={() => void query.refetch()}
          />
        ) : null}

        {query.data ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <StatsCard label="Total Issues" value={query.data.kpis.totalIssues} icon="report" />
              <StatsCard label="Total Bookings" value={query.data.kpis.totalBookings} icon="event_available" />
              <StatsCard
                label="Conversion Rate"
                value={`${query.data.kpis.bookingConversionRate}%`}
                icon="trending_up"
              />
              <StatsCard label="New Customers" value={query.data.kpis.newCustomers} icon="groups" />
              <StatsCard label="Open Issues" value={query.data.kpis.openIssues} icon="pending_actions" />
              <StatsCard
                label="Today's Appointments"
                value={query.data.kpis.todaysAppointments}
                icon="today"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <AnalyticsCard title="Issues Over Time">
                <AdminLineChart data={query.data.issuesOverTime} />
              </AnalyticsCard>
              <AnalyticsCard title="Bookings Over Time">
                <AdminLineChart data={query.data.bookingsOverTime} />
              </AnalyticsCard>
              <AnalyticsCard title="Severity Distribution">
                <AdminPieChart data={query.data.severityDistribution} />
              </AnalyticsCard>
              <AnalyticsCard title="Category Distribution">
                <AdminBarChart data={query.data.categoryDistribution} />
              </AnalyticsCard>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <AnalyticsCard title="Recent Bookings">
                <div className="space-y-3">
                  {query.data.recentBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/admin/bookings/${booking.id}`}
                      className="block rounded-xl border border-outline-variant/10 p-4 transition hover:bg-surface-container-low/60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-label text-label-lg">{booking.customerName}</p>
                        <StatusBadge label={booking.status} tone={booking.status} />
                      </div>
                      <p className="mt-1 font-body text-body-sm text-on-surface-variant">
                        {booking.issue}
                      </p>
                    </Link>
                  ))}
                </div>
              </AnalyticsCard>

              <AnalyticsCard title="Recent Issues">
                <div className="space-y-3">
                  {query.data.recentIssues.map((issue) => (
                    <Link
                      key={issue.id}
                      href={`/admin/issues/${issue.id}`}
                      className="block rounded-xl border border-outline-variant/10 p-4 transition hover:bg-surface-container-low/60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-label text-label-lg">{issue.detectedIssue}</p>
                        <StatusBadge label={issue.severity} tone={issue.severity} />
                      </div>
                      <p className="mt-1 font-body text-body-sm text-on-surface-variant">
                        {issue.category}
                      </p>
                    </Link>
                  ))}
                </div>
              </AnalyticsCard>

              <AnalyticsCard title="Operational Alerts">
                <div className="space-y-3">
                  {query.data.alerts.length === 0 ? (
                    <p className="font-body text-body-sm text-on-surface-variant">
                      No active alerts.
                    </p>
                  ) : (
                    query.data.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="rounded-xl border border-outline-variant/10 p-4"
                      >
                        <StatusBadge label={alert.type} tone={alert.type} />
                        <p className="mt-2 font-body text-body-sm">{alert.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </AnalyticsCard>
            </div>
          </>
        ) : null}
      </div>
    </AdminShell>
  );
}