const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireDocente } = require('../middleware/auth');

const router = express.Router();

// GET /api/publicaciones - Obtener publicaciones
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, grado_id, docente_id, tipo } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE p.activo = true';
    const params = [];
    let paramCount = 0;

    // Filtro por grado
    if (grado_id) {
      paramCount++;
      whereClause += ` AND p.grado_id = $${paramCount}`;
      params.push(grado_id);
    }

    // Filtro por docente
    if (docente_id) {
      paramCount++;
      whereClause += ` AND p.docente_id = $${paramCount}`;
      params.push(docente_id);
    }

    // Filtro por tipo
    if (tipo) {
      paramCount++;
      whereClause += ` AND p.tipo = $${paramCount}`;
      params.push(tipo);
    }

    const result = await query(
      `SELECT p.id, p.contenido, p.tipo, p.imagen, p.link, p.archivo, p.nombre_archivo,
              p.fecha_creacion, p.fecha_actualizacion,
              u.nombres as docente_nombre, u.foto as docente_foto,
              g.nombre as grado_nombre
       FROM publicaciones p
       JOIN usuarios u ON p.docente_id = u.id
       JOIN grados g ON p.grado_id = g.id
       ${whereClause}
       ORDER BY p.fecha_creacion DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    // Contar total de registros
    const countResult = await query(
      `SELECT COUNT(*) as total FROM publicaciones p ${whereClause}`,
      params
    );

    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      publicaciones: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo publicaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/publicaciones/:id - Obtener publicación por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT p.id, p.contenido, p.tipo, p.imagen, p.link, p.archivo, p.nombre_archivo,
              p.fecha_creacion, p.fecha_actualizacion,
              u.nombres as docente_nombre, u.foto as docente_foto,
              g.nombre as grado_nombre
       FROM publicaciones p
       JOIN usuarios u ON p.docente_id = u.id
       JOIN grados g ON p.grado_id = g.id
       WHERE p.id = $1 AND p.activo = true`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada'
      });
    }

    res.json({
      success: true,
      publicacion: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo publicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/publicaciones - Crear publicación (solo docentes)
router.post('/', authenticateToken, requireDocente, [
  body('contenido').notEmpty().withMessage('Contenido es requerido'),
  body('grado_id').isInt().withMessage('ID del grado es requerido'),
  body('tipo').optional().isIn(['texto', 'imagen', 'link', 'archivo']).withMessage('Tipo inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const {
      contenido,
      grado_id,
      anio_lectivo_id,
      tipo = 'texto',
      imagen,
      link,
      archivo,
      nombre_archivo
    } = req.body;

    // Verificar si el grado existe
    const gradoCheck = await query('SELECT id FROM grados WHERE id = $1', [grado_id]);
    if (gradoCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Grado no encontrado'
      });
    }

    // Crear publicación
    const result = await query(
      `INSERT INTO publicaciones (docente_id, grado_id, anio_lectivo_id, contenido, tipo,
                                 imagen, link, archivo, nombre_archivo, fecha_creacion, fecha_actualizacion, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), true)
       RETURNING id, contenido, tipo, imagen, link, archivo, nombre_archivo, fecha_creacion, fecha_actualizacion`,
      [req.user.id, grado_id, anio_lectivo_id, contenido, tipo, imagen, link, archivo, nombre_archivo]
    );

    res.status(201).json({
      success: true,
      message: 'Publicación creada exitosamente',
      publicacion: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando publicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/publicaciones/:id - Actualizar publicación
router.put('/:id', authenticateToken, [
  body('contenido').optional().notEmpty().withMessage('Contenido no puede estar vacío')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { contenido, imagen, link, archivo, nombre_archivo } = req.body;

    // Verificar si la publicación existe y pertenece al usuario
    const publicacionCheck = await query(
      'SELECT id, docente_id FROM publicaciones WHERE id = $1 AND activo = true',
      [id]
    );

    if (publicacionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada'
      });
    }

    // Verificar permisos (solo el docente que creó la publicación puede editarla)
    if (publicacionCheck.rows[0].docente_id !== req.user.id && !['Superadministrador', 'Administrador'].includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar esta publicación'
      });
    }

    // Actualizar publicación
    const result = await query(
      `UPDATE publicaciones
       SET contenido = COALESCE($1, contenido),
           imagen = COALESCE($2, imagen),
           link = COALESCE($3, link),
           archivo = COALESCE($4, archivo),
           nombre_archivo = COALESCE($5, nombre_archivo),
           fecha_actualizacion = NOW()
       WHERE id = $6
       RETURNING id, contenido, tipo, imagen, link, archivo, nombre_archivo, fecha_creacion, fecha_actualizacion`,
      [contenido, imagen, link, archivo, nombre_archivo, id]
    );

    res.json({
      success: true,
      message: 'Publicación actualizada exitosamente',
      publicacion: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando publicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/publicaciones/:id - Eliminar publicación
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la publicación existe y pertenece al usuario
    const publicacionCheck = await query(
      'SELECT id, docente_id FROM publicaciones WHERE id = $1 AND activo = true',
      [id]
    );

    if (publicacionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada'
      });
    }

    // Verificar permisos (solo el docente que creó la publicación puede eliminarla)
    if (publicacionCheck.rows[0].docente_id !== req.user.id && !['Superadministrador', 'Administrador'].includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta publicación'
      });
    }

    // Eliminar publicación (soft delete)
    await query('UPDATE publicaciones SET activo = false, fecha_actualizacion = NOW() WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Publicación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando publicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/publicaciones/:id/reaccionar - Reaccionar a publicación
router.post('/:id/reaccionar', authenticateToken, [
  body('tipo_reaccion').isIn(['me_gusta', 'me_encanta', 'me_divierte', 'me_asombra', 'me_entristece', 'me_enoja']).withMessage('Tipo de reacción inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { tipo_reaccion } = req.body;

    // Verificar si la publicación existe
    const publicacionCheck = await query('SELECT id FROM publicaciones WHERE id = $1 AND activo = true', [id]);
    if (publicacionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada'
      });
    }

    // Verificar si ya existe una reacción del usuario
    const reaccionExistente = await query(
      'SELECT id, tipo_reaccion FROM reacciones_publicacion WHERE publicacion_id = $1 AND usuario_id = $2',
      [id, req.user.id]
    );

    if (reaccionExistente.rows.length > 0) {
      // Actualizar reacción existente
      await query(
        'UPDATE reacciones_publicacion SET tipo_reaccion = $1, fecha_reaccion = NOW() WHERE id = $2',
        [tipo_reaccion, reaccionExistente.rows[0].id]
      );
    } else {
      // Crear nueva reacción
      await query(
        'INSERT INTO reacciones_publicacion (publicacion_id, usuario_id, tipo_reaccion, fecha_reaccion) VALUES ($1, $2, $3, NOW())',
        [id, req.user.id, tipo_reaccion]
      );
    }

    res.json({
      success: true,
      message: 'Reacción guardada exitosamente'
    });

  } catch (error) {
    console.error('Error guardando reacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/publicaciones/:id/comentar - Comentar en publicación
router.post('/:id/comentar', authenticateToken, [
  body('contenido').notEmpty().withMessage('Contenido del comentario es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { contenido } = req.body;

    // Verificar si la publicación existe
    const publicacionCheck = await query('SELECT id FROM publicaciones WHERE id = $1 AND activo = true', [id]);
    if (publicacionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada'
      });
    }

    // Crear comentario
    const result = await query(
      'INSERT INTO comentarios_publicacion (publicacion_id, usuario_id, contenido, fecha_comentario, activo) VALUES ($1, $2, $3, NOW(), true) RETURNING id, contenido, fecha_comentario',
      [id, req.user.id, contenido]
    );

    res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      comentario: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
