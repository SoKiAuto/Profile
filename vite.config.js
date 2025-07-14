import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Profile/', // this is CRITICAL for GitHub Pages
  plugins: [react()],
})
