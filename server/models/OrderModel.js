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
      orderData.status || 'Preparando'
    );
    
    const orderId = result.lastInsertRowid;
    
    // Insertar items del pedido
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, size, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        // Map size variants to database values
        let mappedSize = item.size || 'small';
        const sizeLower = mappedSize.toLowerCase();
        if (sizeLower === 'individual' || sizeLower === 'pequeña' || sizeLower === 'pequeño' || sizeLower === 'small') {
          mappedSize = 'small';
        } else if (sizeLower === 'familiar' || sizeLower === 'grande' || sizeLower === 'large') {
          mappedSize = 'large';
        } else {
          mappedSize = 'small'; // default fallback
        }

        insertItem.run(
          orderId,
          item.menu_item_id || parseInt(item.id),
          item.quantity,
          item.unit_price || item.price,
          mappedSize,
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

  // Obtener pedido por teléfono (último pedido activo del cliente)
  static getByPhone(phone) {
    const orderStmt = db.prepare('SELECT * FROM orders WHERE customer_phone = ? AND status NOT IN (\'Entregado\', \'Cancelado\') ORDER BY created_at DESC LIMIT 1');
    const order = orderStmt.get(phone);

    if (!order) return null;

    const itemsStmt = db.prepare(`
      SELECT oi.*, m.name as item_name
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE oi.order_id = ?
    `);
    order.items = itemsStmt.all(order.id);

    return order;
  }

  // Obtener todos los pedidos
  static getAll() {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = stmt.all();

    // Agregar items a cada pedido
    for (const order of orders) {
      const itemsStmt = db.prepare(`
        SELECT oi.*, m.name as item_name
        FROM order_items oi
        JOIN menu_items m ON oi.menu_item_id = m.id
        WHERE oi.order_id = ?
      `);
      order.items = itemsStmt.all(order.id);
    }

    return orders;
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
    // Estadísticas generales
    const stats = db.prepare(`
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_earnings,
        COALESCE(AVG(total_amount), 0) as average_order,
        SUM(CASE WHEN status IN ('Preparando', 'Entregando') THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'Entregado' THEN 1 ELSE 0 END) as completed_orders
      FROM orders
    `).get();

    // Estadísticas diarias
    const dailyStats = db.prepare(`
      SELECT
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as earnings
      FROM orders
      WHERE DATE(created_at) = DATE('now')
    `).get();

    // Estadísticas semanales
    const weeklyStats = db.prepare(`
      SELECT
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as earnings
      FROM orders
      WHERE strftime('%Y-%W', created_at) = strftime('%Y-%W', 'now')
    `).get();

    // Estadísticas mensuales
    const monthlyStats = db.prepare(`
      SELECT
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as earnings
      FROM orders
      WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    `).get();

    // Datos semanales para gráfica (últimos 7 días)
    const weeklyData = db.prepare(`
      SELECT
        strftime('%w', created_at) as day_of_week,
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as earnings
      FROM orders
      WHERE created_at >= date('now', '-6 days')
      GROUP BY strftime('%w', created_at)
      ORDER BY day_of_week
    `).all();

    // Datos mensuales para gráfica (últimas 4 semanas)
    const monthlyData = db.prepare(`
      SELECT
        strftime('%W', created_at) as week_of_year,
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as earnings
      FROM orders
      WHERE created_at >= date('now', '-27 days')
      GROUP BY strftime('%W', created_at)
      ORDER BY week_of_year DESC
      LIMIT 4
    `).all().reverse();

    return {
      totalOrders: stats.total_orders || 0,
      totalEarnings: stats.total_earnings || 0,
      averageOrder: parseFloat(stats.average_order) || 0,
      pendingOrders: stats.pending_orders || 0,
      completedOrders: stats.completed_orders || 0,
      daily: {
        orders: dailyStats.orders || 0,
        earnings: dailyStats.earnings || 0
      },
      weekly: {
        orders: weeklyStats.orders || 0,
        earnings: weeklyStats.earnings || 0
      },
      monthly: {
        orders: monthlyStats.orders || 0,
        earnings: monthlyStats.earnings || 0
      },
      weeklyData: weeklyData.map(d => d.earnings || 0),
      monthlyData: monthlyData.map(d => d.earnings || 0)
    };
  }
}

export default OrderModel;