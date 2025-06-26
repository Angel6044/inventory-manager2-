// Clave para localStorage para guardar la preferencia del tema
const THEME_STORAGE_KEY = "themePreference";

/**
 * Aplica o remueve la clase 'dark-mode' del <body>.
 * Actualiza el texto y las clases del botón de alternar tema.
 * @param {boolean} isDarkMode - Si es true, aplica el modo oscuro; si es false, lo remueve.
 */
function applyTheme(isDarkMode) {
    const body = document.body;
    const themeToggleButton = document.getElementById("themeToggleBtn");

    if (isDarkMode) {
        body.classList.add("dark-mode");
        themeToggleButton.textContent = "Light Mode";
        themeToggleButton.classList.replace("btn-outline-secondary", "btn-outline-light");
    } else {
        body.classList.remove("dark-mode");
        themeToggleButton.textContent = "Dark Mode";
        themeToggleButton.classList.replace("btn-outline-light", "btn-outline-secondary");
    }
}

/**
 * Carga la preferencia de tema desde localStorage y la aplica.
 */
function loadThemePreference() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark") {
        applyTheme(true);
    } else {
        // Por defecto, aplica el modo claro si no hay preferencia o es 'light'
        applyTheme(false);
    }
}

/**
 * Alterna el tema (entre claro y oscuro) y guarda la preferencia en localStorage.
 */
function toggleTheme() {
    const body = document.body;
    const isCurrentlyDarkMode = body.classList.contains("dark-mode");

    // Cambiar al tema opuesto
    applyTheme(!isCurrentlyDarkMode);
    // Guardar la nueva preferencia en localStorage
    localStorage.setItem(THEME_STORAGE_KEY, !isCurrentlyDarkMode ? "dark" : "light");
    console.log(`Tema cambiado a: ${!isCurrentlyDarkMode ? 'Oscuro' : 'Claro'}`);
}

// --- Inicialización: Cargar tema y configurar el botón ---
document.addEventListener("DOMContentLoaded", () => {
    // Cargar la preferencia de tema al cargar la página
    loadThemePreference();
    const themeToggleButton = document.getElementById("themeToggleBtn");
    // Asegurarse de que el botón exista antes de intentar añadir un event listener
    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", toggleTheme);
    } else {
        console.error("¡Botón para alternar tema no encontrado!");
    }
});