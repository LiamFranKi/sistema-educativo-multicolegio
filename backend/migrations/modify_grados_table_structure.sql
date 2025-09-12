-- Modificación de la tabla grados para nueva estructura
-- Agregar nuevos campos requeridos

-- Agregar campo seccion
ALTER TABLE grados ADD COLUMN IF NOT EXISTS seccion VARCHAR(10);

-- Agregar campo direccion_archivos
ALTER TABLE grados ADD COLUMN IF NOT EXISTS direccion_archivos TEXT;

-- Agregar campo link_aula_virtual
ALTER TABLE grados ADD COLUMN IF NOT EXISTS link_aula_virtual TEXT;

-- Agregar campo nivel_id para relacionar con la tabla niveles
ALTER TABLE grados ADD COLUMN IF NOT EXISTS nivel_id INTEGER;

-- Agregar campo anio_escolar para relacionar con años escolares
ALTER TABLE grados ADD COLUMN IF NOT EXISTS anio_escolar INTEGER;

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_grados_nivel_id ON grados(nivel_id);
CREATE INDEX IF NOT EXISTS idx_grados_anio_escolar ON grados(anio_escolar);
CREATE INDEX IF NOT EXISTS idx_grados_seccion ON grados(seccion);

-- Agregar comentarios a los nuevos campos
COMMENT ON COLUMN grados.seccion IS 'Sección del grado (Unica, A, B, C, D, E, F)';
COMMENT ON COLUMN grados.direccion_archivos IS 'Dirección de archivos del grado';
COMMENT ON COLUMN grados.link_aula_virtual IS 'Enlace al aula virtual del grado';
COMMENT ON COLUMN grados.nivel_id IS 'ID del nivel educativo al que pertenece el grado';
COMMENT ON COLUMN grados.anio_escolar IS 'Año escolar del grado';

-- Actualizar registros existentes con valores por defecto
UPDATE grados SET
    seccion = 'Unica',
    direccion_archivos = '',
    link_aula_virtual = '',
    nivel_id = 1, -- Asignar nivel inicial por defecto
    anio_escolar = 2024 -- Año actual por defecto
WHERE seccion IS NULL;

-- Crear tabla de secciones disponibles (para referencia del sistema)
CREATE TABLE IF NOT EXISTS secciones_disponibles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(10) NOT NULL UNIQUE,
    orden INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar secciones disponibles
INSERT INTO secciones_disponibles (nombre, orden, activo) VALUES
('Unica', 1, true),
('A', 2, true),
('B', 3, true),
('C', 4, true),
('D', 5, true),
('E', 6, true),
('F', 7, true)
ON CONFLICT (nombre) DO NOTHING;

-- Agregar comentarios a la tabla de secciones
COMMENT ON TABLE secciones_disponibles IS 'Tabla de referencia para secciones disponibles en grados';
COMMENT ON COLUMN secciones_disponibles.nombre IS 'Nombre de la sección';
COMMENT ON COLUMN secciones_disponibles.orden IS 'Orden de visualización de la sección';
COMMENT ON COLUMN secciones_disponibles.activo IS 'Indica si la sección está activa';
