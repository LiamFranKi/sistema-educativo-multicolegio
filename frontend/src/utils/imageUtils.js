// Utilidades para manejo de imágenes
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Construye la URL completa para una imagen
 * @param {string} filename - Nombre del archivo de imagen
 * @returns {string|null} - URL completa de la imagen o null si no hay archivo
 */
export const getImageUrl = (filename) => {
  if (!filename) return null;

  // Si ya es una URL completa, devolverla tal como está
  if (filename.startsWith('http')) {
    return filename;
  }

  // Si ya incluye una ruta de carpeta, usar tal como está
  if (filename.includes('/')) {
    return `${API_BASE_URL}/uploads/${filename}`;
  }

  // Construir URL completa (asumir que está en uploads/)
  return `${API_BASE_URL}/uploads/${filename}`;
};

/**
 * Construye la URL completa para el logo del colegio
 * @param {string} logo - Nombre del archivo del logo o ruta relativa
 * @returns {string|null} - URL completa del logo o null si no hay logo
 */
export const getColegioLogoUrl = (logo) => {
  if (!logo) return null;

  // Si ya es una URL completa, devolverla tal como está
  if (logo.startsWith('http')) {
    return logo;
  }

  // Si ya incluye la ruta completa, usar tal como está
  if (logo.includes('configuracion/logo/')) {
    return `${API_BASE_URL}/uploads/${logo}`;
  }

  // Construir URL completa para archivos locales (asumir que está en configuracion/logo)
  return `${API_BASE_URL}/uploads/configuracion/logo/${logo}`;
};

/**
 * Construye la URL completa para el fondo del login
 * @param {string} fondo - Nombre del archivo del fondo o ruta relativa
 * @returns {string|null} - URL completa del fondo o null si no hay fondo
 */
export const getFondoLoginUrl = (fondo) => {
  if (!fondo) return null;

  // Si ya es una URL completa, devolverla tal como está
  if (fondo.startsWith('http')) {
    return fondo;
  }

  // Si ya incluye la ruta completa, usar tal como está
  if (fondo.includes('configuracion/fondo/')) {
    return `${API_BASE_URL}/uploads/${fondo}`;
  }

  // Construir URL completa para archivos locales (asumir que está en configuracion/fondo)
  return `${API_BASE_URL}/uploads/configuracion/fondo/${fondo}`;
};
