import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,  // Đảm bảo rằng Vite sẽ sử dụng polling thay vì watch trực tiếp tệp
    },
  },
  optimizeDeps: {
    // Giới hạn số lượng tệp mà Vite sẽ tối ưu hóa
    entries: ['src/main.js'],  // Bạn có thể điều chỉnh đường dẫn này tùy vào dự án của bạn
  },
})
