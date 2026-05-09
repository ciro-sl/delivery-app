/**
 * Componente de gestión del menú para administradores.
 * Permite agregar, editar y eliminar productos del menú con una interfaz visual.
 * Incluye validación básica y soporte para precios normales y grandes.
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.menuItems - Array de items del menú
 * @param {Function} props.addMenuItem - Función para agregar item
 * @param {Function} props.updateMenuItem - Función para actualizar item
 * @param {Function} props.deleteMenuItem - Función para eliminar item
 * @param {boolean} props.darkMode - Estado del modo oscuro
 * @returns {React.ReactElement} Interfaz de gestión del menú
 */
import { useMemo, useState, useEffect } from 'react'

const MenuManagement = ({ 
  menuItems = [], 
  availableCategories = [], 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  addCategory, 
  darkMode 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('product')
  const [modalMode, setModalMode] = useState('create')
  const [editingItem, setEditingItem] = useState(null)
  const [categoryInput, setCategoryInput] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
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

  // Corrección: Asegurar que categoryList siempre sea un array
  const categoryList = useMemo(() => {
    try {
      const available = Array.isArray(availableCategories) ? availableCategories : []
      const menuCats = Array.isArray(menuItems) ? menuItems.map((item) => item?.category).filter(Boolean) : []
      
      const allCats = [
        ...new Set([
          ...available.filter((cat) => cat && cat.toLowerCase() !== 'todas'),
          ...menuCats
        ]),
      ]
      
      // Si no hay categorías, proporcionar una por defecto
      return allCats.length > 0 ? allCats : ['extras']
    } catch (error) {
      console.error('Error al procesar categorías:', error)
      return ['extras']
    }
  }, [availableCategories, menuItems])

  // Corrección: Establecer categoría por defecto cuando categoryList cambie
  useEffect(() => {
    if (formData.category === '' && categoryList.length > 0) {
      setFormData(prev => ({ ...prev, category: categoryList[0] }))
    }
  }, [categoryList, formData.category])

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
    setCategoryInput('')
    setError({ isOpen: false, message: '' })
  }

  const openProductModal = (mode, item = null) => {
    setModalType('product')
    setModalMode(mode)
    if (mode === 'edit' && item) {
      setEditingItem(item)
      setFormData({
        name: item.name || '',
        category: item.category || categoryList[0] || 'extras',
        description: item.description || '',
        price: String(item.price || ''),
        priceLarge: item.priceLarge ? String(item.priceLarge) : '',
        image: item.image || '',
        imageUrl: item.image || '',
      })
      setPhotoPreview(item.image || '')
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const openCategoryModal = () => {
    setModalType('category')
    setModalMode('create')
    setCategoryInput('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Validar tamaño del archivo (ej: 5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError({ isOpen: true, message: 'La imagen no puede superar los 5MB' })
      return
    }
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError({ isOpen: true, message: 'Solo se permiten archivos de imagen' })
      return
    }
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result)
      setFormData((prev) => ({ ...prev, image: reader.result, imageUrl: '' }))
    }
    reader.onerror = () => {
      setError({ isOpen: true, message: 'Error al leer el archivo' })
    }
    reader.readAsDataURL(file)
  }

  const handleImageUrlChange = (value) => {
    // Validación básica de URL
    if (value && !value.match(/^https?:\/\/.+\..+/)) {
      setError({ isOpen: true, message: 'URL de imagen inválida' })
      return
    }
    setFormData((prev) => ({ ...prev, imageUrl: value, image: value }))
    setPhotoPreview(value)
  }

  const handleSaveCategory = async () => {
    const cleanName = categoryInput.trim()
    if (!cleanName) {
      setError({ isOpen: true, message: 'Ingrese un nombre de categoría válido.' })
      return
    }
    
    // Normalizar comparación
    const normalizedCats = categoryList.map(cat => cat.toLowerCase())
    if (normalizedCats.includes(cleanName.toLowerCase())) {
      setError({ isOpen: true, message: 'Esa categoría ya existe.' })
      return
    }
    
    try {
      if (addCategory && typeof addCategory === 'function') {
        await addCategory({
          name: cleanName,
          display_order: categoryList.length
        })
        closeModal()
      } else {
        throw new Error('La función addCategory no está disponible')
      }
    } catch (error) {
      console.error('Error al guardar categoría:', error)
      setError({ isOpen: true, message: 'Error al crear categoría: ' + error.message })
    }
  }

  const handleSaveProduct = async () => {
    // Validaciones
    if (!formData.name.trim()) {
      setError({ isOpen: true, message: 'El producto necesita un nombre.' })
      return
    }
    
    const priceNumber = Number(formData.price)
    if (!priceNumber || Number.isNaN(priceNumber) || priceNumber <= 0) {
      setError({ isOpen: true, message: 'Precio normal inválido. Debe ser un número positivo.' })
      return
    }
    
    // Validar precio grande si se proporcionó
    let priceLargeNumber = null
    if (formData.priceLarge) {
      priceLargeNumber = Number(formData.priceLarge)
      if (Number.isNaN(priceLargeNumber) || priceLargeNumber <= 0) {
        setError({ isOpen: true, message: 'Precio grande inválido. Debe ser un número positivo.' })
        return
      }
    }
    
    // Corrección: Mapeo flexible de categorías
    const categoryName = formData.category.trim() || 'extras'
    
    // Intentar encontrar la categoría en el array existente
    let categoryId = null
    
    // Si tienes las categorías con IDs, mejor usa un mapa dinámico
    // Por ahora, intentamos buscar si existe una función o contexto para obtener el ID
    // Este mapeo es estático pero puedes mejorarlo según tu backend
    const staticCategoryMap = {
      'pizzas': 1,
      'bebidas': 2, 
      'combos': 3,
      'postres': 4,
      'extras': 1
    }
    categoryId = staticCategoryMap[categoryName.toLowerCase()] || 1
    
    const item = {
      name: formData.name.trim(),
      category_id: categoryId,
      category: categoryName, // También enviar el nombre por si acaso
      description: formData.description.trim(),
      price_small: priceNumber,
      price_large: priceLargeNumber,
      image: formData.image || formData.imageUrl || '',
    }

    try {
      if (modalMode === 'edit' && editingItem) {
        if (updateMenuItem && typeof updateMenuItem === 'function') {
          await updateMenuItem(editingItem.id, item)
        } else {
          throw new Error('La función updateMenuItem no está disponible')
        }
      } else {
        if (addMenuItem && typeof addMenuItem === 'function') {
          await addMenuItem(item)
        } else {
          throw new Error('La función addMenuItem no está disponible')
        }
      }
      closeModal()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      setError({ isOpen: true, message: 'Error al guardar producto: ' + error.message })
    }
  }

  const handleDeleteItem = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteMenuItem(id)
      } catch (error) {
        console.error('Error al eliminar producto:', error)
        setError({ isOpen: true, message: 'Error al eliminar producto: ' + error.message })
      }
    }
  }

  const handleEdit = (item) => openProductModal('edit', item)

  const getCategoryColor = (cat) => {
    const colors = {
      'pizzas': darkMode ? 'from-verde/20 to-transparent text-verde border-verde/30' : 'from-green-100 to-transparent text-green-600 border-green-200',
      'hamburguesas': darkMode ? 'from-verde/20 to-transparent text-verde border-verde/30' : 'from-green-100 to-transparent text-green-600 border-green-200',
      'bebidas': darkMode ? 'from-amarillo/20 to-transparent text-amarillo border-amarillo/30' : 'from-yellow-100 to-transparent text-yellow-600 border-yellow-200',
      'postres': darkMode ? 'from-vinotinto/20 to-transparent text-vinotinto border-vinotinto/30' : 'from-red-100 to-transparent text-red-600 border-red-200',
    }
    return colors[cat] || (darkMode ? 'from-white/10 to-transparent text-white border-white/20' : 'from-gray-100 to-transparent text-gray-600 border-gray-200')
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
      {/* Componente de error/toast */}
      {error.isOpen && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="rounded-2xl bg-red-600 px-6 py-3 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <span>⚠️</span>
              <p>{error.message}</p>
              <button 
                onClick={() => setError({ isOpen: false, message: '' })}
                className="ml-4 text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header con título y botones */}
      <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <p className='text-sm uppercase tracking-[0.35em] text-naranja font-semibold'>
            Gestión de menú
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

      {/* Sección de categorías disponibles */}
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
      <div className='grid gap-5 md:grid-cols-2'>
        {menuItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className={'group rounded-3xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-fade-in ' + (darkMode ? 'border-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#161616] to-[#111111] hover:border-naranja/20 hover:shadow-naranja/10' : 'border-gray-200 bg-gradient-to-br from-white to-gray-100 hover:border-orange-300 hover:shadow-xl hover:shadow-blue-200/50')}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            {/* Información del producto */}
            <div className='flex flex-wrap items-start justify-between gap-4'>
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
            <div className={'mt-5 flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl border ' + (darkMode ? 'bg-negro/30 border-white/5' : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200')}>
              <div>
                <p className='text-2xl font-bold text-amarillo'>${item.price?.toLocaleString() || item.price_small?.toLocaleString() || 0}</p>
                {(item.priceLarge || item.price_large) && (
                  <p className='text-xs text-texto-muted'>Grande: ${(item.priceLarge || item.price_large).toLocaleString()}</p>
                )}
              </div>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={() => handleEdit(item)}
                  className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-verde/20 hover:border-verde/30 hover:scale-105'
                >
                  <span className='group-hover:rotate-12 transition-transform'>✏️</span>
                  <span className='ml-1'>Editar</span>
                </button>
                <button
                  type='button'
                  onClick={() => handleDeleteItem(item.id)}
                  className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:from-red-500 hover:to-red-400 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20'
                >
                  <span className='group-hover:scale-110 transition-transform'>🗑️</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {menuItems.length === 0 && (
        <div className={'flex flex-col items-center justify-center py-16 text-center ' + (darkMode ? '' : 'bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl')}>
          <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5'>
            <span className='text-4xl'>📋</span>
          </div>
          <p className='text-texto-muted'>No hay productos registrados aún.</p>
          <button
            onClick={() => openProductModal('create')}
            className='mt-4 rounded-full bg-naranja px-6 py-2 text-sm font-semibold text-gris-oscuro hover:scale-105 transition-transform'
          >
            Agregar primer producto
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4' onClick={(e) => {
          if (e.target === e.currentTarget) closeModal()
        }}>
          <div className={'w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-hidden overflow-y-auto rounded-[2rem] border border-white/10 p-6 shadow-2xl ' + bgPanel}>
            <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <h3 className={'text-2xl font-bold ' + (darkMode ? 'text-white' : 'text-gray-900')}>
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
                    Cancelar
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
                      step='any'
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
                      step='any'
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
                    Cancelar
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

export default MenuManagement