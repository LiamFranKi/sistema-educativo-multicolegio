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
    console.log('🔄 Ejecutando migración de grados...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'migrations', 'create_grados_table.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar la migración
    await client.query(sqlContent);
    
    console.log('✅ Migración de grados ejecutada exitosamente');
    
    // Verificar que la tabla se creó correctamente
    const result = await client.query(`
      SELECT 
        g.id, 
        g.nombre, 
        g.codigo, 
        n.nombre as nivel_nombre,
        g.orden,
        g.activo
      FROM grados g 
      JOIN niveles n ON g.nivel_id = n.id 
      ORDER BY n.orden, g.orden
    `);
    
    console.log('📊 Grados creados:');
    result.rows.forEach(grado => {
      console.log(`  - ${grado.nombre} (${grado.codigo}) - ${grado.nivel_nombre}`);
    });
    
    console.log(`\n✅ Total de grados creados: ${result.rows.length}`);
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
