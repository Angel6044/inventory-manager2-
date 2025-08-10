/**
 * apiService.js
 * * Este archivo contiene todas las funciones para interactuar con la API de mockapi.io.
 * Centraliza las llamadas a `fetch` y el manejo de errores.
 */

// URL de tu API de mockapi.io, corregida para apuntar directamente al recurso 'products'
const API_URL = 'https://6899290bddf05523e560986b.mockapi.io/api/v1/products';

/**
 * Carga el inventario inicial desde la API.
 * @returns {Promise<Array>} Una promesa que se resuelve con el array de productos si es exitosa.
 * @throws {Error} Lanza un error si la carga falla.
 */
export async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Inventario cargado exitosamente desde la API.");
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("No se pudo cargar el inventario. Verifique la conexión o la ruta de la API.");
    }
}

/**
 * Simula la adición o actualización de un producto.
 * Utiliza POST para nuevos productos y PUT para productos existentes.
 * @param {Array} currentInventory El inventario actual en memoria (no usado para la API, pero útil para la lógica de UI).
 * @param {Object} product El producto a agregar o modificar.
 * @returns {Promise<Object>} Una promesa que se resuelve con el producto guardado si es exitosa.
 */
export async function saveProduct(currentInventory, product) {
    try {
        let response;
        if (product.id) {
            // Si el producto tiene un ID, es una actualización (PUT)
            console.log(`[API] Enviando petición PUT para el producto con ID: ${product.id}`);
            response = await fetch(`${API_URL}/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        } else {
            // Si el producto no tiene ID, es una creación (POST)
            console.log(`[API] Enviando petición POST para un nuevo producto.`);
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error saving product:", error);
        throw new Error("No se pudo guardar el producto. Verifique la conexión o la API.");
    }
}

/**
 * Elimina un producto de la API usando su ID.
 * @param {Array} currentInventory (no usado en esta versión, pero la interfaz lo requiere).
 * @param {number} productId El ID del producto a eliminar.
 * @returns {Promise<void>} Una promesa que se resuelve cuando la eliminación es exitosa.
 */
export async function deleteProductById(currentInventory, productId) {
    try {
        console.log(`[API] Enviando petición DELETE para el producto con ID: ${productId}`);
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Producto con ID ${productId} eliminado exitosamente.`);
    } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("No se pudo eliminar el producto. Verifique la conexión o la API.");
    }
}

/**
 * Simula la eliminación de todos los productos.
 * mockapi.io no tiene un endpoint para esto, así que lo hacemos uno por uno.
 * @returns {Promise<void>}
 */
export async function clearAllProducts() {
    try {
        console.log("[API] Limpiando todo el inventario...");
        // Primero, obtenemos todos los productos
        const allProducts = await fetchProducts();
        // Luego, eliminamos cada uno
        const deletePromises = allProducts.map(product => deleteProductById([], product.id));
        await Promise.all(deletePromises);

        console.log("Inventario limpiado exitosamente.");
    } catch (error) {
        console.error("Error clearing all products:", error);
        throw new Error("No se pudo limpiar el inventario. Verifique la conexión o la API.");
    }
}