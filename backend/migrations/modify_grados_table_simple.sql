-- Modificación de la tabla grados para nueva estructura (SIMPLIFICADO)
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
    anio_escolar = 2025 -- Año actual por defecto
WHERE seccion IS NULL;

-- NOTA: Las secciones se manejan como array fijo en el código
-- Array: ['Unica', 'A', 'B', 'C', 'D', 'E', 'F']
-- No se necesita tabla de secciones en la BD
