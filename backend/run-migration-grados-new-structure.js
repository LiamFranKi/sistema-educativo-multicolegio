const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_educativo_multicolegio',
  password: 'waltito10',
  port: 5432,
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('🚀 Iniciando migración de estructura de grados...');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'modify_grados_table_structure.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Ejecutar la migración
    await client.query(sqlContent);

    console.log('✅ Migración ejecutada exitosamente');
    console.log('📋 Campos agregados:');
    console.log('   - seccion (VARCHAR)');
    console.log('   - direccion_archivos (TEXT)');
    console.log('   - link_aula_virtual (TEXT)');
    console.log('   - nivel_id (INTEGER)');
    console.log('   - anio_escolar (INTEGER)');
    console.log('   - Tabla secciones_disponibles creada');

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎉 Migración completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en migración:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };
