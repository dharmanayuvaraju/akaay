import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH || (process.env.GITHUB_ACTIONS || process.env.GITHUB_PAGES ? '/akaay/' : '/'),
  plugins: [react()],
})
