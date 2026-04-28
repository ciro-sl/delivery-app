/**
 * Componente de gestión del menú con debugging extensivo.
 * Versión para identificar por qué no se muestra nada.
 */
import { useMemo, useState, useEffect } from 'react'

const MenuManagementDebug = ({ menuItems, availableCategories = [], addMenuItem, updateMenuItem, deleteMenuItem, addCategory, darkMode }) => {
  console.log('🔍 MenuManagementDebug - Renderizando');
  console.log('📊 Props recibidas:', {
    menuItems: menuItems?.length || 0,
    availableCategories: availableCategories?.length || 0,
    hasAddMenuItem: typeof addMenuItem === 'function',
    hasUpdateMenuItem: typeof updateMenuItem === 'function',
    hasDeleteMenuItem: typeof deleteMenuItem === 'function',
    hasAddCategory: typeof addCategory === 'function',
    darkMode
  });

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

  console.log('📂 Categorías calculadas:', categoryList);

  const resetForm = () => {
    console.log('🔄 Reseteando formulario');
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
    console.log('📝 Abriendo modal producto:', mode, item);
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
    console.log('📂 Abriendo modal categoría');
    setModalType('category')
    setModalMode('create')
    resetForm()
    setIsModalOpen(true)
  }

  const closeModal = () => {
    console.log('❌ Cerrando modal');
    setIsModalOpen(false)
    resetForm()
  }

  // Si no hay datos, mostrar mensaje claro
  if (!menuItems || menuItems.length === 0) {
    console.log('⚠️ No hay menuItems - mostrando mensaje');
    return (
      <div className="p-8 text-center">
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700'}`}>
          <h3 className="text-lg font-bold mb-2">No hay productos cargados</h3>
          <p>No se encontraron productos en la base de datos.</p>
          <p className="text-sm mt-2">Verifica que el servidor esté funcionando correctamente.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Recargar página
          </button>
        </div>
      </div>
    )
  }

  console.log('✅ Renderizando MenuManagement con datos');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Gestión de Menú (DEBUG)</h2>
        <p className="text-sm opacity-75">Productos cargados: {menuItems.length}</p>
        <p className="text-sm opacity-75">Categorías: {categoryList.join(', ')}</p>
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
                onClick={() => openProductModal('edit', item)}
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

      {/* Modal simplificado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">
              {modalType === 'product' ? 'Producto' : 'Categoría'}
            </h3>
            <p>Modal en modo: {modalMode}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuManagementDebug
