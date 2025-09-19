-- Agregar campo genero a la tabla avatars
-- Fecha: 2025-01-16
-- Descripción: Agregar campo genero para especificar si el avatar es masculino o femenino

-- Paso 1: Agregar columna genero
ALTER TABLE avatars ADD COLUMN IF NOT EXISTS genero VARCHAR(10) NOT NULL DEFAULT 'Masculino';

-- Paso 2: Crear índice para optimizar consultas por genero
CREATE INDEX IF NOT EXISTS idx_avatars_genero ON avatars(genero);

-- Paso 3: Agregar comentario a la columna
COMMENT ON COLUMN avatars.genero IS 'Género del avatar (Masculino, Femenino)';

-- Paso 4: Agregar restricción CHECK para validar valores válidos
ALTER TABLE avatars
ADD CONSTRAINT chk_avatars_genero
CHECK (genero IN ('Masculino', 'Femenino'));

-- Paso 5: Actualizar avatars existentes con género por defecto 'Masculino'
UPDATE avatars
SET genero = 'Masculino'
WHERE genero IS NULL OR genero = '';

-- Paso 6: Verificar la estructura actualizada
SELECT
    id,
    nombre,
    nivel,
    puntos,
    genero,
    activo
FROM avatars
ORDER BY nivel, genero
LIMIT 10;

-- Mostrar estadísticas por género
SELECT
    genero,
    COUNT(*) as cantidad_avatars,
    MIN(nivel) as nivel_minimo,
    MAX(nivel) as nivel_maximo
FROM avatars
GROUP BY genero
ORDER BY genero;
