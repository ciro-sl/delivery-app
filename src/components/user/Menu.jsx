import { useContext, useMemo, useState } from 'react'
import { MenuContext } from '../../contexts/MenuContextDebug'
import MenuItem from './MenuItem'

const Menu = () => {
  const { menuItems, loading, availableCategories } = useContext(MenuContext)
  const [activeCategory, setActiveCategory] = useState('todas')

  // Crear lista de categorías incluyendo "todas"
  const categoryList = useMemo(() => {
    const cats = ['todas']
    if (availableCategories && Array.isArray(availableCategories)) {
      availableCategories.forEach(cat => {
        if (cat && typeof cat === 'object' && cat.name) {
          cats.push(cat.name.toLowerCase())
        } else if (typeof cat === 'string') {
          cats.push(cat.toLowerCase())
        }
      })
    }
    return [...new Set(cats)] // Remover duplicados
  }, [availableCategories])

  const filteredMenu = useMemo(
    () =>
      activeCategory === 'todas'
        ? menuItems
        : menuItems.filter((item) => item.category && item.category.toLowerCase() === activeCategory.toLowerCase()),
    [activeCategory, menuItems],
  )

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-72 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amarillo" />
        <p className="text-gray-600 dark:text-gray-400">Cargando menú...</p>
      </div>
    )
  }

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-72 space-y-4">
        <div className="text-gray-500 dark:text-gray-400">
          <p className="text-lg">No hay productos disponibles</p>
          <p className="text-sm mt-2">Intenta recargar la página o contacta al administrador</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Filtros de categoría - ultra compacto en móviles */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 flex gap-1.5 sm:gap-2 md:gap-3 justify-start overflow-x-auto pb-1 sm:pb-0 scrollbar-hide px-1">
        {categoryList.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-md sm:rounded-lg md:rounded-full px-2.5 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap flex-shrink-0 min-h-[32px] sm:min-h-[36px] md:min-h-[40px] ${
              activeCategory === category
                ? 'bg-amarillo text-gray-900 shadow-md shadow-amber-200/50 scale-105'
                : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 hover:scale-105'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid de productos - responsivo: 1 columna en móvil, 2-4 en escritorio */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        {filteredMenu.map((item, index) => (
          <div
            key={item.id}
            className="menu-item-enter"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MenuItem item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu