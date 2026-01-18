/**
 * Utility Functions Module
 */

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Format date for display
 */
export function formatDateDisplay(dateKey) {
    const date = new Date(dateKey + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Get month names in Spanish
 */
export const MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

/**
 * Create placeholder image SVG
 */
export function createPlaceholderImage(width = 100, height = 100) {
    return `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <rect fill="#333" width="${width}" height="${height}"/>
            <text fill="#999" x="${width/2}" y="${height/2}" 
                  text-anchor="middle" dy=".3em" font-size="14">No imagen</text>
        </svg>
    `)}`;
}

/**
 * Handle image load error
 */
export function handleImageError(img, placeholderWidth = 100, placeholderHeight = 100) {
    img.onerror = null; // Prevent infinite loop
    img.src = createPlaceholderImage(placeholderWidth, placeholderHeight);
    img.style.opacity = '0.5';
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

