import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Determine base path from environment variable (used for GitHub Pages builds)
// eslint-disable-next-line no-undef
const isGitHubPages = process.env.VITE_BUILD_TARGET === 'gh-pages'
const basePath = isGitHubPages ? '/tech-service/' : '/'

// Simple plugin to support SPA routing on GitHub Pages
const spaRoutingPlugin = () => ({
  name: 'spa-routing',
  closeBundle() {
    if (!isGitHubPages) return

    const distPath = join(__dirname, 'dist')
    // Copy index.html to 404.html so client-side routes work on refresh
    copyFileSync(join(distPath, 'index.html'), join(distPath, '404.html'))
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss(), spaRoutingPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
