// --- Declaración de variables, constantes y arrays ---
const NOMBRE_TIENDA = "Mi Tiendita JS";
let inventario = []; // Array para almacenar los productos

// Constantes para los mensajes de la aplicación
const MSJ_BIENVENIDA = `¡Bienvenido al simulador de inventario de ${NOMBRE_TIENDA}!\nEl inventario se carga y guarda automáticamente.`;
const MSJ_ERROR_ENTRADA = "Entrada inválida. Por favor, intenta de nuevo.";

const KEY_LOCALSTORAGE = "inventarioTiendaJS"; // Clave para localStorage

// --- Contraseña de Acceso ---
const PASSWORD_ACCESO = "IamFreelancer404"; // Contraseña por defecto
const MSJ_ACCESO_NEGADO = "Contraseña incorrecta. Acceso denegado.";
const MSJ_BIENVENIDO_ORDINARIO = "Bienvenido humano ordinario! Las cosas no serán sencillas para ti hoy, pero no te desanimes!!";


// --- Productos iniciales por defecto (si no hay datos en localStorage) ---
const PRODUCTOS_INICIALES = [
    { nombre: "Leche", cantidad: 20, precio: 1.50 },
    { nombre: "Pan", cantidad: 30, precio: 2.00 },
    { nombre: "Huevos", cantidad: 12, precio: 3.25 },
    { nombre: "Arroz", cantidad: 15, precio: 2.75 },
    { nombre: "Pasta", cantidad: 25, precio: 1.80 },
    { nombre: "Azúcar", cantidad: 10, precio: 4.00 },
    { nombre: "Café", cantidad: 8, precio: 5.50 },
    { nombre: "Aceite", cantidad: 7, precio: 6.75 },
    { nombre: "Jabón", cantidad: 18, precio: 1.20 },
    { nombre: "Champú", cantidad: 9, precio: 3.80 }
];

// --- Funciones de Utilidad ---

/**
 * Guarda el inventario actual en localStorage.
 */
function guardarInventario() {
    localStorage.setItem(KEY_LOCALSTORAGE, JSON.stringify(inventario));
    console.log("Inventario guardado en localStorage.");
}

/**
 * Carga el inventario desde localStorage.
 * Si no hay datos, inicializa con productos por defecto.
 */
function cargarInventario() {
    const inventarioGuardado = localStorage.getItem(KEY_LOCALSTORAGE);
    if (inventarioGuardado) {
        inventario = JSON.parse(inventarioGuardado);
        console.log("Inventario cargado desde localStorage.");
    } else {
        inventario = [...PRODUCTOS_INICIALES]; // Usar spread para copiar el array
        guardarInventario(); // Guardar los productos iniciales
        console.log("Inventario inicializado con productos por defecto.");
    }
}

/**
 * Actualiza la tabla HTML con los datos del inventario.
 */
function actualizarTablaInventario() {
    const tablaBody = document.querySelector("#inventoryTable tbody");
    tablaBody.innerHTML = ''; // Limpiar la tabla antes de reconstruirla

    if (inventario.length === 0) {
        const row = tablaBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5; // Cambiado a 5 por la nueva columna de acciones
        cell.textContent = "El inventario está vacío.";
        cell.classList.add("text-center", "text-muted"); // Clases Bootstrap para centrar y color
        return;
    }

    inventario.forEach((producto, index) => {
        const row = tablaBody.insertRow();
        row.insertCell().textContent = index + 1; // Número de enumeración
        row.insertCell().textContent = producto.nombre;
        row.insertCell().textContent = producto.cantidad;
        row.insertCell().textContent = `$${producto.precio.toFixed(2)}`;

        // Celda para el botón de eliminar
        const accionesCell = row.insertCell();
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add("btn", "btn-danger", "btn-sm"); // Clases Bootstrap
        // Asignar un manejador de eventos al botón de eliminar
        deleteButton.addEventListener("click", () => {
            eliminarProducto(index); // Llama a la función eliminarProducto con el índice
        });
        accionesCell.appendChild(deleteButton);
    });
    console.log("Tabla de inventario actualizada en HTML.");
}

