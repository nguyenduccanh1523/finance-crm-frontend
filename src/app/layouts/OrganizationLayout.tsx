import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { OrganizationSidebar } from "@/app/layouts/organization/OrganizationSidebar";
import { OrganizationHeader } from "@/app/layouts/organization/OrganizationHeader";

export function OrganizationLayout() {
  const navigate = useNavigate();

  // Mặc định mở sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <OrganizationSidebar sidebarOpen={sidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <OrganizationHeader
          organizationName="Three Nest CRM"
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