import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/ngrok-api": {
        target: "https://60e2-14-232-161-96.ngrok-free.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ngrok-api/, ""),
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});
