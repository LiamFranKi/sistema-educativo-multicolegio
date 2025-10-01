const { Pool } = require('pg');

// Configuración de la base de datos
let poolConfig;

if (process.env.DATABASE_URL) {
  // Railway y otros servicios en la nube usan DATABASE_URL
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
} else {
  // Configuración local
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'sistema_educativo_multicolegio',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'waltito10',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

const pool = new Pool(poolConfig);

// Eventos del pool
pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en el pool de conexiones:', err);
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a BD exitosa');
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query de prueba exitosa:', result.rows[0]);
    client.release();
  } catch (err) {
    console.error('❌ Error en conexión a BD:', err);
  }
};

// Probar conexión al iniciar
testConnection();

// Función para ejecutar consultas
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query ejecutada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('❌ Error en query:', err);
    throw err;
  }
};

// Función para obtener un cliente del pool
const getClient = async () => {
  return await pool.connect();
};

// Función para cerrar el pool
const closePool = async () => {
  await pool.end();
  console.log('🔒 Pool de conexiones cerrado');
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
  closePool
};
