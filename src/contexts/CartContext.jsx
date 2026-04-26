import { createContext, useState, useEffect } from 'react'

/**
 * Contexto del carrito de compras.
 * Maneja el estado del carrito, persistencia en localStorage y operaciones CRUD.
 */
export const CartContext = createContext()

/**
 * Proveedor del contexto del carrito.
 * Gestiona items del carrito con persistencia automática en localStorage.
 *
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Proveedor de contexto
 */
export const CartProvider = ({ children }) => {
  // Estado del carrito inicializado desde localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Efecto para guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  /**
   * Agrega un item al carrito.
   * Si el item ya existe (mismo id y variant), incrementa la cantidad.
   * Si no existe, lo agrega con la cantidad especificada.
   *
   * @param {Object} item - Item del menú a agregar
   * @param {string} item.id - ID único del item
   * @param {string} item.variant - Variante del item (ej: tamaño)
   * @param {number} item.price - Precio del item
   * @param {number} [quantity=1] - Cantidad a agregar
   */
  const addToCart = (item, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.variant === item.variant)
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.variant === item.variant
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { ...item, quantity }]
    })
  }

  /**
   * Remueve completamente un item del carrito por su ID.
   *
   * @param {string} id - ID del item a remover
   */
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  /**
   * Actualiza la cantidad de un item en el carrito.
   * Si la cantidad es <= 0, remueve el item.
   *
   * @param {string} id - ID del item a actualizar
   * @param {number} quantity - Nueva cantidad
   */
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  /**
   * Vacía completamente el carrito.
   */
  const clearCart = () => setCart([])

  /**
   * Calcula el total del carrito (suma de precio * cantidad de todos los items).
   *
   * @returns {number} Total del carrito
   */
  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  /**
   * Calcula el número total de items en el carrito (suma de cantidades).
   *
   * @returns {number} Número total de items
   */
  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}