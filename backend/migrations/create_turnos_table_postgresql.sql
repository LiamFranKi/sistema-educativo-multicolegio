-- Crear tabla de turnos escolares
CREATE TABLE IF NOT EXISTS turnos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    abreviatura VARCHAR(10) NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_turnos_nombre ON turnos(nombre);
CREATE INDEX IF NOT EXISTS idx_turnos_abreviatura ON turnos(abreviatura);
CREATE INDEX IF NOT EXISTS idx_turnos_activo ON turnos(activo);

-- Crear restricciones de unicidad
ALTER TABLE turnos ADD CONSTRAINT turnos_nombre_unique UNIQUE (nombre);
ALTER TABLE turnos ADD CONSTRAINT turnos_abreviatura_unique UNIQUE (abreviatura);

-- Insertar turnos por defecto
INSERT INTO turnos (nombre, abreviatura, activo) VALUES
('Mañana', 'M', true),
('Tarde', 'T', true),
('Noche', 'N', true)
ON CONFLICT (nombre) DO NOTHING;

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_turnos_updated_at
    BEFORE UPDATE ON turnos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Agregar comentarios a la tabla
COMMENT ON TABLE turnos IS 'Tabla de turnos escolares del colegio';
COMMENT ON COLUMN turnos.id IS 'Identificador único del turno';
COMMENT ON COLUMN turnos.nombre IS 'Nombre completo del turno';
COMMENT ON COLUMN turnos.abreviatura IS 'Abreviatura del turno';
COMMENT ON COLUMN turnos.activo IS 'Indica si el turno está activo';
COMMENT ON COLUMN turnos.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN turnos.updated_at IS 'Fecha de última actualización del registro';
