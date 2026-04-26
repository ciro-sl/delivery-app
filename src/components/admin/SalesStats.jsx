import { useState, useEffect } from 'react'
import axios from 'axios'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const SalesStats = () => {
  const [stats, setStats] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    totalOrders: 0,
    weeklyData: [],
    monthlyData: []
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await axios.get('http://localhost:3001/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(res.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const weeklyChartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Ventas',
        data: stats.weeklyData,
        borderColor: '#FF7F11',
        backgroundColor: 'rgba(255, 127, 17, 0.14)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const monthlyChartData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'Ventas',
        data: stats.monthlyData,
        backgroundColor: '#7A0D0D',
        borderColor: '#FF7F11',
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#f0f0f0' }
      }
    },
    scales: {
      y: {
        ticks: { color: '#f0f0f0' },
        grid: { color: '#333' }
      },
      x: {
        ticks: { color: '#f0f0f0' },
        grid: { color: '#333' }
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naranja"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">📊 Estadísticas de Ventas</h2>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="card text-center bg-[#1b1411] border-white/10">
          <div className="text-4xl mb-2">💰</div>
          <div className="text-3xl font-bold text-naranja">${stats.daily}</div>
          <div className="text-texto-muted">Ventas Hoy</div>
        </div>
        <div className="card text-center bg-[#1b1411] border-white/10">
          <div className="text-4xl mb-2">📆</div>
          <div className="text-3xl font-bold text-naranja">${stats.weekly}</div>
          <div className="text-texto-muted">Esta Semana</div>
        </div>
        <div className="card text-center bg-[#1b1411] border-white/10">
          <div className="text-4xl mb-2">📅</div>
          <div className="text-3xl font-bold text-naranja">${stats.monthly}</div>
          <div className="text-texto-muted">Este Mes</div>
        </div>
        <div className="card text-center bg-[#1b1411] border-white/10">
          <div className="text-4xl mb-2">🍕</div>
          <div className="text-3xl font-bold text-naranja">{stats.totalOrders}</div>
          <div className="text-texto-muted">Pedidos Totales</div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Ventas Semanales</h3>
          <Line data={weeklyChartData} options={chartOptions} />
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Ventas Mensuales</h3>
          <Bar data={monthlyChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default SalesStats