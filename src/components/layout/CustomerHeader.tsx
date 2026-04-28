"use client";

import { useAppSelector, useAppDispatch } from "@/app/store";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "@/lib/hooks/auth/useLogout";
import { breadcrumbMap } from "@/app/router/nav-config";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { NotificationDropdown } from "@/components/common/NotificationDropdown";
import {
  Moon,
  Sun,
  ArrowRight,
  BookOpen,
  Zap,
  Layout,
  HelpCircle,
} from "lucide-react";
import { setTheme } from "@/app/store/uiSlice";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/utils";

interface NavSection {
  title: string;
  items: Array<{
    label: string;
    description: string;
    icon: React.ReactNode;
    path: string;
  }>;
}

const navSections: NavSection[] = [
  {
    title: "Documentation",
    items: [
      {
        label: "Getting Started",
        description: "Quick setup guide and first steps",
        icon: <Zap size={20} />,
        path: "/docs",
      },
      {
        label: "Features Guide",
        description: "Learn about all Finance CRM features",
        icon: <Layout size={20} />,
        path: "/docs",
      },
      {
        label: "API Documentation",
        description: "API reference and integration guides",
        icon: <BookOpen size={20} />,
        path: "/docs",
      },
      {
        label: "AI & Integrations",
        description: "Advanced AI features and Agent API",
        icon: <HelpCircle size={20} />,
        path: "/docs",
      },
    ],
  },
];

export function CustomerHeader() {
  const user = useAppSelector((s) => s.auth.user);
  const theme = useAppSelector((s) => s.ui.theme);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();

  const initials =
    user?.fullName?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  const pageTitle = breadcrumbMap[location.pathname] || "Dashboard";
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-8">
        {/* LEFT — Logo + Page Title */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate("/app")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">$</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Finance
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                CRM
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-700" />

          {/* Dynamic Page Title */}
          <div className="hidden sm:flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden lg:flex ml-auto">
            <NavigationMenuList>
              {navSections.map((section) => (
                <NavigationMenuItem key={section.title}>
                  <NavigationMenuTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800/50">
                    {section.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[450px] p-4">
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                              "w-full group relative rounded-lg px-4 py-3 transition-all duration-200 text-left",
                              "hover:bg-gray-100 dark:hover:bg-gray-800/70",
                              isActive(item.path) &&
                                "bg-blue-50 dark:bg-blue-900/20",
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5",
                                  isActive(item.path) &&
                                    "text-blue-600 dark:text-blue-400",
                                )}
                              >
                                {item.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                                    {item.label}
                                  </span>
                                  <ArrowRight
                                    size={12}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                  />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-3">
          {/* Page Title Mobile */}
          <div className="sm:hidden">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
              {pageTitle}
            </p>
          </div>

          {/* Theme Switch */}
          <button
            onClick={() =>
              dispatch(setTheme(theme === "dark" ? "light" : "dark"))
            }
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>

          {/* Notification Dropdown */}
          <NotificationDropdown />

          {/* Language */}
          <LanguageSwitcher />

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-3 py-2 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all border border-blue-200 dark:border-blue-800/50">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                    {initials}
                  </AvatarFallback>
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
              <DropdownMenuItem onClick={() => navigate("/app/settings")}>
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-500 dark:text-red-400"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
