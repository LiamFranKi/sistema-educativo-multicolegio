# ESTRUCTURA DE BASE DE DATOS (Referencia Rápida)

## Tabla `usuarios`

- id (serial, PK)
- nombres (varchar)
- dni (varchar, único, login)
- email (varchar, único)
- telefono (varchar)
- fecha_nacimiento (date)
- clave (varchar, contraseña encriptada)
- foto (varchar, url o nombre de archivo)
- estado (boolean, activo/inactivo)

## Tabla `grados`

- id (serial, PK)
- nombre (varchar)
- nivel (varchar)
- docente_id (integer, FK a usuarios.id)
- anio_lectivo_id (integer, FK a anios_lectivos.id)

## Tabla `bimestres`

- id (serial, PK)
- nombre (varchar)
- fecha_inicio (date)
- fecha_fin (date)
- anio_lectivo_id (integer, FK a anios_lectivos.id)

## Tabla `asignaturas`

- id (serial, PK)
- id_grado (integer, FK a grados.id)
- id_curso (integer, FK a cursos.id)
- id_docente (integer, FK a usuarios.id)

## Tabla `anios_lectivos`

- id (serial, PK)
- nombre (varchar)
- fecha_inicio (date)
- fecha_fin (date)

## Tabla `cursos`

- id (serial, PK)
- nombre (varchar)
- tipo (varchar, 'sistema' o 'personalizado')
- creado_por (integer, FK a usuarios.id, NULL para cursos del sistema)

## Tabla `usuario_grado`

- id (serial, PK)
- usuario_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- grado_id (integer, FK a grados.id, ON DELETE CASCADE)
- fecha_matricula (timestamp)
- estado_matricula (varchar, 'activo', 'retirado', 'suspendido')
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(usuario_id, grado_id)

## Tabla `alumno_apoderado`

