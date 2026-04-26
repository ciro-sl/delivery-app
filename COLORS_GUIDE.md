# 🎨 SISTEMA DE COLORES - Delivery App "Pa' Que Arvey"

## 📋 Resumen Ejecutivo

Este proyecto utiliza un **sistema de colores multinivel** con 3 capas de prioridad:

1. **Variables CSS** (máxima prioridad) - Definidas en `index.css`
2. **Colores Tailwind personalizados** - Definidos en `tailwind.config.js`
3. **Clases Tailwind estándar** - Para colores básicos

## 🏗️ Arquitectura del Sistema de Colores

### 1. Variables CSS (`src/index.css`)

**Ubicación**: `src/index.css` - líneas 12-45
**Activación**: Automática basada en clase `dark` en `<html>`

#### Paleta de Colores Principal:

```css
/* Modo Claro (por defecto) */
--bg-body: #fef8f0;        /* Fondo general - beige claro */
--bg-surface: #ffffff;     /* Tarjetas y superficies */
--text-primary: #2c241e;   /* Texto principal - marrón oscuro */
--text-secondary: #6b5a4e; /* Texto secundario */
--accent: #c45a2c;         /* Naranja rojizo principal */
--accent-dark: #a5481f;    /* Versión oscura del acento */
--border: #eedfcb;         /* Bordes - beige */
--success: #2f8a5e;        /* Verde éxito */
--danger: #b91c1c;         /* Rojo error */
--warning: #d97706;        /* Amarillo advertencia */
```

#### Modo Oscuro (`.dark`):

```css
--bg-body: #121212;        /* Fondo muy oscuro */
--bg-surface: #1e1b19;     /* Superficies oscuras */
--text-primary: #f0ece8;   /* Texto claro */
--accent: #e07a3a;         /* Naranja más brillante */
```

**Cómo cambiar colores globales:**
1. Editar valores en `:root` para modo claro
2. Editar valores en `html.dark` para modo oscuro
3. Los cambios se aplican automáticamente en toda la app

### 2. Colores Tailwind Personalizados (`tailwind.config.js`)

**Ubicación**: `tailwind.config.js` - líneas 8-17
**Uso**: Clases como `text-naranja`, `bg-verde`, `border-amarillo`

#### Colores de Marca:

```javascript
colors: {
  'vinotinto': '#7A0D0D',        // Rojo vino para elementos destacados
  'vinotinto-claro': '#2d0a0a',  // Versión más clara
  'gris-oscuro': '#1e1e1e',     // Gris oscuro para fondos
  'naranja': '#FF7F11',         // Naranja principal de marca
  'amarillo': '#D97D2F',        // Amarillo para acentos
  'verde': '#2F8A5E',           // Verde para estados positivos
  'texto': '#f5f5f5',           // Texto principal
  'texto-muted': '#c0c0c0',     // Texto secundario
  'negro': '#0a0a0a',           // Negro para fondos oscuros
}
```

**Cómo cambiar colores de Tailwind:**
1. Editar valores en `tailwind.config.js`
2. Ejecutar `npm run build` para regenerar CSS
3. Los cambios afectan todas las clases que usan estos colores

### 3. Clases Tailwind Estándar

**Uso**: Colores como `text-red-500`, `bg-blue-600`, `border-gray-300`
**Ventaja**: Amplia gama de colores predefinidos
**Desventaja**: No siguen la paleta de marca

## 🎯 Jerarquía de Prioridad de Colores

### Orden de Aplicación (de mayor a menor prioridad):

1. **Estilos Inline** (`style={{color: 'red'}}`) - Máxima prioridad
2. **Variables CSS** (`color: var(--accent)`) - Alta prioridad
3. **Clases Tailwind Personalizadas** (`text-naranja`) - Media prioridad
4. **Clases Tailwind Estándar** (`text-orange-600`) - Baja prioridad
5. **Estilos CSS heredados** - Mínima prioridad

### Ejemplo de Prioridad:

```jsx
<div
  className="text-gray-500 text-naranja"  // text-naranja gana
  style={{color: 'red'}}                // style inline gana
>
  Texto rojo final
</div>
```

## 📍 Dónde Cambiar Cada Color

### 🎨 Colores Globales (afectan toda la app):

