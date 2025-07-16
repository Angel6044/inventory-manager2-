# Inventory-Manager

Este es un Simulador Básico de Gestión de Inventario desarrollado con **HTML**, **CSS (Bootstrap 5.3)** y **JavaScript**. El objetivo principal es proporcionar una herramienta sencilla y atractiva para simular la **administración de productos** en una tienda pequeña, permitiendo agregar, ver, vender y eliminar productos, con persistencia de datos y un selector de tema.

---

### 🚀 Características:

**Gestión de Productos:**
- Agregar Producto: Añade nuevos productos al inventario o incrementa la cantidad de los existentes.

- Simular Venta: Reduce el stock de un producto existente. Si el stock llega a cero, ofrece la opción de eliminar el producto.

- Limpiar Inventario: Eliminar todos los productos existentes enel inventario.

- Eliminar Producto: Elimina un producto específico del inventario directamente desde la tabla.

- Modificar Producto: Modificar cualquier atributo o caracteristica relacionada a un producto específico del inventario.

### Interfaz Interactiva:
- Tabla Dinámica: Muestra el inventario actual en una tabla HTML que se actualiza en tiempo real.

- Botones de Acción: Interacción principal a través de botones "Agregar Producto", "Simular Venta" y "Limpiar Inventario". Y para cada registro de la tabla, tenemos la opcion de Eliminar y Modificar producto.

### Persistencia de Datos:
Los datos del inventario se guardan automáticamente en el localStorage del navegador, lo que significa que tu inventario persistirá incluso si cierras y vuelves a abrir la aplicación.

### Novedades y Mejoras ✨

Modales de Bootstrap 5.3: Utilizacion de modales modernos y responsivos de Bootstrap, reemplazando los antiguos prompt, alert y confirm del navegador.

Buscador de Productos: Se ha añadido un campo de búsqueda en la tabla de inventario que te permite filtrar productos en tiempo real por su nombre.

Acción de Modificar Producto: Ahora cada fila de la tabla incluye un botón para modificar los detalles de un producto (nombre, cantidad, precio).

Eliminar Todo el Inventario: Se ha agregado un nuevo botón en el pie de la tabla que permite eliminar todos los productos del localStorage de una sola vez.

Funciones de Orden Superior: utilizacion de find, filter, map y reduce

ID Únicos para Productos: Cada producto ahora tiene un ID único.

### Estructura del proyecto

```
inventory-manager/
├── index.html
├── assets/
|    └── icons
├── css/
|    └── styles.css
└── js/
    ├── main.js
    └── theme.js
```