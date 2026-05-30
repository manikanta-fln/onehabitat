import type { Db } from "mongodb";
import { ADMIN_COLLECTIONS } from "@/lib/admin/db/collections";
import { toDateFilter } from "@/lib/admin/utils/pagination";

function getDefaultRange(from?: string, to?: string) {
  const end = to ? new Date(to) : new Date();
  end.setHours(23, 59, 59, 999);

  const start = from
    ? new Date(from)
    : new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);
  start.setHours(0, 0, 0, 0);

  return { start, end };
}

function dateKey(date: Date) {
  return date.toISOString().split("T")[0]!;
}

function buildDateSeries(start: Date, end: Date) {
  const series: string[] = [];
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);

  while (cursor <= endDay) {
    series.push(dateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}

export async function getAnalyticsSummary(db: Db, from?: string, to?: string) {
  const { start, end } = getDefaultRange(from, to);
  const dateFilter = { $gte: start, $lte: end };

  const [
    issueTrends,
    bookingTrends,
    customerTrends,
    severityBreakdown,
    categoryBreakdown,
    totalIssues,
    totalBookings,
    totalCustomers,
    bookedIssues,
  ] = await Promise.all([
    db
      .collection(ADMIN_COLLECTIONS.issues)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter, archived: { $ne: true } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.bookings)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.customers)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.issues)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter, archived: { $ne: true } } },
        { $group: { _id: "$recommendation.severity", count: { $sum: 1 } } },
      ])
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.issues)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter, archived: { $ne: true } } },
        { $group: { _id: "$recommendation.category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    db.collection(ADMIN_COLLECTIONS.issues).countDocuments({
      createdAt: dateFilter,
      archived: { $ne: true },
    }),
    db.collection(ADMIN_COLLECTIONS.bookings).countDocuments({
      createdAt: dateFilter,
    }),
    db.collection(ADMIN_COLLECTIONS.customers).countDocuments({
      createdAt: dateFilter,
    }),
    db.collection(ADMIN_COLLECTIONS.issues).countDocuments({
      createdAt: dateFilter,
      status: "booked",
      archived: { $ne: true },
    }),
  ]);

  const seriesDates = buildDateSeries(start, end);
  const issueMap = new Map(issueTrends.map((item) => [item._id, item.count]));
  const bookingMap = new Map(bookingTrends.map((item) => [item._id, item.count]));
  const customerMap = new Map(customerTrends.map((item) => [item._id, item.count]));

  return {
    range: { from: dateKey(start), to: dateKey(end) },
    totals: {
      issues: totalIssues,
      bookings: totalBookings,
      customers: totalCustomers,
      conversionRate:
        totalIssues > 0 ? Math.round((bookedIssues / totalIssues) * 1000) / 10 : 0,
    },
    issueTrends: seriesDates.map((date) => ({
      date,
      count: issueMap.get(date) ?? 0,
    })),
    bookingTrends: seriesDates.map((date) => ({
      date,
      count: bookingMap.get(date) ?? 0,
    })),
    customerAcquisition: seriesDates.map((date) => ({
      date,
      count: customerMap.get(date) ?? 0,
    })),
    severityBreakdown: severityBreakdown.map((item) => ({
      label: item._id || "unknown",
      value: item.count,
    })),
    categoryPerformance: categoryBreakdown.map((item) => ({
      label: item._id || "unknown",
      value: item.count,
    })),
    conversionFunnel: [
      { label: "Issues Created", value: totalIssues },
      { label: "Issues Booked", value: bookedIssues },
      { label: "Bookings Created", value: totalBookings },
    ],
  };
}

