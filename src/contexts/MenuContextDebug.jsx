/**
 * MenuContext con debugging extensivo para identificar problemas
 */
import { createContext, useState, useMemo, useEffect, useCallback } from 'react'
import { menuService } from '../services/menuService'

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  console.log('🔄 MenuContext: Iniciando provider');

  // Función para cargar datos
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
      setCategories([
        { id: 1, name: 'pizzas', display_order: 1 },
        { id: 2, name: 'bebidas', display_order: 2 },
        { id: 3, name: 'combos', display_order: 3 },
        { id: 4, name: 'postres', display_order: 4 }
      ])
      console.log('✅ MenuContext: Datos fallback cargados')
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    loadData()

    // Listener para refrescar datos cuando se edita un producto
    const handleMenuUpdate = () => {
      console.log('🔄 MenuContext: Recibiendo evento menuDataUpdated, recargando datos...')
      loadData()
    }

    window.addEventListener('menuDataUpdated', handleMenuUpdate)

    return () => {
      window.removeEventListener('menuDataUpdated', handleMenuUpdate)
    }
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
      // Crear FormData para enviar archivo
      const formData = new FormData();

      // Agregar datos del producto
      formData.append('name', item.name);
      formData.append('category_id', item.category_id);
      formData.append('price_small', item.price_small || item.price || 0);
      formData.append('price_medium', item.price_medium || null);
      formData.append('price_large', item.price_large || null);
      formData.append('description', item.description || '');
      formData.append('popular', item.popular || 0);
      formData.append('available', item.available !== undefined ? (item.available ? 1 : 0) : 1);

      // Agregar archivo de imagen si existe
      if (item.imageFile) {
        formData.append('image', item.imageFile);
      }

      console.log('📤 MenuContext: Enviando producto con imagen');

      // Llamar a la API con FormData
      const response = await fetch('http://localhost:3001/api/menu', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear producto');
      }

      const newItem = await response.json();
      console.log('✅ MenuContext: Producto creado:', newItem);

      // Actualizar estado local mapeando al formato que espera el frontend
      setMenuItems(prev => [...prev, {
        id: newItem.id.toString(),
        name: newItem.name,
        category: newItem.category_name ? newItem.category_name.toLowerCase() : (item.category || 'extras'),
        description: newItem.description,
        price_small: newItem.price_small,
        price_medium: newItem.price_medium,
        price_large: newItem.price_large,
        popular: newItem.popular === 1,
        available: newItem.available === 1,
        image: newItem.image || ''
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
    console.log('Datos del item a actualizar:', item);
    try {
      // Crear FormData para enviar archivo
      const formData = new FormData();

      // Agregar datos del producto
      formData.append('name', item.name || '');
      formData.append('category_id', item.category_id || 1);
      formData.append('price_small', item.price_small || item.price || 0);
      formData.append('price_medium', item.price_medium || null);
      formData.append('price_large', item.price_large || null);
      formData.append('description', item.description || '');
      formData.append('popular', item.popular ? 1 : 0);
      formData.append('available', item.available !== undefined ? (item.available ? 1 : 0) : 1);

      // Agregar archivo de imagen si existe (solo si se cambió)
      if (item.imageFile) {
        formData.append('image', item.imageFile);
        console.log('Agregando archivo de imagen:', item.imageFile.name);
      }

      console.log('📤 MenuContext: FormData creado para actualizar producto');
      console.log('Campos en FormData:', Array.from(formData.entries()));

      const response = await fetch(`http://localhost:3001/api/menu/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar producto');
      }

      const updatedItem = await response.json();
      console.log('✅ MenuContext: Producto actualizado:', updatedItem);

      // Actualizar estado local mapeando al formato que espera el frontend
      setMenuItems(prev => prev.map(i => i.id.toString() === id.toString() ? {
        id: updatedItem.id.toString(),
        name: updatedItem.name,
        category: updatedItem.category_name ? updatedItem.category_name.toLowerCase() : (item.category || 'extras'),
        description: updatedItem.description,
        price_small: updatedItem.price_small,
        price_medium: updatedItem.price_medium,
        price_large: updatedItem.price_large,
        popular: updatedItem.popular === 1,
        available: updatedItem.available === 1,
        image: updatedItem.image || item.image || ''
      } : i));
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear categoría');
      }

      const newCategory = await response.json();
      console.log('✅ MenuContext: Categoría creada:', newCategory);

      // Actualizar estado local con el formato correcto
      setCategories(prev => [...prev, newCategory.name.toLowerCase()]);
    } catch (error) {
      console.error('❌ MenuContext: Error agregando categoría:', error);
      throw error;
    }
  }

  /**
   * Obtiene productos de una categoría específica.
   */
  const getProductsInCategory = async (categoryId) => {
    console.log('📋 MenuContext: Obteniendo productos de categoría:', categoryId);
    try {
      const response = await fetch(`http://localhost:3001/api/menu/categories/${categoryId}/products`);

      if (!response.ok) {
        throw new Error('Error al obtener productos de la categoría');
      }

      const products = await response.json();
      console.log('✅ MenuContext: Productos obtenidos:', products);
      return products;
    } catch (error) {
      console.error('❌ MenuContext: Error obteniendo productos:', error);
      throw error;
    }
  }

  /**
   * Elimina una categoría.
   */
  const deleteCategory = async (categoryId) => {
    console.log('🗑️ MenuContext: Eliminando categoría:', categoryId);
    try {
      const response = await fetch(`http://localhost:3001/api/menu/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al eliminar categoría');
      }

      console.log('✅ MenuContext: Categoría eliminada');

      // Actualizar estado local - recargar categorías desde API
      const categoriesResponse = await fetch('http://localhost:3001/api/menu/categories');
      if (categoriesResponse.ok) {
        const updatedCategories = await categoriesResponse.json();
        setCategories(['todas', ...updatedCategories.map(cat => cat.name.toLowerCase())]);
      }
    } catch (error) {
      console.error('❌ MenuContext: Error eliminando categoría:', error);
      throw error;
    }
  }

  // Función para refrescar datos manualmente
  const refreshData = useCallback(() => {
    console.log('🔄 MenuContext: Refrescando datos manualmente')
    loadData()
  }, [])

  // Valor del contexto con debugging
  const value = useMemo(() => ({
    menuItems,
    availableCategories,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    getProductsInCategory,
    deleteCategory,
    refreshData
  }), [menuItems, availableCategories, loading, error])

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
