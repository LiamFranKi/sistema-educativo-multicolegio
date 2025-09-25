# CHANGELOG

## [2025-01-16] - Implementación Completa del Módulo de Cursos

### ✨ Nuevas Funcionalidades

- **Módulo de Cursos**: Implementación completa del CRUD para gestión de cursos/áreas curriculares
- **Base de datos**: Tabla cursos con relación a niveles educativos y cursos predefinidos
- **API Backend**: Rutas completas para CRUD de cursos con validaciones y subida de imágenes
- **Frontend**: Componentes CursosList, CursosForm y CursosView siguiendo patrones del sistema

### 🗄️ Base de Datos

- **Tabla cursos**: Estructura completa con campos nombre, descripción, abreviatura, nivel_id, imagen, activo
- **Constraints**: Unicidad por nombre+nivel y abreviatura única
- **Cursos predefinidos**: 24 cursos distribuidos por niveles (Inicial: 6, Primaria: 8, Secundaria: 10)
- **Relaciones**: Foreign key a tabla niveles con restricción

### 🔧 Backend API

- **Rutas implementadas**: GET, POST, PUT, DELETE para /api/cursos
- **Filtros**: Por nivel, estado y búsqueda por nombre/descripción/abreviatura
- **Paginación**: Sistema completo de paginación con totales
- **Subida de imágenes**: Integración con multer para archivos de hasta 5MB
- **Validaciones**: Unicidad de abreviatura y nombre+nivel, verificación de niveles existentes
- **Endpoint adicional**: /api/cursos/niveles/lista para obtener niveles activos

### 🎨 Frontend

- **CursosList**: Lista principal con grilla estándar, filtros, búsqueda y menú contextual
- **CursosForm**: Formulario modal para crear/editar con subida de imágenes y validaciones
- **CursosView**: Vista detallada en modal con información completa del curso
- **Servicio API**: cursosService con métodos completos para todas las operaciones CRUD

### 🎯 Características del Diseño

- **Colores estándar**: Header azul #61a7d1, filas alternadas blanco/#e7f1f8, hover naranja #ffe6d9
- **Botón Opciones**: Menú contextual con Ver Detalle, Editar Curso, Eliminar Curso
- **Filtros**: Por nivel educativo y estado (Activo/Inactivo)
- **Búsqueda**: Por nombre, descripción y abreviatura
- **Paginación**: Con opciones 5, 10, 25, 50 filas por página
- **Imágenes**: Avatar circular en lista, imagen grande en formulario y vista

### 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js, Express.js, PostgreSQL, Multer
- **Frontend**: React, Material-UI, SweetAlert2, fileService
- **Validaciones**: Frontend y backend con mensajes de error específicos
- **Archivos**: Subida con validación de tipo y tamaño, eliminación automática

### 📊 Datos Predefinidos

- **Nivel Inicial**: Comunicación, Matemática, Personal Social, Ciencia y Ambiente, Arte, Psicomotricidad
- **Nivel Primaria**: Comunicación, Matemática, Personal Social, Ciencia y Ambiente, Arte y Cultura, Educación Física, Inglés, Religión
- **Nivel Secundaria**: Comunicación, Matemática, Historia/Geografía/Economía, Ciencia/Tecnología/Ambiente, Arte y Cultura, Educación Física, Inglés, Religión, Formación Ciudadana y Cívica, Educación para el Trabajo

### 🎯 Estado Final

- ✅ **CRUD completo** funcionando correctamente
- ✅ **Base de datos** con estructura optimizada y datos predefinidos
- ✅ **API Backend** con validaciones robustas y manejo de archivos
- ✅ **Frontend** con diseño consistente y funcionalidades completas
- ✅ **Integración** perfecta con sistema de niveles existente
- ✅ **Patrones** seguidos según estándares del sistema

---

## [2025-01-16] - Correcciones y Mejoras en Módulo de Avatars

### 🔧 Correcciones Técnicas

- **Campo género faltante**: Agregado campo `genero` al FormData en formulario de avatars
- **Headers multipart**: Corregido Content-Type para subida de archivos
- **Patrón de subida de archivos**: Migrado a `fileService` siguiendo estándar de usuarios
- **Error path undefined**: Agregados imports de `path` y `fs` en backend de avatars
- **Constraint de base de datos**: Creado script para cambiar validación de nivel único a nivel+genero único
- **Menú contextual**: Corregido error de `anchorEl` y flujo de datos en acciones del menú

### 🎨 Mejoras de UI/UX

- **Espaciado del formulario**: Aumentado margen superior del campo nombre (mt: 2)
- **Título del módulo**: Corregido formato para seguir patrón de otros módulos (Typography h4)
- **Menú de opciones**: Simplificado a solo 3 acciones (Ver Detalle, Editar Avatar, Eliminar Avatar)
- **Imports limpiados**: Eliminados iconos no utilizados (SchoolIcon, PrintIcon)

### 🐞 Bugs Corregidos

- **Error 400 en creación**: Solucionado problema de validación de nivel único
- **Error 500 en actualización**: Corregido problema de path undefined
- **Menú contextual abierto**: Solucionado problema de menú que se quedaba abierto
- **Demora en formularios**: Corregido problema de doble click para abrir formularios
- **Datos vacíos al editar**: Solucionado problema de datos que no se cargaban

### 📊 Base de Datos

- **Script de migración**: `fix_avatars_unique_constraint.sql` para corregir constraint
- **Validación actualizada**: Permite mismo nivel con diferente género
- **Datos existentes**: Mantiene compatibilidad con avatars preexistentes

### 🎯 Estado Final

- ✅ **CRUD completo** funcionando correctamente
- ✅ **Subida de imágenes** con fileService
- ✅ **Validaciones** de nivel + género único
- ✅ **Menú contextual** sin errores
- ✅ **Formularios** se abren al primer click con datos correctos
- ✅ **Título** con formato estándar del sistema
- ✅ **Base de datos** con constraints correctas

---

## [2025-09-16] - Gestión de Permisos, Nuevos Roles, Accesibilidad e Impresión QR

### ✨ Nuevas Funcionalidades

- **Gestionar Permisos (Usuarios)**: Modal dedicado para actualizar únicamente Rol y Contraseña.
- **Contraseña Opcional**: Si se deja en blanco, se mantiene la actual; validación solo cuando se ingresa.
- **Modal de Impresión QR (Usuarios)**: Carné 5.5cm x 8.5cm con foto, datos y QR centrado.
- **Captura de Pantalla**: `html2canvas` para exportar la vista del modal como imagen (impresión/PDF fiel).
  - QR con tamaño controlado en cm (p.ej., 3.3cm) y centrado vertical/horizontal.
  - Ajustes finos de espaciado para equilibrar blancos (altura de área 3.6cm).

### 🔧 Mejoras Técnicas

- **Ruta Backend**: Agregada `PUT /api/usuarios/:id/permisos` (solo Administrador) para actualizar rol y/o contraseña con hashing.
- **Validación de Roles**: Alineada con frontend; respuesta 400 para rol inválido.
- **Servicio Frontend**: `updateUserPermissions(id, data)` en `apiService.js`.
- **Componente UsuarioQRPrint**: Layout en cm; botones Imprimir y Guardar PDF; mejora de accesibilidad.
- **Integración Menú Opciones**: Opción "Imprimir Código QR" en menú de acciones de usuarios.
- **Librería html2canvas**: Instalada para capturar la ventana del modal como imagen de alta resolución.

### 🗄️ Base de Datos

- **Constraint CHECK de Roles**: Actualizada restricción `usuarios_rol_check` para permitir nuevos roles.
- **Migración**: `backend/migrations/update_usuarios_rol_check_2025_09_16.sql`.

### 👥 Roles

- Agregados: `Psicologia`, `Secretaria`, `Director`, `Promotor`.
- Integrados en: filtro de grilla de Usuarios, formulario de permisos, chips de color en lista y vista de detalle.

### ♿ Accesibilidad y UX

- **Labels e IDs**: Asociados `InputLabel`↔`Select` y añadidos `id/name` en campos del formulario de permisos y filtro por rol.
- **Corrección de Heading Nesting**: `Typography` dentro de `DialogTitle` usa `component="span"` para evitar warnings.

### 🐞 Correcciones

- **500 al actualizar permisos**: Simplificada construcción SQL y corrección de parámetros; logs detallados de depuración.
- **Lag al abrir "Gestionar Permisos"**: Ajuste del flujo de cierre del menú y memoización de handlers.

---

## [2025-01-12] - Formulario de Gestión de Permisos en Módulo de Usuarios

### ✨ Nuevas Funcionalidades

- **Formulario de Permisos**: Implementado formulario dedicado para gestionar contraseña y rol de usuarios
- **Menú de Opciones**: Agregada opción "Gestionar Permisos" en menú desplegable de usuarios
- **Actualización Segura**: Formulario específico que solo actualiza contraseña y rol sin afectar otros datos

### 🔧 Mejoras Técnicas

- **Componente UsuarioPermisosForm**: Formulario independiente para gestión de permisos
- **Validaciones Específicas**: Validación de contraseña (mínimo 6 caracteres) y confirmación
- **Seguridad**: Campos de contraseña con visibilidad toggleable
- **Integración**: Formulario integrado con menú de opciones existente

### 🎨 Mejoras de UI/UX

- **Diseño Profesional**: Modal con header informativo mostrando datos del usuario
- **Campos Específicos**: Solo rol y contraseña, interfaz limpia y enfocada
- **Validación Visual**: Errores claros y mensajes de ayuda informativos
- **Experiencia Optimizada**: Formulario independiente que no interfiere con edición general

### 📊 Base de Datos

- **Sin cambios en BD**: Utiliza estructura existente de tabla usuarios
- **Actualización Selectiva**: Solo actualiza campos `clave` y `rol`
- **Integridad**: Mantiene todos los demás datos del usuario intactos

---

## [2025-01-12] - Mejoras en Módulo de Configuración: Menú de Opciones y Formato Estándar

### ✨ Nuevas Funcionalidades

- **Menú de Opciones en Configuración**: Implementado menú desplegable en las 3 grillas (Años Escolares, Niveles, Turnos)
- **Formato Estándar de Grillas**: Establecido patrón de diseño uniforme para todas las grillas del sistema
- **Menús Contextuales**: Opciones específicas para cada tipo de elemento (anio, nivel, turno)
- **Integración con Funciones Existentes**: Reutilización de funciones ya implementadas a través del menú

### 🔧 Mejoras Técnicas

- **Botón Opciones Unificado**: Reemplazados múltiples iconos por botón "Opciones" con menú desplegable
- **Gestión de Estados**: Estados `anchorEl`, `selectedItem`, `menuType` para control del menú
- **Funciones de Manejo**: `handleMenuOpen`, `handleMenuClose`, `handleMenuAction` para gestión del menú
- **Código Optimizado**: Eliminación de funciones no utilizadas y imports innecesarios

### 🎨 Mejoras de UI/UX

- **Colores Estándar Aplicados**:
  - Cabecera: Fondo `#61a7d1` con texto blanco y negrita
  - Filas alternadas: Blanco y `#e7f1f8` (azul claro)
  - Hover: `#ffe6d9 !important` (naranja suave con prioridad)
- **Menús Específicos por Grilla**:
  - **Años Escolares**: Establecer Actual, Activar/Desactivar, Eliminar
  - **Niveles**: Editar Nivel, Eliminar Nivel
  - **Turnos**: Editar Turno, Eliminar Turno
- **Diseño Profesional**: Menús con iconos temáticos, sombras y colores contextuales

### 📋 Formato Estándar para Futuras Grillas

- **Patrón de Diseño Establecido**: Todas las grillas futuras seguirán este formato
- **Estructura de Menú**: Botón "Opciones" con menú desplegable contextual
- **Colores Unificados**: Esquema de colores estándar para cabecera, filas y hover
- **Funcionalidad Modular**: Preparado para agregar nuevas opciones según necesidades

### 📊 Base de Datos

- **Sin cambios en BD**: Utiliza estructura existente de tablas
- **Funciones Existentes**: Aprovecha funcionalidades ya implementadas
- **Integración Completa**: Menús conectados con lógica de negocio existente

---

## [2025-01-12] - Mejoras en Módulo de Usuarios: Menú de Opciones y Filtros

### ✨ Nuevas Funcionalidades

- **Menú de Opciones en Usuarios**: Implementado menú desplegable con opciones (Ver, Editar, QR, Permisos, Eliminar)
- **Filtro por Rol**: Agregado filtro desplegable para filtrar usuarios por tipo de rol
- **Eliminación de Columna Estado**: Removida columna Estado de la grilla de usuarios
- **Diseño de Grilla Mejorado**: Implementado patrón de filas alternadas y colores personalizados

### 🔧 Mejoras Técnicas

- **Botón Opciones**: Reemplazados múltiples iconos por botón "Opciones" con menú desplegable
- **Filtro Reactivo**: Filtro por rol integrado con búsqueda de texto y paginación
- **Estados de Filtro**: Agregado estado `roleFilter` para manejo de filtros
- **API Backend**: Integración con parámetro `rol` en consultas de usuarios
- **Validación de Roles**: Valores de filtro corregidos para coincidir con BD (Administrador, Docente, Alumno, Apoderado, Tutor)

### 🎨 Mejoras de UI/UX

- **Colores Personalizados**:
  - Cabecera: Fondo `#61a7d1` con texto blanco
  - Filas alternadas: Blanco y `#e7f1f8` (azul claro)
  - Hover: `#ffe6d9` (naranja suave)
- **Menú Profesional**: Diseño con iconos, colores temáticos y sombras
- **Layout Optimizado**: Búsqueda y filtro en la misma fila
- **Escalabilidad**: Preparado para futuras opciones del menú

### 📊 Base de Datos

- **Sin cambios en BD**: Utiliza estructura existente de tabla usuarios
- **Filtros Backend**: Aprovecha funcionalidad existente de filtrado por rol
- **Parámetros API**: Sincronización frontend-backend con parámetro `rol`

---

## [2025-01-12] - Mejoras en Módulo de Grados, Áreas y Usuarios

### ✨ Nuevas Funcionalidades

- **Campo Turno en Grados**: Agregado campo turno a la tabla grados y formularios
- **Script SQL de Migración**: Creado script para agregar columna turno con validaciones
- **Vista de Detalles Mejorada**: Mejorado formato de vista de detalles en módulo Áreas
- **Columna Alumnos en Grilla**: Reemplazada columna Estado por Alumnos en grilla de Grados
- **Código QR en Usuarios**: Agregado campo QR a usuarios con generación automática
- **Visualización QR como Imagen**: Implementada librería react-qr-code para mostrar QR escaneable

### 🔧 Mejoras Técnicas

- **Backend Grados**: Actualizadas consultas para incluir campo turno y variable cantidad_alumnos
- **Frontend Grados**: Mejorado formulario con campo turno y validaciones
- **Componente AreasView**: Creado componente dedicado para vista de detalles de áreas
- **Variable Alumnos**: Implementada variable cantidad_alumnos (valor 0) preparada para futuras matriculas
- **Backend Usuarios**: Agregado campo qr_code con generación automática en creación
- **Librería QR**: Instalada react-qr-code para renderizado de códigos QR como imagen
- **Vista Usuarios**: Optimizada visualización con QR pequeño al lado de foto del usuario
- **Corrección Grados**: Arreglado error 500 eliminando JOIN con tabla matriculas inexistente

### 📊 Base de Datos

- **Tabla Grados**: Agregada columna `turno VARCHAR(50)` con restricciones CHECK
- **Tabla Usuarios**: Agregada columna `qr_code VARCHAR(255)` con restricción UNIQUE
- **Índices**: Creados índices para optimizar consultas por turno y QR
- **Validaciones**: Agregadas restricciones para valores válidos de turno (Mañana, Tarde, Noche)
- **Generación QR**: Códigos QR únicos con formato `USR-{id}-{dni}` (formato optimizado)

### 🎨 Mejoras de UI/UX

- **Formulario Grados**: Campo turno con combobox poblado desde tabla turnos
- **Vista Áreas**: Formato profesional con cards, iconos y información organizada
- **Grilla Grados**: Columna Alumnos con formato destacado y variable preparada para matriculación
- **Vista Usuarios**: QR pequeño (60x60px) al lado de foto del usuario en header
- **Formulario Usuarios**: Campo QR de solo lectura en modo edición
- **Diseño Optimizado**: Eliminadas cards redundantes para mejor flujo visual
- **Estabilidad**: Corregido error 500 en módulo de grados para funcionamiento estable

---

## [2025-01-12] - Corrección del Formulario de Edición de Grados

### 🐛 Correcciones

- **Formulario de Edición**: Corregido problema donde no se mostraban los datos del grado al editar
- **Carga de Opciones**: Arreglado orden de carga para que las opciones de selects se carguen antes que los datos del grado
- **URLs de Imágenes**: Corregido problema de carga de imágenes usando `getImageUrl()` de `imageUtils.js`
- **Combobox Mejorado**: Mejorada visualización del combobox de grados con iconos y mejor formato
- **Logs de Debug**: Agregados logs para facilitar el debugging del formulario

### 🔧 Mejoras Técnicas

- **Separación de Lógica**: Separada la carga de datos iniciales de la carga de datos específicos del grado
- **Patrón de Imágenes**: Mantenido el patrón correcto usando `imageUtils.js` en lugar de construir URLs manualmente
- **Gestión de Estados**: Mejorada la gestión de estados para evitar conflictos entre formularios nuevos y de edición

### 📊 Base de Datos

- **Sin cambios en la estructura**: Los cambios son solo en el frontend para mejorar la experiencia de usuario

---

## [2024-09-04] - Migración a Sistema de Un Solo Colegio y Temas Dinámicos

### ✅ **MIGRACIÓN COMPLETA A SISTEMA DE UN SOLO COLEGIO**

**Fecha:** 04/09/2024
**Cambio:** Migración completa del sistema multi-colegio a un sistema de un solo colegio

#### **Archivos Eliminados:**

- `frontend/src/components/Layout/SuperAdminLayout.js`
- `frontend/src/components/Sidebar/SuperAdminSidebar.js`
- `frontend/src/pages/SuperAdmin/SuperAdminDashboard.js`
- `frontend/src/pages/SuperAdmin/GestionColegios.js`
- `frontend/src/pages/SuperAdmin/GestionUsuarios.js`
- `frontend/src/pages/SuperAdmin/ConfiguracionSistema.js`
- `frontend/src/pages/Mantenimientos/Colegios/ColegiosList.js`
- `frontend/src/pages/Mantenimientos/Colegios/ColegioForm.js`
- `frontend/src/pages/Mantenimientos/Colegios/ColegioView.js`
- `backend/routes/colegios.js`
- `backend/migrations/remove_colegios_table.sql`

#### **Archivos Modificados:**

- `frontend/src/App.js` - Eliminada lógica de Superadministrador y agregado ConfiguracionProvider
- `frontend/src/services/apiService.js` - Eliminado `colegioService`, agregado `configuracionService`
- `backend/routes/configuracion.js` - Nuevo sistema de configuración del colegio
- `backend/migrations/create_configuracion_table.sql` - Nueva tabla de configuración

### ✨ **Nuevas Funcionalidades**

#### **Sistema de Configuración del Colegio:**

- **Módulo de Configuración:** Gestión completa de datos del colegio único
- **Contexto Global:** `ConfiguracionContext` para manejo de datos del colegio
- **URLs de Imágenes:** Sistema unificado para construcción de URLs de imágenes
- **Actualización en Tiempo Real:** Cambios se reflejan inmediatamente

#### **Temas Dinámicos:**

- **Contexto de Tema:** `ThemeContext.js` para generación dinámica de tema Material-UI
- **Colores Personalizables:** Basados en `colegio.color_primario` y `colegio.color_secundario`
- **Aplicación Automática:** Login y dashboard con colores personalizables
- **Actualización Inmediata:** Cambios se reflejan sin reiniciar

#### **Sistema de Fondos Personalizables:**

- **Tipo de Fondo:** Color o imagen configurable
- **Preview Inmediato:** Vista previa de imagen antes de guardar
- **Validación:** Tipos de archivo permitidos (jpg, png, gif)
- **Aplicación:** Solo en página de login

#### **Sidebar Personalizado:**

- **Información del Usuario:** Nombre y foto del usuario logueado
- **Avatar Mejorado:** 120x120px (100% más grande que original)
- **Manejo de Errores:** Fallback a icono de usuario si no hay foto
- **URLs Corregidas:** Construcción correcta de URLs para fotos

#### **Barra de Título Mejorada:**

- **Iconos Agregados:** Notificaciones y cerrar sesión
- **Posición:** Lado derecho de la barra de título
- **Hover Effects:** Efectos de transparencia al pasar el mouse
- **Accesibilidad:** aria-label para cada icono

### 🔌 **API y Backend**

#### **Nueva Tabla `configuracion`:**

