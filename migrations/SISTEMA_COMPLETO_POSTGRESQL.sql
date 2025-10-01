-- =====================================================
-- SISTEMA EDUCATIVO MULTI-COLEGIO - MIGRACIÓN COMPLETA
-- PostgreSQL - Todo el sistema en un solo archivo
-- Fecha: 2025-01-16
-- =====================================================

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABLAS BÁSICAS DEL SISTEMA
-- =====================================================

-- Tabla usuarios (MANTENIENDO LÓGICA DEL SISTEMA ACTUAL)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,        -- Campo de login (único)
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    clave VARCHAR(255) NOT NULL,            -- Password encriptado
    foto VARCHAR(500),                      -- Avatar del usuario
    activo BOOLEAN DEFAULT true,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Superadministrador', 'Administrador', 'Docente', 'Alumno', 'Apoderado', 'Tutor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla colegios (NUEVA - Multi-tenant)
CREATE TABLE IF NOT EXISTS colegios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,     -- RUC del colegio
    logo VARCHAR(500),                      -- URL del logo
    color_primario VARCHAR(7) DEFAULT '#1976d2',
    color_secundario VARCHAR(7) DEFAULT '#424242',
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(255),
    director_nombre VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla anios_escolares (NUEVA - Simplificada)
CREATE TABLE IF NOT EXISTS anios_escolares (
    id SERIAL PRIMARY KEY,
    colegio_id INTEGER REFERENCES colegios(id) ON DELETE CASCADE,
    anio INTEGER NOT NULL,                  -- Solo el año (ej: 2025)
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(colegio_id, anio)                -- Un año por colegio
);

-- Tabla niveles educativos
CREATE TABLE IF NOT EXISTS niveles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    codigo VARCHAR(10) NOT NULL UNIQUE,
    orden INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla cursos/áreas curriculares
CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    abreviatura VARCHAR(20) NOT NULL,
    nivel_id INTEGER NOT NULL,
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT uk_cursos_nombre_nivel UNIQUE (nombre, nivel_id),
    CONSTRAINT uk_cursos_abreviatura UNIQUE (abreviatura),
    CONSTRAINT fk_cursos_nivel FOREIGN KEY (nivel_id) REFERENCES niveles(id) ON DELETE RESTRICT
);

-- Tabla grados
CREATE TABLE IF NOT EXISTS grados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nivel_id INTEGER NOT NULL REFERENCES niveles(id) ON DELETE CASCADE,
    orden INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nombre, nivel_id)
);

