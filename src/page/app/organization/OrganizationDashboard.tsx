import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Target,
  UsersRound,
  WalletCards,
} from "lucide-react";

const stats = [
  {
    label: "Active Clients",
    value: "128",
    change: "+12 this month",
    icon: UsersRound,
  },
  {
    label: "Running Projects",
    value: "24",
    change: "8 high priority",
    icon: BriefcaseBusiness,
  },
  {
    label: "Tasks Done",
    value: "342",
    change: "+18 today",
    icon: CheckCircle2,
  },
  {
    label: "Monthly Revenue",
    value: "$42.8k",
    change: "+9.4%",
    icon: WalletCards,
  },
];

const todayTasks = [
  ["Website redesign", "Design", "Due today", "High"],
  ["CRM onboarding", "Sales", "Tomorrow", "Medium"],
  ["Invoice follow-up", "Finance", "Today", "High"],
  ["Timesheet review", "HR", "Friday", "Low"],
];

const pipeline = [
  ["Lead", "42", "32%"],
  ["Qualified", "26", "48%"],
  ["Proposal", "14", "64%"],
  ["Closed", "8", "82%"],
];

export function OrganizationDashboard() {
  return (
    <div className="space-y-4 p-4 md:p-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            CRM Dashboard
          </h2>
          <p className="text-sm text-slate-500">
            Tổng quan khách hàng, dự án, công việc và doanh thu trong workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded-xl">
            <CalendarDays className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button size="sm" className="h-9 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.label}
              className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">
                    {item.change}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Today Workload</h3>
              <p className="text-xs text-slate-500">
                Các task quan trọng cần xử lý trong ngày.
              </p>
            </div>

            <Button variant="ghost" size="sm" className="h-8 rounded-xl">
              View all
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950">
                <tr>
                  <th className="px-3 py-2 font-medium">Task</th>
                  <th className="px-3 py-2 font-medium">Module</th>
                  <th className="px-3 py-2 font-medium">Due</th>
                  <th className="px-3 py-2 font-medium">Priority</th>
                </tr>
              </thead>
              <tbody>
                {todayTasks.map((row) => (
                  <tr
                    key={row[0]}
                    className="border-t border-slate-200 dark:border-slate-800"
                  >
                    {row.map((cell, index) => (
                      <td key={index} className="px-3 py-2 text-sm">
                        {index === 3 ? (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium dark:bg-slate-800">
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Sales Pipeline</h3>
            </div>

            <div className="space-y-3">
              {pipeline.map((item) => (
                <div key={item[0]}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium">{item[0]}</span>
                    <span className="text-slate-500">{item[1]} deals</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-slate-900 dark:bg-white"
                      style={{ width: item[2] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Quick Focus</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <span>Follow-up clients</span>
                <span className="text-xs text-slate-500">14</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <span>Pending invoices</span>
                <span className="text-xs text-slate-500">6</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <span>Timesheet waiting</span>
                <span className="text-xs text-slate-500">9</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Upcoming meetings",
            value: "7",
            icon: CalendarDays,
          },
          {
            title: "Late timesheets",
            value: "5",
            icon: Clock3,
          },
          {
            title: "Monthly goals",
            value: "76%",
            icon: Target,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="flex items-center justify-between rounded-2xl border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Icon className="h-5 w-5" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}