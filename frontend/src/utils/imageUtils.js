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

  // Construir URL completa
  return `${API_BASE_URL}/uploads/${filename}`;
};

/**
 * Construye la URL completa para el logo del colegio
 * @param {string} logo - Nombre del archivo del logo
 * @returns {string|null} - URL completa del logo o null si no hay logo
 */
export const getColegioLogoUrl = (logo) => {
  return getImageUrl(logo);
};
