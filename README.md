# Inventory-Manager

Este es un Simulador Básico de Gestión de Inventario desarrollado con **HTML**, **CSS (Bootstrap 5.0.2)** y **JavaScript**. El objetivo principal es proporcionar una herramienta sencilla y atractiva para simular la **administración de productos** en una tienda pequeña, permitiendo agregar, ver, vender y eliminar productos, con persistencia de datos y un selector de tema.

---

### 🚀 Características:

**Gestión de Productos:**
- Agregar Producto: Añade nuevos productos al inventario o incrementa la cantidad de los existentes.

- Simular Venta: Reduce el stock de un producto existente. Si el stock llega a cero, ofrece la opción de eliminar el producto.

- Eliminar Producto: Elimina un producto específico del inventario directamente desde la tabla.

### Interfaz Interactiva:
- Tabla Dinámica: Muestra el inventario actual en una tabla HTML que se actualiza en tiempo real.

- Botones de Acción: Interacción principal a través de botones "Agregar Producto", "Simular Venta" y "Eliminar" (en cada fila de la tabla).

- Cuadros de Diálogo: Utiliza prompt, confirm y alert para todas las interacciones con el usuario (entradas, confirmaciones, mensajes).

### Persistencia de Datos:
Los datos del inventario se guardan automáticamente en el localStorage del navegador, lo que significa que tu inventario persistirá incluso si cierras y vuelves a abrir la aplicación.

- Productos Iniciales:
Al iniciar por primera vez, si no hay datos guardados, se precarga un listado de 10 productos para empezar a trabajar inmediatamente.

- Tema Personalizable:
    - Modo Oscuro/Claro: Un botón en la esquina superior derecha permite alternar entre un tema visual claro y oscuro, con persistencia de la preferencia del usuario en localStorage.

### Estructura del proyecto

```
inventory-manager/
├── index.html
├── css/
|    └── styles.css
└── js/
    ├── main.js
    └── theme.js
```