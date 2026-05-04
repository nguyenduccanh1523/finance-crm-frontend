import {
  LayoutDashboard,
  CalendarDays,
  UsersRound,
  BriefcaseBusiness,
  CheckSquare2,
  UserCheck,
  Clock3,
  Umbrella,
  BarChart3,
  WalletCards,
  Settings2,
  Sparkles,
  Target,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export type OrganizationNavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  group: "Main" | "Work" | "People" | "Business" | "System";
};

export const organizationNavItems: OrganizationNavItem[] = [
  {
    label: "Dashboard",
    path: "/app/organization",
    icon: LayoutDashboard,
    group: "Main",
  },
  {
    label: "Calendar",
    path: "/app/organization/calendar",
    icon: CalendarDays,
    group: "Main",
  },
  {
    label: "Clients",
    path: "/app/organization/clients",
    icon: UsersRound,
    group: "Business",
  },
  {
    label: "Projects",
    path: "/app/organization/projects",
    icon: BriefcaseBusiness,
    group: "Work",
  },
  {
    label: "Tasks",
    path: "/app/organization/tasks",
    icon: CheckSquare2,
    group: "Work",
  },
  {
    label: "Attendance",
    path: "/app/organization/attendance",
    icon: UserCheck,
    group: "People",
  },
  {
    label: "Timesheet",
    path: "/app/organization/timesheet",
    icon: Clock3,
    group: "People",
  },
  {
    label: "Leave / Absence",
    path: "/app/organization/leave",
    icon: Umbrella,
    group: "People",
  },
  {
    label: "Reports",
    path: "/app/organization/reports",
    icon: BarChart3,
    group: "Business",
  },
  {
    label: "Finance",
    path: "/app/organization/finance",
    icon: WalletCards,
    group: "Business",
  },
  {
    label: "Configuration",
    path: "/app/organization/configuration",
    icon: Settings2,
    group: "System",
  },
  {
    label: "Insights",
    path: "/app/organization/insights",
    icon: Sparkles,
    badge: "AI",
    group: "System",
  },
  {
    label: "Goals",
    path: "/app/organization/goals",
    icon: Target,
    group: "System",
  },
  {
    label: "Chat",
    path: "/app/organization/chat",
    icon: MessageCircle,
    group: "System",
  },
];

export const organizationBreadcrumbMap: Record<string, string> = {
  "/app/organization": "Dashboard",
  "/app/organization/calendar": "Calendar",
  "/app/organization/clients": "Clients",
  "/app/organization/projects": "Projects",
  "/app/organization/tasks": "Tasks",
  "/app/organization/attendance": "Attendance",
  "/app/organization/timesheet": "Timesheet",
  "/app/organization/leave": "Leave / Absence",
  "/app/organization/reports": "Reports",
  "/app/organization/finance": "Finance",
  "/app/organization/configuration": "Configuration",
  "/app/organization/insights": "Insights",
  "/app/organization/goals": "Goals",
  "/app/organization/chat": "Chat",
};