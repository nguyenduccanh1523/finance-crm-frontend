// src/app/router/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { AdminLayout } from "@/app/layouts/AdminLayout";
import { LoginPage } from "@/page/auth/LoginPage";
import { RequireAuth } from "./guards/RequireAuth";
import { RequireRole } from "./guards/RequireRole";
import { RegisterPage } from "@/page/auth/RegisterPage";
import { AppLayout } from "../layouts/AppLayout";
import { AdminHomePage } from "@/page/admin/AdminHomePage";
import { UserHomePage } from "@/page/app/user/UserHomePage";
import { TransactionsPage } from "@/page/app/transactions/TransactionsPage";
import { AdminAnalyticsPage } from "@/page/admin/AdminAnalyticsPage";
import { NoPermissionPage } from "@/page/system/NoPermissionPage";
import { NotFoundPage } from "@/page/system/NotFoundPage";
import { AdminDashboardPage } from "@/page/admin/AdminDashBoardPage";
import { BillingPage } from "@/page/billing/BillingPage";
import { CategoryPage } from "@/page/app/category/CategoryPage";
import { TagsPage } from "@/page/app/tags/TagsPage";
import { PersonalWorkspacePage } from "@/page/app/personal-workspace/PersonalWorkspacePage";
import { AccountPage } from "@/page/app/account/AccountPage";
import { RecurringRulesPage } from "@/page/app/recurring-rules";
import { BudgetsPage } from "@/page/app/budgets";
import { GoalsPage } from "@/page/app/goals";
import { InsightsPage } from "@/page/app/insights";
import ExchangeRatePage from "@/page/app/exchange-rate/ExchangeRatePage";
import { DocumentationPage } from "@/page/docs/DocumentationPage";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  // ===== DOCUMENTATION =====
  {
    path: "/docs",
    element: <DocumentationPage />,
  },
  // ===== ADMIN =====
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <RequireRole role="SUPER_ADMIN">
          <AdminLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminHomePage /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "analytics", element: <AdminAnalyticsPage /> },
      { path: "transactions", element: <TransactionsPage /> },
    ],
  },
  {
    path: "/app",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <UserHomePage /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "budgets", element: <BudgetsPage /> },
      { path: "goals", element: <GoalsPage /> },
      { path: "insights", element: <InsightsPage /> },
      { path: "exchange-rate", element: <ExchangeRatePage /> },
      { path: "recurring-rules", element: <RecurringRulesPage /> },
      { path: "categories", element: <CategoryPage /> },
      { path: "tags", element: <TagsPage /> },
      { path: "personal-workspace", element: <PersonalWorkspacePage /> },
      { path: "account", element: <AccountPage /> },
      { path: "billing", element: <BillingPage /> },
    ],
  },

  // DEFAULT: redirect
  {
    path: "/403",
    element: <NoPermissionPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
