// check-server.js - Verificar qué servidor está corriendo
import http from 'http';

const checkServer = () => {
  console.log('🔍 Verificando si hay un servidor corriendo...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET',
    timeout: 2000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Servidor responde - Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const health = JSON.parse(data);
        console.log('📋 Respuesta de salud:', health);
        
        // Ahora probar el menú
        checkMenu();
      } catch (error) {
        console.error('❌ Error parseando respuesta:', error);
        process.exit(1);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ No hay servidor corriendo en http://localhost:3001');
    console.error('Error:', err.message);
    console.log('\n💡 Ejecuta: node start-server-manual.js');
    process.exit(1);
  });

  req.on('timeout', () => {
    console.error('❌ Timeout - el servidor no responde');
    req.destroy();
    process.exit(1);
  });

  req.end();
};

const checkMenu = () => {
  console.log('\n🍕 Verificando endpoint /api/menu...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/menu',
    method: 'GET',
    timeout: 2000
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const menu = JSON.parse(data);
        console.log(`📊 Productos recibidos: ${menu.length}`);
        
        // Mostrar primeros productos
        console.log('\n📋 Productos:');
        menu.slice(0, 5).forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.name} (ID: ${item.id})`);
        });
        
        if (menu.length > 5) {
          console.log(`  ... y ${menu.length - 5} más`);
        }
        
        // Verificar duplicados
        const names = menu.map(item => item.name);
        const uniqueNames = [...new Set(names)];
        
        if (names.length !== uniqueNames.length) {
          console.log('\n❌ HAY DUPLICADOS');
          const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
          console.log('Productos duplicados:', [...new Set(duplicates)]);
        } else {
          console.log('\n✅ NO HAY DUPLICADOS');
        }
        
        console.log('\n🎯 VERIFICACIÓN COMPLETADA');
        
      } catch (error) {
        console.error('❌ Error parseando menú:', error);
      }
      
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error en /api/menu:', err.message);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.error('❌ Timeout en /api/menu');
    req.destroy();
    process.exit(1);
  });

  req.end();
};

checkServer();