```sql
CREATE TABLE configuracion (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(50) DEFAULT 'text',
    categoria VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Rutas de Configuración:**

- `GET /api/configuracion` - Obtener todas las configuraciones
- `GET /api/configuracion/colegio` - Obtener datos del colegio (público)
- `GET /api/configuracion/colegio/publico` - Datos públicos sin autenticación
- `PUT /api/configuracion/colegio` - Actualizar datos del colegio
- `PUT /api/configuracion/:clave` - Actualizar configuración específica

### 🎨 **Frontend y UI**

#### **Nuevos Archivos:**

- `frontend/src/utils/imageUtils.js` - Utilidades para URLs de imágenes
- `frontend/src/contexts/ConfiguracionContext.js` - Contexto global de configuración
- `frontend/src/contexts/ThemeContext.js` - Contexto de tema dinámico
- `frontend/src/pages/Configuracion/ConfiguracionList.js` - Módulo de configuración

#### **Patrones Establecidos:**

**Para URLs de Imágenes:**

```javascript
import { getColegioLogoUrl } from "../utils/imageUtils";
const logoUrl = getColegioLogoUrl(colegio.logo);
```

**Para Configuración del Colegio:**

```javascript
const { colegio, updateColegio } = useConfiguracion();
updateColegio({ nombre: "Nuevo Nombre", logo: "nuevo-logo.png" });
```

**Para Temas Dinámicos:**

```javascript
const { theme } = useTheme();
<ThemeProvider theme={theme}>{/* Componentes */}</ThemeProvider>;
```

### 📊 **Base de Datos**

#### **Datos Iniciales del Colegio:**

- `colegio_nombre` - Nombre del colegio
- `colegio_codigo` - Código único del colegio
- `colegio_direccion` - Dirección completa
- `colegio_telefono` - Teléfono de contacto
- `colegio_email` - Email de contacto
- `colegio_logo` - Archivo del logo
- `colegio_color_primario` - Color primario del tema
- `colegio_color_secundario` - Color secundario del tema
- `colegio_director` - Nombre del director
- `colegio_background_tipo` - Tipo de fondo (color/imagen)
- `colegio_background_color` - Color de fondo
- `colegio_background_imagen` - Imagen de fondo

### 🔄 **Lógica de Negocio**

- **Sistema de un solo colegio** completamente implementado
- **URLs de imágenes** funcionando correctamente
- **Configuración en tiempo real** implementada
- **Módulo de configuración** completamente funcional
- **Contexto global** para datos del colegio
- **Temas dinámicos** funcionando
- **Fondos personalizables** implementados
- **Sidebar personalizado** con información de usuario
- **Barra de título mejorada** con iconos

---

## [2025-09-11] - Rediseño Radical del Módulo de Grados

### ✨ Nuevas Características

- **Estructura Completamente Rediseñada**: Sistema de grados basado en niveles educativos
- **Selección Inteligente**: Nivel → Grados disponibles según configuración de niveles
- **Formato Dinámico de Nombres**:
  - Si `tipo_grados = "Años"`: "03 años", "04 años", "05 años"
  - Si `tipo_grados = "Grados"`: "1° grado", "2° grado", "3° grado"
- **Sistema de Secciones**: Unica, A, B, C, D, E, F (array fijo reutilizable)
- **Año Escolar Integrado**: Selección con prioridad al año actual
- **Campos Adicionales**: Dirección de archivos y link de aula virtual
- **Código Automático**: Generación basada en nivel, grado y sección

### 🔌 API y Backend

- **Nuevas Rutas**: `backend/routes/grados.js` completamente actualizado:
  - `GET /api/grados/niveles/disponibles` (niveles activos)
  - `GET /api/grados/grados-por-nivel/:nivel_id` (opciones de grados)
  - `GET /api/grados/secciones/disponibles` (secciones disponibles)
  - `GET /api/grados/anios-escolares` (años escolares)
- **Utilidades**: `backend/utils/gradosGenerator.js` y `backend/utils/secciones.js`
- **Validaciones Mejoradas**: Verificación de rangos de grados según nivel
- **Migración**: `modify_grados_table_structure.sql` para nuevos campos

### 🎨 Frontend y UI

- **Formulario Rediseñado**: `GradosFormNew.js` con flujo paso a paso
- **Selección Cascada**: Nivel → Grados disponibles dinámicamente
- **Interfaz Intuitiva**: Iconos, chips de colores y validaciones en tiempo real
- **Tabla Actualizada**: Nuevas columnas (Sección, Año, Nivel)
- **Vista Previa de Imagen**: Avatar con iniciales del grado
- **Campos Opcionales**: Dirección de archivos y aula virtual

### 📊 Base de Datos

- **Nuevos Campos en `grados`**:
  - `seccion` (VARCHAR): Unica, A, B, C, D, E, F
  - `direccion_archivos` (TEXT): Ruta de archivos del grado
  - `link_aula_virtual` (TEXT): URL del aula virtual
  - `nivel_id` (INTEGER): Relación con tabla niveles
  - `anio_escolar` (INTEGER): Año escolar del grado
- **Tabla de Referencia**: `secciones_disponibles` para reutilización
- **Índices Optimizados**: Para consultas por nivel, año y sección
- **Relaciones**: Foreign keys con niveles y años escolares

### 🔄 Lógica de Negocio

- **Generación Automática**: Nombres y códigos basados en configuración de niveles
- **Validación de Rangos**: Verificación de grados dentro del rango permitido
- **Prevención de Duplicados**: Validación por nivel, grado, sección y año
- **Formato Consistente**: Nombres formateados según tipo de grados del nivel

---

## [2025-09-11] - Implementación del Módulo de Turnos Escolares

### ✨ Nuevas Características

- **Módulo de Turnos Escolares**: CRUD completo para gestionar turnos del colegio
- **3 Turnos Predefinidos**: Mañana (M), Tarde (T), Noche (N)
- **Búsqueda y filtros**: Soporte de parámetros `search`, `activo`, `page`, `limit`
- **Abreviaturas únicas**: Sistema de códigos cortos para identificación rápida
- **Estados configurables**: Activo/Inactivo con chips de colores

### 🔌 API y Backend

- **Rutas**: `backend/routes/turnos.js` con endpoints protegidos por token:
  - `GET /api/turnos` (listado con filtros y paginación)
  - `GET /api/turnos/:id` (detalle)
  - `POST /api/turnos` (crear)
  - `PUT /api/turnos/:id` (actualizar)
  - `DELETE /api/turnos/:id` (eliminar)
- **Validaciones**: Nombres y abreviaturas únicos, campos requeridos
- **Migración**: `create_turnos_table_postgresql.sql` para crear tabla
- **Script**: `run-migration-turnos.js` para ejecutar migración

### 🎨 Frontend y UI

- **Integración**: Sección completa en módulo de Configuración
- **Formulario**: Nombre del turno y abreviatura (máximo 10 caracteres)
- **Tabla profesional**: Búsqueda, paginación y acciones (editar/eliminar)
- **Chips de colores**: Estado activo (verde) e inactivo (rojo), abreviatura (azul)
- **Notificaciones**: SweetAlert2 para confirmaciones y mensajes
- **Diseño consistente**: Sigue el patrón de Años Escolares

### 📊 Base de Datos

- **Tabla**: `turnos` con campos `id`, `nombre`, `abreviatura`, `activo`, `created_at`, `updated_at`
- **Índices**: Optimización para búsquedas por nombre, abreviatura y estado
- **Restricciones**: Unicidad en nombre y abreviatura
- **Trigger**: Actualización automática de `updated_at`
- **Datos iniciales**: Mañana (M), Tarde (T), Noche (N)

---

## [2025-09-11] - Mejora del Módulo de Niveles con Configuración Avanzada

### ✨ Nuevas Características

- **Configuración Avanzada de Niveles**: Sistema completo de configuración para niveles educativos
- **Tipos de Grados**: Configuración entre "Grados" o "Años" para cada nivel
- **Rango de Grados**: Configuración de grado mínimo y máximo (0-10)
- **Sistema de Calificaciones Dual**: Soporte para calificaciones cualitativas (A, B, C, D) y cuantitativas (0-20)
- **Calificación Final**: Opciones "Promedio" o "Porcentaje" para ambos tipos
- **Notas Configurables**: Nota mínima, máxima y aprobatoria personalizables por nivel
- **Formulario Optimizado**: Todos los campos en líneas compactas para mejor UX

### 🔌 API y Backend

- **Campos Extendidos**: Agregados 8 nuevos campos a la tabla `niveles`:
  - `tipo_grados` (VARCHAR): "Grados" o "Años"
  - `grado_minimo` (INTEGER): Rango 0-10
  - `grado_maximo` (INTEGER): Rango 0-10
  - `tipo_calificacion` (VARCHAR): "Cualitativa" o "Cuantitativa"
  - `calificacion_final` (VARCHAR): "Promedio" o "Porcentaje"
  - `nota_minima` (VARCHAR): A-D o 0-20
  - `nota_maxima` (VARCHAR): A-D o 0-20
  - `nota_aprobatoria` (VARCHAR): A-D o 0-20
- **Endpoints Actualizados**: Todos los endpoints incluyen los nuevos campos
- **Validaciones**: Valores por defecto y restricciones apropiadas

### 🎨 Frontend y UI

- **Formulario Reorganizado**:
  - Primera línea: Nombre, Código, Orden (sm=4 cada uno)
  - Segunda línea: Descripción (ancho completo)
  - Tercera línea: Configuración de Grados (Tipo Grados, Grado Mín/Máx)
  - Cuarta línea: Configuración de Calificaciones (5 campos en sm=2.4)
- **Comboboxes Inteligentes**:
  - Opciones A, B, C, D para calificaciones cualitativas
  - Opciones 0-20 para calificaciones cuantitativas
  - Reset automático de valores al cambiar tipo
- **Grilla Actualizada**:
  - Removida columna "Código"
  - Agregada columna "Calificación Final"
  - Chips de colores para Tipo Grados y Tipo Calificación
- **Accesibilidad**: Atributos `id`, `name`, `labelId`, `htmlFor` en todos los campos

### 📊 Base de Datos

- **Migración**: Script SQL para agregar nuevos campos a tabla existente
- **Configuración por Defecto**:
  - **Inicial**: Cualitativa, Promedio, D-A-B (A, B, C, D)
  - **Primaria**: Cuantitativa, Porcentaje, 0-20-11 (0-20)
  - **Secundaria**: Cuantitativa, Porcentaje, 0-20-11 (0-20)
- **Índices**: Optimización para búsquedas por tipo de calificación
- **Compatibilidad**: Campos VARCHAR para soportar tanto letras como números

---

## [2025-09-11] - Mejora del Módulo de Grados con Campo Foto

### ✨ Nuevas Características

- **Campo Foto en Grados**: Agregado campo `foto` a la tabla `grados` con imagen por defecto
- **Gestión de Imágenes**: Formulario de grados con selector de foto y preview
- **Visualización Mejorada**: Avatar circular en lista, formulario y vista de grados
- **Imagen por Defecto**: `default-grado.png` para grados sin foto personalizada

### 🔌 API y Backend

- **Campo Foto**: Agregado a todas las consultas de grados (GET, POST, PUT)
- **Valor por Defecto**: `default-grado.png` para nuevos grados
- **Migración**: `add_foto_to_grados.sql` para actualizar tabla existente
- **Índice**: Optimizado para búsquedas por campo foto

### 🎨 Frontend y UI

- **Formulario**: Selector de foto con preview y botón "Cambiar Foto"
- **Lista**: Columna de foto con Avatar circular (50x50px)
- **Vista**: Avatar en header del diálogo de detalles (60x60px)
- **Patrón Consistente**: Mismo estilo que módulo de usuarios

### 📊 Base de Datos

- **Campo**: `foto VARCHAR(255) DEFAULT 'default-grado.png'`
- **Índice**: `idx_grados_foto` para optimización
- **Actualización**: Grados existentes con imagen por defecto

---

## [2025-09-11] - Implementación del Módulo de Áreas Educativas

### ✨ Nuevas Características

- **Módulo de Áreas Educativas**: CRUD completo para gestionar áreas curriculares del sistema educativo
- **12 Áreas Predefinidas**: Comunicación, Ciencia y Tecnología, Arte y Cultura, Computación, Ciencias Sociales, Formación en Valores, Educación Física, Matemática, Personal Social, Psicomotricidad, Inglés, Desarrollo Personal Ciudadanía y Cívica
- **Búsqueda y filtros**: Soporte de parámetros `search`, `estado`, `page`, `limit`
- **Códigos únicos**: Sistema de códigos cortos para identificación rápida (MAT, COM, ART, etc.)

### 🔌 API y Backend

- **Rutas**: `backend/routes/areas.js` con endpoints protegidos por token:
  - `GET /api/areas` (listado con filtros y paginación)
  - `GET /api/areas/:id` (detalle)
  - `POST /api/areas` (crear)
  - `PUT /api/areas/:id` (actualizar)
  - `DELETE /api/areas/:id` (eliminar)
- **Validaciones**: existencia de nombre/código, longitud de campos, estado válido
- **Base de datos**: Tabla `areas` con índices optimizados
- **Migración**: `create_areas_table.sql` con datos iniciales

### 🎨 Frontend y UI

- **Componentes**: `AreasList.js` y `AreasForm.js` siguiendo patrones establecidos
- **Funcionalidades**:
  - Lista con búsqueda en tiempo real y filtro por estado
  - Formulario modal para crear/editar/ver áreas
  - Chips para códigos y estados con colores distintivos
  - Paginación completa con controles personalizados
  - Validaciones en tiempo real
- **Navegación**: Ruta `/dashboard/areas` integrada en AdminLayout y AdminSidebar
- **Servicios**: `areasService` en `apiService.js` con métodos CRUD completos
- **Notificaciones**: Integración con SweetAlert2 para confirmaciones y alertas (alineado con patrón de Grados)
- **Modo Vista**: Corrección para mostrar datos del área seleccionada en diálogo de detalles

### 📊 Base de Datos

- **Tabla**: `areas` con campos: id, nombre, descripcion, codigo, estado, created_at, updated_at
- **Índices**: Optimizados para búsquedas por estado, código y nombre
- **Datos iniciales**: 12 áreas educativas predefinidas con códigos únicos
- **Restricciones**: UNIQUE en nombre y código, CHECK en estado

---

## [2025-09-11] - Implementación del Módulo de Grados Educativos

### ✨ Nuevas Características

- **Módulo de Grados Educativos**: CRUD completo para gestionar grados por nivel (Inicial, Primaria, Secundaria)
- **Integración con Niveles**: Filtros y visualización del nombre del nivel en listas y vistas
- **Búsqueda y paginación**: Soporte de parámetros `search`, `nivel_id`, `page`, `limit`

### 🔌 API y Backend

- **Rutas**: `backend/routes/grados.js` con endpoints protegidos por token:
  - `GET /api/grados` (listado con filtros y paginación)
  - `GET /api/grados/:id` (detalle)
  - `POST /api/grados` (crear)
  - `PUT /api/grados/:id` (actualizar)
  - `DELETE /api/grados/:id` (eliminar)
  - `GET /api/grados/nivel/:nivel_id` (por nivel, solo activos)
- **Validaciones**: existencia de `nivel_id`, unicidad de `codigo`, y verificación de entidades relacionadas
- **Autenticación**: middleware mínimo para requerir token en todas las rutas de grados

### 🗃️ Base de Datos

- **Tabla `grados`**: `backend/migrations/create_grados_table.sql` (id, nombre, descripcion, codigo, nivel_id, orden, activo, timestamps)
- **Índices**: sobre `nivel_id`, `activo`, `orden`, `codigo`, y compuesto (`nivel_id`, `orden`)
- **Datos iniciales**: grados pre-cargados para Inicial, Primaria y Secundaria

### 🖥️ Frontend

- **Listado**: `frontend/src/pages/Mantenimientos/Grados/GradosList.js` con header, búsqueda, filtro por nivel, tabla y paginación
- **Formulario**: `frontend/src/pages/Mantenimientos/Grados/GradosForm.js` con generación automática de `codigo` según nivel y `orden`, validaciones y estado activo
- **Vista**: `frontend/src/pages/Mantenimientos/Grados/GradosView.js` (lectura) integrada desde el listado
- **Servicio API**: `gradosService` en `frontend/src/services/apiService.js` con métodos `getGrados`, `getGrado`, `createGrado`, `updateGrado`, `deleteGrado`, `getGradosByNivel`

### 🎨 Diseño

- Chips de estado y códigos, iconografía y colores consistentes con los patrones visuales
- Filtro de nivel mediante `Select`, botón de limpieza de filtros y helper texts en formulario

---

## [2025-01-03] - Implementación de Niveles Educativos y Optimización de Configuración

### ✨ Nuevas Características

- **Módulo de Niveles Educativos**: CRUD completo para gestión de niveles educativos (Inicial, Primaria, Secundaria)
- **Base de datos de niveles**: Tabla `niveles` con campos id, nombre, descripción, código, orden, activo
- **API de niveles**: Rutas completas para CRUD de niveles (`/api/niveles`)
- **Formato de grilla/tabla**: Conversión de módulos de Configuración a formato de tabla profesional
- **Búsqueda y paginación**: Funcionalidades de búsqueda en tiempo real y paginación para ambos módulos
- **Ordenamiento inteligente**: Años escolares ordenados por año descendente (más reciente primero)

### 🎨 Mejoras de Diseño

- **Interfaz de tabla profesional**: Reemplazo de cards por tablas con header, búsqueda y paginación
- **Ahorro significativo de espacio**: Módulos más compactos y escalables
- **Diseño consistente**: Mismo patrón visual en todos los módulos de mantenimiento
- **Botones de acción optimizados**: Acciones (Editar/Eliminar) en cada fila de la tabla
- **Estados visuales mejorados**: Resaltado del año escolar actual con borde azul y fondo especial
- **Alertas contextuales**: Mensajes informativos movidos a sus secciones correspondientes

### 🔧 Cambios Técnicos

- **Backend**: Nuevas rutas para CRUD de niveles con validaciones completas
- **Frontend**: Servicio `nivelesService` para comunicación con la API
- **Estados de paginación**: Implementación de paginación independiente para cada módulo
- **Filtros de búsqueda**: Búsqueda en tiempo real por múltiples campos
- **Ordenamiento**: Algoritmo de ordenamiento por año descendente
- **Validaciones**: Campos requeridos y validaciones de duplicados en el backend

### 📊 Optimizaciones

- **Espacio vertical reducido**: De múltiples cards a tablas compactas
- **Escalabilidad mejorada**: Preparado para manejar muchos más registros
- **UX optimizada**: Navegación más eficiente con búsqueda y paginación
- **Mantenibilidad**: Código más limpio y reutilizable siguiendo patrones establecidos

### 🗃️ Base de Datos

- **Tabla `niveles`**: Estructura completa con índices optimizados
- **Datos iniciales**: 3 niveles educativos predefinidos (Inicial, Primaria, Secundaria)
- **Relaciones preparadas**: Estructura lista para relacionar con grados futuros

---

## [FUTURO] - Funcionalidades Avanzadas Planificadas

### 📱 PWA (Progressive Web App)

- **Conversión a PWA**: Transformar el sistema web en aplicación móvil instalable
- **Manifest.json**: Configuración para instalación en dispositivos móviles
- **Service Worker**: Funcionalidad offline y caché inteligente
- **Notificaciones Push**: Alertas de tareas, exámenes y eventos importantes
- **Íconos de App**: Diseño de iconografía para diferentes tamaños de pantalla
- **Funcionalidad Offline**: Acceso a datos guardados sin conexión a internet

### 🎮 Sistema de Gamificación y Juegos Interactivos

- **Mundos Virtuales**: Cada bimestre como "mundo" explorable estilo videojuego
- **Progresión Lineal**: Sistema de desbloqueo secuencial de contenido
- **Elementos Lúdicos**:
  - Sistema de puntos y XP por completar tareas
  - Badges y logros por hitos alcanzados
  - Avatares personalizables
  - Rankings y competencias entre estudiantes
- **Juegos Educativos**:
  - Quiz interactivos con animaciones
  - Juegos de memoria temática
  - Puzzles y rompecabezas educativos
  - Simuladores de laboratorio virtual
  - RPG educativo con aventuras de aprendizaje
- **Tecnologías a Implementar**:
  - Canvas API + JavaScript para juegos 2D
  - Three.js para mundos 3D
  - Phaser.js para juegos profesionales
  - Framer Motion para animaciones suaves
- **Integración con Sistema Actual**:
  - Base de datos existente para progreso de estudiantes
  - API REST para sincronización de logros
  - Sistema de notificaciones para logros desbloqueados

### 🎯 Objetivos de las Funcionalidades Futuras

1. **Experiencia Inmersiva**: Ocultar elementos de navegación tradicional para crear ambiente de videojuego
2. **Motivación del Estudiante**: Elementos visuales atractivos que incentiven el aprendizaje
3. **Progresión Visual**: Mostrar claramente el avance del estudiante
4. **Accesibilidad Móvil**: PWA para uso en dispositivos móviles
5. **Engagement**: Sistema de gamificación para mantener interés del estudiante
6. **Escalabilidad**: Arquitectura preparada para futuras expansiones

---

## [2025-01-03] - Mejoras de Diseño del Sidebar y Barra de Título

### ✨ Nuevas Características

- **Barra de título con color consistente**: La barra de título ahora usa el mismo color azul (#0165a1) que el sidebar para mantener consistencia visual
- **Iconos del menú mejorados**:
  - Colores más vibrantes y brillantes para mejor visibilidad
  - Efectos de sombra y profundidad para mayor contraste
  - Animaciones suaves al hacer hover (escala 1.1x)
  - Transiciones fluidas para mejor experiencia de usuario

### 🎨 Mejoras de Diseño

- **Paleta de colores actualizada**: Iconos con colores más saturados y vibrantes
- **Efectos visuales**: Sombras drop-shadow y text-shadow para mejor definición
- **Interactividad mejorada**: Efectos hover con escalado y sombras intensificadas
- **Consistencia visual**: Barra de título y sidebar con el mismo esquema de colores

### 🔧 Cambios Técnicos

- Actualizado `AdminLayout.js` con `backgroundColor: '#0165a1'` en AppBar
- Mejorada función `getIconColor()` en `AdminSidebar.js` con colores más vibrantes
- Agregados estilos CSS avanzados para efectos visuales en iconos
- Mantenida funcionalidad existente sin cambios en la lógica de negocio

---

## [2025-01-03] - Optimización del Módulo de Configuración

### ✨ Nuevas Características

- **Layout compacto**: Reducción significativa del espacio vertical ocupado por el módulo de Configuración
- **Logo dinámico**: Tamaño del logo se adapta según el modo (200% más grande en lectura, compacto en edición)
- **Layout de 2 columnas**: Secciones "Configuración de Colores" y "Configuración de Fondo" ahora están lado a lado
- **Vista previa mejorada**: Imagen de fondo con mejor posicionamiento y sin texto innecesario

### 🎨 Mejoras de Diseño

- **Espaciado optimizado**: Reducción de padding, márgenes y gaps para mayor eficiencia espacial
- **Componentes compactos**: TextFields, botones y elementos con `size="small"`
- **Títulos ajustados**: Jerarquía visual optimizada (h4→h5, h5→h6, h6→subtitle1)
- **Alturas equilibradas**: Ambos tabs de configuración con altura uniforme (minHeight: 200px)

### 🔧 Cambios Técnicos

- **ConfiguracionList.js**: Reorganización completa del layout con Grid system
- **Responsive design**: Layout adaptativo para móviles y desktop
- **Flexbox layout**: Uso de flex para centrado y distribución de contenido
- **Título específico**: "Configuración de Fondo del Login" para mayor claridad

---

## [FUTURO] - Sistema de Gamificación Educativa (Planificación)

### 🎮 Concepto de Gamificación

- **Experiencia inmersiva**: Ocultación de barra de menú para crear interfaz de videojuego
- **Mundos de aprendizaje**: Cada bimestre convertido en un "mundo" explorable
- **Progresión lineal**: Sistema de desbloqueo secuencial (no se puede avanzar sin completar el anterior)
- **Elementos lúdicos**: Retos, puntos, avatares, tareas como "misiones"

### 📚 Estructura Educativa Peruana

- **Niveles**: Inicial, Primaria, Secundaria
- **Bimestres**: 4 bimestres por año académico
- **Progresión**: Bimestre 1 → Bimestre 2 → Bimestre 3 → Bimestre 4

### 🗺️ Diseño de Interfaz

- **Mapas estilo videojuego**: Interfaz visual atractiva con elementos fantásticos
- **Navegación por mundos**: Cada bimestre como un "mundo" con temas, tareas y exámenes
- **Sistema de recompensas**: Puntos, avatares y logros por completar retos
- **Visualización de progreso**: Tracking visual del avance del estudiante

### 🛠️ Tecnologías Propuestas

- **Frontend**: React + Three.js o Canvas para mapas 3D/2D
- **Animaciones**: Framer Motion para transiciones suaves
- **Gamificación**: Sistema de puntos, logros, avatares
- **Base de datos**: Tracking de completitud y progresión

### 📋 Estructura de Implementación Futura

```
📚 CURSO (ej: Matemáticas)
├── 🌍 BIMESTRE 1 (Mundo 1) - Desbloqueado
│   ├── 📖 Tema 1 - Completado ✅
│   ├── 📖 Tema 2 - En progreso 🔄
│   ├── 🎯 Tarea 1 - Pendiente ⏳
│   ├── 📝 Examen 1 - Bloqueado 🔒
│   └── 🏆 Recompensa: Avatar + Puntos
├── 🌍 BIMESTRE 2 (Mundo 2) - Bloqueado 🔒
├── 🌍 BIMESTRE 3 (Mundo 3) - Bloqueado 🔒
└── 🌍 BIMESTRE 4 (Mundo 4) - Bloqueado 🔒
```

### 🎯 Objetivos de la Gamificación

- **Motivación**: Hacer el aprendizaje más atractivo y dinámico
- **Engagement**: Mantener el interés del estudiante a través de elementos lúdicos
- **Progresión clara**: Visualización del avance y logros
- **Inmersión**: Experiencia de aprendizaje similar a un videojuego educativo

---

## [2025-01-03] - Mejoras de Diseño del Sidebar y Barra de Título

### ✨ Nuevas Características

- **Barra de título con color consistente**: La barra de título ahora usa el mismo color azul (#0165a1) que el sidebar para mantener consistencia visual
- **Iconos del menú mejorados**:
  - Colores más vibrantes y brillantes para mejor visibilidad
  - Efectos de sombra y profundidad para mayor contraste
  - Animaciones suaves al hacer hover (escala 1.1x)
  - Transiciones fluidas para mejor experiencia de usuario

### 🎨 Mejoras de Diseño

- **Paleta de colores actualizada**: Iconos con colores más saturados y vibrantes
- **Efectos visuales**: Sombras drop-shadow y text-shadow para mejor definición
- **Interactividad mejorada**: Efectos hover con escalado y sombras intensificadas
- **Consistencia visual**: Barra de título y sidebar con el mismo esquema de colores

### 🔧 Cambios Técnicos

- Actualizado `AdminLayout.js` con `backgroundColor: '#0165a1'` en AppBar
- Mejorada función `getIconColor()` en `AdminSidebar.js` con colores más vibrantes
- Agregados estilos CSS avanzados para efectos visuales en iconos
- Mantenida funcionalidad existente sin cambios en la lógica de negocio

---

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
- rol (varchar: Administrador, Docente, Alumno, Apoderado, Tutor)

**IMPORTANTE:** El rol `Superadministrador` NO EXISTE. Los roles válidos empiezan desde `Administrador`.

## CAMBIO ARQUITECTÓNICO: ELIMINACIÓN DE SUPERADMINISTRADOR

**Fecha:** 03/09/2025
**Cambio:** Eliminación completa del rol `Superadministrador` del sistema

### Archivos Eliminados:

- `frontend/src/pages/SuperAdmin/SuperAdminDashboard.js`
- `frontend/src/pages/SuperAdmin/GestionColegios.js`
- `frontend/src/pages/SuperAdmin/GestionUsuarios.js`
- `frontend/src/pages/SuperAdmin/ConfiguracionSistema.js`
- `frontend/src/components/Layout/SuperAdminLayout.js`
- `frontend/src/components/Sidebar/SuperAdminSidebar.js`

### Archivos Modificados:

- `frontend/src/App.js` - Eliminada lógica de Superadministrador
- `frontend/src/services/apiService.js` - Eliminado `colegioService`
- `CHANGELOG.md` - Documentado el cambio

### Roles Válidos:

- **Administrador** (rol más alto del sistema)
- **Docente**
- **Alumno**
- **Apoderado**
- **Tutor**

**NOTA:** El sistema ahora es de un solo colegio, por lo que no se necesita Superadministrador para gestionar múltiples colegios.

- activo (boolean, activo/inactivo)
- created_at (timestamp)
- updated_at (timestamp)

## Tabla `colegios`

- id (serial, PK)
- nombre (varchar)
- codigo (varchar, único)
- logo (varchar, url o nombre de archivo)
- color_primario (varchar, hex color)
- color_secundario (varchar, hex color)
- direccion (varchar)
- telefono (varchar)
- email (varchar, único)
- director_nombre (varchar)
- activo (boolean, activo/inactivo)
- created_at (timestamp)
- updated_at (timestamp)

## Tabla `anios_escolares`

- id (serial, PK)
- anio (integer)
- colegio_id (integer, FK a colegios.id)
- activo (boolean, activo/inactivo)
- created_at (timestamp)
- updated_at (timestamp)

## Tabla `usuario_colegio` (Relación Muchos a Muchos)

- id (serial, PK)
- usuario_id (integer, FK a usuarios.id)
- colegio_id (integer, FK a colegios.id)
- rol_en_colegio (varchar: Administrador, Docente, Alumno, Apoderado, Tutor)
- activo (boolean, activo/inactivo)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE(usuario_id, colegio_id) -- Un usuario no puede tener el mismo rol en el mismo colegio

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

## [2024-12-19] - Módulo Mi Perfil y Nueva Estructura de Usuarios

### ✅ **MÓDULO MI PERFIL COMPLETAMENTE IMPLEMENTADO**

**Funcionalidad:** Sistema completo de gestión de perfil de usuario con campos adicionales y actualización en tiempo real

#### **🎯 Características Implementadas:**

##### **1. Nuevos Campos de Usuario:**

- **Apellidos** - Campo opcional para apellidos del usuario
- **Dirección** - Campo opcional para dirección completa
- **Género** - Selector con opciones: Masculino, Femenino, Otro
- **Estado Civil** - Selector con opciones: Soltero, Casado, Divorciado, Viudo, Conviviente
- **Profesión** - Campo opcional para profesión u ocupación

##### **2. Gestión de Perfil Completa:**

- **Edición de datos personales** con validaciones
- **Subida de foto** con preview inmediato
- **Cambio de contraseña** con validación de contraseña actual
- **Actualización en tiempo real** del sidebar sin re-login
- **Formulario responsivo** con diseño profesional

##### **3. Contexto Global de Usuario:**

- **UserContext** para manejo global de datos de usuario
- **Actualización automática** de la interfaz al cambiar datos
- **Sincronización** entre Mi Perfil y sidebar
- **Carga de datos frescos** desde el servidor

#### **🔧 Archivos Creados/Modificados:**

##### **Frontend:**

- `frontend/src/pages/MiPerfil.js` - Página principal del módulo
- `frontend/src/contexts/UserContext.js` - Contexto global de usuario
- `frontend/src/components/Layout/AdminLayout.js` - Agregado UserProvider
- `frontend/src/components/Sidebar/AdminSidebar.js` - Actualización de datos en tiempo real

##### **Backend:**

- `backend/routes/usuarios.js` - Agregados nuevos campos en CRUD
- `backend/migrations/add_user_profile_fields.sql` - Script de migración
- `backend/config/database.js` - Configuración de contraseña de BD

##### **Base de Datos:**

- **Nuevos campos en tabla `usuarios`:**
  - `apellidos` VARCHAR(100) - Apellidos del usuario
  - `direccion` TEXT - Dirección completa
  - `genero` VARCHAR(20) - Género del usuario
  - `estado_civil` VARCHAR(20) - Estado civil
  - `profesion` VARCHAR(100) - Profesión u ocupación

#### **📊 Funcionalidades del Módulo:**

##### **Gestión de Datos Personales:**

```javascript
const formData = {
  nombres: "",
  apellidos: "",
  dni: "",
  email: "",
  telefono: "",
  fecha_nacimiento: "",
  direccion: "",
  genero: "",
  estado_civil: "",
  profesion: "",
  foto: "",
};
```

##### **Subida de Foto:**

```javascript
const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validación de tipo y tamaño
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede ser mayor a 5MB");
      return;
    }

    // Preview inmediato
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);

    // Subida real del archivo
    const response = await fileService.uploadFile(file, "profile");
    if (response.success) {
      setFormData((prev) => ({ ...prev, foto: response.filename }));
      toast.success("Foto actualizada correctamente");
    }
  }
};
```

##### **Cambio de Contraseña:**

```javascript
const handlePasswordChange = async () => {
  if (!validatePasswordForm()) {
    toast.error("Por favor corrige los errores en el formulario");
    return;
  }

  const response = await userService.changePassword(userId, {
    currentPassword: currentPassword,
    newPassword: newPassword,
  });

  if (response.success) {
    toast.success("Contraseña actualizada correctamente");
    setShowPasswords(false);
  }
};
```

#### **🔄 Actualización en Tiempo Real:**

##### **UserContext:**

```javascript
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("usuario", JSON.stringify(updatedUser));
  };

  const loadUserData = async () => {
    const userId = getUserId();
    if (userId) {
      const response = await userService.getUserById(userId);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem("usuario", JSON.stringify(response.user));
      }
    }
  };

  // Siempre cargar datos frescos del servidor
  useEffect(() => {
    loadUserData();
  }, []);
};
```

##### **Sidebar Actualizado:**

```javascript
const { user } = useUser();

