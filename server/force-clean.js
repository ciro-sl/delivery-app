// force-clean.js - Limpieza forzada de la base de datos
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔥 LIMPIEZA FORZADA DE BASE DE DATOS');

const dbPath = join(__dirname, 'delivery.db');

// Eliminar base de datos de forma agresiva
try {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Base de datos eliminada');
  }
  
  // También eliminar cualquier archivo .db-shm o .db-wal
  const shmPath = dbPath + '-shm';
  const walPath = dbPath + '-wal';
  
  if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);
  if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
  
  console.log('🗑️ Todos los archivos de BD eliminados');
} catch (error) {
  console.error('❌ Error eliminando BD:', error);
}

// Crear base de datos completamente nueva
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database(dbPath);
console.log('✅ Nueva base de datos creada');

// Crear tablas
db.exec(`
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER NOT NULL
  );
  
  CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    description TEXT,
    price_small INTEGER NOT NULL,
    price_large INTEGER,
    image TEXT,
    popular INTEGER DEFAULT 0,
    available INTEGER DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );
  
  CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password_hash TEXT NOT NULL
  );
`);

console.log('📋 Tablas creadas');

// Insertar categorías únicas
const categories = [
  { name: 'Pizzas', order: 1 },
  { name: 'Bebidas', order: 2 },
  { name: 'Combos', order: 3 },
  { name: 'Postres', order: 4 }
];

categories.forEach(cat => {
  db.prepare('INSERT INTO categories (name, display_order) VALUES (?, ?)').run(cat.name, cat.order);
});

// Insertar productos únicos (SIN DUPLICADOS)
const products = [
  {
    name: 'Pizza Margarita',
    category_id: 1,
    description: 'Salsa de tomate, mozzarella y albahaca fresca.',
    price_small: 12000,
    price_large: 18000,
    popular: 1,
    available: 1
  },
  {
    name: 'Pizza Pepperoni',
    category_id: 1,
    description: 'Pepperoni crujiente, queso fundido y salsa especial.',
    price_small: 14000,
    price_large: 20000,
    popular: 1,
    available: 1
  },
  {
    name: 'Pizza Hawaiana',
    category_id: 1,
    description: 'Jamón, piña, queso mozzarella y salsa de tomate.',
    price_small: 13000,
    price_large: 19000,
    popular: 0,
    available: 1
  },
  {
    name: 'Coca-Cola 500ml',
    category_id: 2,
    description: 'Bebida gaseosa refrescante.',
    price_small: 3000,
    price_large: null,
    popular: 0,
    available: 1
  },
  {
    name: 'Agua Mineral 500ml',
    category_id: 2,
    description: 'Agua mineral sin gas.',
    price_small: 2000,
    price_large: null,
    popular: 0,
    available: 1
  },
  {
    name: 'Combo Nocturno',
    category_id: 3,
    description: 'Pizza mediana + gaseosa + papas fritas.',
    price_small: 25000,
    price_large: null,
    popular: 1,
    available: 1
  },
  {
    name: 'Combo Familiar',
    category_id: 3,
    description: 'Pizza grande + 2 gaseosas + ensalada.',
    price_small: 35000,
    price_large: null,
    popular: 0,
    available: 1
  },
  {
    name: 'Brownie con Helado',
    category_id: 4,
    description: 'Brownie de chocolate con helado de vainilla.',
    price_small: 8000,
    price_large: null,
    popular: 0,
    available: 1
  }
];

products.forEach(product => {
  db.prepare(`
    INSERT INTO menu_items (name, category_id, description, price_small, price_large, popular, available)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    product.name,
    product.category_id,
    product.description,
    product.price_small,
    product.price_large,
    product.popular,
    product.available
  );
});

// Insertar admin
const passwordHash = bcrypt.hashSync('admin123', 10);
db.prepare('INSERT INTO admins (password_hash) VALUES (?)').run(passwordHash);

// Verificación final
const productCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get();
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
const duplicates = db.prepare(`
  SELECT name, COUNT(*) as count 
  FROM menu_items 
  GROUP BY name 
  HAVING COUNT(*) > 1
`).all();

console.log('\n📊 RESULTADO FINAL:');
console.log(`  📂 Categorías: ${categoryCount.count}`);
console.log(`  🍕 Productos: ${productCount.count}`);
console.log(`  ❌ Duplicados: ${duplicates.length}`);

if (duplicates.length === 0) {
  console.log('  ✅ BASE DE DATOS LIMPIA CREADA');
} else {
  console.log('  ❌ AÚN HAY DUPLICADOS:', duplicates);
}

db.close();
console.log('\n🎉 LIMPIEZA COMPLETADA');
console.log('💡 Ahora ejecuta: node start-server-manual.js');
