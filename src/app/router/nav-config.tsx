import type { ReactNode } from "react";
import {
  LayoutDashboard,
  LineChart,
  Users,
  Wallet,
  Receipt,
} from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: ReactNode;
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
  "/app/billing": "Pricing",
};
