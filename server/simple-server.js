// simple-server.js - Versión simplificada para probar el servidor
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Menu endpoint básico
app.get('/api/menu', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Pizza Margarita',
      category_name: 'pizzas',
      price_small: 5000,
      price_large: 8000,
      description: 'Pizza con tomate, mozzarella y albahaca',
      popular: 1,
      available: 1
    }
  ]);
});

// Categories endpoint
app.get('/api/menu/categories', (req, res) => {
  res.json([
    { id: 1, name: 'Pizzas', display_order: 1 },
    { id: 2, name: 'Bebidas', display_order: 2 }
  ]);
});

// Orders endpoint
app.get('/api/orders', (req, res) => {
  res.json([]);
});

// Orders stats
app.get('/api/orders/stats', (req, res) => {
  res.json({
    totalOrders: 0,
    totalEarnings: 0,
    averageOrder: 0
  });
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🔥 Servidor simple corriendo en http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🍕 Menú: http://localhost:${PORT}/api/menu`);
  console.log(`📊 Pedidos: http://localhost:${PORT}/api/orders`);
  console.log(`💾 Base de datos: Simulada (sin SQLite)\n`);
});
