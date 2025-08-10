// --- Importar funciones de la API simulada ---
import { fetchProducts, saveProduct, deleteProductById, clearAllProducts } from './apiService.js';

// --- Declaración de variables, constantes y arrays ---
const NOMBRE_TIENDA = "Mi Tienda JS";
let inventario = []; // Ahora el inventario se cargará desde products.json

// Constantes para los mensajes de la aplicación
const MSJ_BIENVENIDA = `¡Bienvenido al simulador de inventario de ${NOMBRE_TIENDA}!\nEl inventario se carga y guarda automáticamente.`;

// --- Referencias a los elementos del DOM y Modales de Bootstrap ---
const inventoryTableBody = document.querySelector("#inventoryTable tbody");
const addProductBtn = document.getElementById("addProductBtn");
const sellProductBtn = document.getElementById("sellProductBtn");
const deleteAllProductsBtn = document.getElementById("deleteAllProductsBtn");
const searchInput = document.getElementById("searchInput");

const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const productModalLabel = document.getElementById('productModalLabel');
const productForm = document.getElementById('productForm');
const productIndexInput = document.getElementById('productIndex');
const productNameInput = document.getElementById('productName');
const productQuantityInput = document.getElementById('productQuantity');
const productPriceInput = document.getElementById('productPrice');
const productPriceGroup = document.getElementById('productPriceGroup');
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
 * Genera un ID único para un nuevo producto.
 * Esto asegura que cada producto tenga un identificador distinto, útil para la modificación y eliminación.
 * @returns {number} Un ID único.
 */
function generateUniqueId() {
    if (inventario.length === 0) {
        return 1;
    }
    const maxId = inventario.reduce((max, product) => Math.max(max, product.id || 0), 0);
    return maxId + 1;
}

/**
 * Actualiza la tabla HTML con los datos del inventario, aplicando el filtro de búsqueda.
 * @param {string} searchTerm El término de búsqueda para filtrar la tabla.
 */
function actualizarTablaInventario(searchTerm = '') {
    const inventoryTableBody = document.querySelector("#inventoryTable tbody");
    inventoryTableBody.innerHTML = '';

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

        const modifyButton = document.createElement("button");
        modifyButton.classList.add("btn", "btn-info", "btn-sm", "me-2");
        modifyButton.innerHTML = '<img src="assets/icons/pencil-square.svg" alt="Modify" class="icon-svg">';
        modifyButton.title = "Modificar producto";
        modifyButton.addEventListener("click", () => openProductModalForEdit(producto.id));
        accionesCell.appendChild(modifyButton);

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
    productIndexInput.value = '';
    productPriceGroup.style.display = 'block';
    saveProductBtn.textContent = 'Add Product';
    // Se elimina el manejador directo, ahora el formulario tiene el evento submit
    productModal.show();
}

/**
 * Maneja la lógica para agregar un producto desde el modal.
 */
async function handleAddProduct(event) {
    event.preventDefault();

    let nombre = productNameInput.value.trim();
    let cantidad = parseInt(productQuantityInput.value);
    let precio = parseFloat(productPriceInput.value);

    if (!nombre || isNaN(cantidad) || cantidad <= 0 || isNaN(precio) || precio <= 0) {
        showInfoModal('Error', 'Please fill in all fields with valid data.');
        return;
    }

    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    try {
        const productoExistente = inventario.find(p => p.nombre === nombre);
        if (productoExistente) {
            const nuevoInventario = await saveProduct(inventario, {
                ...productoExistente,
                cantidad: productoExistente.cantidad + cantidad
            });
            inventario = nuevoInventario;
            showInfoModal('Product Updated', `Product "${nombre}" already exists. ${cantidad} units have been added. New stock: ${productoExistente.cantidad + cantidad}`);
        } else {
            const nuevoInventario = await saveProduct(inventario, {
                nombre: nombre,
                cantidad: cantidad,
                precio: precio
            });
            inventario = nuevoInventario;
            showInfoModal('Product Added', `Product "${nombre}" added to inventory with ${cantidad} units.`);
        }
        actualizarTablaInventario();
        productModal.hide();
    } catch (error) {
        showInfoModal('Error', `Failed to add product: ${error.message}`);
    }
}

