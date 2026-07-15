import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // Dev server
  server: {
    port: 5173,
    open: true,
  },

  // Production build
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    // ── Security: never expose source maps in production ──
    sourcemap: false,
    // ── Use terser for aggressive minification + mangling ──
    minify: 'terser',
    terserOptions: {
      compress: {
        // Drop debugger statements
        drop_debugger: true,
        // Remove verbose console calls; keep warn/error for diagnostics
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        // Obfuscate variable and function names
        toplevel: true,
        // Keep only essential names for library interop
        reserved: ['ZanPic', 'Fabric'],
      },
      format: {
        // Remove all comments
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          fabric: ['fabric'],
          react: ['react', 'react-dom'],
          ai: ['@imgly/background-removal', 'onnxruntime-web'],
          utils: ['zustand'],
        },
      },
    },
  },

  // Exclude native/Node.js deps from Vite optimization
  optimizeDeps: {
    exclude: ['canvas', 'jsdom', '@imgly/background-removal'],
  },
}))
