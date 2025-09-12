const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/anios-escolares - Obtener años escolares (público para configuración)
router.get('/', async (req, res) => {
  try {
    const { activo } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Filtro por estado activo
    if (activo !== undefined) {
      paramCount++;
      whereClause += ` AND activo = $${paramCount}`;
      params.push(activo === 'true');
    }

    const result = await query(
      `SELECT id, anio, activo, created_at, updated_at
       FROM anios_escolares
       ${whereClause}
       ORDER BY anio DESC`,
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
      `SELECT id, anio, activo, created_at, updated_at
       FROM anios_escolares
       WHERE id = $1`,
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

    const { anio } = req.body;

    // Verificar si el año ya existe
    const anioCheck = await query('SELECT id FROM anios_escolares WHERE anio = $1', [anio]);
    if (anioCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El año escolar ya existe'
      });
    }

    // Desactivar todos los años escolares existentes (solo puede haber uno activo)
    await query('UPDATE anios_escolares SET activo = false, updated_at = NOW()');

    // Crear año escolar como activo
    const result = await query(
      `INSERT INTO anios_escolares (anio, activo, created_at, updated_at)
       VALUES ($1, true, NOW(), NOW())
       RETURNING id, anio, activo, created_at, updated_at`,
      [anio]
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
    const anioCheck = await query('SELECT id FROM anios_escolares WHERE id = $1', [id]);
    if (anioCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Año escolar no encontrado'
      });
    }

    // Verificar si el año ya existe (si se está cambiando)
    if (anio) {
      const anioExistsCheck = await query(
        'SELECT id FROM anios_escolares WHERE anio = $1 AND id != $2',
        [anio, id]
      );
      if (anioExistsCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El año escolar ya existe'
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
       RETURNING id, anio, activo, created_at, updated_at`,
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
    const anioCheck = await query('SELECT id, anio FROM anios_escolares WHERE id = $1', [id]);
    if (anioCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Año escolar no encontrado'
      });
    }

    const anioEliminado = anioCheck.rows[0].anio;

    // Eliminar año escolar permanentemente (hard delete)
    await query('DELETE FROM anios_escolares WHERE id = $1', [id]);

    res.json({
      success: true,
      message: `Año escolar ${anioEliminado} eliminado permanentemente`
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
