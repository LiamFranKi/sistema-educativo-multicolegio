# 🌐 SITIO WEB CMS - IMPLEMENTACIÓN FUTURA

## 📋 **DESCRIPCIÓN GENERAL**

Sistema de gestión de contenido (CMS) para la página web principal del colegio, completamente administrable desde el panel de administración del sistema educativo.

### ✅ **ESTADO ACTUAL**

- **Header completo** diseñado y documentado
- **Elementos administrables** identificados y estructurados
- **Responsive design** implementado
- **Documentación** completa en `docs/changelog/pagina-web.md`

---

## 🎨 **HEADER IMPLEMENTADO**

### ✅ **Elementos Administrables del Header**

1. **Color de la barra superior** (`#1A4060`) - Cambia automáticamente todos los colores del menú
2. **Menús de navegación** - Inicio, Niveles, Documentos de Interés, Trabaja con Nosotros, Contacto
3. **Submenús desplegables** - Inicio (Lista de Útiles, Visitas Guiadas, Tour Virtual, Preguntas Frecuentes) y Niveles (Inicial, Primaria, Secundaria)
4. **Información de contacto** - Dirección y teléfonos extraídos de la base de datos
5. **Logo principal** - Ubicado en `frontend/src/assets/images/logo-vanguard.png`
6. **Redes sociales** - Facebook, Instagram, TikTok, YouTube con iconos configurables
7. **Botón Intranet** - Texto, color y enlace configurables
8. **Banner del HOME** - Imagen, altura y marco superior configurables
9. **Tipografía** - Fuente Poppins para toda la página web

### 📱 **Responsive Design**

- **Desktop**: Layout horizontal completo
- **Tablet**: Adaptación automática
- **Mobile**: Menú hamburguesa y elementos apilados

### 📁 **Archivos del Header**

- `docs/diseños/header-vanguard-real.html` - Diseño completo
- `docs/diseños/logo-vanguard.png` - Logo principal
- `docs/diseños/icons/` - Iconos de redes sociales

---

## 🎯 **OBJETIVOS**

- **Página web principal** del colegio con dominio propio
- **Contenido administrable** desde el panel de admin
- **SEO optimizado** para mejor posicionamiento
- **Diseño responsivo** para todos los dispositivos
- **Integración completa** con el sistema educativo existente

---

## 🏗️ **ESTRUCTURA PROPUESTA**

### **MÓDULO: "Gestión de Sitio Web"**

```
Admin Dashboard
├── Gestión de Usuarios
├── Gestión de Grados
├── Gestión de Áreas
├── Gestión de Avatars
└── 🆕 Gestión de Sitio Web
    ├── Página Principal
    ├── Secciones (Historia, Misión, etc.)
    ├── Galería de Fotos
    ├── Noticias y Eventos
    ├── Testimonios
    └── Configuración General
```

---

## 📊 **BASE DE DATOS**

### **Tablas Propuestas:**

```sql
-- Contenido de páginas
CREATE TABLE paginas (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT,
    meta_descripcion TEXT,
    meta_keywords TEXT,
    activa BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Galería de fotos
CREATE TABLE galeria (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200),
    descripcion TEXT,
    imagen VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    orden INTEGER DEFAULT 0,
    destacada BOOLEAN DEFAULT false,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Noticias y eventos
CREATE TABLE noticias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    contenido TEXT,
    resumen TEXT,
    imagen VARCHAR(255),
    fecha_publicacion DATE,
    fecha_evento DATE,
    destacada BOOLEAN DEFAULT false,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Testimonios
CREATE TABLE testimonios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(100),
    testimonio TEXT NOT NULL,
    imagen VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Configuración del sitio
CREATE TABLE sitio_config (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    tipo VARCHAR(50) DEFAULT 'text',
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 **FUNCIONALIDADES**

### **CMS (Content Management System):**

- **Editor WYSIWYG** para contenido rico
- **Subida de imágenes** optimizadas automáticamente
- **SEO automático** (meta tags, descripciones, URLs amigables)
- **Vista previa** en tiempo real
- **Versiones** de contenido con historial
- **Publicación programada** para noticias

### **Secciones Administrables:**

- **Hero Section** (imagen principal, título, subtítulo, CTA)
- **Sobre Nosotros** (historia, misión, visión, valores)
- **Servicios** (educativos, extracurriculares, programas)
- **Galería** (fotos del colegio, eventos, actividades)
- **Noticias** (blog, eventos, anuncios, comunicados)
- **Testimonios** (padres, estudiantes, ex-alumnos)
- **Contacto** (dirección, teléfonos, mapas, formulario)
- **Admisiones** (proceso, requisitos, fechas)

---

## 🛠️ **TECNOLOGÍAS**

### **Frontend (Página Web):**

- **React** (consistencia con sistema actual)
- **Material-UI** (diseño unificado)
- **Next.js** (opcional, para mejor SEO)
- **Responsive Design** (móvil, tablet, desktop)
- **SEO optimizado** (meta tags dinámicos)

### **Backend (CMS):**

- **Node.js + Express** (mismo backend actual)
- **PostgreSQL** (misma base de datos)
- **Multer** (subida de archivos)
- **Rich Text Editor** (TinyMCE o CKEditor)
- **Sharp** (optimización de imágenes)

---

## 🌐 **CONFIGURACIÓN DE DOMINIO**

### **Opciones de Deploy:**

```
Opción 1: TODO EN UN PROYECTO
tuproyecto.railway.app
├── Frontend (React) → Página principal
├── Backend (Node.js) → API + CMS
└── Database (PostgreSQL) → Base de datos

