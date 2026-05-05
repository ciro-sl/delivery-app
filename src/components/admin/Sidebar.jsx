const Sidebar = ({ activeTab, setActiveTab, darkMode, toggleDarkMode }) => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'menu', label: 'Gestión de Menú', icon: '🍕' },
    { key: 'orders', label: 'Pedidos', icon: '📦' },
  ]

  return (
    <aside className="flex h-full flex-col rounded-none border-r border-zinc-800 bg-[#f8f9fa] dark:bg-zinc-950/95 p-4 shadow-xl shadow-black/25 transition-all duration-300 backdrop-blur-xl dark:border-zinc-800 dark:shadow-black/40 border-l-4 border-l-[#e0e0e0] dark:border-l-transparent">
      {/* Logo / Marca */}
      <div className="mb-6 flex items-center gap-3 px-3 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-naranja to-amarillo shadow-lg shadow-naranja/20">
          <span className="text-lg">🍕</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400">Admin</p>
          <p className="text-sm font-bold text-slate-100">Pa' Que Arvey</p>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActiveTab(item.key)}
            className={`group w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border border-transparent ${
              activeTab === item.key
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/25 border-[#e0e0e0] dark:border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
            }`}
          >
            <span className="text-lg transition-transform group-hover:scale-110">{item.icon}</span>
            <span>{item.label}</span>
            {activeTab === item.key && (
              <span className="ml-auto h-2 w-2 rounded-full bg-white shadow-lg animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      {/* Botón de Modo */}
      <div className="mt-auto border-t pt-4 dark:border-gray-700">
        <button
          type="button"
          onClick={toggleDarkMode}
          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border border-transparent ${
            darkMode
              ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
              : 'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-[#e0e0e0] dark:border-transparent shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
          }`}
        >
          <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
          <span>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar