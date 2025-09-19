const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const path = require('path');
const fs = require('fs');

// GET /api/avatars - Obtener todos los avatars con filtros
router.get('/', async (req, res) => {
  try {
    const { search, nivel, genero, activo, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        id,
        nombre,
        descripcion,
        nivel,
        puntos,
        genero,
        imagen,
        activo,
        created_at,
        updated_at
      FROM avatars
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 0;

    // Filtro de búsqueda
    if (search) {
      paramCount++;
      query += ` AND (nombre ILIKE $${paramCount} OR descripcion ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Filtro por nivel
    if (nivel && nivel !== '') {
      paramCount++;
      query += ` AND nivel = $${paramCount}`;
      params.push(parseInt(nivel));
    }

    // Filtro por género
    if (genero && genero !== '') {
      paramCount++;
      query += ` AND genero = $${paramCount}`;
      params.push(genero);
    }

    // Filtro por estado
    if (activo !== undefined && activo !== '') {
      paramCount++;
      query += ` AND activo = $${paramCount}`;
      params.push(activo === 'true');
    }

    // Contar total de registros (antes del ORDER BY)
    const countQuery = query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Ordenamiento
    query += ` ORDER BY nivel ASC, puntos ASC`;

    // Aplicar paginación
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo avatars:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/avatars/:id - Obtener avatar por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        id,
        nombre,
        descripcion,
        nivel,
        puntos,
        genero,
        imagen,
        activo,
        created_at,
        updated_at
      FROM avatars
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Avatar no encontrado'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/avatars - Crear nuevo avatar
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, nivel, puntos, genero, imagen, activo = true } = req.body;

    // Validaciones
    if (!nombre || !nivel || puntos === undefined || !genero) {
      return res.status(400).json({
        success: false,
        message: 'Los campos nombre, nivel, puntos y género son obligatorios'
      });
    }

    const nivelNum = parseInt(nivel);
    const puntosNum = parseInt(puntos);

    if (nivelNum < 1 || nivelNum > 20) {
      return res.status(400).json({
        success: false,
        message: 'El nivel debe estar entre 1 y 20'
      });
    }

    if (puntosNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Los puntos no pueden ser negativos'
      });
    }

    if (!['Masculino', 'Femenino'].includes(genero)) {
      return res.status(400).json({
        success: false,
        message: 'El género debe ser Masculino o Femenino'
      });
    }

    // Verificar si el nombre ya existe
    const checkNombreQuery = 'SELECT id FROM avatars WHERE nombre = $1';
    const checkNombreResult = await pool.query(checkNombreQuery, [nombre]);

    if (checkNombreResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un avatar con este nombre'
      });
    }

    // Verificar si el nivel ya existe para el mismo género
    const checkNivelQuery = 'SELECT id FROM avatars WHERE nivel = $1 AND genero = $2';
    const checkNivelResult = await pool.query(checkNivelQuery, [nivelNum, genero]);

    if (checkNivelResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Ya existe un avatar nivel ${nivelNum} para género ${genero}`
      });
    }

    const query = `
      INSERT INTO avatars (nombre, descripcion, nivel, puntos, genero, imagen, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      nombre,
      descripcion || null,
      nivelNum,
      puntosNum,
      genero,
      imagen,
      activo === 'true' || activo === true
    ]);

    res.status(201).json({
      success: true,
      message: 'Avatar creado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PUT /api/avatars/:id - Actualizar avatar
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, nivel, puntos, genero, imagen, activo } = req.body;

    // Validaciones
    if (!nombre || !nivel || puntos === undefined || !genero) {
      return res.status(400).json({
        success: false,
        message: 'Los campos nombre, nivel, puntos y género son obligatorios'
      });
    }

    const nivelNum = parseInt(nivel);
    const puntosNum = parseInt(puntos);

    if (nivelNum < 1 || nivelNum > 20) {
      return res.status(400).json({
        success: false,
        message: 'El nivel debe estar entre 1 y 20'
      });
    }

    if (puntosNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Los puntos no pueden ser negativos'
      });
    }

    if (!['Masculino', 'Femenino'].includes(genero)) {
      return res.status(400).json({
        success: false,
        message: 'El género debe ser Masculino o Femenino'
      });
    }

    // Verificar si el avatar existe
    const checkQuery = 'SELECT id, imagen FROM avatars WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Avatar no encontrado'
      });
    }

    // Verificar si el nombre ya existe en otro avatar
    const checkNombreQuery = 'SELECT id FROM avatars WHERE nombre = $1 AND id != $2';
    const checkNombreResult = await pool.query(checkNombreQuery, [nombre, id]);

    if (checkNombreResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un avatar con este nombre'
      });
    }

    // Verificar si el nivel ya existe en otro avatar del mismo género
    const checkNivelQuery = 'SELECT id FROM avatars WHERE nivel = $1 AND genero = $2 AND id != $3';
    const checkNivelResult = await pool.query(checkNivelQuery, [nivelNum, genero, id]);

    if (checkNivelResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Ya existe un avatar nivel ${nivelNum} para género ${genero}`
      });
    }

    // Construir query de actualización
    let query = `
      UPDATE avatars
      SET
        nombre = $1,
        descripcion = $2,
        nivel = $3,
        puntos = $4,
        genero = $5,
        activo = $6,
        updated_at = CURRENT_TIMESTAMP
    `;

    const params = [nombre, descripcion || null, nivelNum, puntosNum, genero, activo === 'true' || activo === true];
    let paramCount = 6;

    // Si hay nueva imagen, actualizarla
    if (imagen) {
      paramCount++;
      query += `, imagen = $${paramCount}`;
      params.push(imagen);

      // Eliminar imagen anterior si no es la por defecto
      const oldImage = checkResult.rows[0].imagen;
      if (oldImage && oldImage !== 'default-avatar.png') {
        const oldImagePath = path.join(__dirname, '../uploads/avatars', oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    paramCount++;
    query += ` WHERE id = $${paramCount} RETURNING *`;
    params.push(id);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      message: 'Avatar actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/avatars/:id - Eliminar avatar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el avatar existe
    const checkQuery = 'SELECT id, imagen FROM avatars WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Avatar no encontrado'
      });
    }

    // Eliminar avatar de la base de datos
    const deleteQuery = 'DELETE FROM avatars WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    // Eliminar imagen del servidor si no es la por defecto
    const imagen = checkResult.rows[0].imagen;
    if (imagen && imagen !== 'default-avatar.png') {
      const imagePath = path.join(__dirname, '../uploads/avatars', imagen);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: 'Avatar eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/avatars/estadisticas - Obtener estadísticas de avatars
router.get('/estadisticas/general', async (req, res) => {
  try {
    const query = `
      SELECT
        COUNT(*) as total_avatars,
        COUNT(CASE WHEN activo = true THEN 1 END) as avatars_activos,
        COUNT(CASE WHEN activo = false THEN 1 END) as avatars_inactivos,
        COUNT(CASE WHEN genero = 'Masculino' THEN 1 END) as avatars_masculinos,
        COUNT(CASE WHEN genero = 'Femenino' THEN 1 END) as avatars_femeninos,
        MIN(nivel) as nivel_minimo,
        MAX(nivel) as nivel_maximo,
        MIN(puntos) as puntos_minimos,
        MAX(puntos) as puntos_maximos,
        AVG(puntos) as puntos_promedio
      FROM avatars
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
