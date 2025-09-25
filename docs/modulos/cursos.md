# 📚 MÓDULO DE CURSOS - DOCUMENTACIÓN TÉCNICA

## 📋 **DESCRIPCIÓN GENERAL**

El módulo de Cursos gestiona las áreas curriculares del sistema educativo, permitiendo la administración completa de cursos por nivel educativo (Inicial, Primaria, Secundaria) con funcionalidades CRUD completas, subida de imágenes y validaciones robustas.

---

## 🗄️ **ESTRUCTURA DE BASE DE DATOS**

### **Tabla: `cursos`**

```sql
CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,                    -- ID único autoincremental
    nombre VARCHAR(200) NOT NULL,             -- Nombre del curso (ej: "Comunicación")
    descripcion TEXT,                         -- Descripción detallada del curso
    abreviatura VARCHAR(20) NOT NULL,         -- Abreviatura única (ej: "MAT", "COM")
    nivel_id INTEGER NOT NULL,                -- FK a tabla niveles
    imagen VARCHAR(255),                      -- Nombre del archivo de imagen
    activo BOOLEAN DEFAULT true,              -- Estado activo/inactivo
    created_at TIMESTAMP DEFAULT NOW(),       -- Fecha de creación
    updated_at TIMESTAMP DEFAULT NOW()        -- Fecha de actualización
);
```

### **Constraints y Validaciones:**

- **`uk_cursos_nombre_nivel`**: UNIQUE (nombre, nivel_id) - Permite mismo nombre en diferentes niveles
- **`uk_cursos_abreviatura`**: UNIQUE (abreviatura) - Abreviatura única en todo el sistema
- **`fk_cursos_nivel`**: FOREIGN KEY (nivel_id) → niveles(id) - Relación con niveles

### **Índices para Performance:**

```sql
CREATE INDEX idx_cursos_nivel_id ON cursos(nivel_id);
CREATE INDEX idx_cursos_activo ON cursos(activo);
CREATE INDEX idx_cursos_nombre ON cursos(nombre);
CREATE INDEX idx_cursos_abreviatura ON cursos(abreviatura);
```

---

## 🔧 **API BACKEND**

### **Endpoints Disponibles:**

#### **GET /api/cursos**

- **Descripción**: Listar cursos con filtros y paginación
- **Parámetros**: `page`, `limit`, `search`, `nivel_id`, `activo`
- **Respuesta**: Lista paginada con datos de cursos y niveles

#### **GET /api/cursos/:id**

- **Descripción**: Obtener curso específico por ID
- **Respuesta**: Datos completos del curso con información del nivel

#### **POST /api/cursos**

- **Descripción**: Crear nuevo curso
- **Body**: `{ nombre, descripcion, abreviatura, nivel_id, activo }`
- **Archivos**: Imagen opcional (multipart/form-data)

#### **PUT /api/cursos/:id**

- **Descripción**: Actualizar curso existente
- **Body**: `{ nombre, descripcion, abreviatura, nivel_id, activo }`
- **Archivos**: Nueva imagen opcional

#### **DELETE /api/cursos/:id**

- **Descripción**: Eliminar curso
- **Efectos**: Elimina registro y archivo de imagen asociado

#### **GET /api/cursos/niveles/lista**

- **Descripción**: Obtener lista de niveles para filtros
- **Respuesta**: `[{ id, nombre }]` de niveles activos

### **Validaciones Backend:**

- **Campos obligatorios**: nombre, abreviatura, nivel_id
- **Unicidad**: abreviatura única, nombre+nivel único
- **Existencia**: nivel_id debe existir en tabla niveles
- **Archivos**: Solo imágenes (JPEG, JPG, PNG, GIF, WEBP), máximo 5MB

---

## 🎨 **COMPONENTES FRONTEND**

### **CursosList.js**

- **Función**: Lista principal con filtros y paginación
- **Características**:
  - Grilla estándar con colores del sistema
  - Filtros por nivel y estado
  - Búsqueda por nombre/descripción/abreviatura
  - Menú contextual con opciones
  - Paginación completa

### **CursosForm.js**

- **Función**: Formulario para crear/editar cursos
- **Características**:
  - Modal responsivo
  - Subida de imágenes con fileService
  - Validaciones frontend en tiempo real
  - Campos: nombre, descripción, abreviatura, nivel, estado, imagen
  - Vista previa de imagen

### **CursosView.js**

- **Función**: Vista detallada de curso
- **Características**:
  - Modal con información completa
  - Imagen grande con fallback
  - Información del sistema (fechas, IDs)
  - Diseño en cards organizadas

---

## 🔗 **INTEGRACIÓN CON OTROS MÓDULOS**

### **Relaciones:**

- **Niveles**: `cursos.nivel_id` → `niveles.id`
- **Futuras**: Asignaturas, Horarios, Notas