// --- Funciones JS que generan interacción ---

/**
 * Función para solicitar y agregar un nuevo producto al inventario.
 * Entradas de datos: Nombre del producto, Cantidad, Precio
 * Procesamiento: Valida entradas, crea objeto producto, lo agrega al array.
 * Salida: Mensaje de confirmación en Alert y actualiza tabla.
 */
function agregarProducto() {
    let nombre = prompt("Ingresa el nombre del producto:").trim();
    if (!nombre) {
        alert("El nombre del producto no puede estar vacío. Inténtalo de nuevo.");
        return;
    }

    // Normalizar el nombre para evitar duplicados por capitalización
    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    // Validar si el producto ya existe
    const productoExistente = inventario.find(p => p.nombre === nombre);

    let cantidadStr = prompt(`Ingresa la cantidad inicial de ${nombre}:`);
    let cantidad = parseInt(cantidadStr);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("La cantidad debe ser un número positivo. Intenta de nuevo.");
        return;
    }

    if (productoExistente) {
        // Si el producto existe, sumar la cantidad
        productoExistente.cantidad += cantidad;
        alert(`Producto "${nombre}" ya existe. Se han agregado ${cantidad} unidades. Nuevo stock: ${productoExistente.cantidad}`);
        console.log(`[ACTUALIZADO] ${nombre} - Cantidad: ${productoExistente.cantidad}`);
    } else {
        // Si es un producto nuevo, pedir precio
        let precioStr = prompt(`Ingresa el precio unitario de ${nombre}:`);
        let precio = parseFloat(precioStr);
        if (isNaN(precio) || precio <= 0) {
            alert("El precio debe ser un número positivo. Intenta de nuevo.");
            return;
        }
        const nuevoProducto = {
            nombre: nombre,
            cantidad: cantidad,
            precio: precio
        };
        inventario.push(nuevoProducto);
        alert(`Producto "${nuevoProducto.nombre}" agregado al inventario con ${nuevoProducto.cantidad} unidades.`);
        console.log(`[AGREGADO]`, nuevoProducto);
    }

    guardarInventario();
    actualizarTablaInventario();
    console.log("Inventario actual:", inventario);
}

/**
 * Función para simular una venta de un producto.
 * Entradas: Número de producto a vender, Cantidad a vender.
 * Procesamiento: Busca el producto por índice, valida stock, actualiza cantidad.
 * Salida: Mensaje de éxito/error en Alert y actualiza tabla.
 */
