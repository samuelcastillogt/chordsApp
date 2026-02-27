import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/app/',
  build: {
    outDir: '../api/static/app',
    emptyOutDir: true,
  },
})
