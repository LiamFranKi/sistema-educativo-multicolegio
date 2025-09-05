const { query } = require('./config/database');

async function checkAndAddUserFields() {
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

    // Verificar si faltan los nuevos campos
    const existingColumns = result.rows.map(row => row.column_name);
    const requiredColumns = ['apellidos', 'direccion', 'genero', 'estado_civil', 'profesion'];
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length === 0) {
      console.log('✅ Todos los campos necesarios ya existen en la tabla usuarios');
      return;
    }

    console.log(`❌ Faltan los siguientes campos: ${missingColumns.join(', ')}`);
    console.log('🔧 Agregando campos faltantes...');

    // Agregar campos faltantes
    for (const column of missingColumns) {
      let alterQuery = '';

      switch (column) {
        case 'apellidos':
          alterQuery = 'ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS apellidos VARCHAR(100)';
          break;
        case 'direccion':
          alterQuery = 'ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS direccion TEXT';
          break;
        case 'genero':
          alterQuery = 'ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS genero VARCHAR(20) CHECK (genero IN (\'Masculino\', \'Femenino\', \'Otro\'))';
          break;
        case 'estado_civil':
          alterQuery = 'ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(20) CHECK (estado_civil IN (\'Soltero\', \'Casado\', \'Divorciado\', \'Viudo\', \'Conviviente\'))';
          break;
        case 'profesion':
          alterQuery = 'ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS profesion VARCHAR(100)';
          break;
      }

      if (alterQuery) {
        await query(alterQuery);
        console.log(`   ✅ Campo '${column}' agregado`);
      }
    }

    // Crear índices
    console.log('🔧 Creando índices...');
    await query('CREATE INDEX IF NOT EXISTS idx_usuarios_apellidos ON usuarios(apellidos)');
    await query('CREATE INDEX IF NOT EXISTS idx_usuarios_genero ON usuarios(genero)');
    await query('CREATE INDEX IF NOT EXISTS idx_usuarios_profesion ON usuarios(profesion)');
    console.log('   ✅ Índices creados');

    console.log('🎉 ¡Campos agregados exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkAndAddUserFields();
