import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, Vite forwards every /api request to FastAPI on port 8000,
// so the React code never needs the API's address.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": "http://localhost:8000" },
  },
});
