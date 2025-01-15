/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

//const fs = require('node:fs');

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
        strictRequires: ['node_modules/aws-sdk/**/*.js'],
    },
  },
  server: {
    https: {
      key: 'ssl/private-key.pem',
      cert: 'ssl/certificate.pem',
    },
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
    VitePWA({ 
      registerType: 'autoUpdate', 
      workbox: { maximumFileSizeToCacheInBytes: 5000000 } 
    }),
    legacy(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
