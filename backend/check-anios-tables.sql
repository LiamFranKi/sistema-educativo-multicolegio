-- Verificar qué tablas de años escolares existen
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE '%anio%' OR table_name LIKE '%escolar%';

-- Verificar estructura de la tabla anios_escolares si existe
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'anios_escolares'
AND table_schema = 'public';

-- Verificar datos en anios_escolares si existe
SELECT * FROM anios_escolares LIMIT 5;
