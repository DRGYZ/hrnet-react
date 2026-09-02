import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});
