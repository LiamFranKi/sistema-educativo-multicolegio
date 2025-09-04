-- Crear tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS configuracion (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(50) DEFAULT 'text' CHECK (tipo IN ('text', 'number', 'boolean', 'color', 'file')),
    categoria VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_configuracion_clave ON configuracion(clave);
CREATE INDEX IF NOT EXISTS idx_configuracion_categoria ON configuracion(categoria);

-- Insertar configuraciones iniciales del colegio
INSERT INTO configuracion (clave, valor, descripcion, tipo, categoria) VALUES
('colegio_nombre', 'Sistema Educativo', 'Nombre oficial del colegio', 'text', 'colegio'),
('colegio_codigo', 'SEDU001', 'Código único del colegio', 'text', 'colegio'),
('colegio_direccion', 'Av. Principal 123, Lima', 'Dirección completa del colegio', 'text', 'colegio'),
('colegio_telefono', '987654321', 'Teléfono de contacto', 'text', 'colegio'),
('colegio_email', 'info@sistemaeducativo.edu.pe', 'Email de contacto', 'text', 'colegio'),
('colegio_logo', '', 'Archivo del logo del colegio', 'file', 'colegio'),
('colegio_color_primario', '#1976d2', 'Color primario del tema', 'color', 'colegio'),
('colegio_color_secundario', '#424242', 'Color secundario del tema', 'color', 'colegio'),
('colegio_director', 'Director del Colegio', 'Nombre del director', 'text', 'colegio'),
('colegio_background_tipo', 'color', 'Tipo de fondo: color o imagen', 'text', 'colegio'),
('colegio_background_color', '#f5f5f5', 'Color de fondo de la aplicación', 'color', 'colegio'),
('colegio_background_imagen', '', 'Imagen de fondo de la aplicación', 'file', 'colegio'),
('anio_escolar_actual', '2025', 'Año escolar actual', 'number', 'sistema'),
('sistema_activo', 'true', 'Estado del sistema', 'boolean', 'sistema')
ON CONFLICT (clave) DO NOTHING;
