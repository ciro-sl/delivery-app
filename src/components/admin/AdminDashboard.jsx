const AdminDashboard = ({ orders, darkMode }) => {
  const latestOrders = orders.slice(0, 5)

  const cardClass = darkMode
    ? 'group relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#111111] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-naranja/30 hover:shadow-[0_0_30px_rgba(255,127,17,0.15)]'
    : 'group relative rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-100 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-orange-300 hover:shadow-xl hover:shadow-blue-200/50'

  const sectionClass = darkMode
    ? 'rounded-[2rem] border border-white/10 bg-gradient-to-br from-gris-oscuro/95 via-gris-oscuro/90 to-[#151515] p-8 shadow-2xl shadow-black/40 backdrop-blur-sm'
    : 'rounded-[2rem] border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-8 shadow-lg shadow-blue-100/50'

  const textMuted = darkMode ? 'text-texto-muted' : 'text-gray-500'
  const textWhite = darkMode ? 'text-white' : 'text-gray-900'

  return (
    <section className={sectionClass}>
      <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='text-sm uppercase tracking-[0.35em] text-naranja font-semibold'>
            Vision general
          </p>
           <h2 className={'mt-2 text-3xl font-bold ' + textWhite}>
             Resumen rapido
             <span className='ml-2 inline-flex items-center justify-center w-2 h-2 rounded-full bg-verde animate-pulse' />
           </h2>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-5 md:grid-cols-3'>
        <div className={cardClass}>
          <div className='absolute inset-0 pointer-events-none bg-gradient-to-br from-naranja/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
          <p className={'relative text-sm uppercase tracking-[0.35em] ' + textMuted}>Pedidos recientes</p>
          <p className={'relative mt-4 text-5xl font-bold ' + (darkMode ? 'text-white group-hover:text-naranja' : 'text-gray-900 group-hover:text-naranja')}>
            {latestOrders.length}
          </p>
        </div>

        <div className={cardClass}>
          <div className='absolute inset-0 pointer-events-none bg-gradient-to-br from-verde/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
          <p className={'relative text-sm uppercase tracking-[0.35em] ' + textMuted}>Ultimo pedido</p>
          <p className={'relative mt-4 text-lg font-medium ' + (darkMode ? 'text-white' : 'text-gray-900')}>
            {latestOrders[0] ? new Date(latestOrders[0].created_at).toLocaleString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Sin pedidos aun'}
          </p>
        </div>

        <div className={cardClass}>
          <div className='absolute inset-0 pointer-events-none bg-gradient-to-br from-amarillo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
          <p className={'relative text-sm uppercase tracking-[0.35em] ' + textMuted}>Estado</p>
          <p className={'relative mt-4 leading-relaxed ' + (darkMode ? 'text-white' : 'text-gray-900')}>
            {orders.length > 0 ? '🟢 Activo — Pedidos en tiempo real' : '🟡 Esperando primeros pedidos'}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className={darkMode ? 'mt-10 rounded-3xl border border-white/10 bg-gradient-to-b from-[#111111] to-[#0a0a0a] p-6' : 'mt-10 rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-6'}>
        <div className='mb-6 flex items-center gap-3'>
          <h3 className={'text-xl font-semibold ' + (darkMode ? 'text-white' : 'text-gray-900')}>Pedidos recientes</h3>
          <span className='inline-flex items-center rounded-full bg-naranja/20 px-2 py-1 text-xs font-medium text-naranja'>
            Ultimos 5
          </span>
        </div>

        {latestOrders.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5'>
              <span className='text-3xl'>📦</span>
            </div>
            <p className={textMuted}>No hay pedidos para mostrar todavia.</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {latestOrders.map((order, idx) => (
              <div
                key={order.id}
                className={'group rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 animate-fade-in ' + (darkMode ? 'border-white/5 bg-[#161616] hover:border-naranja/20 hover:bg-[#1a1a1a]' : 'border-gray-200 bg-white hover:border-naranja/20 hover:bg-gray-50')}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className={'flex h-10 w-10 items-center justify-center rounded-full shadow-md ' + (darkMode ? 'bg-gradient-to-br from-naranja to-amarillo' : 'bg-gradient-to-br from-naranja to-amarillo')}>
                      <span className={'text-sm font-bold ' + (darkMode ? 'text-gris-oscuro' : 'text-white')}>#{order.id}</span>
                    </div>
                    <div>
                      <p className={'font-semibold ' + (darkMode ? 'text-white group-hover:text-naranja' : 'text-gray-900 group-hover:text-naranja') + ' transition-colors'}>
                        Pedido #{order.id}
                      </p>
                      <p className={'text-xs ' + textMuted}>
                        {new Date(order.created_at).toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-amarillo'>
                      ${order.total_amount.toLocaleString()}
                    </p>
                    <p className={'text-xs ' + textMuted}>{order.payment_method}</p>
                  </div>
                </div>

                <div className={'mt-3 flex flex-wrap gap-2 text-xs ' + textMuted + ' border-t ' + (darkMode ? 'border-white/5 pt-3' : 'border-gray-200 pt-3')}>
                  <span className='inline-flex items-center gap-1'>
                    <span>👤</span> {order.customer_name}
                  </span>
                  <span className='inline-flex items-center gap-1'>
                    <span>📞</span> {order.customer_phone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminDashboard