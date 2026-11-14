/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

/**
 * Vite configuration.
 *
 * `base: './'` keeps the build portable: the same `dist/` works on
 * GitHub Pages (project site at /milky-mission/) and on any static host.
 * Override with VITE_BASE only if a host requires an absolute base path.
 */
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // The simulation engine is pure TypeScript: no DOM needed.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
