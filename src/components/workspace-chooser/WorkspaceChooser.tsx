import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Lightbulb,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkspaceCard, type Workspace } from "./WorkspaceCard";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setTheme } from "@/app/store/uiSlice";

type WorkspaceType = "finance" | "organization";

const workspaces: Workspace[] = [
  {
    id: "finance",
    name: "Finance",
    description:
      "Manage your personal finances, transactions, budgets, and goals with advanced analytics.",
    icon: <Wallet className="h-6 w-6 text-white" />,
    color: "from-blue-500 via-blue-600 to-cyan-600",
  },
  {
    id: "organization",
    name: "Organization",
    description:
      "Switch to CRM mode to manage your organizations, teams, and collaborative workflows.",
    icon: <Building2 className="h-6 w-6 text-white" />,
    color: "from-fuchsia-500 via-violet-600 to-pink-600",
  },
];

const infoCards = [
  {
    icon: Lightbulb,
    title: "Chuyen doi nhanh",
    description:
      "Ban co the doi qua lai giua Finance va Organization bat ky luc nao trong ung dung.",
  },
  {
    icon: ShieldCheck,
    title: "Du lieu tach biet",
    description:
      "Moi workspace co du lieu, quyen truy cap va luong cong viec rieng de tranh nham lan.",
  },
];

const getWorkspacePath = (workspace: WorkspaceType) =>
  workspace === "finance" ? "/app" : "/app/organization";

interface WorkspaceChooserProps {
  onWorkspaceSelect?: (type: WorkspaceType) => void;
  onLogout?: () => void;
}

export function WorkspaceChooser({
  onWorkspaceSelect,
  onLogout,
}: WorkspaceChooserProps) {
  const [pendingWorkspace, setPendingWorkspace] = useState<WorkspaceType>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);

  const handleWorkspaceSelect = (id: string) => {
    const workspaceId = id as WorkspaceType;

    if (pendingWorkspace) {
      return;
    }

    localStorage.setItem("selectedWorkspace", workspaceId);
    setPendingWorkspace(workspaceId);

    if (onWorkspaceSelect) {
      onWorkspaceSelect(workspaceId);
      return;
    }

    navigate(getWorkspacePath(workspaceId), { replace: true });
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/auth/login", { replace: true });
  };

  const handleToggleTheme = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-colors duration-300 custom-scroll dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 light:from-white light:via-slate-50 light:to-slate-100 md:h-screen md:overflow-hidden">
      <div className="mx-auto flex h-full max-w-6xl flex-col px-4 sm:px-6">
        <header className="flex shrink-0 items-center justify-between py-4 md:py-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="rounded-lg px-3 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400 light:text-red-600 light:hover:bg-red-50 light:hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Dang xuat</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleTheme}
            className="rounded-lg border-slate-600 dark:border-slate-600 dark:text-slate-300 light:border-slate-300 light:text-slate-700"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </header>

        <main className="flex flex-1 items-center py-4 md:py-6">
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
            <section className="flex flex-col justify-center gap-5 lg:pr-4">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white/75 backdrop-blur dark:border-white/10 dark:bg-white/[0.06] light:border-slate-300 light:bg-white/80 light:text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Workspace Switcher
                </div>

                <div className="space-y-3">
                  <h1 className="max-w-xl text-3xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 md:text-4xl xl:text-5xl">
                    Chon che do lam viec va vao ngay.
                  </h1>

                  <p className="max-w-xl text-sm leading-7 text-slate-200 dark:text-slate-200 light:text-slate-600 md:text-base">
                    Khong can cuon, khong can bam tiep tuc. Bam truc tiep vao
                    card hoac nut mui ten de vao dung workspace ban muon dung.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {infoCards.map(({ icon: Icon, title, description }) => (
                  <Card
                    key={title}
                    className="border-slate-700 bg-slate-800/50 p-4 dark:border-slate-700 dark:bg-slate-800/50 light:border-slate-300 light:bg-slate-100/80"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white dark:bg-white/10 dark:text-white light:bg-slate-900 light:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h2 className="mb-2 text-sm font-semibold text-white dark:text-white light:text-slate-900">
                      {title}
                    </h2>

                    <p className="text-xs leading-6 text-slate-200 dark:text-slate-200 light:text-slate-600">
                      {description}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            <section className="grid auto-rows-fr gap-5 md:grid-cols-2">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="flex h-full">
                  <WorkspaceCard
                    workspace={workspace}
                    isPending={pendingWorkspace === workspace.id}
                    onSelect={handleWorkspaceSelect}
                  />
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
