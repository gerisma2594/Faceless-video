import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Faceless-video/',
  build: { outDir: 'dist' },
  define: { 'process.env': {} }
})
