import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import axios from 'axios'

const AdminLogin = () => {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [focused, setFocused] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { username, password })
      login(res.data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Modal container con backdrop y animación */}
        <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1a1010] via-[#1f1212] to-[#1a1010] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl animate-fade-in">
          {/* Decorative glow effect */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-naranja/20 blur-[80px] animate-pulse-glow" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-vinotinto/20 blur-[80px] animate-pulse-glow animation-delay-500" />

          <div className="relative z-10 text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-naranja to-amarillo shadow-lg shadow-naranja/30 mb-4 animate-bounce-subtle">
              <span className="text-4xl">🍕</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              Acceso Administrador
            </h2>
            <p className="mt-2 text-texto-muted">
              Ingresa la contraseña para acceder al panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            <div>
              <label className="block text-sm font-medium text-texto-muted mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-negro/50 border border-vinotinto/30 rounded-xl text-texto transition-all duration-300 focus:outline-none focus:border-naranja focus:ring-2 focus:ring-naranja/30 focus:shadow-[0_0_20px_rgba(255,127,17,0.2)] hover:border-naranja/50"
                placeholder="admin"
               />
            </div>
            <div className={`relative transition-all duration-300 ${focused ? 'scale-[1.02]' : ''}`}>
              <label className="block text-sm font-medium text-texto-muted mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full px-4 py-3 bg-negro/50 border border-vinotinto/30 rounded-xl text-texto transition-all duration-300 focus:outline-none focus:border-naranja focus:ring-2 focus:ring-naranja/30 focus:shadow-[0_0_20px_rgba(255,127,17,0.2)] hover:border-naranja/50"
                placeholder="••••••••"
                autoFocus
               />
              </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center text-sm animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-naranja to-amarillo px-6 py-4 text-sm font-bold text-gris-oscuro shadow-lg shadow-naranja/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,127,17,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gris-oscuro" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>Acceder al Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-texto-muted">
            <p>Área restringida — Solo personal autorizado</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin