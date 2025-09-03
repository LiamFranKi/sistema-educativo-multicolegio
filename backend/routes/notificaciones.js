const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/notificaciones - Obtener notificaciones del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, leida } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE n.usuario_id = $1 AND n.activo = true';
    const params = [req.user.id];
    let paramCount = 1;

    // Filtro por estado de lectura
    if (leida !== undefined) {
      paramCount++;
      whereClause += ` AND n.leida = $${paramCount}`;
      params.push(leida === 'true');
    }

    const result = await query(
      `SELECT n.id, n.tipo, n.titulo, n.mensaje, n.datos_adicionales, n.leida,
              n.fecha_creacion, n.fecha_lectura
       FROM notificaciones n
       ${whereClause}
       ORDER BY n.fecha_creacion DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    // Contar total de registros
    const countResult = await query(
      `SELECT COUNT(*) as total FROM notificaciones n ${whereClause}`,
      params
    );

    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      notificaciones: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/notificaciones/no-leidas - Contar notificaciones no leídas
router.get('/no-leidas', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT COUNT(*) as count FROM notificaciones WHERE usuario_id = $1 AND leida = false AND activo = true',
      [req.user.id]
    );

    const count = parseInt(result.rows[0].count);

    res.json({
      success: true,
      count
    });

  } catch (error) {
    console.error('Error contando notificaciones no leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/notificaciones/:id/leer - Marcar notificación como leída
router.put('/:id/leer', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la notificación existe y pertenece al usuario
    const notificacionCheck = await query(
      'SELECT id FROM notificaciones WHERE id = $1 AND usuario_id = $2 AND activo = true',
      [id, req.user.id]
    );

    if (notificacionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    // Marcar como leída
    await query(
      'UPDATE notificaciones SET leida = true, fecha_lectura = NOW() WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Notificación marcada como leída'
    });

  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/notificaciones/leer-todas - Marcar todas las notificaciones como leídas
router.put('/leer-todas', authenticateToken, async (req, res) => {
  try {
    await query(
      'UPDATE notificaciones SET leida = true, fecha_lectura = NOW() WHERE usuario_id = $1 AND leida = false AND activo = true',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    });

  } catch (error) {
    console.error('Error marcando todas las notificaciones como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/notificaciones/:id - Eliminar notificación
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la notificación existe y pertenece al usuario
    const notificacionCheck = await query(
      'SELECT id FROM notificaciones WHERE id = $1 AND usuario_id = $2 AND activo = true',
      [id, req.user.id]
    );

    if (notificacionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    // Eliminar notificación (soft delete)
    await query('UPDATE notificaciones SET activo = false WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Notificación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/notificaciones/configuracion - Obtener configuración de notificaciones
router.get('/configuracion', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT tipo_notificacion, email, web_push, in_app FROM configuracion_notificaciones WHERE usuario_id = $1',
      [req.user.id]
    );

    // Si no hay configuración, usar valores por defecto
    if (result.rows.length === 0) {
      const defaultConfig = [
        { tipo_notificacion: 'nueva_publicacion', email: true, web_push: true, in_app: true },
        { tipo_notificacion: 'nuevo_comentario', email: true, web_push: true, in_app: true },
        { tipo_notificacion: 'nueva_reaccion', email: false, web_push: true, in_app: true },
        { tipo_notificacion: 'nuevo_alumno', email: true, web_push: true, in_app: true },
        { tipo_notificacion: 'nuevo_apoderado', email: true, web_push: true, in_app: true },
        { tipo_notificacion: 'asistencia', email: true, web_push: true, in_app: true },
        { tipo_notificacion: 'nota_nueva', email: true, web_push: true, in_app: true },
        { tipo_notificacion: 'evento_proximo', email: true, web_push: true, in_app: true },
        { tipo_notificacion: 'comunicado_importante', email: true, web_push: true, in_app: true }
      ];

      res.json({
        success: true,
        configuracion: defaultConfig
      });
    } else {
      res.json({
        success: true,
        configuracion: result.rows
      });
    }

  } catch (error) {
    console.error('Error obteniendo configuración de notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/notificaciones/configuracion - Actualizar configuración de notificaciones
router.put('/configuracion', authenticateToken, [
  body('configuracion').isArray().withMessage('Configuración debe ser un array'),
  body('configuracion.*.tipo_notificacion').notEmpty().withMessage('Tipo de notificación es requerido'),
  body('configuracion.*.email').isBoolean().withMessage('Email debe ser booleano'),
  body('configuracion.*.web_push').isBoolean().withMessage('Web push debe ser booleano'),
  body('configuracion.*.in_app').isBoolean().withMessage('In app debe ser booleano')
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

    const { configuracion } = req.body;

    // Eliminar configuración existente
    await query('DELETE FROM configuracion_notificaciones WHERE usuario_id = $1', [req.user.id]);

    // Insertar nueva configuración
    for (const config of configuracion) {
      await query(
        'INSERT INTO configuracion_notificaciones (usuario_id, tipo_notificacion, email, web_push, in_app, fecha_actualizacion) VALUES ($1, $2, $3, $4, $5, NOW())',
        [req.user.id, config.tipo_notificacion, config.email, config.web_push, config.in_app]
      );
    }

    res.json({
      success: true,
      message: 'Configuración de notificaciones actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando configuración de notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/notificaciones/suscripcion-web-push - Registrar suscripción Web Push
router.post('/suscripcion-web-push', authenticateToken, [
  body('endpoint').notEmpty().withMessage('Endpoint es requerido'),
  body('p256dh_key').optional().notEmpty().withMessage('P256DH key es requerido'),
  body('auth_token').optional().notEmpty().withMessage('Auth token es requerido')
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

    const { endpoint, p256dh_key, auth_token } = req.body;

    // Verificar si ya existe una suscripción para este endpoint
    const suscripcionExistente = await query(
      'SELECT id FROM suscripciones_web_push WHERE usuario_id = $1 AND endpoint = $2',
      [req.user.id, endpoint]
    );

    if (suscripcionExistente.rows.length > 0) {
      // Actualizar suscripción existente
      await query(
        'UPDATE suscripciones_web_push SET p256dh_key = $1, auth_token = $2, fecha_creacion = NOW(), activo = true WHERE id = $3',
        [p256dh_key, auth_token, suscripcionExistente.rows[0].id]
      );
    } else {
      // Crear nueva suscripción
      await query(
        'INSERT INTO suscripciones_web_push (usuario_id, endpoint, p256dh_key, auth_token, fecha_creacion, activo) VALUES ($1, $2, $3, $4, NOW(), true)',
        [req.user.id, endpoint, p256dh_key, auth_token]
      );
    }

    res.json({
      success: true,
      message: 'Suscripción Web Push registrada exitosamente'
    });

  } catch (error) {
    console.error('Error registrando suscripción Web Push:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/notificaciones/suscripcion-web-push/:endpoint - Eliminar suscripción Web Push
router.delete('/suscripcion-web-push/:endpoint', authenticateToken, async (req, res) => {
  try {
    const { endpoint } = req.params;

    // Eliminar suscripción
    await query(
      'UPDATE suscripciones_web_push SET activo = false WHERE usuario_id = $1 AND endpoint = $2',
      [req.user.id, endpoint]
    );

    res.json({
      success: true,
      message: 'Suscripción Web Push eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando suscripción Web Push:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
