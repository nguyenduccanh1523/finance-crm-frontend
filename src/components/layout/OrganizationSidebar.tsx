import { Button } from "@/components/ui/button";
import {
  Menu,
  LayoutDashboard,
  Users,
  FolderOpen,
  Settings,
  ChevronLeft,
  LogOut,
  ArrowLeftRight,
} from "lucide-react";
import {
  OrganizationSwitcher,
  type Organization,
} from "@/components/workspace-chooser";

interface OrganizationSidebarProps {
  organizations: Organization[];
  selectedOrgId: string;
  onSelectOrganization: (orgId: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onSwitchWorkspace: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "#",
  },
  {
    label: "Teams",
    icon: Users,
    href: "#",
  },
  {
    label: "Projects",
    icon: FolderOpen,
    href: "#",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "#",
  },
];

export function OrganizationSidebar({
  organizations,
  selectedOrgId,
  onSelectOrganization,
  sidebarOpen,
  onToggleSidebar,
  onLogout,
  onSwitchWorkspace,
}: OrganizationSidebarProps) {
  return (
    <aside
      className={`bg-white dark:bg-slate-800 light:bg-white border-r border-slate-200 dark:border-slate-700 light:border-slate-200 flex flex-col h-screen transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 light:border-slate-200">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
              CRM
            </div>
            <span className="font-semibold text-slate-900 dark:text-white light:text-slate-900">
              CRM Pro
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Thu gọn" : "Mở rộng"}
          className="h-8 w-8 rounded-lg text-slate-700 dark:text-slate-300 light:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 light:hover:bg-slate-100"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Organization Switcher */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 light:border-slate-200">
        {sidebarOpen ? (
          <OrganizationSwitcher
            organizations={organizations}
            currentOrgId={selectedOrgId}
            onSelect={onSelectOrganization}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:shadow-md transition-shadow"
            title={organizations.find((o) => o.id === selectedOrgId)?.name}
          >
            {organizations.find((o) => o.id === selectedOrgId)?.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto custom-scroll px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return sidebarOpen ? (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 light:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 light:hover:bg-slate-100 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ) : (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 dark:text-slate-300 light:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 light:hover:bg-slate-100 transition-colors"
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-200 dark:border-slate-700 light:border-slate-200 p-3 space-y-2">
        {sidebarOpen ? (
          <>
            <Button
              variant="outline"
              className="w-full justify-start rounded-lg border-slate-300 dark:border-slate-600 light:border-slate-300 text-slate-700 dark:text-slate-300 light:text-slate-700"
              onClick={onSwitchWorkspace}
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Đổi Workspace
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 dark:text-red-500 light:text-red-600 hover:text-red-700 dark:hover:text-red-400 light:hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 light:hover:bg-red-50 rounded-lg transition-colors"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="w-full h-10 rounded-lg p-0 border-slate-300 dark:border-slate-600 light:border-slate-300 text-slate-700 dark:text-slate-300 light:text-slate-700"
              onClick={onSwitchWorkspace}
              title="Đổi Workspace"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              className="w-full h-10 rounded-lg p-0 text-red-600 dark:text-red-500 light:text-red-600 hover:text-red-700 dark:hover:text-red-400 light:hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 light:hover:bg-red-50 transition-colors"
              onClick={onLogout}
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}
