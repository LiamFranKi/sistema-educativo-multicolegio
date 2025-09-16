-- Actualizar restricción CHECK de la columna rol en la tabla usuarios
-- Fecha: 2025-09-16
-- Motivo: Agregar nuevos roles: Psicologia, Secretaria, Director, Promotor

BEGIN;

-- 1) Eliminar la restricción actual (si existe)
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_check;

-- 2) Crear la nueva restricción con la lista completa de roles permitidos
ALTER TABLE usuarios
ADD CONSTRAINT usuarios_rol_check CHECK (
  rol IN (
    'Administrador',
    'Docente',
    'Alumno',
    'Apoderado',
    'Tutor',
    'Psicologia',
    'Secretaria',
    'Director',
    'Promotor'
  )
);

-- 3) Verificación rápida (opcional): listar conteos por rol
-- SELECT rol, COUNT(*) FROM usuarios GROUP BY rol ORDER BY rol;

COMMIT;
