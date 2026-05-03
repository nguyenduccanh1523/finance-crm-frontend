import { NavLink } from "react-router-dom";
import { Building2 } from "lucide-react";
import { organizationNavItems } from "@/page/app/organization/_config/organization-nav.config";
import { cn } from "@/lib/utils/utils";

interface OrganizationSidebarProps {
  sidebarOpen: boolean;
}

export function OrganizationSidebar({ sidebarOpen }: OrganizationSidebarProps) {
  return (
    <aside
      className={cn(
        "h-full shrink-0 border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-950",
        sidebarOpen ? "w-[175px]" : "w-[56px]"
      )}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b border-slate-200 px-2.5 dark:border-slate-800",
            sidebarOpen ? "justify-start" : "justify-center"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 dark:bg-white dark:text-slate-950 dark:ring-slate-700">
              <Building2 className="h-4 w-4" />
            </div>

            {sidebarOpen && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-4 text-slate-950 dark:text-white">
                  CRM Suite
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  Workspace
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="custom-scroll flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-1.5 py-3">
          {organizationNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app/organization"}
                title={!sidebarOpen ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "group relative flex h-9 items-center rounded-xl text-sm font-medium transition-all duration-200",
                    sidebarOpen
                      ? "justify-start gap-2.5 px-2.5"
                      : "justify-center px-0",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        item.badge === "AI" &&
                          !isActive &&
                          "text-blue-500 dark:text-blue-400"
                      )}
                    />

                    {sidebarOpen && (
                      <>
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>

                        {item.badge === "AI" && (
                          <span
                            className={cn(
                              "inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[10px] font-bold tracking-wide shadow-sm transition-all",
                              isActive
                                ? "bg-white/20 text-white ring-1 ring-white/20"
                                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/20 group-hover:scale-105"
                            )}
                          >
                            AI
                          </span>
                        )}
                      </>
                    )}

                    {!sidebarOpen && item.badge === "AI" && (
                      <span
                        className={cn(
                          "absolute right-1.5 top-1.5 h-2 w-2 rounded-full ring-2 ring-white dark:ring-slate-950",
                          isActive
                            ? "bg-white"
                            : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        )}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}