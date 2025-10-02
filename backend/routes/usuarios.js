const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/usuarios - Obtener usuarios (solo administradores)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, rol, activo, search, orderBy = 'created_at', orderDirection = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Filtro por rol
    if (rol) {
      paramCount++;
      whereClause += ` AND rol = $${paramCount}`;
      params.push(rol);
    }

    // Filtro por estado activo
    if (activo !== undefined) {
      paramCount++;
      whereClause += ` AND activo = $${paramCount}`;
      params.push(activo === 'true');
    }

    // Búsqueda por nombre o DNI
    if (search) {
      paramCount++;
      whereClause += ` AND (nombres ILIKE $${paramCount} OR dni ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Validar campos de ordenamiento
    const allowedOrderFields = ['nombres', 'apellidos', 'dni', 'email', 'created_at', 'updated_at'];
    const validOrderBy = allowedOrderFields.includes(orderBy) ? orderBy : 'created_at';
    const validOrderDirection = ['ASC', 'DESC'].includes(orderDirection.toUpperCase()) ? orderDirection.toUpperCase() : 'DESC';

    // Consulta principal
    const result = await query(
      `SELECT id, nombres, apellidos, dni, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, rol, activo, qr_code, created_at, updated_at
       FROM usuarios ${whereClause}
       ORDER BY ${validOrderBy} ${validOrderDirection}
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      [...params, limit, offset]
    );

    // Contar total de registros
    const countResult = await query(
      `SELECT COUNT(*) as total FROM usuarios ${whereClause}`,
      params
    );

    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      usuarios: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, nombres, apellidos, dni, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, rol, activo, qr_code, created_at, updated_at FROM usuarios WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/usuarios - Crear usuario (solo administradores)
