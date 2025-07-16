// --- Declaración de variables, constantes y arrays ---
const NOMBRE_TIENDA = "Mi Tienda JS";
let inventario = []; // Array para almacenar los productos

// Constantes para los mensajes de la aplicación
const MSJ_BIENVENIDA = `¡Bienvenido al simulador de inventario de ${NOMBRE_TIENDA}!\nEl inventario se carga y guarda automáticamente.`;

const KEY_LOCALSTORAGE = "inventarioTiendaJS"; // Clave para localStorage

// --- Productos iniciales por defecto (si no hay datos en localStorage) ---
const PRODUCTOS_INICIALES = [
    { id: 1, nombre: "Leche", cantidad: 20, precio: 1.50 },
    { id: 2, nombre: "Pan", cantidad: 30, precio: 2.00 },
    { id: 3, nombre: "Huevos", cantidad: 12, precio: 3.25 },
    { id: 4, nombre: "Arroz", cantidad: 15, precio: 2.75 },
    { id: 5, nombre: "Pasta", cantidad: 25, precio: 1.80 },
    { id: 6, nombre: "Azúcar", cantidad: 10, precio: 4.00 },
    { id: 7, nombre: "Café", cantidad: 8, precio: 5.50 },
    { id: 8, nombre: "Aceite", cantidad: 7, precio: 6.75 },
    { id: 9, nombre: "Jabón", cantidad: 18, precio: 1.20 },
    { id: 10, nombre: "Champú", cantidad: 9, precio: 3.80 }
];

// --- Referencias a los elementos del DOM y Modales de Bootstrap ---
const inventoryTableBody = document.querySelector("#inventoryTable tbody");
const addProductBtn = document.getElementById("addProductBtn");
const sellProductBtn = document.getElementById("sellProductBtn");
const deleteAllProductsBtn = document.getElementById("deleteAllProductsBtn"); // Nuevo botón
const searchInput = document.getElementById("searchInput"); // Nuevo campo de búsqueda

const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const productModalLabel = document.getElementById('productModalLabel');
const productForm = document.getElementById('productForm');
const productIndexInput = document.getElementById('productIndex');
const productNameInput = document.getElementById('productName');
const productQuantityInput = document.getElementById('productQuantity');
const productPriceInput = document.getElementById('productPrice');
const productPriceGroup = document.getElementById('productPriceGroup'); // Para ocultar/mostrar el precio
const saveProductBtn = document.getElementById('saveProductBtn');

const sellModal = new bootstrap.Modal(document.getElementById('sellModal'));
const selectProductSale = document.getElementById('selectProductSale');
const quantityToSell = document.getElementById('quantityToSell');
const currentStockInfo = document.getElementById('currentStockInfo');
const sellForm = document.getElementById('sellForm');

const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
const confirmationModalLabel = document.getElementById('confirmationModalLabel');
const confirmationModalBody = document.getElementById('confirmationModalBody');
const confirmActionButton = document.getElementById('confirmActionButton');

const infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
const infoModalLabel = document.getElementById('infoModalLabel');
const infoModalBody = document.getElementById('infoModalBody');

// --- Funciones de Utilidad ---

/**
 * Muestra un modal informativo con un mensaje dado.
 * @param {string} title El título del modal.
 * @param {string} message El mensaje a mostrar en el cuerpo del modal.
 */
function showInfoModal(title, message) {
    infoModalLabel.textContent = title;
    infoModalBody.innerHTML = message;
    infoModal.show();
}

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
        // Asignar IDs únicos a los productos iniciales
        inventario = PRODUCTOS_INICIALES.map((prod, index) => ({ ...prod, id: index + 1 }));
        guardarInventario(); // Guardar los productos iniciales
        console.log("Inventario inicializado con productos por defecto.");
    }
}

/**
 * Genera un ID único para un nuevo producto.
 * Esto asegura que cada producto tenga un identificador distinto, útil para la modificación y eliminación.
 * @returns {number} Un ID único.
 */
function generateUniqueId() {
    // Si el inventario está vacío, el primer ID es 1.
    if (inventario.length === 0) {
        return 1;
    }
    // Encuentra el ID más alto existente y le suma 1.
    // Usamos reduce para encontrar el máximo ID, si no hay productos, empieza en 0.
    const maxId = inventario.reduce((max, product) => Math.max(max, product.id || 0), 0);
    return maxId + 1;
}

/**
 * Actualiza la tabla HTML con los datos del inventario, aplicando el filtro de búsqueda.
 * @param {string} searchTerm El término de búsqueda para filtrar la tabla.
 */
