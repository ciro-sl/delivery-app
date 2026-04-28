// seed-data.js - Script para agregar datos iniciales a la base de datos
import db from './database.js';

const seedData = () => {
  console.log('🌱 Agregando datos iniciales...');

  // Insertar categorías si no existen
  const categories = [
    { name: 'Pizzas', display_order: 1 },
    { name: 'Bebidas', display_order: 2 },
    { name: 'Combos', display_order: 3 },
    { name: 'Postres', display_order: 4 }
  ];

  categories.forEach(cat => {
    try {
      const existing = db.prepare('SELECT * FROM categories WHERE name = ?').get(cat.name);
      if (!existing) {
        db.prepare('INSERT INTO categories (name, display_order) VALUES (?, ?)').run(cat.name, cat.display_order);
        console.log(`✅ Categoría "${cat.name}" agregada`);
      }
    } catch (error) {
      console.error(`❌ Error al agregar categoría "${cat.name}":`, error);
    }
  });

  // Insertar productos si no existen
  const menuItems = [
    {
      name: 'Pizza Margarita',
      category_id: 1,
      price_small: 12000,
      price_large: 18000,
      description: 'Pizza clásica con salsa de tomate, mozzarella y albahaca fresca',
      popular: 1,
      available: 1
    },
    {
      name: 'Pizza Pepperoni',
      category_id: 1,
      price_small: 14000,
      price_large: 20000,
      description: 'Pizza con pepperoni, queso mozzarella y salsa de tomate',
      popular: 1,
      available: 1
    },
    {
      name: 'Pizza Hawaiana',
      category_id: 1,
      price_small: 13000,
      price_large: 19000,
      description: 'Pizza con jamón, piña, queso mozzarella y salsa de tomate',
      popular: 0,
      available: 1
    },
    {
      name: 'Gaseosa 500ml',
      category_id: 2,
      price_small: 3000,
      price_large: null,
      description: 'Bebida gaseosa de 500ml (Coca-Cola, Pepsi, etc.)',
      popular: 0,
      available: 1
    },
    {
      name: 'Jugo Natural',
      category_id: 2,
      price_small: 4000,
      price_large: null,
      description: 'Jugo natural de frutas de 500ml',
      popular: 0,
      available: 1
    },
    {
      name: 'Combo Familiar',
      category_id: 3,
      price_small: 35000,
      price_large: null,
      description: '2 pizzas grandes + 4 gaseosas + postre',
      popular: 1,
      available: 1
    },
    {
      name: 'Combo Pareja',
      category_id: 3,
      price_small: 22000,
      price_large: null,
      description: '1 pizza grande + 2 gaseosas',
      popular: 0,
      available: 1
    },
    {
      name: 'Tiramisú',
      category_id: 4,
      price_small: 8000,
      price_large: null,
      description: 'Postre italiano clásico con café y mascarpone',
      popular: 0,
      available: 1
    }
  ];

  menuItems.forEach(item => {
    try {
      const existing = db.prepare('SELECT * FROM menu_items WHERE name = ?').get(item.name);
      if (!existing) {
        db.prepare(`
          INSERT INTO menu_items (name, category_id, price_small, price_large, description, popular, available)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          item.name,
          item.category_id,
          item.price_small,
          item.price_large,
          item.description,
          item.popular,
          item.available
        );
        console.log(`✅ Producto "${item.name}" agregado`);
      }
    } catch (error) {
      console.error(`❌ Error al agregar producto "${item.name}":`, error);
    }
  });

  console.log('\n🎉 Datos iniciales agregados correctamente!');
  console.log('📋 Total categorías:', db.prepare('SELECT COUNT(*) as count FROM categories').get().count);
  console.log('🍕 Total productos:', db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count);
};

seedData();
