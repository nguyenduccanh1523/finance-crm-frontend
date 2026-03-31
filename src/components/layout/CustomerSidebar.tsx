"use client";

import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/utils";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { NavItem } from "@/app/router/nav-config";

interface CustomerSidebarProps {
  navItems: NavItem[];
  title: string;
  onWidthChange?: (width: number) => void;
}

export function CustomerSidebar({
  navItems,
  title,
  onWidthChange,
}: CustomerSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const width = collapsed ? 80 : 270;

  useEffect(() => {
    onWidthChange?.(width);
  }, [collapsed, width, onWidthChange]);

  // Check if any submenu item matches current path
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.submenu) {
        const isSubmenuActive = item.submenu.some(
          (sub) => sub.path === location.pathname,
        );
        if (isSubmenuActive) {
          setOpenSubmenu(item.label);
        }
      }
    });
  }, [location.pathname, navItems]);

  return (
    <aside
      className={cn(
        "flex h-full flex-col pt-6 pb-4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        collapsed ? "w-20 px-3" : "w-72 px-6",
      )}
    >
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </h1>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 text-sm">
        {navItems.map((item) => {
          const isSubmenuOpen = openSubmenu === item.label;
          const hasSubmenu = item.submenu && item.submenu.length > 0;

          return (
            <div key={item.label}>
              {hasSubmenu ? (
                <button
                  onClick={() =>
                    setOpenSubmenu(isSubmenuOpen ? null : item.label)
                  }
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all text-left",
                    collapsed ? "justify-center" : "justify-start",
                    "hover:bg-gray-200 dark:hover:bg-gray-800",
                  )}
                >
                  <div className="text-lg flex-shrink-0">{item.icon}</div>
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "transition-transform",
                          isSubmenuOpen && "rotate-180",
                        )}
                      />
                    </>
                  )}
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between gap-3 px-3 py-2 rounded-lg font-medium transition-all",
                      collapsed ? "justify-center" : "justify-start",
                      "hover:bg-gray-200 dark:hover:bg-gray-800",
                      isActive &&
                        "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg">{item.icon}</div>
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
                        item.badge.variant === "hot"
                          ? "bg-red-500/20 text-red-600 dark:text-red-400 dark:bg-red-900/40"
                          : item.badge.variant === "new"
                            ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 dark:bg-blue-900/40"
                            : item.badge.variant === "popular"
                              ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 dark:bg-purple-900/40"
                              : "bg-amber-500/20 text-amber-600 dark:text-amber-400 dark:bg-amber-900/40",
                      )}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </NavLink>
              )}

              {/* SUBMENU */}
              {hasSubmenu && isSubmenuOpen && !collapsed && (
                <div className="flex flex-col gap-1 pl-6 mt-1">
                  {item.submenu!.map((subitem) => (
                    <NavLink
                      to={subitem.path}
                      key={subitem.path}
                      end
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all text-sm",
                          "hover:bg-gray-200 dark:hover:bg-gray-800",
                          isActive &&
                            "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600",
                        )
                      }
                    >
                      <div className="text-base">{subitem.icon}</div>
                      <span>{subitem.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