function actualizarTablaInventario(searchTerm = '') {
    const inventoryTableBody = document.querySelector("#inventoryTable tbody");
    inventoryTableBody.innerHTML = ''; // Limpiar la tabla antes de reconstruirla

    const filteredInventario = inventario.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredInventario.length === 0) {
        const row = inventoryTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5;
        cell.textContent = "No hay productos que coincidan con la búsqueda o el inventario está vacío.";
        cell.classList.add("text-center", "text-muted");
        return;
    }

    filteredInventario.forEach((producto, index) => {
        const row = inventoryTableBody.insertRow();
        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = producto.nombre;
        row.insertCell().textContent = producto.cantidad;
        row.insertCell().textContent = `$${producto.precio.toFixed(2)}`;

        const accionesCell = row.insertCell();
        accionesCell.classList.add('text-center');

        // Botón Modificar (imagen SVG desde assets/icons)
        const modifyButton = document.createElement("button");
        modifyButton.classList.add("btn", "btn-info", "btn-sm", "me-2");
        modifyButton.innerHTML = '<img src="assets/icons/pencil-square.svg" alt="Modify" class="icon-svg">';
        modifyButton.title = "Modificar producto";
        modifyButton.addEventListener("click", () => openProductModalForEdit(producto.id));
        accionesCell.appendChild(modifyButton);

        // Botón Eliminar (imagen SVG desde assets/icons)
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.innerHTML = '<img src="assets/icons/trash.svg" alt="Delete" class="icon-svg">';
        deleteButton.title = "Eliminar producto";
        deleteButton.addEventListener("click", () => showConfirmDeleteProductModal(producto.id, producto.nombre));
        accionesCell.appendChild(deleteButton);
    });
    console.log("Tabla de inventario actualizada en HTML.");
}

// --- Funciones JS que generan interacción (refactorizadas para usar modales) ---

/**
 * Abre el modal para agregar un nuevo producto.
 */
function openAddProductModal() {
    productModalLabel.textContent = 'Add New Product';
    productNameInput.value = '';
    productQuantityInput.value = '';
    productPriceInput.value = '';
    productIndexInput.value = ''; // No hay índice para un nuevo producto
    productPriceGroup.style.display = 'block'; // Asegurarse de que el precio sea visible para agregar
    saveProductBtn.textContent = 'Add Product';
    saveProductBtn.onclick = handleAddProduct; // Asignar la función para agregar
    productModal.show();
}

/**
 * Maneja la lógica para agregar un producto desde el modal.
 */
function handleAddProduct(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    let nombre = productNameInput.value.trim();
    let cantidad = parseInt(productQuantityInput.value);
    let precio = parseFloat(productPriceInput.value);

    if (!nombre) {
        showInfoModal('Error', 'Product name cannot be empty. Please try again.');
        return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
        showInfoModal('Error', 'Quantity must be a positive number. Please try again.');
        return;
    }
    if (isNaN(precio) || precio <= 0) {
        showInfoModal('Error', 'Price must be a positive number. Please try again.');
        return;
    }

    // Normalizar el nombre para evitar duplicados por capitalización
    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    // Buscar si el producto ya existe utilizando `find`
    const productoExistente = inventario.find(p => p.nombre === nombre);

    if (productoExistente) {
        // Si el producto existe, sumar la cantidad
        productoExistente.cantidad += cantidad;
        showInfoModal('Product Updated', `Product "${nombre}" already exists. ${cantidad} units have been added. New stock: ${productoExistente.cantidad}`);
        console.log(`[ACTUALIZADO] ${nombre} - Cantidad: ${productoExistente.cantidad}`);
    } else {
        // Si es un producto nuevo
        const nuevoProducto = {
            id: generateUniqueId(), // Asignar un ID único
            nombre: nombre,
            cantidad: cantidad,
            precio: precio
        };
        inventario.push(nuevoProducto);
        showInfoModal('Product Added', `Product "${nuevoProducto.nombre}" added to inventory with ${nuevoProducto.cantidad} units.`);
        console.log(`[AGREGADO]`, nuevoProducto);
    }

    guardarInventario();
    actualizarTablaInventario();
    productModal.hide(); // Ocultar el modal
    console.log("Inventario actual:", inventario);
}

/**
 * Abre el modal para modificar un producto existente.
 * @param {number} productId El ID del producto a modificar.
 */
