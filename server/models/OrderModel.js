// server/models/OrderModel.js
import db from '../database.js';

class OrderModel {
  // Crear nuevo pedido
  static create(orderData) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, payment_method, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insertOrder.run(
      orderData.customer_name || 'Cliente',
      orderData.customer_phone || null,
      orderData.customer_address || null,
      orderData.total_amount,
      orderData.payment_method || 'efectivo',
      orderData.status || 'pending'
    );
    
    const orderId = result.lastInsertRowid;
    
    // Insertar items del pedido
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, size, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        insertItem.run(
          orderId,
          item.menu_item_id || parseInt(item.id),
          item.quantity,
          item.unit_price || item.price,
          item.size || 'small',
          item.notes || null
        );
      }
    }
    
    return this.getById(orderId);
  }

  // Obtener pedido por ID
  static getById(id) {
    const orderStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const order = orderStmt.get(id);
    
    if (!order) return null;
    
    const itemsStmt = db.prepare(`
      SELECT oi.*, m.name as item_name 
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE oi.order_id = ?
    `);
    order.items = itemsStmt.all(id);
    
    return order;
  }

  // Obtener todos los pedidos
  static getAll() {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    return stmt.all();
  }

  // Actualizar estado del pedido
  static updateStatus(id, status) {
    const stmt = db.prepare(`
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(status, id);
    return this.getById(id);
  }

  // Obtener estadísticas
  static getStats() {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_earnings,
        COALESCE(AVG(total_amount), 0) as average_order,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders
      FROM orders
    `).get();
    
    return {
      totalOrders: stats.total_orders || 0,
      totalEarnings: stats.total_earnings || 0,
      averageOrder: parseFloat(stats.average_order) || 0,
      pendingOrders: stats.pending_orders || 0,
      completedOrders: stats.completed_orders || 0
    };
  }
}

export default OrderModel;