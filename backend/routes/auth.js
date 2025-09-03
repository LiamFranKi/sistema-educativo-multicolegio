const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generar token JWT
const generateToken = (userId, rol) => {
  return jwt.sign(
    { userId, rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// POST /api/auth/login
router.post('/login', [
  body('dni').notEmpty().withMessage('DNI es requerido'),
  body('clave').notEmpty().withMessage('Contraseña es requerida')
], async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { dni, clave } = req.body;

    // Buscar usuario por DNI
    const result = await query(
      'SELECT id, nombres, dni, email, clave, rol, activo, foto FROM usuarios WHERE dni = $1',
      [dni]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'DNI o contraseña incorrectos'
      });
    }

    const user = result.rows[0];

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(clave, user.clave);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'DNI o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generateToken(user.id, user.rol);

    // Remover contraseña de la respuesta
    delete user.clave;

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  // En un sistema más complejo, aquí podrías invalidar el token
  // Por ahora, simplemente confirmamos el logout
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

// GET /api/auth/verify
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    user: req.user
  });
});

// POST /api/auth/refresh
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    // Generar nuevo token
    const newToken = generateToken(req.user.id, req.user.rol);

    res.json({
      success: true,
      message: 'Token renovado',
      token: newToken
    });
  } catch (error) {
    console.error('Error renovando token:', error);
    res.status(500).json({
      success: false,
      message: 'Error renovando token'
    });
  }
});

module.exports = router;
