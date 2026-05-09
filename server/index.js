// server/index.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, initDB } from './database.js';
import MenuModel from './models/MenuModel.js';
import OrderModel from './models/OrderModel.js';
import AuthModel from './models/AuthModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Crear nueva categoría
app.post('/api/menu/categories', async (req, res) => {
  try {
    const newCategory = await MenuModel.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error en POST /api/menu/categories:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ message: 'La categoría ya existe' });
    } else {
      res.status(500).json({ message: 'Error al crear la categoría' });
    }
  }
});

// Obtener productos de una categoría
app.get('/api/menu/categories/:id/products', async (req, res) => {
  try {
    const products = await MenuModel.getProductsInCategory(parseInt(req.params.id));
    res.json(products);
  } catch (error) {
    console.error('Error en GET /api/menu/categories/:id/products:', error);
    res.status(500).json({ message: 'Error al obtener productos de la categoría' });
  }
});

// Eliminar categoría
app.delete('/api/menu/categories/:id', async (req, res) => {
  try {
    const result = await MenuModel.deleteCategory(parseInt(req.params.id));
    res.json({
      message: `Categoría eliminada exitosamente. ${result.productsDeleted} producto(s) eliminado(s).`,
      deletedProducts: result.productsDeleted,
      deletedCategory: result.categoryDeleted
    });
  } catch (error) {
    console.error('Error en DELETE /api/menu/categories/:id:', error);
    res.status(500).json({ message: 'Error al eliminar la categoría' });
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

// Crear nuevo item con imagen
app.post('/api/menu', upload.single('image'), async (req, res) => {
  try {
    const itemData = { ...req.body };

    // Si hay un archivo subido, guardar la ruta
    if (req.file) {
      itemData.image = `/uploads/${req.file.filename}`;
    }

    // Convertir campos numéricos
    if (itemData.price_small) itemData.price_small = parseFloat(itemData.price_small);
    if (itemData.price_medium) itemData.price_medium = parseFloat(itemData.price_medium);
    if (itemData.price_large) itemData.price_large = parseFloat(itemData.price_large);
    if (itemData.category_id) itemData.category_id = parseInt(itemData.category_id);

    const newItem = await MenuModel.create(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error en POST /api/menu:', error);
    res.status(500).json({ message: 'Error al crear el item' });
  }
});

// Actualizar item con imagen
app.put('/api/menu/:id', upload.single('image'), async (req, res) => {
  try {
    console.log('PUT /api/menu/:id - Datos recibidos:', req.params.id, req.body);

    const itemData = { ...req.body };

    // Si hay un archivo subido, guardar la ruta
    if (req.file) {
      itemData.image = `/uploads/${req.file.filename}`;
      console.log('Archivo subido:', req.file.filename);
    } else if (req.body.image) {
      // Si no hay archivo pero se envió una URL de imagen existente, mantenerla
      itemData.image = req.body.image;
    }
    // Si no hay archivo ni imagen, mantener null (para que no se actualice)

    // Convertir campos numéricos con validación
    if (itemData.price_small !== undefined && itemData.price_small !== '') {
      itemData.price_small = parseFloat(itemData.price_small);
    }
    if (itemData.price_medium !== undefined && itemData.price_medium !== '') {
      itemData.price_medium = parseFloat(itemData.price_medium);
    }
    if (itemData.price_large !== undefined && itemData.price_large !== '') {
      itemData.price_large = parseFloat(itemData.price_large);
    }
    if (itemData.category_id !== undefined && itemData.category_id !== '') {
      itemData.category_id = parseInt(itemData.category_id);
    }

    // Asegurar valores por defecto
    itemData.popular = itemData.popular ? 1 : 0;
    itemData.available = itemData.available !== undefined ? (itemData.available ? 1 : 0) : 1;

    console.log('Datos procesados para actualizar:', itemData);

    const updatedItem = await MenuModel.update(parseInt(req.params.id), itemData);
    console.log('Producto actualizado exitosamente:', updatedItem);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error en PUT /api/menu/:id:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error al actualizar el item: ' + error.message });
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

// Login con usuario y contraseña
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Intento de login recibido');

  const isValid = await AuthModel.verifyAdmin(username, password);
  if (isValid) {
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    res.json({ token, message: 'Login exitoso' });
  } else {
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }
});

// Cambiar credenciales
app.post('/api/auth/change-credentials', async (req, res) => {
  const { currentUsername, currentPassword, newUsername, newPassword, confirmPassword, accessKey } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    await AuthModel.changeCredentials(currentUsername, currentPassword, newUsername, newPassword, accessKey);
    res.json({ message: 'Credenciales cambiadas exitosamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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
    const order = await OrderModel.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error en /api/orders/:id:', error);
    res.status(500).json({ message: 'Error al obtener pedido' });
  }
});

// Obtener pedido por teléfono (para seguimiento del cliente)
app.get('/api/orders/track/:phone', async (req, res) => {
  try {
    const order = await OrderModel.getByPhone(req.params.phone);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error en /api/orders/track/:phone:', error);
    res.status(500).json({ message: 'Error al obtener pedido' });
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
    const validStatuses = ['Preparando', 'Entregando', 'Entregado', 'Cancelado'];
    
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

async function iniciarServidor(puerto) {
  // Esperar a que la base de datos se inicialice
  try {
    await initDB();
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    process.exit(1);
  }

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