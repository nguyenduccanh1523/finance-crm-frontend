"use client";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { setLanguage, setTheme } from "@/app/store/uiSlice";
import { clearUser } from "@/app/store/authSlice";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Moon, Sun, Globe } from "lucide-react";
import { breadcrumbMap } from "@/app/router/nav-config";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

export function AppHeader({ section }: { section: "admin" | "app" }) {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const theme = useAppSelector((s) => s.ui.theme);
  const language = useAppSelector((s) => s.ui.language);

  const { i18n } = useTranslation("common");

  const isDark = theme === "dark";

  // COMPUTE BREADCRUMB
  const crumbs = useMemo(() => {
    const root = section === "admin" ? "/admin" : "/app";
    const rootLabel = section === "admin" ? "Admin" : "App";

    if (pathname === root) {
      return [{ label: rootLabel, path: root, isCurrent: true }];
    }

    const label = breadcrumbMap[pathname] ?? "";

    return [
      { label: rootLabel, path: root, isCurrent: false },
      { label, path: pathname, isCurrent: true },
    ];
  }, [pathname]);

  // ACTIONS
  const toggleTheme = () => dispatch(setTheme(isDark ? "light" : "dark"));

  const toggleLanguage = () => {
    const next = language === "vi" ? "en" : "vi";
    dispatch(setLanguage(next));
    i18n.changeLanguage(next);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/auth/login", { replace: true });
  };

  const initials = user?.fullName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?";
  const flag = language === "vi" ? "🇻🇳" : "🇺🇸";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md shadow-sm">
      
      {/* LEFT: BREADCRUMB */}
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((c, idx) => (
            <BreadcrumbItem key={c.path}>
              {c.isCurrent ? (
                <BreadcrumbPage className="font-medium">{c.label}</BreadcrumbPage>
              ) : (
                <>
                  <Link to={c.path} className="text-muted-foreground hover:text-foreground transition">
                    {c.label}
                  </Link>
                  {idx < crumbs.length - 1 && <BreadcrumbSeparator />}
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4">

        {/* Theme Switch */}
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 hover:bg-muted transition"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-300 transition-transform duration-300 rotate-90" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600 transition-transform duration-300" />
          )}
        </button>

        {/* Language Switch */}
        <LanguageSwitcher />


        <Separator orientation="vertical" className="h-6" />

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full bg-card px-3 py-1 shadow hover:bg-accent transition">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {user?.fullName ?? user?.email}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              {user?.fullName ?? user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app")}>
              Hồ sơ cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
