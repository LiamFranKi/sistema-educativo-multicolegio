const { query } = require('./config/database');

async function verifyUserFields() {
  try {
    console.log('🔍 Verificando campos de la tabla usuarios...');

    // Verificar estructura actual de la tabla
    const result = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'usuarios'
      ORDER BY ordinal_position
    `);

    console.log('📋 Campos actuales en la tabla usuarios:');
    result.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Verificar si existen los nuevos campos
    const existingColumns = result.rows.map(row => row.column_name);
    const requiredColumns = ['apellidos', 'direccion', 'genero', 'estado_civil', 'profesion'];
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length === 0) {
      console.log('✅ Todos los campos necesarios existen en la tabla usuarios');

      // Probar consulta de usuario
      console.log('🔍 Probando consulta de usuario...');
      const userResult = await query(`
        SELECT id, nombres, apellidos, dni, email, telefono, fecha_nacimiento, direccion, genero, estado_civil, profesion, foto, rol, activo, created_at, updated_at
        FROM usuarios
        LIMIT 1
      `);

      if (userResult.rows.length > 0) {
        console.log('✅ Consulta de usuario exitosa');
        console.log('📋 Campos disponibles en la respuesta:');
        Object.keys(userResult.rows[0]).forEach(key => {
          console.log(`   - ${key}: ${userResult.rows[0][key] || 'null'}`);
        });
      } else {
        console.log('⚠️ No hay usuarios en la tabla');
      }

    } else {
      console.log(`❌ Faltan los siguientes campos: ${missingColumns.join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

verifyUserFields();
