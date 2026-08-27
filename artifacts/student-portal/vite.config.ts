import { defineConfig } from "vite";
let reactPlugin;
let tailwindPlugin;
let runtimeErrorOverlay;
try { reactPlugin = (await import("@vitejs/plugin-react")).default; } catch (_) { reactPlugin = () => {}; }
try { tailwindPlugin = (await import("@tailwindcss/vite")).default; } catch (_) { tailwindPlugin = () => {}; }
try { runtimeErrorOverlay = (await import("@replit/vite-plugin-runtime-error-modal")).default; } catch (_) { runtimeErrorOverlay = () => {}; }
import path from "path";

const port = Number(process.env.PORT || 3000);
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [
    reactPlugin(),
    tailwindPlugin(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          // optional Replit plugins, ignored if not available
          async () => {
            try {
              const m = await import("@replit/vite-plugin-cartographer");
              return m.cartographer({ root: path.resolve(import.meta.dirname, "..") });
            } catch (_) {}
          },
          async () => {
            try {
              const m = await import("@replit/vite-plugin-dev-banner");
              return m.devBanner();
            } catch (_) {}
          },
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