export async function exportOperationalData(
  db: Db,
  type: "issues" | "bookings" | "customers",
  from?: string,
  to?: string
) {
  const createdAt = toDateFilter(from, to);

  if (type === "issues") {
    return db
      .collection(ADMIN_COLLECTIONS.issues)
      .find(createdAt ? { createdAt, archived: { $ne: true } } : { archived: { $ne: true } })
      .sort({ createdAt: -1 })
      .toArray();
  }

  if (type === "bookings") {
    return db
      .collection(ADMIN_COLLECTIONS.bookings)
      .find(createdAt ? { createdAt } : {})
      .sort({ createdAt: -1 })
      .toArray();
  }

  return db
    .collection(ADMIN_COLLECTIONS.customers)
    .find(createdAt ? { createdAt } : {})
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getDashboardAnalytics(db: Db, from?: string, to?: string) {
  const { start, end } = getDefaultRange(from, to);
  const dateFilter = { $gte: start, $lte: end };

  const [
    totalIssues,
    totalBookings,
    bookedIssues,
    newCustomers,
    openIssues,
    todaysAppointments,
    issueTrends,
    bookingTrends,
    severityBreakdown,
    categoryBreakdown,
    customerTrends,
    recentBookings,
    recentIssues,
    upcomingAppointments,
  ] = await Promise.all([
    db.collection(ADMIN_COLLECTIONS.issues).countDocuments({
      createdAt: dateFilter,
      archived: { $ne: true },
    }),
    db.collection(ADMIN_COLLECTIONS.bookings).countDocuments({
      createdAt: dateFilter,
    }),
    db.collection(ADMIN_COLLECTIONS.issues).countDocuments({
      createdAt: dateFilter,
      status: "booked",
      archived: { $ne: true },
    }),
    db.collection(ADMIN_COLLECTIONS.customers).countDocuments({
      createdAt: dateFilter,
    }),
    db.collection(ADMIN_COLLECTIONS.issues).countDocuments({
      status: "analyzed",
      archived: { $ne: true },
    }),
    db.collection(ADMIN_COLLECTIONS.bookings).countDocuments({
      "booking.preferredDate": new Date().toISOString().split("T")[0],
      status: { $nin: ["cancelled", "completed"] },
    }),
    db
      .collection(ADMIN_COLLECTIONS.issues)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter, archived: { $ne: true } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.bookings)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.issues)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter, archived: { $ne: true } } },
        { $group: { _id: "$recommendation.severity", count: { $sum: 1 } } },
      ])
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.issues)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter, archived: { $ne: true } } },
        { $group: { _id: "$recommendation.category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ])
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.customers)
      .aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: dateFilter } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.bookings)
      .find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.issues)
      .find({ archived: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray(),
    db
      .collection(ADMIN_COLLECTIONS.bookings)
      .find({
        "booking.preferredDate": { $gte: new Date().toISOString().split("T")[0] },
        status: { $nin: ["cancelled", "completed"] },
      })
      .sort({ "booking.preferredDate": 1 })
      .limit(8)
      .toArray(),
  ]);

  const seriesDates = buildDateSeries(start, end);
  const issueMap = new Map(issueTrends.map((item) => [item._id, item.count]));
  const bookingMap = new Map(bookingTrends.map((item) => [item._id, item.count]));
  const customerMap = new Map(customerTrends.map((item) => [item._id, item.count]));

  const alerts: { id: string; type: "warning" | "info" | "error"; message: string; entityType?: string; entityId?: string }[] = [];

  if (openIssues > 0) {
    alerts.push({
      id: "open-issues",
      type: "warning",
      message: `${openIssues} analyzed issues are awaiting booking follow-up`,
      entityType: "issues",
    });
  }

  const pendingBookings = await db.collection(ADMIN_COLLECTIONS.bookings).countDocuments({
    status: { $in: ["pending", "confirmed"] },
  });

  if (pendingBookings > 0) {
    alerts.push({
      id: "pending-bookings",
      type: "info",
      message: `${pendingBookings} bookings need operational attention`,
      entityType: "bookings",
    });
  }

  return {
    kpis: {
      totalIssues,
      totalBookings,
      bookingConversionRate:
        totalIssues > 0 ? Math.round((bookedIssues / totalIssues) * 1000) / 10 : 0,
      newCustomers,
      openIssues,
      todaysAppointments,
    },
    issuesOverTime: seriesDates.map((date) => ({
      date,
      count: issueMap.get(date) ?? 0,
    })),
    bookingsOverTime: seriesDates.map((date) => ({
      date,
      count: bookingMap.get(date) ?? 0,
    })),
    severityDistribution: severityBreakdown.map((item) => ({
      label: item._id || "unknown",
      value: item.count,
    })),
    categoryDistribution: categoryBreakdown.map((item) => ({
      label: item._id || "unknown",
      value: item.count,
    })),
    customerGrowth: seriesDates.map((date) => ({
      date,
      count: customerMap.get(date) ?? 0,
    })),
    recentBookings,
    recentIssues,
    upcomingAppointments,
    alerts,
  };
}