// Mostrar nombre completo
<Typography variant="h6">
  {user?.nombres && user?.apellidos
    ? `${user.nombres} ${user.apellidos}`
    : user?.nombres || "Administrador"}
</Typography>;
```

#### **🗄️ Estructura de Base de Datos Actualizada:**

##### **Tabla `usuarios` (Nueva Estructura):**

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(100),                    -- NUEVO
    dni VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    direccion TEXT,                            -- NUEVO
    genero VARCHAR(20) CHECK (genero IN ('Masculino', 'Femenino', 'Otro')), -- NUEVO
    estado_civil VARCHAR(20) CHECK (estado_civil IN ('Soltero', 'Casado', 'Divorciado', 'Viudo', 'Conviviente')), -- NUEVO
    profesion VARCHAR(100),                    -- NUEVO
    clave VARCHAR(255) NOT NULL,
    foto VARCHAR(500),
    activo BOOLEAN DEFAULT true,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Administrador', 'Docente', 'Alumno', 'Apoderado', 'Tutor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

##### **Índices Creados:**

```sql
CREATE INDEX idx_usuarios_apellidos ON usuarios(apellidos);
CREATE INDEX idx_usuarios_genero ON usuarios(genero);
CREATE INDEX idx_usuarios_profesion ON usuarios(profesion);
```

#### **🔧 Backend - CRUD Actualizado:**

##### **GET /api/usuarios/:id:**

```javascript
const result = await query(
  `SELECT id, nombres, apellidos, dni, email, telefono, fecha_nacimiento,
          direccion, genero, estado_civil, profesion, foto, rol, activo,
          created_at, updated_at
   FROM usuarios WHERE id = $1`,
  [id]
);
```

##### **PUT /api/usuarios/:id:**

```javascript
const result = await query(
  `UPDATE usuarios
   SET nombres = COALESCE($1, nombres),
       apellidos = COALESCE($2, apellidos),
       email = COALESCE($3, email),
       telefono = COALESCE($4, telefono),
       fecha_nacimiento = COALESCE($5, fecha_nacimiento),
       direccion = COALESCE($6, direccion),
       genero = COALESCE($7, genero),
       estado_civil = COALESCE($8, estado_civil),
       profesion = COALESCE($9, profesion),
       foto = COALESCE($10, foto),
       updated_at = NOW()
   WHERE id = $11
   RETURNING id, nombres, apellidos, dni, email, telefono, fecha_nacimiento,
             direccion, genero, estado_civil, profesion, foto, rol, activo,
             created_at, updated_at`,
  [
    nombres,
    apellidos,
    email,
    telefono,
    fecha_nacimiento,
    direccion,
    genero,
    estado_civil,
    profesion,
    foto,
    id,
  ]
);
```

#### **✅ Estado Final:**

- ✅ **Módulo Mi Perfil** completamente funcional
- ✅ **Nuevos campos** agregados a la base de datos
- ✅ **Actualización en tiempo real** implementada
- ✅ **Contexto global** para datos de usuario
- ✅ **Validaciones** completas en frontend y backend
- ✅ **Subida de fotos** funcionando correctamente
- ✅ **Cambio de contraseña** implementado
- ✅ **Diseño responsivo** y profesional
- ✅ **Sincronización** entre componentes

#### **📚 Documentación Actualizada:**

- **PATRON_CRUD.md** - Agregada sección de Mi Perfil
- **PATRON_DISENO_VISUAL.md** - Agregada sección de Mi Perfil
- **CHANGELOG.md** - Documentación completa de cambios

---

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
- ✅ **Sistema completamente implementado:** Frontend, Backend y Base de datos funcionando

---

## [2024-12-19] - Sistema Multi-Colegio Completamente Implementado

### Estado del Proyecto: ✅ COMPLETADO

**Proyecto:** `sistema-educativo-multicolegio` - Sistema educativo multi-tenant completamente funcional
**Rama actual:** `primera-version` (nueva rama de desarrollo)
**Último commit:** Sistema completamente implementado y funcional

### ✅ Implementación Completa del Sistema

#### **1. Estructura del Proyecto Creada**

- ✅ **Frontend:** React 18 + Material-UI 5 + React Router 6
- ✅ **Backend:** Node.js + Express + PostgreSQL
- ✅ **Base de datos:** PostgreSQL con 3 tablas básicas implementadas
- ✅ **Autenticación:** JWT con roles (Superadministrador, Administrador, Docente, Alumno, Apoderado, Tutor)
- ✅ **Multi-tenancy:** Sistema de colegios independientes

#### **2. Base de Datos Implementada**

##### **Tablas Creadas:**

- ✅ `usuarios` - Sistema de usuarios con roles
- ✅ `colegios` - Gestión multi-tenant de colegios
- ✅ `anios_escolares` - Años escolares por colegio

##### **Datos de Ejemplo:**

- ✅ Usuario administrador: DNI `11111111`, clave `waltito10`
- ✅ Colegio: "Vanguard Schools - Sede SMP"
- ✅ Año escolar 2025 activo

#### **3. Backend Completamente Funcional**

##### **Servidor Express:**

- ✅ Middleware de seguridad (helmet, cors, rate limiting)
- ✅ Autenticación JWT
- ✅ Conexión a PostgreSQL
- ✅ Rutas de autenticación
- ✅ Rutas de colegios (CRUD completo)

##### **Archivos Implementados:**

- ✅ `backend/server.js` - Servidor principal
- ✅ `backend/config/database.js` - Configuración de BD
- ✅ `backend/middleware/auth.js` - Middleware de autenticación
- ✅ `backend/routes/auth.js` - Rutas de login/logout
- ✅ `backend/routes/colegios.js` - Gestión de colegios

#### **4. Frontend Completamente Funcional**

##### **React App:**

- ✅ Material-UI 5 con tema personalizado
- ✅ React Router 6 con rutas protegidas
- ✅ Sistema de autenticación completo
- ✅ Layouts responsivos para todos los roles
- ✅ Dashboards personalizados

##### **Páginas Implementadas:**

- ✅ `Login.js` - Página de login con datos dinámicos del colegio
- ✅ `AdminDashboard.js` - Dashboard del administrador
- ✅ `SuperAdminDashboard.js` - Dashboard del superadministrador
- ✅ `DocenteDashboard.js` - Dashboard del docente
- ✅ `AlumnoDashboard.js` - Dashboard del alumno
- ✅ `ApoderadoDashboard.js` - Dashboard del apoderado
- ✅ `MiPerfil.js` - Gestión de perfil de usuario

##### **Componentes Implementados:**

- ✅ `AdminLayout.js` - Layout responsivo para administradores
- ✅ `AdminSidebar.js` - Sidebar con datos dinámicos del colegio
- ✅ `SuperAdminLayout.js` - Layout para superadministradores
- ✅ `DocenteLayout.js` - Layout para docentes
- ✅ `AlumnoLayout.js` - Layout para alumnos
- ✅ `ApoderadoLayout.js` - Layout para apoderados

#### **5. Servicios y Utilidades**

##### **Servicios Frontend:**

- ✅ `authService.js` - Gestión de autenticación y tokens
- ✅ `apiService.js` - Cliente HTTP con interceptores JWT

##### **Configuración:**

- ✅ `package.json` - Dependencias y scripts
- ✅ `.gitignore` - Exclusión de archivos
- ✅ `README.md` - Documentación completa
- ✅ Scripts de instalación (`install.sh`, `install.bat`)

#### **6. Funcionalidades Implementadas**

##### **Sistema de Autenticación:**

- ✅ Login por DNI y contraseña
- ✅ Tokens JWT con expiración
- ✅ Roles y permisos
- ✅ Logout seguro
- ✅ Protección de rutas

##### **Multi-Tenancy:**

- ✅ Datos dinámicos del colegio en login
- ✅ Logo y nombre del colegio en sidebar
- ✅ Colores personalizables por colegio
- ✅ Gestión independiente por colegio

##### **UI/UX Responsivo:**

- ✅ Diseño adaptativo para móviles, tablets y desktop
- ✅ Sidebar colapsible
- ✅ Navegación intuitiva
- ✅ Tema Material-UI personalizado

#### **7. Correcciones y Optimizaciones Realizadas**

##### **Errores Corregidos:**

- ✅ Warnings de React Router (future flags)
- ✅ Errores de ESLint (variables no utilizadas)
- ✅ Problemas de autenticación (hash de contraseñas)
- ✅ Errores de importación (Typography)
- ✅ Problemas de layout (espaciado y responsividad)
- ✅ 404 errors (logos faltantes)

##### **Mejoras de UX:**

- ✅ Login con datos dinámicos del colegio
- ✅ Sidebar con información actualizada
- ✅ Dashboard con estadísticas reales
- ✅ Navegación fluida entre roles
- ✅ Diseño responsivo optimizado

#### **8. Control de Versiones**

##### **Git Configurado:**

- ✅ Repositorio inicializado
- ✅ Primer commit realizado
- ✅ Rama `primera-version` creada
- ✅ Archivos de configuración incluidos

#### **9. Documentación Completa**

##### **Archivos de Documentación:**

- ✅ `README.md` - Guía completa de instalación y uso
- ✅ `CHANGELOG.md` - Historial detallado de cambios
- ✅ `backend/env.example` - Variables de entorno de ejemplo
- ✅ Scripts de instalación automatizada

#### **10. Estado Final del Sistema**

##### **✅ Completamente Funcional:**

- ✅ Backend ejecutándose en puerto 5000
- ✅ Frontend ejecutándose en puerto 3000
- ✅ Base de datos PostgreSQL conectada
- ✅ Autenticación funcionando
- ✅ Multi-tenancy implementado
- ✅ UI responsivo funcionando
- ✅ Todos los roles con dashboards

##### **✅ Listo para Producción:**

- ✅ Código limpio y documentado
- ✅ Errores corregidos
- ✅ Optimizaciones implementadas
- ✅ Control de versiones configurado
- ✅ Scripts de instalación automatizada

### Próximos Pasos Sugeridos

1. **Desarrollo de Módulos Específicos:**

   - Gestión de usuarios por colegio
   - Sistema de publicaciones
   - Notificaciones web push
   - Gestión de años escolares

2. **Funcionalidades Avanzadas:**

   - Educación virtual
   - Sistema de aprobación
   - Reportes y estadísticas
   - Gestión de archivos

3. **Optimizaciones:**
   - Caché de datos
   - Optimización de consultas
   - Compresión de assets
   - Monitoreo de performance

### Tecnologías Utilizadas

- **Frontend:** React 18, Material-UI 5, React Router 6, Axios, React Icons
- **Backend:** Node.js, Express, PostgreSQL, JWT, bcryptjs
- **Herramientas:** Git, npm, pgAdmin4
- **Desarrollo:** ESLint, Prettier, nodemon

---

## [2024-12-19] - Patrón CRUD Unificado Establecido

### ✅ **PATRÓN OBLIGATORIO PARA MANTENIMIENTOS**

**Archivo de referencia:** `PATRON_CRUD.md`

#### **🎯 Objetivo:**

Unificar todos los mantenimientos (Usuarios, Colegios, Años Escolares, etc.) bajo el mismo patrón para mantener consistencia y facilitar el desarrollo.

#### **📋 Estructura Establecida:**

##### **1. Estructura de Carpetas:**

```
frontend/src/pages/Mantenimientos/
├── Usuarios/
│   ├── UsuariosList.js      # Lista principal con tabla
│   ├── UsuarioForm.js       # Formulario (Nuevo/Editar)
│   └── UsuarioView.js       # Vista detallada (solo lectura)
├── Colegios/
│   ├── ColegiosList.js
│   ├── ColegioForm.js
│   └── ColegioView.js
└── AniosEscolares/
    ├── AniosEscolaresList.js
    ├── AnioEscolarForm.js
    └── AnioEscolarView.js
