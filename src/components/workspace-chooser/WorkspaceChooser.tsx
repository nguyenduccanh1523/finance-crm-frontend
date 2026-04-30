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
    <div className="relative min-h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-sky-100 text-slate-900 transition-colors duration-300 custom-scroll dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white md:h-screen md:overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-cyan-200/70 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute right-[-5rem] top-1/4 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl dark:bg-blue-500/12" />
        <div className="absolute bottom-[-4rem] left-1/3 h-64 w-64 rounded-full bg-blue-100/80 blur-3xl dark:bg-violet-500/10" />
      </div>

      <div className="relative mx-auto flex h-full max-w-6xl flex-col px-4 sm:px-6">
        <header className="flex shrink-0 items-center justify-between py-4 md:py-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="rounded-xl bg-white/75 px-3 text-red-600 shadow-sm ring-1 ring-red-100/80 backdrop-blur-sm transition-colors hover:bg-red-100 hover:text-red-700 dark:bg-white/[0.04] dark:text-red-400 dark:ring-white/10 dark:hover:bg-red-950/70 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Dang xuat</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleTheme}
            className="rounded-xl border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </header>

        <main className="flex flex-1 items-center py-6 md:py-8">
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
            <section className="flex flex-col justify-center gap-5 lg:pr-4">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-sky-900 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-white/75">
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  Workspace Switcher
                </div>

                <div className="space-y-3">
                  <h1 className="max-w-xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl xl:text-5xl">
                    Chon che do lam viec va vao ngay.
                  </h1>

                  <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                    Bam truc tiep vao
                    card hoac nut mui ten de vao dung workspace ban muon dung.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {infoCards.map(({ icon: Icon, title, description }) => (
                  <Card
                    key={title}
                    className="border-slate-200/80 bg-white/80 p-4 shadow-[0_24px_50px_-38px_rgba(15,23,42,0.32)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/65 dark:shadow-[0_24px_60px_-38px_rgba(2,6,23,0.9)]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-white/10 dark:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h2 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                      {title}
                    </h2>

                    <p className="text-xs leading-6 text-slate-600 dark:text-slate-300">
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
