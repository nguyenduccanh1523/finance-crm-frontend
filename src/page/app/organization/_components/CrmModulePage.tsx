import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  CalendarDays,
  CheckSquare2,
  Clock3,
  MessageCircle,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Target,
  Umbrella,
  UserCheck,
  UsersRound,
  WalletCards,
  BriefcaseBusiness,
  type LucideIcon,
} from "lucide-react";

export type CrmModuleKey =
  | "calendar"
  | "clients"
  | "projects"
  | "tasks"
  | "attendance"
  | "timesheet"
  | "leave"
  | "reports"
  | "finance"
  | "configuration"
  | "insights"
  | "goals"
  | "chat";

type CrmModulePreset = {
  title: string;
  description: string;
  icon: LucideIcon;
  primaryAction: string;
  stats: string[][];
  columns: string[];
  rows: string[][];
  sideTitle: string;
};

const presets: Record<CrmModuleKey, CrmModulePreset> = {
  calendar: {
    title: "Calendar",
    description: "Quản lý lịch họp, lịch chăm sóc khách hàng và deadline.",
    icon: CalendarDays,
    primaryAction: "New Event",
    stats: [
      ["Today events", "8"],
      ["Meetings", "5"],
      ["Deadlines", "3"],
      ["Available slots", "12"],
    ],
    columns: ["Event", "Owner", "Time", "Status"],
    rows: [
      ["Client onboarding", "Anna", "09:30", "Confirmed"],
      ["Project sync", "Team A", "11:00", "Pending"],
      ["Invoice review", "Finance", "14:00", "Confirmed"],
    ],
    sideTitle: "Create quick event",
  },
  clients: {
    title: "Clients",
    description: "Theo dõi khách hàng, trạng thái chăm sóc và cơ hội bán hàng.",
    icon: UsersRound,
    primaryAction: "New Client",
    stats: [
      ["Total clients", "128"],
      ["New leads", "24"],
      ["Follow-up", "16"],
      ["High value", "9"],
    ],
    columns: ["Client", "Owner", "Stage", "Last Contact"],
    rows: [
      ["Acme Corp", "David", "Proposal", "Today"],
      ["Blue Ocean", "Anna", "Qualified", "Yesterday"],
      ["Nova Studio", "John", "Lead", "2 days ago"],
    ],
    sideTitle: "Add client",
  },
  projects: {
    title: "Projects",
    description: "Quản lý dự án, tiến độ, team phụ trách và deadline.",
    icon: BriefcaseBusiness,
    primaryAction: "New Project",
    stats: [
      ["Running", "24"],
      ["At risk", "4"],
      ["Completed", "82"],
      ["This month", "7"],
    ],
    columns: ["Project", "Manager", "Progress", "Due"],
    rows: [
      ["CRM redesign", "Sarah", "72%", "May 12"],
      ["Finance module", "David", "48%", "May 18"],
      ["Mobile app", "Anna", "34%", "Jun 02"],
    ],
    sideTitle: "Create project",
  },
  tasks: {
    title: "Tasks",
    description: "Theo dõi task, priority, assignee và trạng thái thực hiện.",
    icon: CheckSquare2,
    primaryAction: "New Task",
    stats: [
      ["Open tasks", "76"],
      ["Due today", "12"],
      ["Blocked", "5"],
      ["Done", "342"],
    ],
    columns: ["Task", "Assignee", "Priority", "Status"],
    rows: [
      ["Fix login redirect", "Minh", "High", "Doing"],
      ["Design CRM sidebar", "Linh", "Medium", "Review"],
      ["Prepare report", "Huy", "Low", "Todo"],
    ],
    sideTitle: "Create task",
  },
  attendance: {
    title: "Attendance",
    description: "Theo dõi check-in, check-out, đi muộn và trạng thái nhân sự.",
    icon: UserCheck,
    primaryAction: "Add Record",
    stats: [
      ["Present", "42"],
      ["Late", "3"],
      ["Remote", "8"],
      ["Absent", "2"],
    ],
    columns: ["Employee", "Check-in", "Check-out", "Status"],
    rows: [
      ["Minh Nguyen", "08:57", "--", "Working"],
      ["Anna Tran", "09:12", "--", "Late"],
      ["David Le", "Remote", "--", "Online"],
    ],
    sideTitle: "Manual attendance",
  },
  timesheet: {
    title: "Timesheet",
    description: "Quản lý giờ làm, log work và duyệt timesheet.",
    icon: Clock3,
    primaryAction: "Log Time",
    stats: [
      ["Hours today", "286"],
      ["Waiting review", "9"],
      ["Approved", "34"],
      ["Overtime", "18h"],
    ],
    columns: ["Member", "Project", "Hours", "Status"],
    rows: [
      ["Minh Nguyen", "CRM redesign", "7.5h", "Submitted"],
      ["Anna Tran", "Finance module", "8h", "Approved"],
      ["David Le", "Mobile app", "6h", "Draft"],
    ],
    sideTitle: "Quick log time",
  },
  leave: {
    title: "Leave / Absence",
    description: "Quản lý nghỉ phép, nghỉ ốm, vắng mặt và phê duyệt.",
    icon: Umbrella,
    primaryAction: "New Request",
    stats: [
      ["Pending", "6"],
      ["Approved", "18"],
      ["Rejected", "2"],
      ["Remaining avg", "8.5d"],
    ],
    columns: ["Employee", "Type", "Date", "Status"],
    rows: [
      ["Anna Tran", "Annual leave", "May 10", "Pending"],
      ["David Le", "Sick leave", "May 08", "Approved"],
      ["Huy Pham", "Remote", "Today", "Approved"],
    ],
    sideTitle: "Create leave request",
  },
  reports: {
    title: "Reports",
    description: "Báo cáo doanh thu, hiệu suất, nhân sự và tiến độ dự án.",
    icon: BarChart3,
    primaryAction: "New Report",
    stats: [
      ["Reports", "32"],
      ["Scheduled", "8"],
      ["Exported", "124"],
      ["Shared", "19"],
    ],
    columns: ["Report", "Owner", "Range", "Status"],
    rows: [
      ["Monthly revenue", "Finance", "This month", "Ready"],
      ["Task performance", "PM", "Last 30d", "Draft"],
      ["Attendance summary", "HR", "This week", "Ready"],
    ],
    sideTitle: "Generate report",
  },
  finance: {
    title: "Finance",
    description: "Quản lý hóa đơn, chi phí, doanh thu và thanh toán của CRM.",
    icon: WalletCards,
    primaryAction: "New Invoice",
    stats: [
      ["Revenue", "$42.8k"],
      ["Invoices", "36"],
      ["Pending", "$8.4k"],
      ["Expenses", "$12.1k"],
    ],
    columns: ["Invoice", "Client", "Amount", "Status"],
    rows: [
      ["INV-1024", "Acme Corp", "$2,400", "Paid"],
      ["INV-1025", "Blue Ocean", "$1,800", "Pending"],
      ["INV-1026", "Nova Studio", "$3,200", "Overdue"],
    ],
    sideTitle: "Create invoice",
  },
  configuration: {
    title: "Configuration",
    description: "Cấu hình workspace, role, permission, workflow và module CRM.",
    icon: Settings2,
    primaryAction: "New Config",
    stats: [
      ["Roles", "5"],
      ["Workflows", "8"],
      ["Modules", "14"],
      ["Automations", "12"],
    ],
    columns: ["Setting", "Scope", "Updated By", "Status"],
    rows: [
      ["Client stages", "CRM", "Admin", "Active"],
      ["Task workflow", "Project", "Manager", "Active"],
      ["Leave policy", "HR", "Admin", "Draft"],
    ],
    sideTitle: "Quick setting",
  },
  insights: {
    title: "Insights",
    description: "AI insight cho khách hàng, dự án, tài chính và hiệu suất team.",
    icon: Sparkles,
    primaryAction: "Run Insight",
    stats: [
      ["Insights", "18"],
      ["Risks", "5"],
      ["Suggestions", "21"],
      ["Confidence", "92%"],
    ],
    columns: ["Insight", "Module", "Impact", "Status"],
    rows: [
      ["Client follow-up risk", "Clients", "High", "Open"],
      ["Project delay warning", "Projects", "Medium", "Open"],
      ["Cost anomaly", "Finance", "High", "Review"],
    ],
    sideTitle: "Ask AI insight",
  },
  goals: {
    title: "Goals",
    description: "Theo dõi mục tiêu doanh thu, team, dự án và năng suất.",
    icon: Target,
    primaryAction: "New Goal",
    stats: [
      ["Active goals", "12"],
      ["On track", "8"],
      ["At risk", "3"],
      ["Completed", "24"],
    ],
    columns: ["Goal", "Owner", "Progress", "Due"],
    rows: [
      ["Increase revenue 20%", "Sales", "76%", "Q2"],
      ["Reduce late tasks", "PM", "54%", "May"],
      ["Improve attendance", "HR", "88%", "Q2"],
    ],
    sideTitle: "Create goal",
  },
  chat: {
    title: "Chat",
    description: "Trao đổi nội bộ theo client, project, task hoặc team.",
    icon: MessageCircle,
    primaryAction: "New Chat",
    stats: [
      ["Channels", "18"],
      ["Unread", "24"],
      ["Mentions", "7"],
      ["Pinned", "9"],
    ],
    columns: ["Channel", "Last Message", "Owner", "Status"],
    rows: [
      ["#crm-sales", "Client updated", "Sales", "Active"],
      ["#project-alpha", "Need review", "PM", "Active"],
      ["#finance", "Invoice sent", "Finance", "Active"],
    ],
    sideTitle: "Start conversation",
  },
};

