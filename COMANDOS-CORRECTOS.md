# 📋 COMANDOS CORRECTOS - EJECUTAR EN ORDEN EXACTO

## ❌ ERROR COMETIDO:
Ejecutaste `node test-api-endpoint.js` desde la carpeta incorrecta.

## ✅ COMANDOS CORRECTOS:

### PASO 1: Iniciar Servidor
```bash
cd server
node start-server-manual.js
```
**Debería mostrar:**
```
🚀 Iniciando servidor manual...
✅ Base de datos conectada
🔥 Servidor corriendo en http://localhost:3001
✅ Servidor listo para recibir peticiones
```

### PASO 2: Probar API (en OTRA terminal)
```bash
cd server
node test-api-endpoint.js
```
**Debería mostrar:**
```
🧪 Probando endpoint /api/menu...
Status: 200
📊 Respuesta del servidor:
- Cantidad de productos: 8
✅ No hay duplicados en la respuesta del servidor
```

### PASO 3: Iniciar Frontend (en TERCERA terminal)
```bash
npm run dev
```

### PASO 4: Probar Aplicación
1. Abre: http://localhost:5173
2. Deberías ver 8 productos (no 24)
3. Ve a: http://localhost:5173/admin
4. Login: admin/admin123
5. Ve a "Gestión de Menú"
6. Debería cargar y mostrar los productos

## 🔧 SI ALGO FALLA:

### Si el servidor no inicia:
```bash
cd server
node init-clean-db.js
node start-server-manual.js
```

### Si la API no responde:
1. Asegúrate que el servidor esté corriendo (debe mostrar mensaje)
2. Ejecuta `node test-api-endpoint.js` desde la carpeta `server`

### Si hay duplicados:
1. Detén el servidor (Ctrl+C)
2. Ejecuta `node init-clean-db.js`
3. Inicia el servidor nuevamente

## 📁 ESTRUCTURA DE ARCHIVOS:
```
delivery-app/
├── server/
│   ├── start-server-manual.js  ← Para iniciar servidor
│   ├── test-api-endpoint.js     ← Para probar API
│   ├── init-clean-db.js         ← Para limpiar BD
│   └── delivery.db              ← Base de datos
├── src/                         ← Frontend
└── package.json                 ← Dependencias
```

## ⚠️ IMPORTANTE:
- **Siempre ejecuta desde la carpeta correcta**
- **El servidor debe quedar corriendo** (no lo cierres)
- **Abre nuevas terminales** para cada comando
- **Verifica los mensajes** que muestra cada comando

---

**ESTADO: 📋 COMANDOS CORREGIDOS - EJECUTA EN ORDEN**
