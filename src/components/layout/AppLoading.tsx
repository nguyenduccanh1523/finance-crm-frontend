"use client";

export function AppLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>

      <div className="h-6 w-40 animate-pulse rounded-md bg-muted/50"></div>
      <div className="h-4 w-52 animate-pulse rounded-md bg-muted/40"></div>
    </div>
  );
}