| Elemento | Archivo | Línea | Variable/Clase |
|----------|---------|-------|----------------|
| Fondo principal | `index.css` | 13 | `--bg-body` |
| Texto principal | `index.css` | 16 | `--text-primary` |
| Color de marca | `index.css` | 19 | `--accent` |
| Color éxito | `index.css` | 25 | `--success` |
| Color error | `index.css` | 26 | `--danger` |

### 🏪 Colores de Marca (Tailwind):

| Color | Archivo | Línea | Uso Principal |
|-------|---------|-------|---------------|
| Naranja principal | `tailwind.config.js` | 10 | Botones, acentos |
| Amarillo | `tailwind.config.js` | 11 | Precios, highlights |
| Verde | `tailwind.config.js` | 12 | Estados positivos |
| Vinotinto | `tailwind.config.js` | 8 | Elementos especiales |

### 🔧 Colores por Componente:

#### Navbar (`src/components/common/Navbar.jsx`):
- Logo: `text-naranja`
- Enlaces hover: `hover:text-naranja dark:hover:text-amarillo`
- Badge carrito: `bg-naranja dark:bg-amarillo`

#### Sidebar Admin (`src/components/admin/Sidebar.jsx`):
- Logo: `from-naranja to-amarillo`
- Tab activo: `from-orange-500 to-yellow-500`
- Texto: `text-orange-600 dark:text-orange-400`

#### MenuItem (`src/components/user/MenuItem.jsx`):
- Categoría: `bg-amarillo/10 text-amarillo`
- Hover: `hover:border-amarillo/40`
- Precio: `text-amarillo`

## 🌓 Sistema de Tema Oscuro/Claro

### Activación:
- **Automática**: Clase `dark` en `<html>` (manejada por `ThemeContext`)
- **Manual**: Agregar/remover clase `dark` al elemento `<html>`

### Archivos que controlan el tema:
1. `src/contexts/ThemeContext.jsx` - Lógica del tema
2. `src/index.css` - Variables CSS para cada tema
3. `tailwind.config.js` - Clase `dark:` para utilities

### Cambiar colores del tema oscuro:
1. Editar variables en `html.dark` en `index.css`
2. Las clases `dark:` en componentes usarán estos nuevos valores

## 🚀 Guía para Cambiar Colores

### Para cambiar el color principal de marca:

1. **Variables CSS** (recomendado para consistencia):
   ```css
   :root { --accent: #tu-nuevo-color; }
   html.dark { --accent: #version-oscura; }
   ```

2. **Tailwind config** (afecta clases específicas):
   ```javascript
   'naranja': '#tu-nuevo-color'
   ```

### Para agregar un nuevo color:

1. Agregarlo a `tailwind.config.js`:
   ```javascript
   colors: {
     'mi-color': '#123456'
   }
   ```

2. Usarlo en componentes:
   ```jsx
   className="text-mi-color bg-mi-color/20"
   ```

## 📊 Mapa de Colores por Sección

### Usuario (Frontend):
- **Fondos**: `bg-white dark:bg-[#111111]`
- **Textos**: `text-black dark:text-white`
- **Acentos**: `text-naranja`, `text-amarillo`
- **Botones**: `bg-naranja`, `hover:bg-amarillo`

### Admin (Panel):
- **Sidebar**: `bg-zinc-950/95`, `from-naranja to-amarillo`
- **Tarjetas**: `bg-[#1a1a1a]`, `hover:border-naranja/20`
- **Texto**: `text-white`, `text-naranja`

### Estados:
- **Éxito**: `text-verde`, `bg-verde/20`
- **Error**: `text-red-500`, `bg-red-500/10`
- **Advertencia**: `text-amarillo`, `bg-amarillo/10`

## 🔍 Debugging de Colores

### Herramientas del navegador:
1. **DevTools** → **Elements** → Ver cascada de CSS
2. Buscar qué regla CSS está aplicando el color actual
3. Ver si hay `!important` o estilos inline

### Comandos útiles:
```bash
# Ver colores definidos en Tailwind
npm run build  # Regenera CSS con cambios en config
```

### Problemas comunes:
- **Color no cambia**: Verificar prioridad CSS
- **Modo oscuro no funciona**: Verificar clase `dark` en `<html>`
- **Tailwind no actualiza**: Reiniciar dev server después de cambiar config

---

**Nota**: Este sistema permite mantener consistencia visual mientras ofrece flexibilidad para cambios específicos por componente.</content>
<parameter name="filePath">c:\Users\cir\Documents\mi app\delivery-app\COLORS_GUIDE.md