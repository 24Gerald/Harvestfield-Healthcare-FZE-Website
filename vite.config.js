import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from the domain root on Netlify. The GitHub Pages preview workflow
  // sets BASE_PATH to the repository sub-path (see .github/workflows/pages.yml).
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    // The 3D stack is reached only through the dynamic import in
    // src/three/HeroBackground.jsx, so Rollup already splits it into its own
    // lazily fetched chunk; framer-motion is separated for better caching.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'motion'
          // three.js core is shared by the two lazy scenes (hero, pack shot); keep it one named chunk.
          if (id.includes('node_modules/three/') || id.includes('node_modules/@react-three/')) return 'three'
        },
      },
    },
  },
})
