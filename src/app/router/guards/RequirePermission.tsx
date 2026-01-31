// src/app/router/guards/RequirePermission.tsx
import { type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/app/store"

export function RequirePermission({
  permission,
  children,
}: {
  permission: string
  children: ReactNode
}) {
  const user = useAppSelector((s) => s.auth.user)
  const hasPerm = user?.permissions?.includes(permission)

  if (!user || !hasPerm) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}
