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
    console.log('🔄 Ejecutando migración de áreas...');

    // Leer el archivo SQL de PostgreSQL
    const sqlPath = path.join(__dirname, 'migrations', 'create_areas_table_postgresql.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Ejecutar la migración
    await client.query(sqlContent);

    console.log('✅ Migración de áreas ejecutada exitosamente');

    // Verificar que la tabla se creó correctamente
    const result = await client.query(`
      SELECT id, nombre, codigo, estado
      FROM areas
      ORDER BY nombre
    `);

    console.log('📊 Áreas creadas/registradas:');
    result.rows.forEach((area) => {
      console.log(`  - ${area.nombre} (${area.codigo}) - ${area.estado}`);
    });

    console.log(`\n✅ Total de áreas: ${result.rows.length}`);
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
