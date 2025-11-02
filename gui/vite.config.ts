import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: "continue-xd",
      project: "continue",
    }),
  ],
  resolve: {
    // Look in both GUI and core node_modules
    modules: [
      resolve(__dirname, "node_modules"),
      resolve(__dirname, "../core/node_modules"),
      resolve(__dirname, "../node_modules"),
      "node_modules",
    ],
    alias: {
      // Ensure core dependencies can be resolved from GUI node_modules first
      uuid: resolve(__dirname, "node_modules/uuid"),
      zod: resolve(__dirname, "node_modules/zod"),
      "partial-json":
        resolve(__dirname, "node_modules/partial-json") ||
        resolve(__dirname, "../core/node_modules/partial-json"),
      // Resolve local packages - try dist first, then root
      "@continuedev/config-yaml": resolve(
        __dirname,
        "../packages/config-yaml/dist/index.js",
      ),
      "@continuedev/terminal-security": resolve(
        __dirname,
        "../packages/terminal-security/dist/index.js",
      ),
    },
    // Preserve symlinks for local packages
    preserveSymlinks: false,
  },
  build: {
    sourcemap: true,
    // Optimize dependencies to include core dependencies
    commonjsOptions: {
      include: [/core/, /node_modules/],
    },
    // Change the output .js filename to not include a hash
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        indexConsole: resolve(__dirname, "indexConsole.html"),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
      // Don't externalize core dependencies - bundle them
      external: [],
    },
  },
  optimizeDeps: {
    include: [
      "core",
      "zod",
      "partial-json",
      "@continuedev/config-yaml",
      "@continuedev/terminal-security",
    ],
    force: true,
  },
  server: {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["*", "Content-Type", "Authorization"],
      credentials: true,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/util/test/setupTests.ts",
    onConsoleLog(log, type) {
      if (type === "stderr") {
        if (
          [
            "contentEditable",
            "An update to Chat inside a test was not wrapped in act",
            "An update to TipTapEditor inside a test was not wrapped in act",
            "An update to ThinkingIndicator inside a test was not wrapped in act",
            "The current testing environment is not configured to support act",
            "target.getClientRects is not a function",
            "prosemirror",
          ].some((text) => log.includes(text))
        ) {
          return false;
        }
      }
      return true;
    },
    onUnhandledRejection(err) {
      // Suppress ProseMirror DOM errors in test environment
      if (
        err.message?.includes("getClientRects") ||
        err.message?.includes("prosemirror")
      ) {
        return false;
      }
      return true;
    },
  },
});