function openProductModalForEdit(productId) {
    // Usamos `find` para encontrar el producto por su ID
    const productToEdit = inventario.find(p => p.id === productId);

    if (productToEdit) {
        productModalLabel.textContent = 'Modify Product';
        productNameInput.value = productToEdit.nombre;
        productQuantityInput.value = productToEdit.cantidad;
        productPriceInput.value = productToEdit.precio;
        productIndexInput.value = productId; // Guardamos el ID del producto en un campo oculto
        productPriceGroup.style.display = 'block'; // Asegurarse de que el precio sea visible para modificar
        saveProductBtn.textContent = 'Save Changes';
        saveProductBtn.onclick = handleModifyProduct; // Asignar la función para modificar
        productModal.show();
    } else {
        showInfoModal('Error', 'Product not found.');
        console.error(`Producto con ID ${productId} no encontrado.`);
    }
}

/**
 * Maneja la lógica para modificar un producto desde el modal.
 */
function handleModifyProduct(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const productId = parseInt(productIndexInput.value); // Obtener el ID del producto
    let nombre = productNameInput.value.trim();
    let cantidad = parseInt(productQuantityInput.value);
    let precio = parseFloat(productPriceInput.value);

    if (!nombre) {
        showInfoModal('Error', 'Product name cannot be empty. Please try again.');
        return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
        showInfoModal('Error', 'Quantity must be a positive number. Please try again.');
        return;
    }
    if (isNaN(precio) || precio <= 0) {
        showInfoModal('Error', 'Price must be a positive number. Please try again.');
        return;
    }

    // Usamos `find` para encontrar el producto por su ID
    const productToModify = inventario.find(p => p.id === productId);

    if (productToModify) {
        productToModify.nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        productToModify.cantidad = cantidad;
        productToModify.precio = precio;

        showInfoModal('Product Modified', `Product "${productToModify.nombre}" has been updated.`);
        console.log(`[MODIFICADO]`, productToModify);
        guardarInventario();
        actualizarTablaInventario();
        productModal.hide(); // Ocultar el modal
    } else {
        showInfoModal('Error', 'Product not found for modification.');
        console.error(`Producto con ID ${productId} no encontrado para modificar.`);
    }
    console.log("Inventario actual:", inventario);
}


/**
 * Abre el modal para simular una venta.
 */
function openSellProductModal() {
    if (inventario.length === 0) {
        showInfoModal('Inventory Empty', 'There are no products in the inventory to sell. Please add some first!');
        return;
    }

    // Limpiar y poblar el select de productos
    selectProductSale.innerHTML = '<option value="">-- Select a product --</option>';
    inventario.forEach((p, i) => {
        const option = document.createElement('option');
        option.value = p.id; // Usar el ID del producto como valor
        option.textContent = `${p.nombre} (Stock: ${p.cantidad})`;
        selectProductSale.appendChild(option);
    });

    // Resetear el campo de cantidad y stock info
    quantityToSell.value = '';
    currentStockInfo.textContent = '';
    sellModal.show();
}

/**
 * Actualiza la información de stock actual en el modal de venta cuando se selecciona un producto.
 */
selectProductSale.addEventListener('change', () => {
    const selectedProductId = parseInt(selectProductSale.value);
    // Usamos `find` para obtener el producto seleccionado
    const selectedProduct = inventario.find(p => p.id === selectedProductId);

    if (selectedProduct) {
        currentStockInfo.textContent = `Current Stock: ${selectedProduct.cantidad}`;
        quantityToSell.max = selectedProduct.cantidad; // Limitar la cantidad a vender al stock disponible
    } else {
        currentStockInfo.textContent = '';
        quantityToSell.max = '';
    }
});

/**
 * Maneja la lógica para simular una venta desde el modal.
 */
function handleSellProduct(event) {
    event.preventDefault();

    const productIdToSell = parseInt(selectProductSale.value);
    let cantidadVender = parseInt(quantityToSell.value);

    if (isNaN(productIdToSell)) {
        showInfoModal('Error', 'Please select a product to sell.');
        return;
    }

    if (isNaN(cantidadVender) || cantidadVender <= 0) {
        showInfoModal('Error', 'The quantity to sell must be a positive number. Please try again.');
        return;
    }

    // Usamos `find` para encontrar el producto por su ID
    const productoSeleccionado = inventario.find(p => p.id === productIdToSell);

    if (!productoSeleccionado) {
        showInfoModal('Error', 'Selected product not found in inventory.');
        return;
    }

    if (cantidadVender > productoSeleccionado.cantidad) {
        showInfoModal('Not Enough Stock', `There is not enough stock of "${productoSeleccionado.nombre}". Only ${productoSeleccionado.cantidad} units remain.`);
    } else {
        productoSeleccionado.cantidad -= cantidadVender;
        showInfoModal('Sale Successful', `Successful sale of ${cantidadVender} units of "${productoSeleccionado.nombre}".\nRemaining Stock: ${productoSeleccionado.cantidad}`);
        console.log(`[VENTA] ${cantidadVender} unidades de ${productoSeleccionado.nombre}. Nuevo stock: ${productoSeleccionado.cantidad}`);

        // Si la cantidad llega a 0, preguntar si desea eliminarlo
        if (productoSeleccionado.cantidad === 0) {
            // Mostrar modal de confirmación para eliminar
            showConfirmDeleteProductModal(productoSeleccionado.id, productoSeleccionado.nombre, true);
        } else {
            guardarInventario();
            actualizarTablaInventario();
        }
        sellModal.hide(); // Ocultar el modal de venta
    }
    console.log("Inventario actualizado:", inventario);
}

