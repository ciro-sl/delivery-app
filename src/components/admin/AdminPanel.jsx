import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { MenuContext } from '../../contexts/MenuContextDebug'
import { OrderContext } from '../../contexts/OrderContext'
import { ThemeContext } from '../../contexts/ThemeContext'
import AdminDashboard from './AdminDashboard'
import MenuManagementUltraEnhanced from './MenuManagementUltraEnhanced'
import OrdersHistory from './OrdersHistory'
import Sidebar from './Sidebar'

/**
 * Componente principal del panel de administración.
 * Proporciona una interfaz completa para gestionar el restaurante con sidebar de navegación,
 * dashboard con estadísticas, gestión del menú y historial de pedidos.
 *
 * @returns {React.ReactElement} Panel de administración completo
 */
const AdminPanel = () => {
  // Contextos utilizados
  const { logout } = useContext(AuthContext)
  const { menuItems, availableCategories, addMenuItem, updateMenuItem, deleteMenuItem, addCategory } = useContext(MenuContext)
  const { orders, updateOrderStatus } = useContext(OrderContext)
  const { darkMode } = useContext(ThemeContext)

  // Estado de la pestaña activa en el sidebar
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()

  /**
   * Maneja el cierre de sesión del administrador.
   * Llama a logout del contexto y redirige al login.
   */
  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // Clases CSS condicionales basadas en el tema
  const containerClass = darkMode ? 'min-h-screen bg-gris-oscuro text-white' : 'min-h-screen bg-gray-50 text-gray-900'
  const mainClass = darkMode ? 'flex-1 p-8 bg-gris-oscuro' : 'flex-1 p-8 bg-gray-50'

  return (
    <div className={containerClass}>
      <div className="flex min-h-screen">
        {/* Sidebar fijo a la izquierda con navegación */}
        <div className="w-64 flex-shrink-0 min-h-screen">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
        </div>

        {/* Contenido principal desplazado para dejar espacio al sidebar */}
        <main className={mainClass}>
          {/* Header con titulo y logout */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-naranja font-semibold">
                Administracion
              </p>
              <h1 className="mt-1 text-3xl font-bold">
                Panel de <span className="text-naranja">Pa' Que Arvey</span>
              </h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/20 hover:scale-105 active:scale-95"
            >
              <span>↪️</span>
              <span>Cerrar sesion</span>
            </button>
          </div>

          {/* Renderizado condicional de secciones basado en activeTab */}
          {activeTab === 'dashboard' && <AdminDashboard orders={orders} darkMode={darkMode} />}
          {activeTab === 'menu' && (
            <MenuManagementUltraEnhanced
              menuItems={menuItems}
              availableCategories={availableCategories}
              addMenuItem={addMenuItem}
              updateMenuItem={updateMenuItem}
              deleteMenuItem={deleteMenuItem}
              addCategory={addCategory}
              darkMode={darkMode}
            />
          )}
          {activeTab === 'orders' && <OrdersHistory orders={orders} darkMode={darkMode} updateOrderStatus={updateOrderStatus} />}
        </main>
      </div>
    </div>
  )
}

export default AdminPanel