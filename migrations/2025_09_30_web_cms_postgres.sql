-- Sistema Educativo Multi-Colegio
-- Migración (PostgreSQL): Estructura base para CMS del sitio web (HOME + Header/Footer)
-- Probado para PostgreSQL 12+

-- 1) SETTINGS WEB (colores, tipografía, contacto, redes, etc.)
CREATE TABLE IF NOT EXISTS settings_web (
  id             SERIAL PRIMARY KEY,
  clave          VARCHAR(100) UNIQUE NOT NULL,
  valor          TEXT NOT NULL,
  descripcion    VARCHAR(255),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2) MENÚS y SUBMENÚS
CREATE TABLE IF NOT EXISTS menus (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(120) NOT NULL,
  url            VARCHAR(255),
  orden          INT NOT NULL DEFAULT 1,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

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

-- 3) HOME: Banner
CREATE TABLE IF NOT EXISTS home_banner (
  id             SERIAL PRIMARY KEY,
  imagen_url     VARCHAR(500) NOT NULL,
  altura_px      INT NOT NULL DEFAULT 320,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4) HOME: Bloque principal (título/descr/cita)
CREATE TABLE IF NOT EXISTS home_principal (
  id             SERIAL PRIMARY KEY,
  titulo         VARCHAR(200) NOT NULL,
  descripcion_larga TEXT NOT NULL,
  cita           VARCHAR(255),
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5) HOME: Secciones (admisiones, testimonios, video, ubicacion, etc.)
CREATE TABLE IF NOT EXISTS home_secciones (
  id             SERIAL PRIMARY KEY,
  clave          VARCHAR(60) UNIQUE NOT NULL,
  titulo         VARCHAR(200) NOT NULL,
  contenido_json JSONB,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 6) HOME: Items genéricos (pasos, programas, instalaciones, etc.)
CREATE TABLE IF NOT EXISTS home_items (
  id             SERIAL PRIMARY KEY,
  seccion_id     INT NOT NULL REFERENCES home_secciones(id) ON DELETE CASCADE,
  titulo         VARCHAR(200) NOT NULL,
  descripcion    TEXT,
  icono_url      VARCHAR(500),
  orden          INT NOT NULL DEFAULT 1,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 7) HOME: Testimonios
CREATE TABLE IF NOT EXISTS testimonios (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(160) NOT NULL,
  rol            VARCHAR(160),
  texto          TEXT NOT NULL,
  foto_url       VARCHAR(500),
  orden          INT NOT NULL DEFAULT 1,
  activo         BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO menus (nombre, url, orden)
VALUES ('Inicio', NULL, 1)
ON CONFLICT DO NOTHING;

INSERT INTO menus (nombre, url, orden)
VALUES ('Niveles', NULL, 2)
ON CONFLICT DO NOTHING;

INSERT INTO menus (nombre, url, orden)
VALUES ('Tour Virtual', '/tour-virtual', 3)
ON CONFLICT DO NOTHING;

INSERT INTO menus (nombre, url, orden)
VALUES ('Preguntas Frecuentes', '/faq', 4)
ON CONFLICT DO NOTHING;

INSERT INTO menus (nombre, url, orden)
VALUES ('Contacto', '/contacto', 5)
ON CONFLICT DO NOTHING;

-- Submenús de Inicio
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM menus WHERE nombre='Inicio') THEN
    INSERT INTO submenus (menu_id, nombre, url, orden)
    SELECT id, 'Visita Guiada', '/visita-guiada', 1 FROM menus WHERE nombre='Inicio' ON CONFLICT DO NOTHING;
    INSERT INTO submenus (menu_id, nombre, url, orden)
    SELECT id, 'Lista de Útiles', '/lista-utiles', 2 FROM menus WHERE nombre='Inicio' ON CONFLICT DO NOTHING;
    INSERT INTO submenus (menu_id, nombre, url, orden)
    SELECT id, 'Documentos de Interés', '/documentos', 3 FROM menus WHERE nombre='Inicio' ON CONFLICT DO NOTHING;
    INSERT INTO submenus (menu_id, nombre, url, orden)
    SELECT id, 'Trabaja con Nosotros', '/trabaja-con-nosotros', 4 FROM menus WHERE nombre='Inicio' ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Submenús de Niveles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM menus WHERE nombre='Niveles') THEN
    INSERT INTO submenus (menu_id, nombre, url, orden)
    SELECT id, 'Nivel Inicial', '/niveles/inicial', 1 FROM menus WHERE nombre='Niveles' ON CONFLICT DO NOTHING;
    INSERT INTO submenus (menu_id, nombre, url, orden)
    SELECT id, 'Nivel Primaria', '/niveles/primaria', 2 FROM menus WHERE nombre='Niveles' ON CONFLICT DO NOTHING;
    INSERT INTO submenus (menu_id, nombre, url, orden)
    SELECT id, 'Nivel Secundaria', '/niveles/secundaria', 3 FROM menus WHERE nombre='Niveles' ON CONFLICT DO NOTHING;
  END IF;
END $$;

INSERT INTO home_banner (imagen_url, altura_px, activo)
VALUES ('/docs/diseños/banner-images/bannerhome.jpg', 320, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO home_principal (titulo, descripcion_larga, cita, activo)
VALUES (
  '¿Por qué estudiar en Vanguard Schools?',
  'En Vanguard Schools ofrecemos una educación moderna, segura e integral, desde inicial hasta secundaria. Contamos con infraestructura antisísmica, aulas amplias e interactivas, piscinas temperadas y libros digitales gratuitos.\nNuestro programa incluye inglés intensivo, talleres artísticos y deportivos, sin costo adicional acompañamiento psicopedagógico y una sólida formación en valores.\nFormamos líderes creativos y responsables, preparados para un futuro global.',
  'En Vanguard Schools, tu hijo no solo estudia: vive una experiencia que transforma su presente y asegura su futuro.',
  TRUE
)
ON CONFLICT DO NOTHING;
