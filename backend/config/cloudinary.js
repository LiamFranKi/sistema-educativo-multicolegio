const cloudinary = require('cloudinary').v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir imagen
const uploadImage = async (file, folder = 'sistema-educativo') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto'
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Error subiendo imagen a Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función para eliminar imagen
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result
    };
  } catch (error) {
    console.error('Error eliminando imagen de Cloudinary:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage
};
