import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { useContext } from 'react'

import { AuthProvider, AuthContext } from './contexts/AuthContext'

import { CartProvider } from './contexts/CartContext'

import { MenuProvider } from './contexts/MenuContextDebug'

import { OrderProvider } from './contexts/OrderContext'

import { ThemeProvider } from './contexts/ThemeContext'

import Navbar from './components/common/Navbar'

import Footer from './components/common/Footer'

import Home from './pages/Home'

import CartPage from './pages/CartPage'

import AdminLogin from './components/admin/Login'

import AdminPanel from './components/admin/AdminPanel'



/**

 * Componente de protección de rutas que requiere autenticación de administrador.

 * Verifica si el usuario está autenticado y muestra un loading mientras se verifica.

 * Si no está autenticado, redirige al login de admin.

 *

 * @param {Object} props - Props del componente

 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si autenticado

 * @returns {React.ReactElement} Componente protegido o redirección

 */

const RequireAdmin = ({ children }) => {

  const { isAuthenticated, loading } = useContext(AuthContext)



  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gris-oscuro text-white">

        Cargando panel administrativo...

      </div>

    )

  }



  return isAuthenticated ? children : <Navigate to="/admin/login" replace />

}



/**

 * Componente raíz de la aplicación Delivery App.

 * Configura todos los proveedores de contexto (Theme, Auth, Menu, Order, Cart)

 * y define las rutas de la aplicación usando React Router.

 *

 * Estructura de rutas:

 * - /: Página de inicio (Home)

 * - /cart: Página del carrito de compras

 * - /admin/login: Login de administrador

 * - /admin: Panel de administración (protegido)

 * - *: Redirección a inicio para rutas no encontradas

 *

 * @returns {React.ReactElement} La aplicación completa envuelta en proveedores

 */

function App() {

  return (

    <ThemeProvider>

      <Router>

        <AuthProvider>

          <MenuProvider>

            <OrderProvider>

              <CartProvider>

                <div className="min-h-screen bg-[#f5f5f5] text-gray-900 dark:bg-transparent dark:text-texto">

                  <Navbar />

                  <main className="min-h-[calc(100vh-12rem)]">

                    <Routes>

                      <Route path="/" element={<Home />} />

                      <Route path="/cart" element={<CartPage />} />

                      <Route path="/admin/login" element={<AdminLogin />} />

                      <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />

                      <Route path="*" element={<Navigate to="/" replace />} />

                    </Routes>

                  </main>

                  <Footer />

                </div>

              </CartProvider>

            </OrderProvider>

          </MenuProvider>

        </AuthProvider>

      </Router>

    </ThemeProvider>

  )

}



export default App

