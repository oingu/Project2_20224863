import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // https: {
    //   key: fs.readFileSync("localhost-key.pem"),
    //   cert: fs.readFileSync("localhost.pem"),
    // },
    // port: 5173,
    // allowedHosts: ["9d75-42-112-171-236.ngrok-free.app"],
  }
});