```

##### **2. Componentes Reutilizables:**

```
frontend/src/components/Common/
├── DataTable.js             # Tabla reutilizable con paginación
├── FormDialog.js            # Modal de formulario
├── ConfirmDialog.js         # Modal de confirmación
├── SearchBar.js             # Barra de búsqueda
└── ActionButtons.js         # Botones de acción (Editar, Eliminar, Ver)
```

##### **3. Patrón de Rutas:**

```javascript
{
  path: '/mantenimientos/entidad',
  element: <EntidadList />
},
{
  path: '/mantenimientos/entidad/nuevo',
  element: <EntidadForm mode="create" />
},
{
  path: '/mantenimientos/entidad/editar/:id',
  element: <EntidadForm mode="edit" />
},
{
  path: '/mantenimientos/entidad/ver/:id',
  element: <EntidadView />
}
```

##### **4. Servicios API Unificados:**

```javascript
export const entidadAPI = {
  getAll: (params) => api.get("/entidad", { params }),
  getById: (id) => api.get(`/entidad/${id}`),
  create: (data) => api.post("/entidad", data),
  update: (id, data) => api.put(`/entidad/${id}`, data),
  delete: (id) => api.delete(`/entidad/${id}`),
  search: (query) => api.get(`/entidad/search?q=${query}`),
};
```

##### **5. Estados Comunes:**

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [selectedItem, setSelectedItem] = useState(null);
const [dialogOpen, setDialogOpen] = useState(false);
const [dialogMode, setDialogMode] = useState("create"); // 'create', 'edit', 'view'
```

