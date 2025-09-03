const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/colegios - Obtener colegios
router.get('/', async (req, res) => {
  try {
    console.log('Solicitando colegios...');

    // Consulta simple para obtener todos los colegios activos
    const result = await query(
      `SELECT id, nombre, codigo, logo, color_primario, color_secundario,
              direccion, telefono, email, director_nombre, activo, created_at, updated_at
       FROM colegios
       WHERE activo = true
       ORDER BY created_at DESC`
    );

    console.log('Colegios encontrados:', result.rows.length);
    console.log('Primer colegio:', result.rows[0]);

    // Devolver directamente los datos
    res.json(result.rows);

  } catch (error) {
    console.error('Error obteniendo colegios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/colegios/:id - Obtener colegio por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, nombre, codigo, logo, color_primario, color_secundario,
              direccion, telefono, email, director_nombre, activo, created_at, updated_at
       FROM colegios WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Colegio no encontrado'
      });
    }

    res.json({
      success: true,
      colegio: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo colegio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/colegios - Crear colegio (solo superadministradores)
router.post('/', authenticateToken, requireSuperAdmin, [
  body('nombre').notEmpty().withMessage('Nombre del colegio es requerido'),
  body('codigo').notEmpty().withMessage('Código del colegio es requerido'),
  body('color_primario').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color primario inválido'),
  body('color_secundario').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color secundario inválido'),
  body('email').optional().isEmail().withMessage('Email inválido')
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
      nombre,
      codigo,
      logo,
      color_primario = '#1976d2',
      color_secundario = '#424242',
      direccion,
      telefono,
      email,
      director_nombre
    } = req.body;

    // Verificar si el código ya existe
    const codigoCheck = await query('SELECT id FROM colegios WHERE codigo = $1', [codigo]);
    if (codigoCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El código del colegio ya está registrado'
      });
    }

    // Verificar si el email ya existe
    if (email) {
      const emailCheck = await query('SELECT id FROM colegios WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }
    }

    // Crear colegio
    const result = await query(
      `INSERT INTO colegios (nombre, codigo, logo, color_primario, color_secundario,
                            direccion, telefono, email, director_nombre, activo, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW(), NOW())
       RETURNING id, nombre, codigo, logo, color_primario, color_secundario,
                 direccion, telefono, email, director_nombre, activo, created_at, updated_at`,
      [nombre, codigo, logo, color_primario, color_secundario, direccion, telefono, email, director_nombre]
    );

    res.status(201).json({
      success: true,
      message: 'Colegio creado exitosamente',
      colegio: result.rows[0]
    });

  } catch (error) {
    console.error('Error creando colegio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/colegios/:id - Actualizar colegio (solo superadministradores)
router.put('/:id', authenticateToken, requireSuperAdmin, [
  body('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('codigo').optional().notEmpty().withMessage('Código no puede estar vacío'),
  body('color_primario').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color primario inválido'),
  body('color_secundario').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color secundario inválido'),
  body('email').optional().isEmail().withMessage('Email inválido')
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
    const {
      nombre,
      codigo,
      logo,
      color_primario,
      color_secundario,
      direccion,
      telefono,
      email,
      director_nombre,
      activo
    } = req.body;

    // Verificar si el colegio existe
    const colegioCheck = await query('SELECT id FROM colegios WHERE id = $1', [id]);
    if (colegioCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Colegio no encontrado'
      });
    }

    // Verificar si el código ya existe en otro colegio
    if (codigo) {
      const codigoCheck = await query('SELECT id FROM colegios WHERE codigo = $1 AND id != $2', [codigo, id]);
      if (codigoCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El código del colegio ya está registrado por otro colegio'
        });
      }
    }

    // Verificar si el email ya existe en otro colegio
    if (email) {
      const emailCheck = await query('SELECT id FROM colegios WHERE email = $1 AND id != $2', [email, id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado por otro colegio'
        });
      }
    }

    // Actualizar colegio
    const result = await query(
      `UPDATE colegios
       SET nombre = COALESCE($1, nombre),
           codigo = COALESCE($2, codigo),
           logo = COALESCE($3, logo),
           color_primario = COALESCE($4, color_primario),
           color_secundario = COALESCE($5, color_secundario),
           direccion = COALESCE($6, direccion),
           telefono = COALESCE($7, telefono),
           email = COALESCE($8, email),
           director_nombre = COALESCE($9, director_nombre),
           activo = COALESCE($10, activo),
           updated_at = NOW()
       WHERE id = $11
       RETURNING id, nombre, codigo, logo, color_primario, color_secundario,
                 direccion, telefono, email, director_nombre, activo, created_at, updated_at`,
      [nombre, codigo, logo, color_primario, color_secundario, direccion, telefono, email, director_nombre, activo, id]
    );

    res.json({
      success: true,
      message: 'Colegio actualizado exitosamente',
      colegio: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando colegio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/colegios/:id - Eliminar colegio (solo superadministradores)
router.delete('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el colegio existe
    const colegioCheck = await query('SELECT id, nombre FROM colegios WHERE id = $1', [id]);
    if (colegioCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Colegio no encontrado'
      });
    }

    // Verificar si hay usuarios asociados al colegio
    const usuariosCheck = await query('SELECT COUNT(*) as count FROM usuarios WHERE colegio_id = $1', [id]);
    if (parseInt(usuariosCheck.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el colegio porque tiene usuarios asociados'
      });
    }

    // Eliminar colegio (soft delete - marcar como inactivo)
    await query('UPDATE colegios SET activo = false, updated_at = NOW() WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Colegio eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando colegio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
