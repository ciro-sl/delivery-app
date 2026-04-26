import { createContext, useState, useEffect, useContext } from 'react'

/**
 * Contexto del tema de la aplicación.
 * Gestiona el modo oscuro/claro con persistencia en localStorage.
 */
const ThemeContext = createContext()

/**
 * Proveedor del contexto del tema.
 * Maneja el estado del tema y aplica clases CSS al elemento raíz.
 *
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Proveedor de contexto
 */
const ThemeProvider = ({ children }) => {
  // Estado del modo oscuro, inicializado desde localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved === 'dark'
  })

  // Efecto para aplicar el tema al DOM y guardar en localStorage
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  /**
   * Alterna entre modo oscuro y claro.
   * Invierte el estado actual de darkMode.
   */
  const toggleTheme = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook personalizado para usar el contexto del tema.
 * Debe usarse dentro de un ThemeProvider.
 *
 * @returns {Object} Objeto con darkMode y toggleTheme
 * @returns {boolean} return.darkMode - Estado actual del modo oscuro
 * @returns {Function} return.toggleTheme - Función para alternar el tema
 * @throws {Error} Si se usa fuera de ThemeProvider
 */
const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { ThemeProvider, ThemeContext, useTheme }