// test-endpoints.js - Script para probar todos los endpoints del servidor
import http from 'http';

const makeRequest = (method, path, data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseBody
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

const testAllEndpoints = async () => {
  console.log('🧪 Probando endpoints del servidor...\n');

  try {
    // 1. Health check
    console.log('1. Health Check:');
    const health = await makeRequest('GET', '/api/health');
    console.log(`   Status: ${health.statusCode}`);
    console.log(`   Body: ${health.body}\n`);

    // 2. Obtener menú
    console.log('2. Obtener Menú:');
    const menu = await makeRequest('GET', '/api/menu');
    console.log(`   Status: ${menu.statusCode}`);
    console.log(`   Cantidad de items: ${JSON.parse(menu.body).length}\n`);

    // 3. Obtener categorías
    console.log('3. Obtener Categorías:');
    const categories = await makeRequest('GET', '/api/menu/categories');
    console.log(`   Status: ${categories.statusCode}`);
    console.log(`   Categorías: ${JSON.parse(categories.body).map(c => c.name).join(', ')}\n`);

    // 4. Crear nueva categoría
    console.log('4. Crear Nueva Categoría:');
    const newCategory = {
      name: 'Test Category ' + Date.now(),
      display_order: 99
    };
    const createCategory = await makeRequest('POST', '/api/menu/categories', newCategory);
    console.log(`   Status: ${createCategory.statusCode}`);
    if (createCategory.statusCode === 201) {
      const createdCat = JSON.parse(createCategory.body);
      console.log(`   Categoría creada: ID ${createdCat.id}, Nombre: ${createdCat.name}\n`);
      
      // 5. Crear nuevo producto
      console.log('5. Crear Nuevo Producto:');
      const newProduct = {
        name: 'Test Product ' + Date.now(),
        category_id: createdCat.id,
        price_small: 10000,
        price_large: 15000,
        description: 'Producto de prueba',
        popular: 0,
        available: 1
      };
      const createProduct = await makeRequest('POST', '/api/menu', newProduct);
      console.log(`   Status: ${createProduct.statusCode}`);
      if (createProduct.statusCode === 201) {
        const createdProd = JSON.parse(createProduct.body);
        console.log(`   Producto creado: ID ${createdProd.id}, Nombre: ${createdProd.name}\n`);

        // 6. Verificar que el producto está en el menú
        console.log('6. Verificar Producto en Menú:');
        const updatedMenu = await makeRequest('GET', '/api/menu');
        const menuItems = JSON.parse(updatedMenu.body);
        const foundProduct = menuItems.find(item => item.id === createdProd.id);
        console.log(`   Producto encontrado: ${foundProduct ? 'SÍ' : 'NO'}`);
        if (foundProduct) {
          console.log(`   Nombre: ${foundProduct.name}, Precio: ${foundProduct.price_small}\n`);
        }

        // 7. Actualizar producto
        console.log('7. Actualizar Producto:');
        const updateData = {
          name: 'Test Product Updated ' + Date.now(),
          price_small: 12000,
          description: 'Producto actualizado'
        };
        const updateProduct = await makeRequest('PUT', `/api/menu/${createdProd.id}`, updateData);
        console.log(`   Status: ${updateProduct.statusCode}`);
        if (updateProduct.statusCode === 200) {
          const updatedProd = JSON.parse(updateProduct.body);
          console.log(`   Producto actualizado: ${updatedProd.name}, Precio: ${updatedProd.price_small}\n`);
        }

        // 8. Eliminar producto (borrado lógico)
        console.log('8. Eliminar Producto:');
        const deleteProduct = await makeRequest('DELETE', `/api/menu/${createdProd.id}`);
        console.log(`   Status: ${deleteProduct.statusCode}\n`);
      }
    }

    console.log('✅ Pruebas completadas');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo en http://localhost:3001');
  }
};

testAllEndpoints();
