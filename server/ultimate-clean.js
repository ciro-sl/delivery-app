// ultimate-clean.js - Limpieza ULTIMATIVA de base de datos
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔥 LIMPIEZA ULTIMATIVA - ELIMINANDO TODO');

const dbPath = join(__dirname, 'delivery.db');

// Eliminar TODOS los archivos relacionados con la base de datos
const filesToDelete = [
  dbPath,
  dbPath + '-shm',
  dbPath + '-wal',
  dbPath + '-journal'
];

filesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`🗑️ Eliminado: ${file}`);
    }
  } catch (error) {
    console.log(`⚠️ No se pudo eliminar ${file}: ${error.message}`);
  }
});

// Crear base de datos completamente nueva desde cero
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

console.log('\n🔧 Creando base de datos ULTRA LIMPIA...');
const db = new Database(dbPath);

// Modo estricto para evitar duplicados
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = DELETE');
db.pragma('synchronous = FULL');

// Crear tablas con restricciones UNIQUE
db.exec(`
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER NOT NULL UNIQUE
  );
  
  CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category_id INTEGER NOT NULL,
    description TEXT,
    price_small INTEGER NOT NULL,
    price_large INTEGER,
    image TEXT,
    popular INTEGER DEFAULT 0,
    available INTEGER DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
  );
  
  CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password_hash TEXT NOT NULL
  );
`);

console.log('✅ Tablas creadas con restricciones UNIQUE');

// Insertar categorías (con verificación)
const categories = [
  { name: 'Pizzas', order: 1 },
  { name: 'Bebidas', order: 2 },
  { name: 'Combos', order: 3 },
  { name: 'Postres', order: 4 }
];

categories.forEach(cat => {
  try {
    db.prepare('INSERT INTO categories (name, display_order) VALUES (?, ?)').run(cat.name, cat.order);
    console.log(`✅ Categoría insertada: ${cat.name}`);
  } catch (error) {
    console.log(`⚠️ Categoría ya existe: ${cat.name}`);
  }
});

// Insertar productos (con verificación de duplicados)
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
  try {
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
    console.log(`✅ Producto insertado: ${product.name}`);
  } catch (error) {
    console.log(`❌ Error insertando ${product.name}: ${error.message}`);
  }
});

// Insertar admin
try {
  const passwordHash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO admins (password_hash) VALUES (?)').run(passwordHash);
  console.log('✅ Administrador creado');
} catch (error) {
  console.log('⚠️ Admin ya existe');
}

// Verificación FINAL
const finalCheck = db.prepare(`
  SELECT 
    (SELECT COUNT(*) FROM categories) as categories,
    (SELECT COUNT(*) FROM menu_items) as products,
    (SELECT COUNT(*) FROM (SELECT name FROM menu_items GROUP BY name HAVING COUNT(*) > 1)) as duplicates
`).get();

console.log('\n📊 VERIFICACIÓN FINAL:');
console.log(`  📂 Categorías: ${finalCheck.categories}`);
console.log(`  🍕 Productos: ${finalCheck.products}`);
console.log(`  ❌ Duplicados: ${finalCheck.duplicates}`);

if (finalCheck.duplicates === 0) {
  console.log('\n🎉 BASE DE DATOS PERFECTAMENTE LIMPIA');
} else {
  console.log('\n❌ AÚN HAY PROBLEMAS');
}

db.close();
console.log('\n✅ LIMPIEZA ULTIMATIVA COMPLETADA');
console.log('💡 Ahora ejecuta: node start-final.js');
