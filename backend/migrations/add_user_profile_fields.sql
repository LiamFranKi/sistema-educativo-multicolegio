-- Agregar campos adicionales a la tabla usuarios para el perfil
-- Estos campos son opcionales y no afectan el módulo de usuarios existente

-- Agregar campo apellidos
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS apellidos VARCHAR(100);

-- Agregar campo dirección
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS direccion TEXT;

-- Agregar campo género
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS genero VARCHAR(20) CHECK (genero IN ('Masculino', 'Femenino', 'Otro'));

-- Agregar campo estado civil
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(20) CHECK (estado_civil IN ('Soltero', 'Casado', 'Divorciado', 'Viudo', 'Conviviente'));

-- Agregar campo profesión
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS profesion VARCHAR(100);

-- Crear índices para mejor rendimiento en búsquedas
CREATE INDEX IF NOT EXISTS idx_usuarios_apellidos ON usuarios(apellidos);
CREATE INDEX IF NOT EXISTS idx_usuarios_genero ON usuarios(genero);
CREATE INDEX IF NOT EXISTS idx_usuarios_profesion ON usuarios(profesion);

-- Comentarios para documentar los nuevos campos
COMMENT ON COLUMN usuarios.apellidos IS 'Apellidos del usuario (opcional)';
COMMENT ON COLUMN usuarios.direccion IS 'Dirección completa del usuario (opcional)';
COMMENT ON COLUMN usuarios.genero IS 'Género del usuario: Masculino, Femenino, Otro (opcional)';
COMMENT ON COLUMN usuarios.estado_civil IS 'Estado civil del usuario: Soltero, Casado, Divorciado, Viudo, Conviviente (opcional)';
COMMENT ON COLUMN usuarios.profesion IS 'Profesión u ocupación del usuario (opcional)';
