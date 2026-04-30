import type { ReactNode } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  color: string;
}

interface WorkspaceCardProps {
  workspace: Workspace;
  isPending?: boolean;
  onSelect: (id: string) => void;
}

export function WorkspaceCard({
  workspace,
  isPending = false,
  onSelect,
}: WorkspaceCardProps) {
  return (
    <button
      type="button"
      aria-busy={isPending}
      disabled={isPending}
      onClick={() => onSelect(workspace.id)}
      className={cn(
        "group relative flex h-full w-full overflow-hidden rounded-3xl border bg-white/75 text-left shadow-[0_24px_60px_-38px_rgba(15,23,42,0.24)] backdrop-blur-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-85 dark:bg-slate-950/40 dark:shadow-[0_28px_70px_-40px_rgba(2,6,23,0.92)]",
        isPending
          ? "scale-[1.01] border-sky-200 shadow-[0_28px_65px_-36px_rgba(59,130,246,0.35)] dark:border-white/25 dark:shadow-[0_28px_65px_-34px_rgba(59,130,246,0.42)]"
          : "border-slate-200/85 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_32px_80px_-44px_rgba(15,23,42,0.3)] dark:border-white/10 dark:hover:border-white/20 dark:hover:shadow-[0_32px_80px_-40px_rgba(2,6,23,0.98)]",
      )}
    >
      <div
        className={cn(
          "relative flex min-h-[15.5rem] w-full flex-col justify-between overflow-hidden bg-gradient-to-br p-6 sm:p-7",
          workspace.color,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.28),transparent_34%)]" />
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/12 blur-3xl transition-transform duration-500 group-hover:scale-110" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/[0.15] backdrop-blur-md shadow-inner shadow-white/10">
            {workspace.icon}
          </div>

          <span className="inline-flex rounded-full border border-white/20 bg-slate-950/[0.18] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/85">
            Live Mode
          </span>
        </div>

        <div className="relative mt-7 flex-1 space-y-4">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-white/[0.18] bg-slate-950/[0.2] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
              Workspace
            </span>

            <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-[2rem]">
              {workspace.name}
            </h3>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/90 sm:text-[15px]">
            {workspace.description}
          </p>
        </div>

        <div className="relative mt-6 flex items-center justify-between border-t border-white/[0.16] pt-4 text-white">
          <div className="text-sm font-medium text-white/85">
            {isPending ? "Opening workspace..." : "Enter now"}
          </div>

          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/[0.18] transition-all duration-300",
              isPending
                ? "bg-white/[0.2]"
                : "group-hover:translate-x-1 group-hover:bg-white/[0.16]",
            )}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </span>
        </div>
      </div>
    </button>
  );
}
