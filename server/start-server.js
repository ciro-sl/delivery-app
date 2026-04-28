// start-server.js - Script para iniciar el servidor con mejor manejo de errores
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Iniciando servidor del delivery app...');

const serverProcess = spawn('node', ['index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (error) => {
  console.error('❌ Error al iniciar el servidor:', error);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`📋 Servidor terminado con código ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});

// Manejar la terminación del proceso
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo el servidor...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deteniendo el servidor...');
  serverProcess.kill('SIGTERM');
});
