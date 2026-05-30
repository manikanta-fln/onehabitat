export type DashboardKpis = {
  totalIssues: number;
  totalBookings: number;
  bookingConversionRate: number;
  newCustomers: number;
  openIssues: number;
  todaysAppointments: number;
};

export type TimeSeriesPoint = {
  date: string;
  count: number;
};

export type DistributionPoint = {
  label: string;
  value: number;
};

export type DashboardRecentBooking = {
  id: string;
  customerName: string;
  issue: string;
  preferredDate: string;
  status: string;
  createdAt: string;
};

export type DashboardRecentIssue = {
  id: string;
  detectedIssue: string;
  category: string;
  severity: string;
  status: string;
  createdAt: string;
};

export type DashboardUpcomingAppointment = {
  bookingId: string;
  customerName: string;
  preferredDate: string;
  status: string;
  issue: string;
};

export type DashboardAlert = {
  id: string;
  type: "warning" | "info" | "error";
  message: string;
  entityType?: string;
  entityId?: string;
};

export type DashboardResponse = {
  kpis: DashboardKpis;
  issuesOverTime: TimeSeriesPoint[];
  bookingsOverTime: TimeSeriesPoint[];
  severityDistribution: DistributionPoint[];
  categoryDistribution: DistributionPoint[];
  customerGrowth: TimeSeriesPoint[];
  recentBookings: DashboardRecentBooking[];
  recentIssues: DashboardRecentIssue[];
  upcomingAppointments: DashboardUpcomingAppointment[];
  alerts: DashboardAlert[];
};
