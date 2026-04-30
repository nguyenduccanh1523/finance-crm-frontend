import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface Organization {
  id: string;
  name: string;
  avatar?: string;
  role: "admin" | "member";
  memberCount?: number;
}

interface OrganizationSwitcherProps {
  organizations: Organization[];
  currentOrgId: string;
  onSelect: (orgId: string) => void;
  onCreateNew?: () => void;
}

export function OrganizationSwitcher({
  organizations,
  currentOrgId,
  onSelect,
  onCreateNew,
}: OrganizationSwitcherProps) {
  const [open, setOpen] = useState(false);
  const currentOrg = organizations.find((org) => org.id === currentOrgId);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-12 px-4 rounded-lg border-slate-300 dark:border-slate-600 light:border-slate-300 text-slate-700 dark:text-slate-300 light:text-slate-700"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {currentOrg ? getInitials(currentOrg.name) : "?"}
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white light:text-slate-900 truncate">
                {currentOrg?.name || "Chọn tổ chức"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 light:text-slate-500 truncate">
                {currentOrg?.role === "admin" ? "Quản trị viên" : "Thành viên"}
              </p>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 opacity-50 flex-shrink-0 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64 custom-scroll">
        <DropdownMenuLabel className="px-2 py-1.5">
          Tổ chức của bạn
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-64 overflow-y-auto custom-scroll pr-1">
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => {
                onSelect(org.id);
                setOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-accent"
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {getInitials(org.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{org.name}</p>
                <p className="text-xs text-muted-foreground">
                  {org.memberCount || 1} thành viên
                </p>
              </div>
              {currentOrgId === org.id && (
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        {(onCreateNew || organizations.length > 0) && (
          <>
            <DropdownMenuSeparator />
            {onCreateNew && (
              <DropdownMenuItem
                onClick={() => {
                  onCreateNew();
                  setOpen(false);
                }}
                className="cursor-pointer text-primary hover:text-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo tổ chức mới
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
