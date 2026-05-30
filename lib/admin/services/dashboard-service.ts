import { getDb } from "@/lib/mongodb";
import { getDashboardAnalytics } from "@/lib/admin/repositories/analytics";
import { serializeDate, serializeId } from "@/lib/admin/utils/serialize";
import type { DashboardResponse } from "@/types/admin/dashboard";

export async function getDashboardData(
  from?: string,
  to?: string
): Promise<DashboardResponse> {
  const db = await getDb();
  const raw = await getDashboardAnalytics(db, from, to);

  return {
    kpis: raw.kpis,
    issuesOverTime: raw.issuesOverTime,
    bookingsOverTime: raw.bookingsOverTime,
    severityDistribution: raw.severityDistribution,
    categoryDistribution: raw.categoryDistribution,
    customerGrowth: raw.customerGrowth,
    recentBookings: raw.recentBookings.map((booking) => ({
      id: serializeId(booking._id),
      customerName: booking.booking.fullName,
      issue: booking.recommendation.detectedIssue,
      preferredDate: booking.booking.preferredDate,
      status:
        (booking as typeof booking & { status?: string }).status ?? "pending",
      createdAt: serializeDate(booking.createdAt) ?? "",
    })),
    recentIssues: raw.recentIssues.map((issue) => ({
      id: serializeId(issue._id),
      detectedIssue: issue.recommendation.detectedIssue,
      category: issue.recommendation.category,
      severity: issue.recommendation.severity,
      status: issue.status,
      createdAt: serializeDate(issue.createdAt) ?? "",
    })),
    upcomingAppointments: raw.upcomingAppointments.map((booking) => ({
      bookingId: serializeId(booking._id),
      customerName: booking.booking.fullName,
      preferredDate: booking.booking.preferredDate,
      status:
        (booking as typeof booking & { status?: string }).status ?? "pending",
      issue: booking.recommendation.detectedIssue,
    })),
    alerts: raw.alerts,
  };
}
