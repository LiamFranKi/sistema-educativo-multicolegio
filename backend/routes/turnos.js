const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { authenticateToken } = require('../middleware/auth');

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_educativo_multicolegio',
  password: 'waltito10',
  port: 5432,
});

// GET /api/turnos - Obtener todos los turnos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, activo, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT id, nombre, abreviatura, activo, created_at, updated_at
      FROM turnos 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    // Filtro de búsqueda
    if (search) {
      paramCount++;
      query += ` AND (nombre ILIKE $${paramCount} OR abreviatura ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Filtro por estado
    if (activo !== undefined) {
      paramCount++;
      query += ` AND activo = $${paramCount}`;
      params.push(activo === 'true');
    }

    // Ordenamiento y paginación
    query += ` ORDER BY nombre ASC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    
    // Contar total de registros para paginación
    let countQuery = `
      SELECT COUNT(*) as total
      FROM turnos 
      WHERE 1=1
    `;
    const countParams = [];
    let countParamCount = 0;

    if (search) {
      countParamCount++;
      countQuery += ` AND (nombre ILIKE $${countParamCount} OR abreviatura ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    if (activo !== undefined) {
      countParamCount++;
      countQuery += ` AND activo = $${countParamCount}`;
      countParams.push(activo === 'true');
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    res.json({
      success: true,
      turnos: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo turnos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/turnos/:id - Obtener un turno por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT id, nombre, abreviatura, activo, created_at, updated_at
      FROM turnos 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Turno no encontrado'
      });
    }
    
    res.json({
      success: true,
      turno: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo turno:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/turnos - Crear un nuevo turno
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, abreviatura } = req.body;
    
    // Validaciones
    if (!nombre || !abreviatura) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y abreviatura son requeridos'
      });
    }

    // Verificar que el nombre no exista
    const existingNombre = await pool.query(
      'SELECT id FROM turnos WHERE nombre = $1',
      [nombre]
    );
    
    if (existingNombre.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El nombre ya existe'
      });
    }

    // Verificar que la abreviatura no exista
    const existingAbreviatura = await pool.query(
      'SELECT id FROM turnos WHERE abreviatura = $1',
      [abreviatura]
    );
    
    if (existingAbreviatura.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La abreviatura ya existe'
      });
    }
    
    const query = `
      INSERT INTO turnos (nombre, abreviatura, activo)
      VALUES ($1, $2, true)
      RETURNING id, nombre, abreviatura, activo, created_at, updated_at
    `;
    
    const result = await pool.query(query, [nombre, abreviatura]);
    
    res.status(201).json({
      success: true,
      message: 'Turno creado exitosamente',
      turno: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando turno:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/turnos/:id - Actualizar un turno
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, abreviatura, activo } = req.body;
    
    // Validaciones
    if (!nombre || !abreviatura) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y abreviatura son requeridos'
      });
    }
    
    // Verificar que el turno existe
    const existingTurno = await pool.query(
      'SELECT id FROM turnos WHERE id = $1',
      [id]
    );
    
    if (existingTurno.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Turno no encontrado'
      });
    }

    // Verificar que el nombre no exista en otro turno
    const existingNombre = await pool.query(
      'SELECT id FROM turnos WHERE nombre = $1 AND id != $2',
      [nombre, id]
    );
    
    if (existingNombre.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El nombre ya existe en otro turno'
      });
    }

    // Verificar que la abreviatura no exista en otro turno
    const existingAbreviatura = await pool.query(
      'SELECT id FROM turnos WHERE abreviatura = $1 AND id != $2',
      [abreviatura, id]
    );
    
    if (existingAbreviatura.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La abreviatura ya existe en otro turno'
      });
    }
    
    const query = `
      UPDATE turnos 
      SET nombre = $1, abreviatura = $2, activo = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, nombre, abreviatura, activo, created_at, updated_at
    `;
    
    const result = await pool.query(query, [nombre, abreviatura, activo !== false, id]);
    
    res.json({
      success: true,
      message: 'Turno actualizado exitosamente',
      turno: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando turno:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/turnos/:id - Eliminar un turno
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el turno existe
    const existingTurno = await pool.query(
      'SELECT id, nombre FROM turnos WHERE id = $1',
      [id]
    );
    
    if (existingTurno.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Turno no encontrado'
      });
    }

    const turno = existingTurno.rows[0];
    
    // Eliminar el turno
    await pool.query('DELETE FROM turnos WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: `Turno "${turno.nombre}" eliminado exitosamente`
    });
  } catch (error) {
    console.error('Error eliminando turno:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
