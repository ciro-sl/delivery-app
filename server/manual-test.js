// manual-test.js - Prueba manual con salida visible
console.log('🚀 INICIANDO PRUEBA MANUAL COMPLETA');

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Verificar estado actual
const dbPath = join(__dirname, 'delivery.db');

console.log('\n📊 VERIFICANDO ESTADO ACTUAL:');

// 1. Verificar si existe base de datos
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  console.log(`✅ Base de datos existe: ${dbPath}`);
  console.log(`📅 Tamaño: ${stats.size} bytes`);
  console.log(`📅 Modificada: ${stats.mtime}`);
} else {
  console.log('❌ Base de datos NO existe');
}

// 2. Verificar si hay servidor corriendo (simple)
import http from 'http';

const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ running: true, status: res.statusCode, data });
      });
    });

    req.on('error', () => {
      resolve({ running: false, error: 'No hay servidor' });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ running: false, error: 'Timeout' });
    });

    req.end();
  });
};

console.log('\n🔍 VERIFICANDO SERVIDOR:');
const serverStatus = await checkServer();

if (serverStatus.running) {
  console.log('✅ Servidor corriendo');
  console.log(`📊 Status: ${serverStatus.status}`);
  console.log(`📋 Respuesta: ${serverStatus.data}`);
} else {
  console.log('❌ Servidor no corriendo');
  console.log(`🔍 Error: ${serverStatus.error}`);
}

// 3. Si hay servidor, verificar menú
if (serverStatus.running) {
  console.log('\n🍕 VERIFICANDO MENÚ:');
  
  const checkMenu = () => {
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3001,
        path: '/api/menu',
        method: 'GET',
        timeout: 2000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const menu = JSON.parse(data);
            resolve({ success: true, count: menu.length, data: menu });
          } catch (error) {
            resolve({ success: false, error: 'JSON parse error' });
          }
        });
      });

      req.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: 'Timeout' });
      });

      req.end();
    });
  };

  const menuStatus = await checkMenu();
  
  if (menuStatus.success) {
    console.log(`✅ Menú obtenido: ${menuStatus.count} productos`);
    
    // Verificar duplicados
    const names = menuStatus.data.map(item => item.name);
    const uniqueNames = [...new Set(names)];
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    
    if (duplicates.length > 0) {
      console.log(`❌ DUPLICADOS ENCONTRADOS: ${[...new Set(duplicates)].join(', ')}`);
      console.log(`📊 Total: ${menuStatus.count}, Únicos: ${uniqueNames.length}`);
    } else {
      console.log('✅ NO HAY DUPLICADOS');
      console.log(`📊 Total productos: ${menuStatus.count}`);
      
      // Mostrar primeros productos
      console.log('\n📋 Productos:');
      menuStatus.data.slice(0, 5).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name} (ID: ${item.id})`);
      });
    }
  } else {
    console.log(`❌ Error obteniendo menú: ${menuStatus.error}`);
  }
}

console.log('\n🎯 RESULTADO FINAL:');
if (serverStatus.running) {
  console.log('✅ Servidor funcionando');
  console.log('💡 Ejecuta: npm run dev para probar frontend');
} else {
  console.log('❌ Servidor no funcionando');
  console.log('💡 Ejecuta: node start-final.js');
}

console.log('\n🔧 ACCIONES RECOMENDADAS:');
if (!fs.existsSync(dbPath)) {
  console.log('1. node ultimate-clean.js - Crear base de datos');
}
if (!serverStatus.running) {
  console.log('2. node start-final.js - Iniciar servidor');
}
if (serverStatus.running) {
  console.log('3. npm run dev - Probar frontend');
  console.log('4. Abrir http://localhost:5173/admin');
  console.log('5. Probar gestión de menú');
}
