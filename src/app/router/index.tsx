// src/app/router/index.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
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

// Docs Layout & Finance Pages
import { DocsLayout } from "@/page/docs/layout/DocsLayout";
import { IntroductionPage } from "@/page/docs/finance/IntroductionPage";
import { GettingStartedPage } from "@/page/docs/finance/GettingStartedPage";
import { FeaturesPage } from "@/page/docs/finance/FeaturesPage";
import { ExchangeRatePage as DocsExchangeRatePage } from "@/page/docs/finance/ExchangeRatePage";
import { AIIntegrationPage } from "@/page/docs/finance/AIIntegrationPage";
import { APIPage } from "@/page/docs/finance/APIPage";
import { PricingPage } from "@/page/docs/finance/PricingPage";
import { FAQPage } from "@/page/docs/finance/FAQPage";
import { WorkspaceChooserPage } from "@/page/workspace/WorkspaceChooserPage";


import { OrganizationLayout } from "@/app/layouts/OrganizationLayout";
import { OrganizationDashboard } from "@/page/app/organization/OrganizationDashboard";
import { CalendarPage } from "@/page/app/organization/calendar/CalendarPage";
import { ClientsPage } from "@/page/app/organization/clients/ClientsPage";
import { ProjectsPage } from "@/page/app/organization/projects/ProjectsPage";
import { TasksPage } from "@/page/app/organization/tasks/TasksPage";
import { AttendancePage } from "@/page/app/organization/attendance/AttendancePage";
import { TimesheetPage } from "@/page/app/organization/timesheet/TimesheetPage";
import { LeaveAbsencePage } from "@/page/app/organization/leave/LeaveAbsencePage";
import { ReportsPage } from "@/page/app/organization/reports/ReportsPage";
import { OrganizationFinancePage } from "@/page/app/organization/finance/OrganizationFinancePage";
import { ConfigurationPage } from "@/page/app/organization/configuration/ConfigurationPage";
import { OrganizationInsightsPage } from "@/page/app/organization/insights/OrganizationInsightsPage";
import { OrganizationGoalsPage } from "@/page/app/organization/goals/OrganizationGoalsPage";
import { ChatPage } from "@/page/app/organization/chat/ChatPage";


const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  // ===== WORKSPACE CHOOSER (for TESTER role) =====
  {
    path: "/workspace",
    element: (
      <RequireAuth>
        <RequireRole role="TESTER">
          <WorkspaceChooserPage />
        </RequireRole>
      </RequireAuth>
    ),
  },
  // ===== DOCUMENTATION =====
  {
    path: "/docs",
    element: <DocsLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/docs/finance/introduction" replace />,
      },
      {
        path: "finance",
        children: [
          { path: "introduction", element: <IntroductionPage /> },
          { path: "getting-started", element: <GettingStartedPage /> },
          { path: "features", element: <FeaturesPage /> },
          { path: "exchange-rate", element: <DocsExchangeRatePage /> },
          { path: "ai-integration", element: <AIIntegrationPage /> },
          { path: "api", element: <APIPage /> },
          { path: "pricing", element: <PricingPage /> },
          { path: "faq", element: <FAQPage /> },
        ],
      },
      // CRM Module routes will be added here in the future
    ],
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
  // ===== ORGANIZATION (CRM Mode) =====
  {
    path: "/app/organization",
    element: (
      <RequireAuth>
        <OrganizationLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <OrganizationDashboard /> },
      { path: "calendar", element: <CalendarPage /> },
      { path: "clients", element: <ClientsPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "attendance", element: <AttendancePage /> },
      { path: "timesheet", element: <TimesheetPage /> },
      { path: "leave", element: <LeaveAbsencePage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "finance", element: <OrganizationFinancePage /> },
      { path: "configuration", element: <ConfigurationPage /> },
      { path: "insights", element: <OrganizationInsightsPage /> },
      { path: "goals", element: <OrganizationGoalsPage /> },
      { path: "chat", element: <ChatPage /> },
    ],
  },

  // DEFAULT: error pages
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
