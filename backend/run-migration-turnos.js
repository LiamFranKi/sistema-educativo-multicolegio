const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_educativo_multicolegio',
  password: 'waltito10',
  port: 5432,
});

async function runMigration() {
  try {
    console.log('🔄 Iniciando migración de tabla turnos...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'create_turnos_table_postgresql.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar la migración
    await pool.query(sqlContent);
    
    console.log('✅ Migración de turnos completada exitosamente');
    console.log('📋 Tabla turnos creada con los siguientes registros:');
    console.log('   - Mañana (M)');
    console.log('   - Tarde (T)');
    console.log('   - Noche (N)');
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
