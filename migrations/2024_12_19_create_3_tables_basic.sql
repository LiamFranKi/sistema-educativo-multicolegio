-- Migración: Crear las 3 tablas básicas del sistema educativo multi-colegio
-- Fecha: 2024-12-19
-- Descripción: Estructura inicial con usuarios, colegios y años escolares

-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla usuarios (MANTENIENDO LÓGICA DEL SISTEMA ACTUAL)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,        -- Campo de login (único)
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    clave VARCHAR(255) NOT NULL,            -- Password encriptado
    foto VARCHAR(500),                      -- Avatar del usuario
    activo BOOLEAN DEFAULT true,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Superadministrador', 'Administrador', 'Docente', 'Alumno', 'Apoderado', 'Tutor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla colegios (NUEVA - Multi-tenant)
CREATE TABLE IF NOT EXISTS colegios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,     -- RUC del colegio
    logo VARCHAR(500),                      -- URL del logo
    color_primario VARCHAR(7) DEFAULT '#1976d2',
    color_secundario VARCHAR(7) DEFAULT '#424242',
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(255),
    director_nombre VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla anios_escolares (NUEVA - Simplificada)
CREATE TABLE IF NOT EXISTS anios_escolares (
    id SERIAL PRIMARY KEY,
    colegio_id INTEGER REFERENCES colegios(id) ON DELETE CASCADE,
    anio INTEGER NOT NULL,                  -- Solo el año (ej: 2025)
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(colegio_id, anio)                -- Un año por colegio
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_dni ON usuarios(dni);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

CREATE INDEX IF NOT EXISTS idx_colegios_codigo ON colegios(codigo);
CREATE INDEX IF NOT EXISTS idx_colegios_activo ON colegios(activo);

CREATE INDEX IF NOT EXISTS idx_anios_escolares_colegio ON anios_escolares(colegio_id);
CREATE INDEX IF NOT EXISTS idx_anios_escolares_anio ON anios_escolares(anio);
CREATE INDEX IF NOT EXISTS idx_anios_escolares_activo ON anios_escolares(activo);

-- Insertar datos de ejemplo
-- Usuario superadministrador
INSERT INTO usuarios (nombres, dni, email, telefono, fecha_nacimiento, clave, foto, activo, rol, created_at, updated_at)
VALUES ('Administrador de Sistemas', '11111111', 'administrador@sistemas.com', '970877642', '1983-04-26', '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '', true, 'Superadministrador', '2024-12-19', '2024-12-19')
ON CONFLICT (dni) DO NOTHING;

-- Colegio de ejemplo
INSERT INTO colegios (nombre, codigo, logo, color_primario, color_secundario, direccion, telefono, email, director_nombre, activo, created_at, updated_at)
VALUES ('Vanguard Schools - Sede SMP', '20535891622', '', '#1976d2', '#424242', 'Jr Toribio de Luzuriaga Mz F lote 18 y 19 Urb San Pedro de Garagay SMP', '910526895', 'vanguard@vanguard.com', 'Rosario Maravi Lagos', true, '2024-12-19', '2024-12-19')
ON CONFLICT (codigo) DO NOTHING;

-- Año escolar 2025
INSERT INTO anios_escolares (colegio_id, anio, activo, created_at, updated_at)
VALUES (1, 2025, true, '2024-12-19', '2024-12-19')
ON CONFLICT (colegio_id, anio) DO NOTHING;

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colegios_updated_at BEFORE UPDATE ON colegios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_anios_escolares_updated_at BEFORE UPDATE ON anios_escolares FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios en las tablas
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema educativo multi-colegio';
COMMENT ON TABLE colegios IS 'Tabla de colegios para el sistema multi-tenant';
COMMENT ON TABLE anios_escolares IS 'Tabla de años escolares por colegio';

-- Comentarios en columnas importantes
COMMENT ON COLUMN usuarios.dni IS 'DNI único para login del usuario';
COMMENT ON COLUMN usuarios.clave IS 'Contraseña encriptada con bcrypt';
COMMENT ON COLUMN usuarios.rol IS 'Rol del usuario: Superadministrador, Administrador, Docente, Alumno, Apoderado, Tutor';
COMMENT ON COLUMN colegios.codigo IS 'Código único del colegio (RUC)';
COMMENT ON COLUMN colegios.color_primario IS 'Color primario del colegio en formato HEX';
COMMENT ON COLUMN colegios.color_secundario IS 'Color secundario del colegio en formato HEX';
COMMENT ON COLUMN anios_escolares.anio IS 'Año escolar (ej: 2025)';
COMMENT ON COLUMN anios_escolares.colegio_id IS 'Referencia al colegio al que pertenece el año escolar';

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas creadas exitosamente:' as mensaje;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('usuarios', 'colegios', 'anios_escolares');

-- Verificar datos de ejemplo
SELECT 'Datos de ejemplo insertados:' as mensaje;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_colegios FROM colegios;
SELECT COUNT(*) as total_anios_escolares FROM anios_escolares;
