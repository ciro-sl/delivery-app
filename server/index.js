// server/index.js
import express from 'express';
import cors from 'cors';
import db from './database.js';
import MenuModel from './models/MenuModel.js';
import OrderModel from './models/OrderModel.js';
import AuthModel from './models/AuthModel.js';

const app = express();
app.use(cors());
app.use(express.json());

// ============ ENDPOINTS DEL MENÚ ============

// Obtener todo el menú
app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuModel.getAll();
    res.json(items);
  } catch (error) {
    console.error('Error en /api/menu:', error);
    res.status(500).json({ message: 'Error al obtener el menú' });
  }
});

// Obtener categorías
app.get('/api/menu/categories', async (req, res) => {
  try {
    const categories = await MenuModel.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error en /api/menu/categories:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

// Obtener un item específico
app.get('/api/menu/:id', async (req, res) => {
  try {
    const item = await MenuModel.getById(parseInt(req.params.id));
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error en /api/menu/:id:', error);
    res.status(500).json({ message: 'Error al obtener el item' });
  }
});

// Crear nuevo item
app.post('/api/menu', async (req, res) => {
  try {
    const newItem = await MenuModel.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error en POST /api/menu:', error);
    res.status(500).json({ message: 'Error al crear el item' });
  }
});

// Actualizar item
app.put('/api/menu/:id', async (req, res) => {
  try {
    const updatedItem = await MenuModel.update(parseInt(req.params.id), req.body);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error en PUT /api/menu/:id:', error);
    res.status(500).json({ message: 'Error al actualizar el item' });
  }
});

// Eliminar item
app.delete('/api/menu/:id', async (req, res) => {
  try {
    await MenuModel.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error('Error en DELETE /api/menu/:id:', error);
    res.status(500).json({ message: 'Error al eliminar el item' });
  }
});

// ============ ENDPOINTS DE AUTENTICACIÓN ============

// Login - SOLO CONTRASEÑA
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body;
  
  console.log('Intento de login recibido');
  
  const isValid = await AuthModel.verifyAdmin(password);
  if (isValid) {
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
    res.json({ token, message: 'Login exitoso' });
  } else {
    res.status(401).json({ message: 'Contraseña incorrecta' });
  }
});

// Cambiar contraseña
app.post('/api/auth/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const isValid = await AuthModel.verifyAdmin(currentPassword);
  if (!isValid) {
    return res.status(401).json({ message: 'Contraseña actual incorrecta' });
  }
  
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 4 caracteres' });
  }
  
  await AuthModel.changePassword(newPassword);
  res.json({ message: 'Contraseña actualizada correctamente' });
});

// ============ ENDPOINTS DE PEDIDOS ============

// Obtener todos los pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await OrderModel.getAll();
    res.json(orders);
  } catch (error) {
    console.error('Error en /api/orders:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
});

// Obtener estadísticas
app.get('/api/orders/stats', async (req, res) => {
  try {
    const stats = await OrderModel.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error en /api/orders/stats:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

// Obtener un pedido específico
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await OrderModel.getById(parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error en /api/orders/:id:', error);
    res.status(500).json({ message: 'Error al obtener el pedido' });
  }
});

// Crear nuevo pedido
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = await OrderModel.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error en POST /api/orders:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
});

// Actualizar estado del pedido
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'delivering', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }
    
    const updatedOrder = await OrderModel.updateStatus(parseInt(req.params.id), status);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error en PATCH /api/orders/:id/status:', error);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ INICIAR SERVIDOR ============
// Buscar puerto disponible automáticamente
const puertos = [3001, 3002, 3003, 3004, 3005];
let puertoActual = 0;

function iniciarServidor(puerto) {
  const server = app.listen(puerto, () => {
    console.log(`\n🔥 Servidor "Pa Que Arvoy" corriendo en http://localhost:${puerto}`);
    console.log(`📋 Menú disponible en http://localhost:${puerto}/api/menu`);
    console.log(`📊 Pedidos disponibles en http://localhost:${puerto}/api/orders`);
    console.log(`📈 Estadísticas en http://localhost:${puerto}/api/orders/stats`);
    console.log(`🔐 Contraseña admin: "admin123"`);
    console.log(`💾 Base de datos: SQLite\n`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      puertoActual++;
      if (puertoActual < puertos.length) {
        console.log(`⚠️ Puerto ${puerto} en uso, usando puerto ${puertos[puertoActual]}`);
        iniciarServidor(puertos[puertoActual]);
      } else {
        console.error('❌ No hay puertos disponibles del 3001 al 3005');
        process.exit(1);
      }
    } else {
      console.error('Error al iniciar servidor:', err);
      process.exit(1);
    }
  });
}

iniciarServidor(puertos[0]);