export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface OrganizationOption {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  accessRole: string;
}

export interface DashboardMetric {
  value: number;
  change: number;
  changeLabel: string;
}

export interface RevenueMetric {
  amountCents: string;
  currency: string;
  changePercent: number;
  changeLabel: string;
}

export interface DashboardTask {
  id: string;
  task: string;
  module: string | null;
  dueAt: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: string | null;
}

export interface DashboardChart {
  type: "bar" | "line" | "doughnut";
  labels: string[];
  series: Array<{ name: string; data: number[] }>;
}

export interface OrganizationDashboardData {
  organization: OrganizationOption;
  accessRole: "ORG_ADMIN" | "SUPER_ADMIN" | "TESTER";
  generatedAt: string;
  kpis: {
    activeClients: DashboardMetric;
    runningProjects: DashboardMetric;
    tasksDone: DashboardMetric;
    monthlyRevenue: RevenueMetric;
  };
  todayWorkload: { total: number; items: DashboardTask[] };
  salesPipeline: {
    totalDeals: number;
    stages: Array<{ stage: string; deals: number; percentage: number }>;
  };
  quickFocus: {
    followUpClients: number;
    pendingInvoices: number;
    timesheetsWaiting: number;
  };
  summary: {
    upcomingMeetings: number;
    lateTimesheets: number;
    monthlyTaskCompletionPercent: number;
  };
  charts: {
    salesPipeline: DashboardChart;
    tasksByStatus: DashboardChart;
    cashFlowLast6Months: DashboardChart;
  };
}
