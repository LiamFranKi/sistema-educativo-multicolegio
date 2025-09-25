const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WEBP)'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// GET /api/cursos - Listar cursos con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      nivel_id = '',
      activo = ''
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    // Construir condiciones WHERE
    if (search) {
      paramCount++;
      whereConditions.push(`(c.nombre ILIKE $${paramCount} OR c.descripcion ILIKE $${paramCount} OR c.abreviatura ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (nivel_id) {
      paramCount++;
      whereConditions.push(`c.nivel_id = $${paramCount}`);
      queryParams.push(nivel_id);
    }

    if (activo !== '') {
      paramCount++;
      whereConditions.push(`c.activo = $${paramCount}`);
      queryParams.push(activo === 'true');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Query para contar total
    paramCount++;
    const countQuery = `
      SELECT COUNT(*) as total
      FROM cursos c
      JOIN niveles n ON c.nivel_id = n.id
      ${whereClause}
    `;
    queryParams.push(1); // Dummy parameter for count query

    const countResult = await query(countQuery, queryParams.slice(0, -1));
    const total = parseInt(countResult.rows[0].total);

    // Query principal con datos
    paramCount = 0;
    queryParams = [];

    if (search) {
      paramCount++;
      queryParams.push(`%${search}%`);
    }

    if (nivel_id) {
      paramCount++;
      queryParams.push(nivel_id);
    }

    if (activo !== '') {
      paramCount++;
      queryParams.push(activo === 'true');
    }

    const dataQuery = `
      SELECT
        c.id,
        c.nombre,
        c.descripcion,
        c.abreviatura,
        c.nivel_id,
        n.nombre as nivel_nombre,
        c.imagen,
        c.activo,
        c.created_at,
        c.updated_at
      FROM cursos c
      JOIN niveles n ON c.nivel_id = n.id
      ${whereClause}
      ORDER BY n.orden, c.nombre
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const result = await query(dataQuery, queryParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo cursos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/cursos/:id - Obtener curso por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT
        c.id,
        c.nombre,
        c.descripcion,
        c.abreviatura,
        c.nivel_id,
        n.nombre as nivel_nombre,
        c.imagen,
        c.activo,
        c.created_at,
        c.updated_at
      FROM cursos c
      JOIN niveles n ON c.nivel_id = n.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/cursos - Crear nuevo curso
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, abreviatura, nivel_id, imagen, activo = true } = req.body;

    // Validaciones
    if (!nombre || !abreviatura || !nivel_id) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, abreviatura y nivel son obligatorios'
      });
    }

    // Verificar que el nivel existe
    const nivelCheck = await query('SELECT id FROM niveles WHERE id = $1', [nivel_id]);
    if (nivelCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El nivel especificado no existe'
      });
    }

    // Verificar que la abreviatura no existe
    const abreviaturaCheck = await query('SELECT id FROM cursos WHERE abreviatura = $1', [abreviatura]);
    if (abreviaturaCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un curso con esa abreviatura'
      });
    }

    // Verificar que no existe el mismo nombre en el mismo nivel
    const nombreCheck = await query('SELECT id FROM cursos WHERE nombre = $1 AND nivel_id = $2', [nombre, nivel_id]);
    if (nombreCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un curso con ese nombre en el nivel seleccionado'
      });
    }

    const result = await query(`
      INSERT INTO cursos (nombre, descripcion, abreviatura, nivel_id, imagen, activo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [nombre, descripcion, abreviatura, nivel_id, imagen, activo]);

    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PUT /api/cursos/:id - Actualizar curso
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, abreviatura, nivel_id, imagen, activo } = req.body;

    // Validaciones
    if (!nombre || !abreviatura || !nivel_id) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, abreviatura y nivel son obligatorios'
      });
    }

    // Verificar que el curso existe
    const cursoCheck = await query('SELECT * FROM cursos WHERE id = $1', [id]);
    if (cursoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar que el nivel existe
    const nivelCheck = await query('SELECT id FROM niveles WHERE id = $1', [nivel_id]);
    if (nivelCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El nivel especificado no existe'
      });
    }

    // Verificar que la abreviatura no existe en otro curso
    const abreviaturaCheck = await query('SELECT id FROM cursos WHERE abreviatura = $1 AND id != $2', [abreviatura, id]);
    if (abreviaturaCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro curso con esa abreviatura'
      });
    }

    // Verificar que no existe el mismo nombre en el mismo nivel en otro curso
    const nombreCheck = await query('SELECT id FROM cursos WHERE nombre = $1 AND nivel_id = $2 AND id != $3', [nombre, nivel_id, id]);
    if (nombreCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro curso con ese nombre en el nivel seleccionado'
      });
    }

    // Si hay nueva imagen, eliminar la anterior
    let imagenFinal = cursoCheck.rows[0].imagen;
    if (imagen) {
      // Eliminar imagen anterior si existe
      if (cursoCheck.rows[0].imagen) {
        const oldImagePath = path.join(__dirname, '../uploads', cursoCheck.rows[0].imagen);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagenFinal = imagen;
    }

    const result = await query(`
      UPDATE cursos
      SET nombre = $1, descripcion = $2, abreviatura = $3, nivel_id = $4,
          imagen = $5, activo = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [nombre, descripcion, abreviatura, nivel_id, imagenFinal, activo, id]);

    res.json({
      success: true,
      message: 'Curso actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/cursos/:id - Eliminar curso
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el curso existe
    const cursoCheck = await query('SELECT imagen FROM cursos WHERE id = $1', [id]);
    if (cursoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Eliminar imagen si existe
    if (cursoCheck.rows[0].imagen) {
      const imagePath = path.join(__dirname, '../uploads', cursoCheck.rows[0].imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await query('DELETE FROM cursos WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Curso eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/cursos/niveles/lista - Obtener lista de niveles para filtros
router.get('/niveles/lista', async (req, res) => {
  try {
    const result = await query('SELECT id, nombre FROM niveles WHERE activo = true ORDER BY orden');

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo niveles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
