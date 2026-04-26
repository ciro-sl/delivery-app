import { useContext, useMemo, useState } from 'react'
import { MenuContext } from '../../contexts/MenuContext'
import MenuItem from './MenuItem'

const Menu = () => {
  const { menuItems, loading, availableCategories } = useContext(MenuContext)
  const [activeCategory, setActiveCategory] = useState('todas')

  const filteredMenu = useMemo(
    () =>
      activeCategory === 'todas'
        ? menuItems
        : menuItems.filter((item) => item.category.toLowerCase() === activeCategory),
    [activeCategory, menuItems],
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-72">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amarillo" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        {availableCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              activeCategory === category
                ? 'bg-amarillo text-gris-oscuro'
                : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
            }`}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredMenu.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default Menu