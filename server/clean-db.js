// clean-db.js - Limpiar base de datos de duplicados y reiniciar
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'delivery.db');

console.log('🧹 Limpiando base de datos...');

try {
  // Eliminar archivo de base de datos existente
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Base de datos antigua eliminada');
  } else {
    console.log('ℹ️ No existía base de datos anterior');
  }

  console.log('🔄 La base de datos se creará automáticamente al iniciar el servidor');
  console.log('💡 Ejecuta: node index.js para recrear la base de datos limpia');

} catch (error) {
  console.error('❌ Error al limpiar base de datos:', error);
}

console.log('\n📋 Siguientes pasos:');
console.log('1. Inicia el servidor: node index.js');
console.log('2. El servidor creará una base de datos limpia');
console.log('3. Se insertarán los datos iniciales automáticamente');
console.log('4. Verifica que no haya duplicados');
