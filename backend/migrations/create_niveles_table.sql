-- Crear tabla de niveles educativos
CREATE TABLE IF NOT EXISTS niveles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    codigo VARCHAR(10) NOT NULL UNIQUE,
    orden INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar niveles educativos del sistema peruano
INSERT INTO niveles (nombre, descripcion, codigo, orden, activo) VALUES
('Inicial', 'Educación Preescolar', 'INI', 1, true),
('Primaria', 'Educación Básica Regular', 'PRI', 2, true),
('Secundaria', 'Educación Secundaria', 'SEC', 3, true);

-- Crear índices para optimizar consultas
CREATE INDEX idx_niveles_activo ON niveles(activo);
CREATE INDEX idx_niveles_orden ON niveles(orden);
CREATE INDEX idx_niveles_codigo ON niveles(codigo);

-- Comentarios en la tabla
COMMENT ON TABLE niveles IS 'Tabla de niveles educativos del sistema peruano';
COMMENT ON COLUMN niveles.id IS 'Identificador único del nivel';
COMMENT ON COLUMN niveles.nombre IS 'Nombre del nivel educativo';
COMMENT ON COLUMN niveles.descripcion IS 'Descripción del nivel educativo';
COMMENT ON COLUMN niveles.codigo IS 'Código único del nivel (INI, PRI, SEC)';
COMMENT ON COLUMN niveles.orden IS 'Orden de visualización del nivel';
COMMENT ON COLUMN niveles.activo IS 'Estado del nivel (activo/inactivo)';
COMMENT ON COLUMN niveles.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN niveles.updated_at IS 'Fecha de última actualización';
