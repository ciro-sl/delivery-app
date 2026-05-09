import { useState, useMemo } from 'react'

const DeliveredOrders = ({ orders, darkMode }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Filtrar pedidos por fechas
  const filteredOrders = useMemo(() => {
    if (!startDate && !endDate) return orders

    return orders.filter(order => {
      const orderDate = new Date(order.created_at).toISOString().split('T')[0]
      const start = startDate || '1900-01-01'
      const end = endDate || '2100-12-31'
      return orderDate >= start && orderDate <= end
    })
  }, [orders, startDate, endDate])

  const sectionClass = darkMode
    ? 'rounded-[2rem] border border-white/10 bg-gris-oscuro/90 p-8 shadow-2xl shadow-black/20'
    : 'rounded-[2rem] border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-8 shadow-lg shadow-blue-100/50'

  const textMuted = darkMode ? 'text-texto-muted' : 'text-gray-500'
  const textMain = darkMode ? 'text-white' : 'text-gray-900'
  const cardClass = darkMode
    ? 'rounded-3xl border border-white/10 bg-[#111111] p-6'
    : 'rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-100 p-6 shadow-md shadow-blue-100/30'

  // Función para agrupar pedidos por período
  const groupOrders = (orders, period) => {
    const groups = {}
    orders.forEach(order => {
      let key
      const date = new Date(order.created_at)
      if (period === 'daily') {
        key = date.toISOString().split('T')[0]
      } else if (period === 'weekly') {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
      } else if (period === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }
      if (!groups[key]) groups[key] = []
      groups[key].push(order)
    })
    return Object.entries(groups).map(([key, ords]) => ({
      period: key,
      orders: ords,
      count: ords.length,
      total: ords.reduce((sum, o) => sum + o.total_amount, 0)
    })).sort((a, b) => b.period.localeCompare(a.period))
  }

  const daily = groupOrders(filteredOrders, 'daily')
  const weekly = groupOrders(filteredOrders, 'weekly')
  const monthly = groupOrders(filteredOrders, 'monthly')

  return (
    <section className={sectionClass}>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-verde">Pedidos completados</p>
        <h2 className={`mt-3 text-3xl font-bold ${textMain}`}>Historial de entregas</h2>

        {/* Filtros de fecha */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex flex-col">
            <label className={`text-sm font-medium ${textMain} mb-1`}>Fecha inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${darkMode ? 'border-zinc-800' : ''}`}
            />
          </div>
          <div className="flex flex-col">
            <label className={`text-sm font-medium ${textMain} mb-1`}>Fecha fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${darkMode ? 'border-zinc-800' : ''}`}
            />
          </div>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => {
                setStartDate('')
                setEndDate('')
              }}
              className="mt-6 sm:mt-0 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Diario */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold ${textMain} mb-4`}>Entregas Diarias</h3>
        {daily.length === 0 ? (
          <p className={textMuted}>No hay entregas diarias.</p>
        ) : (
          <div className="space-y-4">
            {daily.map(group => (
              <div key={group.period} className={cardClass}>
                <div className="flex justify-between items-center mb-4">
                  <p className={`text-lg font-semibold ${textMain}`}>{new Date(group.period).toLocaleDateString('es-ES')}</p>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-verde">${group.total.toLocaleString()}</p>
                    <p className={textMuted}>{group.count} pedidos</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {group.orders.map(order => (
                    <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/10">
                      <p className={textMain}>Pedido #{order.id}</p>
                      <p className="font-semibold text-verde">${order.total_amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Semanal */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold ${textMain} mb-4`}>Entregas Semanales</h3>
        {weekly.length === 0 ? (
          <p className={textMuted}>No hay entregas semanales.</p>
        ) : (
          <div className="space-y-4">
            {weekly.map(group => (
              <div key={group.period} className={cardClass}>
                <div className="flex justify-between items-center mb-4">
                  <p className={`text-lg font-semibold ${textMain}`}>Semana del {new Date(group.period).toLocaleDateString('es-ES')}</p>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-verde">${group.total.toLocaleString()}</p>
                    <p className={textMuted}>{group.count} pedidos</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {group.orders.map(order => (
                    <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/10">
                      <p className={textMain}>Pedido #{order.id} - {new Date(order.created_at).toLocaleDateString('es-ES')}</p>
                      <p className="font-semibold text-verde">${order.total_amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mensual */}
      <div>
        <h3 className={`text-xl font-semibold ${textMain} mb-4`}>Entregas Mensuales</h3>
        {monthly.length === 0 ? (
          <p className={textMuted}>No hay entregas mensuales.</p>
        ) : (
          <div className="space-y-4">
            {monthly.map(group => (
              <div key={group.period} className={cardClass}>
                <div className="flex justify-between items-center mb-4">
                  <p className={`text-lg font-semibold ${textMain}`}>{new Date(group.period + '-01').toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}</p>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-verde">${group.total.toLocaleString()}</p>
                    <p className={textMuted}>{group.count} pedidos</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {group.orders.map(order => (
                    <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/10">
                      <p className={textMain}>Pedido #{order.id} - {new Date(order.created_at).toLocaleDateString('es-ES')}</p>
                      <p className="font-semibold text-verde">${order.total_amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default DeliveredOrders