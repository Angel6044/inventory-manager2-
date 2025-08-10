/**
 * apiService.js
 * * Este archivo contiene todas las funciones para interactuar con la API simulada.
 * Centraliza las llamadas a `fetch` y el manejo de errores.
 */

// URL de la "API" simulada, en este caso, el archivo JSON local.
const API_URL = 'data/products.json';

/**
 * Carga el inventario inicial desde el archivo JSON.
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
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("No se pudo cargar el inventario. Verifique la conexión o la ruta del archivo.");
    }
}

// Simulación de otras funciones CRUD (Create, Read, Update, Delete)

/**
 * Simula la adición o actualización de un producto.
 * @param {Array} currentInventory El inventario actual en memoria.
 * @param {Object} product El producto a agregar o modificar.
 * @returns {Promise<Array>} Una promesa que se resuelve con el inventario actualizado.
 */
export async function saveProduct(currentInventory, product) {
    // En un entorno real, esto haría una llamada a la API (POST o PUT).
    // Aquí, simplemente simulamos el proceso.
    console.log(`[API SIMULADA] Guardando producto:`, product);
    const updatedInventory = [...currentInventory];
    const index = updatedInventory.findIndex(p => p.id === product.id);

    if (index !== -1) {
        // Modificar producto existente
        updatedInventory[index] = product;
    } else {
        // Agregar nuevo producto
        updatedInventory.push({ ...product, id: generateUniqueId(updatedInventory) });
    }

    // Simulamos un delay de red para que se sienta como una API de verdad
    await new Promise(resolve => setTimeout(resolve, 500)); 

    return updatedInventory;
}

/**
 * Simula la eliminación de un producto.
 * @param {Array} currentInventory El inventario actual en memoria.
 * @param {number} productId El ID del producto a eliminar.
 * @returns {Promise<Array>} Una promesa que se resuelve con el inventario actualizado.
 */
export async function deleteProductById(currentInventory, productId) {
    // En un entorno real, esto haría una llamada a la API (DELETE).
    // Aquí, simplemente simulamos el proceso.
    console.log(`[API SIMULADA] Eliminando producto con ID: ${productId}`);
    const updatedInventory = currentInventory.filter(p => p.id !== productId);

    // Simulamos un delay de red
    await new Promise(resolve => setTimeout(resolve, 300)); 

    return updatedInventory;
}

/**
 * Simula la eliminación de todos los productos.
 * @returns {Promise<Array>} Una promesa que se resuelve con un array vacío.
 */
export async function clearAllProducts() {
    // En un entorno real, esto haría una llamada a la API.
    // Aquí, simplemente simulamos el proceso.
    console.log(`[API SIMULADA] Limpiando todo el inventario.`);

    // Simulamos un delay de red
    await new Promise(resolve => setTimeout(resolve, 300)); 

    return [];
}

/**
 * Función auxiliar para generar IDs únicos, encapsulada en el servicio.
 * @param {Array} currentInventory
 * @returns {number}
 */
function generateUniqueId(currentInventory) {
    if (currentInventory.length === 0) {
        return 1;
    }
    const maxId = currentInventory.reduce((max, product) => Math.max(max, product.id || 0), 0);
    return maxId + 1;
}