interface CrmModulePageProps {
  module: CrmModuleKey;
}

export function CrmModulePage({ module }: CrmModulePageProps) {
  const preset = presets[module];
  const Icon = preset.icon;

  return (
    <div className="space-y-4 p-4 md:p-5">
      <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {preset.title}
            </h2>
            <p className="text-sm text-slate-500">{preset.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={`Search ${preset.title.toLowerCase()}...`}
              className="h-9 rounded-xl bg-white pl-9 dark:bg-slate-900"
            />
          </div>

          <Button variant="outline" size="sm" className="h-9 rounded-xl">
            Filter
          </Button>

          <Button size="sm" className="h-9 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            {preset.primaryAction}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {preset.stats.map(([label, value]) => (
          <Card
            key={label}
            className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold">{preset.title} List</h3>
              <p className="text-xs text-slate-500">
                Compact table để thao tác nhanh trên cùng một màn hình.
              </p>
            </div>

            <Button variant="ghost" size="sm" className="h-8 rounded-xl">
              View all
            </Button>
          </div>

          <div className="crm-scrollbar overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950">
                <tr>
                  {preset.columns.map((col) => (
                    <th key={col} className="px-4 py-2 font-medium">
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-right font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {preset.rows.map((row) => (
                  <tr
                    key={row.join("-")}
                    className="border-t border-slate-200 dark:border-slate-800"
                  >
                    {row.map((cell, index) => (
                      <td key={index} className="px-4 py-3">
                        {index === row.length - 1 ? (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium dark:bg-slate-800">
                            {cell}
                          </span>
                        ) : (
                          <span className={index === 0 ? "font-medium" : ""}>
                            {cell}
                          </span>
                        )}
                      </td>
                    ))}

                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-8 rounded-xl">
                        Open
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold">{preset.sideTitle}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Form nhỏ gọn để tạo nhanh dữ liệu mà không phải chuyển trang.
          </p>

          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Name</label>
              <Input className="h-9 rounded-xl" placeholder="Enter name..." />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Owner</label>
              <Input className="h-9 rounded-xl" placeholder="Assign owner..." />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Status</label>
              <Input className="h-9 rounded-xl" placeholder="Draft / Active..." />
            </div>

            <Button className="h-9 w-full rounded-xl">
              Save quickly
            </Button>

            <Button variant="outline" className="h-9 w-full rounded-xl">
              Open full form
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}