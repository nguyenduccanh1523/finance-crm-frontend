import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { type Organization } from "@/components/workspace-chooser";
import { useAppToast } from "@/components/common/toast/useToast";
import { OrganizationHeader } from "@/components/layout/OrganizationHeader";
import { OrganizationSidebar } from "@/components/layout/OrganizationSidebar";
import { useLogout } from "@/lib/hooks/auth/useLogout";

// Mock organizations data - replace with API call
const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "Acme Corporation",
    role: "admin",
    memberCount: 12,
  },
  {
    id: "org-2",
    name: "Tech Startup Inc",
    role: "member",
    memberCount: 5,
  },
  {
    id: "org-3",
    name: "Creative Agency",
    role: "admin",
    memberCount: 8,
  },
];

export function OrganizationLayout() {
  const navigate = useNavigate();
  const { showSuccess } = useAppToast();
  const { logout } = useLogout();

  const [selectedOrgId, setSelectedOrgId] = useState(mockOrganizations[0]?.id);
  const [organizations] = useState<Organization[]>(mockOrganizations);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentOrg = organizations.find((o) => o.id === selectedOrgId);

  const handleSelectOrganization = (orgId: string) => {
    setSelectedOrgId(orgId);
    showSuccess(
      `Đã chuyển sang ${organizations.find((o) => o.id === orgId)?.name}`,
    );
  };

  const handleSwitchWorkspace = () => {
    navigate("/workspace", { replace: true });
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 light:bg-white transition-colors duration-300">
      {/* Sidebar */}
      <OrganizationSidebar
        organizations={organizations}
        selectedOrgId={selectedOrgId}
        onSelectOrganization={handleSelectOrganization}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onLogout={logout}
        onSwitchWorkspace={handleSwitchWorkspace}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <OrganizationHeader
          organizationName={currentOrg?.name || "Organization"}
        />

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto custom-scroll">
          <Outlet context={{ selectedOrgId }} />
        </main>
      </div>
    </div>
  );
}
