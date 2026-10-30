import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

// На GitHub Pages проект живёт по адресу /airfryer-atlas/, локально — в корне.
const base =
  process.env.GITHUB_ACTIONS || process.env.GH_PAGES
    ? "/airfryer-atlas/"
    : "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    {
      // GitHub Pages отдаёт 404.html на неизвестные пути — копия index.html
      // позволяет открывать deep links вида /recipe/:slug.
      name: "spa-404-fallback",
      closeBundle() {
        copyFileSync(resolve("dist/index.html"), resolve("dist/404.html"));
        // Без .nojekyll Pages выкидывает файлы, начинающиеся с подчёркивания.
        writeFileSync(resolve("dist/.nojekyll"), "");
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // Путь проекта содержит кириллицу — без опроса watcher пропускает правки.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
