import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    rollupOptions: {
      input: 'index.html',
    },
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      // Add other aliases as needed
    }
  }
})
