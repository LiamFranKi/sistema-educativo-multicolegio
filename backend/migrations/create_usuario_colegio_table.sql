-- Crear tabla intermedia usuario_colegio
CREATE TABLE IF NOT EXISTS usuario_colegio (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    colegio_id INTEGER NOT NULL REFERENCES colegios(id) ON DELETE CASCADE,
    rol_en_colegio VARCHAR(50) NOT NULL CHECK (rol_en_colegio IN ('Administrador', 'Docente', 'Alumno', 'Apoderado', 'Tutor')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(usuario_id, colegio_id, rol_en_colegio)
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_usuario_colegio_usuario_id ON usuario_colegio(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_colegio_colegio_id ON usuario_colegio(colegio_id);
CREATE INDEX IF NOT EXISTS idx_usuario_colegio_activo ON usuario_colegio(activo);

-- Insertar datos de ejemplo (opcional)
-- INSERT INTO usuario_colegio (usuario_id, colegio_id, rol_en_colegio)
-- SELECT id, 1, rol FROM usuarios WHERE rol = 'Administrador' LIMIT 1;
