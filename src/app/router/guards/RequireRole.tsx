// src/app/router/guards/RequireRole.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/store";
import type { Role } from "@/app/store/authSlice";

export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const user = useAppSelector((s) => s.auth.user);

  if (!user) return <Navigate to="/403" replace />;

  const roles = user.roles || [];

  // SUPER_ADMIN luôn có full quyền
  if (roles.includes("SUPER_ADMIN")) return <>{children}</>;

  // check role cụ thể
  if (!roles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
