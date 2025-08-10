# Inventory-Manager

Este es un Simulador Básico de Gestión de Inventario desarrollado con **HTML**, **CSS (Bootstrap 5.3)** y **JavaScript**. El objetivo principal es proporcionar una herramienta sencilla y atractiva para simular la administración de productos en una tienda pequeña.

---

### 🚀 Características:

#### Gestión de Productos:

- **Agregar Producto**: Añade nuevos productos al inventario o incrementa la cantidad de los existentes.
- **Simular Venta**: Reduce el stock de un producto. Si el stock llega a cero, ofrece la opción de eliminar el producto.
- **Limpiar Inventario**: Elimina todos los productos del inventario de una sola vez.
- **Eliminar Producto**: Elimina un producto específico directamente desde la tabla.
- **Modificar Producto**: Modifica cualquier atributo (nombre, cantidad, precio) de un producto específico.

#### Interfaz Interactiva:

- **Tabla Dinámica**: Muestra el inventario actual en una tabla HTML que se actualiza en tiempo real.
- **Buscador de Productos**: Permite filtrar productos en tiempo real por su nombre.
- **Botones de Acción**: La interacción principal se realiza a través de botones "Agregar Producto", "Simular Venta" y "Limpiar Inventario", además de las opciones de "Eliminar" y "Modificar" en cada fila de la tabla.
- **Modales de Bootstrap 5.3**: Se utilizan modales modernos y responsivos, reemplazando los antiguos `prompt`, `alert` y `confirm` del navegador.
- **Selector de Tema**: Permite alternar entre un tema claro y oscuro para una mejor experiencia visual.

### Novedades y Mejoras ✨

- **Conexión con `mockapi.io`**: Ahora los datos del inventario se gestionan a través de una API real utilizando el servicio de `mockapi.io`. Esto permite una persistencia de datos en la nube.
- **Comunicación con `fetch`**: Toda la interacción con los datos se gestiona a través de la API `fetch` de JavaScript, permitiendo una comunicación asíncrona y robusta.
- **Manejo de Errores**: Se ha implementado el uso de `try...catch` en todas las operaciones de datos críticas para manejar de manera segura cualquier fallo de la API.
- **Modularidad del Código**: La lógica de la aplicación está dividida en módulos. Se ha creado un `apiService.js` para centralizar la gestión de datos, desacoplando completamente la lógica de la API de la interfaz de usuario.

### Estructura del proyecto

```
inventory-manager/
├── index.html
├── assets/
│   └── icons
├── css/
│   └── styles.css
└── js/
├── apiService.js
├── main.js
└── theme.js
```
