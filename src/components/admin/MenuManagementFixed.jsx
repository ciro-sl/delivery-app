/**
 * Componente de gestión del menú - Versión corregida y simplificada
 * Funciona con datos mínimos y manejo de errores robusto
 */
import { useMemo, useState } from 'react'

const MenuManagementFixed = ({ menuItems, availableCategories = [], addMenuItem, updateMenuItem, deleteMenuItem, addCategory, darkMode }) => {
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

  // Si no hay datos, mostrar mensaje claro y botones básicos
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="p-8">
        <div className={`rounded-lg p-6 text-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <h2 className="text-2xl font-bold mb-4">Gestión de Menú</h2>
          <p className="mb-4">No hay productos cargados</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => openProductModal('create')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + Agregar Producto
            </button>
            <button
              onClick={openCategoryModal}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              + Nueva Categoría
            </button>
          </div>
        </div>

        {/* Modal simplificado */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-lg max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-bold mb-4">
                {modalType === 'product' ? 'Nuevo Producto' : 'Nueva Categoría'}
              </h3>
              
              {modalType === 'category' ? (
                <div>
                  <input
                    type="text"
                    placeholder="Nombre de categoría"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    maxLength="50"
                    className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSaveCategory}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    maxLength="30"
                    className={`w-full p-2 border rounded mb-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    maxLength="10"
                    className={`w-full p-2 border rounded mb-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                  <textarea
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    maxLength="40"
                    className={`w-full p-2 border rounded mb-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProduct}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Gestión de Menú</h2>
        <p className="text-sm opacity-75">Productos: {menuItems.length} | Categorías: {categoryList.length}</p>
      </div>

      {/* Botones principales */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => openProductModal('create')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Agregar Producto
        </button>
        <button
          onClick={openCategoryModal}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Nueva Categoría
        </button>
      </div>

      {/* Grid de productos */}
      <div className="grid gap-4 md:grid-cols-2">
        {menuItems.map((item, idx) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm opacity-75">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${(item.price_small || item.price || 0).toLocaleString()}</p>
                {item.price_large && (
                  <p className="text-sm opacity-75">${item.price_large.toLocaleString()}</p>
                )}
              </div>
            </div>
            
            <p className="text-sm mb-3 opacity-75">{item.description}</p>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => deleteMenuItem && deleteMenuItem(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">
              {modalType === 'product' ? (modalMode === 'edit' ? 'Editar Producto' : 'Nuevo Producto') : 'Nueva Categoría'}
            </h3>
            
            {modalType === 'category' ? (
              <div>
                <input
                  type="text"
                  placeholder="Nombre de categoría"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  maxLength="50"
                  className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSaveCategory}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  maxLength="30"
                  className={`w-full p-2 border rounded mb-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  maxLength="10"
                  className={`w-full p-2 border rounded mb-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
                <textarea
                  placeholder="Descripción"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  maxLength="40"
                  className={`w-full p-2 border rounded mb-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProduct}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {modalMode === 'edit' ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuManagementFixed
