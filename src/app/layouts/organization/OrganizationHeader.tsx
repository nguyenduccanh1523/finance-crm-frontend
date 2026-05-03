import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeftRight,
  Bell,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setTheme } from "@/app/store/uiSlice";
import { useLogout } from "@/lib/hooks/auth/useLogout";

interface OrganizationHeaderProps {
  organizationName: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSwitchWorkspace: () => void;
}

export function OrganizationHeader({
  organizationName,
  sidebarOpen,
  onToggleSidebar,
  onSwitchWorkspace,
}: OrganizationHeaderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const theme = useAppSelector((s) => s.ui.theme);
  const { logout } = useLogout();

  const handleToggleTheme = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"));
  };

  const dropdownItemClass =
    "cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[highlighted]:bg-slate-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800 dark:data-[highlighted]:bg-slate-800";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-slate-950 dark:text-white">
            {organizationName}
          </h1>
          <p className="truncate text-[11px] text-slate-500">
            CRM workspace
          </p>
        </div>
      </div>

      <div className="hidden w-[340px] items-center lg:flex">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search clients, projects, tasks..."
            className="h-9 rounded-xl bg-slate-50 pl-9 text-sm dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="h-9 rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleTheme}
          className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-9 w-9 rounded-xl bg-primary p-0 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {user?.fullName?.charAt(0) || "U"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-center gap-3 rounded-xl px-3 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                {user?.fullName?.charAt(0) || "U"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                  {user?.fullName || "Người dùng"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="my-2 bg-slate-200 dark:bg-slate-800" />

            <DropdownMenuItem className={dropdownItemClass}>
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt hồ sơ
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onSwitchWorkspace}
              className={dropdownItemClass}
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Chuyển Workspace
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-slate-200 dark:bg-slate-800" />

            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 focus:bg-red-50 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600 dark:hover:bg-red-950 dark:focus:bg-red-950 dark:data-[highlighted]:bg-red-950"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}