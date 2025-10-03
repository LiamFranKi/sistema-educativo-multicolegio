const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware para verificar JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('🔐 Auth middleware - URL:', req.originalUrl);
  console.log('🔐 Auth middleware - Token presente:', !!token);

  if (!token) {
    console.log('❌ Auth middleware - Sin token');
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔐 Auth middleware - Token válido, userId:', decoded.userId);

    // Verificar que el usuario existe y está activo
    const result = await query(
      'SELECT id, nombres, email, rol, activo FROM usuarios WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      console.log('❌ Auth middleware - Usuario no encontrado');
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = result.rows[0];

    if (!user.activo) {
      console.log('❌ Auth middleware - Usuario inactivo');
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    console.log('✅ Auth middleware - Usuario autenticado:', user.email);
    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Auth middleware - Error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const userRole = req.user.rol;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      });
    }

    next();
  };
};

// Middleware para verificar si es administrador
const requireAdmin = requireRole('Administrador');

// Middleware para verificar si es docente o superior
const requireDocente = requireRole(['Administrador', 'Docente', 'Tutor']);

// Middleware opcional para autenticación (no falla si no hay token)
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await query(
      'SELECT id, nombres, email, rol, activo FROM usuarios WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length > 0 && result.rows[0].activo) {
      req.user = result.rows[0];
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }

  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireDocente,
  optionalAuth
};
