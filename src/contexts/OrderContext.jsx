import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

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
  const [loading, setLoading] = useState(true)

  /**
   * Carga los pedidos desde la base de datos
   */
  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar pedidos al montar el componente y configurar polling para actualizaciones
  useEffect(() => {
    loadOrders()

    // Polling cada 5 segundos para actualizaciones en tiempo real
    const interval = setInterval(() => {
      loadOrders()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  /**
   * Agrega un nuevo pedido al estado local.
   * Usado internamente después de guardar en BD.
   *
   * @param {Object} order - Datos del pedido
   */
  const addOrder = (order) => {
    setOrders((prev) => [...prev, order])
    return order
  }

  /**
   * Actualiza el estado de un pedido existente.
   * @param {string|number} orderId - ID del pedido
   * @param {string} status - Nuevo estado
   */
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.patch(`http://localhost:3001/api/orders/${orderId}/status`, { status })
      const updatedOrder = response.data

      // Actualizar el estado local
      setOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)))

      return updatedOrder
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error)
      throw error
    }
  }

  /**
   * Realiza un pedido - guarda en la base de datos y actualiza el estado local.
   * @param {Object} order - Datos del pedido
   */
  const placeOrder = async (order) => {
    try {
      // Crear el pedido en la base de datos
      const response = await axios.post('http://localhost:3001/api/orders', order)
      const savedOrder = response.data

      // Agregar al estado local también
      addOrder(savedOrder)

      return savedOrder
    } catch (error) {
      console.error('Error al crear pedido:', error)
      throw error
    }
  }

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
    <OrderContext.Provider value={{ orders, loading, addOrder, placeOrder, updateOrderStatus, getEarningsStats }}>
      {children}
    </OrderContext.Provider>
  )
}
