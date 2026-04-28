import { createContext, useState, useMemo, useEffect } from 'react'
import { menuService } from '../services/menuService'

/**
 * Contexto del menú de la aplicación.
 * Gestiona los items del menú, categorías disponibles y operaciones CRUD usando la API real.
 */
export const MenuContext = createContext()

/**
 * Proveedor del contexto del menú.
 * Gestiona el estado de los items del menú usando la API y proporciona funciones CRUD.
 *
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Proveedor de contexto
 */
export const MenuProvider = ({ children }) => {
  // Estado de los items del menú
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 MenuContext: Cargando datos desde API...')
      try {
        setLoading(true)
        const [menuData, categoriesData] = await Promise.all([
          menuService.getMenu(),
          menuService.getCategories()
        ])
        console.log(`📊 MenuContext: Recibidos ${menuData.length} productos y ${categoriesData.length} categorías`)
        
        // Verificar duplicados antes de actualizar estado
        const duplicateNames = menuData.reduce((acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + 1
          return acc
        }, {})
        
        const duplicates = Object.entries(duplicateNames).filter(([, count]) => count > 1)
        if (duplicates.length > 0) {
          console.warn('⚠️ MenuContext: Productos duplicados detectados:', duplicates)
        }
        
        setMenuItems(menuData)
        setCategories(categoriesData)
        console.log('✅ MenuContext: Datos cargados exitosamente')
      } catch (error) {
        console.error('Error cargando datos del menú:', error)
        // Fallback a datos locales si la API falla
        const fallbackMenu = [
          {
            id: 'p1',
            name: 'Pizza Margarita',
            category: 'pizzas',
            description: 'Salsa de tomate, mozzarella y albahaca fresca.',
            price_small: 12000,
            price_large: 18000,
            popular: true,
            available: true,
            image: '/pizza-margherita.jpg',
          },
          {
            id: 'p2',
            name: 'Pizza Pepperoni',
            category: 'pizzas',
            description: 'Pepperoni crujiente, queso fundido y salsa especial.',
            price_small: 14000,
            price_large: 20000,
            popular: true,
            available: true,
            image: '/pizza-pepperoni.jpg',
          },
          {
            id: 'c1',
            name: 'Combo Nocturno',
            category: 'combos',
            description: 'Pizza mediana + papas + bebida.',
            price_small: 28000,
            price_large: null,
            popular: false,
            available: true,
            image: '/combo-nocturno.jpg',
          },
          {
            id: 'b1',
            name: 'Gaseosa 500ml',
            category: 'bebidas',
            description: 'Coca-Cola fría para acompañar tu pedido.',
            price_small: 3000,
            price_large: null,
            popular: false,
            available: true,
            image: '/bebida.jpg',
          },
          {
            id: 'd1',
            name: 'Brownie de chocolate',
            category: 'postres',
            description: 'Brownie caliente con helado de vainilla.',
            price_small: 8000,
            price_large: null,
            popular: false,
            available: true,
            image: '/brownie.jpg',
          },
        ]
        setMenuItems(fallbackMenu)
        setCategories(['todas', 'pizzas', 'combos', 'bebidas', 'postres'])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Cálculo memoizado de categorías disponibles
  const availableCategories = useMemo(
    () => categories,
    [categories],
  )

  /**
   * Agrega un nuevo item al menú usando la API.
   *
   * @param {Object} item - Nuevo item del menú
   * @param {string} item.name - Nombre del item
   * @param {string} item.category_id - ID de la categoría
   * @param {string} item.description - Descripción del item
   * @param {number} item.price_small - Precio pequeño
   * @param {number} item.price_large - Precio grande
   * @param {string} item.image - URL de la imagen
   */
  const addMenuItem = async (item) => {
    try {
      // Preparar datos para la API
      const apiItem = {
        name: item.name,
        category_id: item.category_id,
        price_small: item.price_small || item.price,
        price_large: item.price_large || null,
        description: item.description,
        popular: item.popular || 0,
        available: item.available !== undefined ? item.available : 1
      }

      // Llamar a la API
      const newItem = await fetch('http://localhost:3001/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiItem)
      }).then(res => res.json())

      // Actualizar estado local
      setMenuItems(prev => [...prev, {
        id: newItem.id.toString(),
        name: newItem.name,
        category: newItem.category_name.toLowerCase(),
        description: newItem.description,
        price_small: newItem.price_small,
        price_large: newItem.price_large,
        popular: newItem.popular === 1,
        available: newItem.available === 1,
        image: item.image || '/default-food.jpg'
      }])

      return newItem
    } catch (error) {
      console.error('Error agregando item:', error)
      throw error
    }
  }

  /**
   * Actualiza un item existente del menú usando la API.
   *
   * @param {string} id - ID del item a actualizar
   * @param {Object} updatedItem - Propiedades actualizadas del item
   */
  const updateMenuItem = async (id, updatedItem) => {
    try {
      // Preparar datos para la API
      const apiItem = {
        name: updatedItem.name,
        category_id: updatedItem.category_id,
        price_small: updatedItem.price_small || updatedItem.price,
        price_large: updatedItem.price_large || null,
        description: updatedItem.description,
        popular: updatedItem.popular || 0,
        available: updatedItem.available !== undefined ? updatedItem.available : 1
      }

      // Llamar a la API
      const updated = await fetch(`http://localhost:3001/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiItem)
      }).then(res => res.json())

      // Actualizar estado local
      setMenuItems(prev => prev.map(item => 
        item.id === id 
          ? {
              ...item,
              name: updated.name,
              category: updated.category_name.toLowerCase(),
              description: updated.description,
              price_small: updated.price_small,
              price_large: updated.price_large,
              popular: updated.popular === 1,
              available: updated.available === 1,
              image: updatedItem.image || item.image
            }
          : item
      ))

      return updated
    } catch (error) {
      console.error('Error actualizando item:', error)
      throw error
    }
  }

  /**
   * Elimina un item del menú por su ID usando la API.
   *
   * @param {string} id - ID del item a eliminar
   */
  const deleteMenuItem = async (id) => {
    try {
      // Llamar a la API (borrado lógico)
      await fetch(`http://localhost:3001/api/menu/${id}`, {
        method: 'DELETE'
      })

      // Actualizar estado local
      setMenuItems(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error eliminando item:', error)
      throw error
    }
  }

  /**
   * Crea una nueva categoría usando la API.
   *
   * @param {Object} category - Nueva categoría
   * @param {string} category.name - Nombre de la categoría
   * @param {number} category.display_order - Orden de visualización
   */
  const addCategory = async (category) => {
    try {
      const newCategory = await fetch('http://localhost:3001/api/menu/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category)
      }).then(res => res.json())

      // Actualizar estado local
      setCategories(prev => [...prev, newCategory.name.toLowerCase()])
      return newCategory
    } catch (error) {
      console.error('Error agregando categoría:', error)
      throw error
    }
  }

  return (
    <MenuContext.Provider
      value={{ 
        menuItems, 
        availableCategories, 
        addMenuItem, 
        updateMenuItem, 
        deleteMenuItem,
        addCategory,
        loading
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}
