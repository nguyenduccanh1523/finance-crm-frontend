// src/app/layouts/AdminLayout.tsx
"use client";

import { useState } from "react";
import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { adminNavItems } from "@/app/router/nav-config";

export function AdminLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(256);

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">

      {/* SIDEBAR FIXED */}
      <div className="fixed top-0 left-0 h-full z-40">
        <AppSidebar
          navItems={adminNavItems}
          title="Finance CRM"
          onWidthChange={setSidebarWidth}
        />
      </div>

      {/* MAIN WRAPPER */}
      <div
        className="flex flex-1 flex-col transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >

        {/* HEADER FIXED */}
        <div
          className="fixed top-0 right-0 z-30 border-b bg-background/80 backdrop-blur"
          style={{ left: sidebarWidth }}
        >
          <AppHeader section="admin" />
        </div>

        {/* OUTLET AREA (scroll only center) */}
        <main
          className="mt-16 px-6 py-4 h-[calc(100vh-4rem)] overflow-y-auto custom-scroll"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
