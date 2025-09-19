-- Crear tabla de avatars del sistema gamificado
-- Fecha: 2025-01-16
-- Descripción: Tabla para gestionar los avatars que los alumnos pueden canjear con puntos

CREATE TABLE IF NOT EXISTS avatars (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    nivel INTEGER NOT NULL CHECK (nivel >= 1 AND nivel <= 20),
    puntos INTEGER NOT NULL DEFAULT 0 CHECK (puntos >= 0),
    imagen VARCHAR(255) DEFAULT 'default-avatar.png',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_avatars_nivel ON avatars(nivel);
CREATE INDEX idx_avatars_puntos ON avatars(puntos);
CREATE INDEX idx_avatars_activo ON avatars(activo);
CREATE INDEX idx_avatars_nivel_puntos ON avatars(nivel, puntos);

-- Crear restricción UNIQUE para evitar nombres duplicados
ALTER TABLE avatars
ADD CONSTRAINT uk_avatars_nombre UNIQUE (nombre);

-- Crear restricción UNIQUE para evitar niveles duplicados
ALTER TABLE avatars
ADD CONSTRAINT uk_avatars_nivel UNIQUE (nivel);

-- Comentarios en la tabla
COMMENT ON TABLE avatars IS 'Tabla de avatars del sistema gamificado para alumnos';
COMMENT ON COLUMN avatars.id IS 'Identificador único del avatar';
COMMENT ON COLUMN avatars.nombre IS 'Nombre del avatar';
COMMENT ON COLUMN avatars.descripcion IS 'Descripción del avatar';
COMMENT ON COLUMN avatars.nivel IS 'Nivel del avatar (1-20)';
COMMENT ON COLUMN avatars.puntos IS 'Puntos requeridos para canjear el avatar';
COMMENT ON COLUMN avatars.imagen IS 'Nombre del archivo de imagen del avatar';
COMMENT ON COLUMN avatars.activo IS 'Estado del avatar (activo/inactivo)';
COMMENT ON COLUMN avatars.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN avatars.updated_at IS 'Fecha de última actualización';

-- Insertar avatars iniciales del sistema
INSERT INTO avatars (nombre, descripcion, nivel, puntos, imagen, activo) VALUES
('Novato', 'Tu primer avatar en el sistema', 1, 0, 'avatar-novato.png', true),
('Explorador', 'Has comenzado tu aventura', 2, 50, 'avatar-explorador.png', true),
('Aventurero', 'Cada día aprendes algo nuevo', 3, 100, 'avatar-aventurero.png', true),
('Estudiante', 'La constancia es tu fortaleza', 4, 200, 'avatar-estudiante.png', true),
('Aplicado', 'Tu dedicación es admirable', 5, 350, 'avatar-aplicado.png', true),
('Esforzado', 'Nunca te rindes', 6, 500, 'avatar-esforzado.png', true),
('Perseverante', 'La paciencia es tu virtud', 7, 700, 'avatar-perseverante.png', true),
('Dedicado', 'Tu compromiso es ejemplar', 8, 900, 'avatar-dedicado.png', true),
('Responsable', 'Cumples con tus deberes', 9, 1200, 'avatar-responsable.png', true),
('Colaborador', 'Ayudas a tus compañeros', 10, 1500, 'avatar-colaborador.png', true),
('Líder', 'Inspiras a otros', 11, 1800, 'avatar-lider.png', true),
('Mentor', 'Compartes tu conocimiento', 12, 2200, 'avatar-mentor.png', true),
('Sabio', 'Tu sabiduría es reconocida', 13, 2600, 'avatar-sabio.png', true),
('Maestro', 'Dominas las materias', 14, 3000, 'avatar-maestro.png', true),
('Experto', 'Eres un referente', 15, 3500, 'avatar-experto.png', true),
('Genio', 'Tu inteligencia es excepcional', 16, 4000, 'avatar-genio.png', true),
('Prodigio', 'Tus habilidades son únicas', 17, 4500, 'avatar-prodigio.png', true),
('Campeón', 'Eres el mejor de tu clase', 18, 5000, 'avatar-campeon.png', true),
('Leyenda', 'Tu nombre será recordado', 19, 6000, 'avatar-leyenda.png', true),
('Ídolo', 'Eres un ejemplo para todos', 20, 7500, 'avatar-idolo.png', true);

-- Verificar la estructura creada
SELECT
    id,
    nombre,
    nivel,
    puntos,
    activo,
    created_at
FROM avatars
ORDER BY nivel;

-- Mostrar estadísticas de avatars
SELECT
    COUNT(*) as total_avatars,
    MIN(nivel) as nivel_minimo,
    MAX(nivel) as nivel_maximo,
    MIN(puntos) as puntos_minimos,
    MAX(puntos) as puntos_maximos,
    COUNT(CASE WHEN activo = true THEN 1 END) as avatars_activos
FROM avatars;
