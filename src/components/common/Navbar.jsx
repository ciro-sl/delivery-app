import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { CartContext } from '../../contexts/CartContext'
import { useTheme } from '../../contexts/ThemeContext'
import logoImage from '../../assets/logo.png'

const Navbar = () => {
  const { getItemCount } = useContext(CartContext)
  const { darkMode, toggleTheme } = useTheme()

  return (
    <nav className="bg-white/80 dark:bg-[#121212]/85 border-b border-gray-200/70 dark:border-white/10 sticky top-0 z-50 shadow-sm dark:shadow-black/30 backdrop-blur-xl">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoImage} alt="Pa' Que Arvey" className="h-12 w-auto" />
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-naranja">Pizzería</p>
            <p className="text-lg font-bold text-black dark:text-white">Pa' Que Arvey</p>
          </div>
        </Link>

        <div className="flex items-center gap-6 text-sm font-semibold text-black dark:text-white">
          <Link to="/" className="transition hover:text-naranja dark:hover:text-amarillo">Inicio</Link>
          <Link to="/track" className="transition hover:text-naranja dark:hover:text-amarillo">Rastrear pedido</Link>
          <Link to="/cart" className="relative transition hover:text-naranja dark:hover:text-amarillo">
            Carrito
            {getItemCount() > 0 && (
              <span className="absolute -top-2 -right-5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-naranja dark:bg-amarillo px-2 text-xs text-white dark:text-gris-oscuro shadow-md">
                {getItemCount()}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 transition hover:bg-gray-200 dark:hover:bg-white/10 shadow-sm"
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar