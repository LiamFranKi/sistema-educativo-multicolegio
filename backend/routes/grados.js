const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_educativo_multicolegio',
  password: 'waltito10',
  port: 5432,
});

// Middleware para verificar autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  // Aquí deberías verificar el JWT token
  // Por ahora, continuamos sin verificación completa
  next();
};

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// GET /api/grados - Obtener todos los grados con información del nivel
router.get('/', async (req, res) => {
  try {
    const { search, nivel_id, page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    // Filtro por búsqueda
    if (search) {
      paramCount++;
      whereClause += ` AND (g.nombre ILIKE $${paramCount} OR g.codigo ILIKE $${paramCount} OR n.nombre ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Filtro por nivel
    if (nivel_id) {
      paramCount++;
      whereClause += ` AND g.nivel_id = $${paramCount}`;
      queryParams.push(nivel_id);
    }

    // Consulta principal con JOIN
    const query = `
      SELECT
        g.id,
        g.nombre,
        g.descripcion,
        g.codigo,
        g.nivel_id,
        n.nombre as nivel_nombre,
        n.codigo as nivel_codigo,
        g.orden,
        g.activo,
        g.foto,
        g.created_at,
        g.updated_at
      FROM grados g
      JOIN niveles n ON g.nivel_id = n.id
      ${whereClause}
      ORDER BY n.orden, g.orden
    `;

    const result = await pool.query(query, queryParams);

    // Paginación
    const offset = (page - 1) * limit;
    const paginatedResults = result.rows.slice(offset, offset + parseInt(limit));

    res.json({
      grados: paginatedResults,
      total: result.rows.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(result.rows.length / limit)
    });

  } catch (error) {
    console.error('Error obteniendo grados:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/grados/:id - Obtener un grado específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        g.id,
        g.nombre,
        g.descripcion,
        g.codigo,
        g.nivel_id,
        n.nombre as nivel_nombre,
        n.codigo as nivel_codigo,
        g.orden,
        g.activo,
        g.foto,
        g.created_at,
        g.updated_at
      FROM grados g
      JOIN niveles n ON g.nivel_id = n.id
      WHERE g.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Grado no encontrado' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error obteniendo grado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/grados - Crear un nuevo grado
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, codigo, nivel_id, orden, foto = 'default-grado.png' } = req.body;

    // Validaciones
    if (!nombre || !codigo || !nivel_id) {
      return res.status(400).json({
        message: 'Nombre, código y nivel son requeridos'
      });
    }

    // Verificar que el nivel existe
    const nivelCheck = await pool.query('SELECT id FROM niveles WHERE id = $1', [nivel_id]);
    if (nivelCheck.rows.length === 0) {
      return res.status(400).json({ message: 'El nivel especificado no existe' });
    }

    // Verificar que el código no existe
    const codigoCheck = await pool.query('SELECT id FROM grados WHERE codigo = $1', [codigo]);
    if (codigoCheck.rows.length > 0) {
      return res.status(400).json({ message: 'El código ya existe' });
    }

    const query = `
      INSERT INTO grados (nombre, descripcion, codigo, nivel_id, orden, activo, foto)
      VALUES ($1, $2, $3, $4, $5, true, $6)
      RETURNING *
    `;

    const result = await pool.query(query, [nombre, descripcion, codigo, nivel_id, orden || 1, foto]);

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error creando grado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /api/grados/:id - Actualizar un grado
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, codigo, nivel_id, orden, activo, foto } = req.body;

    // Verificar que el grado existe
    const gradoCheck = await pool.query('SELECT id FROM grados WHERE id = $1', [id]);
    if (gradoCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Grado no encontrado' });
    }

    // Verificar que el nivel existe (si se está actualizando)
    if (nivel_id) {
      const nivelCheck = await pool.query('SELECT id FROM niveles WHERE id = $1', [nivel_id]);
      if (nivelCheck.rows.length === 0) {
        return res.status(400).json({ message: 'El nivel especificado no existe' });
      }
    }

    // Verificar que el código no existe en otro grado
    if (codigo) {
      const codigoCheck = await pool.query('SELECT id FROM grados WHERE codigo = $1 AND id != $2', [codigo, id]);
      if (codigoCheck.rows.length > 0) {
        return res.status(400).json({ message: 'El código ya existe en otro grado' });
      }
    }

    const query = `
      UPDATE grados
      SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        codigo = COALESCE($3, codigo),
        nivel_id = COALESCE($4, nivel_id),
        orden = COALESCE($5, orden),
        activo = COALESCE($6, activo),
        foto = COALESCE($7, foto),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const result = await pool.query(query, [nombre, descripcion, codigo, nivel_id, orden, activo, foto, id]);

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error actualizando grado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /api/grados/:id - Eliminar un grado (hard delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el grado existe
    const gradoCheck = await pool.query('SELECT id FROM grados WHERE id = $1', [id]);
    if (gradoCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Grado no encontrado' });
    }

    // Eliminar el grado
    await pool.query('DELETE FROM grados WHERE id = $1', [id]);

    res.json({ message: 'Grado eliminado exitosamente' });

  } catch (error) {
    console.error('Error eliminando grado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/grados/nivel/:nivel_id - Obtener grados por nivel
router.get('/nivel/:nivel_id', async (req, res) => {
  try {
    const { nivel_id } = req.params;

    const query = `
      SELECT
        g.id,
        g.nombre,
        g.descripcion,
        g.codigo,
        g.orden,
        g.activo,
        g.foto
      FROM grados g
      WHERE g.nivel_id = $1 AND g.activo = true
      ORDER BY g.orden
    `;

    const result = await pool.query(query, [nivel_id]);
    res.json(result.rows);

  } catch (error) {
    console.error('Error obteniendo grados por nivel:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
