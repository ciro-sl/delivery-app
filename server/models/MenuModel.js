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
      INSERT INTO menu_items (name, category_id, price_small, price_large, description, popular, available)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      item.name, 
      item.category_id, 
      item.price_small || null, 
      item.price_large || null, 
      item.description, 
      item.popular ? 1 : 0,
      item.available !== undefined ? (item.available ? 1 : 0) : 1
    );
    return this.getById(result.lastInsertRowid);
  }

  // Actualizar item
  static update(id, item) {
    const stmt = db.prepare(`
      UPDATE menu_items 
      SET name = ?, category_id = ?, price_small = ?, price_large = ?, 
          description = ?, popular = ?, available = ?
      WHERE id = ?
    `);
    stmt.run(
      item.name, 
      item.category_id, 
      item.price_small || null, 
      item.price_large || null, 
      item.description, 
      item.popular ? 1 : 0,
      item.available ? 1 : 0,
      id
    );
    return this.getById(id);
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

  // Eliminar categoría
  static deleteCategory(id) {
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
    return stmt.run(id);
  }
}

export default MenuModel;