// server/models/AuthModel.js
import bcrypt from 'bcryptjs';
import db from '../database.js';

class AuthModel {
  // Verificar contraseña
  static async verifyAdmin(password) {
    try {
      const admin = await db.getAsync('SELECT password_hash FROM admins LIMIT 1');
      
      if (!admin || !admin.password_hash) {
        console.log('No se encontró admin o hash');
        return false;
      }
      
      return bcrypt.compareSync(password, admin.password_hash);
    } catch (error) {
      console.error('Error en verifyAdmin:', error);
      return false;
    }
  }
  
  // Cambiar contraseña
  static async changePassword(newPassword) {
    const passwordHash = bcrypt.hashSync(newPassword, 10);
    await db.runAsync('UPDATE admins SET password_hash = ?', [passwordHash]);
    return true;
  }
}

export default AuthModel;