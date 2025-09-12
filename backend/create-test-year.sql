-- Crear año escolar de prueba
INSERT INTO anios_escolares (anio, activo, created_at, updated_at)
VALUES (2025, true, NOW(), NOW())
ON CONFLICT (anio) DO UPDATE SET
  activo = true,
  updated_at = NOW();

-- Verificar que se insertó correctamente
SELECT * FROM anios_escolares ORDER BY anio DESC;