Opción 2: CON DOMINIO PROPIO
tucolegio.com → Página principal
admin.tucolegio.com → Sistema educativo
api.tucolegio.com → API backend
```

### **Configuración Railway:**

- **Dominio personalizado** con SSL automático
- **Subdominios** para diferentes secciones
- **DNS personalizado** desde el proveedor
- **Variables de entorno** para configuración

---

## 📱 **DISEÑO RESPONSIVO**

### **Breakpoints:**

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Características:**

- **Navegación móvil** con hamburger menu
- **Imágenes adaptativas** según dispositivo
- **Touch-friendly** para tablets
- **Performance optimizado** para móviles

---

## 🔗 **INTEGRACIÓN CON SISTEMA ACTUAL**

### **Login Unificado:**

- **Mismo sistema** de autenticación
- **Roles extendidos** (Admin Web, Editor, etc.)
- **Permisos granulares** por sección

### **Base de Datos:**

- **Tablas nuevas** en la misma BD
- **Relaciones** con usuarios existentes
- **Consistencia** en nomenclatura

### **UI/UX:**

- **Diseño unificado** con Material-UI
- **Colores y temas** consistentes
- **Componentes reutilizables**

---

## 📋 **PLAN DE IMPLEMENTACIÓN**

### **Fase 1: Estructura Base**

- [ ] Crear tablas de base de datos
- [ ] Configurar rutas del CMS
- [ ] Crear componentes básicos

### **Fase 2: Editor de Contenido**

- [ ] Implementar editor WYSIWYG
- [ ] Sistema de subida de imágenes
- [ ] Gestión de páginas estáticas

### **Fase 3: Funcionalidades Avanzadas**

- [ ] Galería de fotos con categorías
- [ ] Sistema de noticias/blog
- [ ] Testimonios administrables

### **Fase 4: Frontend Público**

- [ ] Diseño de página principal
- [ ] SEO y meta tags
- [ ] Optimización móvil

### **Fase 5: Deploy y Dominio**

- [ ] Configuración Railway
- [ ] Dominio personalizado
- [ ] SSL y DNS

---

## 🎯 **BENEFICIOS**

### **Para el Colegio:**

- **Presencia web profesional**
- **Contenido actualizado** fácilmente
- **SEO mejorado** para más visibilidad
- **Comunicación efectiva** con padres

### **Para los Administradores:**

- **Gestión centralizada** del contenido
- **No requiere conocimientos técnicos**
- **Actualizaciones en tiempo real**
- **Estadísticas de visitas**

### **Para los Usuarios:**

- **Información actualizada** del colegio
- **Experiencia móvil optimizada**
- **Acceso fácil** a noticias y eventos
- **Formularios de contacto** integrados

---

## 📝 **NOTAS TÉCNICAS**

- **Compatibilidad**: Mantener compatibilidad con sistema actual
- **Performance**: Optimización de imágenes y carga rápida
- **Seguridad**: Validación de contenido y sanitización
- **Backup**: Sistema de respaldo para contenido
- **Analytics**: Integración con Google Analytics

---

**Estado**: 📋 Planificado para implementación futura
**Prioridad**: 🟡 Media
**Dependencias**: Sistema educativo base completado
**Estimación**: 4-6 semanas de desarrollo

---

**Última actualización**: 2025-01-16
**Responsable**: Equipo de desarrollo
**Revisión**: Pendiente de aprobación
