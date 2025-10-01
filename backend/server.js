const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// Rate limiting - DESACTIVADO para desarrollo
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000, // límite de 10000 requests por ventana (muy relajado para desarrollo)
//   message: {
//     error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
//   }
// });
// app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos con CORS
app.use('/uploads', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}), (req, res, next) => {
  // Headers específicos para imágenes
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads'));

// Servir previsualización de la web pública
// Notas:
// - Algunos entornos tienen problemas para resolver rutas con caracteres no ASCII ("ñ") en nombres de carpeta.
// - Para evitar 404 por encoding, exponemos:
//   a) Una ruta explícita para `header-vanguard-real.html`
//   b) Una carpeta estática a `docs/diseños` para el resto de assets
const previewCors = cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
});

function setPreviewCSP(req, res, next) {
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: https://images.unsplash.com https://i.pravatar.cc",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "script-src-attr 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "frame-src https://www.youtube.com https://www.google.com",
    "connect-src 'self'",
    "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
  ].join('; ');
  res.setHeader('Content-Security-Policy', csp);
  next();
}

// a) Ruta explícita al HTML principal de preview
app.get('/web-preview/header-vanguard-real.html', previewCors, setPreviewCSP, (req, res) => {
  const filePath = path.join(__dirname, '..', 'docs', 'diseños', 'header-vanguard-real.html');
  res.sendFile(filePath);
});

// Alias: acceder a /web-preview redirige al archivo principal
app.get('/web-preview', (req, res) => {
  res.redirect('/web-preview/header-vanguard-real.html');
});

// b) Servir assets estáticos (CSS/JS/IMG) desde la carpeta con "ñ"
app.use('/web-preview', previewCors, setPreviewCSP, express.static(path.join(__dirname, '..', 'docs', 'diseños')));
// Fallback: si por temas de encoding no encuentra en "diseños", servir desde la raíz de docs
app.use('/web-preview', previewCors, setPreviewCSP, express.static(path.join(__dirname, '..', 'docs')));

// Favicon vacío para evitar 404 en la preview
app.get('/web-preview/favicon.ico', (req, res) => res.status(204).end());

// Rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/anios-escolares', require('./routes/aniosEscolares'));
app.use('/api/publicaciones', require('./routes/publicaciones'));
app.use('/api/notificaciones', require('./routes/notificaciones'));
app.use('/api/files', require('./routes/files'));
app.use('/api/configuracion', require('./routes/configuracion'));
app.use('/api/niveles', require('./routes/niveles'));
app.use('/api/grados', require('./routes/grados'));
app.use('/api/areas', require('./routes/areas'));
app.use('/api/turnos', require('./routes/turnos'));
app.use('/api/avatars', require('./routes/avatars'));
app.use('/api/cursos', require('./routes/cursos'));
app.use('/api/web', require('./routes/web'));
app.use('/api/web-admin', require('./routes/webAdmin'));

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema Educativo Multi-Colegio API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS habilitado para: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

module.exports = app;
