// test-api-endpoint.js - Probar directamente el endpoint del menú
import http from 'http';

const testMenuEndpoint = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/menu',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        console.log(`\n📊 Respuesta del servidor:`);
        console.log(`- Cantidad de productos: ${parsedData.length}`);
        console.log(`- Productos recibidos:`);
        
        parsedData.forEach((item, index) => {
          console.log(`  ${index + 1}. ID: ${item.id}, Nombre: "${item.name}", Categoría: ${item.category_name}`);
        });
        
        // Verificar duplicados
        const names = parsedData.map(item => item.name);
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
        
        if (duplicates.length > 0) {
          console.log(`\n⚠️ DUPLICADOS ENCONTRADOS: ${duplicates.join(', ')}`);
        } else {
          console.log(`\n✅ No hay duplicados en la respuesta del servidor`);
        }
        
      } catch (error) {
        console.error('Error parseando JSON:', error);
        console.log('Respuesta cruda:', data);
      }
      
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error de conexión:', err.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo en http://localhost:3001');
    process.exit(1);
  });

  req.setTimeout(5000, () => {
    console.error('❌ Timeout - el servidor no responde');
    req.destroy();
    process.exit(1);
  });

  req.end();
};

console.log('🧪 Probando endpoint /api/menu...');
testMenuEndpoint();
