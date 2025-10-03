const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/configuracion - Obtener todas las configuraciones
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT clave, valor, descripcion, tipo FROM configuracion WHERE activo = true ORDER BY clave'
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

// GET /api/configuracion/colegio - Obtener datos del colegio (PÚBLICO)
router.get('/colegio', async (req, res) => {
  try {
    console.log('🔍 Obteniendo datos del colegio desde tabla configuracion...');
    
    // Consultar SOLO la tabla configuracion (como está en Railway)
    const result = await query(
      `SELECT clave, valor, descripcion, tipo
       FROM configuracion
       WHERE activo = true
       ORDER BY clave`
    );

    console.log('📊 Resultado de configuracion:', result.rows.length, 'filas');
    console.log('📄 Datos crudos de configuracion:', result.rows);

    const colegio = {};
    
    result.rows.forEach(row => {
      console.log(`🔧 Procesando: ${row.clave} = ${row.valor} (tipo: ${row.tipo})`);
      
      let valor = row.valor;
      if (row.tipo === 'boolean') {
        valor = valor === 'true';
      } else if (row.tipo === 'number') {
        valor = parseFloat(valor);
      }

      // Mapear las claves a nombres más simples
      let claveSimple = row.clave.replace('_colegio', '').replace('colegio_', '');
      
      // Mapeos específicos para mantener consistencia
      if (row.clave === 'colegio_logo') {
        claveSimple = 'logo';
      } else if (row.clave === 'colegio_background_imagen') {
        claveSimple = 'background_imagen';
      } else if (row.clave === 'colegio_color_primario') {
        claveSimple = 'color_primario';
      } else if (row.clave === 'colegio_color_secundario') {
        claveSimple = 'color_secundario';
      } else if (row.clave === 'colegio_background_color') {
        claveSimple = 'background_color';
      } else if (row.clave === 'colegio_background_tipo') {
        claveSimple = 'background_tipo';
      } else if (row.clave === 'colegio_nombre') {
        claveSimple = 'nombre';
      } else if (row.clave === 'colegio_direccion') {
        claveSimple = 'direccion';
      } else if (row.clave === 'colegio_telefono') {
        claveSimple = 'telefono';
      } else if (row.clave === 'colegio_email') {
        claveSimple = 'email';
      } else if (row.clave === 'colegio_director') {
        claveSimple = 'director';
      } else if (row.clave === 'anio_escolar_actual') {
        claveSimple = 'anio_escolar_actual';
      }
      
      console.log(`✅ Mapeado: ${row.clave} → ${claveSimple} = ${valor}`);
      colegio[claveSimple] = valor;
    });
    
    // Agregar valores por defecto si no existen
    if (!colegio.background_tipo) colegio.background_tipo = 'color';
    if (!colegio.background_color) colegio.background_color = '#f5f5f5';
    if (!colegio.anio_escolar_actual) colegio.anio_escolar_actual = 2025;
    if (!colegio.nombre) colegio.nombre = 'Sistema Educativo';
    
    console.log('✅ Configuraciones del colegio procesadas:', Object.keys(colegio));
    console.log('📦 Objeto final colegio:', colegio);

    res.json({
      success: true,
      colegio
    });

  } catch (error) {
    console.error('❌ Error obteniendo datos del colegio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/configuracion/colegio/publico - Obtener datos públicos del colegio (SIN AUTENTICACIÓN)
router.get('/colegio/publico', async (req, res) => {
  try {
    const result = await query(
      `SELECT clave, valor
       FROM configuracion
       WHERE activo = true
       AND clave IN ('colegio_nombre', 'nombre_colegio', 'colegio_logo', 'logo_colegio', 'colegio_color_primario', 'color_primario', 'colegio_color_secundario', 'color_secundario')
       ORDER BY clave`
    );

    const colegio = {};
    result.rows.forEach(row => {
      // Mapear las claves a nombres más simples
      let claveSimple = row.clave.replace('_colegio', '').replace('colegio_', '');

      // Mapeos específicos para mantener consistencia
      if (row.clave === 'colegio_nombre' || row.clave === 'nombre_colegio') {
        claveSimple = 'nombre';
      } else if (row.clave === 'colegio_logo' || row.clave === 'logo_colegio') {
        claveSimple = 'logo';
      } else if (row.clave === 'colegio_color_primario' || row.clave === 'color_primario') {
        claveSimple = 'color_primario';
      } else if (row.clave === 'colegio_color_secundario' || row.clave === 'color_secundario') {
        claveSimple = 'color_secundario';
      }

      colegio[claveSimple] = row.valor;
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
  body('color_secundario').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color secundario inválido'),
  body('background_tipo').optional().isIn(['color', 'imagen']).withMessage('Tipo de fondo debe ser color o imagen'),
  body('background_color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Color de fondo inválido')
], async (req, res) => {
  try {
    console.log('📥 Datos recibidos en /api/configuracion/colegio:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Errores de validación:', errors.array());
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
      director,
      background_tipo,
      background_color,
      background_imagen
    } = req.body;

    // Actualizar cada configuración individualmente
    const configuraciones = [
      { clave: 'colegio_nombre', claveAlt: 'nombre_colegio', valor: nombre },
      { clave: 'colegio_codigo', claveAlt: 'codigo_colegio', valor: codigo },
      { clave: 'colegio_direccion', claveAlt: 'direccion_colegio', valor: direccion },
      { clave: 'colegio_telefono', claveAlt: 'telefono_colegio', valor: telefono },
      { clave: 'colegio_email', claveAlt: 'email_colegio', valor: email },
      { clave: 'colegio_logo', claveAlt: 'logo_colegio', valor: logo },
      { clave: 'colegio_color_primario', claveAlt: 'color_primario', valor: color_primario },
      { clave: 'colegio_color_secundario', claveAlt: 'color_secundario', valor: color_secundario },
      { clave: 'colegio_director', claveAlt: 'director_colegio', valor: director },
      { clave: 'colegio_background_tipo', claveAlt: 'background_tipo_colegio', valor: background_tipo },
      { clave: 'colegio_background_color', claveAlt: 'background_color_colegio', valor: background_color },
      { clave: 'colegio_background_imagen', claveAlt: 'background_imagen_colegio', valor: background_imagen }
    ];

    for (const config of configuraciones) {
      if (config.valor !== undefined && config.valor !== null) {
        console.log(`Actualizando ${config.clave}: ${config.valor}`);

        // Intentar actualizar con la clave principal, si no existe usar la alternativa
        try {
          await query(
            'UPDATE configuracion SET valor = $1, updated_at = NOW() WHERE clave = $2',
            [config.valor, config.clave]
          );
        } catch (error) {
          // Si falla, intentar con la clave alternativa
          try {
            await query(
              'UPDATE configuracion SET valor = $1, updated_at = NOW() WHERE clave = $2',
              [config.valor, config.claveAlt]
            );
          } catch (altError) {
            // Si tampoco existe, crear la entrada
            await query(
              'INSERT INTO configuracion (clave, valor, descripcion, tipo, activo) VALUES ($1, $2, $3, $4, true) ON CONFLICT (clave) DO UPDATE SET valor = $2, updated_at = NOW()',
              [config.clave, config.valor, `Configuración de ${config.clave}`, 'text']
            );
          }
        }
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

// PUT /api/configuracion/anio-actual - Actualizar año escolar actual
router.put('/anio-actual', authenticateToken, requireAdmin, [
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

    // Verificar que el año escolar existe
    const anioCheck = await query('SELECT id FROM anios_escolares WHERE anio = $1', [anio]);
    if (anioCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El año escolar no existe. Primero debe crear el año escolar.'
      });
    }

    // Desactivar todos los años escolares
    await query('UPDATE anios_escolares SET activo = false, updated_at = NOW()');

    // Activar solo el año seleccionado
    await query('UPDATE anios_escolares SET activo = true, updated_at = NOW() WHERE anio = $1', [anio]);

    // Actualizar año actual en configuración
    await query(
      'UPDATE configuracion SET valor = $1, updated_at = NOW() WHERE clave = $2',
      [anio.toString(), 'anio_escolar_actual']
    );

    res.json({
      success: true,
      message: 'Año escolar actual actualizado exitosamente',
      anio_actual: anio
    });

  } catch (error) {
    console.error('Error actualizando año actual:', error);
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
