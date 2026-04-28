// test-simple.js - Prueba simple del servidor
import http from 'http';

const testServer = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });

  req.setTimeout(5000, () => {
    console.error('Timeout - servidor no responde');
    req.destroy();
    process.exit(1);
  });

  req.end();
};

testServer();
