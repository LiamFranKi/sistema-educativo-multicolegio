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
    console.log('🚀 Iniciando migración de niveles educativos...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'create_niveles_table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar la migración
    await client.query(sqlContent);
    
    console.log('✅ Migración de niveles ejecutada exitosamente');
    
    // Verificar que se crearon los niveles
    const result = await client.query('SELECT * FROM niveles ORDER BY orden');
    console.log('📊 Niveles creados:');
    result.rows.forEach(nivel => {
      console.log(`  - ${nivel.nombre} (${nivel.codigo}): ${nivel.descripcion}`);
    });
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
