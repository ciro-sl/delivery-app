// start-server-manual.js - Iniciar servidor con logging detallado
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Iniciando servidor manual...');

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a base de datos
const dbPath = join(__dirname, 'delivery.db');
console.log(`📁 Base de datos: ${dbPath}`);

let db;
try {
  db = new Database(dbPath);
  console.log('✅ Base de datos conectada');
} catch (error) {
  console.error('❌ Error conectando a base de datos:', error);
  process.exit(1);
}

// Endpoint de salud
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check solicitado');
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Endpoint del menú
app.get('/api/menu', (req, res) => {
  console.log('🍕 Solicitando menú...');
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

// Endpoint de categorías
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

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
  console.log('📋 Endpoints disponibles:');
  console.log('  - GET /api/health');
  console.log('  - GET /api/menu');
  console.log('  - GET /api/menu/categories');
  console.log('\n✅ Servidor listo para recibir peticiones');
});

// Manejar errores
app.on('error', (error) => {
  console.error('❌ Error del servidor:', error);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.close();
  process.exit(0);
});