function simularVenta() {
    if (inventario.length === 0) {
        alert("No hay productos en el inventario para vender. ¡Agrega algunos primero!");
        return;
    }

    // Mostrar el inventario en un alert para que el usuario pueda ver los números
    let mensajeInventarioParaPrompt = "Productos disponibles:\n";
    inventario.forEach((p, i) => {
        mensajeInventarioParaPrompt += `${i + 1}. ${p.nombre} (Stock: ${p.cantidad})\n`;
    });
    mensajeInventarioParaPrompt += "\nIngresa el NÚMERO del producto a vender:";


    let indiceStr = prompt(mensajeInventarioParaPrompt);
    let indice = parseInt(indiceStr) - 1; // Restamos 1 porque los arrays son base 0

    if (isNaN(indice) || indice < 0 || indice >= inventario.length) {
        alert("Número de producto no válido. Por favor, ingresa un número de la lista.");
        return;
    }

    const productoSeleccionado = inventario[indice];

    let cantidadVenderStr = prompt(`¿Cuántas unidades de "${productoSeleccionado.nombre}" deseas vender? (Stock actual: ${productoSeleccionado.cantidad})`);
    let cantidadVender = parseInt(cantidadVenderStr);

    if (isNaN(cantidadVender) || cantidadVender <= 0) {
        alert("La cantidad a vender debe ser un número positivo. Intenta de nuevo.");
        return;
    }

    if (cantidadVender > productoSeleccionado.cantidad) {
        alert(`No hay suficiente stock de "${productoSeleccionado.nombre}". Solo quedan ${productoSeleccionado.cantidad} unidades.`);
    } else {
        productoSeleccionado.cantidad -= cantidadVender;
        alert(`Venta exitosa de ${cantidadVender} unidades de "${productoSeleccionado.nombre}".\nStock restante: ${productoSeleccionado.cantidad}`);
        console.log(`[VENTA] ${cantidadVender} unidades de ${productoSeleccionado.nombre}. Nuevo stock: ${productoSeleccionado.cantidad}`);

        // Si la cantidad llega a 0, preguntar si desea eliminarlo
        if (productoSeleccionado.cantidad === 0) {
            let confirmarEliminar = confirm(`"${productoSeleccionado.nombre}" se ha agotado. ¿Deseas eliminarlo del inventario?`);
            if (confirmarEliminar) {
                // Llamamos a la nueva función eliminarProducto
                eliminarProducto(indice);
                return; // Salir para evitar doble actualización
            }
        }
        guardarInventario();
        actualizarTablaInventario(); // Re-renderizar la tabla para reflejar cambios
        console.log("Inventario actualizado:", inventario);
    }
}

/**
 * Función para eliminar un producto del inventario.
 * @param {number} index El índice del producto a eliminar en el array 'inventario'.
 */
function eliminarProducto(index) {
    if (index < 0 || index >= inventario.length) {
        alert("Índice de producto inválido para eliminar.");
        return;
    }

    const productoAEliminar = inventario[index];
    const confirmacion = confirm(`¿Estás seguro de que quieres eliminar "${productoAEliminar.nombre}" del inventario?`);

    if (confirmacion) {
        inventario.splice(index, 1); // Eliminar el elemento del array
        alert(`"${productoAEliminar.nombre}" ha sido eliminado del inventario.`);
        console.log(`[ELIMINADO] ${productoAEliminar.nombre}.`);
        guardarInventario();
        actualizarTablaInventario(); // Actualizar la tabla después de la eliminación
    } else {
        alert("Eliminación cancelada.");
    }
}

// --- Lógica principal: Cargar datos y configurar eventos ---

/**
 * Función que se ejecuta al cargar la página para inicializar el simulador.
 */
function iniciarSimulador() {
    // Primero, el alert de bienvenida general
    alert(MSJ_BIENVENIDA);

    // Luego, la solicitud de contraseña
    const password = prompt(`Por favor, ingresa la contraseña para acceder al simulador.
    (La contraseña es: "${PASSWORD_ACCESO}")
    O presiona "Cancelar" o escribe "No tengo" para continuar sin ella.`);

    if (password === null || password.toLowerCase() === "no tengo") {
        alert(MSJ_BIENVENIDO_ORDINARIO);
    } else if (password === PASSWORD_ACCESO) {
        // Contraseña correcta, no hacer nada especial, solo continuar
    } else {
        alert(MSJ_ACCESO_NEGADO);
        // Si la contraseña es incorrecta y no es "no tengo contraseña", denegar el acceso
        // y detener la ejecución del simulador.
        return;
    }

    // Si la contraseña es correcta o se elige la opción sin contraseña,
    // continuar con la carga e inicialización del simulador.
    cargarInventario(); // Cargar datos del inventario (o inicializarlos)
    actualizarTablaInventario(); // Mostrar el inventario en la tabla HTML

    // Asignar eventos a los botones principales
    document.getElementById("addProductBtn").addEventListener("click", agregarProducto);
    document.getElementById("sellProductBtn").addEventListener("click", simularVenta);

    console.log("Simulador iniciado y botones configurados.");
}

// --- Invocación de la función principal al cargar el DOM ---
document.addEventListener("DOMContentLoaded", iniciarSimulador);