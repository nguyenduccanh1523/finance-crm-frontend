// src/app/router/guards/RequireAuth.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/store";
import { AppLoading } from "@/components/layout/AppLoading";
import { useEffect } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const user = useAppSelector((s) => s.auth.user);
  const status = useAppSelector((s) => s.auth.status);

  useEffect(() => {
    console.log(
      "🔄 RequireAuth useEffect - status changed:",
      status,
      "user:",
      user?.email,
    );
  }, [status, user]); // Re-log when status/user changes

  console.log("🔍 RequireAuth check - status:", status, "user:", user?.email);

  // 🔥 Show loading khi đang fetch /auth/me
  if (status === "loading") {
    console.log("⏳ RequireAuth: Show AppLoading...");
    return <AppLoading />;
  }

  // ✅ Nếu unauthenticated → redirect LOGIN ngay (không render 401 page)
  if (status === "unauthenticated" || !user) {
    console.log("🚫 RequireAuth: Redirect to /auth/login");
    return <Navigate to="/auth/login" replace />;
  }

  console.log("✅ RequireAuth: User authenticated, rendering children");
  return <>{children}</>;
}