/**
 * Muestra el modal de confirmación para eliminar un producto individual.
 * @param {number} productId El ID del producto a eliminar.
 * @param {string} productName El nombre del producto a eliminar.
 * @param {boolean} fromSale Indica si la eliminación proviene de una venta.
 */
function showConfirmDeleteProductModal(productId, productName, fromSale = false) {
    confirmationModalLabel.textContent = 'Confirm Deletion';
    confirmationModalBody.innerHTML = `Are you sure you want to delete "${productName}" from the inventory?`;
    confirmActionButton.onclick = () => {
        deleteProduct(productId);
        confirmationModal.hide();
        // Si la eliminación fue después de una venta y el stock llegó a 0,
        // ocultar también el modal de venta si aún está abierto.
        if (fromSale) {
            sellModal.hide();
        }
    };
    confirmationModal.show();
}

/**
 * Elimina un producto del inventario usando su ID.
 * @param {number} productId El ID del producto a eliminar.
 */
function deleteProduct(productId) {
    // Usamos `filter` para crear un nuevo array sin el producto a eliminar
    const initialLength = inventario.length;
    inventario = inventario.filter(p => p.id !== productId);

    if (inventario.length < initialLength) {
        showInfoModal('Product Deleted', `Product has been removed from inventory.`);
        console.log(`[ELIMINADO] Producto con ID ${productId}.`);
        guardarInventario();
        actualizarTablaInventario();
    } else {
        showInfoModal('Error', 'Product not found for deletion.');
        console.error(`Producto con ID ${productId} no encontrado para eliminar.`);
    }
}

/**
 * Muestra el modal de confirmación para eliminar todos los productos.
 */
function showConfirmDeleteAllProductsModal() {
    if (inventario.length === 0) {
        showInfoModal('Inventory Empty', 'There are no products to delete.');
        return;
    }
    confirmationModalLabel.textContent = 'Clear Inventory';
    confirmationModalBody.innerHTML = `Are you sure you want to delete ALL products from the inventory? This action cannot be undone.`;
    confirmActionButton.onclick = () => {
        deleteAllProducts();
        confirmationModal.hide();
    };
    confirmationModal.show();
}

/**
 * Elimina todos los productos del inventario.
 */
function deleteAllProducts() {
    inventario = []; // Vaciar el array
    guardarInventario();
    actualizarTablaInventario();
    showInfoModal('Inventory Cleared', 'All products have been removed from the inventory.');
    console.log("[ELIMINADO] Todos los productos del inventario.");
}

// --- Lógica principal: Cargar datos y configurar eventos ---

/**
 * Función que se ejecuta al cargar la página para inicializar el simulador.
 */
function iniciarSimulador() {
    showInfoModal('Welcome', MSJ_BIENVENIDA); // Usar modal para la bienvenida

    // Cargar datos del inventario (o inicializarlos)
    cargarInventario();
    // Mostrar el inventario en la tabla HTML inicialmente (sin filtro)
    actualizarTablaInventario();

    // Asignar eventos a los botones principales
    addProductBtn.addEventListener("click", openAddProductModal);
    sellProductBtn.addEventListener("click", openSellProductModal);
    deleteAllProductsBtn.addEventListener("click", showConfirmDeleteAllProductsModal); // Nuevo evento

    // Evento para el campo de búsqueda
    searchInput.addEventListener('keyup', () => {
        actualizarTablaInventario(searchInput.value);
    });

    // Asignar los handlers de los formularios a sus eventos de submit
    productForm.addEventListener('submit', (event) => {
        // Determinar si es agregar o modificar
        if (productIndexInput.value === '') {
            handleAddProduct(event);
        } else {
            handleModifyProduct(event);
        }
    });

    sellForm.addEventListener('submit', handleSellProduct);

    console.log("Simulador iniciado y botones configurados.");
}

// --- Invocación de la función principal al cargar el DOM ---
document.addEventListener("DOMContentLoaded", iniciarSimulador);