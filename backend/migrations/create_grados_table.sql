-- Crear tabla de grados educativos
CREATE TABLE IF NOT EXISTS grados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    codigo VARCHAR(10) NOT NULL,
    nivel_id INTEGER NOT NULL,
    orden INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nivel_id) REFERENCES niveles(id) ON DELETE CASCADE
);

-- Insertar grados educativos del sistema peruano
INSERT INTO grados (nombre, descripcion, codigo, nivel_id, orden, activo) VALUES
-- Nivel Inicial (nivel_id = 1)
('03 años', 'Educación Inicial - 3 años', 'INI-03', 1, 1, true),
('04 años', 'Educación Inicial - 4 años', 'INI-04', 1, 2, true),
('05 años', 'Educación Inicial - 5 años', 'INI-05', 1, 3, true),

-- Nivel Primaria (nivel_id = 2)
('1° Grado', 'Primer Grado de Primaria', 'PRI-01', 2, 1, true),
('2° Grado', 'Segundo Grado de Primaria', 'PRI-02', 2, 2, true),
('3° Grado', 'Tercer Grado de Primaria', 'PRI-03', 2, 3, true),
('4° Grado', 'Cuarto Grado de Primaria', 'PRI-04', 2, 4, true),
('5° Grado', 'Quinto Grado de Primaria', 'PRI-05', 2, 5, true),
('6° Grado', 'Sexto Grado de Primaria', 'PRI-06', 2, 6, true),

-- Nivel Secundaria (nivel_id = 3)
('1° Año', 'Primer Año de Secundaria', 'SEC-01', 3, 1, true),
('2° Año', 'Segundo Año de Secundaria', 'SEC-02', 3, 2, true),
('3° Año', 'Tercer Año de Secundaria', 'SEC-03', 3, 3, true),
('4° Año', 'Cuarto Año de Secundaria', 'SEC-04', 3, 4, true),
('5° Año', 'Quinto Año de Secundaria', 'SEC-05', 3, 5, true);

-- Crear índices para optimizar consultas
CREATE INDEX idx_grados_nivel_id ON grados(nivel_id);
CREATE INDEX idx_grados_activo ON grados(activo);
CREATE INDEX idx_grados_orden ON grados(orden);
CREATE INDEX idx_grados_codigo ON grados(codigo);
CREATE INDEX idx_grados_nivel_orden ON grados(nivel_id, orden);

-- Comentarios en la tabla
COMMENT ON TABLE grados IS 'Tabla de grados educativos del sistema peruano';
COMMENT ON COLUMN grados.id IS 'Identificador único del grado';
COMMENT ON COLUMN grados.nombre IS 'Nombre del grado educativo';
COMMENT ON COLUMN grados.descripcion IS 'Descripción del grado educativo';
COMMENT ON COLUMN grados.codigo IS 'Código único del grado (INI-03, PRI-01, SEC-01, etc.)';
COMMENT ON COLUMN grados.nivel_id IS 'ID del nivel educativo al que pertenece';
COMMENT ON COLUMN grados.orden IS 'Orden de visualización del grado dentro del nivel';
COMMENT ON COLUMN grados.activo IS 'Estado del grado (activo/inactivo)';
COMMENT ON COLUMN grados.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN grados.updated_at IS 'Fecha de última actualización';
