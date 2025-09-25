-- Migración: Crear tabla cursos
-- Fecha: 2025-01-16
-- Descripción: Tabla para gestión de cursos/áreas curriculares

-- Crear tabla cursos
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

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_cursos_nivel_id ON cursos(nivel_id);
CREATE INDEX IF NOT EXISTS idx_cursos_activo ON cursos(activo);
CREATE INDEX IF NOT EXISTS idx_cursos_nombre ON cursos(nombre);
CREATE INDEX IF NOT EXISTS idx_cursos_abreviatura ON cursos(abreviatura);

-- Comentarios para documentar la tabla
COMMENT ON TABLE cursos IS 'Tabla para gestión de cursos/áreas curriculares del sistema educativo';
COMMENT ON COLUMN cursos.id IS 'ID único del curso';
COMMENT ON COLUMN cursos.nombre IS 'Nombre completo del curso (ej: Matemática, Comunicación)';
COMMENT ON COLUMN cursos.descripcion IS 'Descripción detallada del curso';
COMMENT ON COLUMN cursos.abreviatura IS 'Abreviatura única del curso (ej: MAT, COM)';
COMMENT ON COLUMN cursos.nivel_id IS 'ID del nivel educativo (Inicial, Primaria, Secundaria)';
COMMENT ON COLUMN cursos.imagen IS 'Nombre del archivo de imagen del curso';
COMMENT ON COLUMN cursos.activo IS 'Estado activo/inactivo del curso';
COMMENT ON COLUMN cursos.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN cursos.updated_at IS 'Fecha de última actualización del registro';

-- Insertar cursos predefinidos por nivel (solo si no existen)
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

-- Verificar inserción
SELECT
    c.id,
    c.nombre,
    c.abreviatura,
    n.nombre as nivel,
    c.activo
FROM cursos c
JOIN niveles n ON c.nivel_id = n.id
ORDER BY n.orden, c.nombre;
