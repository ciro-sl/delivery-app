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

  // Crear tabla menu_items sin la columna image primero
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

  // Migración: Agregar columna image si no existe
  try {
    // Verificar si la columna image existe
    const tableInfo = await db.allAsync("PRAGMA table_info(menu_items)");
    const hasImageColumn = tableInfo.some(column => column.name === 'image');

    if (!hasImageColumn) {
      console.log('🔄 Agregando columna image a menu_items...');
      await db.runAsync(`ALTER TABLE menu_items ADD COLUMN image TEXT`);
      console.log('✅ Columna image agregada exitosamente');
    } else {
      console.log('ℹ️ Columna image ya existe');
    }
  } catch (error) {
    console.error('❌ Error en migración de columna image:', error.message);
    // Si ALTER TABLE falla, intentar recrear la tabla
    console.log('🔄 Intentando recrear tabla con estructura completa...');
    try {
      // Hacer backup de los datos existentes
      const existingData = await db.allAsync('SELECT * FROM menu_items');

      // Recrear tabla con estructura completa
      await db.runAsync('DROP TABLE IF EXISTS menu_items');
      await db.runAsync(`
        CREATE TABLE menu_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          category_id INTEGER,
          price_small INTEGER,
          price_medium INTEGER,
          price_large INTEGER,
          description TEXT,
          image TEXT,
          popular BOOLEAN DEFAULT 0,
          available BOOLEAN DEFAULT 1,
          FOREIGN KEY(category_id) REFERENCES categories(id)
        )
      `);

      // Restaurar datos
      if (existingData.length > 0) {
        const insertStmt = db.prepare(`
          INSERT INTO menu_items (id, name, category_id, price_small, price_large, description, popular, available)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const item of existingData) {
          insertStmt.run(
            item.id,
            item.name,
            item.category_id,
            item.price_small,
            item.price_large,
            item.description,
            item.popular,
            item.available
          );
        }
        console.log(`✅ Restaurados ${existingData.length} registros`);
      }

      console.log('✅ Tabla menu_items recreada con columna image');
    } catch (recreateError) {
      console.error('❌ Error al recrear tabla:', recreateError.message);
    }
  }
  
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    )
  `);

  // Migración: Agregar columna username si no existe
  try {
    const tableInfo = await db.allAsync("PRAGMA table_info(admins)");
    const hasUsernameColumn = tableInfo.some(column => column.name === 'username');

    if (!hasUsernameColumn) {
      console.log('🔄 Agregando columna username a admins...');
      await db.runAsync('ALTER TABLE admins ADD COLUMN username TEXT UNIQUE');
      console.log('✅ Columna username agregada exitosamente');

      // Actualizar el registro existente con username 'admin'
      await db.runAsync("UPDATE admins SET username = 'admin' WHERE id = 1");
      console.log('✅ Username actualizado para registro existente');
    } else {
      console.log('ℹ️ Columna username ya existe');
    }
  } catch (error) {
    console.error('❌ Error en migración de columna username:', error.message);
  }

  // Migración: Agregar columna price_medium si no existe
  try {
    const tableInfo = await db.allAsync("PRAGMA table_info(menu_items)");
    const hasPriceMediumColumn = tableInfo.some(column => column.name === 'price_medium');

    if (!hasPriceMediumColumn) {
      console.log('🔄 Agregando columna price_medium a menu_items...');
      await db.runAsync('ALTER TABLE menu_items ADD COLUMN price_medium INTEGER');
      console.log('✅ Columna price_medium agregada exitosamente');
    } else {
      console.log('ℹ️ Columna price_medium ya existe');
    }
  } catch (error) {
    console.error('❌ Error en migración de columna price_medium:', error.message);
  }
  
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT,
      customer_phone TEXT,
      customer_address TEXT,
      total_amount INTEGER,
      payment_method TEXT,
      status TEXT DEFAULT 'En preparación',
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
    const hash = bcrypt.hashSync('Admin123*', 10);
    await db.runAsync('INSERT INTO admins (username, password_hash) VALUES (?, ?)', ['admin', hash]);
  }
  
  console.log('✅ Base de datos SQLite inicializada');
};

export { db, initDB };

export default db;