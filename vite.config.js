import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) return "vendor-react";
            if (id.includes("@reduxjs/toolkit") || id.includes("react-redux")) return "vendor-redux";
            if (id.includes("radix-ui")) return "vendor-radix";
            if (id.includes("recharts")) return "vendor-recharts";
            if (id.includes("xlsx")) return "vendor-xlsx";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "radix-ui", "recharts"],
  },
});
