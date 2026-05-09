// server/models/AuthModel.js
import bcrypt from 'bcryptjs';
import db from '../database.js';

class AuthModel {
  // Verificar usuario y contraseña
  static async verifyAdmin(username, password) {
    try {
      const admin = await db.getAsync('SELECT password_hash FROM admins WHERE username = ?', [username]);

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

  // Cambiar credenciales
  static async changeCredentials(currentUsername, currentPassword, newUsername, newPassword, accessKey) {
    if (accessKey !== '2005') {
      throw new Error('Clave de acceso incorrecta');
    }

    const isValid = await this.verifyAdmin(currentUsername, currentPassword);
    if (!isValid) {
      throw new Error('Credenciales actuales incorrectas');
    }

    const passwordHash = bcrypt.hashSync(newPassword, 10);
    await db.runAsync('UPDATE admins SET username = ?, password_hash = ? WHERE username = ?', [newUsername, passwordHash, currentUsername]);
    return true;
  }
}

export default AuthModel;