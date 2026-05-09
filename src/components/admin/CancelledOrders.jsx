const CancelledOrders = ({ orders, darkMode }) => {
  const sectionClass = darkMode
    ? 'rounded-[2rem] border border-white/10 bg-gris-oscuro/90 p-8 shadow-2xl shadow-black/20'
    : 'rounded-[2rem] border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-8 shadow-lg shadow-blue-100/50'

  const textMuted = darkMode ? 'text-texto-muted' : 'text-gray-500'
  const textMain = darkMode ? 'text-white' : 'text-gray-900'
  const cardClass = darkMode
    ? 'rounded-3xl border border-white/10 bg-[#111111] p-6'
    : 'rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-100 p-6 shadow-md shadow-blue-100/30'

  return (
    <section className={sectionClass}>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-red-500">Pedidos cancelados</p>
        <h2 className={`mt-3 text-3xl font-bold ${textMain}`}>Historial de cancelaciones</h2>
      </div>

      {orders.length === 0 ? (
        <p className={textMuted}>No hay pedidos cancelados.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className={cardClass}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className={`text-lg font-semibold ${textMain}`}>Pedido #{order.id}</p>
                  <p className={`text-sm ${textMuted}`}>{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xl font-bold text-red-500">${order.total_amount.toLocaleString()}</p>
                  <span className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                    Cancelado
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-gray-50 dark:bg-[#161616] p-4">
                  <p className={`text-sm uppercase tracking-[0.35em] ${textMuted}`}>Cliente</p>
                  <p className={`mt-2 ${textMain}`}>{order.customer_name}</p>
                  <p className={textMuted}>{order.customer_phone}</p>
                  <p className={textMuted}>{order.customer_address}</p>
                </div>
                <div className="rounded-3xl bg-gray-50 dark:bg-[#161616] p-4">
                  <p className={`text-sm uppercase tracking-[0.35em] ${textMuted}`}>Pago</p>
                  <p className={`mt-2 ${textMain}`}>{order.payment_method}</p>
                  <p className={`mt-4 text-sm uppercase tracking-[0.35em] ${textMuted}`}>Productos</p>
                  <ul className={`mt-2 space-y-2 ${textMuted}`}>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.item_name} x{item.quantity} • ${item.unit_price.toLocaleString()} {item.size ? `(${item.size})` : ''}
                      </li>
                    ))}
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

export default CancelledOrders