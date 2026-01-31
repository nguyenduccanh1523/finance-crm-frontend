"use client";

import { useAppSelector, useAppDispatch } from "@/app/store";
import { clearUser } from "@/app/store/authSlice";
import { useNavigate } from "react-router-dom";
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

  const initials =
    user?.fullName?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <header className="flex h-20 items-center justify-between px-10 bg-transparent">
      
      {/* LEFT — Breadcrumb or Page Title (optional) */}
      <h2 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200">
        My Finance Dashboard
      </h2>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4">
        
        {/* THEME SWITCH */}
        <button
          onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* LANGUAGE */}
        <LanguageSwitcher />

        {/* AVATAR DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-3 py-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition">
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
