-- Agregar campo foto a la tabla grados
ALTER TABLE grados ADD COLUMN foto VARCHAR(255) DEFAULT 'default-grado.png';

-- Actualizar grados existentes con imagen por defecto
UPDATE grados SET foto = 'default-grado.png' WHERE foto IS NULL;

-- Crear índice para optimizar búsquedas por foto
CREATE INDEX IF NOT EXISTS idx_grados_foto ON grados(foto);
