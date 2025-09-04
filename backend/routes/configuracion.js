const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/configuracion - Obtener todas las configuraciones
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT clave, valor, descripcion, tipo, categoria FROM configuracion ORDER BY categoria, clave'
    );

    // Convertir array a objeto para facilitar el uso
    const configuraciones = {};
    result.rows.forEach(row => {
      // Convertir valores según el tipo
      let valor = row.valor;
      if (row.tipo === 'boolean') {
        valor = valor === 'true';
      } else if (row.tipo === 'number') {
        valor = parseFloat(valor);
      }

      configuraciones[row.clave] = {
        valor,
        descripcion: row.descripcion,
        tipo: row.tipo,
        categoria: row.categoria
      };
    });

    res.json({
      success: true,
      configuraciones
    });

  } catch (error) {
    console.error('Error obteniendo configuraciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/configuracion/colegio - Obtener configuraciones del colegio (PÚBLICO)
router.get('/colegio', async (req, res) => {
  try {
    const result = await query(
      `SELECT clave, valor, descripcion, tipo
       FROM configuracion
       WHERE categoria = 'colegio'
       ORDER BY clave`
    );

    const colegio = {};
    result.rows.forEach(row => {
      let valor = row.valor;
      if (row.tipo === 'boolean') {
        valor = valor === 'true';
      } else if (row.tipo === 'number') {
        valor = parseFloat(valor);
      }

      colegio[row.clave.replace('colegio_', '')] = valor;
    });

    res.json({
      success: true,
      colegio
    });

  } catch (error) {
    console.error('Error obteniendo datos del colegio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/configuracion/colegio/publico - Obtener datos públicos del colegio (SIN AUTENTICACIÓN)
router.get('/colegio/publico', async (req, res) => {
  try {
    const result = await query(
      `SELECT clave, valor
       FROM configuracion
       WHERE categoria = 'colegio'
       AND clave IN ('colegio_nombre', 'colegio_logo', 'colegio_color_primario', 'colegio_color_secundario')
       ORDER BY clave`
    );

    const colegio = {};
    result.rows.forEach(row => {
      colegio[row.clave.replace('colegio_', '')] = row.valor;
    });

    res.json({
      success: true,
      colegio
    });

  } catch (error) {
    console.error('Error obteniendo datos públicos del colegio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/configuracion/colegio - Actualizar configuraciones del colegio
router.put('/colegio', authenticateToken, requireAdmin, [
  body('nombre').optional().notEmpty().withMessage('Nombre no puede estar vacío'),
  body('codigo').optional().notEmpty().withMessage('Código no puede estar vacío'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('color_primario').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color primario inválido'),
  body('color_secundario').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color secundario inválido')
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
      direccion,
      telefono,
      email,
      logo,
      color_primario,
      color_secundario,
      director
    } = req.body;

    // Actualizar cada configuración individualmente
    const configuraciones = [
      { clave: 'colegio_nombre', valor: nombre },
      { clave: 'colegio_codigo', valor: codigo },
      { clave: 'colegio_direccion', valor: direccion },
      { clave: 'colegio_telefono', valor: telefono },
      { clave: 'colegio_email', valor: email },
      { clave: 'colegio_logo', valor: logo },
      { clave: 'colegio_color_primario', valor: color_primario },
      { clave: 'colegio_color_secundario', valor: color_secundario },
      { clave: 'colegio_director', valor: director }
    ];

    for (const config of configuraciones) {
      if (config.valor !== undefined && config.valor !== null) {
        await query(
          'UPDATE configuracion SET valor = $1, updated_at = NOW() WHERE clave = $2',
          [config.valor, config.clave]
        );
      }
    }

    res.json({
      success: true,
      message: 'Configuración del colegio actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando configuración del colegio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/configuracion/:clave - Actualizar una configuración específica
router.put('/:clave', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { clave } = req.params;
    const { valor } = req.body;

    if (valor === undefined || valor === null) {
      return res.status(400).json({
        success: false,
        message: 'Valor es requerido'
      });
    }

    const result = await query(
      'UPDATE configuracion SET valor = $1, updated_at = NOW() WHERE clave = $2 RETURNING clave, valor, descripcion, tipo, categoria',
      [valor, clave]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Configuración no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      configuracion: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
