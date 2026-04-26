import { createContext, useState, useMemo } from 'react'

/**
 * Contexto del menú de la aplicación.
 * Gestiona los items del menú, categorías disponibles y operaciones CRUD.
 */
export const MenuContext = createContext()

/**
 * Items del menú por defecto.
 * Array de objetos que representan los productos disponibles inicialmente.
 */
const defaultMenuItems = [
  {
    id: 'p1',
    name: 'Pizza Margarita',
    category: 'pizzas',
    description: 'Salsa de tomate, mozzarella y albahaca fresca.',
    price: 18000,
    image: '/pizza-margherita.jpg',
  },
  {
    id: 'p2',
    name: 'Pizza Pepperoni',
    category: 'pizzas',
    description: 'Pepperoni crujiente, queso fundido y salsa especial.',
    price: 22000,
    image: '/pizza-pepperoni.jpg',
  },
  {
    id: 'c1',
    name: 'Combo Nocturno',
    category: 'combos',
    description: 'Pizza mediana + papas + bebida.',
    price: 28000,
    image: '/combo-nocturno.jpg',
  },
  {
    id: 'b1',
    name: 'Gaseosa 500ml',
    category: 'bebidas',
    description: 'Coca-Cola fría para acompañar tu pedido.',
    price: 6000,
    image: '/bebida.jpg',
  },
  {
    id: 'd1',
    name: 'Brownie de chocolate',
    category: 'postres',
    description: 'Brownie caliente con helado de vainilla.',
    price: 12000,
    image: '/brownie.jpg',
  },
]

/**
 * Proveedor del contexto del menú.
 * Gestiona el estado de los items del menú y proporciona funciones CRUD.
 *
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Proveedor de contexto
 */
export const MenuProvider = ({ children }) => {
  // Estado de los items del menú
  const [menuItems, setMenuItems] = useState(defaultMenuItems)

  // Cálculo memoizado de categorías disponibles
  const availableCategories = useMemo(
    () => ['todas', ...new Set(menuItems.map((item) => item.category.toLowerCase()))],
    [menuItems],
  )

  /**
   * Agrega un nuevo item al menú.
   * Genera un ID único basado en timestamp.
   *
   * @param {Object} item - Nuevo item del menú
   * @param {string} item.name - Nombre del item
   * @param {string} item.category - Categoría del item
   * @param {string} item.description - Descripción del item
   * @param {number} item.price - Precio del item
   * @param {string} item.image - URL de la imagen
   */
  const addMenuItem = (item) => {
    setMenuItems((prev) => [...prev, { id: `m${Date.now()}`, ...item }])
  }

  /**
   * Actualiza un item existente del menú.
   *
   * @param {string} id - ID del item a actualizar
   * @param {Object} updatedItem - Propiedades actualizadas del item
   */
  const updateMenuItem = (id, updatedItem) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)))
  }

  /**
   * Elimina un item del menú por su ID.
   *
   * @param {string} id - ID del item a eliminar
   */
  const deleteMenuItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <MenuContext.Provider
      value={{ menuItems, availableCategories, addMenuItem, updateMenuItem, deleteMenuItem }}
    >
      {children}
    </MenuContext.Provider>
  )
}
