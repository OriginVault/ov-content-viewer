import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'; // Named import
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      global: true,
      process: true,
    }),
    svgr(),
  ],
  build: {
    outDir: 'dist', // Adjust this path to point to your Express app's static folder
    emptyOutDir: true, // Clears the dist folder before building
  },
  chunkSizeWarningLimit: 3000,
  define: {
    global: 'globalThis',
  },
  hmr: {
    port: 3000,
  },
})
