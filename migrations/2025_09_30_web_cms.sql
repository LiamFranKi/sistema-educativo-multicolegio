-- Sistema Educativo Multi-Colegio
-- Migración: Estructura base para CMS del sitio web (HOME + Header/Footer)
-- Fecha: 2025-09-30

-- Ajustes generales
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1) SETTINGS WEB (colores, tipografía, contacto, redes, etc.)
CREATE TABLE IF NOT EXISTS settings_web (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  clave         VARCHAR(100) NOT NULL UNIQUE,
  valor         TEXT NOT NULL,
  descripcion   VARCHAR(255) NULL,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2) MENÚS y SUBMENÚS
CREATE TABLE IF NOT EXISTS menus (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(120) NOT NULL,
  url       VARCHAR(255) NULL,
  orden     INT NOT NULL DEFAULT 1,
  activo    TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submenus (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  menu_id   INT NOT NULL,
  nombre    VARCHAR(160) NOT NULL,
  url       VARCHAR(255) NULL,
  orden     INT NOT NULL DEFAULT 1,
  activo    TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_submenus_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3) HOME: Banner
CREATE TABLE IF NOT EXISTS home_banner (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  imagen_url VARCHAR(500) NOT NULL,
  altura_px  INT NOT NULL DEFAULT 320,
  activo     TINYINT(1) NOT NULL DEFAULT 1,
  creado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4) HOME: Bloque principal (título/descr/cita)
CREATE TABLE IF NOT EXISTS home_principal (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  titulo        VARCHAR(200) NOT NULL,
  descripcion_larga MEDIUMTEXT NOT NULL,
  cita          VARCHAR(255) NULL,
  activo        TINYINT(1) NOT NULL DEFAULT 1,
  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5) HOME: Secciones (admisiones, testimonios, video, ubicacion, etc.)
CREATE TABLE IF NOT EXISTS home_secciones (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  clave     VARCHAR(60) NOT NULL UNIQUE,
  titulo    VARCHAR(200) NOT NULL,
  contenido_json JSON NULL,
  activo    TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6) HOME: Items genéricos (pasos, programas, instalaciones, etc.)
CREATE TABLE IF NOT EXISTS home_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  seccion_id  INT NOT NULL,
  titulo      VARCHAR(200) NOT NULL,
  descripcion TEXT NULL,
  icono_url   VARCHAR(500) NULL,
  orden       INT NOT NULL DEFAULT 1,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_home_items_seccion FOREIGN KEY (seccion_id) REFERENCES home_secciones(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7) HOME: Testimonios
CREATE TABLE IF NOT EXISTS testimonios (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(160) NOT NULL,
  rol       VARCHAR(160) NULL,
  texto     TEXT NOT NULL,
  foto_url  VARCHAR(500) NULL,
  orden     INT NOT NULL DEFAULT 1,
  activo    TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales sugeridos
INSERT INTO menus (nombre, url, orden) VALUES
('Inicio', NULL, 1),
('Niveles', NULL, 2),
('Tour Virtual', '/tour-virtual', 3),
('Preguntas Frecuentes', '/faq', 4),
('Contacto', '/contacto', 5);

INSERT INTO submenus (menu_id, nombre, url, orden) VALUES
((SELECT id FROM menus WHERE nombre='Inicio'), 'Visita Guiada', '/visita-guiada', 1),
((SELECT id FROM menus WHERE nombre='Inicio'), 'Lista de Útiles', '/lista-utiles', 2),
((SELECT id FROM menus WHERE nombre='Inicio'), 'Documentos de Interés', '/documentos', 3),
((SELECT id FROM menus WHERE nombre='Inicio'), 'Trabaja con Nosotros', '/trabaja-con-nosotros', 4),
((SELECT id FROM menus WHERE nombre='Niveles'), 'Nivel Inicial', '/niveles/inicial', 1),
((SELECT id FROM menus WHERE nombre='Niveles'), 'Nivel Primaria', '/niveles/primaria', 2),
((SELECT id FROM menus WHERE nombre='Niveles'), 'Nivel Secundaria', '/niveles/secundaria', 3);

INSERT INTO home_banner (imagen_url, altura_px, activo) VALUES ('/docs/diseños/banner-images/bannerhome.jpg', 320, 1);

INSERT INTO home_principal (titulo, descripcion_larga, cita, activo) VALUES (
  '¿Por qué estudiar en Vanguard Schools?',
  'En Vanguard Schools ofrecemos una educación moderna, segura e integral, desde inicial hasta secundaria. Contamos con infraestructura antisísmica, aulas amplias e interactivas, piscinas temperadas y libros digitales gratuitos.\nNuestro programa incluye inglés intensivo, talleres artísticos y deportivos, sin costo adicional acompañamiento psicopedagógico y una sólida formación en valores.\nFormamos líderes creativos y responsables, preparados para un futuro global.',
  'En Vanguard Schools, tu hijo no solo estudia: vive una experiencia que transforma su presente y asegura su futuro.',
  1
);

SET FOREIGN_KEY_CHECKS = 1;
