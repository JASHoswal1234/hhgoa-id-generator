import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The illustrations are large PNGs; keep them as emitted files rather than
    // inlining any of them into the JS bundle.
    assetsInlineLimit: 0,
  },
})