router.post('/', authenticateToken, requireAdmin, [
  body('nombres').notEmpty().withMessage('Nombres son requeridos'),
  body('dni').isLength({ min: 8, max: 8 }).withMessage('DNI debe tener 8 dígitos'),
  body('email').isEmail().withMessage('Email inválido'),
  body('rol').isIn(['Administrador', 'Docente', 'Alumno', 'Apoderado', 'Tutor', 'Psicologia', 'Secretaria', 'Director', 'Promotor']).withMessage('Rol inválido'),
  body('clave').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres')
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

    const { nombres, apellidos, dni, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, rol, clave } = req.body;

    // Verificar si el DNI ya existe
    const dniCheck = await query('SELECT id FROM usuarios WHERE dni = $1', [dni]);
    if (dniCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El DNI ya está registrado'
      });
    }

    // Verificar si el email ya existe
    const emailCheck = await query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(clave, 10);

    // Crear usuario primero (sin código QR)
    const result = await query(
      `INSERT INTO usuarios (nombres, apellidos, dni, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, rol, clave, activo, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, NOW(), NOW())
       RETURNING id`,
      [nombres, apellidos, dni, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, rol, hashedPassword]
    );

    const userId = result.rows[0].id;

    // Generar código QR único con el ID del usuario
    const qrCode = `USR-${userId}-${dni}`;

    // Actualizar usuario con el código QR
    const updateResult = await query(
      `UPDATE usuarios SET qr_code = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, nombres, apellidos, dni, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, rol, qr_code, activo, created_at, updated_at`,
      [qrCode, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: updateResult.rows[0]
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', authenticateToken, [
  body('nombres').optional().notEmpty().withMessage('Nombres no pueden estar vacíos'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('telefono').optional().isLength({ min: 9 }).withMessage('Teléfono inválido')
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
    const { nombres, apellidos, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto } = req.body;

    // Verificar si el usuario existe
    const userCheck = await query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar permisos (solo puede actualizar su propio perfil o ser administrador)
    if (req.user.id !== parseInt(id) && !['Superadministrador', 'Administrador'].includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar este usuario'
      });
    }

    // Verificar si el email ya existe en otro usuario
    if (email) {
      const emailCheck = await query('SELECT id FROM usuarios WHERE email = $1 AND id != $2', [email, id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado por otro usuario'
        });
      }
    }

    // Actualizar usuario
    const result = await query(
      `UPDATE usuarios
       SET nombres = COALESCE($1, nombres),
           apellidos = COALESCE($2, apellidos),
           email = COALESCE($3, email),
           telefono = COALESCE($4, telefono),
           fecha_nacimiento = COALESCE($5, fecha_nacimiento),
           direccion = COALESCE($6, direccion),
           genero = COALESCE($7, genero),
           estado_civil = COALESCE($8, estado_civil),
           profesion = COALESCE($9, profesion),
           foto = COALESCE($10, foto),
           updated_at = NOW()
       WHERE id = $11
       RETURNING id, nombres, apellidos, dni, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, rol, activo, created_at, updated_at`,
      [nombres, apellidos, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, id]
    );

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/usuarios/:id/permisos - Actualizar permisos (rol y contraseña)
router.put('/:id/permisos', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rol, clave } = req.body;

    console.log('=== INICIO ACTUALIZACIÓN PERMISOS ===');
    console.log('Usuario ID:', id);
    console.log('Datos recibidos:', { rol, clave: clave ? '[PROVIDED]' : '[NOT PROVIDED]' });

    // Verificar si el usuario existe
    console.log('Verificando existencia del usuario...');
    const userCheck = await query('SELECT id FROM usuarios WHERE id = $1', [id]);
    console.log('Resultado verificación:', userCheck.rows);

    if (userCheck.rows.length === 0) {
      console.log('Usuario no encontrado');
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    console.log('Usuario encontrado, preparando actualización...');

    // Construir la consulta SQL de forma más simple
    let sql = 'UPDATE usuarios SET ';
    let params = [];
    let paramCount = 0;
    let hasUpdates = false;

    // Actualizar rol si se proporciona
    if (rol) {
      // Validar rol contra la lista permitida (igual que en creación)
      const allowedRoles = ['Administrador', 'Docente', 'Alumno', 'Apoderado', 'Tutor', 'Psicologia', 'Secretaria', 'Director', 'Promotor'];
      if (!allowedRoles.includes(rol)) {
        return res.status(400).json({ success: false, message: 'Rol inválido' });
      }
      paramCount++;
      sql += `rol = $${paramCount}`;
      params.push(rol);
      hasUpdates = true;
      console.log('Rol a actualizar:', rol);
    }

    // Actualizar contraseña si se proporciona
    if (clave && clave.trim() !== '') {
      if (hasUpdates) sql += ', ';
      paramCount++;
      const hashedPassword = await bcrypt.hash(clave, 10);
      sql += `clave = $${paramCount}`;
      params.push(hashedPassword);
      hasUpdates = true;
      console.log('Contraseña a actualizar: [HASHED]');
    }

    if (!hasUpdates) {
      console.log('No hay datos para actualizar');
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron datos para actualizar'
      });
    }

    // Agregar updated_at y WHERE
    sql += ', updated_at = NOW() WHERE id = $' + (paramCount + 1);
    params.push(id);

    console.log('SQL final:', sql);
    console.log('Parámetros finales:', params);

    // Ejecutar la consulta
    const result = await query(sql, params);
    console.log('Resultado de la consulta:', result.rows);

    // Obtener el usuario actualizado
    const updatedUser = await query(
      'SELECT id, nombres, apellidos, dni, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, rol, activo, qr_code, created_at, updated_at FROM usuarios WHERE id = $1',
      [id]
    );

    console.log('Usuario actualizado:', updatedUser.rows[0]);
    console.log('=== FIN ACTUALIZACIÓN PERMISOS ===');

    res.json({
      success: true,
      message: 'Permisos actualizados exitosamente',
      user: updatedUser.rows[0]
    });

  } catch (error) {
    console.error('=== ERROR EN ACTUALIZACIÓN PERMISOS ===');
    console.error('Error:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('=== FIN ERROR ===');
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/usuarios/:id - Eliminar usuario (solo administradores)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const userCheck = await query('SELECT id, nombres FROM usuarios WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir eliminar el propio usuario
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propio usuario'
      });
    }

    // Eliminar usuario completamente de la base de datos
    await query('DELETE FROM usuarios WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/usuarios/verificar-dni - Verificar DNI
router.get('/verificar-dni', authenticateToken, async (req, res) => {
  try {
    const { dni, rol } = req.query;

    if (!dni) {
      return res.status(400).json({
        success: false,
        message: 'DNI es requerido'
      });
    }

    const result = await query(
      'SELECT id, nombres, dni, email, rol, activo FROM usuarios WHERE dni = $1',
      [dni]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        exists: false,
        message: 'DNI no encontrado'
      });
    }

    const user = result.rows[0];

    // Si se especifica un rol, verificar que coincida
    if (rol && user.rol !== rol) {
      return res.json({
        success: true,
        exists: false,
        message: `El DNI existe pero el usuario es ${user.rol}, no ${rol}`
      });
    }

    res.json({
      success: true,
      exists: true,
      user: {
        id: user.id,
        nombres: user.nombres,
        dni: user.dni,
        email: user.email,
        rol: user.rol,
        activo: user.activo
      }
    });

  } catch (error) {
    console.error('Error verificando DNI:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
