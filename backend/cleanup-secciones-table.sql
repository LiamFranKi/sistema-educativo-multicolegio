-- Script para eliminar la tabla secciones_disponibles
-- (ya que usamos array fijo en el código)

-- Eliminar tabla secciones_disponibles si existe
DROP TABLE IF EXISTS secciones_disponibles;

-- Verificar que se eliminó correctamente
SELECT 'Tabla secciones_disponibles eliminada exitosamente' as resultado;
