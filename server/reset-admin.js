// Script para resetear la contraseña del admin
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('./delivery.db');

console.log('Reseteando contraseña del admin...');

// Verificar si existe la tabla admins
const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='admins'").get();
if (!tableExists) {
  console.log('Creando tabla admins...');
  db.exec(`
    CREATE TABLE admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    )
  `);
}

// Verificar si existe la columna username
const tableInfo = db.prepare("PRAGMA table_info(admins)").all();
const hasUsername = tableInfo.some(col => col.name === 'username');

if (!hasUsername) {
  console.log('Recreando tabla admins con username...');
  // Hacer backup de datos existentes
  const existingData = db.prepare('SELECT * FROM admins').all();

  // Recrear tabla
  db.exec('DROP TABLE admins');
  db.exec(`
    CREATE TABLE admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT
    )
  `);

  // Restaurar datos si existían
  if (existingData.length > 0) {
    const insertStmt = db.prepare('INSERT INTO admins (password_hash) VALUES (?)');
    for (const admin of existingData) {
      insertStmt.run(admin.password_hash);
    }
  }
}

// Actualizar o insertar admin
const hash = bcrypt.hashSync('Admin123*', 10);
const existingAdmin = db.prepare('SELECT id FROM admins WHERE username = ?').get('admin');

if (existingAdmin) {
  console.log('Actualizando contraseña del admin existente...');
  db.prepare('UPDATE admins SET password_hash = ? WHERE username = ?').run(hash, 'admin');
} else {
  console.log('Insertando nuevo admin...');
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('admin', hash);
}

console.log('✅ Contraseña reseteada. Usuario: admin, Contraseña: Admin123*');

db.close();