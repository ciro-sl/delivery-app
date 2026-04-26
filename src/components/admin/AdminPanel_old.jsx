import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { MenuContext } from '../../contexts/MenuContext'
import { OrderContext } from '../../contexts/OrderContext'
import AdminDashboard from './AdminDashboard'
import MenuManagement from './MenuManagement'
import OrdersHistory from './OrdersHistory'

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'menu', label: 'Menú' },
  { key: 'orders', label: 'Pedidos' },
]

const AdminPanel = () => {
  const { logout } = useContext(AuthContext)
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, availableCategories } = useContext(MenuContext)
  const { orders, getEarningsStats } = useContext(OrderContext)
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gris-oscuro/90 p-8 shadow-2xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-naranja">Administración</p>
            <h1 className="mt-3 text-4xl font-bold text-white">Panel de Pa' Que Arvey</h1>
            <p className="max-w-2xl text-texto-muted">
              Aquí se gestiona el menú, se revisan pedidos con datos de cliente y se administra el modelo de operación.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-red-500/20 bg-red-600/15 px-5 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-600/25"
          >
            Salir
          </button>
        </div>

        <div className="grid gap-3 rounded-[1.75rem] bg-[#111111] p-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-[#181818] p-5">
            <p className="text-sm uppercase tracking-[0.33em] text-texto-muted">Pedidos</p>
            <p className="mt-3 text-3xl font-semibold text-white">{orders.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#181818] p-5">
            <p className="text-sm uppercase tracking-[0.33em] text-texto-muted">Productos</p>
            <p className="mt-3 text-3xl font-semibold text-white">{menuItems.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#181818] p-5">
            <p className="text-sm uppercase tracking-[0.33em] text-texto-muted">Categorías</p>
            <p className="mt-3 text-3xl font-semibold text-white">{availableCategories.length - 1}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#181818] p-5">
            <p className="text-sm uppercase tracking-[0.33em] text-texto-muted">Ganancias Mes</p>
            <p className="mt-3 text-3xl font-semibold text-white">${getEarningsStats().monthly.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3 rounded-[3rem] bg-[#111111] p-4 shadow-2xl shadow-black/20">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-naranja text-gris-oscuro' : 'bg-white/5 text-white hover:bg-white/10'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && <AdminDashboard orders={orders} />}
      {activeTab === 'menu' && (
        <MenuManagement menuItems={menuItems} addMenuItem={addMenuItem} updateMenuItem={updateMenuItem} deleteMenuItem={deleteMenuItem} />
      )}
      {activeTab === 'orders' && <OrdersHistory orders={orders} />}
    </div>
  )
}

export default AdminPanel
