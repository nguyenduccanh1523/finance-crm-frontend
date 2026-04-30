import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Wallet, Building2, ChevronDown } from "lucide-react";
import { useAppToast } from "@/components/common/toast/useToast";

type CurrentWorkspace = "finance" | "organization";

interface WorkspaceSwitchButtonProps {
  currentWorkspace?: CurrentWorkspace;
  showLabel?: boolean;
  variant?: "default" | "ghost" | "outline";
}

export function WorkspaceSwitchButton({
  currentWorkspace = "finance",
  showLabel = true,
  variant = "outline",
}: WorkspaceSwitchButtonProps) {
  const navigate = useNavigate();
  const { showSuccess } = useAppToast();
  const [isOpen, setIsOpen] = useState(false);

  const workspaces = [
    {
      id: "finance",
      name: "Finance",
      icon: Wallet,
      description: "Personal finance management",
    },
    {
      id: "organization",
      name: "Organization",
      icon: Building2,
      description: "CRM and team management",
    },
  ];

  const currentWs = workspaces.find((w) => w.id === currentWorkspace);

  const handleSwitch = (workspaceId: string) => {
    if (workspaceId === currentWorkspace) {
      setIsOpen(false);
      return;
    }

    if (workspaceId === "finance") {
      navigate("/app", { replace: true });
    } else if (workspaceId === "organization") {
      navigate("/app/organization", { replace: true });
    }

    showSuccess(`Switched to ${workspaceId} workspace`);
    setIsOpen(false);
  };

  const CurrentIcon = currentWs?.icon || Wallet;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className="gap-2 rounded-lg"
          title={`Current workspace: ${currentWs?.name}`}
        >
          <CurrentIcon className="w-4 h-4" />
          {showLabel && (
            <>
              <span>{currentWs?.name}</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56 custom-scroll">
        <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-72 overflow-y-auto custom-scroll pr-1">
          {workspaces.map((ws) => {
            const Icon = ws.icon;
            const isActive = ws.id === currentWorkspace;

            return (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => handleSwitch(ws.id)}
                className={`flex flex-col items-start gap-1 cursor-pointer ${
                  isActive ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{ws.name}</span>
                  {isActive && (
                    <span className="ml-auto text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground ml-6">
                  {ws.description}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
