-- Actualizar año escolar a 2025 para todos los grados
UPDATE grados SET anio_escolar = 2025;

-- Verificar la actualización
SELECT
    id,
    nombre,
    seccion,
    anio_escolar,
    nivel_id
FROM grados
ORDER BY id;