/**
 * Abre el modal para modificar un producto existente.
 * @param {number} productId El ID del producto a modificar.
 */
function openProductModalForEdit(productId) {
    const productToEdit = inventario.find(p => p.id === productId);

    if (productToEdit) {
        productModalLabel.textContent = 'Modify Product';
        productNameInput.value = productToEdit.nombre;
        productQuantityInput.value = productToEdit.cantidad;
        productPriceInput.value = productToEdit.precio;
        productIndexInput.value = productId;
        productPriceGroup.style.display = 'block';
        saveProductBtn.textContent = 'Save Changes';
        productModal.show();
    } else {
        showInfoModal('Error', 'Product not found.');
        console.error(`Producto con ID ${productId} no encontrado.`);
    }
}

/**
 * Maneja la lógica para modificar un producto desde el modal.
 */
async function handleModifyProduct(event) {
    event.preventDefault();

    const productId = parseInt(productIndexInput.value);
    let nombre = productNameInput.value.trim();
    let cantidad = parseInt(productQuantityInput.value);
    let precio = parseFloat(productPriceInput.value);

    if (!nombre || isNaN(cantidad) || cantidad <= 0 || isNaN(precio) || precio <= 0) {
        showInfoModal('Error', 'Please fill in all fields with valid data.');
        return;
    }

    try {
        const productToModify = inventario.find(p => p.id === productId);
        if (productToModify) {
            const updatedProduct = {
                ...productToModify,
                nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase(),
                cantidad: cantidad,
                precio: precio
            };
            const nuevoInventario = await saveProduct(inventario, updatedProduct);
            inventario = nuevoInventario;

            showInfoModal('Product Modified', `Product "${updatedProduct.nombre}" has been updated.`);
            actualizarTablaInventario();
            productModal.hide();
        } else {
            showInfoModal('Error', 'Product not found for modification.');
        }
    } catch (error) {
        showInfoModal('Error', `Failed to modify product: ${error.message}`);
    }
}


/**
 * Abre el modal para simular una venta.
 */
