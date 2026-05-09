// server/models/MenuModel.js
import db from '../database.js';

class MenuModel {
  // Obtener todos los items del menú con su categoría
  static getAll() {
    const stmt = db.prepare(`
      SELECT m.*, c.name as category_name 
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      WHERE m.available = 1
      ORDER BY c.display_order, m.name
    `);
    return stmt.all();
  }

  // Obtener item por ID
  static getById(id) {
    const stmt = db.prepare(`
      SELECT m.*, c.name as category_name 
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      WHERE m.id = ?
    `);
    return stmt.get(id);
  }

  // Crear nuevo item
  static create(item) {
    const stmt = db.prepare(`
      INSERT INTO menu_items (name, category_id, price_small, price_medium, price_large, description, image, popular, available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      item.name,
      item.category_id,
      item.price_small || null,
      item.price_medium || null,
      item.price_large || null,
      item.description,
      item.image || null,
      item.popular ? 1 : 0,
      item.available !== undefined ? (item.available ? 1 : 0) : 1
    );
    return this.getById(result.lastInsertRowid);
  }

  // Actualizar item
  static update(id, item) {
    console.log('MenuModel.update - ID:', id, 'Datos:', item);

    // Validar que el ID existe
    const existingItem = this.getById(id);
    if (!existingItem) {
      throw new Error('Producto no encontrado');
    }

    // Construir consulta dinámica basada en qué campos actualizar
    let setClause = 'name = ?, category_id = ?, price_small = ?, price_medium = ?, price_large = ?, description = ?, popular = ?, available = ?';
    let params = [
      item.name || '',
      parseInt(item.category_id) || 1,
      item.price_small !== undefined && item.price_small !== null && item.price_small !== 'null' ? parseFloat(item.price_small) : null,
      item.price_medium !== undefined && item.price_medium !== null && item.price_medium !== 'null' ? parseFloat(item.price_medium) : null,
      item.price_large !== undefined && item.price_large !== null && item.price_large !== 'null' ? parseFloat(item.price_large) : null,
      item.description || '',
      item.popular ? 1 : 0,
      item.available !== undefined ? (item.available ? 1 : 0) : 1,
    ];

    // Solo actualizar imagen si se proporciona
    if (item.image !== undefined && item.image !== null) {
      setClause += ', image = ?';
      params.push(item.image);
    }

    const stmt = db.prepare(`
      UPDATE menu_items
      SET ${setClause}
      WHERE id = ?
    `);

    params.push(id);

    console.log('Ejecutando update con datos:', params);

    stmt.run(...params);
    const updatedItem = this.getById(id);
    console.log('Producto actualizado en BD:', updatedItem);
    return updatedItem;
  }

  // Eliminar item (borrado lógico)
  static delete(id) {
    const stmt = db.prepare('UPDATE menu_items SET available = 0 WHERE id = ?');
    return stmt.run(id);
  }

  // Eliminar item físicamente
  static deletePermanently(id) {
    const stmt = db.prepare('DELETE FROM menu_items WHERE id = ?');
    return stmt.run(id);
  }

  // Obtener categorías
  static getCategories() {
    const stmt = db.prepare('SELECT * FROM categories ORDER BY display_order');
    return stmt.all();
  }

  // Crear nueva categoría
  static createCategory(category) {
    const stmt = db.prepare(`
      INSERT INTO categories (name, display_order)
      VALUES (?, ?)
    `);
    const result = stmt.run(category.name, category.display_order || 0);
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  }

  // Actualizar categoría
  static updateCategory(id, category) {
    const stmt = db.prepare(`
      UPDATE categories 
      SET name = ?, display_order = ?
      WHERE id = ?
    `);
    stmt.run(category.name, category.display_order || 0, id);
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  }

  // Verificar productos en categoría
  static getProductsInCategory(categoryId) {
    const stmt = db.prepare(`
      SELECT id, name FROM menu_items
      WHERE category_id = ? AND available = 1
    `);
    return stmt.all(categoryId);
  }

  // Eliminar categoría y todos sus productos
  static deleteCategory(id) {
    // Primero eliminar todos los productos de esta categoría
    const deleteProductsStmt = db.prepare('DELETE FROM menu_items WHERE category_id = ?');
    const productsDeleted = deleteProductsStmt.run(id);

    // Luego eliminar la categoría
    const deleteCategoryStmt = db.prepare('DELETE FROM categories WHERE id = ?');
    const categoryDeleted = deleteCategoryStmt.run(id);

    return {
      categoryDeleted: categoryDeleted.changes,
      productsDeleted: productsDeleted.changes
    };
  }
}

export default MenuModel;