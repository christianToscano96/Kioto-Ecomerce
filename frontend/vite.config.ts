import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@shared": "/shared/src",
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI components
          ui: ['lucide-react', 'clsx', 'tailwind-merge'],
          // Admin-only libraries (loaded via code splitting but good for cache)
          charts: ['recharts'],
          // Utilities
          utils: ['axios', 'date-fns', 'zod'],
        },
      },
    },
  },
});
