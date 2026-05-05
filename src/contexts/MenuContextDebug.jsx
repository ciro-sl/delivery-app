/**
 * MenuContext con debugging extensivo para identificar problemas
 */
import { createContext, useState, useMemo, useEffect } from 'react'
import { menuService } from '../services/menuService'

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  console.log('🔄 MenuContext: Iniciando provider');

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 MenuContext: Cargando datos desde API...')
      setLoading(true)
      setError(null)
      
      try {
        const [menuData, categoriesData] = await Promise.all([
          menuService.getMenu(),
          menuService.getCategories()
        ])
        
        console.log(`📊 MenuContext: Recibidos ${menuData.length} productos y ${categoriesData.length} categorías`)
        console.log('📋 MenuContext: Productos:', menuData.map(p => p.name))
        console.log('📂 MenuContext: Categorías:', categoriesData)
        
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
        console.error('❌ MenuContext: Error cargando datos del menú:', error)
        setError(error.message)
        
        // Fallback a datos locales si la API falla
        console.log('🔄 MenuContext: Usando datos fallback')
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
        console.log('✅ MenuContext: Datos fallback cargados')
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
   */
  const addMenuItem = async (item) => {
    console.log('➕ MenuContext: Agregando producto:', item.name);
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

      console.log('📤 MenuContext: Enviando a API:', apiItem);
      
      // Llamar a la API (implementar en menuService)
      const response = await fetch('http://localhost:3001/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiItem)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear producto');
      }
      
      const newItem = await response.json();
       console.log('✅ MenuContext: Producto creado:', newItem);
        
        // Actualizar estado local
        setMenuItems(prev => [...prev, { 
          ...item, 
          id: newItem.id.toString(),
          category: item.category_id ? 
            (() => {
              const map = { 1: 'pizzas', 2: 'bebidas', 3: 'combos', 4: 'postres' };
              return map[item.category_id] || 'extras';
            })()
            : (item.category || 'extras'),
          price_small: item.price_small || item.price,
          price_large: item.price_large || null,
          image: item.image || ''
        }]);
    } catch (error) {
      console.error('❌ MenuContext: Error agregando producto:', error);
      throw error;
    }
  }

  /**
   * Actualiza un item existente del menú.
   */
  const updateMenuItem = async (id, item) => {
    console.log('✏️ MenuContext: Actualizando producto:', id, item.name);
    try {
      const apiItem = {
        name: item.name,
        category_id: item.category_id,
        price_small: item.price_small || item.price,
        price_large: item.price_large || null,
        description: item.description,
        popular: item.popular || 0,
        available: item.available !== undefined ? item.available : 1
      }

      const response = await fetch(`http://localhost:3001/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiItem)
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar producto');
      }
      
       console.log('✅ MenuContext: Producto actualizado');
        
        // Actualizar estado local - mergear correctamente los datos actualizados
        // con los existentes para no perder campos como category, price, etc.
        setMenuItems(prev => prev.map(i => 
          i.id === id 
            ? {
                ...i,
                name: item.name,
                category: item.category_id ? 
                  (() => {
                    const map = { 1: 'pizzas', 2: 'bebidas', 3: 'combos', 4: 'postres' };
                    return map[item.category_id] || i.category;
                  })()
                  : (item.category || i.category),
                description: item.description,
                price_small: item.price_small,
                price_large: item.price_large,
                image: item.image || i.image
              }
            : i
        ));
    } catch (error) {
      console.error('❌ MenuContext: Error actualizando producto:', error);
      throw error;
    }
  }

  /**
   * Elimina un item del menú (eliminación lógica).
   */
  const deleteMenuItem = async (id) => {
    console.log('🗑️ MenuContext: Eliminando producto:', id);
    try {
      const response = await fetch(`http://localhost:3001/api/menu/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }
      
      console.log('✅ MenuContext: Producto eliminado');
      
      // Actualizar estado local
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('❌ MenuContext: Error eliminando producto:', error);
      throw error;
    }
  }

  /**
   * Agrega una nueva categoría.
   */
  const addCategory = async (category) => {
    console.log('➕ MenuContext: Agregando categoría:', category.name);
    try {
      const response = await fetch('http://localhost:3001/api/menu/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });
      
      if (!response.ok) {
        throw new Error('Error al crear categoría');
      }
      
      console.log('✅ MenuContext: Categoría creada');
      
      // Actualizar estado local
      setCategories(prev => [...prev, category.name.toLowerCase()]);
    } catch (error) {
      console.error('❌ MenuContext: Error agregando categoría:', error);
      throw error;
    }
  }

  // Valor del contexto con debugging
  const value = useMemo(() => {
    console.log('🔄 MenuContext: Actualizando valor del contexto');
    return {
      menuItems,
      availableCategories,
      loading,
      error,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addCategory
    }
  }, [menuItems, availableCategories, loading, error, addMenuItem, updateMenuItem, deleteMenuItem, addCategory])

  console.log('📊 MenuContext: Estado actual:', {
    menuItemsCount: menuItems.length,
    categoriesCount: categories.length,
    loading,
    error: error?.message
  });

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  )
}
