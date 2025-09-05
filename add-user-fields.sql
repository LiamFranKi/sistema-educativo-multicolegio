-- Script para agregar campos faltantes a la tabla usuarios
-- Ejecutar este script en pgAdmin o psql

-- Verificar estructura actual
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

-- Agregar campos faltantes
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS apellidos VARCHAR(100);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS direccion TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS genero VARCHAR(20) CHECK (genero IN ('Masculino', 'Femenino', 'Otro'));
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(20) CHECK (estado_civil IN ('Soltero', 'Casado', 'Divorciado', 'Viudo', 'Conviviente'));
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS profesion VARCHAR(100);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_apellidos ON usuarios(apellidos);
CREATE INDEX IF NOT EXISTS idx_usuarios_genero ON usuarios(genero);
CREATE INDEX IF NOT EXISTS idx_usuarios_profesion ON usuarios(profesion);

-- Verificar estructura final
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
