// helpers.js - Funciones de utilidad
// ============================================================

/**
 * Formatea un número con decimales específicos
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Número de decimales
 * @returns {string}
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '--';
  return Number(value).toFixed(decimals);
};

/**
 * Formatea un timestamp a hora legible
 * @param {number|Date} timestamp - Timestamp o fecha
 * @returns {string}
 */
export const formatTime = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Formatea un timestamp con fecha y hora
 * @param {number|Date} timestamp 
 * @returns {string}
 */
export const formatDateTime = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Calcula el porcentaje de batería basado en voltaje
 * @param {number} voltage - Voltaje actual
 * @param {number} minV - Voltaje mínimo (0%)
 * @param {number} maxV - Voltaje máximo (100%)
 * @returns {number} - Porcentaje (0-100)
 */
export const calculateBatteryPercentage = (voltage, minV = 9.0, maxV = 12.6) => {
  const percentage = ((voltage - minV) / (maxV - minV)) * 100;
  return Math.max(0, Math.min(100, percentage));
};

/**
 * Determina el color de estado basado en un valor y umbrales
 * @param {number} value - Valor a evaluar
 * @param {Object} thresholds - Umbrales { warning, danger }
 * @param {boolean} inverted - Si true, valores altos son buenos
 * @returns {string} - 'success' | 'warning' | 'danger'
 */
export const getStatusColor = (value, thresholds, inverted = false) => {
  const { warning, danger } = thresholds;
  
  if (inverted) {
    if (value >= danger) return 'success';
    if (value >= warning) return 'warning';
    return 'danger';
  } else {
    if (value >= danger) return 'danger';
    if (value >= warning) return 'warning';
    return 'success';
  }
};

/**
 * Genera un color basado en un porcentaje (verde a rojo)
 * @param {number} percentage - Porcentaje (0-100)
 * @param {boolean} inverted - Si true, 100% es rojo
 * @returns {string} - Color en formato HSL
 */
export const percentageToColor = (percentage, inverted = false) => {
  const value = inverted ? 100 - percentage : percentage;
  const hue = (value / 100) * 120; // 0 = rojo, 120 = verde
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Limita un array a un tamaño máximo (elimina los más antiguos)
 * @param {Array} array - Array a limitar
 * @param {number} maxSize - Tamaño máximo
 * @returns {Array}
 */
export const limitArraySize = (array, maxSize) => {
  if (array.length <= maxSize) return array;
  return array.slice(array.length - maxSize);
};

/**
 * Calcula la media de un array de números
 * @param {number[]} numbers 
 * @returns {number}
 */
export const average = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

/**
 * Calcula la desviación estándar
 * @param {number[]} numbers 
 * @returns {number}
 */
export const standardDeviation = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const avg = average(numbers);
  const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
  return Math.sqrt(average(squareDiffs));
};

/**
 * Debounce function
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function}
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Genera un ID único
 * @returns {string}
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Clona un objeto de forma profunda
 * @param {Object} obj 
 * @returns {Object}
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Convierte m/s a km/h
 * @param {number} mps - Metros por segundo
 * @returns {number} - Kilómetros por hora
 */
export const mpsToKmh = (mps) => mps * 3.6;

/**
 * Convierte km/h a m/s
 * @param {number} kmh - Kilómetros por hora
 * @returns {number} - Metros por segundo
 */
export const kmhToMps = (kmh) => kmh / 3.6;
