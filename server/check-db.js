// check-db.js - Verificar el estado actual de la base de datos
import db from './database.js';

console.log('🔍 Verificando estado de la base de datos...\n');

try {
  // Verificar categorías
  const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
  console.log(`📂 Categorías (${categories.length}):`);
  categories.forEach(cat => {
    console.log(`  - ID: ${cat.id}, Nombre: "${cat.name}", Orden: ${cat.display_order}`);
  });
  
  // Verificar productos
  const menuItems = db.prepare('SELECT * FROM menu_items ORDER BY id').all();
  console.log(`\n🍕 Productos (${menuItems.length}):`);
  menuItems.forEach(item => {
    console.log(`  - ID: ${item.id}, Nombre: "${item.name}", Categoría: ${item.category_id}, Disponible: ${item.available}`);
  });
  
  // Verificar duplicados
  const duplicateNames = db.prepare(`
    SELECT name, COUNT(*) as count 
    FROM menu_items 
    GROUP BY name 
    HAVING COUNT(*) > 1
  `).all();
  
  if (duplicateNames.length > 0) {
    console.log(`\n⚠️ Productos duplicados encontrados:`);
    duplicateNames.forEach(dup => {
      console.log(`  - "${dup.name}" aparece ${dup.count} veces`);
    });
  } else {
    console.log(`\n✅ No hay productos duplicados`);
  }
  
  // Verificar administradores
  const admins = db.prepare('SELECT * FROM admins').all();
  console.log(`\n👤 Administradores (${admins.length}):`);
  admins.forEach(admin => {
    console.log(`  - ID: ${admin.id}, Password hash: ${admin.password_hash ? 'Sí' : 'No'}`);
  });
  
  console.log('\n📊 Estadísticas:');
  console.log(`  - Total categorías: ${categories.length}`);
  console.log(`  - Total productos: ${menuItems.length}`);
  console.log(`  - Productos disponibles: ${menuItems.filter(item => item.available === 1).length}`);
  console.log(`  - Productos no disponibles: ${menuItems.filter(item => item.available === 0).length}`);
  
} catch (error) {
  console.error('❌ Error al verificar base de datos:', error);
}

process.exit(0);