-- Tabla turnos
CREATE TABLE IF NOT EXISTS turnos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla áreas
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla configuración
CREATE TABLE IF NOT EXISTS configuracion (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    descripcion VARCHAR(255),
    tipo VARCHAR(50) DEFAULT 'text',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla avatars
CREATE TABLE IF NOT EXISTS avatars (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    genero VARCHAR(10) DEFAULT 'neutro',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. TABLAS DEL SITIO WEB CMS
-- =====================================================

-- Tabla settings_web (colores, tipografía, contacto, redes, etc.)
CREATE TABLE IF NOT EXISTS settings_web (
  id             SERIAL PRIMARY KEY,
  clave          VARCHAR(100) UNIQUE NOT NULL,
  valor          TEXT NOT NULL,
  descripcion    VARCHAR(255),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla menus
CREATE TABLE IF NOT EXISTS menus (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(120) NOT NULL,
  url            VARCHAR(255),
  orden          INT NOT NULL DEFAULT 1,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla submenus
CREATE TABLE IF NOT EXISTS submenus (
  id             SERIAL PRIMARY KEY,
  menu_id        INT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  nombre         VARCHAR(160) NOT NULL,
  url            VARCHAR(255),
  orden          INT NOT NULL DEFAULT 1,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla home_banner
CREATE TABLE IF NOT EXISTS home_banner (
  id             SERIAL PRIMARY KEY,
  imagen_url     VARCHAR(500) NOT NULL,
  altura_px      INT NOT NULL DEFAULT 320,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla home_principal
CREATE TABLE IF NOT EXISTS home_principal (
  id             SERIAL PRIMARY KEY,
  titulo         VARCHAR(255) NOT NULL,
  subtitulo      TEXT,
  descripcion    TEXT,
  cita_texto     TEXT,
  cita_autor     VARCHAR(255),
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla home_secciones
CREATE TABLE IF NOT EXISTS home_secciones (
  id             SERIAL PRIMARY KEY,
  titulo         VARCHAR(255) NOT NULL,
  subtitulo      TEXT,
  descripcion    TEXT,
  orden          INT NOT NULL DEFAULT 1,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla home_items
CREATE TABLE IF NOT EXISTS home_items (
  id             SERIAL PRIMARY KEY,
  seccion_id     INT NOT NULL REFERENCES home_secciones(id) ON DELETE CASCADE,
  titulo         VARCHAR(255) NOT NULL,
  descripcion    TEXT,
  icono          VARCHAR(100),
  orden          INT NOT NULL DEFAULT 1,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla testimonios
CREATE TABLE IF NOT EXISTS testimonios (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(255) NOT NULL,
  cargo          VARCHAR(255),
  testimonio     TEXT NOT NULL,
  foto_url       VARCHAR(500),
  orden          INT NOT NULL DEFAULT 1,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 3. TABLAS CMS GENÉRICO (PAGES/SECTIONS/BLOCKS)
-- =====================================================

-- Tabla pages
CREATE TABLE IF NOT EXISTS pages (
  id             SERIAL PRIMARY KEY,
  slug           VARCHAR(255) UNIQUE NOT NULL,
  titulo         VARCHAR(255) NOT NULL,
  estado         VARCHAR(50) NOT NULL DEFAULT 'borrador',
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla sections
CREATE TABLE IF NOT EXISTS sections (
  id             SERIAL PRIMARY KEY,
  page_id        INT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  key            VARCHAR(255) NOT NULL,
  titulo         VARCHAR(255) NOT NULL,
  layout         VARCHAR(100) NOT NULL DEFAULT 'default',
  orden          INT NOT NULL DEFAULT 1,
  contenido_json JSONB,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla blocks
CREATE TABLE IF NOT EXISTS blocks (
  id             SERIAL PRIMARY KEY,
  section_id     INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  tipo           VARCHAR(100) NOT NULL,
  orden          INT NOT NULL DEFAULT 1,
  contenido_json JSONB,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla media
CREATE TABLE IF NOT EXISTS media (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(255) NOT NULL,
  tipo           VARCHAR(100) NOT NULL,
  url            VARCHAR(500) NOT NULL,
  tamaño         BIGINT,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_dni ON usuarios(dni);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Índices para colegios
CREATE INDEX IF NOT EXISTS idx_colegios_codigo ON colegios(codigo);
CREATE INDEX IF NOT EXISTS idx_colegios_activo ON colegios(activo);

-- Índices para años escolares
CREATE INDEX IF NOT EXISTS idx_anios_escolares_colegio ON anios_escolares(colegio_id);
CREATE INDEX IF NOT EXISTS idx_anios_escolares_anio ON anios_escolares(anio);
CREATE INDEX IF NOT EXISTS idx_anios_escolares_activo ON anios_escolares(activo);

-- Índices para niveles
CREATE INDEX IF NOT EXISTS idx_niveles_activo ON niveles(activo);
CREATE INDEX IF NOT EXISTS idx_niveles_orden ON niveles(orden);
CREATE INDEX IF NOT EXISTS idx_niveles_codigo ON niveles(codigo);

-- Índices para cursos
CREATE INDEX IF NOT EXISTS idx_cursos_nivel_id ON cursos(nivel_id);
CREATE INDEX IF NOT EXISTS idx_cursos_activo ON cursos(activo);
CREATE INDEX IF NOT EXISTS idx_cursos_nombre ON cursos(nombre);
CREATE INDEX IF NOT EXISTS idx_cursos_abreviatura ON cursos(abreviatura);

-- Índices para grados
CREATE INDEX IF NOT EXISTS idx_grados_nivel_id ON grados(nivel_id);
CREATE INDEX IF NOT EXISTS idx_grados_activo ON grados(activo);

-- Índices para turnos
CREATE INDEX IF NOT EXISTS idx_turnos_activo ON turnos(activo);

-- Índices para áreas
CREATE INDEX IF NOT EXISTS idx_areas_activo ON areas(activo);

-- Índices para configuración
CREATE INDEX IF NOT EXISTS idx_configuracion_clave ON configuracion(clave);
CREATE INDEX IF NOT EXISTS idx_configuracion_activo ON configuracion(activo);

-- Índices para avatars
CREATE INDEX IF NOT EXISTS idx_avatars_activo ON avatars(activo);

-- Índices para CMS web
CREATE INDEX IF NOT EXISTS idx_menus_activo ON menus(activo);
CREATE INDEX IF NOT EXISTS idx_menus_orden ON menus(orden);
CREATE INDEX IF NOT EXISTS idx_submenus_menu_id ON submenus(menu_id);
CREATE INDEX IF NOT EXISTS idx_submenus_activo ON submenus(activo);

-- Índices para pages/sections/blocks
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_estado ON pages(estado);
CREATE INDEX IF NOT EXISTS idx_sections_page_id ON sections(page_id);
CREATE INDEX IF NOT EXISTS idx_sections_key ON sections(key);
CREATE INDEX IF NOT EXISTS idx_blocks_section_id ON blocks(section_id);
CREATE INDEX IF NOT EXISTS idx_blocks_tipo ON blocks(tipo);

-- =====================================================
-- 5. FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 6. TRIGGERS PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- =====================================================

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colegios_updated_at BEFORE UPDATE ON colegios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_anios_escolares_updated_at BEFORE UPDATE ON anios_escolares FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_niveles_updated_at BEFORE UPDATE ON niveles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cursos_updated_at BEFORE UPDATE ON cursos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grados_updated_at BEFORE UPDATE ON grados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_turnos_updated_at BEFORE UPDATE ON turnos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracion_updated_at BEFORE UPDATE ON configuracion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_avatars_updated_at BEFORE UPDATE ON avatars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. DATOS INICIALES DEL SISTEMA
-- =====================================================

-- Usuario superadministrador
INSERT INTO usuarios (nombres, dni, email, telefono, fecha_nacimiento, clave, foto, activo, rol, created_at, updated_at)
VALUES ('Administrador de Sistemas', '11111111', 'administrador@sistemas.com', '970877642', '1983-04-26', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '', true, 'Superadministrador', '2024-12-19', '2024-12-19')
ON CONFLICT (dni) DO NOTHING;

-- Colegio de ejemplo
INSERT INTO colegios (nombre, codigo, logo, color_primario, color_secundario, direccion, telefono, email, director_nombre, activo, created_at, updated_at)
VALUES ('Vanguard Schools - Sede SMP', '20535891622', '', '#1976d2', '#424242', 'Jr Toribio de Luzuriaga Mz F lote 18 y 19 Urb San Pedro de Garagay SMP', '910526895', 'vanguard@vanguard.com', 'Rosario Maravi Lagos', true, '2024-12-19', '2024-12-19')
ON CONFLICT (codigo) DO NOTHING;

-- Año escolar 2025
INSERT INTO anios_escolares (colegio_id, anio, activo, created_at, updated_at)
VALUES (1, 2025, true, '2024-12-19', '2024-12-19')
ON CONFLICT (colegio_id, anio) DO NOTHING;

-- Niveles educativos del sistema peruano
INSERT INTO niveles (nombre, descripcion, codigo, orden, activo) VALUES
('Inicial', 'Educación Preescolar', 'INI', 1, true),
('Primaria', 'Educación Básica Regular', 'PRI', 2, true),
('Secundaria', 'Educación Secundaria', 'SEC', 3, true)
ON CONFLICT (codigo) DO NOTHING;

-- Cursos predefinidos por nivel
-- Cursos para NIVEL INICIAL
INSERT INTO cursos (nombre, descripcion, abreviatura, nivel_id, activo) VALUES
('Comunicación', 'Desarrollo del lenguaje oral y escrito, comprensión lectora y expresión', 'COMI', 1, true),
('Matemática', 'Números, formas, patrones y resolución de problemas básicos', 'MATI', 1, true),
('Personal Social', 'Desarrollo personal, social y emocional del niño', 'PESI', 1, true),
('Ciencia y Ambiente', 'Exploración del entorno natural y cuidado del medio ambiente', 'CIAI', 1, true),
('Arte', 'Expresión artística, creatividad y apreciación estética', 'ARTI', 1, true),
('Psicomotricidad', 'Desarrollo motor grueso y fino, coordinación y equilibrio', 'PSI', 1, true)
ON CONFLICT (nombre, nivel_id) DO NOTHING;

-- Cursos para NIVEL PRIMARIA
INSERT INTO cursos (nombre, descripcion, abreviatura, nivel_id, activo) VALUES
('Comunicación', 'Lenguaje oral y escrito, comprensión lectora, producción de textos', 'COMP', 2, true),
('Matemática', 'Números y operaciones, geometría, medición y estadística', 'MATP', 2, true),
('Personal Social', 'Historia del Perú, geografía, formación ciudadana', 'PESP', 2, true),
('Ciencia y Ambiente', 'Seres vivos, materia y energía, Tierra y universo', 'CIAP', 2, true),
('Arte y Cultura', 'Expresión artística, apreciación cultural y patrimonio', 'ARTP', 2, true),
('Educación Física', 'Desarrollo físico, deportes y vida saludable', 'EDFP', 2, true),
('Inglés', 'Idioma extranjero inglés como segunda lengua', 'INGP', 2, true),
('Religión', 'Formación religiosa y valores cristianos', 'RELP', 2, true)
ON CONFLICT (nombre, nivel_id) DO NOTHING;

-- Cursos para NIVEL SECUNDARIA
INSERT INTO cursos (nombre, descripcion, abreviatura, nivel_id, activo) VALUES
('Comunicación', 'Lengua y literatura, comprensión lectora, producción textual', 'COMS', 3, true),
('Matemática', 'Álgebra, geometría, trigonometría, estadística y probabilidad', 'MATS', 3, true),
('Historia, Geografía y Economía', 'Historia del Perú y universal, geografía, economía', 'HGE', 3, true),
('Ciencia, Tecnología y Ambiente', 'Biología, química, física y tecnología', 'CTA', 3, true),
('Arte y Cultura', 'Expresión artística, historia del arte y patrimonio cultural', 'ARTS', 3, true),
('Educación Física', 'Deportes, acondicionamiento físico y vida saludable', 'EDFS', 3, true),
('Inglés', 'Idioma extranjero inglés nivel intermedio-avanzado', 'INGS', 3, true),
('Religión', 'Formación religiosa, ética y valores cristianos', 'RELS', 3, true),
('Formación Ciudadana y Cívica', 'Derechos humanos, democracia y participación ciudadana', 'FCC', 3, true),
('Educación para el Trabajo', 'Orientación vocacional y habilidades laborales', 'EPT', 3, true)
ON CONFLICT (nombre, nivel_id) DO NOTHING;

-- Grados por nivel
INSERT INTO grados (nombre, nivel_id, orden, activo) VALUES
-- Inicial
('3 años', 1, 1, true),
('4 años', 1, 2, true),
('5 años', 1, 3, true),
-- Primaria
('1° Grado', 2, 1, true),
('2° Grado', 2, 2, true),
('3° Grado', 2, 3, true),
('4° Grado', 2, 4, true),
('5° Grado', 2, 5, true),
('6° Grado', 2, 6, true),
-- Secundaria
('1° Secundaria', 3, 1, true),
('2° Secundaria', 3, 2, true),
('3° Secundaria', 3, 3, true),
('4° Secundaria', 3, 4, true),
('5° Secundaria', 3, 5, true)
ON CONFLICT (nombre, nivel_id) DO NOTHING;

-- Turnos
INSERT INTO turnos (nombre, hora_inicio, hora_fin, activo) VALUES
('Mañana', '08:00:00', '12:00:00', true),
('Tarde', '14:00:00', '18:00:00', true),
('Noche', '19:00:00', '22:00:00', true)
ON CONFLICT (nombre) DO NOTHING;

-- Áreas
INSERT INTO areas (nombre, descripcion, activo) VALUES
('Área de Comunicación', 'Comunicación integral, lengua y literatura', true),
('Área de Matemática', 'Matemática, lógica y razonamiento', true),
('Área de Ciencias', 'Ciencias naturales, sociales y tecnología', true),
('Área de Arte', 'Arte, cultura y expresión artística', true),
('Área de Educación Física', 'Educación física y deportes', true),
('Área de Inglés', 'Idioma extranjero inglés', true),
('Área de Religión', 'Formación religiosa y valores', true)
ON CONFLICT (nombre) DO NOTHING;

-- Configuración inicial
INSERT INTO configuracion (clave, valor, descripcion, tipo, activo) VALUES
('nombre_colegio', 'Vanguard Schools', 'Nombre del colegio', 'text', true),
('direccion_colegio', 'Jr Toribio de Luzuriaga Mz F lote 18 y 19 Urb San Pedro de Garagay SMP', 'Dirección del colegio', 'text', true),
('telefono_colegio', '910526895', 'Teléfono del colegio', 'text', true),
('email_colegio', 'vanguard@vanguard.com', 'Email del colegio', 'email', true),
('director_colegio', 'Rosario Maravi Lagos', 'Nombre del director', 'text', true),
('color_primario', '#1976d2', 'Color primario del sistema', 'color', true),
('color_secundario', '#424242', 'Color secundario del sistema', 'color', true)
ON CONFLICT (clave) DO NOTHING;

-- Avatars por defecto
INSERT INTO avatars (nombre, imagen, genero, activo) VALUES
('Avatar 1', 'avatar1.png', 'neutro', true),
('Avatar 2', 'avatar2.png', 'neutro', true),
('Avatar 3', 'avatar3.png', 'neutro', true),
('Avatar 4', 'avatar4.png', 'neutro', true),
('Avatar 5', 'avatar5.png', 'neutro', true),
('Avatar 6', 'avatar6.png', 'neutro', true),
('Avatar 7', 'avatar7.png', 'neutro', true),
('Avatar 8', 'avatar8.png', 'neutro', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. DATOS INICIALES DEL SITIO WEB CMS
-- =====================================================

-- Menús principales
INSERT INTO menus (nombre, url, orden, activo) VALUES
('Inicio', '/', 1, true),
('Niveles', NULL, 2, true),
('Tour Virtual', '/tour-virtual', 3, true),
('Preguntas Frecuentes', '/preguntas-frecuentes', 4, true),
('Contacto', '/contacto', 5, true)
ON CONFLICT DO NOTHING;

-- Submenús
INSERT INTO submenus (menu_id, nombre, url, orden, activo) VALUES
-- Submenús de Inicio
(1, 'Visita Guiada', '/visita-guiada', 1, true),
(1, 'Lista de Útiles', '/lista-utiles', 2, true),
(1, 'Documentos de Interés', '/documentos', 3, true),
(1, 'Trabaja con Nosotros', '/trabaja-con-nosotros', 4, true),
-- Submenús de Niveles
(2, 'Nivel Inicial', '/nivel-inicial', 1, true),
(2, 'Nivel Primaria', '/nivel-primaria', 2, true),
(2, 'Nivel Secundaria', '/nivel-secundaria', 3, true)
ON CONFLICT DO NOTHING;

-- Banner del home
INSERT INTO home_banner (imagen_url, altura_px, activo) VALUES
('bannerhome.jpg', 320, true)
ON CONFLICT DO NOTHING;

-- Contenido principal del home
INSERT INTO home_principal (titulo, subtitulo, descripcion, cita_texto, cita_autor, activo) VALUES
('¿Por qué estudiar en Vanguard Schools?', 'Excelencia Educativa desde 1995', 'En Vanguard Schools, creemos que cada estudiante tiene el potencial para alcanzar la excelencia. Nuestro enfoque integral combina metodologías pedagógicas innovadoras con valores sólidos, preparando a nuestros alumnos no solo para el éxito académico, sino para ser ciudadanos responsables y líderes del mañana.', 'La educación es el arma más poderosa que puedes usar para cambiar el mundo.', 'Nelson Mandela', true)
ON CONFLICT DO NOTHING;

-- Secciones del home
INSERT INTO home_secciones (titulo, subtitulo, descripcion, orden, activo) VALUES
('Nuestra Identidad', 'Valores y principios que nos definen', 'Conoce los pilares fundamentales que guían nuestra propuesta educativa', 1, true),
('Nuestras Instalaciones', 'Espacios diseñados para el aprendizaje', 'Infraestructura moderna y equipada para brindar la mejor experiencia educativa', 2, true),
('Programas Especiales', 'Ofertas educativas diferenciadas', 'Programas únicos que complementan nuestra propuesta académica', 3, true),
('Niveles Educativos', 'Propuesta pedagógica por niveles', 'Conoce nuestra metodología adaptada a cada etapa del desarrollo', 4, true)
ON CONFLICT DO NOTHING;

-- Items de las secciones
INSERT INTO home_items (seccion_id, titulo, descripcion, icono, orden, activo) VALUES
-- Nuestra Identidad
(1, 'Excelencia Académica', 'Metodologías innovadoras y docentes altamente capacitados', '🎓', 1, true),
(1, 'Formación Integral', 'Desarrollo de habilidades cognitivas, sociales y emocionales', '🌟', 2, true),
(1, 'Valores Cristianos', 'Formación en principios y valores que fortalecen el carácter', '⛪', 3, true),
(1, 'Innovación Tecnológica', 'Integración de tecnología educativa de vanguardia', '💻', 4, true),

-- Nuestras Instalaciones
(2, 'Aulas Modernas', 'Espacios amplios y equipados con tecnología educativa', '🏫', 1, true),
(2, 'Laboratorios', 'Laboratorios de ciencias y computación completamente equipados', '🔬', 2, true),
(2, 'Biblioteca', 'Biblioteca digital con acceso a recursos educativos online', '📚', 3, true),
(2, 'Áreas Deportivas', 'Canchas deportivas y espacios para actividades físicas', '⚽', 4, true),
(2, 'Natación', 'Piscinas temperadas para clases de natación', '🏊', 5, true),
(2, 'Canchas Sintéticas', '02 canchas sintéticas polideportivas', '🏟️', 6, true),

-- Programas Especiales
(3, 'Deportes', 'Balonmano, fútbol, básquet y otras disciplinas deportivas', '🏆', 1, true),
(3, 'Tecnología Educativa', 'Programación, robótica y competencias tecnológicas', '🤖', 2, true),
(3, 'Programa Bilingüe', 'Inmersión en inglés con metodología comunicativa', '🌍', 3, true),
(3, 'Arte y Cultura', 'Música, danza, teatro y artes plásticas', '🎨', 4, true),
(3, 'Libros Digitales', 'Libros digitales interactivos para el aprendizaje', '📱', 5, true),
(3, 'Club de Inglés', 'Club con trainers extranjeros para práctica del inglés', '👨‍🏫', 6, true),

-- Niveles Educativos
(4, 'Educación Inicial', 'Metodología STEAM y desarrollo integral del niño', '👶', 1, true),
(4, 'Educación Primaria', 'Base sólida en competencias fundamentales', '🎒', 2, true),
(4, 'Educación Secundaria', 'Preparación para la vida universitaria y profesional', '🎓', 3, true)
ON CONFLICT DO NOTHING;

-- Testimonios
INSERT INTO testimonios (nombre, cargo, testimonio, foto_url, orden, activo) VALUES
('María González', 'Madre de Familia de Inicial', 'La metodología STEAM ha sido increíble para mi hijo. Ahora es más creativo y curioso.', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 1, true),
('Carlos Mendoza', 'Padre de Familia de Primaria', 'El programa bilingüe ha superado nuestras expectativas. Mi hija ya conversa en inglés.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 2, true),
('Ana Rodríguez', 'Madre de Familia de Secundaria', 'Las instalaciones deportivas son excelentes. Mi hijo practica natación y está muy contento.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 3, true)
ON CONFLICT DO NOTHING;

-- Página home con sección saber más
INSERT INTO pages (slug, titulo, estado) VALUES
('home', 'Página Principal', 'publicado')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sections (page_id, key, titulo, layout, orden, contenido_json) VALUES
(1, 'saber-mas', 'Saber Más', 'grid', 1, '{"descripcion": "Conoce más sobre nuestra propuesta educativa"}')
ON CONFLICT DO NOTHING;

INSERT INTO blocks (section_id, tipo, orden, contenido_json) VALUES
(1, 'subsection', 1, '{"titulo": "Nuestra Identidad", "items": [{"titulo": "Excelencia Académica", "descripcion": "Metodologías innovadoras y docentes altamente capacitados", "icono": "🎓"}, {"titulo": "Formación Integral", "descripcion": "Desarrollo de habilidades cognitivas, sociales y emocionales", "icono": "🌟"}, {"titulo": "Valores Cristianos", "descripcion": "Formación en principios y valores que fortalecen el carácter", "icono": "⛪"}, {"titulo": "Innovación Tecnológica", "descripcion": "Integración de tecnología educativa de vanguardia", "icono": "💻"}]}'),
(1, 'subsection', 2, '{"titulo": "Nuestras Instalaciones", "items": [{"titulo": "Aulas Modernas", "descripcion": "Espacios amplios y equipados con tecnología educativa", "icono": "🏫"}, {"titulo": "Laboratorios", "descripcion": "Laboratorios de ciencias y computación completamente equipados", "icono": "🔬"}, {"titulo": "Biblioteca", "descripcion": "Biblioteca digital con acceso a recursos educativos online", "icono": "📚"}, {"titulo": "Áreas Deportivas", "descripcion": "Canchas deportivas y espacios para actividades físicas", "icono": "⚽"}, {"titulo": "Natación", "descripcion": "Piscinas temperadas para clases de natación", "icono": "🏊"}, {"titulo": "Canchas Sintéticas", "descripcion": "02 canchas sintéticas polideportivas", "icono": "🏟️"}]}'),
(1, 'subsection', 3, '{"titulo": "Programas Especiales", "items": [{"titulo": "Deportes", "descripcion": "Balonmano, fútbol, básquet y otras disciplinas deportivas", "icono": "🏆"}, {"titulo": "Tecnología Educativa", "descripcion": "Programación, robótica y competencias tecnológicas", "icono": "🤖"}, {"titulo": "Programa Bilingüe", "descripcion": "Inmersión en inglés con metodología comunicativa", "icono": "🌍"}, {"titulo": "Arte y Cultura", "descripcion": "Música, danza, teatro y artes plásticas", "icono": "🎨"}, {"titulo": "Libros Digitales", "descripcion": "Libros digitales interactivos para el aprendizaje", "icono": "📱"}, {"titulo": "Club de Inglés", "descripcion": "Club con trainers extranjeros para práctica del inglés", "icono": "👨‍🏫"}]}'),
(1, 'subsection', 4, '{"titulo": "Niveles Educativos", "items": [{"titulo": "Educación Inicial", "descripcion": "Metodología STEAM y desarrollo integral del niño", "icono": "👶"}, {"titulo": "Educación Primaria", "descripcion": "Base sólida en competencias fundamentales", "icono": "🎒"}, {"titulo": "Educación Secundaria", "descripcion": "Preparación para la vida universitaria y profesional", "icono": "🎓"}]}')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

-- Comentarios en las tablas principales
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema educativo multi-colegio';
COMMENT ON TABLE colegios IS 'Tabla de colegios para el sistema multi-tenant';
COMMENT ON TABLE anios_escolares IS 'Tabla de años escolares por colegio';
COMMENT ON TABLE niveles IS 'Tabla de niveles educativos del sistema peruano';
COMMENT ON TABLE cursos IS 'Tabla para gestión de cursos/áreas curriculares del sistema educativo';
COMMENT ON TABLE grados IS 'Tabla de grados por nivel educativo';
COMMENT ON TABLE turnos IS 'Tabla de turnos escolares';
COMMENT ON TABLE areas IS 'Tabla de áreas curriculares';
COMMENT ON TABLE configuracion IS 'Tabla de configuración del sistema';
COMMENT ON TABLE avatars IS 'Tabla de avatars disponibles para usuarios';

-- Comentarios en columnas importantes
COMMENT ON COLUMN usuarios.dni IS 'DNI único para login del usuario';
COMMENT ON COLUMN usuarios.clave IS 'Contraseña encriptada con bcrypt';
COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: Superadministrador, Administrador, Docente, Alumno, Apoderado, Tutor';
COMMENT ON COLUMN colegios.codigo IS 'Código único del colegio (RUC)';
COMMENT ON COLUMN colegios.color_primario IS 'Color primario del colegio en formato HEX';
COMMENT ON COLUMN colegios.color_secundario IS 'Color secundario del colegio en formato HEX';
COMMENT ON COLUMN anios_escolares.anio IS 'Año escolar (ej: 2025)';
COMMENT ON COLUMN anios_escolares.colegio_id IS 'Referencia al colegio al que pertenece el año escolar';

-- =====================================================
-- 10. VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas creadas exitosamente:' as mensaje;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN (
    'usuarios', 'colegios', 'anios_escolares', 'niveles', 'cursos', 'grados', 'turnos', 'areas',
    'configuracion', 'avatars', 'settings_web', 'menus', 'submenus', 'home_banner', 'home_principal',
    'home_secciones', 'home_items', 'testimonios', 'pages', 'sections', 'blocks', 'media'
);

-- Verificar datos de ejemplo
SELECT 'Datos de ejemplo insertados:' as mensaje;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_colegios FROM colegios;
SELECT COUNT(*) as total_anios_escolares FROM anios_escolares;
SELECT COUNT(*) as total_niveles FROM niveles;
SELECT COUNT(*) as total_cursos FROM cursos;
SELECT COUNT(*) as total_grados FROM grados;
SELECT COUNT(*) as total_turnos FROM turnos;
SELECT COUNT(*) as total_areas FROM areas;
SELECT COUNT(*) as total_configuracion FROM configuracion;
SELECT COUNT(*) as total_avatars FROM avatars;
SELECT COUNT(*) as total_menus FROM menus;
SELECT COUNT(*) as total_submenus FROM submenus;
SELECT COUNT(*) as total_testimonios FROM testimonios;
SELECT COUNT(*) as total_pages FROM pages;
SELECT COUNT(*) as total_sections FROM sections;
SELECT COUNT(*) as total_blocks FROM blocks;

-- Mostrar resumen final
SELECT 'MIGRACIÓN COMPLETA FINALIZADA EXITOSAMENTE' as resultado;
SELECT 'Sistema Educativo Multi-Colegio está listo para usar' as estado;
