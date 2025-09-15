const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_educativo_multicolegio',
  password: 'waltito10',
  port: 5432,
});

async function updateExistingGrados() {
  const client = await pool.connect();

  try {
    console.log('🔄 Actualizando grados existentes...');

    // Actualizar grados existentes con valores por defecto
    const updateQuery = `
      UPDATE grados SET
        seccion = 'Unica',
        direccion_archivos = '',
        link_aula_virtual = '',
        nivel_id = 1,
        anio_escolar = 2024
      WHERE seccion IS NULL OR seccion = '';
    `;

    const result = await client.query(updateQuery);
    console.log(`✅ ${result.rowCount} grados actualizados con valores por defecto`);

    // Verificar que los grados tienen los nuevos campos
    const checkQuery = `
      SELECT id, nombre, seccion, anio_escolar, nivel_id
      FROM grados
      LIMIT 5;
    `;

    const checkResult = await client.query(checkQuery);
    console.log('📋 Verificación de grados actualizados:');
    checkResult.rows.forEach(grado => {
      console.log(`   - ${grado.nombre}: Sección=${grado.seccion}, Año=${grado.anio_escolar}, Nivel=${grado.nivel_id}`);
    });

  } catch (error) {
    console.error('❌ Error actualizando grados:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateExistingGrados()
    .then(() => {
      console.log('🎉 Actualización completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en actualización:', error);
      process.exit(1);
    });
}

module.exports = { updateExistingGrados };
