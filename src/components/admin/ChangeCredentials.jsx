import { useState } from 'react'
import axios from 'axios'

const ChangeCredentials = ({ darkMode }) => {
  const [currentUsername, setCurrentUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accessKey, setAccessKey] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Validaciones en tiempo real para la nueva contraseña
  const passwordValidations = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
  }

  const isPasswordValid = Object.values(passwordValidations).every(v => v)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError('La contraseña no cumple con los requisitos')
      setLoading(false)
      return
    }

    try {
      const res = await axios.post('http://localhost:3001/api/auth/change-credentials', {
        currentUsername,
        currentPassword,
        newUsername,
        newPassword,
        confirmPassword,
        accessKey
      })
      setSuccess(res.data.message)
      // Limpiar formulario
      setCurrentUsername('')
      setCurrentPassword('')
      setNewUsername('')
      setNewPassword('')
      setConfirmPassword('')
      setAccessKey('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar credenciales')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cambiar Credenciales</h2>
        <p className="text-gray-600 dark:text-gray-400">Actualiza tu usuario y contraseña de administrador</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Credenciales actuales */}
        <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-6 border border-gray-300 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Credenciales Actuales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Usuario Actual
              </label>
              <input
                type="text"
                value={currentUsername}
                onChange={(e) => setCurrentUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Nuevas credenciales */}
        <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-6 border border-gray-300 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nuevas Credenciales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nuevo Usuario
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clave de Acceso
              </label>
              <input
                type="text"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="2005"
                required
              />
            </div>
          </div>

          {/* Validaciones de contraseña */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Requisitos de la contraseña:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className={`flex items-center gap-2 ${passwordValidations.length ? 'text-green-600' : 'text-red-600'}`}>
                <span>{passwordValidations.length ? '✅' : '❌'}</span>
                <span>Mínimo 8 caracteres</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordValidations.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                <span>{passwordValidations.uppercase ? '✅' : '❌'}</span>
                <span>Al menos una mayúscula</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordValidations.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                <span>{passwordValidations.lowercase ? '✅' : '❌'}</span>
                <span>Al menos una minúscula</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordValidations.number ? 'text-green-600' : 'text-red-600'}`}>
                <span>{passwordValidations.number ? '✅' : '❌'}</span>
                <span>Al menos un número</span>
              </div>
              <div className={`flex items-center gap-2 ${passwordValidations.special ? 'text-green-600' : 'text-red-600'}`}>
                <span>{passwordValidations.special ? '✅' : '❌'}</span>
                <span>Al menos un carácter especial</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-400 rounded-md">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isPasswordValid}
          className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,127,17,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
              <span>Cambiando...</span>
            </>
          ) : (
            <>
              <span>🔐</span>
              <span>Cambiar Credenciales</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default ChangeCredentials