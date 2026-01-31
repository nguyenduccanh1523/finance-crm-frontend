"use client";

import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import type { NavItem } from "@/app/router/nav-config";

interface AppSidebarProps {
  navItems: NavItem[];
  title: string;
  onWidthChange?: (width: number) => void;
}

export function AppSidebar({ navItems, title, onWidthChange }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const width = collapsed ? 64 : 256;

  useEffect(() => {
    onWidthChange?.(width);
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-card/95 pt-6 transition-all duration-300",
        collapsed ? "w-16 px-2" : "w-64 px-4"
      )}
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        {!collapsed && <div className="text-xl font-semibold">{title}</div>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 hover:bg-muted transition"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* NAV */}
      <nav className="flex flex-1 flex-col gap-1 text-sm custom-scroll overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-2 py-2 text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground",
                isActive && "bg-muted text-foreground font-medium"
              )
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