- id (serial, PK)
- alumno_usuario_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- apoderado_usuario_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- tipo_relacion (varchar, 'padre', 'madre', 'tutor', 'abuelo', 'hermano', 'otro')
- es_principal (boolean)
- fecha_vinculacion (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(alumno_usuario_id, apoderado_usuario_id)
- CHECK (alumno_usuario_id != apoderado_usuario_id)

## Tabla `publicaciones`

- id (serial, PK)
- docente_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- grado_id (integer, FK a grados.id, ON DELETE CASCADE)
- anio_lectivo_id (integer, FK a anios_lectivos.id, ON DELETE CASCADE)
- contenido (text, NOT NULL)
- tipo (varchar(20), 'texto', 'imagen', 'link', 'archivo', DEFAULT 'texto')
- imagen (varchar(255), nombre del archivo de imagen)
- link (varchar(500), URL del enlace compartido)
- archivo (varchar(255), nombre del archivo adjunto)
- nombre_archivo (varchar(255), nombre original del archivo)
- fecha_creacion (timestamp, DEFAULT CURRENT_TIMESTAMP)
- fecha_actualizacion (timestamp, DEFAULT CURRENT_TIMESTAMP)
- activo (boolean, DEFAULT true)

## Tabla `reacciones_publicacion`

- id (serial, PK)
- publicacion_id (integer, FK a publicaciones.id, ON DELETE CASCADE)
- usuario_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- tipo_reaccion (varchar(20), 'me_gusta', 'me_encanta', 'me_divierte', 'me_asombra', 'me_entristece', 'me_enoja', DEFAULT 'me_gusta')
- fecha_reaccion (timestamp, DEFAULT CURRENT_TIMESTAMP)
- UNIQUE(publicacion_id, usuario_id)

## Tabla `comentarios_publicacion`

- id (serial, PK)
- publicacion_id (integer, FK a publicaciones.id, ON DELETE CASCADE)
- usuario_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- contenido (text, NOT NULL)
- fecha_comentario (timestamp, DEFAULT CURRENT_TIMESTAMP)
- activo (boolean, DEFAULT true)

## Tabla `compartidos_publicacion`

- id (serial, PK)
- publicacion_id (integer, FK a publicaciones.id, ON DELETE CASCADE)
- usuario_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- fecha_compartido (timestamp, DEFAULT CURRENT_TIMESTAMP)
- UNIQUE(publicacion_id, usuario_id)

## Tabla `notificaciones`

- id (serial, PK)
- usuario_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- tipo (varchar(50), tipos predefinidos)
- titulo (varchar(255))
- mensaje (text)
- datos_adicionales (jsonb)
- leida (boolean, DEFAULT false)
- fecha_creacion (timestamp, DEFAULT CURRENT_TIMESTAMP)
- fecha_lectura (timestamp)
- activo (boolean, DEFAULT true)

## Tabla `suscripciones_web_push`

- id (serial, PK)
- usuario_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- endpoint (text, NOT NULL)
- p256dh_key (text)
- auth_token (text)
- fecha_creacion (timestamp, DEFAULT CURRENT_TIMESTAMP)
- activo (boolean, DEFAULT true)
- UNIQUE(usuario_id, endpoint)

## Tabla `configuracion_notificaciones`

- id (serial, PK)
- usuario_id (integer, FK a usuarios.id, ON DELETE CASCADE)
- tipo_notificacion (varchar(50))
- email (boolean, DEFAULT true)
- web_push (boolean, DEFAULT true)
- in_app (boolean, DEFAULT true)
- fecha_actualizacion (timestamp, DEFAULT CURRENT_TIMESTAMP)
- UNIQUE(usuario_id, tipo_notificacion)

---

# CHANGELOG

## [2024-07-17] - Preparación para desarrollo portátil y configuración de GitHub

### Estado Actual del Proyecto

**Rama actual:** `terminando-modulo-docentes` (NO en master)
**Repositorio GitHub:** https://github.com/LiamFranKi/sistemas-docentes-cursor
**Último commit:** `3e9fc2f` - "feat: Agregar archivos de configuración para desarrollo portátil"

### Archivos de Configuración Creados para Desarrollo Portátil

#### **Documentación y Guías:**

- **README.md** - Instrucciones completas de instalación y configuración
  - Requisitos previos (Node.js, PostgreSQL, Git)
  - Pasos de instalación paso a paso
  - Estructura del proyecto
  - Scripts disponibles
  - Solución de problemas
- **MIGRATIONS.md** - Documentación de migraciones de base de datos
  - Orden de ejecución de migraciones SQL
  - Estructura final de la base de datos
  - Verificación de migraciones
  - Solución de problemas

#### **Scripts de Instalación Automática:**

- **install.sh** - Script de instalación para Linux/Mac
  - Verificación de dependencias
  - Instalación automática de node_modules
  - Creación de archivos de configuración
- **install.bat** - Script de instalación para Windows
  - Equivalente al script bash para Windows
  - Instrucciones específicas para PowerShell

#### **Configuración de Git y Exclusión de Archivos:**

- **.gitignore** - Exclusión de archivos innecesarios
  - node_modules/
  - Archivos de entorno (.env)
  - Archivos temporales y de sistema
  - Logs y archivos de build
- **backend/env.example** - Ejemplo de variables de entorno
  - Configuración de base de datos PostgreSQL
  - Configuración del servidor
  - JWT secret y configuración de seguridad

#### **Configuración de IDE:**

- **.vscode/settings.json** - Configuración de VS Code
  - Formateo automático al guardar
  - Configuración de ESLint
  - Exclusión de archivos en búsquedas
- **.vscode/extensions.json** - Extensiones recomendadas
  - Prettier, ESLint, TypeScript
  - Herramientas de desarrollo React

#### **Scripts Adicionales en package.json:**

- **npm run setup** - Instalación completa del proyecto
- **npm run backend** - Iniciar solo el backend
- **npm run full-install** - Instalar dependencias frontend y backend

### Funcionalidades Implementadas y Estables

#### **Módulos Completos:**

- ✅ **Sistema de Autenticación** - Login para todos los roles
- ✅ **Módulo de Administrador** - Gestión de usuarios y sistema
- ✅ **Módulo de Docente** - Publicaciones, cursos, alumnos
- ✅ **Módulo de Apoderado** - Dashboard, publicaciones, perfil
- ✅ **Módulo de Alumno** - Visualización de contenido
- ✅ **Sistema de Publicaciones** - Con reacciones y comentarios
- ✅ **Sistema de Notificaciones** - Base de datos y backend
- ✅ **Gestión de Matrículas** - Alumnos y apoderados
- ✅ **Gestión de Cursos** - Sistema y personalizados
- ✅ **Sistema de Archivos** - Subida y gestión de imágenes

#### **Correcciones Recientes:**

- ✅ **Errores de perfil** - Actualización de fotos y contraseñas
- ✅ **Errores de MUI Grid** - Corrección de deprecation warnings
- ✅ **Errores de HTML** - Anidamiento correcto de elementos
- ✅ **Errores de API** - Endpoints de verificación de DNI
- ✅ **Eliminación del módulo de chat** - Removido completamente

### Pendiente por Hacer

#### **Merge de Ramas:**

- ⏳ **Merge local** - Juntar `terminando-modulo-docentes` con `master`
- ⏳ **Push a GitHub** - Subir cambios a la rama principal
- ⏳ **Actualización de documentación** - Completar README.md

#### **Configuración para Desarrollo desde Casa:**

- ⏳ **Instalación de PostgreSQL** - En computadora personal
- ⏳ **Configuración de variables de entorno** - Archivo .env
- ⏳ **Ejecución de migraciones** - Scripts SQL en orden
- ⏳ **Pruebas de funcionalidad** - Verificar que todo funcione

### Instrucciones para Continuar

#### **Para hacer el merge local:**

```bash
git checkout master
git merge terminando-modulo-docentes
git push origin master
```

#### **Para trabajar desde casa:**

1. Clonar desde GitHub: `git clone https://github.com/LiamFranKi/sistemas-docentes-cursor.git`
2. Ejecutar instalación: `./install.sh` (Linux/Mac) o `install.bat` (Windows)
3. Configurar PostgreSQL y variables de entorno
4. Ejecutar migraciones SQL en orden
5. Iniciar proyecto: `npm start` (frontend) y `cd backend && npm run dev` (backend)

### Notas Importantes

- **Rama actual:** `terminando-modulo-docentes` - TODOS los cambios están aquí
- **Repositorio:** Ya conectado a GitHub, solo falta hacer merge
- **Archivos de configuración:** Completos para desarrollo portátil
- **Funcionalidades:** Todas implementadas y funcionando
- **Documentación:** README.md completo con instrucciones

---

# CHANGELOG - sistemas-docentes-cursor

## Contexto General

Sistema web para docentes, no para colegios, donde cada docente tiene su propio entorno y puede gestionar alumnos, padres, cursos, asignaturas, chat y notificaciones. El sistema es solo web (no móvil) y debe ser moderno, elegante y fácil de usar.

---

# NUEVO PROYECTO: SISTEMA EDUCATIVO MULTI-COLEGIO

## [2024-12-19] - Inicio del Nuevo Sistema Multi-Colegio

### Contexto del Nuevo Proyecto

**Evolución del sistema actual:** El sistema `sistemas-docentes-cursor` se pone en standby para desarrollar un nuevo sistema educativo multi-colegio que evoluciona la lógica actual hacia un sistema más completo y escalable.

### Objetivo Principal

Crear un sistema educativo que permita a un **superadministrador** gestionar múltiples colegios, cada uno con su propia estructura académica, usuarios, y funcionalidades, manteniendo la lógica probada del sistema actual.

### Características del Nuevo Sistema

#### **1. Arquitectura Multi-Tenant**

- **Superadministrador:** Gestión global de todos los colegios
- **Colegios independientes:** Cada colegio con su logo, colores, datos y estructura
- **Años escolares:** Gestión por colegio y año académico
- **Usuarios por colegio:** Administradores, docentes, tutores, apoderados, alumnos

#### **2. Funcionalidades Avanzadas**

- **Educación virtual:** Subida de videos de clases, seguimiento de progreso
- **Sistema de aprobación:** Los alumnos no pueden avanzar sin aprobar clases
- **Notificaciones web push:** Alertas para padres, estudiantes y docentes
- **Seguimiento académico:** Monitoreo detallado del progreso estudiantil

#### **3. Estructura de Base de Datos (Primeras 3 Tablas)**

##### **Tabla `usuarios` (MANTENIENDO LÓGICA DEL SISTEMA ACTUAL)**

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,        -- Campo de login (único)
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    clave VARCHAR(255) NOT NULL,            -- Password encriptado
    foto VARCHAR(500),                      -- Avatar del usuario
    activo BOOLEAN DEFAULT true,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Administrador', 'Docente', 'Alumno', 'Apoderado', 'Tutor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

##### **Tabla `colegios` (NUEVA - Multi-tenant)**

```sql
CREATE TABLE colegios (
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
```

##### **Tabla `anios_escolares` (NUEVA - Simplificada)**

```sql
CREATE TABLE anios_escolares (
    id SERIAL PRIMARY KEY,
    colegio_id INTEGER REFERENCES colegios(id) ON DELETE CASCADE,
    anio INTEGER NOT NULL,                  -- Solo el año (ej: 2025)
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(colegio_id, anio)                -- Un año por colegio
);
```

#### **4. Decisiones de Diseño Importantes**

##### **Mantener Lógica del Sistema Actual:**

- **`usuarios`:** INDEPENDIENTE - Sin `colegio_id` ni `anio_escolar_id`
- **Login por DNI:** Campo `dni` como identificador único
- **Roles existentes:** Administrador, Docente, Alumno, Apoderado, Tutor
- **Estructura probada:** Mantener tablas y relaciones que funcionan

##### **Nuevas Funcionalidades:**

- **Multi-tenancy:** Sistema de colegios independientes
- **Años escolares:** Gestión simplificada por colegio
- **Educación virtual:** Videos, progreso, aprobaciones
- **Notificaciones avanzadas:** Web push para todos los usuarios

#### **5. Tecnologías y Herramientas**

- **Base de datos:** PostgreSQL 17 (migración del sistema actual)
- **Backend:** Node.js + Express (reutilizar código existente)
- **Frontend:** React + Material-UI (adaptar componentes actuales)
- **Notificaciones:** Web Push API + WebSockets
- **Archivos:** Sistema de subida de videos y documentos

#### **6. Plan de Migración y Reutilización**

- **Código reutilizable:** Autenticación, usuarios, roles, publicaciones, notificaciones
- **Componentes adaptables:** Layouts, dashboards, formularios
- **Lógica probada:** Sistema de matrículas, grados, asignaturas
- **Base de datos:** Estructura optimizada basada en experiencia actual

#### **7. Datos de Ejemplo Iniciales**

```sql
-- Usuario superadministrador
INSERT INTO usuarios (nombres, dni, email, telefono, fecha_nacimiento, clave, foto, activo, rol, created_at, updated_at)
VALUES ('Administrador de Sistemas', '11111111', 'administrado@sistemas.com', '970877642', '1983-04-26', 'waltito10', '', true, 'Administrador', '2025-09-02', '2025-09-02');

-- Colegio de ejemplo
INSERT INTO colegios (nombre, codigo, logo, color_primario, color_secundario, direccion, telefono, email, director_nombre, activo, created_at, updated_at)
VALUES ('Vanguard Schools - Sede SMP', '20535891622', '', '#1976d2', '#424242', 'Jr Toribio de Luzuriaga Mz F lote 18 y 19 Urb San Pedro de Garagay SMP', '910526895', 'vanguard@vanguard.com', 'Rosario Maravi Lagos', true, '2025-09-02', '2025-09-02');

-- Año escolar 2025
INSERT INTO anios_escolares (colegio_id, anio, activo, created_at, updated_at)
VALUES (1, 2025, true, '2025-09-02', '2025-09-02');
```

#### **8. Próximos Pasos**

1. **Crear estructura del proyecto:** `sistema-educativo-multicolegio/`
2. **Configurar backend:** Adaptar código existente
3. **Implementar superadministrador:** Gestión de colegios
4. **Desarrollar módulos virtuales:** Videos, progreso, aprobaciones
5. **Sistema de notificaciones:** Web push avanzado
6. **Migrar funcionalidades:** Del sistema actual al nuevo

#### **9. Archivos Creados**

- `migrations/2024_12_19_create_3_tables_basic.sql` - Script de las primeras 3 tablas
- `sistema-educativo-multicolegio/backend/config/database.js` - Configuración de BD
- `sistema-educativo-multicolegio/backend/package.json` - Dependencias del backend
- `sistema-educativo-multicolegio/backend/env.example` - Variables de entorno

### Estado Actual

- ✅ **Base de datos creada:** `sistema_educativo_multicolegio`
- ✅ **3 tablas básicas:** usuarios, colegios, anios_escolares
- ✅ **Datos de ejemplo:** Insertados correctamente
- ✅ **Estructura definida:** Multi-tenant con lógica del sistema actual
- ⏳ **Siguiente fase:** Crear estructura del proyecto y adaptar código

---

## Decisiones Tecnológicas

- **Frontend:** React (con Material-UI, React Router, React Icons)
- **Backend:** Node.js + Express (a desarrollar)
- **Base de datos:** PostgreSQL (local en desarrollo, online en producción)
- **Notificaciones:** Web Push API y/o WebSockets
- **Hosting recomendado:** Railway o Render (para backend y base de datos en producción)

## Lógica y Estructura

- El administrador general crea usuarios docentes.
- Cada docente tiene su propio entorno (logo, alumnos, padres, cursos, chat, etc.).
- El login será por DNI y clave (no por email).
- El sistema tendrá un dashboard principal con menú lateral.

## Estructura de la tabla `usuarios` (PostgreSQL)

- id (serial, PK)
- nombres (varchar)
- dni (varchar, único, login)
- email (varchar, único)
- telefono (varchar)
- fecha_nacimiento (date)
- clave (varchar, para la contraseña, se guardará encriptada en producción)
- foto (varchar, url o nombre de archivo)
- estado (boolean, activo/inactivo)

## Menú del Administrador

- Dashboard
- Mi Perfil
- Usuarios (gestión de docentes)
- Cursos (gestión de cursos del sistema)
- Reportes
- Configuración
- Cerrar Sesión

## Siguientes pasos

- Crear la estructura base del dashboard en React con sidebar y encabezado.
- Implementar rutas para cada sección del menú.
- Conectar con backend y base de datos en siguientes etapas.

## [Unreleased]

### [2024-07-17] - Corrección de errores y eliminación completa del módulo de chat

**Descripción:** Corrección de múltiples errores en el sistema y eliminación completa del módulo de chat que causaba problemas persistentes.

#### **Correcciones de Errores:**

##### **Backend - Endpoint de verificación de DNI:**

- **Archivo:** `backend/routes/usuarios.js`
- **Nuevo endpoint:** `GET /api/usuarios/verificar-dni`
  - Permite a docentes verificar si un DNI existe con un rol específico
  - Resuelve errores 403 Forbidden en el módulo de matrículas
  - Accesible para roles Docente y Administrador
  - Parámetros: `dni` y `rol`

##### **Frontend - Corrección de endpoints en Matriculas:**

- **Archivo:** `src/pages/Matriculas.js`
- **Actualización de endpoints:** Cambio de `/api/usuarios?dni=` a `/api/usuarios/verificar-dni?dni=`
- **Eliminación de endpoints de test:** Removidos fetch calls a `/api/matriculas/test/:gradoId`
- **Resolución de errores 404:** Eliminación de llamadas innecesarias

##### **Frontend - Corrección de emoticonos en Publicaciones:**

- **Archivo:** `src/pages/Publicaciones.js`
- **Corrección de useEffect:** Eliminación de `showEmojiPicker` del array de dependencias
- **Resolución:** El picker de emoticonos ya no se cierra automáticamente
- **Causa:** Race condition en el event listener de `mousedown`

##### **Frontend - Corrección de jerarquía HTML:**

- **Archivo:** `src/pages/ListaAlumnosGrado.js`
- **Corrección:** Cambio de `Typography variant="h6"` a `Typography variant="subtitle1" component="div"`
- **Resolución:** Eliminación del error `<h6> cannot be a child of <h2>`
- **Ubicación:** Dentro del componente `DialogTitle`

#### **Eliminación Completa del Módulo de Chat:**

##### **Menús eliminados:**

- **Docente:** Eliminado del `docenteMenuItems` en `src/components/Sidebar/Sidebar.js`
- **Alumno:** Eliminado del `alumnoMenuItems` en `src/components/Sidebar/Sidebar.js`
- **Apoderado:** Eliminado del `menuItems` en `src/components/Apoderado/ApoderadoLayout.js`
- **Dashboard Apoderado:** Eliminado el botón de chat de las "Acciones Rápidas"

##### **Rutas eliminadas:**

- **Docente:** Eliminada la ruta `/docente/chat` en `src/components/Docente/DocenteLayout.js`
- **Alumno:** Eliminada la ruta `/alumno/chat` en `src/components/Alumno/AlumnoLayout.js`
- **Apoderado:** Eliminada la ruta `/apoderado/chat` en `src/App.js`

##### **Imports eliminados:**

- **ChatIcon:** Eliminado de `src/components/Sidebar/Sidebar.js`
- **ChatIcon:** Eliminado de `src/components/Apoderado/ApoderadoLayout.js`
- **ChatIcon:** Eliminado de `src/pages/ApoderadoDashboard.js`
- **ApoderadoChat:** Eliminado de `src/App.js`

##### **Archivos eliminados:**

- `src/pages/ChatDocente.js`
- `src/pages/ChatApoderado.js`
- `src/pages/ChatAlumno.js`
- `src/pages/ApoderadoChat.js`
- `src/components/Chat/ChatLayout.js`
- `src/components/Chat/ChatHeader.js`
- `src/components/Chat/ChatInput.js`
- `src/components/Chat/ChatMessageList.js`
- `src/components/Chat/ChatConversationList.js`
- `src/hooks/useWebSocket.js`

#### **Eliminación del menú Configuración para Apoderados:**

- **Archivo:** `src/components/Apoderado/ApoderadoLayout.js`
- **Menú eliminado:** Removido "Configuración" del array `bottomMenuItems`
- **Import eliminado:** Eliminado `SettingsIcon` ya que no se usa más
- **Resultado:** El menú de apoderados ahora solo contiene las opciones esenciales

#### **Archivos de backend eliminados:**

- `backend/routes/chat.js` - Rutas del módulo de chat
- `migrations/2024_07_15_create_chat_tables.sql` - Migración de tablas de chat

#### **Resultado:**

- **Sistema limpio:** Eliminación completa de todas las referencias al chat
- **Errores resueltos:** Corrección de problemas de endpoints, emoticonos y HTML
- **Funcionalidad mejorada:** Sistema más estable y sin módulos problemáticos
- **Menús optimizados:** Interfaz más limpia y enfocada en funcionalidades esenciales

## [1.0.0] - 2024-06-17

### Completado Módulo de Apoderados con Dashboard y Funcionalidades Completas

**Descripción:** Implementación completa del módulo de apoderados con login específico, dashboard personalizado, gestión de publicaciones, perfil de usuario y todas las funcionalidades necesarias para la comunicación entre docentes y apoderados.

#### **Base de Datos - Simplificación de Publicaciones:**

- **Migración SQL:** `migrations/2024_06_17_remove_privacidad_from_publicaciones.sql`
- **Eliminación del campo `privacidad`:** Simplificación del sistema de publicaciones
  - Removido campo `privacidad` de la tabla `publicaciones`
  - Filtrado ahora basado únicamente en el grado asignado
  - Mejora en la simplicidad y mantenibilidad del sistema

#### **Backend - Módulo Completo de Apoderados:**

- **Archivo:** `backend/routes/apoderados.js`
- **POST** `/api/apoderados/login` - Login específico para apoderados
  - Verificación de rol apoderado
  - Carga automática de información de hijos
  - Token JWT con rol específico
- **GET** `/api/apoderados/mis-hijos` - Obtener información de hijos del apoderado
  - Datos completos: nombres, DNI, grado, docente, estado de matrícula
  - Filtrado por matrículas activas
- **GET** `/api/apoderados/hijo/:hijoId/detalles` - Detalles completos de un hijo
  - Información del docente asignado
  - Estado de matrícula y grado actual
- **GET** `/api/apoderados/publicaciones` - Publicaciones específicas para apoderados
  - Filtrado por grados de hijos activos
  - Incluye reacciones y comentarios
  - Ordenadas por fecha de creación
- **POST** `/api/apoderados/publicaciones/:id/reaccionar` - Sistema de reacciones
  - Tipos: 'me_gusta', 'me_encanta'
  - Optimistic updates para mejor UX
- **POST** `/api/apoderados/publicaciones/:id/comentar` - Sistema de comentarios
  - Comentarios en tiempo real
  - Polling automático para actualizaciones
- **GET** `/api/apoderados/perfil` - Obtener perfil del apoderado
- **PUT** `/api/apoderados/perfil` - Actualizar información personal
- **PUT** `/api/apoderados/cambiar-clave` - Cambio de contraseña con validación

#### **Backend - Sistema de Notificaciones:**

- **Archivo:** `backend/routes/notificaciones.js`
- **GET** `/api/notificaciones` - Obtener notificaciones del usuario
- **GET** `/api/notificaciones/no-leidas` - Contar notificaciones no leídas
- **PUT** `/api/notificaciones/:id/leer` - Marcar como leída
- **PUT** `/api/notificaciones/leer-todas` - Marcar todas como leídas
- **DELETE** `/api/notificaciones/:id` - Eliminar notificación
- **GET** `/api/notificaciones/configuracion` - Configuración de notificaciones
- **PUT** `/api/notificaciones/configuracion` - Actualizar configuración
- **POST** `/api/notificaciones/suscripcion-web-push` - Web Push API
- **DELETE** `/api/notificaciones/suscripcion-web-push/:endpoint` - Eliminar suscripción

#### **Backend - Mejoras en Publicaciones:**

- **Archivo:** `backend/routes/publicaciones.js`
- **Corrección de filtros:** Filtrado correcto por grados activos
- **Optimización de consultas:** Mejoras en rendimiento para apoderados
- **Sistema de reacciones:** Manejo correcto de tipos de reacción
- **Comentarios en tiempo real:** Polling automático implementado

#### **Frontend - Layout y Componentes de Apoderados:**

- **Archivo:** `src/components/Apoderado/ApoderadoLayout.js`
- **Sidebar específico:** Menú adaptado para apoderados
  - Dashboard, Publicaciones, Mis Hijos, Mi Perfil, Cerrar Sesión
- **Header personalizado:** Información del apoderado logueado
- **Navegación intuitiva:** Rutas específicas para cada funcionalidad

#### **Frontend - Dashboard de Apoderados:**

- **Archivo:** `src/pages/ApoderadoDashboard.js`
- **Estadísticas principales:**
  - Número total de hijos
  - Publicaciones no leídas
  - Notificaciones pendientes
  - Eventos próximos
- **Diseño responsivo:** Grid adaptativo con Material-UI v2
- **Cards informativas:** Visualización clara de datos importantes
- **Navegación rápida:** Enlaces directos a secciones principales

#### **Frontend - Publicaciones para Apoderados:**

- **Archivo:** `src/pages/PublicacionesApoderado.js`
- **Feed de publicaciones:** Diseño similar a redes sociales
- **Filtrado automático:** Solo publicaciones de grados de hijos activos
- **Sistema de reacciones:** Botones "Me gusta" y "Me encanta" con optimistic updates
- **Comentarios en tiempo real:** Polling automático cada 5 segundos
- **Visualizador de imágenes:** Modal para ver imágenes en tamaño completo
- **Información del docente:** Datos del profesor que publicó
- **Fecha y hora:** Formato legible de publicación

#### **Frontend - Perfil de Apoderado:**

- **Archivo:** `src/pages/ApoderadoMiPerfil.js`
- **Edición de datos personales:** Nombres, email, teléfono, fecha de nacimiento
- **Cambio de contraseña:** Con validación de contraseña actual
- **Subida de foto:** Con preview y validación de formato
- **Alertas visuales:** Feedback inmediato de operaciones
- **Validaciones:** Verificación de datos antes de guardar

#### **Frontend - Páginas Adicionales:**

- **ApoderadoAlertas.js:** Sistema de alertas y notificaciones
- **ApoderadoAlumnos.js:** Gestión de información de hijos
- **ApoderadoChat.js:** Sistema de mensajería (preparado para futuras implementaciones)
- **ApoderadoComunicados.js:** Comunicados específicos para apoderados
- **ApoderadoEventos.js:** Calendario de eventos escolares
- **ApoderadoMensajes.js:** Mensajes privados con docentes

#### **Frontend - Mejoras Generales:**

- **Archivo:** `src/App.js`
- **Rutas de apoderados:** Configuración completa de rutas
- **Protección de rutas:** Verificación de roles y autenticación
- **Redirecciones:** Manejo correcto de navegación según rol

#### **Frontend - Componentes Mejorados:**

- **Archivo:** `src/components/Header/Header.js`
- **Soporte multi-rol:** Adaptación según tipo de usuario
- **Información contextual:** Datos específicos por rol
- **Archivo:** `src/components/Sidebar/Sidebar.js`
- **Menús dinámicos:** Opciones según rol del usuario
- **Navegación intuitiva:** Enlaces directos a funcionalidades

#### **Correcciones y Optimizaciones:**

- **Material-UI Grid v2:** Corrección de sintaxis para Grid components
- **React JSX:** Eliminación de warnings de elementos adyacentes
- **HTML válido:** Corrección de anidamiento de elementos
- **Autenticación:** Resolución de errores 403 Forbidden
- **Filtrado de publicaciones:** Corrección de consultas SQL
- **Sistema de reacciones:** Manejo correcto de payloads
- **Optimistic updates:** Mejora en experiencia de usuario

#### **Dependencias y Configuración:**

- **Backend:** Instalación de dependencias necesarias (bcrypt, multer, nodemon)
- **Frontend:** Actualización de package.json con nuevas dependencias
- **Archivos de configuración:** Ajustes para desarrollo y producción

#### **Archivos de Soporte:**

- **Imágenes:** Logos de cursos y capturas de BD en `Varios/`
- **Debug:** Scripts de testing y debugging
- **Migraciones:** Archivos SQL para actualización de BD
- **Documentación:** Guías y referencias del sistema

### Preparación del Sistema de Notificaciones y Módulo de Apoderados (2024-06-16)

**Descripción:** Implementación de la estructura base para el sistema de notificaciones en tiempo real y desarrollo del módulo completo de apoderados con login y funcionalidades específicas.

#### **Base de Datos - Sistema de Notificaciones:**

- **Migración SQL:** `migrations/2024_06_16_create_notificaciones_table.sql`
- **Tabla `notificaciones`:** Almacena todas las notificaciones del sistema
  - Campos: id, usuario_id, tipo, titulo, mensaje, datos_adicionales (JSONB), leida, fecha_creacion, fecha_lectura, activo
  - Tipos: nueva_publicacion, nuevo_comentario, nueva_reaccion, nuevo_alumno, nuevo_apoderado, asistencia, nota_nueva, evento_proximo, comunicado_importante
  - Datos adicionales en JSONB para almacenar IDs de publicaciones, comentarios, etc.
- **Tabla `suscripciones_web_push`:** Para notificaciones push del navegador
  - Campos: usuario_id, endpoint, p256dh_key, auth_token, fecha_creacion, activo
  - Restricción única por usuario y endpoint
- **Tabla `configuracion_notificaciones`:** Preferencias de notificaciones por usuario
  - Campos: usuario_id, tipo_notificacion, email, web_push, in_app, fecha_actualizacion
  - Configuración granular por tipo de notificación
- **Triggers automáticos:** Creación automática de notificaciones al publicar contenido
  - Función `crear_notificacion_publicacion()` que se ejecuta al insertar publicaciones
  - Notificaciones dirigidas según privacidad y grado de la publicación
  - Configuraciones por defecto para usuarios existentes

#### **Backend - Rutas de Notificaciones:**

- **Archivo:** `backend/routes/notificaciones.js`
- **GET** `/api/notificaciones` - Obtener notificaciones del usuario con filtros
- **GET** `/api/notificaciones/no-leidas` - Contar notificaciones no leídas
- **PUT** `/api/notificaciones/:id/leer` - Marcar notificación como leída
- **PUT** `/api/notificaciones/leer-todas` - Marcar todas como leídas
- **DELETE** `/api/notificaciones/:id` - Eliminar notificación (soft delete)
- **GET** `/api/notificaciones/configuracion` - Obtener configuración de notificaciones
- **PUT** `/api/notificaciones/configuracion` - Actualizar configuración
- **POST** `/api/notificaciones/suscripcion-web-push` - Registrar suscripción Web Push
- **DELETE** `/api/notificaciones/suscripcion-web-push/:endpoint` - Eliminar suscripción
- **Autenticación JWT:** Todas las rutas protegidas
- **Optimización:** Índices para consultas rápidas, triggers para actualización automática

#### **Backend - Módulo de Apoderados:**

- **Archivo:** `backend/routes/apoderados.js`
- **POST** `/api/apoderados/login` - Login específico para apoderados
  - Verificación de rol apoderado
  - Carga automática de información de hijos
  - Token JWT con rol específico
- **GET** `/api/apoderados/mis-hijos` - Obtener información de hijos del apoderado
  - Datos completos: nombres, DNI, grado, docente, estado de matrícula
  - Filtrado por matrículas activas
- **GET** `/api/apoderados/hijo/:hijoId/detalles` - Detalles completos de un hijo
  - Información del docente asignado
