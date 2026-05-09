// Script para resetear la contraseña del admin
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'delivery.db'));

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
  console.log('Agregando columna username...');
  db.exec('ALTER TABLE admins ADD COLUMN username TEXT UNIQUE');
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