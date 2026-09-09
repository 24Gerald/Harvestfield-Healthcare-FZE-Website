import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The 3D stack is reached only through the dynamic import in
    // src/three/HeroBackground.jsx, so Rollup already splits it into its own
    // lazily fetched chunk; framer-motion is separated for better caching.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'motion'
        },
      },
    },
  },
})
