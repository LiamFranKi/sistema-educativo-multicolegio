const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Proteger todas las rutas
router.use(authenticateToken);

// GET /api/areas - Listar áreas con filtros y paginación
router.get('/', async (req, res) => {
  try {
    const { search, estado, page = 1, limit = 10 } = req.query;

    const whereParts = [];
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      whereParts.push(`(nombre ILIKE $${params.length} OR descripcion ILIKE $${params.length} OR codigo ILIKE $${params.length})`);
    }

    if (estado) {
      params.push(estado);
      whereParts.push(`estado = $${params.length}`);
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    // Total
    const countSql = `SELECT COUNT(*)::int AS total FROM areas ${whereClause}`;
    const countResult = await pool.query(countSql, params);
    const total = countResult.rows[0]?.total || 0;

    // Paginación
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const dataSql = `
      SELECT id, nombre, descripcion, codigo, estado, created_at, updated_at
      FROM areas
      ${whereClause}
      ORDER BY nombre ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const dataParams = [...params, limitNum, offset];
    const dataResult = await pool.query(dataSql, dataParams);

    return res.json({
      success: true,
      areas: dataResult.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / (limitNum || 1))
      }
    });
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// GET /api/areas/:id - Obtener área por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT id, nombre, descripcion, codigo, estado, created_at, updated_at
      FROM areas
      WHERE id = $1
    `;

    const result = await pool.query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Área no encontrada' });
    }

    return res.json({ success: true, area: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener área:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// POST /api/areas - Crear nueva área
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, codigo, estado = 'activo' } = req.body;

    if (!nombre || !codigo) {
      return res.status(400).json({ success: false, message: 'Nombre y código son requeridos' });
    }
    if (nombre.length > 100) {
      return res.status(400).json({ success: false, message: 'El nombre no puede exceder 100 caracteres' });
    }
    if (codigo.length > 10) {
      return res.status(400).json({ success: false, message: 'El código no puede exceder 10 caracteres' });
    }

    // Unicidad de nombre
    let check = await pool.query('SELECT id FROM areas WHERE nombre = $1', [nombre]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe un área con ese nombre' });
    }

    // Unicidad de código
    check = await pool.query('SELECT id FROM areas WHERE codigo = $1', [codigo]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe un área con ese código' });
    }

    const insertSql = `
      INSERT INTO areas (nombre, descripcion, codigo, estado)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, descripcion, codigo, estado, created_at, updated_at
    `;
    const insertRes = await pool.query(insertSql, [nombre, descripcion || '', codigo, estado]);

    return res.status(201).json({ success: true, message: 'Área creada exitosamente', area: insertRes.rows[0] });
  } catch (error) {
    console.error('Error al crear área:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// PUT /api/areas/:id - Actualizar área
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, codigo, estado } = req.body;

    // Verificar existencia
    const exists = await pool.query('SELECT id FROM areas WHERE id = $1', [id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Área no encontrada' });
    }

    if (!nombre || !codigo) {
      return res.status(400).json({ success: false, message: 'Nombre y código son requeridos' });
    }
    if (nombre.length > 100) {
      return res.status(400).json({ success: false, message: 'El nombre no puede exceder 100 caracteres' });
    }
    if (codigo.length > 10) {
      return res.status(400).json({ success: false, message: 'El código no puede exceder 10 caracteres' });
    }

    // Unicidad de nombre en otra fila
    let check = await pool.query('SELECT id FROM areas WHERE nombre = $1 AND id != $2', [nombre, id]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe otra área con ese nombre' });
    }

    // Unicidad de código en otra fila
    check = await pool.query('SELECT id FROM areas WHERE codigo = $1 AND id != $2', [codigo, id]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya existe otra área con ese código' });
    }

    const updateSql = `
      UPDATE areas
      SET nombre = $1,
          descripcion = $2,
          codigo = $3,
          estado = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, nombre, descripcion, codigo, estado, created_at, updated_at
    `;

    const updateRes = await pool.query(updateSql, [nombre, descripcion || '', codigo, estado, id]);

    return res.json({ success: true, message: 'Área actualizada exitosamente', area: updateRes.rows[0] });
  } catch (error) {
    console.error('Error al actualizar área:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// DELETE /api/areas/:id - Eliminar área
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar
    const exists = await pool.query('SELECT id FROM areas WHERE id = $1', [id]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Área no encontrada' });
    }

    await pool.query('DELETE FROM areas WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Área eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar área:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;
