import { createContext, useState } from 'react'

/**
 * Contexto de pedidos de la aplicación.
 * Gestiona el estado de los pedidos realizados y estadísticas relacionadas.
 */
export const OrderContext = createContext()

/**
 * Proveedor del contexto de pedidos.
 * Maneja la creación de pedidos y cálculo de estadísticas de ganancias.
 *
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {React.ReactElement} Proveedor de contexto
 */
export const OrderProvider = ({ children }) => {
  // Estado de todos los pedidos realizados
  const [orders, setOrders] = useState([])

  /**
   * Agrega un nuevo pedido a la lista de pedidos.
   * Genera un ID único y timestamp automático.
   *
   * @param {Object} order - Datos del pedido
   * @param {Array} order.items - Items del pedido
   * @param {number} order.total - Total del pedido
   * @param {Object} order.customerInfo - Información del cliente
   */
  const addOrder = (order) => {
    const newOrder = {
      id: `o${Date.now()}`,
      date: new Date(),
      status: order.status || 'En preparación',
      ...order,
    }
    setOrders((prev) => [...prev, newOrder])
    return newOrder
  }

  /**
   * Actualiza el estado de un pedido existente.
   * @param {string} orderId - ID del pedido
   * @param {string} status - Nuevo estado
   */
  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  /**
   * Alias para addOrder - función para realizar un pedido.
   * Mantiene compatibilidad con código existente.
   *
   * @param {Object} order - Datos del pedido
   */
  const placeOrder = (order) => addOrder(order)

  /**
   * Calcula estadísticas de ganancias de los pedidos.
   * Retorna total de ganancias, número de pedidos y promedio por pedido.
   *
   * @returns {Object} Estadísticas de ganancias
   * @returns {number} return.totalEarnings - Ganancias totales
   * @returns {number} return.totalOrders - Número total de pedidos
   * @returns {number} return.averageOrder - Promedio por pedido
   */
  const getEarningsStats = () => {
    const totalEarnings = orders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = orders.length
    const averageOrder = totalOrders > 0 ? totalEarnings / totalOrders : 0

    return {
      totalEarnings,
      totalOrders,
      averageOrder
    }
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, placeOrder, updateOrderStatus, getEarningsStats }}>
      {children}
    </OrderContext.Provider>
  )
}
