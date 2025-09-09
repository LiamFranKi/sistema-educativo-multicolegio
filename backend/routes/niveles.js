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

// GET /api/niveles - Obtener todos los niveles
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT id, nombre, descripcion, codigo, orden, activo, created_at, updated_at
      FROM niveles 
      ORDER BY orden ASC
    `;
    
    const result = await pool.query(query);
    
    res.json({
      success: true,
      niveles: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo niveles:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/niveles/:id - Obtener un nivel por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT id, nombre, descripcion, codigo, orden, activo, created_at, updated_at
      FROM niveles 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nivel no encontrado'
      });
    }
    
    res.json({
      success: true,
      nivel: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo nivel:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/niveles - Crear un nuevo nivel
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, descripcion, codigo, orden } = req.body;
    
    // Validaciones
    if (!nombre || !codigo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y código son requeridos'
      });
    }
    
    // Verificar que el código no exista
    const existingCode = await pool.query(
      'SELECT id FROM niveles WHERE codigo = $1',
      [codigo]
    );
    
    if (existingCode.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El código ya existe'
      });
    }
    
    // Verificar que el nombre no exista
    const existingName = await pool.query(
      'SELECT id FROM niveles WHERE nombre = $1',
      [nombre]
    );
    
    if (existingName.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El nombre ya existe'
      });
    }
    
    const query = `
      INSERT INTO niveles (nombre, descripcion, codigo, orden, activo)
      VALUES ($1, $2, $3, $4, true)
      RETURNING id, nombre, descripcion, codigo, orden, activo, created_at, updated_at
    `;
    
    const result = await pool.query(query, [nombre, descripcion, codigo, orden || 0]);
    
    res.status(201).json({
      success: true,
      message: 'Nivel creado exitosamente',
      nivel: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando nivel:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/niveles/:id - Actualizar un nivel
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, codigo, orden, activo } = req.body;
    
    // Validaciones
    if (!nombre || !codigo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y código son requeridos'
      });
    }
    
    // Verificar que el nivel existe
    const existingNivel = await pool.query(
      'SELECT id FROM niveles WHERE id = $1',
      [id]
    );
    
    if (existingNivel.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nivel no encontrado'
      });
    }
    
    // Verificar que el código no exista en otro nivel
    const existingCode = await pool.query(
      'SELECT id FROM niveles WHERE codigo = $1 AND id != $2',
      [codigo, id]
    );
    
    if (existingCode.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El código ya existe en otro nivel'
      });
    }
    
    // Verificar que el nombre no exista en otro nivel
    const existingName = await pool.query(
      'SELECT id FROM niveles WHERE nombre = $1 AND id != $2',
      [nombre, id]
    );
    
    if (existingName.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El nombre ya existe en otro nivel'
      });
    }
    
    const query = `
      UPDATE niveles 
      SET nombre = $1, descripcion = $2, codigo = $3, orden = $4, activo = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, nombre, descripcion, codigo, orden, activo, created_at, updated_at
    `;
    
    const result = await pool.query(query, [nombre, descripcion, codigo, orden || 0, activo !== false, id]);
    
    res.json({
      success: true,
      message: 'Nivel actualizado exitosamente',
      nivel: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando nivel:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/niveles/:id - Eliminar un nivel
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el nivel existe
    const existingNivel = await pool.query(
      'SELECT id FROM niveles WHERE id = $1',
      [id]
    );
    
    if (existingNivel.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Nivel no encontrado'
      });
    }
    
    // Verificar si hay grados asociados (esto lo implementaremos cuando creemos la tabla grados)
    // Por ahora solo eliminamos el nivel
    
    const query = 'DELETE FROM niveles WHERE id = $1';
    await pool.query(query, [id]);
    
    res.json({
      success: true,
      message: 'Nivel eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando nivel:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
