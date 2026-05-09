/**
 * Componente de gestión del menú - Versión mejorada con diseño original del proyecto
 * Mantiene toda la estética visual y funcionalidad completa incluyendo fotos
 */
import { useMemo, useState } from 'react'

const MenuManagementEnhanced = ({ menuItems, availableCategories = [], addMenuItem, updateMenuItem, deleteMenuItem, addCategory, darkMode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('product')
  const [modalMode, setModalMode] = useState('create')
  const [editingItem, setEditingItem] = useState(null)
  const [categoryInput, setCategoryInput] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    category: 'extras',
    description: '',
    price: '',
    priceLarge: '',
    image: '',
    imageUrl: '',
  })

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
    if (!categoryInput.trim()) return alert('La categoría necesita un nombre.')
    try {
      await addCategory({ name: categoryInput.trim(), display_order: categoryList.length + 1 })
      closeModal()
    } catch (error) {
      alert('Error al crear categoría: ' + error.message)
    }
  }

  const handleSaveProduct = async () => {
    if (!formData.name.trim()) return alert('El producto necesita un nombre.')
    const priceNumber = Number(formData.price)
    if (!priceNumber || Number.isNaN(priceNumber)) return alert('Precio normal inválido.')
    
    // Encontrar el ID de la categoría
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
    } catch (error) {
      alert('Error al guardar producto: ' + error.message)
    }
  }

  const handleEdit = (item) => openProductModal('edit', item)

  const getCategoryColor = (cat) => {
    const colors = {
      'pizzas': darkMode ? 'from-verde/20 to-transparent text-verde border-verde/30' : 'from-green-100 to-transparent text-green-600 border-green-200',
      'hamburguesas': darkMode ? 'from-verde/20 to-transparent text-verde border-verde/30' : 'from-green-100 to-transparent text-green-600 border-green-200',
      'bebidas': darkMode ? 'from-amarillo/20 to-transparent text-amarillo border-amarillo/30' : 'from-yellow-100 to-transparent text-yellow-600 border-yellow-200',
      'combos': darkMode ? 'from-naranja/20 to-transparent text-naranja border-naranja/30' : 'from-orange-100 to-transparent text-orange-600 border-orange-200',
      'postres': darkMode ? 'from-rosado/20 to-transparent text-rosado border-rosado/30' : 'from-pink-100 to-transparent text-pink-600 border-pink-200',
      'extras': darkMode ? 'from-morado/20 to-transparent text-morado border-morado/30' : 'from-purple-100 to-transparent text-purple-600 border-purple-200'
    }
    return colors[cat.toLowerCase()] || colors.extras
  }

  // Clases CSS condicionales basadas en el tema
  const sectionClass = darkMode
    ? 'rounded-[2rem] border border-white/10 bg-gradient-to-br from-gris-oscuro/95 via-gris-oscuro/90 to-[#151515] p-8 shadow-2xl shadow-red/40 backdrop-red-sm'
    : 'rounded-[2rem] border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-8 shadow-lg shadow-red-100/50'

  const textMain = darkMode ? 'text-white' : 'text-gray-900'
  const bgPanel = darkMode ? 'bg-[#111111]/95 text-white backdrop-blur-xl' : 'bg-white/95 text-gray-900 backdrop-blur-xl'
  const inputClass = darkMode
    ? 'w-full rounded-3xl border border-white/10 bg-[#141414] px-4 py-3 text-white placeholder:text-white/40 focus:border-naranja focus:ring-naranja/20'
    : 'w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-naranja focus:ring-amber-200'

  return (
    <section className={sectionClass}>
      {/* Header con título y botones */}
      <div className='mb-8 flex items-center justify-between gap-4'>
        <div>
          <p className='text-sm uppercase tracking-[0.35em] text-naranja font-semibold'>
            Gestion de menu
          </p>
          <h2 className={'mt-2 text-3xl font-bold ' + textMain}>
            Productos disponibles
            <span className='ml-2 inline-flex items-center justify-center w-2 h-2 rounded-full bg-verde animate-pulse' />
          </h2>
        </div>
        <div className='flex gap-3'>
          <button
            type='button'
            onClick={() => openProductModal('create')}
            className='group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-naranja to-amarillo px-6 py-3 text-sm font-bold text-gris-oscuro shadow-lg shadow-verde/30 transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(255,127,17,0.4)] active:scale-[0.98] overflow-hidden'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
            <span className='relative'>+</span>
            <span className='relative'>Agregar producto</span>
          </button>
          <button
            type='button'
            onClick={openCategoryModal}
            className='rounded-full border border-red-600/40 bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-500 hover:border-red-500/40'
          >
            Nueva categoría
          </button>
        </div>
      </div>

      {/* Panel de categorías */}
      <div className='mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/10 backdrop-blur-sm'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm font-semibold text-naranja'>Categorías disponibles</p>
            <p className={'text-sm ' + (darkMode ? 'text-white/70' : 'text-slate-600')}>
              Usa estas categorías para organizar tus productos.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {categoryList.length > 0 ? (
              categoryList.map((category) => (
                <span
                  key={category}
                  className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white'
                >
                  {category}
                </span>
              ))
            ) : (
              <span className='rounded-full border border-dashed border-white/20 px-3 py-1 text-xs text-white/70'>Sin categorías</span>
            )}
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      {menuItems.length > 0 ? (
        <div className='grid gap-5 md:grid-cols-2'>
          {menuItems.map((item, idx) => (
            <div
              key={item.id}
              className={'group rounded-3xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-fade-in ' + (darkMode ? 'border-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#161616] to-[#111111] hover:border-naranja/20 hover:shadow-naranja/10' : 'border-gray-200 bg-gradient-to-br from-white to-gray-100 hover:border-orange-300 hover:shadow-xl hover:shadow-blue-200/50')}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Información del producto */}
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1'>
                  <h3 className={'text-lg font-bold transition-colors ' + (darkMode ? 'text-white group-hover:text-naranja' : 'text-gray-900 group-hover:text-naranja')}>
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className='mt-2 text-sm text-texto-muted line-clamp-2'>
                      {item.description}
                    </p>
                  )}
                </div>
                <span className={'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-gradient-to-r ' + getCategoryColor(item.category)}>
                  {item.category}
                </span>
              </div>

              {/* Precios y acciones */}
              <div className={'mt-5 flex items-center justify-between gap-4 p-3 rounded-xl border ' + (darkMode ? 'bg-negro/30 border-white/5' : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200')}>
                <div>
                  <p className='text-sm text-texto-muted'>Precio</p>
                  <p className='text-3xl font-bold text-amarillo'>
                    ${(item.price_small || item.price || 0).toLocaleString()}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEdit(item)}
                    className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:scale-105'
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteMenuItem && deleteMenuItem(item.id)}
                    className='rounded-full border border-red-600/40 bg-red-600/20 px-4 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-600/30 hover:scale-105'
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5'>
            <span className='text-4xl'>📋</span>
          </div>
          <p className='text-texto-muted'>No hay productos registrados aun.</p>
          <button
            onClick={() => openProductModal('create')}
            className='mt-4 rounded-full bg-naranja px-6 py-2 text-sm font-semibold text-gris-oscuro hover:scale-105 transition-transform'
          >
            Agregar primer producto
          </button>
        </div>
      )}

      {/* Modal mejorado */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'>
          <div className={'w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-hidden overflow-y-auto rounded-[2rem] border border-white/10 p-6 shadow-2xl ' + bgPanel}>
            <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h3 className='text-2xl font-bold text-white'>
                  {modalType === 'category' ? 'Nueva categoría' : modalMode === 'edit' ? 'Editar producto' : 'Agregar producto'}
                </h3>
                <p className='mt-2 text-sm text-white/70'>
                  {modalType === 'category'
                    ? 'Agrega una categoría que puedas usar al crear productos.'
                    : 'Rellena los datos del producto y añade una imagen para mostrarla al cliente.'}
                </p>
              </div>
              <button
                type='button'
                onClick={closeModal}
                className='rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500'
              >
                ✕
              </button>
            </div>

            {modalType === 'category' ? (
              <div className='space-y-5'>
                <label className='block text-sm font-semibold text-white'>Nombre de categoría</label>
                <input
                  type='text'
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder='Ej. pizzas'
                  maxLength="50"
                  className={inputClass}
                />
                <div className='flex justify-end gap-3'>
                  <button
                    type='button'
                    onClick={closeModal}
                    className='rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500'
                  >
                    ✕
                  </button>
                  <button
                    type='button'
                    onClick={handleSaveCategory}
                    className='rounded-full bg-gradient-to-r from-naranja to-amarillo px-5 py-3 text-sm font-semibold text-gris-oscuro transition hover:brightness-110'
                  >
                    Guardar categoría
                  </button>
                </div>
              </div>
            ) : (
              <div className='space-y-5'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <label className='space-y-2'>
                    <span className='text-sm font-semibold text-white'>Nombre</span>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder='Ej. Pizza Mexicana'
                      maxLength="30"
                      className={inputClass}
                    />
                  </label>
                  <label className='space-y-2'>
                    <span className='text-sm font-semibold text-white'>Categoría</span>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className={inputClass}
                    >
                      {categoryList.map((category) => (
                        <option key={category} value={category} className='bg-[#111111] text-white'>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className='space-y-2'>
                  <span className='text-sm font-semibold text-white'>Descripción</span>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows='4'
                    placeholder='Descripción breve del producto'
                    maxLength="40"
                    className={inputClass}
                  />
                </label>

                <div className='grid gap-4 md:grid-cols-2'>
                  <label className='space-y-2'>
                    <span className='text-sm font-semibold text-white'>Precio</span>
                    <input
                      type='number'
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder='0'
                      maxLength="10"
                      className={inputClass}
                    />
                  </label>
                  <label className='space-y-2'>
                    <span className='text-sm font-semibold text-white'>Precio grande (opcional)</span>
                    <input
                      type='number'
                      value={formData.priceLarge}
                      onChange={(e) => setFormData((prev) => ({ ...prev, priceLarge: e.target.value }))}
                      placeholder='0'
                      maxLength="10"
                      className={inputClass}
                    />
                  </label>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <label className='space-y-2'>
                    <span className='text-sm font-semibold text-white'>Subir foto</span>
                    <input type='file' accept='image/*' onChange={handlePhotoChange} className={inputClass} />
                  </label>
                  <label className='space-y-2'>
                    <span className='text-sm font-semibold text-white'>O usar URL de imagen</span>
                    <input
                      type='text'
                      value={formData.imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder='https://...'
                      maxLength="100"
                      className={inputClass}
                    />
                  </label>
                </div>

                {photoPreview && (
                  <div className='rounded-3xl border border-white/10 bg-slate-950/10 p-4'>
                    <p className='mb-3 text-sm font-semibold text-white'>Previsualización</p>
                    <img src={photoPreview} alt='Vista previa' className='h-56 w-full rounded-[1.5rem] object-cover' />
                  </div>
                )}

                <div className='flex flex-wrap items-center justify-end gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={closeModal}
                    className='rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500'
                  >
                    ✕
                  </button>
                  <button
                    type='button'
                    onClick={handleSaveProduct}
                    className='rounded-full bg-gradient-to-r from-naranja to-amarillo px-6 py-3 text-sm font-semibold text-gris-oscuro transition hover:brightness-110'
                  >
                    {modalMode === 'edit' ? 'Guardar cambios' : 'Crear producto'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default MenuManagementEnhanced
