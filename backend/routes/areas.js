const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { authenticateToken } = require('../middleware/auth');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// GET /api/areas - Listar áreas con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const { search, estado, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '1=1';
    const params = [];
    
    // Filtro por búsqueda
    if (search) {
      whereClause += ' AND (nombre LIKE ? OR descripcion LIKE ? OR codigo LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Filtro por estado
    if (estado) {
      whereClause += ' AND estado = ?';
      params.push(estado);
    }
    
    // Consulta principal con paginación
    const query = `
      SELECT id, nombre, descripcion, codigo, estado, created_at, updated_at
      FROM areas 
      WHERE ${whereClause}
      ORDER BY nombre ASC
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = `SELECT COUNT(*) as total FROM areas WHERE ${whereClause}`;
    
    const [areas, countResult] = await Promise.all([
      db.all(query, [...params, limit, offset]),
      db.get(countQuery, params)
    ]);
    
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      areas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/areas/:id - Obtener área por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const area = await db.get(
      'SELECT id, nombre, descripcion, codigo, estado, created_at, updated_at FROM areas WHERE id = ?',
      [id]
    );
    
    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }
    
    res.json({
      success: true,
      area
    });
  } catch (error) {
    console.error('Error al obtener área:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/areas - Crear nueva área
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, codigo, estado = 'activo' } = req.body;
    
    // Validaciones
    if (!nombre || !codigo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y código son requeridos'
      });
    }
    
    if (nombre.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'El nombre no puede exceder 100 caracteres'
      });
    }
    
    if (codigo.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'El código no puede exceder 10 caracteres'
      });
    }
    
    // Verificar si el nombre ya existe
    const existingArea = await db.get(
      'SELECT id FROM areas WHERE nombre = ?',
      [nombre]
    );
    
    if (existingArea) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un área con ese nombre'
      });
    }
    
    // Verificar si el código ya existe
    const existingCode = await db.get(
      'SELECT id FROM areas WHERE codigo = ?',
      [codigo]
    );
    
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un área con ese código'
      });
    }
    
    // Crear área
    const result = await db.run(
      'INSERT INTO areas (nombre, descripcion, codigo, estado) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || '', codigo, estado]
    );
    
    // Obtener el área creada
    const newArea = await db.get(
      'SELECT id, nombre, descripcion, codigo, estado, created_at, updated_at FROM areas WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json({
      success: true,
      message: 'Área creada exitosamente',
      area: newArea
    });
  } catch (error) {
    console.error('Error al crear área:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/areas/:id - Actualizar área
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, codigo, estado } = req.body;
    
    // Verificar si el área existe
    const existingArea = await db.get(
      'SELECT id FROM areas WHERE id = ?',
      [id]
    );
    
    if (!existingArea) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }
    
    // Validaciones
    if (!nombre || !codigo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y código son requeridos'
      });
    }
    
    if (nombre.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'El nombre no puede exceder 100 caracteres'
      });
    }
    
    if (codigo.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'El código no puede exceder 10 caracteres'
      });
    }
    
    // Verificar si el nombre ya existe en otra área
    const existingName = await db.get(
      'SELECT id FROM areas WHERE nombre = ? AND id != ?',
      [nombre, id]
    );
    
    if (existingName) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otra área con ese nombre'
      });
    }
    
    // Verificar si el código ya existe en otra área
    const existingCode = await db.get(
      'SELECT id FROM areas WHERE codigo = ? AND id != ?',
      [codigo, id]
    );
    
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otra área con ese código'
      });
    }
    
    // Actualizar área
    await db.run(
      'UPDATE areas SET nombre = ?, descripcion = ?, codigo = ?, estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [nombre, descripcion || '', codigo, estado, id]
    );
    
    // Obtener el área actualizada
    const updatedArea = await db.get(
      'SELECT id, nombre, descripcion, codigo, estado, created_at, updated_at FROM areas WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Área actualizada exitosamente',
      area: updatedArea
    });
  } catch (error) {
    console.error('Error al actualizar área:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/areas/:id - Eliminar área
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el área existe
    const existingArea = await db.get(
      'SELECT id FROM areas WHERE id = ?',
      [id]
    );
    
    if (!existingArea) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }
    
    // Eliminar área
    await db.run('DELETE FROM areas WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Área eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar área:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
