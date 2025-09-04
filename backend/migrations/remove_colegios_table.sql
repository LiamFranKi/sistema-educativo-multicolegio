-- Migración: Eliminación de tabla colegios y actualización de anios_escolares
-- Fecha: 2025-09-04
-- Descripción: Eliminación de la tabla colegios ya que el sistema migró a un solo colegio
--              y actualización de anios_escolares para eliminar dependencias

-- Paso 1: Eliminar foreign key constraint de anios_escolares
ALTER TABLE anios_escolares
DROP CONSTRAINT IF EXISTS anios_escolares_colegio_id_fkey;

-- Paso 2: Eliminar columna colegio_id de anios_escolares
ALTER TABLE anios_escolares
DROP COLUMN IF EXISTS colegio_id;

-- Paso 3: Eliminar tabla colegios (ya no es necesaria)
DROP TABLE IF EXISTS colegios CASCADE;

-- Verificación: La tabla anios_escolares ahora tiene esta estructura:
-- - id: integer (PRIMARY KEY)
-- - anio: integer (NOT NULL)
-- - activo: boolean
-- - created_at: timestamp
-- - updated_at: timestamp

-- Nota: Los datos del colegio ahora se manejan a través de la tabla configuracion
-- con categoria = 'colegio' en lugar de una tabla separada.
