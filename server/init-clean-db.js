// init-clean-db.js - Crear base de datos limpia con datos iniciales
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Creando base de datos limpia...');

const dbPath = join(__dirname, 'delivery.db');

// Eliminar base de datos si existe
import fs from 'fs';
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️ Base de datos antigua eliminada');
}

// Crear nueva base de datos
const db = new Database(dbPath);
console.log('✅ Nueva base de datos creada');

// Crear tablas
console.log('📋 Creando tablas...');

// Categorías
db.exec(`
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER NOT NULL
  )
`);

// Menu items
db.exec(`
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
  )
`);

// Admins
db.exec(`
  CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password_hash TEXT NOT NULL
  )
`);

// Insertar categorías
console.log('📂 Insertando categorías...');
const categories = [
  { name: 'Pizzas', display_order: 1 },
  { name: 'Bebidas', display_order: 2 },
  { name: 'Combos', display_order: 3 },
  { name: 'Postres', display_order: 4 }
];

const insertCategory = db.prepare('INSERT INTO categories (name, display_order) VALUES (?, ?)');
categories.forEach(cat => {
  insertCategory.run(cat.name, cat.display_order);
  console.log(`  ✅ Categoría: ${cat.name}`);
});

// Insertar productos (sin duplicados)
console.log('🍕 Insertando productos...');
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
    name: 'Gaseosa 500ml',
    category_id: 2,
    description: 'Bebida gaseosa refrescante.',
    price_small: 3000,
    price_large: null,
    popular: 0,
    available: 1
  },
  {
    name: 'Agua 500ml',
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
    name: 'Brownie Chocolate',
    category_id: 4,
    description: 'Brownie de chocolate con helado de vainilla.',
    price_small: 8000,
    price_large: null,
    popular: 0,
    available: 1
  }
];

const insertProduct = db.prepare(`
  INSERT INTO menu_items (name, category_id, description, price_small, price_large, popular, available)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

products.forEach(product => {
  insertProduct.run(
    product.name,
    product.category_id,
    product.description,
    product.price_small,
    product.price_large,
    product.popular,
    product.available
  );
  console.log(`  ✅ Producto: ${product.name}`);
});

// Insertar administrador
console.log('👤 Insertando administrador...');
const passwordHash = bcrypt.hashSync('admin123', 10);
db.prepare('INSERT INTO admins (password_hash) VALUES (?)').run(passwordHash);
console.log('  ✅ Administrador creado (admin/admin123)');

// Verificar datos
console.log('\n📊 Verificación final:');
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get();
const productCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get();
const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();

console.log(`  📂 Categorías: ${categoryCount.count}`);
console.log(`  🍕 Productos: ${productCount.count}`);
console.log(`  👤 Administradores: ${adminCount.count}`);

// Verificar duplicados
const duplicates = db.prepare(`
  SELECT name, COUNT(*) as count 
  FROM menu_items 
  GROUP BY name 
  HAVING COUNT(*) > 1
`).all();

if (duplicates.length === 0) {
  console.log('  ✅ No hay duplicados');
} else {
  console.log('  ❌ Hay duplicados:', duplicates);
}

db.close();
console.log('\n🎉 Base de datos creada exitosamente!');
console.log('💡 Ahora ejecuta: node start-server-manual.js');
