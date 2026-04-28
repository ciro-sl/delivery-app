import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para la aplicación Delivery App
export default defineConfig({
  plugins: [react()],

  server: {
    // Puerto del servidor (por defecto 5173)
    port: 5173,
    // Proxy para conectar con el backend
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },

  build: {
    // Directorio de salida del build
    outDir: 'dist',
    // Sourcemaps para debugging
    sourcemap: false,
    // Configuración de chunks (CORREGIDO: ahora es función)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar React en su propio chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router'
            }
            // Otros vendor chunks
            return 'vendor'
          }
        }
      }
    }
  },

  resolve: {
    alias: {
      // Puedes añadir alias si los necesitas
      // '@': '/src'
    }
  }
})