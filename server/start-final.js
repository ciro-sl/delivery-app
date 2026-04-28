// start-final.js - Servidor final con logging y endpoints completos
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 INICIANDO SERVIDOR FINAL...');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a base de datos
const dbPath = join(__dirname, 'delivery.db');
let db;

try {
  db = new Database(dbPath);
  console.log('✅ Base de datos conectada');
  
  // Verificar que existan datos
  const productCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get();
  console.log(`📊 Base de datos contiene ${productCount.count} productos`);
  
} catch (error) {
  console.error('❌ Error conectando a base de datos:', error);
  process.exit(1);
}

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Obtener menú completo
app.get('/api/menu', (req, res) => {
  console.log('🍕 Solicitando menú completo...');
  try {
    const items = db.prepare(`
      SELECT mi.*, c.name as category_name 
      FROM menu_items mi 
      LEFT JOIN categories c ON mi.category_id = c.id 
      WHERE mi.available = 1 
      ORDER BY mi.id
    `).all();
    
    console.log(`📊 Enviando ${items.length} productos`);
    res.json(items);
  } catch (error) {
    console.error('❌ Error en /api/menu:', error);
    res.status(500).json({ error: 'Error al obtener menú' });
  }
});

// Obtener categorías
app.get('/api/menu/categories', (req, res) => {
  console.log('📂 Solicitando categorías...');
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY display_order').all();
    console.log(`📊 Enviando ${categories.length} categorías`);
    res.json(categories);
  } catch (error) {
    console.error('❌ Error en /api/menu/categories:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Crear producto
app.post('/api/menu', (req, res) => {
  console.log('➕ Creando nuevo producto:', req.body.name);
  try {
    const { name, category_id, description, price_small, price_large, image, popular } = req.body;
    
    const result = db.prepare(`
      INSERT INTO menu_items (name, category_id, description, price_small, price_large, image, popular, available)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(name, category_id, description, price_small, price_large, image, popular || 0);
    
    console.log(`✅ Producto creado con ID: ${result.lastInsertRowid}`);
    res.json({ id: result.lastInsertRowid, message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Actualizar producto
app.put('/api/menu/:id', (req, res) => {
  console.log(`✏️ Actualizando producto ID: ${req.params.id}`);
  try {
    const { name, category_id, description, price_small, price_large, image, popular } = req.body;
    
    const result = db.prepare(`
      UPDATE menu_items 
      SET name = ?, category_id = ?, description = ?, price_small = ?, price_large = ?, image = ?, popular = ?
      WHERE id = ?
    `).run(name, category_id, description, price_small, price_large, image, popular || 0, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    console.log(`✅ Producto actualizado`);
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar producto (lógico)
app.delete('/api/menu/:id', (req, res) => {
  console.log(`🗑️ Eliminando producto ID: ${req.params.id}`);
  try {
    const result = db.prepare('UPDATE menu_items SET available = 0 WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    console.log(`✅ Producto eliminado lógicamente`);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Crear categoría
app.post('/api/menu/categories', (req, res) => {
  console.log('➕ Creando nueva categoría:', req.body.name);
  try {
    const { name, display_order } = req.body;
    
    const result = db.prepare('INSERT INTO categories (name, display_order) VALUES (?, ?)')
      .run(name, display_order || 999);
    
    console.log(`✅ Categoría creada con ID: ${result.lastInsertRowid}`);
    res.json({ id: result.lastInsertRowid, message: 'Categoría creada exitosamente' });
  } catch (error) {
    console.error('❌ Error creando categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// Actualizar categoría
app.put('/api/menu/categories/:id', (req, res) => {
  console.log(`✏️ Actualizando categoría ID: ${req.params.id}`);
  try {
    const { name, display_order } = req.body;
    
    const result = db.prepare('UPDATE categories SET name = ?, display_order = ? WHERE id = ?')
      .run(name, display_order, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    console.log(`✅ Categoría actualizada`);
    res.json({ message: 'Categoría actualizada exitosamente' });
  } catch (error) {
    console.error('❌ Error actualizando categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// Eliminar categoría
app.delete('/api/menu/categories/:id', (req, res) => {
  console.log(`🗑️ Eliminando categoría ID: ${req.params.id}`);
  try {
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    console.log(`✅ Categoría eliminada`);
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('❌ Error eliminando categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

// Iniciar servidor
const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`\n🔥 SERVIDOR CORRIENDO EN http://localhost:${PORT}`);
  console.log('📋 ENDPOINTS DISPONIBLES:');
  console.log('  🏥 GET  /api/health');
  console.log('  🍕 GET  /api/menu');
  console.log('  📂 GET  /api/menu/categories');
  console.log('  ➕ POST /api/menu');
  console.log('  ✏️ PUT  /api/menu/:id');
  console.log('  🗑️ DEL  /api/menu/:id');
  console.log('  ➕ POST /api/menu/categories');
  console.log('  ✏️ PUT  /api/menu/categories/:id');
  console.log('  🗑️ DEL  /api/menu/categories/:id');
  console.log('\n✅ SERVIDOR LISTO PARA GESTIÓN DE MENÚ');
});

server.on('error', (error) => {
  console.error('❌ Error del servidor:', error);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.close();
  server.close();
  process.exit(0);
});
