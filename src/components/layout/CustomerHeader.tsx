"use client";

import { useAppSelector, useAppDispatch } from "@/app/store";
import { clearUser } from "@/app/store/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { breadcrumbMap } from "@/app/router/nav-config";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Moon, Sun } from "lucide-react";
import { setTheme } from "@/app/store/uiSlice";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CustomerHeader() {
  const user = useAppSelector((s) => s.auth.user);
  const theme = useAppSelector((s) => s.ui.theme);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const initials =
    user?.fullName?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  const pageTitle = breadcrumbMap[location.pathname] || "Dashboard";

  return (
    <header className="flex h-20 items-center justify-between px-10 bg-transparent">
      {/* LEFT — Dynamic Page Title */}
      <h2 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100">
        {pageTitle}
      </h2>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4">
        {/* PRICING BUTTON */}
        <button
          onClick={() => navigate("/app/billing")}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl dark:from-blue-400 dark:to-indigo-500 dark:hover:from-blue-500 dark:hover:to-indigo-600"
        >
          🎯 Pricing
        </button>

        {/* THEME SWITCH */}
        <button
          onClick={() =>
            dispatch(setTheme(theme === "dark" ? "light" : "dark"))
          }
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
        </button>

        {/* LANGUAGE */}
        <LanguageSwitcher />

        {/* AVATAR DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-700 px-3 py-2 shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-medium">
              {user?.fullName ?? user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/app/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/billing")}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/settings")}>
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                dispatch(clearUser());
                navigate("/auth/login");
              }}
              className="text-red-500"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
