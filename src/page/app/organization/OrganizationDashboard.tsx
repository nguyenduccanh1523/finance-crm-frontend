import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  LoaderCircle,
  Plus,
  RefreshCw,
  Target,
  UsersRound,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/utils";
import {
  formatChartAmount,
  formatDueDate,
  formatMoney,
} from "@/features/organization-dashboard/dashboard.utils";
import { useOrganizationDashboard } from "@/features/organization-dashboard/useOrganizationDashboard";
import type {
  DashboardMetric,
  OrganizationDashboardData,
} from "@/features/organization-dashboard/dashboard.types";

const chartColors = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ef4444"];

function DashboardLoading() {
  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton className="h-[430px] rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: "LOW" | "MEDIUM" | "HIGH" }) {
  const styles = {
    HIGH: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
    MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    LOW: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
  };
  const labels = { HIGH: "Cao", MEDIUM: "Trung bình", LOW: "Thấp" };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[priority],
      )}
    >
      {labels[priority]}
    </span>
  );
}

function MetricCard({
  label,
  metric,
  icon: Icon,
  value,
  tone = "blue",
}: {
  label: string;
  metric: DashboardMetric;
  icon: typeof UsersRound;
  value?: string;
  tone?: "blue" | "violet" | "emerald" | "amber";
}) {
  const tones = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:shadow-black/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {value ?? metric.value.toLocaleString("vi-VN")}
          </p>
          <p
            className={cn(
              "mt-2 text-xs font-semibold",
              metric.change >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400",
            )}
          >
            {metric.changeLabel}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110",
            tones[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function OrganizationSelector({
  organizations,
  selecting,
  onSelect,
}: {
  organizations: Array<{ id: string; name: string; accessRole: string }>;
  selecting: boolean;
  onSelect: (organizationId: string) => Promise<void>;
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-xl rounded-3xl border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-bold tracking-tight">
          Chọn CRM workspace
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Tài khoản của bạn có nhiều tổ chức. Lựa chọn sẽ được lưu an toàn trong
          cookie.
        </p>
        <div className="mt-6 space-y-2">
          {organizations.map((organization) => (
            <button
              key={organization.id}
              type="button"
              disabled={selecting}
              onClick={() => void onSelect(organization.id)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5 disabled:cursor-wait disabled:opacity-60 dark:border-slate-800 dark:hover:bg-slate-800"
            >
              <span>
                <span className="block font-semibold">{organization.name}</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {organization.accessRole.replace("_", " ")}
                </span>
              </span>
              {selecting ? (
                <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <ArrowUpRight className="h-5 w-5 text-slate-400" />
              )}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => Promise<void>;
}) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl border-rose-200 bg-white p-7 text-center shadow-xl shadow-rose-100/50 dark:border-rose-900/60 dark:bg-slate-900 dark:shadow-black/30">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-xl font-bold">Không thể mở dashboard</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
        <Button className="mt-6 rounded-xl" onClick={() => void onRetry()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Thử lại
        </Button>
      </Card>
    </div>
  );
}

function DashboardContent({
  dashboard,
}: {
  dashboard: OrganizationDashboardData;
}) {
  const cashFlowData = useMemo(
    () =>
      dashboard.charts.cashFlowLast6Months.labels.map((label, index) => ({
        month: label,
        received:
          dashboard.charts.cashFlowLast6Months.series[1]?.data[index] ?? 0,
        expenses:
          dashboard.charts.cashFlowLast6Months.series[2]?.data[index] ?? 0,
      })),
    [dashboard],
  );
  const taskStatusData = useMemo(
    () =>
      dashboard.charts.tasksByStatus.labels.map((name, index) => ({
        name,
        value: dashboard.charts.tasksByStatus.series[0]?.data[index] ?? 0,
      })),
    [dashboard],
  );
  const revenueMetric: DashboardMetric = {
    value: 0,
    change: dashboard.kpis.monthlyRevenue.changePercent,
    changeLabel: dashboard.kpis.monthlyRevenue.changeLabel,
  };
  const summaryCards: Array<{
    label: string;
    value: string | number;
    icon: typeof CalendarDays;
    tone: "blue" | "rose" | "violet";
  }> = [
    {
      label: "Cuộc họp sắp tới",
      value: dashboard.summary.upcomingMeetings,
      icon: CalendarDays,
      tone: "blue",
    },
    {
      label: "Timesheet trễ hạn",
      value: dashboard.summary.lateTimesheets,
      icon: Clock3,
      tone: "rose",
    },
    {
      label: "Tiến độ mục tiêu tháng",
      value: `${dashboard.summary.monthlyTaskCompletionPercent}%`,
      icon: Target,
      tone: "violet",
    },
  ];

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              CRM Dashboard
            </h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {dashboard.accessRole.replace("_", " ")}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Tổng quan vận hành của{" "}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {dashboard.organization.name}
            </span>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-10 rounded-xl">
            <CalendarDays className="mr-2 h-4 w-4" />
            Hôm nay
          </Button>
          <Button
            asChild
            size="sm"
            className="h-10 rounded-xl shadow-lg shadow-primary/20"
          >
            <Link to="/app/organization/clients">
              <Plus className="mr-2 h-4 w-4" />
              Thêm khách hàng
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Khách hàng đang hoạt động"
          metric={dashboard.kpis.activeClients}
          icon={UsersRound}
          tone="blue"
        />
        <MetricCard
          label="Dự án đang chạy"
          metric={dashboard.kpis.runningProjects}
          icon={BriefcaseBusiness}
          tone="violet"
        />
        <MetricCard
          label="Công việc hoàn thành"
          metric={dashboard.kpis.tasksDone}
          icon={CheckCircle2}
          tone="emerald"
        />
        <MetricCard
          label="Doanh thu tháng này"
          metric={revenueMetric}
          value={formatMoney(
            dashboard.kpis.monthlyRevenue.amountCents,
            dashboard.kpis.monthlyRevenue.currency,
          )}
          icon={WalletCards}
          tone="amber"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="min-h-[360px] rounded-2xl border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold">Khối lượng công việc hôm nay</h3>
              <p className="mt-1 text-sm text-slate-500">
                {dashboard.todayWorkload.total} việc cần được ưu tiên trong
                ngày.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="rounded-xl">
              <Link to="/app/organization/tasks">
                Xem tất cả
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {dashboard.todayWorkload.items.length ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-[680px] w-full text-left">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Công việc</th>
                    <th className="px-4 py-3 font-semibold">Module</th>
                    <th className="px-4 py-3 font-semibold">Hạn xử lý</th>
                    <th className="px-4 py-3 font-semibold">Ưu tiên</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.todayWorkload.items.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                          {task.task}
                        </p>
                        {task.status && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {task.status}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                        {task.module ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {formatDueDate(task.dueAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <PriorityBadge priority={task.priority} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center dark:border-slate-700">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <p className="mt-3 font-semibold">
                Hôm nay chưa có việc cần xử lý
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Bạn đang có một ngày làm việc khá nhẹ nhàng.
              </p>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="font-bold">Sales pipeline</h3>
              </div>
              <span className="text-xs text-slate-500">
                {dashboard.salesPipeline.totalDeals} deals
              </span>
            </div>
            <div className="space-y-4">
              {dashboard.salesPipeline.stages.length ? (
                dashboard.salesPipeline.stages.map((stage, index) => (
                  <div key={stage.stage}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-semibold">{stage.stage}</span>
                      <span className="text-slate-500">
                        {stage.deals} deals
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(stage.percentage, 3)}%`,
                          backgroundColor:
                            chartColors[index % chartColors.length],
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-slate-500">
                  Chưa có dữ liệu pipeline.
                </p>
              )}
            </div>
          </Card>
          <Card className="rounded-2xl border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="font-bold">Quick focus</h3>
            </div>
            <div className="space-y-2">
              {[
                [
                  "Khách hàng cần follow-up",
                  dashboard.quickFocus.followUpClients,
                ],
                ["Hóa đơn chờ xử lý", dashboard.quickFocus.pendingInvoices],
                ["Timesheet chờ duyệt", dashboard.quickFocus.timesheetsWaiting],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-slate-950/70"
                >
                  <span className="text-sm font-medium">{label}</span>
                  <span className="rounded-lg bg-white px-2 py-1 text-xs font-bold text-primary shadow-sm dark:bg-slate-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          const tone =
            item.tone === "rose"
              ? "bg-rose-500/10 text-rose-500"
              : item.tone === "violet"
                ? "bg-violet-500/10 text-violet-500"
                : "bg-blue-500/10 text-blue-500";

          return (
            <Card
              key={item.label}
              className="flex items-center justify-between rounded-2xl border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            >
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-bold">{item.value}</p>
              </div>
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl",
                  tone,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.65fr)_minmax(310px,0.85fr)]">
        <Card className="rounded-2xl border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold">Dòng tiền 6 tháng</h3>
              <p className="mt-1 text-sm text-slate-500">
                Doanh thu đã nhận và chi phí theo tháng.
              </p>
            </div>
            <CircleDollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cashFlowData}
                margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="receivedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.36} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  opacity={0.12}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  tickFormatter={(value) =>
                    formatChartAmount(value, dashboard.organization.currency)
                  }
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatMoney(
                      String(value ?? 0),
                      dashboard.organization.currency,
                    ),
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid #334155",
                    background: "#0f172a",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="received"
                  name="Đã nhận"
                  stroke="#3b82f6"
                  fill="url(#receivedGradient)"
                  strokeWidth={2.5}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Chi phí"
                  stroke="#f97316"
                  fill="transparent"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="rounded-2xl border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div>
            <h3 className="font-bold">Phân bổ công việc</h3>
            <p className="mt-1 text-sm text-slate-500">
              Theo trạng thái hiện tại.
            </p>
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={3}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value ?? 0} công việc`, ""]}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid #334155",
                    background: "#0f172a",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {taskStatusData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: chartColors[index % chartColors.length],
                  }}
                />
                <span className="truncate text-slate-500">{item.name}</span>
                <span className="ml-auto font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function OrganizationDashboard() {
  const {
    dashboard,
    organizations,
    loading,
    selectingOrganization,
    error,
    reload,
    selectOrganization,
  } = useOrganizationDashboard();

  if (loading) return <DashboardLoading />;
  if (error?.code === "ORG_CONTEXT_REQUIRED")
    return (
      <OrganizationSelector
        organizations={organizations}
        selecting={selectingOrganization}
        onSelect={selectOrganization}
      />
    );
  if (error || !dashboard)
    return (
      <DashboardError
        message={error?.message ?? "Không có dữ liệu dashboard."}
        onRetry={reload}
      />
    );

  return <DashboardContent dashboard={dashboard} />;
}
