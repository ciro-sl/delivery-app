import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para la aplicación Delivery App
// https://vite.dev/config/
export default defineConfig({
  // Plugins utilizados en el proyecto
  plugins: [
    react() // Plugin oficial de Vite para React - habilita JSX, Fast Refresh, etc.
  ],

  // Configuración del servidor de desarrollo
  server: {
    // Puerto del servidor (por defecto 5173)
    // host: 'localhost',
    // port: 5173,

    // Configuración de proxy para APIs (si se necesita)
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true
    //   }
    // }
  },

  // Configuración del build
  build: {
    // Directorio de salida del build
    outDir: 'dist',

    // Configuración de sourcemaps para debugging
    sourcemap: false,

    // Configuración de chunks para optimización
    rollupOptions: {
      output: {
        // Separar vendor chunks para mejor caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },

  // Resolución de alias para imports más limpios
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, './src')
    }
  },

  // Variables de entorno
  // Las variables que empiecen con VITE_ estarán disponibles en el cliente
  // envPrefix: 'VITE_'
})
