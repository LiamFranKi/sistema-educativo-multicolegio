-- Corregir relación entre grados y anios_escolares
-- Cambiar anio_escolar de INTEGER a foreign key

-- Paso 1: Agregar columna temporal para el ID del año escolar
ALTER TABLE grados ADD COLUMN IF NOT EXISTS anio_escolar_id INTEGER;

-- Paso 2: Actualizar la columna temporal con los IDs correctos de anios_escolares
UPDATE grados
SET anio_escolar_id = ae.id
FROM anios_escolares ae
WHERE grados.anio_escolar = ae.anio;

-- Paso 3: Eliminar la columna antigua
ALTER TABLE grados DROP COLUMN IF EXISTS anio_escolar;

-- Paso 4: Renombrar la nueva columna
ALTER TABLE grados RENAME COLUMN anio_escolar_id TO anio_escolar_id;

-- Paso 5: Crear la foreign key constraint
ALTER TABLE grados
ADD CONSTRAINT fk_grados_anio_escolar
FOREIGN KEY (anio_escolar_id)
REFERENCES anios_escolares(id);

-- Paso 6: Crear índice para la nueva foreign key
CREATE INDEX IF NOT EXISTS idx_grados_anio_escolar_id ON grados(anio_escolar_id);

-- Paso 7: Actualizar comentario
COMMENT ON COLUMN grados.anio_escolar_id IS 'ID del año escolar (foreign key a anios_escolares)';

-- Verificar la corrección
SELECT
    g.id,
    g.nombre,
    g.anio_escolar_id,
    ae.anio,
    ae.activo
FROM grados g
LEFT JOIN anios_escolares ae ON g.anio_escolar_id = ae.id
LIMIT 5;
