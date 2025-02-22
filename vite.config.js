import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@mui/system/Box": path.resolve(__dirname, "src/custom-fixes/Box.js"),
    },
  },
  server: {
    watch: {
      usePolling: true, // Đảm bảo rằng Vite sẽ sử dụng polling thay vì watch trực tiếp tệp
    },
  },
  optimizeDeps: {
    entries: ["src/main.js"], // Bạn có thể điều chỉnh đường dẫn này tùy vào dự án của bạn
  },
});
