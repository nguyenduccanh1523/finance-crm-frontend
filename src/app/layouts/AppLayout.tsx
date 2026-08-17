"use client";

import { useEffect, useState, type SetStateAction } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/store";
import { CustomerSidebar } from "@/components/layout/CustomerSidebar";
import { CustomerHeader } from "@/components/layout/CustomerHeader";
import { appNavItems } from "@/app/router/nav-config";

export function AppLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(270);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    const updateViewport = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setMobileSidebarOpen(false);
    };
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const contentOffset = isDesktop ? sidebarWidth : 0;

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${theme === "dark" ? "dark" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 -z-10" />

      <CustomerSidebar
        navItems={appNavItems}
        title="My Finance"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onWidthChange={(w: SetStateAction<number>) => setSidebarWidth(w)}
      />
      {mobileSidebarOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* MAIN AREA */}
      <div
        className="flex flex-1 flex-col transition-all duration-300"
      >
        {/* HEADER FIXED */}
        <div
          className="fixed top-0 right-0 z-30 border-b border-gray-200 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-800/70"
          style={{ left: contentOffset }}
        >
          <CustomerHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />
        </div>

        {/* CONTENT */}
        <main className="custom-scroll mt-16 h-[calc(100vh-4rem)] overflow-y-auto px-4 py-5 sm:px-6 lg:mt-20 lg:h-[calc(100vh-5rem)] lg:px-10 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
