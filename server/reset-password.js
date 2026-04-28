// server/reset-password.js
import db from './database.js';
import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=== RESETEO DE CONTRASEÑA ADMIN ===\n');

rl.question('Ingresa la NUEVA contraseña (mínimo 4 caracteres): ', (newPassword) => {
  if (!newPassword || newPassword.length < 4) {
    console.log('\n❌ La contraseña debe tener al menos 4 caracteres\n');
    rl.close();
    return;
  }
  
  const passwordHash = bcrypt.hashSync(newPassword, 10);
  
  // Verificar si existe admin
  const adminExists = db.prepare('SELECT COUNT(*) as count FROM admins').get();
  
  if (adminExists.count === 0) {
    // Crear admin si no existe
    db.prepare('INSERT INTO admins (password_hash) VALUES (?)').run(passwordHash);
    console.log(`\n✅ Admin creado con contraseña: "${newPassword}"`);
  } else {
    // Actualizar contraseña
    db.prepare('UPDATE admins SET password_hash = ?').run(passwordHash);
    console.log(`\n✅ Contraseña actualizada a: "${newPassword}"`);
  }
  
  // Verificar que funciona
  const stored = db.prepare('SELECT password_hash FROM admins LIMIT 1').get();
  const testValid = bcrypt.compareSync(newPassword, stored.password_hash);
  
  if (testValid) {
    console.log('✅ La nueva contraseña funciona correctamente\n');
  } else {
    console.log('❌ Error: la contraseña no se guardó correctamente\n');
  }
  
  rl.close();
});