##### **6. Funciones Estándar:**

- `handleCreate()` - Crear nuevo registro
- `handleEdit(item)` - Editar registro existente
- `handleView(item)` - Ver registro (solo lectura)
- `handleDelete(id)` - Eliminar registro con confirmación
- `handleSave(data)` - Guardar datos (crear/actualizar)
- `loadData()` - Cargar datos de la API

#### **📝 Convenciones de Nombres:**

##### **Archivos:**

- `EntidadList.js` - Lista principal
- `EntidadForm.js` - Formulario
- `EntidadView.js` - Vista detallada

##### **Variables:**

- `data` - Array de datos
- `loading` - Estado de carga
- `selectedItem` - Item seleccionado
- `dialogOpen` - Estado del modal
- `dialogMode` - Modo del modal

##### **Funciones:**

- `handleCreate()` - Crear nuevo
- `handleEdit(item)` - Editar item
- `handleView(item)` - Ver item
- `handleDelete(id)` - Eliminar por ID
- `handleSave(data)` - Guardar datos
- `loadData()` - Cargar datos

#### **✅ Checklist de Implementación:**

- [ ] Estructura de carpetas creada
- [ ] Componentes List, Form, View implementados
- [ ] Rutas configuradas
- [ ] API service creado
- [ ] Estados y funciones comunes implementadas
- [ ] Componentes reutilizables utilizados
- [ ] Validaciones aplicadas
- [ ] Manejo de errores implementado
- [ ] Loading states configurados
- [ ] Notificaciones (toast) implementadas
- [ ] Responsive design aplicado
- [ ] Pruebas de funcionalidad realizadas

#### **🚨 IMPORTANTE:**

**ESTE PATRÓN ES OBLIGATORIO** para todos los mantenimientos del sistema. Cualquier nuevo mantenimiento debe seguir exactamente esta estructura para mantener la consistencia del código.

#### **📚 Documentación Completa:**

Ver archivo `PATRON_CRUD.md` para detalles completos, ejemplos de código y guías de implementación paso a paso.

---

## [2024-09-04] - Migración a Sistema de Un Solo Colegio y Corrección de URLs de Imágenes

### ✅ **CAMBIO ARQUITECTÓNICO: DE MULTI-COLEGIO A UN SOLO COLEGIO**

**Fecha:** 04/09/2025
**Cambio:** Migración completa del sistema multi-colegio a un sistema de un solo colegio

#### **Archivos Eliminados:**

- `frontend/src/components/Layout/SuperAdminLayout.js`
- `frontend/src/components/Sidebar/SuperAdminSidebar.js`
- `frontend/src/pages/SuperAdmin/SuperAdminDashboard.js`
- `frontend/src/pages/SuperAdmin/GestionColegios.js`
- `frontend/src/pages/SuperAdmin/GestionUsuarios.js`
- `frontend/src/pages/SuperAdmin/ConfiguracionSistema.js`
- `frontend/src/pages/Mantenimientos/Colegios/ColegiosList.js`
- `frontend/src/pages/Mantenimientos/Colegios/ColegioForm.js`
- `frontend/src/pages/Mantenimientos/Colegios/ColegioView.js`

#### **Archivos Modificados:**

- `frontend/src/App.js` - Eliminada lógica de Superadministrador y agregado ConfiguracionProvider
- `frontend/src/services/apiService.js` - Eliminado `colegioService`, agregado `configuracionService`
- `backend/routes/configuracion.js` - Nuevo sistema de configuración del colegio
- `backend/migrations/create_configuracion_table.sql` - Nueva tabla de configuración

#### **Nuevas Funcionalidades:**

- **Sistema de Configuración:** Módulo para gestionar datos del colegio único
- **Contexto Global:** `ConfiguracionContext` para manejo de datos del colegio
- **URLs de Imágenes:** Sistema unificado para construcción de URLs de imágenes
- **Actualización en Tiempo Real:** Cambios en configuración se reflejan inmediatamente

### ✅ **CORRECCIÓN DE URLs DE IMÁGENES**

**Problema Identificado:**

- Error 404 al cargar logos del colegio
- URLs construidas incorrectamente
- Imágenes no se mostraban en login, dashboard ni sidebar

**Solución Implementada:**

- **Archivo:** `frontend/src/utils/imageUtils.js` - Funciones helper para URLs
- **Función `getImageUrl()`:** Construye URLs completas para cualquier imagen
- **Función `getColegioLogoUrl()`:** Específica para logos del colegio
- **Actualización de Contexto:** `ConfiguracionContext` maneja URLs completas
- **Actualización de Componentes:** Login, ConfiguracionList, AdminSidebar

### ✅ **SISTEMA DE CONFIGURACIÓN IMPLEMENTADO**

#### **Backend - Nueva Tabla `configuracion`:**

```sql
CREATE TABLE configuracion (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo VARCHAR(50) DEFAULT 'text',
    categoria VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **Datos Iniciales del Colegio:**

- `colegio_nombre` - Nombre del colegio
- `colegio_codigo` - Código único del colegio
- `colegio_direccion` - Dirección completa
- `colegio_telefono` - Teléfono de contacto
- `colegio_email` - Email de contacto
- `colegio_logo` - Archivo del logo
- `colegio_color_primario` - Color primario del tema
- `colegio_color_secundario` - Color secundario del tema
- `colegio_director` - Nombre del director

#### **Rutas de Configuración:**

- `GET /api/configuracion` - Obtener todas las configuraciones
- `GET /api/configuracion/colegio` - Obtener datos del colegio (público)
- `GET /api/configuracion/colegio/publico` - Datos públicos sin autenticación
- `PUT /api/configuracion/colegio` - Actualizar datos del colegio
- `PUT /api/configuracion/:clave` - Actualizar configuración específica

### ✅ **MEJORAS EN LA EXPERIENCIA DE USUARIO**

#### **Actualización Inmediata:**

- Cambios en configuración se reflejan instantáneamente
- Sidebar actualiza logo y nombre del colegio automáticamente
- Login muestra datos actualizados del colegio
- Preview de imágenes funciona correctamente

#### **Sistema de Archivos Mejorado:**

- Subida de logos con preview inmediato
- URLs construidas correctamente
- Manejo de errores mejorado
- Validación de tipos de archivo

### ✅ **PATRONES ESTABLECIDOS**

#### **Para URLs de Imágenes:**

```javascript
// Función helper obligatoria
import { getColegioLogoUrl } from "../utils/imageUtils";

// Uso en componentes
const logoUrl = getColegioLogoUrl(colegio.logo);
```

#### **Para Configuración del Colegio:**

```javascript
// Contexto global
const { colegio, updateColegio } = useConfiguracion();

// Actualización de datos
updateColegio({
  nombre: "Nuevo Nombre",
  logo: "nuevo-logo.png",
});
```

### ✅ **ARCHIVOS CREADOS/MODIFICADOS**

#### **Nuevos Archivos:**

- `frontend/src/utils/imageUtils.js` - Utilidades para URLs de imágenes
- `frontend/src/contexts/ConfiguracionContext.js` - Contexto global de configuración
- `frontend/src/pages/Configuracion/ConfiguracionList.js` - Módulo de configuración
- `backend/routes/configuracion.js` - Rutas de configuración
- `backend/migrations/create_configuracion_table.sql` - Migración de tabla

#### **Archivos Modificados:**

- `frontend/src/App.js` - Agregado ConfiguracionProvider
- `frontend/src/pages/Login.js` - URLs de imágenes corregidas
- `frontend/src/components/Sidebar/AdminSidebar.js` - URLs de imágenes corregidas
- `frontend/src/services/apiService.js` - Agregado configuracionService

### ✅ **ESTADO FINAL**

- ✅ **Sistema de un solo colegio** completamente implementado
- ✅ **URLs de imágenes** funcionando correctamente
- ✅ **Configuración en tiempo real** implementada
- ✅ **Módulo de configuración** completamente funcional
- ✅ **Contexto global** para datos del colegio
- ✅ **Patrones establecidos** para futuros desarrollos

---

## [2024-12-19] - Dashboard con Estadísticas Reales y 5 Tarjetas

### ✅ **DASHBOARD CON DATOS REALES IMPLEMENTADO**

**Funcionalidad:** Dashboard principal con estadísticas reales de usuarios por rol y 5 tarjetas responsivas

#### **🎯 Características Implementadas:**

##### **1. Estadísticas Reales:**

- **Conteo automático** de usuarios por rol desde la base de datos
- **Carga en tiempo real** al inicializar el dashboard
- **Manejo de errores** con notificaciones toast
- **Logging detallado** para debugging

##### **2. 5 Tarjetas Responsivas:**

- **Administradores** - Azul (#1976d2)
- **Docentes** - Rojo (#dc004e)
- **Alumnos** - Verde (#2e7d32)
- **Apoderados** - Naranja (#ed6c02)
- **Tutores** - Morado (#9c27b0) - **NUEVA**

##### **3. Layout Responsivo:**

- **Mobile (xs):** 1 columna
- **Tablet (sm):** 2 columnas
- **Desktop (md):** 3 columnas
- **Pantalla grande (lg+):** 5 columnas

##### **4. Estados Visuales:**

- **Loading spinner** durante carga de datos
- **Hover effects** en tarjetas
- **Gradientes** de colores por rol
- **Iconos** específicos para cada rol

#### **🔧 Archivos Modificados:**

##### **Frontend:**

- `frontend/src/pages/Admin/AdminDashboard.js` - Dashboard principal con estadísticas reales
- `frontend/src/services/apiService.js` - Servicio de usuarios corregido

##### **Patrones de Documentación:**

- `PATRON_CRUD.md` - Agregada sección de Dashboard con estadísticas
- `PATRON_DISENO_VISUAL.md` - Agregada sección de Dashboard con estadísticas
- `CHANGELOG.md` - Documentación completa de cambios

#### **🐛 Correcciones Realizadas:**

##### **Error de Función:**

- **Problema:** `userService.getUsuarios is not a function`
- **Causa:** Llamada incorrecta a función inexistente
- **Solución:** Corregido a `userService.getUsers()`
- **Resultado:** Dashboard muestra datos reales correctamente

#### **📊 Funcionalidades del Dashboard:**

##### **Carga de Datos:**

```javascript
const loadUserStats = async () => {
  try {
    setLoading(true);
    const response = await userService.getUsers();

    if (response.success) {
      const usuarios = response.usuarios || [];
      const statsData = {
        administradores: usuarios.filter((u) => u.rol === "Administrador")
          .length,
        docentes: usuarios.filter((u) => u.rol === "Docente").length,
        alumnos: usuarios.filter((u) => u.rol === "Alumno").length,
        apoderados: usuarios.filter((u) => u.rol === "Apoderado").length,
        tutores: usuarios.filter((u) => u.rol === "Tutor").length,
      };
      setStats(statsData);
    }
  } catch (error) {
    toast.error("Error al cargar estadísticas");
  } finally {
    setLoading(false);
  }
};
```

##### **Layout Responsivo:**

```javascript
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr", // 1 columna en móvil
      sm: "repeat(2, 1fr)", // 2 columnas en tablet
      md: "repeat(3, 1fr)", // 3 columnas en desktop
      lg: "repeat(5, 1fr)", // 5 columnas en pantalla grande
    },
    gap: { xs: 1, sm: 2, md: 2 },
    mb: 4,
  }}
