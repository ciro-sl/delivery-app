// server/check-password.js
import db from './database.js';
import bcrypt from 'bcrypt';

// Ver el hash almacenado
const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get('admin');
console.log('Hash almacenado:', admin?.password_hash);

// Probar contraseñas comunes
const testPasswords = ['admin123', 'admin', '123456', 'password'];

testPasswords.forEach(password => {
  const isValid = bcrypt.compareSync(password, admin?.password_hash);
  if (isValid) {
    console.log(`✅ ¡Contraseña encontrada! La contraseña es: "${password}"`);
  }
});

