-- PostgreSQL
-- Migración aditiva: Esquema genérico CMS (pages/sections/blocks/media)
-- No elimina ni modifica tablas existentes; sólo agrega nuevas para unificar futuras páginas.

-- 1) PAGES
CREATE TABLE IF NOT EXISTS pages (
  id             SERIAL PRIMARY KEY,
  slug           VARCHAR(120) UNIQUE NOT NULL,   -- ej: 'home', 'nosotros'
  titulo         VARCHAR(200) NOT NULL,
  estado         VARCHAR(20) NOT NULL DEFAULT 'publicado', -- borrador|publicado|oculto
  orden          INT NOT NULL DEFAULT 1,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2) SECTIONS
CREATE TABLE IF NOT EXISTS sections (
  id             SERIAL PRIMARY KEY,
  page_id        INT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  key            VARCHAR(80) NOT NULL,           -- hero|features|faq|video|ubicacion|custom
  titulo         VARCHAR(200),
  layout         VARCHAR(80) NOT NULL DEFAULT 'default',
  orden          INT NOT NULL DEFAULT 1,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sections_page ON sections(page_id);

-- 3) BLOCKS
CREATE TABLE IF NOT EXISTS blocks (
  id             SERIAL PRIMARY KEY,
  section_id     INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  tipo           VARCHAR(40) NOT NULL,           -- text|image|card|list|html|embed
  contenido_json JSONB NOT NULL,                 -- flexible: {titulo,descripcion,icono_url,...}
  orden          INT NOT NULL DEFAULT 1,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blocks_section ON blocks(section_id);

-- 4) MEDIA (opcional para subir/cdn)
CREATE TABLE IF NOT EXISTS media (
  id             SERIAL PRIMARY KEY,
  url            VARCHAR(500) NOT NULL,
  mime           VARCHAR(100),
  ancho          INT,
  alto           INT,
  meta_json      JSONB,
  creado_en      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed mínimo: página HOME si no existe
INSERT INTO pages (slug, titulo, estado, orden)
VALUES ('home', 'Inicio', 'publicado', 1)
ON CONFLICT (slug) DO NOTHING;
