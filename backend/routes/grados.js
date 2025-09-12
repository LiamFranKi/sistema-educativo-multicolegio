const express = require('express');
const { Pool } = require('pg');
const router = express.Router();
// Importar utilidades (comentado temporalmente hasta que se resuelva el problema de módulos)
// const { generateGradosOptions, getGradoFormattedName, generateGradoCodigo } = require('../utils/gradosGenerator');
// const { getSeccionesOptions } = require('../utils/secciones');

// Funciones temporales inline hasta resolver el problema de módulos
const generateGradosOptions = (nivel) => {
  if (!nivel || !nivel.grado_minimo || !nivel.grado_maximo) {
    return [];
  }

  const { tipo_grados, grado_minimo, grado_maximo } = nivel;
  const grados = [];

  for (let i = grado_minimo; i <= grado_maximo; i++) {
    let nombre = '';
    let valor = i;

    if (tipo_grados === 'Años') {
      const numeroFormateado = i.toString().padStart(2, '0');
      nombre = `${numeroFormateado} años`;
    } else if (tipo_grados === 'Grados') {
      nombre = `${i}° grado`;
    }

    grados.push({
      value: valor,
      label: nombre,
      numero: i
    });
  }

  return grados;
};

const getGradoFormattedName = (numero, tipoGrados) => {
  if (tipoGrados === 'Años') {
    const numeroFormateado = numero.toString().padStart(2, '0');
    return `${numeroFormateado} años`;
  } else if (tipoGrados === 'Grados') {
    return `${numero}° grado`;
  }
  return numero.toString();
};

const generateGradoCodigo = (nivel, numero, seccion) => {
  if (!nivel || !numero) {
    return '';
  }

  const nivelCodigo = nivel.codigo || 'NIV';
  const numeroFormateado = numero.toString().padStart(2, '0');
  const seccionCodigo = seccion === 'Unica' ? '' : seccion;

  return `${nivelCodigo}${numeroFormateado}${seccionCodigo}`.toUpperCase();
};

const getSeccionesOptions = () => {
  return [
    { value: 'Unica', label: 'Única' },
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' }
  ];
};

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
        n.tipo_grados,
        g.orden,
        g.activo,
        g.foto,
        g.seccion,
        g.direccion_archivos,
        g.link_aula_virtual,
        g.anio_escolar,
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

// GET /api/grados/niveles/disponibles - Obtener niveles disponibles
router.get('/niveles/disponibles', async (req, res) => {
  try {
    const query = `
      SELECT id, nombre, codigo, tipo_grados, grado_minimo, grado_maximo
      FROM niveles
      WHERE activo = true
      ORDER BY orden ASC, nombre ASC
    `;

    const result = await pool.query(query);
    res.json(result.rows);

  } catch (error) {
    console.error('Error obteniendo niveles:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/grados/grados-por-nivel/:nivel_id - Obtener grados por nivel
router.get('/grados-por-nivel/:nivel_id', async (req, res) => {
  try {
    const { nivel_id } = req.params;

    // Obtener información del nivel
    const nivelResult = await pool.query(`
      SELECT id, nombre, codigo, tipo_grados, grado_minimo, grado_maximo
      FROM niveles WHERE id = $1
    `, [nivel_id]);

    if (nivelResult.rows.length === 0) {
      return res.status(404).json({ message: 'Nivel no encontrado' });
    }

    const nivel = nivelResult.rows[0];
    const gradosOptions = generateGradosOptions(nivel);

    res.json(gradosOptions);

  } catch (error) {
    console.error('Error obteniendo grados por nivel:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/grados/secciones - Obtener secciones disponibles (array fijo)
router.get('/secciones/disponibles', async (req, res) => {
  try {
    const secciones = [
      { value: 'Unica', label: 'Única', orden: 1 },
      { value: 'A', label: 'A', orden: 2 },
      { value: 'B', label: 'B', orden: 3 },
      { value: 'C', label: 'C', orden: 4 },
      { value: 'D', label: 'D', orden: 5 },
      { value: 'E', label: 'E', orden: 6 },
      { value: 'F', label: 'F', orden: 7 }
    ];
    res.json(secciones);
  } catch (error) {
    console.error('Error obteniendo secciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/grados/anios-escolares - Obtener años escolares disponibles
router.get('/anios-escolares', async (req, res) => {
  try {
    const query = `
      SELECT anio, activo
      FROM anios_escolares
      ORDER BY anio DESC
    `;

    const result = await pool.query(query);

    // Si no hay datos, devolver años por defecto
    if (result.rows.length === 0) {
      const aniosPorDefecto = [
        { anio: 2025, activo: true },
        { anio: 2024, activo: true },
        { anio: 2023, activo: true }
      ];
      return res.json(aniosPorDefecto);
    }

    res.json(result.rows);

  } catch (error) {
    console.error('❌ Error obteniendo años escolares:', error);
    // En caso de error, devolver años por defecto
    const aniosPorDefecto = [
      { anio: 2025, activo: true },
      { anio: 2024, activo: true },
      { anio: 2023, activo: true }
    ];
    res.json(aniosPorDefecto);
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
        n.tipo_grados,
        g.orden,
        g.activo,
        g.foto,
        g.seccion,
        g.direccion_archivos,
        g.link_aula_virtual,
        g.anio_escolar,
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
    const {
      nivel_id,
      numero_grado,
      seccion,
      anio_escolar,
      descripcion = '',
      direccion_archivos = '',
      link_aula_virtual = '',
      foto = 'default-grado.png'
    } = req.body;

    // Validaciones
    if (!nivel_id || !numero_grado || !seccion || !anio_escolar) {
      return res.status(400).json({
        message: 'Nivel, número de grado, sección y año escolar son requeridos'
      });
    }

    // Obtener información del nivel
    const nivelResult = await pool.query(`
      SELECT id, nombre, codigo, tipo_grados, grado_minimo, grado_maximo
      FROM niveles WHERE id = $1
    `, [nivel_id]);

    if (nivelResult.rows.length === 0) {
      return res.status(400).json({ message: 'El nivel especificado no existe' });
    }

    const nivel = nivelResult.rows[0];

    // Validar que el número de grado esté en el rango permitido
    if (numero_grado < nivel.grado_minimo || numero_grado > nivel.grado_maximo) {
      return res.status(400).json({
        message: `El número de grado debe estar entre ${nivel.grado_minimo} y ${nivel.grado_maximo}`
      });
    }

    // Generar nombre formateado
    const nombre = getGradoFormattedName(numero_grado, nivel.tipo_grados);

    // Generar código automático
    const codigo = generateGradoCodigo(nivel, numero_grado, seccion);

    // Verificar que no existe un grado con el mismo nivel, número y sección
    const existeGrado = await pool.query(`
      SELECT id FROM grados
      WHERE nivel_id = $1 AND nombre = $2 AND seccion = $3 AND anio_escolar = $4
    `, [nivel_id, nombre, seccion, anio_escolar]);

    if (existeGrado.rows.length > 0) {
      return res.status(400).json({
        message: 'Ya existe un grado con el mismo nivel, número y sección para este año'
      });
    }

    const query = `
      INSERT INTO grados (
        nombre, descripcion, codigo, nivel_id, seccion,
        direccion_archivos, link_aula_virtual, anio_escolar,
        orden, activo, foto
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10)
      RETURNING *
    `;

    const result = await pool.query(query, [
      nombre, descripcion, codigo, nivel_id, seccion,
      direccion_archivos, link_aula_virtual, anio_escolar,
      numero_grado, foto
    ]);

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
        g.foto,
        g.seccion,
        g.anio_escolar
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
