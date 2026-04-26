import { createContext, useState, useEffect } from 'react'

/**
 * Contexto de autenticación para la aplicación.
 * Maneja el estado de autenticación de administradores usando localStorage.
 */
export const AuthContext = createContext()

/**
 * Proveedor del contexto de autenticación.
 * Proporciona funciones para login, logout y estado de autenticación.
 *
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Proveedor de contexto
 */
export const AuthProvider = ({ children }) => {
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // Estado de carga inicial
  const [loading, setLoading] = useState(true)

  // Efecto para verificar token al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  /**
   * Función para iniciar sesión.
   * Guarda el token en localStorage y actualiza el estado.
   *
   * @param {string} token - Token de autenticación
   */
  const login = (token) => {
    localStorage.setItem('adminToken', token)
    setIsAuthenticated(true)
  }

  /**
   * Función para cerrar sesión.
   * Remueve el token de localStorage y actualiza el estado.
   */
  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}