>
  {/* 5 tarjetas de estadísticas */}
</Box>
```

#### **✅ Estado Final:**

- ✅ **Dashboard funcional** con datos reales
- ✅ **5 tarjetas responsivas** implementadas
- ✅ **Estadísticas en tiempo real** funcionando
- ✅ **Layout adaptativo** para todos los dispositivos
- ✅ **Manejo de errores** implementado
- ✅ **Documentación actualizada** en patrones

---

## [2024-12-19] - Patrón de Diseño Visual Unificado Establecido

### ✅ **PATRÓN OBLIGATORIO PARA DISEÑO VISUAL**

**Archivo de referencia:** `PATRON_DISENO_VISUAL.md`

#### **🎨 Objetivo:**

Unificar el diseño visual de todos los componentes reutilizables del sistema para mantener consistencia, mejorar la experiencia de usuario y facilitar el mantenimiento del código.

#### **🎯 Componentes con Diseño Unificado:**

##### **1. DataTable - Tabla de Datos:**

- Header con título y botón "Nuevo"
- Barra de búsqueda integrada
- Tabla con filas alternadas y hover effects
- Botones de acción por fila (Ver, Editar, Eliminar)
- Paginación en la parte inferior
- Responsive design para móviles

##### **2. FormDialog - Modal de Formulario:**

- Modal centrado con sombra suave
- Header con icono y título dinámico
- Formulario con campos espaciados uniformemente
- Footer con botones alineados a la derecha
- Loading states durante guardado
- Validaciones visuales

##### **3. ConfirmDialog - Modal de Confirmación:**

- Modal pequeño centrado
- Icono de advertencia grande
- Mensaje centrado y claro
- Botones centrados (Cancelar, Confirmar)
- Colores semánticos (rojo para eliminar)

##### **4. SearchBar - Barra de Búsqueda:**

- Campo de texto con icono de búsqueda
- Botón de limpiar cuando hay texto
- Placeholder descriptivo
- Integrada en el header de las tablas

##### **5. ActionButtons - Botones de Acción:**

- Iconos con colores semánticos
- Hover effects suaves
- Tooltips informativos
- Tamaño consistente

#### **🎨 Paleta de Colores Establecida:**

```javascript
primary: "#1976d2"; // Azul principal
secondary: "#424242"; // Gris principal
success: "#2e7d32"; // Verde para éxito
warning: "#ed6c02"; // Naranja para advertencias
error: "#d32f2f"; // Rojo para errores
info: "#1976d2"; // Azul para información
```

#### **📐 Estilos Unificados:**

- **Bordes:** Radio de 8px para botones, 12px para modales
- **Sombras:** Suaves y consistentes
- **Espaciado:** Múltiplos de 8px
- **Tipografía:** Roboto con pesos y tamaños estandarizados
- **Animaciones:** Transiciones suaves de 0.3s

#### **📱 Responsive Design:**

- **Mobile:** Componentes adaptados para pantallas pequeñas
- **Tablet:** Layout optimizado para tablets
- **Desktop:** Experiencia completa en pantallas grandes

#### **🔄 Estados Visuales:**

- **Loading:** Spinners y textos de carga
- **Empty:** Estados vacíos con iconos y mensajes
- **Error:** Alertas con colores y iconos apropiados
- **Success:** Confirmaciones visuales

#### **🚨 IMPORTANTE:**

**ESTE PATRÓN DE DISEÑO ES OBLIGATORIO** para todos los componentes reutilizables. Cualquier componente que se cree debe seguir exactamente estos estilos para mantener la consistencia visual del sistema.

#### **📚 Documentación Completa:**

Ver archivo `PATRON_DISENO_VISUAL.md` para detalles completos, ejemplos de código, estilos específicos y guías de implementación visual.

---

## [2024-12-19] - Estructura de Base de Datos Registrada

### ✅ **CONTROL DE TABLAS Y CAMPOS**

**Objetivo:** Registrar todas las tablas del sistema con sus campos específicos para tener un control completo y evitar dudas durante el desarrollo.

#### **📋 Tabla: `usuarios`**

**Descripción:** Tabla principal de usuarios del sistema educativo multi-colegio.

**Campos:**

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,                    -- ID único autoincremental
    nombres VARCHAR(255) NOT NULL,            -- Nombres completos del usuario
    dni VARCHAR(20) UNIQUE NOT NULL,          -- DNI único (campo de login)
    email VARCHAR(255) UNIQUE NOT NULL,       -- Email único del usuario
    telefono VARCHAR(20),                     -- Teléfono de contacto
    fecha_nacimiento DATE,                    -- Fecha de nacimiento
    clave VARCHAR(255) NOT NULL,              -- Contraseña encriptada
    foto VARCHAR(500),                        -- URL o nombre del archivo de foto
    activo BOOLEAN DEFAULT true,              -- Estado activo/inactivo
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('Administrador', 'Docente', 'Alumno', 'Apoderado', 'Tutor')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Fecha de última actualización
);
```

**Roles permitidos:**

- `Administrador` - Gestión del colegio
- `Docente` - Profesores del colegio
- `Alumno` - Estudiantes
- `Apoderado` - Padres de familia
- `Tutor` - Tutores legales

**Características especiales:**

- Campo `dni` es único y se usa para login
- Campo `email` es único
- Campo `clave` almacena contraseña encriptada
- Campo `foto` puede ser URL o nombre de archivo
- Campo `activo` controla si el usuario está habilitado
- Triggers automáticos para `created_at` y `updated_at`

**Datos de ejemplo:**

```sql
INSERT INTO usuarios (nombres, dni, email, telefono, fecha_nacimiento, clave, foto, activo, rol, created_at, updated_at)
VALUES ('Administrador de Sistemas', '11111111', 'administrado@sistemas.com', '970877642', '1983-04-26', '$2b$10$...', '', true, 'Administrador', '2025-09-02', '2025-09-02');
```

#### **📋 Tabla: `colegios`**

**Descripción:** Tabla de colegios para el sistema multi-tenant.

**Campos:**

```sql
CREATE TABLE colegios (
    id SERIAL PRIMARY KEY,                    -- ID único autoincremental
    nombre VARCHAR(255) NOT NULL,             -- Nombre del colegio
    codigo VARCHAR(50) UNIQUE NOT NULL,       -- RUC o código único del colegio
    logo VARCHAR(500),                        -- URL del logo del colegio
    color_primario VARCHAR(7) DEFAULT '#1976d2',     -- Color primario del colegio
    color_secundario VARCHAR(7) DEFAULT '#424242',   -- Color secundario del colegio
    direccion TEXT,                           -- Dirección completa del colegio
    telefono VARCHAR(20),                     -- Teléfono del colegio
    email VARCHAR(255),                       -- Email del colegio
    director_nombre VARCHAR(255),             -- Nombre del director
    activo BOOLEAN DEFAULT true,              -- Estado activo/inactivo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Fecha de última actualización
);
```

**Datos de ejemplo:**

```sql
INSERT INTO colegios (nombre, codigo, logo, color_primario, color_secundario, direccion, telefono, email, director_nombre, activo, created_at, updated_at)
VALUES ('Vanguard Schools - Sede SMP', '20535891622', '', '#1976d2', '#424242', 'Jr Toribio de Luzuriaga Mz F lote 18 y 19 Urb San Pedro de Garagay SMP', '910526895', 'vanguard@vanguard.com', 'Rosario Maravi Lagos', true, '2025-09-02', '2025-09-02');
```

#### **📋 Tabla: `anios_escolares`**

**Descripción:** Tabla de años escolares por colegio.

**Campos:**

```sql
CREATE TABLE anios_escolares (
    id SERIAL PRIMARY KEY,                    -- ID único autoincremental
    colegio_id INTEGER REFERENCES colegios(id) ON DELETE CASCADE,  -- FK al colegio
    anio INTEGER NOT NULL,                    -- Año escolar (ej: 2025)
    activo BOOLEAN DEFAULT true,              -- Estado activo/inactivo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de última actualización
    UNIQUE(colegio_id, anio)                  -- Un año por colegio
);
```

**Datos de ejemplo:**

```sql
INSERT INTO anios_escolares (colegio_id, anio, activo, created_at, updated_at)
VALUES (1, 2025, true, '2025-09-02', '2025-09-02');
```

#### **🚨 IMPORTANTE:**

**ESTAS ESTRUCTURAS DE TABLAS SON LA REFERENCIA OFICIAL** para el desarrollo de mantenimientos. Cualquier duda sobre campos, tipos de datos o relaciones debe consultarse en esta documentación.

#### **📚 Próximas tablas a registrar:**

- `grados` - Grados escolares
- `bimestres` - Bimestres del año escolar
- `asignaturas` - Materias por grado
- `anios_lectivos` - Años lectivos
- `cursos` - Cursos del sistema
- `usuario_grado` - Matrículas de usuarios
- `alumno_apoderado` - Relaciones alumno-apoderado
- `publicaciones` - Publicaciones del sistema
- `reacciones_publicacion` - Reacciones a publicaciones
- `comentarios_publicacion` - Comentarios a publicaciones
- `compartidos_publicacion` - Compartidos de publicaciones
- `notificaciones` - Sistema de notificaciones
- `suscripciones_web_push` - Suscripciones para notificaciones push
- `configuracion_notificaciones` - Configuración de notificaciones por usuario

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

---

## [2024-12-19] - Lección Aprendida: Consistencia de Rutas

### **PROBLEMA IDENTIFICADO:**

- **Error:** Las rutas en el sidebar no coincidían con las rutas en AdminLayout
- **Síntoma:** El menú "Usuarios" no abría la página de mantenimiento
- **Causa:** Sidebar usaba `/dashboard/usuarios/` pero AdminLayout usaba `/usuarios/`

### **SOLUCIÓN IMPLEMENTADA:**

- **Unificación:** Ambas rutas ahora usan `/dashboard/usuarios/`
- **Verificación:** Navegación probada y funcionando correctamente
- **Documentación:** Agregado al PATRON_CRUD.md como verificación obligatoria

### **REGLA ESTABLECIDA:**

**CRÍTICO:** Para todos los próximos mantenimientos, verificar que:

1. **Ruta en sidebar** = **Ruta en AdminLayout**
2. **Ambas usen el prefijo** `/dashboard/`
3. **Nombres de entidad** coincidan exactamente
4. **Probar navegación** haciendo clic en el menú

### **ESTRUCTURA DE RUTAS ESTÁNDAR:**

```
/dashboard/{entidad}                    // Lista principal
/dashboard/{entidad}/nuevo              // Crear nuevo
/dashboard/{entidad}/editar/:id         // Editar existente
/dashboard/{entidad}/ver/:id            // Ver detalle
```

