import { cloudinaryApi } from './apiService';

/**
 * Servicio híbrido para subida de archivos
 * - Imágenes → Cloudinary
 * - Documentos → Railway (local)
 */
export const hybridFileService = {
  /**
   * Detecta el tipo de archivo y decide dónde subirlo
   * @param {File} file - Archivo a subir
   * @returns {Promise} - Resultado de la subida
   */
  async uploadFile(file, folder = 'sistema-educativo') {
    const fileType = this.getFileType(file);
    
    if (fileType === 'image') {
      return this.uploadImageToCloudinary(file, folder);
    } else if (fileType === 'document') {
      return this.uploadDocumentToRailway(file, folder);
    } else {
      throw new Error('Tipo de archivo no soportado');
    }
  },

  /**
   * Detecta el tipo de archivo
   * @param {File} file - Archivo a analizar
   * @returns {string} - 'image', 'document', 'video', 'other'
   */
  getFileType(file) {
    const mimeType = file.type.toLowerCase();
    
    // Imágenes
    if (mimeType.startsWith('image/')) {
      return 'image';
    }
    
    // Videos
    if (mimeType.startsWith('video/')) {
      return 'video';
    }
    
    // Documentos
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'application/rtf',
      'application/zip',
      'application/x-rar-compressed'
    ];
    
    if (documentTypes.includes(mimeType)) {
      return 'document';
    }
    
    return 'other';
  },

  /**
   * Sube imagen a Cloudinary
   * @param {File} file - Archivo de imagen
   * @param {string} folder - Carpeta en Cloudinary
   * @returns {Promise} - Resultado de Cloudinary
   */
  async uploadImageToCloudinary(file, folder) {
    try {
      const response = await cloudinaryApi.uploadFile(file);
      
      if (response.data.success) {
        return {
          success: true,
          type: 'cloudinary',
          url: response.data.data.url,
          public_id: response.data.data.public_id,
          filename: file.name,
          size: file.size,
          mimeType: file.type
        };
      } else {
        throw new Error(response.data.message || 'Error subiendo a Cloudinary');
      }
    } catch (error) {
      console.error('Error subiendo imagen a Cloudinary:', error);
      throw error;
    }
  },

  /**
   * Sube documento a Railway (local)
   * @param {File} file - Archivo de documento
   * @param {string} folder - Carpeta en Railway
   * @returns {Promise} - Resultado de Railway
   */
  async uploadDocumentToRailway(file, folder) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      
      const response = await fetch('/api/files/upload-document', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          type: 'railway',
          url: result.data.url,
          filename: result.data.filename,
          size: file.size,
          mimeType: file.type
        };
      } else {
        throw new Error(result.message || 'Error subiendo documento');
      }
    } catch (error) {
      console.error('Error subiendo documento a Railway:', error);
      throw error;
    }
  },

  /**
   * Elimina archivo según su tipo
   * @param {string} url - URL del archivo
   * @param {string} publicId - ID público (para Cloudinary)
   * @returns {Promise} - Resultado de eliminación
   */
  async deleteFile(url, publicId = null) {
    if (url.includes('cloudinary.com') && publicId) {
      // Eliminar de Cloudinary
      return await cloudinaryApi.deleteFile(publicId);
    } else {
      // Eliminar de Railway
      const filename = url.split('/').pop();
      const response = await fetch(`/api/files/delete-document/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return await response.json();
    }
  },

  /**
   * Obtiene información del archivo
   * @param {string} url - URL del archivo
   * @returns {Object} - Información del archivo
   */
  getFileInfo(url) {
    if (url.includes('cloudinary.com')) {
      return {
        type: 'cloudinary',
        provider: 'Cloudinary',
        cdn: true,
        optimized: true
      };
    } else {
      return {
        type: 'railway',
        provider: 'Railway',
        cdn: false,
        optimized: false
      };
    }
  }
};

export default hybridFileService;
