// src/app/router/guards/RequireAuth.tsx
import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/app/store"
import { AppLoading } from "@/components/layout/AppLoading";

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const user = useAppSelector(s => s.auth.user);
  const status = useAppSelector(s => s.auth.status);

  // 🔥 Đợi cho đến khi AppInitializer load xong
  if (status === "loading") return <AppLoading />;

  // Nếu đã load xong và không có user → redirect
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
