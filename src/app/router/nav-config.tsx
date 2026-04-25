import type { ReactNode } from "react";
import {
  LayoutDashboard,
  LineChart,
  Users,
  Wallet,
  Receipt,
  Folder,
  Tag,
  Briefcase,
  CreditCard,
  Calendar,
  PieChart,
  Target,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: ReactNode;
  submenu?: NavItem[];
  badge?: {
    text: string;
    variant?: "hot" | "new" | "popular" | "featured";
  };
};

export const adminNavItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    label: "Transactions",
    path: "/admin/transactions",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    label: "Manage Users",
    path: "/admin/users",
    icon: <Users className="h-4 w-4" />,
  },
];

export const appNavItems: NavItem[] = [
  {
    label: "Overview",
    path: "/app",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Transactions",
    path: "/app/transactions",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    label: "💰 Budgets",
    path: "/app/budgets",
    icon: <PieChart className="h-4 w-4" />,
    badge: { text: "Hot", variant: "hot" },
  },
  {
    label: "🎯 Goals",
    path: "/app/goals",
    icon: <Target className="h-4 w-4" />,
    badge: { text: "Hot", variant: "hot" },
  },
  {
    label: "💡 Insights",
    path: "/app/insights",
    icon: <Lightbulb className="h-4 w-4" />,
    badge: { text: "New", variant: "new" },
  },
  {
    label: "💱 Exchange Rate",
    path: "/app/exchange-rate",
    icon: <TrendingUp className="h-4 w-4" />,
    badge: { text: "New", variant: "new" },
  },
  {
    label: "Recurring Rules",
    path: "/app/recurring-rules",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    label: "Catalog",
    path: "#",
    icon: <Folder className="h-4 w-4" />,
    submenu: [
      {
        label: "Categories",
        path: "/app/categories",
        icon: <Folder className="h-4 w-4" />,
      },
      {
        label: "Tags",
        path: "/app/tags",
        icon: <Tag className="h-4 w-4" />,
      },
    ],
  },
  {
    label: "Personal Workspace",
    path: "/app/personal-workspace",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    label: "Account",
    path: "/app/account",
    icon: <CreditCard className="h-4 w-4" />,
  },
  {
    label: "Pricing",
    path: "/app/billing",
    icon: <Receipt className="h-4 w-4" />,
  },
];

// Map để breadcrumb hiển thị tên trang
export const breadcrumbMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/transactions": "Transactions",
  "/admin/manage-users": "Manage Users",
  "/app": "Overview",
  "/app/transactions": "Transactions",
  "/app/budgets": "Budget Management",
  "/app/goals": "Financial Goals",
  "/app/insights": "Insights & Suggestions",
  "/app/recurring-rules": "Recurring Rules",
  "/app/categories": "Categories",
  "/app/tags": "Tags",
  "/app/personal-workspace": "Personal Workspace",
  "/app/account": "Account",
  "/app/billing": "Pricing",
  "/app/exchange-rate": "Exchange Rate",
};
