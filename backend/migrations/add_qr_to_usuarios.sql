-- Agregar campo QR a la tabla usuarios
-- Fecha: 2025-01-12
-- Descripción: Agregar campo QR para códigos QR de usuarios (futuro escaneo de asistencia)

-- Paso 1: Agregar columna QR
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS qr_code VARCHAR(255);

-- Paso 2: Crear índice para optimizar consultas por QR
CREATE INDEX IF NOT EXISTS idx_usuarios_qr_code ON usuarios(qr_code);

-- Paso 3: Agregar comentario a la columna
COMMENT ON COLUMN usuarios.qr_code IS 'Código QR único del usuario para escaneo de asistencia';

-- Paso 4: Agregar restricción UNIQUE para evitar códigos QR duplicados
ALTER TABLE usuarios
ADD CONSTRAINT uk_usuarios_qr_code UNIQUE (qr_code);

-- Paso 5: Generar códigos QR para usuarios existentes (formato: USR-{ID}-{DNI})
UPDATE usuarios
SET qr_code = 'USR-' || id || '-' || dni
WHERE qr_code IS NULL;

-- Paso 6: Verificar la estructura actualizada
SELECT
    u.id,
    u.nombres,
    u.apellidos,
    u.dni,
    u.qr_code,
    u.rol
FROM usuarios u
ORDER BY u.id
LIMIT 10;

-- Mostrar estadísticas de códigos QR generados
SELECT
    COUNT(*) as total_usuarios,
    COUNT(qr_code) as usuarios_con_qr,
    COUNT(*) - COUNT(qr_code) as usuarios_sin_qr
FROM usuarios;
