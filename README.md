# Delivery App - Pa' Que Arvey

Una aplicación web de entrega de comida construida con React, Vite y Tailwind CSS. Incluye un panel de administración para gestionar el menú, pedidos y estadísticas, así como una interfaz de usuario para los clientes.

## Características

- **Panel de Administración**: Gestión completa del menú, pedidos y estadísticas de ventas
- **Interfaz de Usuario**: Navegación del menú, carrito de compras y proceso de pedido
- **Autenticación**: Sistema de login para administradores
- **Tema Oscuro/Claro**: Soporte para modos de visualización
- **Responsive**: Diseño adaptativo para móviles y escritorio
- **Persistencia**: Almacenamiento local para datos del carrito y preferencias

## Tecnologías Utilizadas

- **Frontend**: React 18 con hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS con PostCSS
- **Routing**: React Router DOM
- **State Management**: Context API de React
- **Icons**: Emoji y Tailwind CSS
- **Linting**: ESLint
- **Backend**: Node.js con Express (en carpeta server/)

## Estructura del Proyecto

```
delivery-app/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/            # Imágenes y recursos
│   ├── components/
│   │   ├── admin/         # Componentes del panel de admin
│   │   │   ├── AdminPanel.jsx      # Panel principal con sidebar
│   │   │   ├── AdminDashboard.jsx  # Dashboard con estadísticas
│   │   │   ├── MenuManagement.jsx  # Gestión del menú
│   │   │   ├── OrdersHistory.jsx   # Historial de pedidos
│   │   │   ├── Sidebar.jsx         # Navegación lateral
│   │   │   └── Login.jsx           # Formulario de login
│   │   └── common/         # Componentes compartidos
│   │       ├── Navbar.jsx  # Barra de navegación
│   │       └── Footer.jsx  # Pie de página
│   │   └── user/           # Componentes de usuario
│   │       ├── Menu.jsx    # Lista de productos
│   │       └── MenuItem.jsx # Item individual del menú
│   ├── contexts/           # Contextos de React
│   │   ├── AuthContext.jsx # Autenticación
│   │   ├── CartContext.jsx # Carrito de compras
│   │   ├── MenuContext.jsx # Gestión del menú
│   │   ├── OrderContext.jsx # Pedidos
│   │   └── ThemeContext.jsx # Tema oscuro/claro
│   ├── pages/              # Páginas principales
│   │   ├── Home.jsx        # Página de inicio
│   │   └── CartPage.jsx    # Página del carrito
│   ├── services/           # Servicios de datos
│   │   ├── menuService.js  # API del menú
│   │   └── storageService.js # Almacenamiento local
│   ├── App.jsx             # Componente raíz
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── server/                 # Backend Node.js
│   ├── index.js            # Servidor Express
│   └── package.json        # Dependencias del servidor
├── package.json            # Dependencias del frontend
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
├── postcss.config.js       # Configuración de PostCSS
└── eslint.config.js        # Configuración de ESLint
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación del Frontend
```bash
cd delivery-app
npm install
```

### Instalación del Backend
```bash
cd server
npm install
```

## Uso

### Desarrollo
```bash
# Frontend
npm run dev

# Backend (en otra terminal)
cd server
npm start
```

### Build de Producción
```bash
npm run build
```

### Preview del Build
```bash
npm run preview
```

## Funcionalidades Detalladas

### Panel de Administración
- **Dashboard**: Vista general con estadísticas de pedidos y ventas
- **Gestión de Menú**: Agregar, editar y eliminar items del menú con categorías
- **Historial de Pedidos**: Ver todos los pedidos realizados con detalles del cliente
- **Autenticación**: Login seguro para administradores

### Interfaz de Usuario
- **Menú**: Exploración de productos por categorías
- **Carrito**: Agregar/eliminar items, calcular totales
- **Proceso de Pedido**: Formulario para completar la orden

### Contextos y Estado
- **AuthContext**: Maneja autenticación de admin
- **CartContext**: Estado del carrito de compras
- **MenuContext**: Datos del menú y operaciones CRUD
- **OrderContext**: Gestión de pedidos
- **ThemeContext**: Modo oscuro/claro

## API Endpoints (Backend)

- `GET /menu` - Obtener todos los items del menú
- `POST /menu` - Agregar nuevo item al menú
- `PUT /menu/:id` - Actualizar item del menú
- `DELETE /menu/:id` - Eliminar item del menú
- `GET /orders` - Obtener todos los pedidos
- `POST /orders` - Crear nuevo pedido

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🎨 Sistema de Colores y CSS

### Arquitectura de Colores

El proyecto utiliza un **sistema de colores multinivel** con 3 capas de prioridad:

#### 1. Variables CSS (Máxima Prioridad)
**Archivo**: `src/index.css`
- Variables globales definidas en `:root`
- Tema oscuro automático con clase `dark` en `<html>`
- Controlan colores base de texto, fondo y acentos

#### 2. Colores Tailwind Personalizados (Media Prioridad)
**Archivo**: `tailwind.config.js`
- Paleta de marca: `naranja`, `amarillo`, `verde`, `vinotinto`
- Colores semánticos: `texto`, `texto-muted`, `gris-oscuro`
- Se usan con clases como `text-naranja`, `bg-verde`

#### 3. Clases Tailwind Estándar (Baja Prioridad)
- Colores predefinidos como `text-red-500`, `bg-blue-600`
- Para casos específicos que no siguen la paleta de marca

### Jerarquía de Prioridad

1. **Estilos inline** (`style={{color: 'red'}}`)
2. **Variables CSS** (`color: var(--accent)`)
3. **Tailwind personalizado** (`text-naranja`)
4. **Tailwind estándar** (`text-orange-600`)
5. **CSS heredado**

### Cambiar Colores Globales

#### Color Principal de Marca:
```css
/* En src/index.css */
:root {
  --accent: #tu-nuevo-color; /* Modo claro */
}
html.dark {
  --accent: #version-oscura; /* Modo oscuro */
}
```

#### Colores Tailwind:
```javascript
// En tailwind.config.js
colors: {
  'naranja': '#tu-nuevo-color',
  'amarillo': '#tu-nuevo-amarillo',
}
```

### Archivos de CSS

- **`src/index.css`**: Variables CSS globales, reset, tema oscuro
- **`src/App.css`**: Estilos específicos de componentes (poco usado)
- **`tailwind.config.js`**: Configuración de colores y tema Tailwind

### Guía Completa de Colores

Ver **[COLORS_GUIDE.md](COLORS_GUIDE.md)** para documentación detallada del sistema de colores.
