import { useEffect } from 'react'

const ErrorModal = ({ isOpen, message, onClose, darkMode }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md transform transition-all duration-300 scale-100">
        <div className={`relative rounded-2xl p-6 shadow-2xl ${
          darkMode 
            ? 'bg-gradient-to-br from-red-900/95 via-red-800/90 to-red-900/95 text-white border border-red-700/50' 
            : 'bg-gradient-to-br from-red-50 via-red-100 to-red-50 text-red-900 border border-red-200/60 shadow-red-200/40'
        } backdrop-blur-xl`}>
          
          {/* Icono de error */}
          <div className="flex items-center justify-center mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              darkMode 
                ? 'bg-red-800/50 text-red-200 border border-red-600/50' 
                : 'bg-red-100 text-red-600 border border-red-200'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          {/* Mensaje de error */}
          <div className="text-center mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${
              darkMode ? 'text-red-100' : 'text-red-800'
            }`}>
              Error
            </h3>
            <p className={`text-sm ${
              darkMode ? 'text-red-200/80' : 'text-red-700'
            }`}>
              {message}
            </p>
          </div>
          
          {/* Botón de cerrar */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                darkMode 
                  ? 'bg-red-800/50 text-red-100 hover:bg-red-700/50 border border-red-600/50' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
              }`}
            >
              Cerrar
            </button>
          </div>
          
          {/* Indicador de auto-cierre */}
          <div className="mt-4 text-center">
            <p className={`text-xs ${
              darkMode ? 'text-red-300/50' : 'text-red-500/60'
            }`}>
              Se cerrará automáticamente en 5 segundos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal
