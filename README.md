# Inventory-Manager

Este es un Simulador Básico de Gestión de Inventario desarrollado con HTML, CSS (Bootstrap 5.3) y JavaScript. El objetivo principal es proporcionar una herramienta sencilla y atractiva para simular la administración de productos en una tienda pequeña.

# 🚀 Características:

#### Gestión de Productos:

**Agregar Producto:** Añade nuevos productos al inventario o incrementa la cantidad de los existentes.

**Simular Venta:** Reduce el stock de un producto. Si el stock llega a cero, ofrece la opción de eliminar el producto.

**Limpiar Inventario:** Elimina todos los productos del inventario de una sola vez.

**Eliminar Producto:** Elimina un producto específico directamente desde la tabla.

**Modificar Producto:** Modifica cualquier atributo (nombre, cantidad, precio) de un producto específico.

#### Interfaz Interactiva:

**Tabla Dinámica:** Muestra el inventario actual en una tabla HTML que se actualiza en tiempo real.

**Buscador de Productos:** Permite filtrar productos en tiempo real por su nombre.

**Botones de Acción:** La interacción principal se realiza a través de botones "Agregar Producto", "Simular Venta" y "Limpiar Inventario", además de las opciones de "Eliminar" y "Modificar" en cada fila de la tabla.

**Modales de Bootstrap 5.3:** Se utilizan modales modernos y responsivos, reemplazando los antiguos prompt, alert y confirm del navegador.

**Selector de Tema:** Permite alternar entre un tema claro y oscuro para una mejor experiencia visual.

# Novedades y Mejoras ✨

**Modularidad del Código:** La lógica de la aplicación está dividida en módulos (main.js, apiService.js), lo que mejora la organización y la reutilización del código.

**API Simulada con fetch:** Los datos del inventario se gestionan a través de una API simulada que utiliza la función fetch para leer los productos de un archivo products.json. Esto desacopla la lógica de la interfaz de usuario de la lógica de datos.

**Manejo Asíncrono de Datos:** Las operaciones de carga, agregación, modificación y eliminación de productos son asíncronas, imitando el comportamiento de una aplicación web moderna que interactúa con un servidor.

**Manejo de Errores:** Todas las llamadas a la API simulada están envueltas en bloques try...catch para garantizar un manejo de errores robusto.

# Estructura del proyecto

inventory-manager/
├── index.html
├── assets/
│   └── icons
├── css/
│   └── styles.css
├── data/
│   └── products.json
└── js/
    ├── apiService.js
    ├── main.js
    └── theme.js