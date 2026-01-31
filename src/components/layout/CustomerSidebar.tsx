"use client";

import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface CustomerSidebarProps {
  navItems: { path: string; label: string; icon: React.ReactNode }[];
  title: string;
  onWidthChange?: (width: number) => void;
}

export function CustomerSidebar({ navItems, title, onWidthChange }: CustomerSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const width = collapsed ? 80 : 270;

  useEffect(() => {
    onWidthChange?.(width);
  }, [collapsed, width, onWidthChange]);

  return (
    <aside
      className={cn(
        "flex h-full flex-col pt-6 pb-4 rounded-r-2xl bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-r shadow-lg transition-all duration-300",
        collapsed ? "w-20 px-3" : "w-72 px-6"
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
          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2 text-sm">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all",
                collapsed ? "justify-center" : "justify-start",
                "hover:bg-blue-100/70 dark:hover:bg-gray-800",
                isActive &&
                  "bg-blue-600 text-white shadow-md hover:bg-blue-700"
              )
            }
          >
            <div className="text-xl">{item.icon}</div>
            {!collapsed && <span className="text-base">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
