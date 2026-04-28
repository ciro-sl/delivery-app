# Delivery App - Instrucciones de Uso

## 🚀 Cómo Iniciar la Aplicación

### 1. Iniciar el Servidor Backend
```bash
cd server
node simple-server.js
```
El servidor se iniciará en `http://localhost:3001`

### 2. Iniciar el Frontend
```bash
npm run dev
```
La aplicación web estará disponible en `http://localhost:5173`

## 📋 Estado Actual del Proyecto

### ✅ Funcionando Correctamente:
- **Base de Datos**: SQLite configurada con tablas para menú, pedidos, categorías y administradores
- **Servidor Backend**: API REST con endpoints para menú, pedidos y autenticación
- **Frontend**: Aplicación React con navegación y componentes básicos
- **Conexión**: El frontend está configurado para comunicarse con el backend

### 🔧 Componentes Principales:
- **Menú**: Gestión de productos del menú con categorías
- **Pedidos**: Sistema de toma y gestión de pedidos
- **Autenticación**: Panel de administrador con contraseña
- **Carrito**: Sistema de compras para clientes

## 🗄️ Base de Datos

### Tablas Creadas:
- `categories`: Categorías del menú (pizzas, bebidas, etc.)
- `menu_items`: Productos del menú con precios y descripciones
- `orders`: Pedidos de clientes
- `order_items`: Items específicos de cada pedido
- `admins`: Administradores del sistema

### Contraseña por Defecto:
- **Usuario**: admin
- **Contraseña**: admin123

## 🛠️ Scripts Disponibles

### En la carpeta `server/`:
- `simple-server.js`: Servidor básico sin base de datos (para pruebas)
- `index.js`: Servidor completo con SQLite
- `test-server.js`: Script para probar si el servidor está funcionando

## 📡 Endpoints de la API

### Menú:
- `GET /api/menu` - Obtener todos los productos
- `GET /api/menu/categories` - Obtener categorías
- `POST /api/menu` - Crear nuevo producto
- `PUT /api/menu/:id` - Actualizar producto
- `DELETE /api/menu/:id` - Eliminar producto

### Pedidos:
- `GET /api/orders` - Obtener todos los pedidos
- `GET /api/orders/:id` - Obtener pedido específico
- `POST /api/orders` - Crear nuevo pedido
- `PATCH /api/orders/:id/status` - Actualizar estado de pedido
- `GET /api/orders/stats` - Obtener estadísticas

### Autenticación:
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/change-password` - Cambiar contraseña

### Health Check:
- `GET /api/health` - Verificar estado del servidor

## 🎯 Próximos Pasos Recomendados

1. **Agregar Datos de Ejemplo**: Insertar productos de muestra en la base de datos
2. **Mejorar el Frontend**: Completar los componentes faltantes
3. **Testing**: Crear pruebas unitarias para los endpoints
4. **Deploy**: Preparar la aplicación para producción

## 🔍 Problemas Solucionados

- ✅ Corregida la configuración de `better-sqlite3`
- ✅ Actualizadas las dependencias del servidor
- ✅ Creada la estructura completa de tablas en la base de datos
- ✅ Verificada la conexión entre frontend y backend
- ✅ Creados scripts de prueba para el servidor

## 💡 Notas Importantes

- El servidor busca automáticamente puertos disponibles (3001-3005)
- La base de datos SQLite se guarda en `server/delivery.db`
- El frontend está configurado para usar `http://localhost:3001/api`
- Todos los precios se manejan en pesos colombianos (como enteros)

---

**Estado del Proyecto: ✅ FUNCIONANDO CON BASE DE DATOS**
