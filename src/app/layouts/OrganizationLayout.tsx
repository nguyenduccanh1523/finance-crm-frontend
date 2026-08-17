import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { OrganizationSidebar } from "@/app/layouts/organization/OrganizationSidebar";
import { OrganizationHeader } from "@/app/layouts/organization/OrganizationHeader";
import { axiosClient } from "@/lib/api/axiosClient";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setUser } from "@/app/store/authSlice";

export function OrganizationLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Mặc định mở sidebar
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );

  const refreshAuthContext = useCallback(async () => {
    try {
      const response = await axiosClient.get("/auth/me");
      dispatch(setUser(response.data.data));
    } catch {
      // Dashboard renders the organization/authentication error when needed.
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("organization-context-changed", refreshAuthContext);
    return () => {
      window.removeEventListener(
        "organization-context-changed",
        refreshAuthContext,
      );
    };
  }, [refreshAuthContext]);

  useEffect(() => {
    const closeSidebarOnMobile = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", closeSidebarOnMobile);
    return () => window.removeEventListener("resize", closeSidebarOnMobile);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <OrganizationSidebar
        sidebarOpen={sidebarOpen}
        onClose={() => {
          if (window.innerWidth < 1024) setSidebarOpen(false);
        }}
      />
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <OrganizationHeader
          organizationName={
            user?.activeOrganization?.organization.name || "CRM Workspace"
          }
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onSwitchWorkspace={() => navigate("/workspace")}
        />

        <main className="custom-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
