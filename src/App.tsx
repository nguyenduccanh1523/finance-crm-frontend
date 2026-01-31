import { Toaster } from "sonner";
import { AppRouter } from "@/app/router";
import { AppInitializer } from "./AppInitializer";

export function App() {
  return (
    <AppInitializer>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </AppInitializer>
  );
}
