import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdown from './plugins/vite-plugin-markdown'
import contentImages from './plugins/vite-plugin-content-images'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, writeFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [
    react(),
    markdown(),
    contentImages(),
    {
      name: 'spa-fallback-postbuild',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        try {
          mkdirSync(outDir, { recursive: true })
          copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
          writeFileSync(resolve(outDir, '.nojekyll'), '')
        } catch {
          // Build output not available (e.g. dev mode) — skip
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@content/zh': resolve(__dirname, 'content/zh'),
      '@content': resolve(__dirname, 'content'),
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
