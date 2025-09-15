-- Agregar campo turno a la tabla grados
-- Fecha: 2025-01-12
-- Descripción: Agregar campo turno (VARCHAR) para asociar grados con turnos escolares

-- Paso 1: Agregar columna turno
ALTER TABLE grados ADD COLUMN IF NOT EXISTS turno VARCHAR(50);

-- Paso 2: Crear índice para optimizar consultas por turno
CREATE INDEX IF NOT EXISTS idx_grados_turno ON grados(turno);

-- Paso 3: Agregar comentario a la columna
COMMENT ON COLUMN grados.turno IS 'Turno escolar del grado (Mañana, Tarde, Noche)';

-- Paso 4: Actualizar grados existentes con turno por defecto 'Mañana'
UPDATE grados
SET turno = 'Mañana'
WHERE turno IS NULL OR turno = '';

-- Paso 5: Agregar restricción CHECK para validar valores válidos
ALTER TABLE grados
ADD CONSTRAINT chk_grados_turno
CHECK (turno IN ('Mañana', 'Tarde', 'Noche'));

-- Paso 6: Verificar la estructura actualizada
SELECT
    g.id,
    g.nombre,
    g.seccion,
    g.anio_escolar,
    g.turno,
    n.nombre as nivel_nombre
FROM grados g
LEFT JOIN niveles n ON g.nivel_id = n.id
ORDER BY g.id
LIMIT 10;

-- Mostrar estadísticas por turno
SELECT
    turno,
    COUNT(*) as cantidad_grados
FROM grados
GROUP BY turno
ORDER BY turno;
