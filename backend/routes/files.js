const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { uploadImage, deleteImage } = require('../config/cloudinary');

const router = express.Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';

    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, filename);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'text/plain': '.txt',
    'video/mp4': '.mp4',
    'video/avi': '.avi',
    'video/mov': '.mov',
    'video/wmv': '.wmv'
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB por defecto
  }
});

// POST /api/files/upload-document - Subir documento a Railway
router.post('/upload-document', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    const folder = req.body.folder || 'documentos';
    const uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', folder);

    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(req.file.originalname);
    const filename = req.file.fieldname + '-' + uniqueSuffix + extension;
    const filePath = path.join(uploadPath, filename);

    // Mover archivo al destino final
    fs.renameSync(req.file.path, filePath);

    // Construir URL pública
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
    const publicUrl = `${baseUrl}/uploads/${folder}/${filename}`;

    res.json({
      success: true,
      message: 'Documento subido exitosamente',
      data: {
        filename: filename,
        originalName: req.file.originalname,
        url: publicUrl,
        size: req.file.size,
        type: req.file.mimetype,
        folder: folder
      }
    });

  } catch (error) {
    console.error('Error en upload-document:', error);

    // Limpiar archivo temporal si existe
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error limpiando archivo temporal:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/files/delete-document/:filename - Eliminar documento de Railway
router.delete('/delete-document/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const folder = req.query.folder || 'documentos';
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', folder, filename);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Eliminar archivo
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Documento eliminado exitosamente',
      data: {
        filename: filename,
        folder: folder
      }
    });

  } catch (error) {
    console.error('Error en delete-document:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/files/upload-cloudinary - Subir archivo a Cloudinary
router.post('/upload-cloudinary', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    // Subir a Cloudinary
    const result = await uploadImage(req.file, 'sistema-educativo');

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error subiendo archivo a Cloudinary',
        error: result.error
      });
    }

    // Eliminar archivo temporal
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: 'Archivo subido exitosamente a Cloudinary',
      data: {
        filename: req.file.originalname,
        url: result.url,
        public_id: result.public_id,
        size: req.file.size,
        type: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('Error en upload-cloudinary:', error);

    // Limpiar archivo temporal si existe
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error limpiando archivo temporal:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/files/delete-cloudinary/:publicId - Eliminar archivo de Cloudinary
router.delete('/delete-cloudinary/:publicId', authenticateToken, async (req, res) => {
  try {
    const { publicId } = req.params;

    const result = await deleteImage(publicId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error eliminando archivo de Cloudinary',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Archivo eliminado exitosamente de Cloudinary',
      data: result.result
    });

  } catch (error) {
    console.error('Error en delete-cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/files/upload - Subir archivo (local)
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha subido ningún archivo'
      });
    }

    const { type = 'general' } = req.body;
    const file = req.file;

    // Validar tipo de archivo según el tipo de subida
    if (type === 'profile' && !file.mimetype.startsWith('image/')) {
      // Eliminar archivo si no es imagen
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Para el perfil solo se permiten imágenes'
      });
    }

    if (type === 'video' && !file.mimetype.startsWith('video/')) {
      // Eliminar archivo si no es video
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Solo se permiten archivos de video'
      });
    }

    res.json({
      success: true,
      message: 'Archivo subido exitosamente',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      type: type
    });

  } catch (error) {
    console.error('Error subiendo archivo:', error);

    // Eliminar archivo si hubo error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/files/upload-multiple - Subir múltiples archivos
router.post('/upload-multiple', authenticateToken, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se han subido archivos'
      });
    }

    const { type = 'general' } = req.body;
    const files = req.files;

    const uploadedFiles = files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      message: 'Archivos subidos exitosamente',
      files: uploadedFiles,
      count: files.length,
      type: type
    });

  } catch (error) {
    console.error('Error subiendo archivos:', error);

    // Eliminar archivos si hubo error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/files/:filename - Obtener archivo
router.get('/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadPath, filename);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Obtener información del archivo
    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    // Determinar el tipo de contenido
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.txt': 'text/plain',
      '.mp4': 'video/mp4',
      '.avi': 'video/avi',
      '.mov': 'video/quicktime',
      '.wmv': 'video/x-ms-wmv'
    };

    res.setHeader('Content-Type', contentType[ext] || 'application/octet-stream');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Enviar archivo
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error obteniendo archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/files/:filename - Eliminar archivo
router.delete('/:filename', authenticateToken, (req, res) => {
  try {
    const { filename } = req.params;
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadPath, filename);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

    // Eliminar archivo
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando archivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/files - Listar archivos del usuario
router.get('/', authenticateToken, (req, res) => {
  try {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';

    // Verificar si el directorio existe
    if (!fs.existsSync(uploadPath)) {
      return res.json({
        success: true,
        files: []
      });
    }

    // Leer archivos del directorio
    const files = fs.readdirSync(uploadPath).map(filename => {
      const filePath = path.join(uploadPath, filename);
      const stats = fs.statSync(filePath);

      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime
      };
    });

    res.json({
      success: true,
      files
    });

  } catch (error) {
    console.error('Error listando archivos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
