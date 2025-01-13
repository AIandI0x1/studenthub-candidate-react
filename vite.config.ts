/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: {
      overlay: false,
    },
    //port: 810,
  },
  /*preview: {
    port: 8100,
  },*/
  resolve: {
    alias: {
      '@': "/src",
    },
  },
  plugins: [
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
