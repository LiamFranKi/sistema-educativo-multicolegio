# 📚 PATRÓN CRUD - ESTRUCTURA GENERAL

## 📋 Estructura Establecida

### **Objetivo:**

Unificar todos los mantenimientos (Usuarios, Configuración, etc.) bajo el mismo patrón para mantener consistencia y facilitar el desarrollo.

**NOTA IMPORTANTE:** El sistema es de un solo colegio. No existe el módulo de Colegios ni el rol Superadministrador.

**SISTEMA DE CONFIGURACIÓN:** Los datos del colegio se gestionan a través del módulo "Configuración" que permite editar nombre, logo, colores, director, fondos personalizables, etc.

**TEMAS DINÁMICOS:** El sistema incluye temas dinámicos basados en los colores del colegio configurados en el módulo de Configuración.

**SIDEBAR PERSONALIZADO:** El sidebar del dashboard muestra información del usuario logueado (nombre y foto) en lugar de la información del colegio.

**BARRA DE TÍTULO MEJORADA:** La barra de título incluye iconos de notificaciones y cerrar sesión en el lado derecho, con color consistente (#0165a1) que coincide con el sidebar.

**DASHBOARD CON ESTADÍSTICAS REALES:** El dashboard principal muestra estadísticas reales de usuarios por rol (Administradores, Docentes, Alumnos, Apoderados, Tutores) con 5 tarjetas responsivas que se cargan automáticamente desde la base de datos.

**DISEÑO VISUAL MEJORADO:** El sidebar y la barra de título tienen un diseño elegante con colores consistentes, iconos vibrantes con efectos visuales (sombras, animaciones hover), y scrollbar invisible para una experiencia de usuario premium.

**MÓDULO DE CONFIGURACIÓN OPTIMIZADO:** El módulo de Configuración ha sido optimizado con layout compacto, logo dinámico, layout de 2 columnas para colores y fondo, y vista previa mejorada para una mejor experiencia de usuario.

---

## 🏗️ **1. ESTRUCTURA DE CARPETAS**

### **Backend:**

```
backend/
├── config/
│   └── database.js              # Configuración de base de datos
├── middleware/
│   └── auth.js                  # Middleware de autenticación
├── migrations/                  # Scripts de migración de BD
│   ├── create_[tabla]_table.sql
│   └── add_[campo]_to_[tabla].sql
├── routes/                      # Rutas API
│   ├── usuarios.js
│   ├── avatars.js
│   ├── grados.js
│   └── areas.js
├── utils/                       # Utilidades
└── server.js                    # Servidor principal
```

### **Frontend:**

```
frontend/src/
├── pages/
│   ├── Mantenimientos/
│   │   ├── Usuarios/
│   │   │   ├── UsuariosList.js
│   │   │   ├── UsuariosForm.js
│   │   │   └── UsuariosView.js
│   │   ├── Avatars/
│   │   │   ├── AvatarsList.js
│   │   │   ├── AvatarsForm.js
│   │   │   └── AvatarsView.js
│   │   └── Grados/
│   │       ├── GradosList.js
│   │       ├── GradosForm.js
│   │       └── GradosView.js
│   ├── Configuracion/
│   │   └── ConfiguracionList.js
│   └── MiPerfil.js
├── components/
│   ├── Common/
│   │   ├── DataTable.js
│   │   ├── FormDialog.js
│   │   ├── ConfirmDialog.js
│   │   ├── SearchBar.js
│   │   └── ActionButtons.js
│   ├── Layout/
│   │   └── AdminLayout.js
│   └── Sidebar/
│       └── AdminSidebar.js
├── contexts/
│   ├── ConfiguracionContext.js
│   ├── ThemeContext.js
│   └── UserContext.js
├── utils/
│   └── imageUtils.js
└── services/
    └── apiService.js
```

---

## 📋 **2. PATRÓN DE NOMENCLATURA**

### **Archivos:**

- **Lista**: `[Modulo]List.js`
- **Formulario**: `[Modulo]Form.js`
- **Vista**: `[Modulo]View.js`
- **Rutas**: `[modulo].js` (minúscula)
- **Servicios**: `[modulo]Service` (camelCase)

### **Componentes:**

- **Páginas**: PascalCase (`UsuariosList`)
- **Componentes**: PascalCase (`DataTable`)
- **Servicios**: camelCase (`usuariosService`)
- **Rutas**: kebab-case (`/api/usuarios`)

### **Base de Datos:**

- **Tablas**: plural, snake_case (`usuarios`, `avatars`)
- **Campos**: snake_case (`nombre`, `fecha_creacion`)
- **Constraints**: prefijo + descripción (`uk_usuarios_email`)

---

## 🔄 **3. FLUJO DE DESARROLLO**

### **Paso 1: Base de Datos**

1. Crear script de migración en `backend/migrations/`
2. Ejecutar migración
3. Verificar estructura

### **Paso 2: Backend API**

1. Crear rutas en `backend/routes/[modulo].js`
2. Implementar CRUD endpoints
3. Agregar validaciones
4. Registrar rutas en `server.js`

### **Paso 3: Frontend**

1. Crear servicio en `apiService.js`
2. Crear componentes (List, Form, View)
3. Integrar en `AdminLayout.js`
4. Agregar al `AdminSidebar.js`

### **Paso 4: Documentación**

1. Actualizar `CHANGELOG.md`
2. Actualizar patrones
3. Crear documentación específica

---

**Última actualización**: 2025-01-16
**Versión**: 1.0
**Estado**: ✅ Patrón establecido y funcional
