import { Button } from "@/components/ui/button";
import { Settings, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { setTheme } from "@/app/store/uiSlice";
import { useLogout } from "@/lib/hooks/auth/useLogout";

interface OrganizationHeaderProps {
  organizationName: string;
}

export function OrganizationHeader({
  organizationName,
}: OrganizationHeaderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const theme = useAppSelector((s) => s.ui.theme);
  const { logout } = useLogout();

  const handleToggleTheme = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"));
  };

  return (
    <header className="bg-white dark:bg-slate-800 light:bg-white border-b border-slate-200 dark:border-slate-700 light:border-slate-200 px-6 h-16 flex items-center justify-between transition-colors duration-300">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-white light:text-slate-900">
        {organizationName}
      </h1>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleTheme}
          className="rounded-lg text-slate-700 dark:text-slate-300 light:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 light:hover:bg-slate-100"
          title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-lg border-slate-300 dark:border-slate-600 light:border-slate-300 text-slate-700 dark:text-slate-300 light:text-slate-700"
        >
          <Settings className="w-4 h-4 mr-2" />
          Cài đặt
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 w-10 rounded-lg p-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
            >
              {user?.fullName?.charAt(0) || "U"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white light:text-slate-900 truncate">
                  {user?.fullName || "Người dùng"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt hồ sơ
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 light:focus:bg-red-50"
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
