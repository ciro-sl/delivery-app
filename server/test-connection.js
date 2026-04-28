// test-connection.js - Probar conexión completa entre frontend y servidor
import http from 'http';

console.log('🔍 PROBANDO CONEXIÓN COMPLETA FRONTEND-SERVIDOR');

const testEndpoint = (path, description) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      timeout: 3000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ 
            success: true, 
            status: res.statusCode, 
            data: parsed,
            message: `${description}: OK (${res.statusCode})`
          });
        } catch (error) {
          resolve({ 
            success: false, 
            status: res.statusCode,
            data: data,
            message: `${description}: Error parseando JSON`
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ 
        success: false, 
        message: `${description}: ${error.message}` 
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ 
        success: false, 
        message: `${description}: Timeout` 
      });
    });

    req.end();
  });
};

const main = async () => {
  console.log('\n📋 Probando endpoints críticos para gestión de menú...\n');

  // Probar health
  const health = await testEndpoint('/api/health', 'Health check');
  console.log(health.message);

  // Probar menú
  const menu = await testEndpoint('/api/menu', 'Obtener menú');
  console.log(menu.message);
  if (menu.success) {
    console.log(`   📊 Productos: ${menu.data.length}`);
    
    // Verificar estructura de datos
    if (menu.data.length > 0) {
      const firstItem = menu.data[0];
      console.log(`   🔍 Primer producto: ${firstItem.name} (ID: ${firstItem.id})`);
      console.log(`   📋 Campos: ${Object.keys(firstItem).join(', ')}`);
    }
  }

  // Probar categorías
  const categories = await testEndpoint('/api/menu/categories', 'Obtener categorías');
  console.log(categories.message);
  if (categories.success) {
    console.log(`   📂 Categorías: ${categories.data.length}`);
    console.log(`   📋 Lista: ${categories.data.map(c => c.name).join(', ')}`);
  }

  console.log('\n🎯 ANÁLISIS:');
  
  if (health.success && menu.success && categories.success) {
    console.log('✅ Todos los endpoints funcionan');
    console.log('💡 El problema está en el frontend');
    console.log('🔧 Revisa:');
    console.log('   - MenuContext está cargando datos');
    console.log('   - MenuManagement está recibiendo props');
    console.log('   - No hay errores de JavaScript en consola');
  } else {
    console.log('❌ Hay problemas con el servidor');
    console.log('🔧 Revisa:');
    console.log('   - El servidor está corriendo');
    console.log('   - El puerto 3001 está libre');
    console.log('   - Los endpoints responden correctamente');
  }

  console.log('\n📝 ACCIONES RECOMENDADAS:');
  console.log('1. Abre http://localhost:5173/admin');
  console.log('2. Abre la consola del navegador (F12)');
  console.log('3. Revisa si hay errores en la pestaña Console');
  console.log('4. Revisa si hay errores en la pestaña Network');
  console.log('5. Recarga la página (F5)');
};

main().catch(console.error);
