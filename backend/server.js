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
const fs = require('fs');
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

// ===== RUTAS DE WEB PREVIEW (ANTES DE LAS RUTAS DE API) =====
console.log('🔧 Registrando rutas de web-preview...');

// Diagnóstico simple: verificar rutas y existencia de archivos (texto plano)
app.get('/wpd', (req, res) => {
  try {
    const publicWeb = path.join(__dirname, 'public', 'web', 'header-vanguard-real.html');
    const fileDiseños = path.join(__dirname, '..', 'docs', 'diseños', 'header-vanguard-real.html');
    const fileWeb = path.join(__dirname, '..', 'docs', 'web', 'header-vanguard-real.html');
    const fileDocsRoot = path.join(__dirname, '..', 'docs', 'header-vanguard-real.html');

    const lines = [];
    lines.push('cwd=' + process.cwd());
    lines.push('__dirname=' + __dirname);
    lines.push('publicWeb=' + publicWeb + ' exists=' + fs.existsSync(publicWeb));
    lines.push('fileDiseños=' + fileDiseños + ' exists=' + fs.existsSync(fileDiseños));
    lines.push('fileWeb=' + fileWeb + ' exists=' + fs.existsSync(fileWeb));
    lines.push('fileDocsRoot=' + fileDocsRoot + ' exists=' + fs.existsSync(fileDocsRoot));
    res.set('Content-Type', 'text/plain').send(lines.join('\n'));
  } catch (e) {
    res.status(500).send('error:' + (e && e.message));
  }
});

// Debug: verificar qué archivos están disponibles
app.get('/web-preview/debug', (req, res) => {
  console.log('🔍 Debug endpoint llamado');
  const baseDir = path.join(__dirname, '..');
  const docsDir = path.join(baseDir, 'docs');
  const diseñosDir = path.join(docsDir, 'diseños');
  const webDir = path.join(docsDir, 'web');

  const debug = {
    baseDir,
    docsDir,
    diseñosDir,
    webDir,
    exists: {
      docs: fs.existsSync(docsDir),
      diseños: fs.existsSync(diseñosDir),
      web: fs.existsSync(webDir)
    },
    files: {
      docs: fs.existsSync(docsDir) ? fs.readdirSync(docsDir) : [],
      diseños: fs.existsSync(diseñosDir) ? fs.readdirSync(diseñosDir) : [],
      web: fs.existsSync(webDir) ? fs.readdirSync(webDir) : []
    }
  };

  res.json(debug);
});

// a) Ruta explícita al HTML principal de preview
app.get('/web-preview/header-vanguard-real.html', previewCors, setPreviewCSP, (req, res) => {
  console.log('📄 Ruta header-vanguard-real.html llamada');
  const publicWeb = path.join(__dirname, 'public', 'web', 'header-vanguard-real.html');
  const fileDiseños = path.join(__dirname, '..', 'docs', 'diseños', 'header-vanguard-real.html');
  const fileWeb = path.join(__dirname, '..', 'docs', 'web', 'header-vanguard-real.html');
  const fileDocsRoot = path.join(__dirname, '..', 'docs', 'header-vanguard-real.html');

  const candidate = fs.existsSync(publicWeb)
    ? publicWeb
    : fs.existsSync(fileDiseños)
      ? fileDiseños
      : fs.existsSync(fileWeb)
        ? fileWeb
        : fs.existsSync(fileDocsRoot)
          ? fileDocsRoot
          : null;

  if (!candidate) {
    console.log('❌ Archivo no encontrado en ninguna ubicación');
    return res.status(404).send('Archivo de preview no encontrado');
  }
  console.log('✅ Sirviendo archivo desde:', candidate);
  res.sendFile(candidate);
});

// Alias: acceder a /web-preview redirige al archivo principal
app.get('/web-preview', (req, res) => {
  console.log('🔄 Redirigiendo /web-preview a header-vanguard-real.html');
  res.redirect('/web-preview/header-vanguard-real.html');
});

// b) Servir assets estáticos (CSS/JS/IMG)
// 1) Priorizar carpeta dentro de backend (siempre incluida en despliegue)
app.use('/web-preview', previewCors, setPreviewCSP, express.static(path.join(__dirname, 'public', 'web')));
// 2) Carpeta con "ñ" (puede fallar en algunos entornos)
app.use('/web-preview', previewCors, setPreviewCSP, express.static(path.join(__dirname, '..', 'docs', 'diseños')));
// 3) Raíz de docs
app.use('/web-preview', previewCors, setPreviewCSP, express.static(path.join(__dirname, '..', 'docs')));
// 4) Carpeta ascii 'web'
app.use('/web-preview', previewCors, setPreviewCSP, express.static(path.join(__dirname, '..', 'docs', 'web')));

// Favicon vacío para evitar 404 en la preview
app.get('/web-preview/favicon.ico', (req, res) => res.status(204).end());

// ===== RUTAS DE LA API =====

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
  console.log('❌ Ruta no encontrada:', req.method, req.originalUrl);
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
