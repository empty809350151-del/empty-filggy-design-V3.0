import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_PUBLIC_BASE ?? '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 65186,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 65186,
    strictPort: true,
  },
})
