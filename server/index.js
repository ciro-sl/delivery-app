import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// Datos del menú "Pa' Que Arvoy"
const menuItems = [
  { 
    id: 1, 
    name: 'SUPER DE LA CASA', 
    category: 'Pizzas', 
    price: 20000, 
    priceLarge: 33000,
    description: 'Queso Mozzarella, Jamón, Cebolla, Pimentón, Carne Molida, Tocineta, Pepperoni, Maíz, Anchoas y Champiñones', 
    popular: true 
  },
  { 
    id: 2, 
    name: 'ESPECIAL', 
    category: 'Pizzas', 
    price: 19000, 
    priceLarge: 38000,
    description: 'Queso Mozzarella, Jamón, Cebolla, Pimentón, Tocineta, Carne Molida y Pepperoni', 
    popular: true 
  },
  { 
    id: 3, 
    name: 'VEGETARIANA', 
    category: 'Pizzas', 
    price: 18000, 
    priceLarge: 26000,
    description: 'Queso Mozzarella, Anchoas, Champiñones, Cebolla y Pimentón', 
    popular: false 
  }
]

const ADMIN_PASSWORD = 'admin123'

app.get('/api/menu', (req, res) => {
  res.json(menuItems)
})

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body
  if (password === ADMIN_PASSWORD) {
    res.json({ token: 'fake-jwt-token' })
  } else {
    res.status(401).json({ message: 'Contraseña incorrecta' })
  }
})

app.listen(3001, () => {
  console.log('🔥 Servidor "Pa Que Arvoy" corriendo en http://localhost:3001')
  console.log('📋 Menú disponible en http://localhost:3001/api/menu')
})