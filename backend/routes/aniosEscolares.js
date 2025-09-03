const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/anios-escolares - Obtener años escolares
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { colegio_id, activo } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Filtro por colegio
    if (colegio_id) {
      paramCount++;
      whereClause += ` AND colegio_id = $${paramCount}`;
      params.push(colegio_id);
    }

    // Filtro por estado activo
    if (activo !== undefined) {
      paramCount++;
      whereClause += ` AND activo = $${paramCount}`;
      params.push(activo === 'true');
    }

    const result = await query(
      `SELECT ae.id, ae.colegio_id, ae.anio, ae.activo, ae.created_at, ae.updated_at,
              c.nombre as colegio_nombre
       FROM anios_escolares ae
       JOIN colegios c ON ae.colegio_id = c.id
       ${whereClause}
       ORDER BY ae.anio DESC`,
      params
    );

    res.json({
      success: true,
      anios_escolares: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo años escolares:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/anios-escolares/:id - Obtener año escolar por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT ae.id, ae.colegio_id, ae.anio, ae.activo, ae.created_at, ae.updated_at,
              c.nombre as colegio_nombre
       FROM anios_escolares ae
       JOIN colegios c ON ae.colegio_id = c.id
       WHERE ae.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Año escolar no encontrado'
      });
    }

    res.json({
      success: true,
      anio_escolar: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo año escolar:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/anios-escolares - Crear año escolar (solo administradores)
router.post('/', authenticateToken, requireAdmin, [
  body('colegio_id').isInt().withMessage('ID del colegio es requerido'),
  body('anio').isInt({ min: 2020, max: 2030 }).withMessage('Año debe estar entre 2020 y 2030')
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

    const { colegio_id, anio } = req.body;

    // Verificar si el colegio existe
    const colegioCheck = await query('SELECT id FROM colegios WHERE id = $1', [colegio_id]);
    if (colegioCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Colegio no encontrado'
      });
    }

    // Verificar si el año ya existe para este colegio
    const anioCheck = await query('SELECT id FROM anios_escolares WHERE colegio_id = $1 AND anio = $2', [colegio_id, anio]);
    if (anioCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El año escolar ya existe para este colegio'
      });
    }

    // Crear año escolar
    const result = await query(
      `INSERT INTO anios_escolares (colegio_id, anio, activo, created_at, updated_at)
       VALUES ($1, $2, true, NOW(), NOW())
       RETURNING id, colegio_id, anio, activo, created_at, updated_at`,
      [colegio_id, anio]
    );

    res.status(201).json({
      success: true,
      message: 'Año escolar creado exitosamente',
      anio_escolar: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando año escolar:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/anios-escolares/:id - Actualizar año escolar (solo administradores)
router.put('/:id', authenticateToken, requireAdmin, [
  body('anio').optional().isInt({ min: 2020, max: 2030 }).withMessage('Año debe estar entre 2020 y 2030')
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
    const { anio, activo } = req.body;

    // Verificar si el año escolar existe
    const anioCheck = await query('SELECT id, colegio_id FROM anios_escolares WHERE id = $1', [id]);
    if (anioCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Año escolar no encontrado'
      });
    }

    const colegio_id = anioCheck.rows[0].colegio_id;

    // Verificar si el año ya existe para este colegio (si se está cambiando)
    if (anio) {
      const anioExistsCheck = await query(
        'SELECT id FROM anios_escolares WHERE colegio_id = $1 AND anio = $2 AND id != $3',
        [colegio_id, anio, id]
      );
      if (anioExistsCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El año escolar ya existe para este colegio'
        });
      }
    }

    // Actualizar año escolar
    const result = await query(
      `UPDATE anios_escolares
       SET anio = COALESCE($1, anio),
           activo = COALESCE($2, activo),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, colegio_id, anio, activo, created_at, updated_at`,
      [anio, activo, id]
    );

    res.json({
      success: true,
      message: 'Año escolar actualizado exitosamente',
      anio_escolar: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando año escolar:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/anios-escolares/:id - Eliminar año escolar (solo administradores)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el año escolar existe
    const anioCheck = await query('SELECT id FROM anios_escolares WHERE id = $1', [id]);
    if (anioCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Año escolar no encontrado'
      });
    }

    // Eliminar año escolar (soft delete - marcar como inactivo)
    await query('UPDATE anios_escolares SET activo = false, updated_at = NOW() WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Año escolar eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando año escolar:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
