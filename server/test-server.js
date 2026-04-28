// test-server.js - Script para probar si el servidor funciona
import http from 'http';

const testEndpoint = (port, endpoint) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: endpoint,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
};

const testServer = async () => {
  const ports = [3001, 3002, 3003, 3004, 3005];
  
  for (const port of ports) {
    try {
      console.log(`🔍 Probando servidor en puerto ${port}...`);
      const result = await testEndpoint(port, '/api/health');
      if (result.status === 200) {
        console.log(`✅ Servidor funcionando en puerto ${port}`);
        console.log(`📋 Respuesta: ${result.data}`);
        
        // Probar endpoint de menú
        try {
          const menuResult = await testEndpoint(port, '/api/menu');
          console.log(`🍕 Menú cargado: ${menuResult.status}`);
        } catch (err) {
          console.log(`⚠️ Error al cargar menú: ${err.message}`);
        }
        
        return port;
      }
    } catch (err) {
      console.log(`❌ Puerto ${port} no disponible: ${err.message}`);
    }
  }
  
  console.log('❌ No se encontró el servidor en ningún puerto');
  return null;
};

testServer().then(port => {
  if (port) {
    console.log(`\n🎉 Servidor encontrado y funcionando en http://localhost:${port}`);
  } else {
    console.log('\n💡 El servidor no está corriendo. Por favor inicia el servidor primero.');
  }
}).catch(err => {
  console.error('Error al probar servidor:', err);
});