### **Dependencias:**

- **Tabla niveles**: Debe existir antes de crear cursos
- **fileService**: Para subida de imágenes
- **AuthContext**: Para verificación de permisos

---

## 📊 **DATOS PREDEFINIDOS**

### **Cursos por Nivel Educativo:**

#### **Inicial (6 cursos):**

```javascript
[
  { nombre: "Comunicación", abreviatura: "COMI", nivel_id: 1 },
  { nombre: "Matemática", abreviatura: "MATI", nivel_id: 1 },
  { nombre: "Personal Social", abreviatura: "PESI", nivel_id: 1 },
  { nombre: "Ciencia y Ambiente", abreviatura: "CIAI", nivel_id: 1 },
  { nombre: "Arte", abreviatura: "ARTI", nivel_id: 1 },
  { nombre: "Psicomotricidad", abreviatura: "PSI", nivel_id: 1 },
];
```

#### **Primaria (8 cursos):**

```javascript
[
  { nombre: "Comunicación", abreviatura: "COMP", nivel_id: 2 },
  { nombre: "Matemática", abreviatura: "MATP", nivel_id: 2 },
  { nombre: "Personal Social", abreviatura: "PESP", nivel_id: 2 },
  { nombre: "Ciencia y Ambiente", abreviatura: "CIAP", nivel_id: 2 },
  { nombre: "Arte y Cultura", abreviatura: "ARTP", nivel_id: 2 },
  { nombre: "Educación Física", abreviatura: "EDFP", nivel_id: 2 },
  { nombre: "Inglés", abreviatura: "INGP", nivel_id: 2 },
  { nombre: "Religión", abreviatura: "RELP", nivel_id: 2 },
];
```

#### **Secundaria (10 cursos):**

```javascript
[
  { nombre: "Comunicación", abreviatura: "COMS", nivel_id: 3 },
  { nombre: "Matemática", abreviatura: "MATS", nivel_id: 3 },
  { nombre: "Historia, Geografía y Economía", abreviatura: "HGE", nivel_id: 3 },
  { nombre: "Ciencia, Tecnología y Ambiente", abreviatura: "CTA", nivel_id: 3 },
  { nombre: "Arte y Cultura", abreviatura: "ARTS", nivel_id: 3 },
  { nombre: "Educación Física", abreviatura: "EDFS", nivel_id: 3 },
  { nombre: "Inglés", abreviatura: "INGS", nivel_id: 3 },
  { nombre: "Religión", abreviatura: "RELS", nivel_id: 3 },
  { nombre: "Formación Ciudadana y Cívica", abreviatura: "FCC", nivel_id: 3 },
  { nombre: "Educación para el Trabajo", abreviatura: "EPT", nivel_id: 3 },
];
```

---

## 🎯 **PATRONES DE DISEÑO**

### **Colores Estándar:**

- **Header**: #61a7d1 (azul)
- **Filas alternadas**: blanco / #e7f1f8 (azul claro)
- **Hover**: #ffe6d9 (naranja suave)
- **Chips**: primary (azul), secondary (gris), success (verde), error (rojo)

### **Componentes UI:**

- **Typography h4** para títulos de módulo
- **Icono School** para header del módulo
- **Botón "Opciones"** con menú contextual
- **Avatar circular** para imágenes en lista
- **Chips de colores** para estados y categorías

### **Validaciones:**

- **Frontend**: Validación en tiempo real con mensajes de error
- **Backend**: Validaciones de unicidad y existencia
- **Archivos**: Validación de tipo y tamaño

---

## 🚀 **FUNCIONALIDADES FUTURAS**

### **Integraciones Planificadas:**

- **Asignaturas**: Relación docente-curso-grado
- **Horarios**: Asignación de cursos a horarios
- **Notas**: Sistema de calificaciones por curso
- **Reportes**: Estadísticas por curso y nivel

### **Mejoras Posibles:**

- **Categorización**: Agrupación de cursos por áreas
- **Prerequisitos**: Definir cursos que requieren otros
- **Carga horaria**: Horas semanales por curso
- **Evaluaciones**: Tipos de evaluación por curso

---

## 📝 **NOTAS TÉCNICAS**

### **Performance:**

- Índices en campos de búsqueda frecuente
- Paginación para listas grandes
- Optimización de consultas con JOINs

### **Seguridad:**

- Validación de archivos subidos
- Sanitización de inputs
- Verificación de permisos por rol

### **Mantenimiento:**

- Logs detallados en backend
- Manejo de errores con SweetAlert2
- Limpieza automática de archivos huérfanos

---

**Última actualización**: 2025-01-16
**Versión**: 1.0
**Estado**: ✅ Completamente funcional
**Mantenido por**: Equipo de desarrollo


