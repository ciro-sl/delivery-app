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
        available: item.available === 1,
        image: item.image // Agregar campo de imagen
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
      return data; // Retorna objetos completos de categorías
    } catch (error) {
      console.error('Error en getCategories:', error);
      return [
        { id: 1, name: 'pizzas', display_order: 1 },
        { id: 2, name: 'bebidas', display_order: 2 },
        { id: 3, name: 'combos', display_order: 3 },
        { id: 4, name: 'postres', display_order: 4 }
      ];
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
  },

  // Crear nuevo item del menú
  async createMenuItem(item) {
    try {
      let response;

      if (item.imageFile) {
        // Usar FormData para subida de archivos
        const formData = new FormData();
        formData.append('image', item.imageFile);
        formData.append('name', item.name);
        formData.append('category_id', item.category_id);
        formData.append('price_small', item.price_small || item.price);
        if (item.price_large) formData.append('price_large', item.price_large);
        formData.append('description', item.description);
        formData.append('popular', item.popular || 0);
        formData.append('available', item.available !== undefined ? item.available : 1);

        response = await fetch(`${API_URL}/menu`, {
          method: 'POST',
          body: formData
        });
      } else {
        // Usar JSON normal
        const apiItem = {
          name: item.name,
          category_id: item.category_id,
          price_small: item.price_small || item.price,
          price_large: item.price_large || null,
          description: item.description,
          popular: item.popular || 0,
          available: item.available !== undefined ? item.available : 1
        };

        response = await fetch(`${API_URL}/menu`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiItem)
        });
      }

      return await response.json();
    } catch (error) {
      console.error('Error creando item del menú:', error);
      throw error;
    }
  },

  // Actualizar item del menú
  async updateMenuItem(id, item) {
    try {
      let response;

      if (item.imageFile) {
        // Usar FormData para subida de archivos
        const formData = new FormData();
        formData.append('image', item.imageFile);
        formData.append('name', item.name);
        formData.append('category_id', item.category_id);
        formData.append('price_small', item.price_small || item.price);
        if (item.price_large) formData.append('price_large', item.price_large);
        formData.append('description', item.description);
        formData.append('popular', item.popular || 0);
        formData.append('available', item.available !== undefined ? item.available : 1);

        response = await fetch(`${API_URL}/menu/${id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        // Usar JSON normal
        const apiItem = {
          name: item.name,
          category_id: item.category_id,
          price_small: item.price_small || item.price,
          price_large: item.price_large || null,
          description: item.description,
          popular: item.popular || 0,
          available: item.available !== undefined ? item.available : 1
        };

        response = await fetch(`${API_URL}/menu/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiItem)
        });
      }

      return await response.json();
    } catch (error) {
      console.error('Error actualizando item del menú:', error);
      throw error;
    }
  },

  // Eliminar item del menú
  async deleteMenuItem(id) {
    try {
      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error eliminando item del menú:', error);
      throw error;
    }
  },

  // Crear nueva categoría
  async createCategory(category) {
    try {
      const response = await fetch(`${API_URL}/menu/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creando categoría:', error);
      throw error;
    }
  },

  // Obtener productos de una categoría
  async getProductsInCategory(categoryId) {
    try {
      const response = await fetch(`${API_URL}/menu/categories/${categoryId}/products`);
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo productos de categoría:', error);
      return [];
    }
  },

  // Eliminar categoría
  async deleteCategory(id) {
    try {
      const response = await fetch(`${API_URL}/menu/categories/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      throw error;
    }
  }
};