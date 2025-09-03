# Sistema Educativo Multi-Colegio

Sistema web educativo que permite a un superadministrador gestionar múltiples colegios, cada uno con su propia estructura académica, usuarios y funcionalidades.

## Características Principales

- **Arquitectura Multi-Tenant**: Gestión de múltiples colegios independientes
- **Roles de Usuario**: Superadministrador, Administrador, Docente, Alumno, Apoderado, Tutor
- **Educación Virtual**: Subida de videos, seguimiento de progreso, sistema de aprobación
- **Notificaciones Web Push**: Alertas en tiempo real para todos los usuarios
- **Sistema de Publicaciones**: Con reacciones, comentarios y compartir
- **Gestión Académica**: Años escolares, grados, cursos, asignaturas

## Tecnologías

- **Frontend**: React 18 + Material-UI 5 + React Router 6
- **Backend**: Node.js + Express + PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Notificaciones**: Web Push API + WebSockets
- **Archivos**: Multer para subida de videos y documentos

## Requisitos Previos

- Node.js >= 16.0.0
- npm >= 8.0.0
- PostgreSQL >= 12.0
- Git

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/LiamFranKi/sistema-educativo-multicolegio.git
cd sistema-educativo-multicolegio
```

### 2. Instalación Automática

#### Windows:

```bash
install.bat
```

#### Linux/Mac:

```bash
chmod +x install.sh
./install.sh
```

### 3. Instalación Manual

```bash
# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias del frontend
cd frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install
```

### 4. Configuración de Base de Datos

1. Crear base de datos PostgreSQL:

```sql
CREATE DATABASE sistema_educativo_multicolegio;
```

2. Copiar archivo de configuración:

```bash
cp backend/env.example backend/.env
```

3. Editar `backend/.env` con tus credenciales de PostgreSQL

4. Ejecutar migraciones:

```bash
# Ejecutar en orden los archivos SQL de la carpeta migrations/
psql -U postgres -d sistema_educativo_multicolegio -f migrations/2024_12_19_create_3_tables_basic.sql
```

## Uso

### Desarrollo

```bash
# Iniciar frontend y backend simultáneamente
npm run dev

# O iniciar por separado:
npm start          # Frontend (puerto 3000)
npm run backend    # Backend (puerto 5000)
```

### Producción

```bash
# Construir frontend
npm run build

# Iniciar backend en producción
cd backend
npm start
```

## Estructura del Proyecto

```
sistema-educativo-multicolegio/
├── frontend/                 # Aplicación React
│   ├── public/              # Archivos públicos
│   ├── src/                 # Código fuente
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # Servicios API
│   │   ├── utils/          # Utilidades
│   │   └── App.js          # Componente principal
│   └── package.json
├── backend/                 # API Node.js
│   ├── routes/             # Rutas de la API
│   ├── middleware/         # Middleware personalizado
│   ├── models/             # Modelos de datos
│   ├── config/             # Configuración
│   ├── uploads/            # Archivos subidos
│   └── server.js           # Servidor principal
├── migrations/             # Scripts SQL de migración
├── package.json            # Configuración principal
└── README.md
```

## Scripts Disponibles

- `npm start` - Iniciar frontend
- `npm run backend` - Iniciar backend
- `npm run dev` - Iniciar frontend y backend
- `npm run build` - Construir para producción
- `npm run install-all` - Instalar todas las dependencias
- `npm run setup` - Configuración completa

## Configuración de Base de Datos

### Tablas Principales

- `usuarios` - Sistema de autenticación por DNI
- `colegios` - Multi-tenancy por colegio
- `anios_escolares` - Gestión de años académicos
- `grados` - Grados por colegio y año
- `cursos` - Cursos del sistema y personalizados
- `asignaturas` - Asignaturas por grado
- `publicaciones` - Sistema de publicaciones
- `notificaciones` - Sistema de notificaciones

### Datos de Ejemplo

El sistema incluye datos de ejemplo:

- Superadministrador: DNI `11111111`, clave `waltito10`
- Colegio de ejemplo: Vanguard Schools - Sede SMP

## Desarrollo

### Agregar Nuevas Funcionalidades

1. Crear migración SQL en `migrations/`
2. Implementar rutas en `backend/routes/`
3. Crear componentes en `frontend/src/components/`
4. Agregar páginas en `frontend/src/pages/`
5. Actualizar navegación en `frontend/src/App.js`

### Convenciones de Código

- **Frontend**: React con hooks, Material-UI, componentes funcionales
- **Backend**: Express con middleware, validación con express-validator
- **Base de datos**: PostgreSQL con migraciones SQL
- **Autenticación**: JWT con roles y permisos

## Solución de Problemas

### Error de Conexión a Base de Datos

- Verificar que PostgreSQL esté ejecutándose
- Comprobar credenciales en `backend/.env`
- Verificar que la base de datos existe

### Error de Dependencias

```bash
# Limpiar e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

### Error de Puerto en Uso

- Cambiar puerto en `backend/.env` (PORT=5001)
- O matar proceso: `lsof -ti:5000 | xargs kill -9`

## Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## Licencia

MIT License - ver archivo LICENSE para detalles.

## Contacto

- **Autor**: LiamFranKi
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [https://github.com/LiamFranKi]

---

**Nota**: Este sistema evoluciona del proyecto `sistemas-docentes-cursor` manteniendo la lógica probada y agregando funcionalidades multi-colegio.
