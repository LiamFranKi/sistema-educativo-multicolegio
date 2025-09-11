-- Crear tabla areas para PostgreSQL
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar las áreas educativas predefinidas
INSERT INTO areas (nombre, descripcion, codigo, estado) VALUES
('Comunicación', 'Desarrollo de habilidades comunicativas, lectura, escritura y expresión oral', 'COM', 'activo'),
('Ciencia y Tecnología', 'Exploración científica, experimentación y desarrollo tecnológico', 'CYT', 'activo'),
('Arte y Cultura', 'Expresión artística, apreciación cultural y creatividad', 'ART', 'activo'),
('Computación', 'Tecnologías de la información, programación y competencias digitales', 'COM', 'activo'),
('Ciencias Sociales', 'Historia, geografía, economía y sociedad', 'CSS', 'activo'),
('Formación en Valores', 'Desarrollo ético, moral y formación ciudadana', 'FVA', 'activo'),
('Educación Física', 'Desarrollo físico, deportes y bienestar corporal', 'EFI', 'activo'),
('Matemática', 'Razonamiento lógico, cálculo y resolución de problemas', 'MAT', 'activo'),
('Personal Social', 'Desarrollo personal, identidad y relaciones sociales', 'PES', 'activo'),
('Psicomotricidad', 'Desarrollo motor, coordinación y habilidades psicomotrices', 'PSI', 'activo'),
('Inglés', 'Lengua extranjera, comunicación internacional', 'ING', 'activo'),
('Desarrollo Personal, Ciudadanía y Cívica', 'Formación ciudadana, participación y responsabilidad social', 'DPC', 'activo');

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_areas_estado ON areas(estado);
CREATE INDEX IF NOT EXISTS idx_areas_codigo ON areas(codigo);
CREATE INDEX IF NOT EXISTS idx_areas_nombre ON areas(nombre);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_areas_updated_at
    BEFORE UPDATE ON areas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
