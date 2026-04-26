const OrdersHistory = ({ orders, darkMode, updateOrderStatus }) => {
  const sectionClass = darkMode
    ? 'rounded-[2rem] border border-white/10 bg-gris-oscuro/90 p-8 shadow-2xl shadow-black/20'
    : 'rounded-[2rem] border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-8 shadow-lg shadow-blue-100/50'

  const textMuted = darkMode ? 'text-texto-muted' : 'text-gray-500'
  const textMain = darkMode ? 'text-white' : 'text-gray-900'
  const cardClass = darkMode
    ? 'rounded-3xl border border-white/10 bg-[#111111] p-6'
    : 'rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-100 p-6 shadow-md shadow-blue-100/30'
  const innerCardClass = darkMode
    ? 'rounded-3xl bg-[#161616] p-4'
    : 'rounded-3xl bg-gradient-to-br from-gray-50 to-blue-50 p-4'

  const statusOptions = ['En preparación', 'Preparando', 'Entregado', 'Cancelado']

  const getStatusBadge = (status) => {
    const statusStyles = {
      'En preparación': darkMode ? 'bg-amarillo/20 text-amarillo border-amarillo/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Preparando': darkMode ? 'bg-naranja/20 text-naranja border-naranja/30' : 'bg-orange-100 text-orange-700 border-orange-200',
      'Entregado': darkMode ? 'bg-verde/20 text-verde border-verde/30' : 'bg-green-100 text-green-700 border-green-200',
      'Cancelado': darkMode ? 'bg-red-600/15 text-red-400 border-red-400/30' : 'bg-red-100 text-red-700 border-red-200',
    }
    return statusStyles[status] || (darkMode ? 'bg-white/10 text-white border-white/20' : 'bg-gray-100 text-gray-700 border-gray-200')
  }

  return (
    <section className={sectionClass}>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-naranja">Pedidos recibidos</p>
        <h2 className={`mt-3 text-3xl font-bold ${textMain}`}>Historial de pedidos</h2>
      </div>

      {orders.length === 0 ? (
        <p className={textMuted}>Aun no hay pedidos registrados.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className={cardClass}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className={`text-lg font-semibold ${textMain}`}>Pedido #{order.id}</p>
                  <p className={`text-sm ${textMuted}`}>{new Date(order.date).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xl font-bold text-amarillo">${order.total.toLocaleString()}</p>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(order.status)}`}> 
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className={innerCardClass}>
                  <p className={`text-sm uppercase tracking-[0.35em] ${textMuted}`}>Cliente</p>
                  <p className={`mt-2 ${textMain}`}>{order.customer.name}</p>
                  <p className={textMuted}>{order.customer.phone}</p>
                  <p className={textMuted}>{order.customer.address}</p>
                </div>
                <div className={innerCardClass}>
                  <p className={`text-sm uppercase tracking-[0.35em] ${textMuted}`}>Pago</p>
                  <p className={`mt-2 ${textMain}`}>{order.paymentMethod}</p>
                  <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${textMuted}`}>Productos</p>
                  <ul className={`mt-2 space-y-2 ${textMuted}`}>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} x{item.quantity} • ${item.price.toLocaleString()} {item.variant ? `(${item.variant})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={innerCardClass}>
                  <p className={`text-sm uppercase tracking-[0.35em] ${textMuted}`}>Actualizar estado</p>
                  <select
                    value={order.status}
                    onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                    className={`mt-3 w-full rounded-3xl border px-4 py-3 ${darkMode ? 'border-white/10 bg-[#141414] text-white' : 'border-gray-200 bg-white text-gray-900'} focus:border-naranja focus:ring-naranja/20`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status} className={darkMode ? 'bg-[#111111] text-white' : 'bg-white text-gray-900'}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default OrdersHistory