function openSellProductModal() {
    if (inventario.length === 0) {
        showInfoModal('Inventory Empty', 'There are no products in the inventory to sell. Please add some first!');
        return;
    }

    selectProductSale.innerHTML = '<option value="">-- Select a product --</option>';
    inventario.forEach((p) => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.nombre} (Stock: ${p.cantidad})`;
        selectProductSale.appendChild(option);
    });

    quantityToSell.value = '';
    currentStockInfo.textContent = '';
    sellModal.show();
}

/**
 * Actualiza la información de stock actual en el modal de venta cuando se selecciona un producto.
 */
selectProductSale.addEventListener('change', () => {
    const selectedProductId = parseInt(selectProductSale.value);
    const selectedProduct = inventario.find(p => p.id === selectedProductId);

    if (selectedProduct) {
        currentStockInfo.textContent = `Current Stock: ${selectedProduct.cantidad}`;
        quantityToSell.max = selectedProduct.cantidad;
    } else {
        currentStockInfo.textContent = '';
        quantityToSell.max = '';
    }
});

/**
 * Maneja la lógica para simular una venta desde el modal.
 */
async function handleSellProduct(event) {
    event.preventDefault();

    const productIdToSell = parseInt(selectProductSale.value);
    let cantidadVender = parseInt(quantityToSell.value);

    if (isNaN(productIdToSell) || isNaN(cantidadVender) || cantidadVender <= 0) {
        showInfoModal('Error', 'Please select a product and enter a valid quantity to sell.');
        return;
    }

    const productoSeleccionado = inventario.find(p => p.id === productIdToSell);

    if (!productoSeleccionado) {
        showInfoModal('Error', 'Selected product not found in inventory.');
        return;
    }

    if (cantidadVender > productoSeleccionado.cantidad) {
        showInfoModal('Not Enough Stock', `There is not enough stock of "${productoSeleccionado.nombre}". Only ${productoSeleccionado.cantidad} units remain.`);
    } else {
        try {
            const updatedProduct = {
                ...productoSeleccionado,
                cantidad: productoSeleccionado.cantidad - cantidadVender
            };
            const nuevoInventario = await saveProduct(inventario, updatedProduct);
            inventario = nuevoInventario;

            showInfoModal('Sale Successful', `Successful sale of ${cantidadVender} units of "${productoSeleccionado.nombre}".\nRemaining Stock: ${updatedProduct.cantidad}`);
            console.log(`[VENTA] ${cantidadVender} unidades de ${productoSeleccionado.nombre}. Nuevo stock: ${updatedProduct.cantidad}`);

            if (updatedProduct.cantidad === 0) {
                showConfirmDeleteProductModal(updatedProduct.id, updatedProduct.nombre, true);
            } else {
                actualizarTablaInventario();
            }
            sellModal.hide();
        } catch (error) {
            showInfoModal('Error', `Failed to process sale: ${error.message}`);
        }
    }
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
        handleDeleteProduct(productId, fromSale);
        confirmationModal.hide();
    };
    confirmationModal.show();
}

/**
 * Elimina un producto del inventario usando su ID.
 * @param {number} productId El ID del producto a eliminar.
 * @param {boolean} fromSale Indica si la eliminación proviene de una venta.
 */
async function handleDeleteProduct(productId, fromSale = false) {
    try {
        const nuevoInventario = await deleteProductById(inventario, productId);
        if (nuevoInventario.length < inventario.length) {
            inventario = nuevoInventario;
            showInfoModal('Product Deleted', `Product has been removed from inventory.`);
            console.log(`[ELIMINADO] Producto con ID ${productId}.`);
            actualizarTablaInventario();
        } else {
            showInfoModal('Error', 'Product not found for deletion.');
        }
        if (fromSale) {
            sellModal.hide();
        }
    } catch (error) {
        showInfoModal('Error', `Failed to delete product: ${error.message}`);
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
    confirmActionButton.onclick = handleDeleteAllProducts;
    confirmationModal.show();
}

/**
 * Elimina todos los productos del inventario.
 */
async function handleDeleteAllProducts() {
    try {
        const nuevoInventario = await clearAllProducts();
        inventario = nuevoInventario;
        actualizarTablaInventario();
        confirmationModal.hide();
        showInfoModal('Inventory Cleared', 'All products have been removed from the inventory.');
        console.log("[ELIMINADO] Todos los productos del inventario.");
    } catch (error) {
        showInfoModal('Error', `Failed to clear inventory: ${error.message}`);
    }
}

// --- Lógica principal: Cargar datos y configurar eventos ---

/**
 * Función que se ejecuta al cargar la página para inicializar el simulador.
 */
async function iniciarSimulador() {
    showInfoModal('Welcome', MSJ_BIENVENIDA);

    // Cargar datos del inventario (o inicializarlos)
    try {
        inventario = await fetchProducts();
        console.log("Inventario cargado exitosamente desde products.json.");
    } catch (error) {
        console.error("No se pudo cargar el inventario:", error);
        showInfoModal('Error', error.message);
        inventario = [];
    }

    // Mostrar el inventario en la tabla HTML inicialmente (sin filtro)
    actualizarTablaInventario();

    // Asignar eventos a los botones principales
    addProductBtn.addEventListener("click", openAddProductModal);
    sellProductBtn.addEventListener("click", openSellProductModal);
    deleteAllProductsBtn.addEventListener("click", showConfirmDeleteAllProductsModal);

    // Evento para el campo de búsqueda
    searchInput.addEventListener('keyup', () => {
        actualizarTablaInventario(searchInput.value);
    });

    // Asignar los handlers de los formularios a sus eventos de submit
    productForm.addEventListener('submit', (event) => {
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