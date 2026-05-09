/**
 * Componente MenuManagement Ultra Mejorado - Modo Claro Premium
 * Con efectos visuales avanzados, animaciones y micro-interacciones
 */
import { useMemo, useState } from 'react'
import ErrorModal from '../common/ErrorModal'
import ConfirmDialog from '../common/ConfirmDialog'

const MenuManagementUltraEnhanced = ({ menuItems, availableCategories = [], addMenuItem, updateMenuItem, deleteMenuItem, addCategory, getProductsInCategory, deleteCategory, darkMode, refreshData, loading }) => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('product')
  const [modalMode, setModalMode] = useState('create')
  const [editingItem, setEditingItem] = useState(null)
  const [categoryInput, setCategoryInput] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [error, setError] = useState({ isOpen: false, message: '' })
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: '', // 'product' or 'category'
    item: null,
    categoryProducts: []
  })

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    priceMedium: '',
    priceLarge: '',
    image: '',
    imageUrl: '',
    imageFile: null,
    popular: 0,
    available: 1
  })

    const categoryList = useMemo(
      () => {
        const catsFromItems = menuItems.map((item) => (item.category || 'extras').toLowerCase());
        const catsFromAvail = (availableCategories || []).filter((cat) => cat && typeof cat === 'object' && cat.name && cat.name.toLowerCase() !== 'todas').map(cat => cat.name.toLowerCase());
        return [...new Set([...catsFromAvail, ...catsFromItems])];
      },
      [availableCategories, menuItems],
    )

   const resetForm = () => {
     setEditingItem(null)
      setFormData({
        name: '',
        category: availableCategories.length > 0 ? availableCategories[0].name : 'pizzas',
        description: '',
        price: '',
        priceMedium: '',
        priceLarge: '',
        image: '',
        imageUrl: '',
        imageFile: null,
        popular: 0,
        available: 1,
      })
     setPhotoPreview('')
   }

  const openProductModal = (mode, item = null) => {
    setModalType('product')
    setModalMode(mode)
    setEditingItem(item)
    if (mode === 'edit' && item) {
      console.log('Abriendo modal de edición para:', item.name, 'imagen:', item.image)
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price_small || item.price,
        priceMedium: item.price_medium || '',
        priceLarge: item.price_large || item.priceLarge,
        image: item.image || '',
        imageUrl: item.imageUrl || '',
        imageFile: null, // Reset file on edit
        popular: item.popular || 0,
        available: item.available !== undefined ? item.available : true,
      })
      setPhotoPreview(item.image ? `http://localhost:3001${item.image}` : (item.imageUrl || ''))
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
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)')
        return
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB')
        return
      }

      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Guardar el archivo para envío
      setFormData(prev => ({ ...prev, imageFile: file, image: null }))
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
      // Actualizar datos en tiempo real
      if (refreshData) refreshData()
    } catch (error) {
      setError({ isOpen: true, message: 'Error al crear categoría: ' + error.message })
    }
  }

  const handleDeleteProduct = (item) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar producto',
      message: `¿Estás seguro de que quieres eliminar "${item.name}"? Esta acción no se puede deshacer.`,
      type: 'product',
      item: item,
      categoryProducts: []
    });
  };

  const handleDeleteCategory = async (categoryName) => {
    try {
      // Encontrar el ID de la categoría
      const categoriesData = await fetch('http://localhost:3001/api/menu/categories').then(r => r.json());
      const category = categoriesData.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());

      if (!category) {
        setError({ isOpen: true, message: 'Categoría no encontrada' });
        return;
      }

      // Obtener productos de esta categoría
      const products = await getProductsInCategory(category.id);

      const productCount = products.length;
      const message = productCount > 0
        ? `¿Estás seguro de que quieres eliminar la categoría "${categoryName}"? Se eliminarán permanentemente ${productCount} producto(s) asociado(s).`
        : `¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`;

      setConfirmDialog({
        isOpen: true,
        title: 'Eliminar categoría',
        message: message,
        type: 'category',
        item: category,
        categoryProducts: products
      });
    } catch (error) {
      setError({ isOpen: true, message: 'Error al obtener información de la categoría: ' + error.message });
    }
  };

  const confirmDelete = async () => {
    try {
      if (confirmDialog.type === 'product') {
        await deleteMenuItem(confirmDialog.item.id);
      } else if (confirmDialog.type === 'category') {
        await deleteCategory(confirmDialog.item.id);
      }
      closeConfirmDialog();
      // Actualizar datos en tiempo real
      if (refreshData) refreshData();
    } catch (error) {
      setError({ isOpen: true, message: 'Error al eliminar: ' + error.message });
      closeConfirmDialog();
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: '',
      message: '',
      type: '',
      item: null,
      categoryProducts: []
    });
  };

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

    // Encontrar el ID de la categoría seleccionada
    const selectedCategory = availableCategories.find(cat => cat.name.toLowerCase() === formData.category.toLowerCase())
    const categoryId = selectedCategory ? selectedCategory.id : 1

    const item = {
      name: formData.name.trim(),
      category_id: categoryId,
      description: formData.description.trim(),
      price_small: priceNumber,
      price_medium: formData.priceMedium ? Number(formData.priceMedium) : null,
      price_large: formData.priceLarge ? Number(formData.priceLarge) : null,
      // Campos opcionales - usar valores existentes si estamos editando
      popular: modalMode === 'edit' && editingItem ? editingItem.popular : 0,
      available: modalMode === 'edit' && editingItem ? editingItem.available : 1,
      // Imagen se maneja en el contexto con FormData
      imageFile: formData.imageFile, // Archivo para subir
      // Si estamos editando y no hay nueva imagen, mantener la existente
      image: formData.imageFile ? null : (modalMode === 'edit' && editingItem ? editingItem.image : formData.image),
    }

    try {
      console.log('💾 Iniciando guardado de producto...', { modalMode, editingItem: editingItem?.id, item })
      if (modalMode === 'edit' && editingItem) {
        console.log('✏️ Editando producto:', editingItem.id, item)
        console.log('Category ID que se envía:', item.category_id)
        await updateMenuItem(editingItem.id, item)
        console.log('✅ Producto editado exitosamente')
      } else {
        console.log('➕ Creando producto:', item)
        console.log('Category ID que se envía:', item.category_id)
        await addMenuItem(item)
        console.log('✅ Producto creado exitosamente')
      }
      closeModal()
      // Actualizar datos en tiempo real
      if (refreshData) {
        console.log('🔄 Refrescando datos después de guardar...')
        await refreshData()
        console.log('✅ Datos refrescados')
      } else {
        console.log('⚠️ No hay función refreshData disponible')
      }
    } catch (error) {
      console.error('❌ Error completo:', error)
      console.error('Mensaje de error:', error.message)
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

  // Paleta ultra mejorada para ambos modos
  const sectionClass = darkMode
    ? 'rounded-[2rem] border border-white/10 bg-gradient-to-br from-gris-oscuro/95 via-gris-oscuro/90 to-[#151515] p-8 shadow-2xl shadow-red/40 backdrop-red-sm'
    : 'rounded-[2rem] border border-slate-300/50 bg-gradient-to-br from-white/98 via-slate-50/95 to-indigo-50/90 backdrop-blur-xl p-8 shadow-2xl shadow-indigo-500/20 relative overflow-hidden'

  // Estilos para modales premium
  const modalBackdropClass = 'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300'
  const modalContainerClass = darkMode
    ? 'w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-hidden overflow-y-auto rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] bg-gradient-to-br from-[#111111]/98 via-[#0a0a0a]/95 to-[#000000]/98 backdrop-blur-2xl transform transition-all duration-500 ease-out'
    : 'w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-hidden overflow-y-auto rounded-[2.5rem] border border-slate-200/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] bg-gradient-to-br from-white/98 via-slate-50/95 to-indigo-50/90 backdrop-blur-2xl transform transition-all duration-500 ease-out'

  const modalHeaderClass = darkMode
    ? 'px-8 py-6 border-b border-white/5 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5'
    : 'px-8 py-6 border-b border-slate-200/40 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5'

  const modalContentClass = 'px-8 py-6'

  const textMain = darkMode ? 'text-white' : 'text-slate-800'
  const bgPanel = darkMode ? 'bg-[#111111]/95 text-white backdrop-blur-xl' : 'bg-gradient-to-br from-slate-100/95 via-slate-200/90 to-gray-300/85 text-slate-800 backdrop-blur-xl'
  const cardClass = darkMode
    ? 'group relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#111111] p-6 transition-all duration-300 hover:scale-[1.02] hover:border-naranja/30 hover:shadow-[0_0_30px_rgba(255,127,17,0.15)]'
    : 'group relative rounded-3xl border border-slate-400/60 bg-gradient-to-br from-white/90 via-slate-50/80 to-blue-50/60 backdrop-blur-sm p-6 transition-all duration-500 hover:scale-[1.03] hover:border-indigo-400/70 hover:shadow-2xl hover:shadow-indigo-500/40 shadow-lg shadow-slate-300/30'
  const inputClass = 'w-full rounded-2xl border border-white/10 bg-[#141414]/80 backdrop-blur-sm px-4 py-3 text-white placeholder:text-white/50 focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/20 focus:bg-[#1a1a1a]/90 transition-all duration-300 shadow-lg shadow-black/10 focus:shadow-orange-400/10 hover:border-white/20 hover:bg-[#1a1a1a]/60'

  // Estilos para el panel de categorías
  const categoryPanelClass = darkMode
    ? 'rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1a1a1a]/95 via-[#111111]/90 to-[#0a0a0a]/95 backdrop-blur-xl p-8 shadow-2xl shadow-red/20'
    : 'rounded-[2rem] border border-slate-300/50 bg-gradient-to-br from-white/95 via-slate-50/90 to-blue-50/85 backdrop-blur-xl p-8 shadow-2xl shadow-slate-300/40 relative overflow-hidden'

  const categoryCardClass = darkMode
    ? 'group relative flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-[#1a1a1a]/80 via-[#111111]/60 to-[#0a0a0a]/80 p-5 transition-all duration-300 hover:scale-[1.02] hover:border-naranja/30 hover:shadow-[0_0_20px_rgba(255,127,17,0.1)] hover:from-[#1a1a1a]/90 hover:via-[#111111]/80 hover:to-[#0a0a0a]/90'
    : 'group relative flex items-center justify-between rounded-2xl border border-slate-200/50 bg-gradient-to-r from-white/90 via-slate-50/80 to-blue-50/70 p-5 transition-all duration-300 hover:scale-[1.03] hover:border-indigo-400/70 hover:shadow-xl hover:shadow-indigo-500/30 hover:from-white/95 hover:via-slate-50/90 hover:to-blue-50/80 shadow-lg shadow-slate-300/20'

  const categoryBadgeClass = (category) => {
    const baseClasses = 'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold shadow-sm transition-all duration-300'
    return baseClasses + ' ' + getCategoryColor(category)
  }

  // Mostrar indicador de carga mientras se cargan los datos
  if (loading) {
    return (
      <section className={sectionClass}>
        <div className="relative z-10 flex flex-col items-center justify-center py-20">
          <div className="relative mb-8">
            <div className={'w-20 h-20 rounded-full flex items-center justify-center shadow-lg ' +
              (darkMode
                ? 'bg-gradient-to-br from-[#1a1a1a]/50 to-[#111111]/50 shadow-red/20'
                : 'bg-gradient-to-br from-slate-200/50 to-blue-200/30 shadow-slate-300/30'
              )}>
              <span className='text-4xl'>🔄</span>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
          </div>
          <h3 className={'text-lg font-semibold mb-2 ' + (darkMode ? 'text-white/80' : 'text-slate-700')}>
            Cargando menú...
          </h3>
          <p className={'text-sm ' + (darkMode ? 'text-white/50' : 'text-slate-500')}>
            Obteniendo productos y categorías desde el servidor
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className={sectionClass}>
      {/* Elementos decorativos de fondo ultra mejorados */}
      {!darkMode && (
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/8 via-purple-400/6 to-pink-400/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-400/8 via-teal-400/6 to-cyan-400/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-orange-400/5 via-amber-400/3 to-yellow-400/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      )}
      {darkMode && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-500/5 via-orange-500/3 to-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-500/5 via-pink-500/3 to-red-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      )}
      
      <div className="relative z-10">
        {/* Header con título y botones ultra mejorados */}
        <div className='mb-8 flex items-center justify-between gap-6'>
          <div className='flex-1'>
            <p className='text-sm uppercase tracking-[0.4em] text-orange-500 font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent'>
              Gestión de menú
            </p>
            <h2 className={'mt-2 text-4xl font-bold ' + textMain}>
              Productos disponibles
              <span className='ml-3 inline-flex items-center justify-center w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-lg shadow-emerald-200/50'></span>
            </h2>
            <p className={'mt-2 text-sm ' + (darkMode ? 'text-white/60' : 'text-slate-600')}>
              Administra tu catálogo de productos con facilidad y estilo premium
            </p>
          </div>

          {/* Indicadores de estado */}
          <div className='hidden md:flex items-center gap-4'>
            <div className={'flex items-center gap-2 px-3 py-2 rounded-xl border ' +
              (darkMode
                ? 'border-white/10 bg-[#1a1a1a]/50 text-white/80'
                : 'border-slate-200/50 bg-gradient-to-r from-slate-50/80 to-blue-50/60 text-slate-700'
              )}>
              <div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></div>
              <span className='text-xs font-medium'>{menuItems.length} productos</span>
            </div>
            <div className={'flex items-center gap-2 px-3 py-2 rounded-xl border ' +
              (darkMode
                ? 'border-white/10 bg-[#1a1a1a]/50 text-white/80'
                : 'border-slate-200/50 bg-gradient-to-r from-slate-50/80 to-blue-50/60 text-slate-700'
              )}>
              <div className='w-2 h-2 rounded-full bg-blue-400 animate-pulse'></div>
              <span className='text-xs font-medium'>{categoryList.filter(cat => cat !== 'todas').length} categorías</span>
            </div>
          </div>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => openProductModal('create')}
              className='group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 px-6 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-orange-300/40 transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(255,127,17,0.4)] active:scale-[0.98] overflow-hidden border border-orange-300/30'
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

        {/* Panel de gestión de categorías ultra mejorado */}
        <div className={'mb-8 ' + categoryPanelClass}>
          {/* Elementos decorativos de fondo */}
          {!darkMode && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-400/8 via-teal-400/5 to-cyan-400/8 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-400/8 via-purple-400/5 to-pink-400/8 rounded-full blur-2xl"></div>
            </div>
          )}
          {darkMode && (
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-red-500/5 via-orange-500/3 to-yellow-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/5 via-pink-500/3 to-red-500/5 rounded-full blur-2xl"></div>
            </div>
          )}

          <div className="relative z-10">
            {/* Header del panel */}
            <div className='mb-8 flex items-center justify-between gap-4'>
              <div>
                <p className='text-sm uppercase tracking-[0.4em] text-orange-500 font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent'>
                  Gestión de categorías
                </p>
                <h3 className={'mt-2 text-2xl font-bold ' + textMain}>
                  Organiza tu menú
                  <span className='ml-3 inline-flex items-center justify-center w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse shadow-lg shadow-emerald-200/50'></span>
                </h3>
                <p className={'mt-2 text-sm ' + (darkMode ? 'text-white/60' : 'text-slate-500')}>
                  Crea, administra y elimina categorías para organizar mejor tus productos
                </p>
            </div>
          </div>

            {/* Grid de categorías con diseño premium */}
            {categoryList.filter(cat => cat !== 'todas').length > 0 ? (
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {categoryList.filter(cat => cat !== 'todas').map((category, idx) => {
                  const productCount = menuItems.filter(item => item.category.toLowerCase() === category.toLowerCase()).length;
                  return (
                    <div
                      key={category}
                      className={categoryCardClass}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className='flex items-center justify-between w-full'>
                        {/* Badge de categoría con colores dinámicos - más grande */}
                        <span className={'inline-flex items-center rounded-full px-4 py-2 text-sm font-bold shadow-lg transition-all duration-300 flex-1 mr-3 ' + getCategoryColor(category)}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>

                        {/* Contador de productos - más simple */}
                        <div className='flex items-center gap-2'>
                          <span className={'text-sm font-bold ' + (darkMode ? 'text-white/90' : 'text-slate-700')}>
                            {productCount}
                          </span>

                          {/* Botón de eliminar - más pequeño y discreto */}
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className={'group/btn relative inline-flex items-center justify-center rounded-lg p-2 text-xs font-semibold transition-all duration-300 hover:scale-110 ' +
                              (darkMode
                                ? 'border border-red-600/40 bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:border-red-500/60'
                                : 'border border-red-300/50 bg-red-50/80 text-red-600 hover:bg-red-100/90 hover:border-red-400/60 shadow-sm'
                              )
                            }
                            title={`Eliminar categoría "${category}"`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-16 text-center'>
                <div className='relative mb-6'>
                  <div className={'w-20 h-20 rounded-full flex items-center justify-center shadow-lg ' +
                    (darkMode
                      ? 'bg-gradient-to-br from-[#1a1a1a]/50 to-[#111111]/50 shadow-red/20'
                      : 'bg-gradient-to-br from-slate-200/50 to-blue-200/30 shadow-slate-300/30'
                    )}>
                    <span className='text-4xl'>📂</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
                </div>
                <h3 className={'text-lg font-semibold mb-2 ' + (darkMode ? 'text-white/80' : 'text-slate-700')}>
                  No hay categorías personalizadas
                </h3>
                <p className={'text-sm mb-6 max-w-md ' + (darkMode ? 'text-white/50' : 'text-slate-500')}>
                  Crea tu primera categoría para organizar mejor tus productos
                </p>
                <button
                  onClick={openCategoryModal}
                  className='group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-300/40 transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] active:scale-[0.98] overflow-hidden'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  <span className='relative flex items-center gap-2'>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear primera categoría
                  </span>
                </button>
              </div>
            )}
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
                       <span className={'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ' + getCategoryColor(item.category || 'extras')}>
                         {item.category || 'extras'}
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
                      {item.category && item.category.toLowerCase() === 'pizzas' ? (
                        <>
                          {item.price_medium && (
                            <p className='text-sm text-slate-400 mt-1'>Mediana: ${item.price_medium.toLocaleString()}</p>
                          )}
                          {item.price_large && (
                            <p className='text-sm text-slate-400 mt-1'>Grande: ${item.price_large.toLocaleString()}</p>
                          )}
                        </>
                      ) : (
                        item.price_large && (
                          <p className='text-sm text-slate-400 mt-1'>Grande: ${item.price_large.toLocaleString()}</p>
                        )
                      )}
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEdit(item)}
                        className='group/btn relative inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-orange-400'
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </span>
                      </button>
                       <button
                         onClick={() => handleDeleteProduct(item)}
                         className='group/btn relative inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 border-red-600/40 bg-red-600/20 text-red-400 hover:bg-red-600/30'
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
            <div className='relative mb-8'>
              <div className='w-28 h-28 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-br from-[#1a1a1a]/50 to-[#111111]/50 shadow-red/20'>
                <span className='text-6xl'>📋</span>
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-ping"></div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
            </div>
            <h3 className='text-2xl font-bold mb-3 text-white/90'>
              No hay productos registrados
            </h3>
            <p className='text-sm mb-8 max-w-md leading-relaxed text-white/50'>
              Comienza agregando tu primer producto para ofrecer una experiencia deliciosa a tus clientes
            </p>
            <button
              onClick={() => openProductModal('create')}
              className='group relative inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 px-8 py-4 text-sm font-bold text-slate-800 shadow-lg shadow-orange-300/40 transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(255,127,17,0.4)] active:scale-[0.98] overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <span className='relative flex items-center gap-3'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar primer producto
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        )}

        {/* Modal ultra premium con animaciones avanzadas */}
        {isModalOpen && (
          <div
            className={`${modalBackdropClass} ${
              darkMode
                ? 'bg-slate-900/80 backdrop-blur-2xl'
                : 'bg-slate-900/60 backdrop-blur-xl'
            }`}
            style={{
              animation: 'modalFadeIn 0.3s ease-out forwards'
            }}
          >
            {/* Elementos decorativos de fondo para el modal */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
                darkMode
                  ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10'
                  : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10'
              }`} style={{animationDelay: '0s'}}></div>
              <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse ${
                darkMode
                  ? 'bg-gradient-to-tr from-purple-500/10 to-pink-500/10'
                  : 'bg-gradient-to-tr from-emerald-500/10 to-teal-500/10'
              }`} style={{animationDelay: '1s'}}></div>
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-2xl animate-pulse ${
                darkMode
                  ? 'bg-gradient-to-r from-orange-500/8 to-yellow-500/8'
                  : 'bg-gradient-to-r from-blue-500/8 to-cyan-500/8'
              }`} style={{animationDelay: '2s'}}></div>
            </div>
            <div
              className={modalContainerClass}
              style={{
                animation: 'modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              }}
            >
              {/* Header del modal premium */}
              <div className={modalHeaderClass}>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        darkMode
                          ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
                          : 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20'
                      }`}>
                        <span className='text-lg'>
                          {modalType === 'category' ? '📁' : modalMode === 'edit' ? '✏️' : '➕'}
                        </span>
                      </div>
                      <div className='flex-1'>
                        {modalType === 'product' ? (
                          // Campo de nombre del producto en el header
                          <div className='space-y-1'>
                            <label className={`block text-xs font-medium ${
                              darkMode ? 'text-white/70' : 'text-slate-600'
                            }`}>
                              Nombre del producto
                            </label>
                             <input
                               type='text'
                               value={formData.name}
                               onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                               placeholder='Ej. Pizza Mexicana, Hamburguesa...'
                               maxLength="30"
                               className={`${inputClass} text-sm py-2`}
                             />
                          </div>
                        ) : (
                          // Título normal para categorías
                          <div>
                            <h3 className={`text-2xl font-bold ${
                              darkMode ? 'text-white' : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'
                            }`}>
                              {modalType === 'category' ? 'Nueva categoría' : modalMode === 'edit' ? 'Editar producto' : 'Agregar producto'}
                            </h3>
                            <p className={`text-sm ${
                              darkMode ? 'text-white/60' : 'text-slate-600'
                            }`}>
                              {modalType === 'category'
                                ? 'Crea una nueva categoría para organizar mejor tus productos'
                                : 'Completa la información del producto y añade una imagen atractiva'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Botón de cerrar solo para categorías */}
                  {modalType === 'category' && (
                    <div className='flex justify-end'>
                      <button
                        type='button'
                        onClick={closeModal}
                        className={`group relative rounded-full p-3 transition-all duration-300 hover:scale-110 hover:rotate-90 ${
                          darkMode
                            ? 'bg-[#1a1a1a]/60 text-white/70 hover:bg-red-600/25 hover:text-red-400 shadow-lg shadow-red-500/10 hover:shadow-red-500/20'
                            : 'bg-white/90 text-slate-600 hover:bg-red-50/90 hover:text-red-600 border border-slate-300/50 shadow-lg shadow-slate-300/20 hover:shadow-red-300/30'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                </div>

                {/* Contenido del modal premium */}
                  <div className={modalContentClass}>
                    {modalType === 'category' ? (
                      <div className='space-y-6'>
                         <div className='space-y-2'>
                           <label className='block text-sm font-semibold text-white/80'>Nombre de la categoría</label>
                           <input
                             type='text'
                             value={categoryInput}
                             onChange={(e) => setCategoryInput(e.target.value)}
                             placeholder='Ej. Pizzas, Bebidas, Postres...'
                             maxLength="50"
                             className={inputClass}
                           />
                         </div>

                        <div className='flex justify-end gap-3'>
                          <button
                            type='button'
                            onClick={closeModal}
                            className='rounded-xl border border-white/20 bg-[#1a1a1a]/60 text-white/80 hover:border-white/30 hover:bg-[#1a1a1a]/80 hover:text-white px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105'
                          >
                            Cancelar
                          </button>
                          <button
                            type='button'
                            onClick={handleSaveCategory}
                            className='rounded-xl border border-green-400/60 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-600/40 hover:border-green-500/70 hover:from-green-600 hover:to-teal-600 hover:brightness-110'
                          >
                            <span className='flex items-center gap-2'>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Guardar categoría
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className='space-y-6'>
                        <div className='space-y-2'>
                          <label className='block text-sm font-semibold text-white/80'>Descripción</label>
                            <textarea
                              value={formData.description}
                              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                              rows='4'
                              placeholder='Descripción breve del producto'
                              maxLength="60"
                              className={inputClass}
                            />
                        </div>

                         <div className='grid gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                              <label className='block text-sm font-semibold text-white/80'>Categoría</label>
                              <select
                                value={formData.category}
                                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                                className={inputClass}
                              >
                                <option value="">Seleccionar categoría</option>
                                {availableCategories.map((category) => (
                                  <option key={category.id} value={category.name}>
                                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className='space-y-2'>
                              <label className='block text-sm font-semibold text-white/80'>Precio</label>
                              <input
                                type='number'
                                value={formData.price}
                                onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                                placeholder='0'
                                maxLength="10"
                                className={inputClass}
                              />
                            </div>
                          </div>

                          <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-white/80'>Precio mediano (opcional)</label>
                            <input
                              type='number'
                              value={formData.priceMedium}
                              onChange={(e) => setFormData((prev) => ({ ...prev, priceMedium: e.target.value }))}
                              placeholder='0'
                              maxLength="10"
                              className={inputClass}
                            />
                          </div>

                          <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-white/80'>Precio grande (opcional)</label>
                            <input
                              type='number'
                              value={formData.priceLarge}
                              onChange={(e) => setFormData((prev) => ({ ...prev, priceLarge: e.target.value }))}
                              placeholder='0'
                              maxLength="10"
                              className={inputClass}
                            />
                         </div>

                        <div className='grid gap-4 md:grid-cols-2'>
                          <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-white/80'>Subir foto</label>
                            <input type='file' accept='image/*' onChange={handlePhotoChange} className={inputClass} />
                          </div>
                           <div className='space-y-2'>
                             <label className='block text-sm font-semibold text-white/80'>O usar URL de imagen</label>
                             <input
                               type='text'
                               value={formData.imageUrl}
                               onChange={(e) => handleImageUrlChange(e.target.value)}
                               placeholder='https://...'
                               maxLength="100"
                               className={inputClass}
                             />
                           </div>
                        </div>

                        {photoPreview && (
                          <div className='rounded-2xl border border-white/10 bg-[#1a1a1a]/60 p-6 shadow-xl backdrop-blur-sm'>
                            <div className='flex items-center gap-2 mb-4'>
                              <div className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center'>
                                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <p className='text-sm font-semibold text-white/90'>
                                Previsualización de imagen
                              </p>
                            </div>
                            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/5 group">
                              <img src={photoPreview} alt='Vista previa' className='w-full h-52 object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110' />
                              <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none'></div>
                              <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                            </div>
                          </div>
                        )}

                        <div className='flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200/30'>
                          <button
                            type='button'
                            onClick={closeModal}
                            className='rounded-xl border border-white/20 bg-[#1a1a1a]/60 text-white/80 hover:border-white/30 hover:bg-[#1a1a1a]/80 hover:text-white px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-black/10 hover:shadow-black/20'
                          >
                            Cancelar
                          </button>
                          <button
                            type='button'
                            onClick={handleSaveProduct}
                            className='rounded-xl border border-orange-400/60 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 px-6 py-3 text-sm font-bold text-slate-800 shadow-lg shadow-orange-400/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40 hover:border-orange-500/70 hover:brightness-105'
                          >
                            <span className='flex items-center gap-2'>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {modalMode === 'edit' ? 'Guardar cambios' : 'Crear producto'}
                            </span>
                          </button>
                        </div>
                 </div>
               )}
             </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.type === 'category' ? 'Eliminar categoría y productos' : 'Eliminar producto'}
          cancelText="Cancelar"
          onConfirm={confirmDelete}
          onCancel={closeConfirmDialog}
          darkMode={darkMode}
        >
          {confirmDialog.type === 'category' && confirmDialog.categoryProducts.length > 0 && (
            <div className='space-y-3'>
              <div className='rounded-xl border border-amber-200/50 bg-amber-50/50 p-3'>
                <p className='text-sm font-semibold text-amber-800 mb-2'>📦 Productos que serán eliminados:</p>
                <div className='space-y-1 max-h-32 overflow-y-auto'>
                  {confirmDialog.categoryProducts.map((product) => (
                    <div key={product.id} className='text-xs text-amber-700 bg-amber-100/50 px-2 py-1 rounded flex items-center gap-2'>
                      <span>•</span>
                      <span>{product.name}</span>
                    </div>
                  ))}
                </div>
                <p className='text-xs text-amber-600 mt-2 font-medium'>
                  ⚠️ Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          )}
        </ConfirmDialog>
      </div>

      {/* Modal de Error - DENTRO del section */}
      <ErrorModal
        isOpen={error.isOpen}
        message={error.message}
        onClose={() => setError({ isOpen: false, message: '' })}
        darkMode={darkMode}
      />
    </section>
  )
}

export default MenuManagementUltraEnhanced
