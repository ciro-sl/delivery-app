import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Punto de entrada principal de la aplicación React
// Este archivo se ejecuta cuando se carga la aplicación en el navegador

// createRoot() crea el root de React 18 con el nuevo Concurrent Mode
// Busca el elemento con id 'root' en el index.html
createRoot(document.getElementById('root')).render(
  // StrictMode habilita verificaciones adicionales en desarrollo
  // Ayuda a detectar problemas potenciales en el código
  <StrictMode>
    {/* Componente raíz de la aplicación */}
    <App />
  </StrictMode>,
)
