import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'delivery.db'));

// better-sqlite3 ya es síncrono, no necesita promisify
// Mantenemos los métodos para compatibilidad con el código existente
db.getAsync = (sql, params = []) => {
  return db.prepare(sql).get(params);
};

db.allAsync = (sql, params = []) => {
  return db.prepare(sql).all(params);
};

db.runAsync = (sql, params = []) => {
  const result = db.prepare(sql).run(params);
  return Promise.resolve({ lastID: result.lastInsertRowid, changes: result.changes });
};

// Crear tablas
const initDB = async () => {
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      display_order INTEGER DEFAULT 0
    )
  `);
  
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category_id INTEGER,
      price_small INTEGER,
      price_large INTEGER,
      description TEXT,
      popular BOOLEAN DEFAULT 0,
      available BOOLEAN DEFAULT 1,
      FOREIGN KEY(category_id) REFERENCES categories(id)
    )
  `);
  
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      password_hash TEXT
    )
  `);
  
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      customer_phone TEXT,
      customer_address TEXT,
      total_amount INTEGER,
      payment_method TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      menu_item_id INTEGER,
      quantity INTEGER,
      unit_price INTEGER,
      size TEXT,
      notes TEXT,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(menu_item_id) REFERENCES menu_items(id)
    )
  `);
  
  // Insertar admin por defecto
  const admin = await db.getAsync('SELECT * FROM admins LIMIT 1');
  if (!admin) {
    const hash = bcrypt.hashSync('admin123', 10);
    await db.runAsync('INSERT INTO admins (password_hash) VALUES (?)', [hash]);
  }
  
  console.log('✅ Base de datos SQLite inicializada');
};

initDB().catch(console.error);

export default db;