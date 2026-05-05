import { useContext, useState } from 'react'
import { CartContext } from '../contexts/CartContext'
import { OrderContext } from '../contexts/OrderContext'

const paymentMethods = ['Efectivo', 'Tarjeta', 'Nequi', 'Daviplata']

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal } = useContext(CartContext)
  const { placeOrder } = useContext(OrderContext)
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmationOrder, setConfirmationOrder] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({ name: '', phone: '', address: '' })

  const validateField = (field, value) => {
    const errors = { ...fieldErrors }
    
    switch (field) {
      case 'name':
        if (!value || value.trim().length === 0) {
          errors.name = ''
        } else if (value.trim().length < 3) {
          errors.name = 'El nombre debe tener al menos 3 caracteres.'
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
          errors.name = 'El nombre solo puede contener letras y espacios.'
        } else {
          errors.name = ''
        }
        break
        
      case 'phone':
        if (!value || value.trim().length === 0) {
          errors.phone = ''
        } else if (value.trim().length < 7) {
          errors.phone = 'El teléfono debe tener al menos 7 dígitos.'
        } else if (!/^[0-9\s\-()]+$/.test(value.trim())) {
          errors.phone = 'El teléfono solo puede contener números, espacios, guiones y paréntesis.'
        } else {
          errors.phone = ''
        }
        break
        
      case 'address':
        if (!value || value.trim().length === 0) {
          errors.address = ''
        } else if (value.trim().length < 10) {
          errors.address = 'La dirección debe tener al menos 10 caracteres.'
        } else {
          errors.address = ''
        }
        break
    }
    
    setFieldErrors(errors)
  }

  const validateForm = () => {
    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
      setError('El carrito está vacío. Agrega productos antes de confirmar.')
      return false
    }

    // Validar todos los campos
    validateField('name', customer.name)
    validateField('phone', customer.phone)
    validateField('address', customer.address)

    // Verificar si hay errores
    if (fieldErrors.name || fieldErrors.phone || fieldErrors.address) {
      setError('Por favor corrige los errores en el formulario.')
      return false
    }

    // Validar que todos los productos tengan cantidad válida
    const invalidItems = cart.filter(item => item.quantity < 1)
    if (invalidItems.length > 0) {
      setError('Hay productos con cantidad inválida. Por favor revisa el carrito.')
      return false
    }

    return true
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    const order = {
      customer,
      paymentMethod,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.selectedPrice || item.price,
        variant: item.variant || 'individual',
      })),
      total: getTotal(),
      status: 'En preparación',
    }

    const newOrder = placeOrder(order)
    clearCart()
    setSuccess('Pedido registrado correctamente. Revisa el panel admin para verificarlo.')
    setConfirmationOrder(newOrder)
    setCustomer({ name: '', phone: '', address: '' })
    setPaymentMethod(paymentMethods[0])
  }

  return (
    <div className="container mx-auto px-4 py-14">
      <div className="glass-panel mb-10 rounded-[2.5rem] border-transparent p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-3 rounded-full bg-gray-100 dark:bg-white/10 px-4 py-2 text-sm text-amarillo shadow-sm shadow-amber-500/10">
              <span>🛎️</span> Confirmá tu pedido con estilo
            </p>
            <h1 className="mt-4 text-4xl font-bold text-black dark:text-white">Diseño elegante para tu orden</h1>
            <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-texto-muted">
              Personaliza, revisa y confirma tu pedido con botones vibrantes, iconos claros y un flujo limpio para cada paso.
            </p>
          </div>
          <div className="grid w-full gap-4 sm:grid-cols-3 lg:w-auto">
            <div className="glass-card rounded-3xl border-transparent p-4 text-sm text-black dark:text-white">
              <p className="icon-block"> <span>✅</span> Pedido seguro</p>
            </div>
            <div className="glass-card rounded-3xl border-transparent p-4 text-sm text-black dark:text-white">
              <p className="icon-block"> <span>🚚</span> Envío rápido</p>
            </div>
            <div className="glass-card rounded-3xl border-transparent p-4 text-sm text-black dark:text-white">
              <p className="icon-block"> <span>💳</span> Pago fácil</p>
            </div>
          </div>
        </div>
      </div>

      {confirmationOrder && (
        <section className="glass-panel mb-8 rounded-[2rem] border-transparent p-8 shadow-lg shadow-emerald-200/40 dark:shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-verde">Comprobante de pedido</p>
              <h2 className="mt-2 text-3xl font-bold text-black dark:text-white">Pedido #{confirmationOrder.id}</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-texto-muted">
                Tu pedido fue registrado correctamente y está en estado:
                <span className="ml-2 rounded-full bg-verde/10 px-3 py-1 text-sm font-semibold text-verde">
                  {confirmationOrder.status}
                </span>
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-200/60 bg-emerald-50/80 p-4 text-sm text-emerald-900 shadow-md shadow-emerald-200/40 dark:border-emerald-500/20 dark:bg-[#0f2919] dark:text-emerald-200 dark:shadow-black/10">
              <p className="font-semibold">Total confirmado</p>
              <p className="mt-2 text-3xl font-bold">${confirmationOrder.total.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#111111]">
              <p className="text-xs uppercase tracking-[0.2em] text-texto-muted">Cliente</p>
              <p className="mt-3 font-semibold text-black dark:text-white">{confirmationOrder.customer.name}</p>
              <p className="text-sm text-gray-600 dark:text-texto-muted">{confirmationOrder.customer.phone}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-texto-muted">{confirmationOrder.customer.address}</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#111111]">
              <p className="text-xs uppercase tracking-[0.2em] text-texto-muted">Pago</p>
              <p className="mt-3 font-semibold text-black dark:text-white">{confirmationOrder.paymentMethod}</p>
              <p className="mt-2 text-sm text-texto-muted">Estado actual del pedido</p>
              <p className="mt-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
                {confirmationOrder.status}
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#111111]">
              <p className="text-xs uppercase tracking-[0.2em] text-texto-muted">Productos</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-texto-muted">
                {confirmationOrder.items.map((item, index) => (
                  <li key={index} className="flex justify-between gap-2">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <section className="glass-panel rounded-[2rem] border-transparent p-8 shadow-lg shadow-blue-100/50 dark:shadow-black/20">
          <h2 className="mb-6 text-3xl font-bold text-black dark:text-white">Tu carrito</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600 dark:text-texto-muted">No hay productos en el carrito. Agrega algunos sabores.</p>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div key={item.cartKey} className="glass-card rounded-[2rem] border-transparent p-5 transition hover:-translate-y-1 hover:border-orange-300 dark:hover:border-amarillo/30 hover:shadow-xl hover:shadow-orange-200/50 dark:hover:shadow-amarillo/10">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-texto-muted">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amarillo/10 text-amarillo">🍕</span>
                        <span className="font-semibold text-black dark:text-white">{item.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-texto-muted">{item.variant ? item.variant : 'Individual'}</p>
                      <p className="text-sm text-gray-700 dark:text-white/80">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-start gap-4 text-right lg:items-end">
                      <p className="text-2xl font-bold text-amarillo">${((item.selectedPrice || item.price) * item.quantity).toLocaleString()}</p>
                      <button
                        type="button"
                        className="rounded-full bg-red-600/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                        onClick={() => removeFromCart(item.cartKey)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="rounded-full border border-gray-300 dark:border-white/10 bg-gradient-to-br from-gray-100 to-gray-200 dark:bg-white/5 px-4 py-2 text-sm text-black dark:text-white transition hover:bg-gray-300 dark:hover:bg-white/15 shadow-sm shadow-gray-200 dark:shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      title={item.quantity <= 1 ? "La cantidad mínima es 1" : "Reducir cantidad"}
                    >
                      -
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold text-black dark:text-white">{item.quantity}</span>
                    <button
                      type="button"
                      className="rounded-full border border-gray-300 dark:border-white/10 bg-gradient-to-br from-gray-100 to-gray-200 dark:bg-white/5 px-4 py-2 text-sm text-black dark:text-white transition hover:bg-gray-300 dark:hover:bg-white/15 shadow-sm shadow-gray-200 dark:shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                      disabled={item.quantity >= 99}
                      title={item.quantity >= 99 ? "La cantidad máxima es 99" : "Aumentar cantidad"}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="glass-panel rounded-[2rem] border-transparent p-8 shadow-lg shadow-blue-100/50 dark:shadow-black/20 dark:bg-[#141418]/85">
          <h2 className="mb-6 text-3xl font-bold text-black dark:text-white">Datos del cliente</h2>
          {error && <div className="mb-4 rounded-3xl border border-red-300 bg-gradient-to-br from-red-50 to-red-100 p-4 text-sm text-red-800 shadow-md shadow-red-200/50">{error}</div>}
          {success && <div className="mb-4 rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 text-sm text-emerald-800 shadow-md shadow-emerald-200/50">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold text-black dark:text-white">
              Nombre completo
              <input
                value={customer.name}
                onChange={(event) => {
                  setCustomer({ ...customer, name: event.target.value })
                  validateField('name', event.target.value)
                }}
                className={`mt-2 w-full rounded-3xl border px-4 py-3 text-black dark:text-white outline-none transition shadow-sm ${
                  fieldErrors.name 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600' 
                    : 'border-gray-300 dark:border-white/10 bg-gradient-to-br from-white to-gray-50 dark:from-[#1f1f24] dark:to-[#121217] focus:border-orange-400 shadow-gray-200 dark:shadow-black/20'
                }`}
                placeholder="Juan Pérez"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
              )}
            </label>
            <label className="block text-sm font-semibold text-black dark:text-white">
              Teléfono
              <input
                value={customer.phone}
                onChange={(event) => {
                  setCustomer({ ...customer, phone: event.target.value })
                  validateField('phone', event.target.value)
                }}
                className={`mt-2 w-full rounded-3xl border px-4 py-3 text-black dark:text-white outline-none transition shadow-sm ${
                  fieldErrors.phone 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600' 
                    : 'border-gray-300 dark:border-white/10 bg-gradient-to-br from-white to-gray-50 dark:from-[#1f1f24] dark:to-[#121217] focus:border-orange-400 shadow-gray-200 dark:shadow-black/20'
                }`}
                placeholder="300 123 4567"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.phone}</p>
              )}
            </label>
            <label className="block text-sm font-semibold text-black dark:text-white">
              Dirección de entrega
              <input
                value={customer.address}
                onChange={(event) => {
                  setCustomer({ ...customer, address: event.target.value })
                  validateField('address', event.target.value)
                }}
                className={`mt-2 w-full rounded-3xl border px-4 py-3 text-black dark:text-white outline-none transition shadow-sm ${
                  fieldErrors.address 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600' 
                    : 'border-gray-300 dark:border-white/10 bg-gradient-to-br from-white to-gray-50 dark:from-[#1f1f24] dark:to-[#121217] focus:border-orange-400 shadow-gray-200 dark:shadow-black/20'
                }`}
                placeholder="Calle 45 #12-34"
              />
              {fieldErrors.address && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.address}</p>
              )}
            </label>
            <label className="block text-sm font-semibold text-black dark:text-white">
              Método de pago
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-gray-300 dark:border-white/10 bg-gradient-to-br from-white to-gray-50 dark:from-[#1f1f24] dark:to-[#121217] px-4 py-3 text-black dark:text-white outline-none transition focus:border-orange-400 shadow-sm shadow-gray-200 dark:shadow-black/20"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method} className="bg-white dark:bg-[#111111] text-black dark:text-white">
                    {method}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-[#141418] dark:to-[#101015] p-5 shadow-md shadow-blue-100/50 dark:shadow-black/20">
              <p className="text-sm text-gray-600 dark:text-texto-muted">Total estimado</p>
              <p className="mt-2 text-3xl font-bold text-amarillo">${getTotal().toLocaleString()}</p>
            </div>
            <button 
              type="submit" 
              className="w-full rounded-full bg-gradient-to-r from-verde to-emerald-400 px-6 py-4 text-base font-bold uppercase text-white shadow-xl shadow-emerald-500/25 transition hover:scale-[1.01] hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
            >
              {cart.length === 0 ? 'Carrito vacío' : 'Confirmar pedido'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (cart.length > 0 && window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                  clearCart()
                  setError('')
                  setSuccess('Carrito vaciado correctamente.')
                }
              }}
              className="w-full rounded-full bg-red-600 px-6 py-4 text-base font-bold uppercase text-white transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cart.length === 0}
            >
              Vaciar carrito
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default CartPage
