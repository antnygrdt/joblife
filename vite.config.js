import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import path from 'path'

const browser = process.env.VITE_BROWSER || 'chrome'

const manifest =
  browser === 'chrome'
    ? require('./manifest.chrome.json')
    : require('./manifest.firefox.json')

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest,
      browser
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  },
  build: {
    outDir: `dist/${browser}`,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  }
})