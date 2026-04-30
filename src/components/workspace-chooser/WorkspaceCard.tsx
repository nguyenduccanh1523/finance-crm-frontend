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
        "group relative flex h-full w-full overflow-hidden rounded-3xl border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-85",
        isPending
          ? "scale-[1.01] border-white/35 shadow-[0_24px_60px_-28px_rgba(59,130,246,0.5)]"
          : "border-white/10 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.95)]",
      )}
    >
      <div
        className={cn(
          "relative flex min-h-[15.5rem] w-full flex-col justify-between overflow-hidden bg-gradient-to-br p-6 sm:p-7",
          workspace.color,
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.22),transparent_34%)]" />
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-transform duration-500 group-hover:scale-110" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/[0.15] backdrop-blur-md shadow-inner shadow-white/10">
            {workspace.icon}
          </div>

          <span className="inline-flex rounded-full border border-white/20 bg-slate-950/[0.14] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
            Live Mode
          </span>
        </div>

        <div className="relative mt-7 flex-1 space-y-4">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-white/[0.15] bg-slate-950/[0.15] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/75">
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

        <div className="relative mt-6 flex items-center justify-between border-t border-white/[0.15] pt-4 text-white">
          <div className="text-sm font-medium text-white/80">
            {isPending ? "Opening workspace..." : "Enter now"}
          </div>

          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/[0.15] transition-all duration-300",
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
