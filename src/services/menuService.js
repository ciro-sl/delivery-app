// src/services/menuService.js
const API_URL = 'http://localhost:3001/api';

export const menuService = {
  // Obtener todo el menú
  async getMenu() {
    console.log(' menuService: Solicitando menú desde API...');
    try {
      const response = await fetch(`${API_URL}/menu`);
      if (!response.ok) throw new Error('Error al cargar el menú');
      const data = await response.json();
      console.log(` menuService: Recibidos ${data.length} productos desde API`);
      
      // Transformar datos de BD al formato que espera el frontend
      return data.map(item => ({
        id: item.id.toString(),
        name: item.name,
        category: item.category_name.toLowerCase(),
        description: item.description,
        price_small: item.price_small,
        price_large: item.price_large,
        popular: item.popular === 1,
        available: item.available === 1
      }));
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  // Obtener categorías
  async getCategories() {
    try {
      const response = await fetch(`${API_URL}/menu/categories`);
      const data = await response.json();
      return ['todas', ...data.map(cat => cat.name.toLowerCase())];
    } catch (error) {
      console.error('Error en getCategories:', error);
      return ['todas', 'pizzas', 'bebidas', 'combos', 'postres'];
    }
  },

  // Crear pedido
  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  },

  // Obtener estadísticas de ventas
  async getSalesStats() {
    try {
      const response = await fetch(`${API_URL}/orders/stats`);
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { totalOrders: 0, totalEarnings: 0, averageOrder: 0 };
    }
  }
};