const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración de la base de datos
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'sistema_educativo_multicolegio',
  user: 'postgres',
  password: '', // Sin contraseña
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function runMigration() {
  try {
    console.log('🔄 Ejecutando migración para agregar campos de perfil...');
    
    // Leer el archivo SQL
    const sqlFile = path.join(__dirname, 'migrations', 'add_user_profile_fields.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Ejecutar la migración
    await pool.query(sql);
    
    console.log('✅ Migración ejecutada exitosamente');
    console.log('📋 Campos agregados:');
    console.log('   - apellidos (VARCHAR(100))');
    console.log('   - direccion (TEXT)');
    console.log('   - genero (VARCHAR(20))');
    console.log('   - estado_civil (VARCHAR(20))');
    console.log('   - profesion (VARCHAR(100))');
    console.log('   - Índices creados para mejor rendimiento');
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runMigration();
