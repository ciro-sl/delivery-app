// kill-server.js - Matar procesos en puerto 3001
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🔪 Buscando y matando procesos en puerto 3001...');

try {
  // Windows: encontrar procesos en puerto 3001
  const { stdout } = await execAsync('netstat -ano | findstr :3001');
  console.log('Procesos encontrados:', stdout);
  
  // Extraer PIDs y matarlos
  const lines = stdout.split('\n');
  for (const line of lines) {
    if (line.includes(':3001')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && pid !== 'PID') {
        console.log(`🔪 Matando proceso PID: ${pid}`);
        try {
          await execAsync(`taskkill /F /PID ${pid}`);
          console.log(`✅ Proceso ${pid} eliminado`);
        } catch (error) {
          console.log(`⚠️ No se pudo eliminar proceso ${pid}: ${error.message}`);
        }
      }
    }
  }
  
  console.log('\n✅ Limpieza de procesos completada');
} catch (error) {
  console.log('ℹ️ No se encontraron procesos en puerto 3001');
}
