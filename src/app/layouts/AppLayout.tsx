"use client";

import { useState, type SetStateAction } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/store";
import { CustomerSidebar } from "@/components/layout/CustomerSidebar";
import { CustomerHeader } from "@/components/layout/CustomerHeader";
import { appNavItems } from "@/app/router/nav-config";

export function AppLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(270);
  const theme = useAppSelector((s) => s.ui.theme);

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${theme === "dark" ? "dark" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 -z-10" />

      {/* SIDEBAR FIXED */}
      <div className="fixed top-0 left-0 h-full z-40 shadow-xl">
        <CustomerSidebar
          navItems={appNavItems}
          title="My Finance"
          onWidthChange={(w: SetStateAction<number>) => setSidebarWidth(w)}
        />
      </div>

      {/* MAIN AREA */}
      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* HEADER FIXED */}
        <div
          className="fixed top-0 right-0 z-30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300"
          style={{ left: sidebarWidth }}
        >
          <CustomerHeader />
        </div>

        {/* CONTENT */}
        <main className="mt-20 px-10 py-6 h-[calc(100vh-5rem)] overflow-y-auto custom-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
