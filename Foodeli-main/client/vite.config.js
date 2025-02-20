import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Cổng mà máy chủ sẽ chạy
    open: true, // Tự động mở trình duyệt
    hmr: true, // Kích hoạt Hot Module Replacement
  },
  build: {
    outDir: 'dist', // Thư mục đầu ra cho build
    sourcemap: true, // Tạo sourcemap cho quá trình build
  },
})