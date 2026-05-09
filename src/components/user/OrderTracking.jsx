import { useState, useEffect } from 'react'
import axios from 'axios'

const OrderTracking = () => {
  const [phone, setPhone] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const trackOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const res = await axios.get(`http://localhost:3001/api/orders/track/${phone}`)
      setOrder(res.data)
    } catch {
      setError('Pedido no encontrado. Verifica el número de teléfono.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'En preparación': 'bg-yellow-500',
      'Preparando': 'bg-blue-500',
      'Entregado': 'bg-green-500',
      'Cancelado': 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusText = (status) => {
    return status
  }

  // Polling para actualizaciones en tiempo real del pedido
  useEffect(() => {
    if (!order) return

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders/track/${phone}`)
        if (response.data) {
          setOrder(response.data)
        } else {
          // Pedido ya no disponible (entregado o cancelado)
          setOrder(null)
          setError('Tu pedido ya ha sido procesado. ¡Gracias por tu compra!')
        }
      } catch (err) {
        // Si hay error, mantener el pedido actual
      }
    }, 3000) // cada 3 segundos

    return () => clearInterval(interval)
  }, [order, phone])

  return (
    <div className="container mx-auto px-4 py-14 max-w-2xl bg-gray-50 dark:bg-[#0f0f0f] min-h-screen">
      <div className="glass-panel rounded-[2.5rem] border-transparent p-10">
        <div className="text-center mb-8">
          <p className="inline-flex items-center gap-3 rounded-full bg-gray-100 dark:bg-white/10 px-4 py-2 text-sm text-amarillo shadow-sm shadow-amber-500/10">
            <span>📦</span> Seguimiento de pedido
          </p>
          <h1 className="mt-4 text-4xl font-bold text-black dark:text-white">¿Dónde está mi pedido?</h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-texto-muted">
            Ingresa tu número de teléfono para rastrear el estado de tu pedido
          </p>
        </div>

        <form onSubmit={trackOrder} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-2">
              Número de teléfono
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-3xl border border-gray-300 dark:border-white/10 bg-gradient-to-br from-white to-gray-50 dark:from-[#1f1f24] dark:to-[#121217] px-4 py-3 text-black dark:text-white outline-none transition focus:border-orange-400 shadow-sm"
              placeholder="300 123 4567"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-verde to-emerald-400 px-6 py-4 text-base font-bold uppercase text-white shadow-xl shadow-emerald-500/25 transition hover:scale-[1.01] hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Buscando...' : 'Buscar pedido'}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-3xl border border-red-300 bg-gradient-to-br from-red-50 to-red-100 p-4 text-sm text-red-800 text-center">
            {error}
          </div>
        )}

        {order && (
          <div className="mt-8 glass-card rounded-[2rem] border-transparent p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-black dark:text-white">
                Pedido #{order.id}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-texto-muted">Cliente</p>
                <p className="font-semibold text-black dark:text-white">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-texto-muted">Total</p>
                <p className="text-xl font-bold text-amarillo">${order.total_amount.toLocaleString()}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 dark:text-texto-muted">Dirección</p>
                <p className="text-sm text-black dark:text-white break-words">{order.customer_address}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-black dark:text-white mb-3">Productos</p>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/10 last:border-b-0">
                    <div>
                      <span className="font-semibold text-black dark:text-white">{item.item_name}</span>
                      <span className="text-sm text-gray-600 dark:text-texto-muted ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-amarillo">${(item.unit_price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
              <p className="text-xs text-gray-500 dark:text-texto-muted">
                Pedido realizado el {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderTracking