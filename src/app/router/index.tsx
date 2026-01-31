// src/app/router/index.tsx
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
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

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
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
    children: [{ index: true, element: <UserHomePage /> }],
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