**Estado:** Lección aprendida y documentada

---

## [2024-12-19] - Lecciones Aprendidas: Problemas Comunes en Mantenimientos

### **PROBLEMAS IDENTIFICADOS Y SOLUCIONADOS**

Durante la implementación del mantenimiento de Usuarios, identificamos y solucionamos varios problemas comunes que se repetirán en futuros mantenimientos:

#### **1. Error "data.map is not a function"**

- **Problema:** Datos no son array cuando se intenta usar `.map()`
- **Solución:** Validación robusta de arrays antes de asignar
- **Código:** `Array.isArray(response.usuarios) ? response.usuarios : []`

#### **2. Error "renderInput is not a function" en DatePicker**

- **Problema:** DatePicker de Material-UI requiere renderInput personalizado
- **Solución:** Implementar renderInput con TextField
- **Código:** `renderInput={(params) => <TextField {...params} />}`

#### **3. Error "Cannot read property 'id' of undefined"**

- **Problema:** Acceso a propiedades de objetos undefined
- **Solución:** Validación de existencia antes de acceso
- **Código:** `usuario?.id || ''`

#### **4. Error "Maximum update depth exceeded"**

- **Problema:** Re-renders infinitos por dependencias incorrectas
- **Solución:** useCallback y useMemo para optimizar
- **Código:** `const handleSubmit = useCallback(() => {...}, [dependencies])`

#### **5. Error "Cannot read property 'length' of undefined"**

- **Problema:** Acceso a .length de arrays undefined
- **Solución:** Validación de array antes de usar .length
- **Código:** `(usuarios || []).length`

### **PATRONES ESTABLECIDOS PARA FUTUROS MANTENIMIENTOS:**

#### **Validación de Datos:**

```javascript
// Siempre validar arrays
const data = Array.isArray(response.data) ? response.data : [];

// Siempre validar objetos
const item = response.item || {};

// Siempre validar strings
const value = item.campo || "";
```

#### **Manejo de Estados:**

```javascript
// Estados de carga
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Estados de datos
const [items, setItems] = useState([]);
const [selectedItem, setSelectedItem] = useState(null);
```

#### **Optimización de Rendimiento:**

```javascript
// useCallback para funciones
const handleSubmit = useCallback(() => {
  // lógica
}, [dependencies]);

// useMemo para valores calculados
const filteredItems = useMemo(() => {
  return items.filter((item) => item.active);
}, [items]);
```

#### **Manejo de Errores:**

```javascript
try {
  const response = await api.getData();
  setData(response.data);
} catch (error) {
  console.error("Error:", error);
  toast.error("Error al cargar datos");
}
```

### **HERRAMIENTAS Y LIBRERÍAS UTILIZADAS:**

- **React Hook Form** para formularios
- **Material-UI** para componentes
- **React Hot Toast** para notificaciones
- **Axios** para peticiones HTTP
- **Multer** para manejo de archivos
- **Express.static** para servir archivos

**Estado:** Lecciones aprendidas documentadas y listas para aplicar en futuros mantenimientos

---

## 📋 **2025-01-16 - Menús de Opciones Condicionales por Rol en Módulo Usuarios**

### **🎯 OBJETIVO**

Implementar menús de opciones dinámicos en la grilla de usuarios que muestren diferentes opciones según el rol del usuario seleccionado, manteniendo consistencia en la interfaz y preparando el sistema para futuras funcionalidades.

### **🔧 CAMBIOS TÉCNICOS**

#### **Frontend - UsuariosList.js:**

- **Función `getMenuOptions(rol)`**: Implementada lógica condicional para mostrar opciones específicas según el rol
- **Importación de iconos**: Agregado `Schedule as ScheduleIcon` para opción "Ver Horario"
- **Menús por rol implementados**:
  - **Alumno**: 9 opciones (Ver Información, Imprimir QR, Enviar Mensaje, Matrículas Registradas, Padres de Familia, Historial de Pagos, Gestionar Permisos, Editar, Eliminar)
  - **Docente**: 7 opciones estándar (Ver Información, Imprimir QR, Ver Horario, Enviar Mensaje, Gestionar Permisos, Editar, Eliminar)
  - **Apoderado**: 7 opciones específicas (Ver Información, Imprimir QR, Alumnos a Cargo, Enviar Mensaje, Gestionar Permisos, Editar, Eliminar)
  - **Administrador/Director/Secretaria/Psicologia/Tutor/Promotor**: 7 opciones estándar (Ver Información, Imprimir QR, Ver Horario, Enviar Mensaje, Gestionar Permisos, Editar, Eliminar)

#### **Manejo de Acciones:**

- **Acciones implementadas**: `view`, `edit`, `permissions`, `delete`, `qr`
- **Acciones sin funcionalidad**: `message`, `alumnos`, `matriculas`, `padres`, `pagos`, `cursos`, `horarios`, `hijos`, `comunicados`, `reportes`, `estadisticas`, `evaluaciones`, `seguimiento`, `tutelados`, `prospectos`
- **Comportamiento**: Las opciones sin funcionalidad simplemente cierran el menú sin generar errores

### **🎨 MEJORAS DE UX**

- **Menús contextuales**: Cada rol ve solo las opciones relevantes para su función
- **Iconos apropiados**: Uso de iconos específicos para cada tipo de acción
- **Consistencia visual**: Mismo diseño y comportamiento en todos los menús
- **Preparación futura**: Estructura lista para implementar funcionalidades adicionales

### **📊 ROLES Y OPCIONES CONFIGURADOS**

| Rol           | Opciones | Funcionalidades Implementadas            | Pendientes                         |
| ------------- | -------- | ---------------------------------------- | ---------------------------------- |
| Alumno        | 9        | Ver Info, QR, Permisos, Editar, Eliminar | Mensaje, Matrículas, Padres, Pagos |
| Docente       | 7        | Ver Info, QR, Permisos, Editar, Eliminar | Horario, Mensaje                   |
| Apoderado     | 7        | Ver Info, QR, Permisos, Editar, Eliminar | Alumnos, Mensaje                   |
| Administrador | 7        | Ver Info, QR, Permisos, Editar, Eliminar | Horario, Mensaje                   |
| Director      | 7        | Ver Info, QR, Permisos, Editar, Eliminar | Horario, Mensaje                   |
| Secretaria    | 7        | Ver Info, QR, Permisos, Editar, Eliminar | Horario, Mensaje                   |
| Psicologia    | 7        | Ver Info, QR, Permisos, Editar, Eliminar | Horario, Mensaje                   |
| Tutor         | 7        | Ver Info, QR, Permisos, Editar, Eliminar | Horario, Mensaje                   |
| Promotor      | 7        | Ver Info, QR, Permisos, Editar, Eliminar | Horario, Mensaje                   |

### **🛠️ HERRAMIENTAS UTILIZADAS:**

- **Material-UI Icons** para iconografía consistente
- **Switch/Case** para lógica condicional de menús
- **React State Management** para control de menús y selección de usuarios
- **JavaScript Fall-through** para consolidar múltiples roles con las mismas opciones

**Estado:** Menús condicionales implementados y funcionales para todos los roles del sistema

### **📝 NOTAS DE IMPLEMENTACIÓN:**

- **Función `getMenuOptions(rol)`**: Centralizada en UsuariosList.js para manejo de opciones por rol
- **Acciones sin funcionalidad**: Preparadas para futuras implementaciones sin generar errores
- **Consistencia**: Todos los roles mantienen las opciones básicas (Ver, QR, Permisos, Editar, Eliminar)
- **Escalabilidad**: Fácil agregar nuevos roles o modificar opciones existentes

---

## **2025-01-16 - Módulo de Avatars del Sistema Gamificado**

### **🎯 OBJETIVO:**

Implementar el módulo completo de gestión de avatars para el sistema gamificado educativo, permitiendo la administración de avatars que los alumnos pueden canjear con puntos obtenidos por actividades académicas.

### **🔧 CAMBIOS TÉCNICOS:**

#### **Backend:**

- **Nueva tabla `avatars`** con estructura completa:
  - `id`, `nombre`, `descripcion`, `nivel` (1-20), `puntos` (≥0)
  - `imagen`, `activo`, `created_at`, `updated_at`
  - Restricciones UNIQUE para nombre y nivel
  - Restricciones CHECK para validar rangos
- **Rutas API completas** (`/api/avatars`):
  - `GET /` - Listar con filtros (búsqueda, nivel, estado, paginación)
  - `GET /:id` - Obtener avatar específico
  - `POST /` - Crear nuevo avatar con subida de imagen
  - `PUT /:id` - Actualizar avatar existente
  - `DELETE /:id` - Eliminar avatar
  - `GET /estadisticas/general` - Estadísticas del sistema
- **Gestión de imágenes** con multer:
  - Subida a `/uploads/avatars/`
  - Validación de tipos (JPEG, PNG, GIF, WEBP)
  - Límite de 2MB por archivo
  - Eliminación automática de imágenes al borrar avatars
- **20 avatars predefinidos** con progresión de puntos (0 a 7500)

#### **Frontend:**

- **Servicio `avatarsService`** en apiService.js con todas las operaciones CRUD
- **Componente `AvatarsList`**:
  - Grilla con diseño estándar (colores, hover, paginación)
  - Búsqueda por nombre/descripción
  - Filtros por nivel (1-20) y estado
  - Menú "Opciones" con acciones contextuales
  - Avatares con preview de imagen
  - Chips de nivel con colores progresivos
  - Puntos con icono de estrella
- **Componente `AvatarsForm`**:
  - Formulario completo para crear/editar
  - Subida de imagen con preview
  - Validaciones de nivel (1-20) y puntos (≥0)
  - Campos: nombre, descripción, nivel, puntos, estado
  - Validación de archivos (tipo y tamaño)
- **Componente `AvatarsView`**:
  - Vista detallada del avatar
  - Información principal y sistema gamificado
  - Progresión visual del nivel
  - Imagen grande del avatar
  - Información del sistema (fechas)
- **Rutas integradas** en AdminLayout (`/dashboard/avatars`)
- **Menú en sidebar** ya existente

### **🎨 CARACTERÍSTICAS DEL DISEÑO:**

#### **Grilla de Avatars:**

- **Header azul** `#61a7d1` con texto blanco
- **Filas alternadas** blanco y `#e7f1f8`
- **Hover naranja** `#ffe6d9 !important`
- **Menú "Opciones"** con acciones contextuales
- **Avatares circulares** con preview de imagen
- **Chips de nivel** con colores progresivos (verde → azul → naranja → rojo)
- **Puntos con estrella** y formato numérico

#### **Formulario de Avatar:**

- **Layout de 2 columnas** (imagen + formulario)
- **Subida de imagen** con preview y validación
- **Campos organizados** con validaciones en tiempo real
- **Switch de estado** con chip visual
- **Validaciones completas** (nivel, puntos, archivos)

#### **Vista de Detalle:**

- **Header con avatar** y información básica
- **Cards organizadas** por categorías
- **Progresión visual** del nivel con barra de progreso
- **Información del sistema** con fechas
- **Diseño responsive** y profesional

### **📊 FUNCIONALIDADES IMPLEMENTADAS:**

#### **Gestión de Avatars:**

- ✅ **Crear avatar** con imagen y validaciones
- ✅ **Editar avatar** existente
- ✅ **Ver detalle** completo del avatar
- ✅ **Eliminar avatar** con confirmación
- ✅ **Búsqueda** por nombre/descripción
- ✅ **Filtros** por nivel y estado
- ✅ **Paginación** estándar del sistema

#### **Sistema Gamificado:**

- ✅ **20 niveles** predefinidos (1-20)
- ✅ **Progresión de puntos** (0 a 7500)
- ✅ **Rangos de nivel** (Principiante, Intermedio, Avanzado, Experto)
- ✅ **Colores progresivos** según nivel
- ✅ **Validaciones** de unicidad (nombre y nivel)

#### **Gestión de Imágenes:**

- ✅ **Subida de archivos** con validación
- ✅ **Preview en tiempo real**
- ✅ **Validación de tipos** y tamaño
- ✅ **Eliminación automática** al borrar avatar
- ✅ **Imagen por defecto** si no se sube

### **🔧 HERRAMIENTAS UTILIZADAS:**

- **Backend**: Express.js, Multer, PostgreSQL
- **Frontend**: React, Material-UI, SweetAlert2
- **Validaciones**: Nivel (1-20), Puntos (≥0), Archivos (2MB)
- **Estilos**: Patrón de colores estándar del sistema
- **Imágenes**: Gestión con utils/imageUtils.js

### **📝 NOTAS DE IMPLEMENTACIÓN:**

- **Tabla `avatars`** creada con 20 avatars predefinidos
- **Rutas backend** completamente funcionales
- **Frontend** siguiendo patrones establecidos del sistema
- **Validaciones** robustas en backend y frontend
- **Diseño** consistente con otros módulos
- **Preparado** para futuras funcionalidades de gamificación

**Estado:** Módulo de Avatars completamente implementado y funcional
