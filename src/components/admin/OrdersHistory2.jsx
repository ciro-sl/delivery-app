const OrdersHistory = ({ orders, darkMode }) => {
  const getStatusColor = (paymentMethod) => {
    const colors = {
      'Nequi': darkMode ? 'bg-verde/20 text-verde border-verde/30' : 'bg-green-100 text-green-700 border-green-200',
      'Efectivo': darkMode ? 'bg-amarillo/20 text-amarillo border-amarillo/30' : 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Daviplata': darkMode ? 'bg-naranja/20 text-naranja border-naranja/30' : 'bg-orange-100 text-orange-700 border-orange-200',
      'Tarjeta': darkMode ? 'bg-vinotinto/20 text-vinotinto border-vinotinto/30' : 'bg-red-100 text-red-700 border-red-200',
    }
    return colors[paymentMethod] || (darkMode ? 'bg-white/10 text-white border-white/20' : 'bg-gray-100 text-gray-700 border-gray-200')
  }

  const sectionClass = darkMode
    ? 'rounded-[2rem] border border-white/10 bg-gradient-to-br from-gris-oscuro/95 via-gris-oscuro/90 to-[#151515] p-8 shadow-2xl shadow-black/40 backdrop-blur-sm'
    : 'rounded-[2rem] border border-gray-200 bg-white p-8 shadow-lg'

  const cardClass = darkMode
    ? 'group rounded-2xl border border-white/5 bg-gradient-to-r from-[#1a1a1a] via-[#161616] to-[#111111] p-6 transition-all duration-300 hover:scale-[1.01] hover:border-naranja/20 hover:shadow-2xl hover:shadow-naranja/10 animate-fade-in'
    : 'group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-[1.01] hover:border-naranja/20 hover:shadow-lg animate-fade-in'

  const textMuted = darkMode ? 'text-texto-muted' : 'text-gray-500'
  const textMain = darkMode ? 'text-white' : 'text-gray-900'

  return (
    <section className={sectionClass}>
      <div className='mb-8'>
        <div className='flex items-center gap-3'>
          <p className='text-sm uppercase tracking-[0.35em] text-naranja font-semibold'>
            Pedidos recibidos
          </p>
          <span className='inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-texto-muted border border-white/10'>
            Total: {orders.length}
          </span>
        </div>
        <h2 className={`mt-2 text-3xl font-bold ${textMain}`}>
          Historial de pedidos
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <div className='relative mb-6'>
            <div className={'flex h-24 w-24 items-center justify-center rounded-full border ' + (darkMode ? 'bg-gradient-to-br from-white/5 to-transparent border-white/10' : 'bg-gray-100 border-gray-200')}>
              <span className='text-5xl opacity-50'>📦</span>
            </div>
            <div className='absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-naranja animate-pulse' />
          </div>
          <p className={`max-w-xs ${textMuted}`}>
            Aun no hay pedidos registrados. Los pedidos apareceran aqui automaticamente.
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order, idx) => (
            <div
              key={order.id}
              className={cardClass}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-4'>
                  <div className={'flex h-14 w-14 items-center justify-center rounded-2xl border shadow-lg ' + (darkMode ? 'bg-gradient-to-br from-naranja/20 to-amarillo/10 border-naranja/20' : 'bg-gradient-to-br from-orange-100 to-yellow-50 border-orange-200')}>
                    <span className={'text-xl font-bold ' + (darkMode ? 'text-naranja' : 'text-orange-600')}>#{order.id}</span>
                  </div>
                  <div>
                    <p className={'text-lg font-bold transition-colors ' + (darkMode ? 'text-white group-hover:text-naranja' : 'text-gray-900 group-hover:text-orange-600')}>
                      Pedido #{order.id}
                    </p>
                    <div className={'mt-1 flex flex-wrap gap-2 text-xs ' + textMuted}>
                      <span className='inline-flex items-center gap-1'>
                        <span>📅</span>
                        {new Date(order.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className='inline-flex items-center gap-1'>
                        <span>⏰</span>
                        {new Date(order.date).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col items-end gap-2'>
                  <p className='text-2xl font-bold text-amarillo group-hover:scale-110 transition-transform'>
                    ${order.total.toLocaleString()}
                  </p>
                  <span className={getStatusColor(order.paymentMethod)}>
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              <div className={'mt-5 grid gap-4 border-t pt-4 sm:grid-cols-2 ' + (darkMode ? 'border-white/5' : 'border-gray-200')}>
                <div className={'rounded-xl p-4 border ' + (darkMode ? 'bg-[#111111]/50 border-white/5' : 'bg-gray-50 border-gray-200')}>
                  <p className={'text-xs uppercase tracking-[0.2em] ' + textMuted + ' mb-3'}>
                    👤 Información del cliente
                  </p>
                  <p className={textMain + ' font-medium'}>{order.customer.name}</p>
                  <p className={textMuted}>{order.customer.phone}</p>
                  <p className={textMuted + ' mt-1'}>{order.customer.address}</p>
                </div>

                <div className={'rounded-xl p-4 border ' + (darkMode ? 'bg-[#111111]/50 border-white/5' : 'bg-gray-50 border-gray-200')}>
                  <p className={'text-xs uppercase tracking-[0.2em] ' + textMuted + ' mb-3'}>
                    🛒 Productos ({order.items.length})
                  </p>
                  <ul className={`space-y-1 text-sm ${textMuted}`}>
                    {order.items.slice(0, 3).map((item, index) => (
                      <li key={index} className='flex justify-between'>
                        <span>
                          {item.name}
                          {item.variant && <span className='text-xs opacity-70'> ({item.variant})</span>}
                        </span>
                        <span className={textMain}>x{item.quantity}</span>
                      </li>
                    ))}
                    {order.items.length > 3 && (
                      <li className='text-xs text-naranja'>
                        +{order.items.length - 3} más...
                      </li>
                    )}
                  </ul>
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