/**
 * Componente MenuManagement Ultra Mejorado - Modo Claro Premium
 * Con efectos visuales avanzados, animaciones y micro-interacciones
 */
import { useMemo, useState } from 'react'
import ErrorModal from '../common/ErrorModal'

const MenuManagementUltraEnhanced = ({ menuItems, availableCategories = [], addMenuItem, updateMenuItem, deleteMenuItem, addCategory, darkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('product')
  const [modalMode, setModalMode] = useState('create')
  const [editingItem, setEditingItem] = useState(null)
  const [categoryInput, setCategoryInput] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    priceLarge: '',
    image: '',
    imageUrl: ''
  })
  const [error, setError] = useState({ isOpen: false, message: '' })

  const categoryList = useMemo(
    () => [
      ...new Set([
        ...(availableCategories || []).filter((cat) => cat && cat.toLowerCase() !== 'todas'),
        ...menuItems.map((item) => item.category.toLowerCase()),
      ]),
    ],
    [availableCategories, menuItems],
  )

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      category: categoryList[0] || 'extras',
      description: '',
      price: '',
      priceLarge: '',
      image: '',
      imageUrl: '',
    })
    setPhotoPreview('')
  }

  const openProductModal = (mode, item = null) => {
    setModalType('product')
    setModalMode(mode)
    setEditingItem(item)
    if (mode === 'edit' && item) {
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price_small || item.price,
        priceLarge: item.price_large || item.priceLarge,
        image: item.image || '',
        imageUrl: item.imageUrl || '',
      })
      setPhotoPreview(item.image || item.imageUrl || '')
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const openCategoryModal = () => {
    setModalType('category')
    setModalMode('create')
    resetForm()
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
        setFormData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url) => {
    setFormData(prev => ({ ...prev, imageUrl: url }))
    if (url) {
      setPhotoPreview(url)
    } else {
      setPhotoPreview('')
    }
  }

  const handleSaveCategory = async () => {
    if (!categoryInput.trim()) {
      setError({ isOpen: true, message: 'La categoría necesita un nombre.' })
      return
    }
    try {
      await addCategory({ name: categoryInput.trim(), display_order: categoryList.length + 1 })
      closeModal()
      // Ya no se recarga la página, el modal se cierra y se queda en la misma página
    } catch (error) {
      setError({ isOpen: true, message: 'Error al crear categoría: ' + error.message })
    }
  }

  const handleSaveProduct = async () => {
    if (!formData.name.trim()) {
      setError({ isOpen: true, message: 'El producto necesita un nombre.' })
      return
    }
    const priceNumber = Number(formData.price)
    if (!priceNumber || Number.isNaN(priceNumber)) {
      setError({ isOpen: true, message: 'Precio normal inválido.' })
      return
    }
    
    const categoryName = formData.category.trim() || 'extras'
    const categoryMap = {
      'pizzas': 1,
      'bebidas': 2, 
      'combos': 3,
      'postres': 4
    }
    const categoryId = categoryMap[categoryName.toLowerCase()] || 1
    
    const item = {
      name: formData.name.trim(),
      category_id: categoryId,
      description: formData.description.trim(),
      price_small: priceNumber,
      price_large: formData.priceLarge ? Number(formData.priceLarge) : null,
      image: formData.image || formData.imageUrl || '',
    }

    try {
      if (modalMode === 'edit' && editingItem) {
        await updateMenuItem(editingItem.id, item)
      } else {
        await addMenuItem(item)
      }
      closeModal()
      // Ya no se recarga la página, el modal se cierra y se queda en la misma página
    } catch (error) {
      setError({ isOpen: true, message: 'Error al guardar producto: ' + error.message })
    }
  }

  const handleEdit = (item) => openProductModal('edit', item)

  const getCategoryColor = (cat) => {
    const colors = {
      'pizzas': 'bg-gradient-to-r from-emerald-400/20 via-green-400/15 to-teal-400/20 text-emerald-700 border border-emerald-300/50 shadow-emerald-200/30',
      'hamburguesas': 'bg-gradient-to-r from-emerald-400/20 via-green-400/15 to-teal-400/20 text-emerald-700 border border-emerald-300/50 shadow-emerald-200/30',
      'bebidas': 'bg-gradient-to-r from-amber-400/20 via-yellow-400/15 to-orange-400/20 text-amber-700 border border-amber-300/50 shadow-amber-200/30',
      'combos': 'bg-gradient-to-r from-orange-400/20 via-amber-400/15 to-yellow-400/20 text-orange-700 border border-orange-300/50 shadow-orange-200/30',
      'postres': 'bg-gradient-to-r from-pink-400/20 via-rose-400/15 to-fuchsia-400/20 text-pink-700 border border-pink-300/50 shadow-pink-200/30',
      'extras': 'bg-gradient-to-r from-purple-400/20 via-violet-400/15 to-indigo-400/20 text-purple-700 border border-purple-300/50 shadow-purple-200/30'
    }
    return colors[cat.toLowerCase()] || colors.extras
  }

  // Paleta ultra mejorada para modo claro
  const sectionClass = darkMode
    ? 'rounded-[2rem] border border-white/10 bg-gradient-to-br from-gris-oscuro/95 via-gris-oscuro/90 to-[#151515] p-8 shadow-2xl shadow-red/40 backdrop-red-sm'
    : 'rounded-[2rem] border border-slate-300/50 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/85 backdrop-blur-xl p-8 shadow-2xl shadow-slate-300/40 relative overflow-hidden'

  const textMain = darkMode ? 'text-white' : 'text-slate-800'
  const bgPanel = darkMode ? 'bg-[#111111]/95 text-white backdrop-blur-xl' : 'bg-gradient-to-br from-slate-100/95 via-slate-200/90 to-gray-300/85 text-slate-800 backdrop-blur-xl'
  const cardClass = darkMode
    ? 'group relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#111111] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-naranja/30 hover:shadow-[0_0_30px_rgba(255,127,17,0.15)]'
    : 'group relative rounded-3xl border border-slate-400/60 bg-gradient-to-br from-white/90 via-slate-50/80 to-blue-50/60 backdrop-blur-sm p-6 transition-all duration-500 hover:scale-[1.03] hover:border-indigo-400/70 hover:shadow-2xl hover:shadow-indigo-500/40 shadow-lg shadow-slate-300/30'
  const inputClass = darkMode
    ? 'w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-white placeholder:text-white/40 focus:border-naranja focus:ring-naranja/20 transition-all duration-300'
    : 'w-full rounded-2xl border border-slate-400/60 bg-gradient-to-r from-slate-50/90 via-gray-100/80 to-slate-200/70 px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-300/50 transition-all duration-300 shadow-sm shadow-gray-200 dark:shadow-black/20 hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-black/30'

  return (
    <section className={sectionClass}>
      {/* Elemento decorativo de fondo para modo claro */}
      {!darkMode && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 via-indigo-400/5 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/10 via-teal-400/5 to-cyan-400/10 rounded-full blur-3xl"></div>
        </div>
      )}
      
      <div className="relative z-10">
        {/* Header con título y botones mejorados */}
        <div className='mb-8 flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm uppercase tracking-[0.35em] text-orange-500 font-semibold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent'>
              Gestion de menu
            </p>
            <h2 className={'mt-2 text-4xl font-bold ' + textMain}>
              Productos disponibles
              <span className='ml-3 inline-flex items-center justify-center w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-lg shadow-emerald-200/50'></span>
            </h2>
            <p className={'mt-2 text-sm ' + (darkMode ? 'text-white/60' : 'text-slate-500')}>
              Administra tu catálogo de productos con facilidad
            </p>
          </div>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => openProductModal('create')}
              className='group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 px-6 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-orange-300/40 transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(255,127,17,0.4)] active:scale-[0.98] overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <span className='relative flex items-center gap-2'>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar producto
              </span>
            </button>
            <button
              type='button'
              onClick={openCategoryModal}
              className='group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-green-300/40 transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] active:scale-[0.98] overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <span className='relative flex items-center gap-2'>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10l2 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9l2-2z" />
                </svg>
                Nueva categoría
              </span>
            </button>
          </div>
        </div>

        {/* Panel de categorías mejorado */}
        <div className='mb-8 rounded-[2rem] border border-slate-300/50 bg-gradient-to-br from-slate-200/90 via-slate-300/80 gris-400/70 p-6 shadow-lg shadow-slate-300/30 overflow-hidden'>
          {!darkMode && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/5 rounded-full blur-xl"></div>
            </div>
          )}
          <div className="relative z-10">
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm font-semibold text-orange-500 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent'>Categorías disponibles</p>
                <p className={'text-sm mt-1 ' + (darkMode ? 'text-white/70' : 'text-slate-500')}>
                  Organiza tus productos por categorías para mejor gestión
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                {categoryList.length > 0 ? (
                  categoryList.map((category) => (
                    <span
                      key={category}
                      className='group relative inline-flex items-center rounded-full border border-slate-200/50 bg-gradient-to-r from-white/80 via-slate-50/60 to-blue-50/40 px-3 py-1 text-xs font-semibold text-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-slate-200/30'
                    >
                      <span className="relative z-10">{category}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-200/20 to-blue-200/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </span>
                  ))
                ) : (
                  <span className='rounded-full border border-dashed border-slate-300/50 px-3 py-1 text-xs text-slate-400 bg-slate-50/30'>Sin categorías</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de productos ultra mejorado */}
        {menuItems.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2'>
            {menuItems.map((item, idx) => (
              <div
                key={item.id}
                className={cardClass}
                style={{ animationDelay: `${idx * 100}ms` }}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Efecto de brillo en hover */}
                {!darkMode && hoveredCard === item.id && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
                )}
                
                <div className="relative z-10">
                  {/* Header del producto */}
                  <div className='flex items-start justify-between gap-4 mb-4'>
                    <div className='flex-1'>
                      <h3 className={'text-xl font-bold transition-all duration-300 ' + 
                        (darkMode 
                          ? 'text-white group-hover:text-orange-400' 
                          : 'text-slate-800 group-hover:text-orange-500'
                        )
                      }>
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className='mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2'>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className={'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ' + getCategoryColor(item.category)}>
                      {item.category}
                    </span>
                  </div>

                  {/* Sección de precios y acciones */}
                  <div className={'mt-5 flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 ' + 
                    (darkMode 
                      ? 'bg-[#0a0a0a]/50 border-white/5 group-hover:bg-[#0a0a0a]/70' 
                      : 'bg-gradient-to-br from-white/60 via-slate-50/50 to-blue-50/30 border-slate-200/30 group-hover:from-white/80 group-hover:via-slate-50/70 group-hover:to-blue-50/50'
                    )
                  }>
                    <div>
                      <p className='text-xs font-medium text-slate-500 uppercase tracking-wider'>Precio</p>
                      <p className='text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent'>
                        ${(item.price_small || item.price || 0).toLocaleString()}
                      </p>
                      {item.price_large && (
                        <p className='text-sm text-slate-400 mt-1'>Grande: ${item.price_large.toLocaleString()}</p>
                      )}
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEdit(item)}
                        className={'group/btn relative inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 ' + 
                          (darkMode 
                            ? 'border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-orange-400' 
                            : 'border-slate-200/50 bg-gradient-to-r from-white/70 via-slate-50/60 to-blue-50/40 text-slate-600 hover:from-white/90 hover:via-slate-50/80 hover:to-blue-50/60 hover:text-orange-500 hover:shadow-md hover:shadow-slate-200/30'
                          )
                        }
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </span>
                      </button>
                      <button
                        onClick={() => deleteMenuItem && deleteMenuItem(item.id)}
                        className={'group/btn relative inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 ' + 
                          (darkMode 
                            ? 'border-red-600/40 bg-red-600/20 text-red-400 hover:bg-red-600/30' 
                            : 'border-red-200/50 bg-gradient-to-r from-red-50/70 via-rose-50/60 to-pink-50/40 text-red-600 hover:from-red-50/90 hover:via-rose-50/80 hover:to-pink-50/70 hover:shadow-md hover:shadow-red-200/30'
                          )
                        }
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <div className='relative mb-6'>
              <div className='w-24 h-24 rounded-full bg-gradient-to-br from-slate-200/50 to-blue-200/30 flex items-center justify-center shadow-lg'>
                <span className='text-5xl'>📋</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
            </div>
            <h3 className='text-xl font-semibold text-slate-700 mb-2'>No hay productos registrados</h3>
            <p className='text-slate-500 mb-6 max-w-md'>
              Comienza agregando tu primer producto para ofrecer a tus clientes
            </p>
            <button
              onClick={() => openProductModal('create')}
              className='group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 px-8 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-orange-300/40 transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(255,127,17,0.4)] active:scale-[0.98] overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <span className='relative flex items-center gap-2'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar primer producto
              </span>
            </button>
          </div>
        )}

        {/* Modal ultra mejorado para modo claro */}
        {isModalOpen && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4'>
            <div className={'w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-hidden overflow-y-auto rounded-[2rem] border border-slate-400/60 p-6 shadow-2xl shadow-black/20 ' + bgPanel}>
              {/* Header del modal */}
              <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <h3 className='text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
                    {modalType === 'category' ? 'Nueva categoría' : modalMode === 'edit' ? 'Editar producto' : 'Agregar producto'}
                  </h3>
                  <p className='mt-2 text-sm text-slate-500'>
                    {modalType === 'category'
                      ? 'Agrega una categoría que puedas usar al crear productos.'
                      : 'Rellena los datos del producto y añade una imagen para mostrarla al cliente.'}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={closeModal}
                  className='group relative rounded-full bg-gradient-to-r from-slate-200/50 to-blue-200/50 p-3 text-slate-600 transition-all duration-300 hover:scale-110 hover:from-red-200/50 hover:to-rose-200/50 hover:text-red-600'
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenido del modal */}
              {modalType === 'category' ? (
                <div className='space-y-6'>
                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-slate-700'>Nombre de categoría</label>
                    <input
                      type='text'
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      placeholder='Ej. pizzas'
                      className={inputClass}
                    />
                  </div>
                  <div className='flex justify-end gap-3'>
                    <button
                      type='button'
                      onClick={closeModal}
                      className='rounded-full border border-slate-400/60 bg-gradient-to-r from-slate-200/70 to-blue-200/60 px-6 py-3 text-sm font-semibold text-slate-600 transition-all duration-300 hover:scale-105 hover:from-red-200/80 hover:to-rose-200/70 hover:text-red-600 hover:border-red-400/60 shadow-sm shadow-gray-200 dark:shadow-black/20 hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-black/30'
                    >
                      Cancelar
                    </button>
                    <button
                      type='button'
                      onClick={handleSaveCategory}
                      className='rounded-full border border-orange-400/60 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 px-6 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-orange-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40 hover:border-orange-500/70'
                    >
                      Guardar categoría
                    </button>
                  </div>
                </div>
              ) : (
                <div className='space-y-6'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-semibold text-slate-700'>Nombre</label>
                      <input
                        type='text'
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder='Ej. Pizza Mexicana'
                        className={inputClass}
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='block text-sm font-semibold text-slate-700'>Categoría</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className={inputClass}
                      >
                        {categoryList.map((category) => (
                          <option key={category} value={category} className='bg-white text-slate-700'>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-slate-700'>Descripción</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      rows='4'
                      placeholder='Descripción breve del producto'
                      className={inputClass}
                    />
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-semibold text-slate-700'>Precio</label>
                      <input
                        type='number'
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder='0'
                        className={inputClass}
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='block text-sm font-semibold text-slate-700'>Precio grande (opcional)</label>
                      <input
                        type='number'
                        value={formData.priceLarge}
                        onChange={(e) => setFormData((prev) => ({ ...prev, priceLarge: e.target.value }))}
                        placeholder='0'
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <label className='block text-sm font-semibold text-slate-700'>Subir foto</label>
                      <input type='file' accept='image/*' onChange={handlePhotoChange} className={inputClass} />
                    </div>
                    <div className='space-y-2'>
                      <label className='block text-sm font-semibold text-slate-700'>O usar URL de imagen</label>
                      <input
                        type='text'
                        value={formData.imageUrl}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder='https://...'
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {photoPreview && (
                    <div className='rounded-3xl border border-slate-200/50 bg-gradient-to-br from-white/60 via-slate-50/50 to-blue-50/40 p-6 shadow-lg'>
                      <p className='mb-4 text-sm font-semibold text-slate-700'>Previsualización</p>
                      <div className="relative rounded-2xl overflow-hidden shadow-lg">
                        <img src={photoPreview} alt='Vista previa' className='w-full h-56 object-cover' />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  )}

                  <div className='flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200/30'>
                    <button
                      type='button'
                      onClick={closeModal}
                      className='rounded-full border border-slate-400/60 bg-gradient-to-r from-slate-200/70 to-blue-200/60 px-6 py-3 text-sm font-semibold text-slate-600 transition-all duration-300 hover:scale-105 hover:from-red-200/80 hover:to-rose-200/70 hover:text-red-600 hover:border-red-400/60 shadow-sm shadow-gray-200 dark:shadow-black/20 hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-black/30'
                    >
                      Cancelar
                    </button>
                    <button
                      type='button'
                      onClick={handleSaveProduct}
                      className='rounded-full border border-orange-400/60 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 px-6 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-orange-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40 hover:border-orange-500/70'
                    >
                      {modalMode === 'edit' ? 'Guardar cambios' : 'Crear producto'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default MenuManagementUltraEnhanced
