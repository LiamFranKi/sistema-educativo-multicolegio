# PATRÓN UNIFICADO PARA MANTENIMIENTOS CRUD

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

**MÓDULO DE NIVELES EDUCATIVOS:** Implementación completa del CRUD para niveles educativos (Inicial, Primaria, Secundaria) con configuración avanzada: tipos de grados (Grados/Años), rango de grados (0-10), sistema dual de calificaciones (Cualitativa A-D/Cuantitativa 0-20), calificación final (Promedio/Porcentaje), notas configurables (mínima/máxima/aprobatoria), formulario optimizado con campos en líneas compactas, grilla actualizada con chips de colores, y accesibilidad mejorada con atributos HTML apropiados.

**MÓDULO DE GRADOS EDUCATIVOS - REDISEÑO RADICAL:** Sistema completamente rediseñado basado en niveles educativos con selección inteligente (Nivel → Grados disponibles), formato dinámico de nombres (Años: "03 años", Grados: "1° grado"), sistema de secciones (Unica, A, B, C, D, E, F), año escolar integrado, campos adicionales (dirección archivos, aula virtual), código automático generado, formulario paso a paso con validaciones en tiempo real, tabla actualizada con nuevas columnas, y lógica de negocio avanzada para prevención de duplicados.

**MÓDULO DE ÁREAS EDUCATIVAS:** Implementación completa del CRUD para áreas curriculares con 12 áreas predefinidas (Comunicación, Matemática, Ciencias, etc.), códigos únicos cortos (MAT, COM, ART), búsqueda por nombre/descripción/código, filtro por estado, paginación y validaciones de unicidad en backend. Notificaciones con SweetAlert2 y modo vista corregido para mostrar datos.

**MÓDULO DE TURNOS ESCOLARES:** Implementación completa del CRUD para turnos escolares con 3 turnos predefinidos (Mañana-M, Tarde-T, Noche-N), abreviaturas únicas, búsqueda por nombre/abreviatura, filtro por estado, paginación y validaciones de unicidad en backend. Integrado en módulo de Configuración siguiendo patrón de Años Escolares, con formulario simple (nombre y abreviatura), tabla profesional con chips de colores, y notificaciones con SweetAlert2.

---

## 📚 **MÓDULO DE NIVELES EDUCATIVOS - CONFIGURACIÓN AVANZADA**

### **Estructura de Datos:**

```javascript
// Campos base
{
  id: INTEGER,
  nombre: VARCHAR(100),      // "Inicial", "Primaria", "Secundaria"
  descripcion: TEXT,
  codigo: VARCHAR(10),       // "INI", "PRI", "SEC"
  orden: INTEGER,
  activo: BOOLEAN,

  // Configuración de Grados
  tipo_grados: VARCHAR(20),  // "Grados" | "Años"
  grado_minimo: INTEGER,     // 0-10
  grado_maximo: INTEGER,     // 0-10

  // Configuración de Calificaciones
  tipo_calificacion: VARCHAR(20), // "Cualitativa" | "Cuantitativa"
  calificacion_final: VARCHAR(20), // "Promedio" | "Porcentaje"
  nota_minima: VARCHAR(10),   // "A"-"D" | "0"-"20"
  nota_maxima: VARCHAR(10),   // "A"-"D" | "0"-"20"
  nota_aprobatoria: VARCHAR(10), // "A"-"D" | "0"-"20"

  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### **Configuración por Defecto:**

```javascript
// Inicial
{
  tipo_calificacion: "Cualitativa",
  calificacion_final: "Promedio",
  nota_minima: "D",
  nota_maxima: "A",
  nota_aprobatoria: "B"
}

// Primaria y Secundaria
{
  tipo_calificacion: "Cuantitativa",
  calificacion_final: "Porcentaje",
  nota_minima: "0",
  nota_maxima: "20",
  nota_aprobatoria: "11"
}
```

### **Formulario Optimizado:**

```javascript
// Estructura del formulario en líneas compactas
<Grid container spacing={2}>
  {/* Línea 1: Campos principales */}
  <Grid item xs={12} sm={4}>
    Nombre del Nivel
  </Grid>
  <Grid item xs={12} sm={4}>
    Código
  </Grid>
  <Grid item xs={12} sm={4}>
    Orden
  </Grid>

  {/* Línea 2: Descripción */}
  <Grid item xs={12}>
    Descripción
  </Grid>

  {/* Línea 3: Configuración de Grados */}
  <Grid item xs={12} sm={6}>
    Tipo Grados
  </Grid>
  <Grid item xs={12} sm={3}>
    Grado Mínimo
  </Grid>
  <Grid item xs={12} sm={3}>
    Grado Máximo
  </Grid>

  {/* Línea 4: Configuración de Calificaciones (5 campos en sm=2.4) */}
  <Grid item xs={12} sm={2.4}>
    Tipo Calificación
  </Grid>
  <Grid item xs={12} sm={2.4}>
    Calificación Final
  </Grid>
  <Grid item xs={12} sm={2.4}>
    Nota Mínima
  </Grid>
  <Grid item xs={12} sm={2.4}>
    Nota Máxima
  </Grid>
  <Grid item xs={12} sm={2.4}>
    Nota Aprobatoria
  </Grid>
</Grid>
```

### **Comboboxes Inteligentes:**

```javascript
// Lógica de opciones dinámicas
const getNotaOptions = (tipo) => {
  if (tipo === "Cualitativa") {
    return [
      { value: "A", label: "A" },
      { value: "B", label: "B" },
      { value: "C", label: "C" },
      { value: "D", label: "D" },
    ];
  } else {
    return Array.from({ length: 21 }, (_, i) => ({
      value: i.toString(),
      label: i.toString(),
    }));
  }
};

// Reset automático al cambiar tipo
const handleTipoChange = (newType) => {
  if (newType === "Cualitativa") {
    setFormData({
      ...formData,
      tipo_calificacion: newType,
      nota_minima: "D",
      nota_maxima: "A",
      nota_aprobatoria: "B",
    });
  } else {
    setFormData({
      ...formData,
      tipo_calificacion: newType,
      nota_minima: "0",
      nota_maxima: "20",
      nota_aprobatoria: "11",
    });
  }
};
```

### **Grilla Actualizada:**

```javascript
// Estructura de columnas
const columns = [
  { field: 'orden', headerName: 'Orden', width: 80 },
  { field: 'nombre', headerName: 'Nombre', width: 150 },
  { field: 'tipo_grados', headerName: 'Tipo Grados', width: 120 },
  { field: 'grados', headerName: 'Grados', width: 100 }, // "1-6"
  { field: 'tipo_calificacion', headerName: 'Tipo Calificación', width: 150 },
  { field: 'calificacion_final', headerName: 'Calificación Final', width: 150 },
  { field: 'activo', headerName: 'Estado', width: 100 },
  { field: 'actions', headerName: 'Acciones', width: 150 }
];

// Chips de colores
<Chip
  label={row.tipo_grados}
  color="primary"
  variant="outlined"
/>
<Chip
  label={row.tipo_calificacion}
  color={row.tipo_calificacion === 'Cualitativa' ? 'secondary' : 'success'}
  variant="outlined"
/>
```

---

## 🎓 **MÓDULO DE GRADOS EDUCATIVOS - REDISEÑO RADICAL**

### **Estructura de Datos:**

```javascript
// Campos del grado (estructura actualizada)
{
  id: INTEGER,
  nombre: VARCHAR(100),           // Generado automáticamente: "03 años", "1° grado"
  descripcion: TEXT,              // Opcional
  codigo: VARCHAR(20),            // Generado automáticamente: "INI03A", "PRI01"
  nivel_id: INTEGER,              // FK a niveles
  seccion: VARCHAR(10),           // "Unica", "A", "B", "C", "D", "E", "F"
  anio_escolar: INTEGER,          // Año escolar del grado
  direccion_archivos: TEXT,       // Ruta de archivos (opcional)
  link_aula_virtual: TEXT,        // URL aula virtual (opcional)
  foto: VARCHAR(255),             // Imagen del grado
  orden: INTEGER,                 // Número del grado (1, 2, 3...)
  activo: BOOLEAN,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### **Lógica de Generación de Nombres:**

```javascript
// Basado en tipo_grados del nivel
if (nivel.tipo_grados === "Años") {
  // Formato: "03 años", "04 años", "05 años"
  nombre = `${numero.toString().padStart(2, "0")} años`;
} else if (nivel.tipo_grados === "Grados") {
  // Formato: "1° grado", "2° grado", "3° grado"
  nombre = `${numero}° grado`;
}
```

### **Sistema de Secciones:**

```javascript
// Array fijo reutilizable
const SECCIONES_DISPONIBLES = [
  { value: "Unica", label: "Única", orden: 1 },
  { value: "A", label: "A", orden: 2 },
  { value: "B", label: "B", orden: 3 },
  { value: "C", label: "C", orden: 4 },
  { value: "D", label: "D", orden: 5 },
  { value: "E", label: "E", orden: 6 },
  { value: "F", label: "F", orden: 7 },
];
```

### **Formulario Paso a Paso:**

```javascript
// 1. Selección de Nivel
<FormControl fullWidth>
  <InputLabel>Nivel Educativo *</InputLabel>
  <Select value={nivel_id} onChange={handleNivelChange}>
    {niveles.map(nivel => (
      <MenuItem key={nivel.id} value={nivel.id}>
        <Box>
          <Typography>{nivel.nombre}</Typography>
          <Typography variant="caption">
            {nivel.tipo_grados} ({nivel.grado_minimo}-{nivel.grado_maximo})
          </Typography>
        </Box>
      </MenuItem>
    ))}
  </Select>
</FormControl>

// 2. Selección de Grado (dinámico según nivel)
<FormControl fullWidth disabled={!nivel_id}>
  <InputLabel>Grado *</InputLabel>
  <Select value={numero_grado} onChange={handleGradoChange}>
    {gradosOptions.map(grado => (
      <MenuItem key={grado.value} value={grado.value}>
        {grado.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>

// 3. Selección de Sección
<FormControl fullWidth>
  <InputLabel>Sección *</InputLabel>
  <Select value={seccion} onChange={handleSeccionChange}>
    {secciones.map(seccion => (
      <MenuItem key={seccion.value} value={seccion.value}>
        {seccion.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>

// 4. Año Escolar (con prioridad al actual)
<FormControl fullWidth>
  <InputLabel>Año Escolar *</InputLabel>
  <Select value={anio_escolar} onChange={handleAnioChange}>
    {aniosEscolares.map(anio => (
      <MenuItem key={anio.anio} value={anio.anio}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontWeight={anio.anio === anioActual ? 'bold' : 'normal'}>
            {anio.anio}
          </Typography>
          {anio.anio === anioActual && (
            <Chip label="Actual" size="small" color="primary" />
          )}
        </Box>
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

### **Tabla Actualizada:**

```javascript
// Estructura de columnas
const columns = [
  { field: 'foto', headerName: 'Foto', width: 80 },
  { field: 'nombre', headerName: 'Grado', width: 150 },
  { field: 'seccion', headerName: 'Sección', width: 100 },
  { field: 'anio_escolar', headerName: 'Año', width: 80 },
  { field: 'nivel_nombre', headerName: 'Nivel', width: 120 },
  { field: 'activo', headerName: 'Estado', width: 100 },
  { field: 'actions', headerName: 'Acciones', width: 150 }
];

// Chips de colores
<Chip
  label={grado.seccion || 'Única'}
  color="secondary"
  variant="outlined"
/>
<Chip
  label={grado.nivel_nombre}
  color={getNivelColor(grado.nivel_id)}
/>
```

### **Validaciones Backend:**

```javascript
// Validaciones en backend
- Nivel, número de grado, sección y año escolar son requeridos
- Número de grado debe estar en rango del nivel (grado_minimo - grado_maximo)
- No puede existir grado duplicado (mismo nivel, número, sección y año)
- Código generado automáticamente basado en nivel, grado y sección
- Validación de existencia de nivel y año escolar
```

### **Nuevas Rutas API:**

```javascript
// Rutas específicas para el nuevo sistema
GET /api/grados/niveles/disponibles          // Niveles activos
GET /api/grados/grados-por-nivel/:nivel_id  // Opciones de grados por nivel
GET /api/grados/secciones/disponibles       // Secciones disponibles
GET /api/grados/anios-escolares             // Años escolares activos
```

---

## 🕒 **MÓDULO DE TURNOS ESCOLARES**

### **Estructura de Datos:**

```javascript
// Campos del turno
{
  id: INTEGER,
  nombre: VARCHAR(100),      // "Mañana", "Tarde", "Noche"
  abreviatura: VARCHAR(10),  // "M", "T", "N"
  activo: BOOLEAN,           // true/false
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### **Configuración por Defecto:**

```javascript
// Turnos predefinidos
[
  { nombre: "Mañana", abreviatura: "M", activo: true },
  { nombre: "Tarde", abreviatura: "T", activo: true },
  { nombre: "Noche", abreviatura: "N", activo: true },
];
```

### **Formulario Simple:**

```javascript
// Estructura del formulario
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Nombre del Turno"
      value={turnoForm.nombre}
      onChange={(e) => handleTurnoInputChange("nombre", e.target.value)}
      required
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="Abreviatura"
      value={turnoForm.abreviatura}
      onChange={(e) =>
        handleTurnoInputChange("abreviatura", e.target.value.toUpperCase())
      }
      inputProps={{ maxLength: 10 }}
      required
    />
  </Grid>
</Grid>
```

### **Tabla Profesional:**

```javascript
// Estructura de columnas
const columns = [
  { field: 'nombre', headerName: 'Nombre', width: 200 },
  { field: 'abreviatura', headerName: 'Abreviatura', width: 120 },
  { field: 'activo', headerName: 'Estado', width: 100 },
  { field: 'actions', headerName: 'Acciones', width: 150 }
];

// Chips de colores
<Chip
  label={turno.abreviatura}
  color="primary"
  variant="outlined"
/>
<Chip
  label={turno.activo ? 'Activo' : 'Inactivo'}
  color={turno.activo ? 'success' : 'error'}
  variant="outlined"
/>
```

### **Validaciones Backend:**

```javascript
// Validaciones en backend
- Nombre único en la tabla
- Abreviatura única en la tabla
- Campos requeridos (nombre, abreviatura)
- Abreviatura máximo 10 caracteres
- Estado activo por defecto
```

**FORMATO DE GRILLA/TABLA:** Conversión de módulos de Configuración a formato de tabla profesional para ahorro de espacio y mejor escalabilidad, siguiendo el patrón establecido de otros módulos de mantenimiento.

**SISTEMA DE GAMIFICACIÓN EDUCATIVA (FUTURO):** Planificación de un sistema de gamificación que convertirá cada bimestre en un "mundo" explorable estilo videojuego, con progresión lineal, elementos lúdicos (retos, puntos, avatares), y experiencia inmersiva para motivar el aprendizaje de los estudiantes.

**PWA (PROGRESSIVE WEB APP) - FUTURO:** Planificación para convertir el sistema web en aplicación móvil instalable con funcionalidad offline, notificaciones push, y experiencia nativa en dispositivos móviles.

**JUEGOS INTERACTIVOS EDUCATIVOS (FUTURO):** Desarrollo de mini-juegos educativos, simuladores virtuales, y elementos lúdicos integrados al sistema de aprendizaje para aumentar el engagement y motivación de los estudiantes.

---

## 🗂️ **1. ESTRUCTURA DE CARPETAS**

```
frontend/src/
├── pages/
│   ├── Mantenimientos/
│   │   ├── Usuarios/
│   │   │   ├── UsuariosList.js      # Lista principal con tabla
│   │   │   ├── UsuarioForm.js       # Formulario (Nuevo/Editar)
│   │   │   └── UsuarioView.js       # Vista detallada (solo lectura)
│   │   ├── Grados/
│   │   │   ├── GradosList.js          # Lista principal
│   │   │   ├── GradosForm.js          # Formulario (Nuevo/Editar)
│   │   │   └── GradosView.js          # Vista de solo lectura
│   │   └── Areas/
│   │       ├── AreasList.js           # Lista principal
│   │       ├── AreasForm.js           # Formulario (Nuevo/Editar)
│   │       └── index.js               # Exportaciones
│   ├── Configuracion/
│   │   └── ConfiguracionList.js     # Configuración del colegio
│   └── MiPerfil.js                  # Módulo de perfil de usuario
├── components/
│   └── Common/
│       ├── DataTable.js             # Tabla reutilizable con paginación
│       ├── FormDialog.js            # Modal de formulario
│       ├── ConfirmDialog.js         # Modal de confirmación
│       ├── SearchBar.js             # Barra de búsqueda
│       └── ActionButtons.js         # Botones de acción (Editar, Eliminar, Ver)
├── contexts/
│   ├── ConfiguracionContext.js      # Contexto global de configuración del colegio
│   ├── ThemeContext.js              # Contexto de tema dinámico
│   └── UserContext.js               # Contexto global de datos de usuario
├── utils/
│   └── imageUtils.js                # Utilidades para URLs de imágenes
└── services/
    └── apiService.js                # Servicios API (incluye configuracionService)
```

---

## 🎯 **2. PATRÓN DE COMPONENTES**

### **A) Lista (List.js) - Componente Principal**

```javascript
// Características:
- Tabla con paginación
- Barra de búsqueda
- Filtros por estado/rol/etc.
- Botones de acción por fila
- Botón "Nuevo" en header
- Filtros contextuales (ej. `nivel` para Grados)
- Loading states
- Manejo de errores
```

### **B) Formulario (Form.js) - Modal Reutilizable**

```javascript
// Características:
- Modal que se abre/cierra
- Validaciones con react-hook-form
- Botones: Guardar, Cancelar
- Manejo de errores de API
- Loading durante guardado
- Modo: 'create' o 'edit'
- Soporte de campos derivados (ej. generar `codigo` por `nivel` + `orden`)
```

### **C) Vista (View.js) - Modal de Solo Lectura**

```javascript
// Características:
- Modal de solo lectura
- Información detallada del registro
- Botones: Editar, Cerrar
- Formato de datos legible
```

---

## ⚙️ **2.5. SISTEMA DE CONFIGURACIÓN**

### **A) ConfiguracionContext.js - Contexto Global**

```javascript
// Características:
- Estado global del colegio
- Funciones de actualización
- URLs de imágenes construidas correctamente
- Sincronización con backend
```

### **B) ThemeContext.js - Tema Dinámico**

```javascript
// Características:
- Generación dinámica de tema Material-UI
- Colores basados en configuración del colegio
- Aplicación automática en toda la aplicación
- Actualización en tiempo real
```

### **C) imageUtils.js - Utilidades de Imágenes**

```javascript
// Características:
- Construcción de URLs completas
- Manejo de URLs existentes
- Consistencia en toda la aplicación
- Funciones reutilizables
```

### **D) UserContext.js - Contexto Global de Usuario**

```javascript
// Características:
- Estado global de datos del usuario logueado
- Funciones de actualización y sincronización
- Carga de datos frescos desde el servidor
- Sincronización con localStorage
- Actualización automática de la interfaz
- Integración con MiPerfil y sidebar
```

### **E) ConfiguracionList.js - Módulo de Configuración**

```javascript
// Características:
- Edición inline de campos
- Subida de archivos con preview
- Validaciones en tiempo real
- Actualización inmediata de la interfaz
- Fondos personalizables (color/imagen)
```

### **F) AdminDashboard.js - Dashboard Principal**

```javascript
// Características:
- Estadísticas reales de usuarios por rol
- 5 tarjetas responsivas (Administradores, Docentes, Alumnos, Apoderados, Tutores)
- Carga automática de datos al inicializar
- Layout responsive con CSS Grid
- Loading spinner durante carga
- Manejo de errores con toast notifications
- Logging detallado para debugging
```

### **G) MiPerfil.js - Módulo de Perfil de Usuario**

```javascript
// Características:
- Gestión completa de datos personales del usuario
- Nuevos campos: apellidos, dirección, género, estado civil, profesión
- Subida de foto con preview inmediato
- Cambio de contraseña con validación
- Actualización en tiempo real del sidebar
- Formulario responsivo con validaciones
- Integración con UserContext para sincronización global
```

---

## 👤 **2.6. PATRÓN DE MÓDULO MI PERFIL**

### **A) Estructura del Componente MiPerfil.js**

```javascript
// Estados principales:
const [editing, setEditing] = useState(false);
const [showPasswords, setShowPasswords] = useState(false);
const [previewImage, setPreviewImage] = useState("");
const [formData, setFormData] = useState({
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
});

// Integración con UserContext:
const { user, updateUser } = useUser();
```

### **B) Gestión de Datos Personales**

```javascript
// Carga de datos del usuario:
const loadUserData = useCallback(() => {
  if (user) {
    setFormData({
      nombres: user.nombres || "",
      apellidos: user.apellidos || "",
      dni: user.dni || "",
      email: user.email || "",
      telefono: user.telefono || "",
      fecha_nacimiento: user.fecha_nacimiento || "",
      direccion: user.direccion || "",
      genero: user.genero || "",
      estado_civil: user.estado_civil || "",
      profesion: user.profesion || "",
      foto: user.foto || "",
    });
  }
}, [user]);

// Actualización de perfil:
const handleSaveProfile = async () => {
  if (!validateForm()) {
    toast.error("Por favor corrige los errores en el formulario");
    return;
  }

  const response = await userService.updateUser(userId, formData);
  if (response.success) {
    toast.success("Perfil actualizado correctamente");
    updateUser(response.user); // Actualizar contexto global
    setEditing(false);
  }
};
```

### **C) Subida de Foto con Preview**

```javascript
// Manejo de subida de imagen:
const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validaciones
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

    // Subida real
    const response = await fileService.uploadFile(file, "profile");
    if (response.success) {
      setFormData((prev) => ({ ...prev, foto: response.filename }));
      toast.success("Foto actualizada correctamente");
      updateUser({ ...user, foto: response.filename });
    }
  }
};
```

### **D) Cambio de Contraseña**

```javascript
// Estados para contraseñas:
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

// Validación de contraseñas:
const validatePasswordForm = () => {
  const errors = {};
  if (!currentPassword) errors.currentPassword = "Contraseña actual requerida";
  if (!newPassword) errors.newPassword = "Nueva contraseña requerida";
  if (newPassword.length < 6) errors.newPassword = "Mínimo 6 caracteres";
  if (newPassword !== confirmPassword)
    errors.confirmPassword = "Las contraseñas no coinciden";
  setErrors(errors);
  return Object.keys(errors).length === 0;
};

// Cambio de contraseña:
const handlePasswordChange = async () => {
  if (!validatePasswordForm()) return;

  const response = await userService.changePassword(userId, {
    currentPassword,
    newPassword,
  });

  if (response.success) {
    toast.success("Contraseña actualizada correctamente");
    setShowPasswords(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }
};
```

### **E) Validaciones del Formulario**

```javascript
// Validación general del formulario:
const validateForm = () => {
  const errors = {};

  if (!formData.nombres.trim()) errors.nombres = "Nombres requeridos";
  if (!formData.email.trim()) errors.email = "Email requerido";
  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email inválido";
  }
  if (formData.telefono && formData.telefono.length < 9) {
    errors.telefono = "Teléfono inválido";
  }

  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### **F) Integración con UserContext**

```javascript
// En UserContext.js:
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

  return (
    <UserContext.Provider value={{ user, updateUser, loadUserData }}>
      {children}
    </UserContext.Provider>
  );
};
```

### **G) Actualización en Tiempo Real del Sidebar**

```javascript
// En AdminSidebar.js:
const { user } = useUser();

// Mostrar nombre completo:
<Typography variant="h6">
  {user?.nombres && user?.apellidos
    ? `${user.nombres} ${user.apellidos}`
    : user?.nombres || 'Administrador'
  }
</Typography>

// Mostrar foto actualizada:
<Avatar
  src={getImageUrl(user?.foto)}
  sx={{ width: 80, height: 80 }}
/>
```

---

## 📊 **2.7. PATRÓN DE DASHBOARD CON ESTADÍSTICAS**

### **A) AdminDashboard.js - Dashboard Principal**

```javascript
// Estados del dashboard:
const [stats, setStats] = useState({
  administradores: 0,
  docentes: 0,
  alumnos: 0,
  apoderados: 0,
  tutores: 0,
});
const [loading, setLoading] = useState(true);

// Carga automática de estadísticas:
useEffect(() => {
  loadUserStats();
}, []);

// Función de carga de estadísticas:
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

### **B) Layout Responsivo con CSS Grid**

```javascript
// Grid responsive para 5 tarjetas:
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

### **C) Tarjetas de Estadísticas**

```javascript
// Patrón de tarjeta de estadística:
<Card
  sx={{
    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
    color: "white",
    textAlign: "center",
    p: 3,
    borderRadius: 2,
    boxShadow: 3,
    "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2,
    }}
  >
    <AdminPanelSettingsIcon sx={{ fontSize: 40, mr: 1 }} />
  </Box>
  <Typography variant="h4" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
    {loading ? (
      <CircularProgress size={24} color="inherit" />
    ) : (
      stats.administradores
    )}
  </Typography>
  <Typography variant="h6" sx={{ opacity: 0.9 }}>
    Administradores
  </Typography>
</Card>
```

### **D) Colores de Tarjetas**

```javascript
// Colores específicos por rol:
const cardColors = {
  administradores: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)", // Azul
  docentes: "linear-gradient(135deg, #dc004e 0%, #c2185b 100%)", // Rojo
  alumnos: "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)", // Verde
  apoderados: "linear-gradient(135deg, #ed6c02 0%, #f57c00 100%)", // Naranja
  tutores: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)", // Morado
};
```

### **E) Manejo de Errores y Loading**

```javascript
// Loading spinner global:
{
  loading && (
    <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
      <CircularProgress size={60} />
    </Box>
  );
}

// Manejo de errores:
try {
  const response = await userService.getUsers();
  // ... procesar datos
} catch (error) {
  console.error("Error cargando estadísticas:", error);
  toast.error("Error al cargar estadísticas de usuarios");
}
```

---

## 🔐 **2.8. PATRÓN DE GESTIÓN DE PERMISOS (USUARIOS)**

### **Objetivo:**
Modal independiente para actualizar únicamente Rol y Contraseña de un usuario, sin afectar otros campos.

### **Frontend (UsuariosList / UsuarioPermisosForm):**
- Abrir desde menú de opciones: acción "Gestionar Permisos".
- Campos del modal:
  - Select Rol (valores permitidos, ver lista más abajo).
  - Nueva Contraseña (opcional).
  - Confirmar Contraseña (requerido solo si se cambia contraseña).
- Validaciones:
  - Rol obligatorio.
  - Contraseña mínima 6 caracteres solo si se ingresa.
  - Confirmación debe coincidir solo si se ingresa contraseña.
- Accesibilidad: asociar `InputLabel`↔`Select` con `labelId`, y añadir `id`/`name` a inputs.
- Rendimiento/UX: no cerrar el menú antes de abrir el modal; memoizar handlers.

### **Backend (Ruta específica):**
- `PUT /api/usuarios/:id/permisos` (solo Administrador).
- Permite actualizar selectivamente:
  - `rol` (valores validados).
  - `clave` (hash con bcrypt; solo si se envía).
- Respuestas claras:
  - 400 si `rol` inválido o sin datos a actualizar.
  - 404 si usuario no existe.
  - 200 con usuario actualizado si OK.

### **Lista de Roles permitidos (alineación FE/BE/BD):**
`Administrador`, `Docente`, `Alumno`, `Apoderado`, `Tutor`, `Psicologia`, `Secretaria`, `Director`, `Promotor`.

### **Base de Datos:**
- Constraint CHECK de `usuarios.rol` debe incluir todos los roles anteriores.
- Migración recomendada: `ALTER TABLE usuarios DROP CONSTRAINT ...; ADD CONSTRAINT ... CHECK (rol IN (...))`.

---

## 🛣️ **3. PATRÓN DE RUTAS**

### **⚠️ IMPORTANTE: CONSISTENCIA DE RUTAS**

**CRÍTICO:** Las rutas en el sidebar y en AdminLayout DEBEN coincidir exactamente para que la navegación funcione.

```javascript
// En AdminSidebar.js - Menú del sidebar
const menuItems = [
  { text: "Usuarios", icon: <PeopleIcon />, path: "/dashboard/usuarios" },
  { text: "Colegios", icon: <SchoolIcon />, path: "/dashboard/colegios" },
  // ... otros items
];

// En AdminLayout.js - Rutas del router
<Routes>
  <Route path="/dashboard/usuarios" element={<UsuariosList />} />
  <Route path="/dashboard/usuarios/nuevo" element={<UsuariosList />} />
  <Route path="/dashboard/usuarios/editar/:id" element={<UsuariosList />} />
  <Route path="/dashboard/usuarios/ver/:id" element={<UsuariosList />} />

  <Route path="/dashboard/colegios" element={<ColegiosList />} />
  <Route path="/dashboard/colegios/nuevo" element={<ColegiosList />} />
  <Route path="/dashboard/colegios/editar/:id" element={<ColegiosList />} />
  <Route path="/dashboard/colegios/ver/:id" element={<ColegiosList />} />
</Routes>;
```

### **🔧 ESTRUCTURA DE RUTAS ESTÁNDAR:**

```javascript
// Patrón para cada mantenimiento:
/dashboard/{entidad}                    // Lista principal
/dashboard/{entidad}/nuevo              // Crear nuevo
/dashboard/{entidad}/editar/:id         // Editar existente
/dashboard/{entidad}/ver/:id            // Ver detalle
```

### **✅ VERIFICACIÓN OBLIGATORIA:**

Antes de implementar cualquier mantenimiento, verificar que:

1. **Ruta en sidebar** = **Ruta en AdminLayout**
2. **Ambas usen el prefijo** `/dashboard/`
3. **Nombres de entidad** coincidan exactamente
4. **Probar navegación** haciendo clic en el menú

---

## 🔌 **4. PATRÓN DE SERVICIOS API**

```javascript
// En apiService.js - Para cada entidad
export const usuariosAPI = {
  getAll: (params) => api.get("/usuarios", { params }),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post("/usuarios", data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
  search: (query) => api.get(`/usuarios/search?q=${query}`),
};

export const colegiosAPI = {
  getAll: (params) => api.get("/colegios", { params }),
  getById: (id) => api.get(`/colegios/${id}`),
  create: (data) => api.post("/colegios", data),
  update: (id, data) => api.put(`/colegios/${id}`, data),
  delete: (id) => api.delete(`/colegios/${id}`),
  search: (query) => api.get(`/colegios/search?q=${query}`),
};

// Ejemplo: Grados
export const gradosAPI = {
  getAll: (params) => api.get("/grados", { params }),
  getById: (id) => api.get(`/grados/${id}`),
  create: (data) => api.post("/grados", data),
  update: (id, data) => api.put(`/grados/${id}`, data),
  delete: (id) => api.delete(`/grados/${id}`),
  getByNivel: (nivelId) => api.get(`/grados/nivel/${nivelId}`),
};
```

---

## 📊 **5. PATRÓN DE ESTADOS**

```javascript
// Estados que se repetirán en todos los mantenimientos
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [selectedItem, setSelectedItem] = useState(null);
const [dialogOpen, setDialogOpen] = useState(false);
const [dialogMode, setDialogMode] = useState("create"); // 'create', 'edit', 'view'
const [pagination, setPagination] = useState({
  page: 0,
  rowsPerPage: 10,
  total: 0,
});
const [filters, setFilters] = useState({ nivel_id: "", search: "" });
```

---

## ⚙️ **6. FUNCIONES COMUNES**

```javascript
// Funciones que se repetirán en todos los mantenimientos

// Abrir modal para crear nuevo registro
const handleCreate = () => {
  setSelectedItem(null);
  setDialogMode("create");
  setDialogOpen(true);
};

// Abrir modal para editar registro
const handleEdit = (item) => {
  setSelectedItem(item);
  setDialogMode("edit");
  setDialogOpen(true);
};

// Abrir modal para ver registro
const handleView = (item) => {
  setSelectedItem(item);
  setDialogMode("view");
  setDialogOpen(true);
};

// Eliminar registro con confirmación
const handleDelete = async (id) => {
  if (window.confirm("¿Está seguro de eliminar este registro?")) {
    try {
      await api.delete(`/entidad/${id}`);
      await loadData(); // Recargar datos
      toast.success("Registro eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el registro");
    }
  }
};

// Cerrar modal
const handleCloseDialog = () => {
  setDialogOpen(false);
  setSelectedItem(null);
};

// Guardar datos (crear o actualizar)
const handleSave = async (formData) => {
  try {
    if (dialogMode === "create") {
      await api.post("/entidad", formData);
      toast.success("Registro creado correctamente");
    } else {
      await api.put(`/entidad/${selectedItem.id}`, formData);
      toast.success("Registro actualizado correctamente");
    }
    handleCloseDialog();
    await loadData(); // Recargar datos
  } catch (error) {
    toast.error("Error al guardar el registro");
  }
};

// Ejemplo de filtro por nivel (Grados)
const handleNivelFilter = (event) => {
  setFilters((prev) => ({ ...prev, nivel_id: event.target.value }));
  setPagination((prev) => ({ ...prev, page: 0 }));
};
```

---

## 🎨 **7. COMPONENTES REUTILIZABLES**

### **DataTable.js**

```javascript
// Tabla reutilizable con:
- Columnas configurables
- Paginación
- Ordenamiento
- Selección de filas
- Acciones por fila
```

### **FormDialog.js**

```javascript
// Modal de formulario con:
- Título dinámico
- Formulario configurable
- Botones de acción
- Validaciones
- Loading states
```

### **ConfirmDialog.js**

```javascript
// Modal de confirmación con:
- Mensaje personalizable
- Botones: Confirmar, Cancelar
- Callback de confirmación
```

---

## 📝 **8. CONVENCIONES DE NOMBRES**

### **Archivos:**

- `EntidadList.js` - Lista principal
- `EntidadForm.js` - Formulario
- `EntidadView.js` - Vista detallada
  // Para Grados:
- `GradosList.js`, `GradosForm.js`, `GradosView.js`

### **Variables:**

- `data` - Array de datos
- `loading` - Estado de carga
- `selectedItem` - Item seleccionado
- `dialogOpen` - Estado del modal
- `dialogMode` - Modo del modal

### **Funciones:**

- `handleCreate()` - Crear nuevo
- `handleEdit(item)` - Editar item
- `handleView(item)` - Ver item
- `handleDelete(id)` - Eliminar por ID
- `handleSave(data)` - Guardar datos
- `loadData()` - Cargar datos

---

## 🚀 **9. IMPLEMENTACIÓN PASO A PASO**

### **Para cada mantenimiento:**

1. **Crear carpeta** en `pages/Mantenimientos/`
2. **Crear 3 archivos:** List.js, Form.js, View.js
3. **Agregar rutas** en el Layout correspondiente
4. **Crear API service** en apiService.js
5. **Implementar funciones comunes**
6. **Usar componentes reutilizables**
7. **Aplicar validaciones**
8. **Probar funcionalidad completa**
9. **Para Grados**: generar `codigo` automáticamente según `nivel` y `orden`

---

## ✅ **10. CHECKLIST DE IMPLEMENTACIÓN**

- [ ] Estructura de carpetas creada
- [ ] Componentes List, Form, View implementados
- [ ] **Rutas configuradas y VERIFICADAS** (sidebar = AdminLayout)
- [ ] **Navegación probada** (clic en menú funciona)
- [ ] API service creado
- [ ] Estados y funciones comunes implementadas
- [ ] Componentes reutilizables utilizados
- [ ] Validaciones aplicadas
- [ ] Manejo de errores implementado
- [ ] Loading states configurados
- [ ] Notificaciones (toast) implementadas
- [ ] Responsive design aplicado
- [ ] Pruebas de funcionalidad realizadas

---

## 📚 **11. EJEMPLOS DE USO**

### **Usuarios:**

- Lista: Tabla con DNI, nombres, email, rol, estado
- Formulario: Campos de usuario con validaciones
- Vista: Información completa del usuario

### **Colegios:**

- Lista: Tabla con nombre, código, dirección, estado
- Formulario: Datos del colegio con logo
- Vista: Información completa del colegio

### **Años Escolares:**

- Lista: Tabla con año, colegio, estado
- Formulario: Selección de año y colegio
- Vista: Detalles del año escolar

### **Grados:**

- Lista: Tabla con nombre, código (Chip), nivel (Chip por color), orden y estado
- Formulario: Campos nombre, nivel (Select), orden (number), descripción, activo; `codigo` auto-generado y deshabilitado
- Vista: Lectura de datos con nombre de nivel y metadatos

---

**Fecha de creación:** 2024-12-19
**Versión:** 1.0
**Estado:** ✅ Establecido y listo para implementación

 
 - - - 
 
 # #     * * P R O B L E M A S   C O M U N E S   Y   S O L U C I O N E S * * 
 
 # # #   * *   P R O B L E M A   1 :   E r r o r   \ d a t a . m a p   i s   n o t   a   f u n c t i o n \ * * 
 
 * * S � n t o m a : * *   E r r o r   e n   c o n s o l a   c u a n d o   s e   i n t e n t a   h a c e r   \ . m a p ( ) \   s o b r e   d a t o s   q u e   n o   s o n   a r r a y . 
 
 * * C a u s a : * *   L a   A P I   d e v u e l v e   d a t o s   e n   f o r m a t o   i n e s p e r a d o   o   f a l l a   l a   c o n e x i � n . 
 
 * * S o l u c i � n : * * 
 \ \ \ j a v a s c r i p t 
 / /     P r o b l e m � t i c o : 
 s e t D a t a ( r e s p o n s e . d a t a   | |   r e s p o n s e ) ; 
 
 / /     C o r r e c t o : 
 c o n s t   u s e r s D a t a   =   A r r a y . i s A r r a y ( r e s p o n s e . u s u a r i o s )   ?   r e s p o n s e . u s u a r i o s   : 
                                   A r r a y . i s A r r a y ( r e s p o n s e . d a t a )   ?   r e s p o n s e . d a t a   : 
                                   A r r a y . i s A r r a y ( r e s p o n s e )   ?   r e s p o n s e   :   [ ] ; 
 s e t D a t a ( u s e r s D a t a ) ; 
 \ \ \ 
 
 * * P r e v e n c i � n : * *   S i e m p r e   v a l i d a r   q u e   l o s   d a t o s   s e a n   a r r a y   a n t e s   d e   a s i g n a r l o s . 
 
 - - - 
 
 # # #   * *   P R O B L E M A   2 :   E r r o r   \ 
 e n d e r I n p u t   i s   n o t   a   f u n c t i o n \   e n   D a t e P i c k e r * * 
 
 * * S � n t o m a : * *   E r r o r   e n   c o n s o l a   r e l a c i o n a d o   c o n   D a t e P i c k e r   d e   M a t e r i a l - U I . 
 
 * * C a u s a : * *   I n c o m p a t i b i l i d a d   e n t r e   v e r s i o n e s   d e   \ @ m u i / x - d a t e - p i c k e r s \   y   s i n t a x i s   u t i l i z a d a . 
 
 * * S o l u c i � n : * * 
 \ \ \ j a v a s c r i p t 
 / /     P r o b l e m � t i c o   ( D a t e P i c k e r   c o m p l e j o ) : 
 < D a t e P i c k e r 
     l a b e l = \ 
 
 F e c h a \ 
     v a l u e = { d a t e } 
     o n C h a n g e = { h a n d l e D a t e C h a n g e } 
     s l o t P r o p s = { { . . . } } 
 / > 
 
 / /     C o r r e c t o   ( T e x t F i e l d   s i m p l e ) : 
 < T e x t F i e l d 
     f u l l W i d t h 
     l a b e l = \ F e c h a 
 
 d e 
 
 n a c i m i e n t o \ 
     t y p e = \ d a t e \ 
     v a l u e = { d a t e   ?   d a t e . t o I S O S t r i n g ( ) . s p l i t ( ' T ' ) [ 0 ]   :   ' ' } 
     o n C h a n g e = { ( e )   = >   { 
         c o n s t   n e w D a t e   =   e . t a r g e t . v a l u e   ?   n e w   D a t e ( e . t a r g e t . v a l u e )   :   n u l l ; 
         h a n d l e D a t e C h a n g e ( n e w D a t e ) ; 
     } } 
     I n p u t L a b e l P r o p s = { {   s h r i n k :   t r u e   } } 
 / > 
 \ \ \ 
 
 * * P r e v e n c i � n : * *   U s a r   T e x t F i e l d   c o n   t y p e = \ d a t e \   e n   l u g a r   d e   D a t e P i c k e r   p a r a   e v i t a r   p r o b l e m a s   d e   c o m p a t i b i l i d a d . 
 
 - - - 
 
 # # #   * *   P R O B L E M A   3 :   C a m p o s   d e   c o n t r a s e � a   e n   m o d o   e d i c i � n * * 
 
 * * S � n t o m a : * *   N o   h a y   f o r m a   d e   c a m b i a r   l a   c o n t r a s e � a   a l   e d i t a r   u n   u s u a r i o . 
 
 * * C a u s a : * *   L o s   c a m p o s   d e   c o n t r a s e � a   s o l o   a p a r e c e n   e n   m o d o   c r e a r . 
 
 * * S o l u c i � n : * * 
 \ \ \ j a v a s c r i p t 
 / /     E s t a d o   p a r a   c o n t r o l a r   c a m b i o   d e   c o n t r a s e � a : 
 c o n s t   [ c h a n g e P a s s w o r d ,   s e t C h a n g e P a s s w o r d ]   =   u s e S t a t e ( f a l s e ) ; 
 
 / /     B o t � n   p a r a   h a b i l i t a r   c a m b i o : 
 { m o d e   = = =   ' e d i t '   & &   ! c h a n g e P a s s w o r d   & &   ( 
     < B u t t o n   o n C l i c k = { ( )   = >   s e t C h a n g e P a s s w o r d ( t r u e ) } > 
         C a m b i a r   C o n t r a s e � a 
     < / B u t t o n > 
 ) } 
 
 / /     C a m p o s   c o n d i c i o n a l e s : 
 { ( m o d e   = = =   ' c r e a t e '   | |   c h a n g e P a s s w o r d )   & &   ( 
     < > 
         < T e x t F i e l d   l a b e l = \ N u e v a 
 
 c o n t r a s e � a \   t y p e = \ p a s s w o r d \   / > 
         < T e x t F i e l d   l a b e l = \ C o n f i r m a r 
 
 c o n t r a s e � a \   t y p e = \ p a s s w o r d \   / > 
     < / > 
 ) } 
 
 / /     V a l i d a c i � n   c o n d i c i o n a l : 
 i f   ( m o d e   = = =   ' c r e a t e '   | |   c h a n g e P a s s w o r d )   { 
     / /   V a l i d a r   c o n t r a s e � a 
 } 
 
 / /     E n v � o   c o n d i c i o n a l : 
 i f   ( m o d e   = = =   ' c r e a t e '   | |   c h a n g e P a s s w o r d )   { 
     d a t a T o S e n d . c l a v e   =   f o r m D a t a . c l a v e ; 
 } 
 \ \ \ 
 
 * * P r e v e n c i � n : * *   S i e m p r e   i n c l u i r   f u n c i o n a l i d a d   p a r a   c a m b i a r   c o n t r a s e � a s   e n   f o r m u l a r i o s   d e   e d i c i � n . 
 
 - - - 
 
 # # #   * *   P R O B L E M A   4 :   E s t r u c t u r a   d e   r e s p u e s t a   d e   A P I   i n c o n s i s t e n t e * * 
 
 * * S � n t o m a : * *   L o s   d a t o s   n o   s e   m u e s t r a n   p o r q u e   l a   e s t r u c t u r a   d e   r e s p u e s t a   n o   e s   l a   e s p e r a d a . 
 
 * * C a u s a : * *   L a   A P I   d e v u e l v e   \ {   u s u a r i o s :   [ . . . ]   } \   p e r o   e l   f r o n t e n d   e s p e r a   \ {   d a t a :   [ . . . ]   } \ . 
 
 * * S o l u c i � n : * * 
 \ \ \ j a v a s c r i p t 
 / /     M a n e j o   r o b u s t o   d e   r e s p u e s t a : 
 c o n s t   u s e r s D a t a   =   A r r a y . i s A r r a y ( r e s p o n s e . u s u a r i o s )   ?   r e s p o n s e . u s u a r i o s   : 
                                   A r r a y . i s A r r a y ( r e s p o n s e . d a t a )   ?   r e s p o n s e . d a t a   : 
                                   A r r a y . i s A r r a y ( r e s p o n s e )   ?   r e s p o n s e   :   [ ] ; 
 
 / /     M a n e j o   d e   p a g i n a c i � n : 
 s e t P a g i n a t i o n ( p r e v   = >   ( { 
     . . . p r e v , 
     t o t a l :   r e s p o n s e . p a g i n a t i o n ? . t o t a l   | |   r e s p o n s e . t o t a l   | |   u s e r s D a t a . l e n g t h   | |   0 
 } ) ) ; 
 \ \ \ 
 
 * * P r e v e n c i � n : * *   S i e m p r e   v e r i f i c a r   l a   e s t r u c t u r a   d e   r e s p u e s t a   d e   l a   A P I   y   m a n e j a r   m � l t i p l e s   f o r m a t o s . 
 
 - - - 
 
 # # #   * *   P R O B L E M A   5 :   D e b u g g i n g   d e   p r o b l e m a s   d e   A P I * * 
 
 * * S � n t o m a : * *   N o   s e   s a b e   p o r   q u �   n o   f u n c i o n a n   l a s   l l a m a d a s   a   l a   A P I . 
 
 * * S o l u c i � n : * * 
 \ \ \ j a v a s c r i p t 
 / /     L o g s   d e   d e b u g g i n g : 
 c o n s o l e . l o g ( ' U s u a r i o   l o g u e a d o : ' ,   g e t U s e r ( ) ) ; 
 c o n s o l e . l o g ( ' R o l   d e l   u s u a r i o : ' ,   g e t U s e r R o l e ( ) ) ; 
 c o n s o l e . l o g ( ' L l a m a n d o   a   A P I   c o n   p a r a m s : ' ,   p a r a m s ) ; 
 c o n s o l e . l o g ( ' R e s p u e s t a   c o m p l e t a : ' ,   r e s p o n s e ) ; 
 c o n s o l e . l o g ( ' D a t o s   p r o c e s a d o s : ' ,   p r o c e s s e d D a t a ) ; 
 \ \ \ 
 
 * * P r e v e n c i � n : * *   A g r e g a r   l o g s   d e t a l l a d o s   d u r a n t e   e l   d e s a r r o l l o   p a r a   f a c i l i t a r   e l   d e b u g g i n g . 
 
 - - - 
 
 # #     * * C H E C K L I S T   D E   P R E V E N C I � N * * 
 
 A n t e s   d e   i m p l e m e n t a r   c u a l q u i e r   m a n t e n i m i e n t o ,   v e r i f i c a r : 
 
 -   [   ]   * * V a l i d a c i � n   d e   a r r a y s : * *   L o s   d a t o s   s i e m p r e   s o n   a r r a y s   a n t e s   d e   u s a r   \ . m a p ( ) \ 
 -   [   ]   * * D a t e P i c k e r : * *   U s a r   T e x t F i e l d   c o n   t y p e = \ d a t e \   e n   l u g a r   d e   D a t e P i c k e r 
 -   [   ]   * * C o n t r a s e � a s : * *   I n c l u i r   f u n c i o n a l i d a d   p a r a   c a m b i a r   c o n t r a s e � a s   e n   m o d o   e d i c i � n 
 -   [   ]   * * E s t r u c t u r a   A P I : * *   M a n e j a r   m � l t i p l e s   f o r m a t o s   d e   r e s p u e s t a 
 -   [   ]   * * L o g s   d e   d e b u g g i n g : * *   A g r e g a r   l o g s   p a r a   f a c i l i t a r   t r o u b l e s h o o t i n g 
 -   [   ]   * * E s t a d o s   c o n d i c i o n a l e s : * *   U s a r   e s t a d o s   p a r a   c o n t r o l a r   v i s i b i l i d a d   d e   c a m p o s 
 -   [   ]   * * V a l i d a c i o n e s   c o n d i c i o n a l e s : * *   S o l o   v a l i d a r   c a m p o s   c u a n d o   s o n   n e c e s a r i o s 
 -   [   ]   * * E n v � o   c o n d i c i o n a l : * *   S o l o   i n c l u i r   d a t o s   c u a n d o   s o n   r e l e v a n t e s 
 
 * * E s t a d o : * *     P r o b l e m a s   c o m u n e s   d o c u m e n t a d o s   y   s o l u c i o n a d o s 
 
 
 
 - - - 
 
 # #     * * 1 3 .   P A T R � N   D E   S U B I D A   D E   A R C H I V O S * * 
 
 # # #   * * O b j e t i v o : * * 
 E s t a b l e c e r   u n   p a t r � n   u n i f i c a d o   p a r a   l a   s u b i d a   d e   a r c h i v o s   ( f o t o s ,   d o c u m e n t o s ,   e t c . )   e n   t o d o s   l o s   m a n t e n i m i e n t o s . 
 
 - - - 
 
 # # #   * *   I M P L E M E N T A C I � N   F R O N T E N D * * 
 
 # # # #   * * 1 .   F u n c i � n   d e   S u b i d a   d e   A r c h i v o s : * * 
 ` j a v a s c r i p t 
 / /   F u n c i � n   p a r a   m a n e j a r   s u b i d a   d e   i m a g e n 
 c o n s t   h a n d l e I m a g e U p l o a d   =   a s y n c   ( e v e n t )   = >   { 
     c o n s t   f i l e   =   e v e n t . t a r g e t . f i l e s [ 0 ] ; 
     i f   ( f i l e )   { 
         / /   V a l i d a r   t i p o   d e   a r c h i v o 
         i f   ( ! f i l e . t y p e . s t a r t s W i t h ( ' i m a g e / ' ) )   { 
             t o a s t . e r r o r ( ' P o r   f a v o r   s e l e c c i o n a   u n   a r c h i v o   d e   i m a g e n   v � l i d o ' ) ; 
             r e t u r n ; 
         } 
 
         / /   V a l i d a r   t a m a � o   ( m � x i m o   2 M B ) 
         i f   ( f i l e . s i z e   >   2   *   1 0 2 4   *   1 0 2 4 )   { 
             t o a s t . e r r o r ( ' L a   i m a g e n   d e b e   s e r   m e n o r   a   2 M B ' ) ; 
             r e t u r n ; 
         } 
 
         / /   C r e a r   p r e v i e w   i n m e d i a t o 
         c o n s t   r e a d e r   =   n e w   F i l e R e a d e r ( ) ; 
         r e a d e r . o n l o a d   =   ( e )   = >   { 
             s e t P r e v i e w I m a g e ( e . t a r g e t . r e s u l t ) ; 
         } ; 
         r e a d e r . r e a d A s D a t a U R L ( f i l e ) ; 
 
         / /   S u b i r   a r c h i v o   a l   s e r v i d o r 
         t r y   { 
             s e t L o a d i n g ( t r u e ) ; 
             c o n s t   r e s p o n s e   =   a w a i t   f i l e S e r v i c e . u p l o a d F i l e ( f i l e ,   ' p r o f i l e ' ) ; 
             
             i f   ( r e s p o n s e . s u c c e s s )   { 
                 s e t F o r m D a t a ( p r e v   = >   ( { 
                     . . . p r e v , 
                     f o t o :   r e s p o n s e . f i l e n a m e   / /   G u a r d a r   n o m b r e   d e l   a r c h i v o   s u b i d o 
                 } ) ) ; 
                 t o a s t . s u c c e s s ( ' F o t o   s u b i d a   c o r r e c t a m e n t e ' ) ; 
             }   e l s e   { 
                 t o a s t . e r r o r ( ' E r r o r   a l   s u b i r   l a   f o t o ' ) ; 
                 s e t P r e v i e w I m a g e ( ' ' ) ;   / /   L i m p i a r   p r e v i e w   s i   f a l l a 
             } 
         }   c a t c h   ( e r r o r )   { 
             c o n s o l e . e r r o r ( ' E r r o r   u p l o a d i n g   f i l e : ' ,   e r r o r ) ; 
             t o a s t . e r r o r ( ' E r r o r   a l   s u b i r   l a   f o t o ' ) ; 
             s e t P r e v i e w I m a g e ( ' ' ) ;   / /   L i m p i a r   p r e v i e w   s i   f a l l a 
         }   f i n a l l y   { 
             s e t L o a d i n g ( f a l s e ) ; 
         } 
     } 
 } ; 
 ` 
 
 # # # #   * * 2 .   F u n c i � n   p a r a   C o n s t r u i r   U R L s   d e   I m a g e n : * * 
 ` j a v a s c r i p t 
 / /   F u n c i � n   p a r a   c o n s t r u i r   U R L   d e   i m a g e n 
 c o n s t   g e t I m a g e U r l   =   ( f i l e n a m e )   = >   { 
     i f   ( ! f i l e n a m e )   r e t u r n   n u l l ; 
     / /   S i   y a   e s   u n a   U R L   c o m p l e t a ,   d e v o l v e r l a   t a l   c o m o   e s t � 
     i f   ( f i l e n a m e . s t a r t s W i t h ( ' h t t p ' ) )   r e t u r n   f i l e n a m e ; 
     / /   C o n s t r u i r   U R L   d e l   s e r v i d o r 
     r e t u r n   \ \ / u p l o a d s / \ \ ; 
 } ; 
 ` 
 
 # # # #   * * 3 .   U s o   e n   C o m p o n e n t e s : * * 
 ` j a v a s c r i p t 
 / /   E n   A v a t a r / I m a g e : 
 < A v a t a r   s r c = { g e t I m a g e U r l ( u s u a r i o . f o t o ) }   / > 
 
 / /   E n   p r e v i e w   d e   f o r m u l a r i o : 
 { p r e v i e w I m a g e   & &   ( 
     < i m g   s r c = { p r e v i e w I m a g e }   a l t = \ 
 
 P r e v i e w \   s t y l e = { {   w i d t h :   1 0 0 ,   h e i g h t :   1 0 0   } }   / > 
 ) } 
 ` 
 
 - - - 
 
 # # #   * *   I M P L E M E N T A C I � N   B A C K E N D * * 
 
 # # # #   * * 1 .   C o n f i g u r a c i � n   d e   C O R S   p a r a   A r c h i v o s : * * 
 ` j a v a s c r i p t 
 / /   E n   s e r v e r . j s 
 a p p . u s e ( h e l m e t ( { 
     c r o s s O r i g i n R e s o u r c e P o l i c y :   {   p o l i c y :   \ c r o s s - o r i g i n \   } , 
     c r o s s O r i g i n E m b e d d e r P o l i c y :   f a l s e 
 } ) ) ; 
 
 / /   S e r v i r   a r c h i v o s   e s t � t i c o s   c o n   C O R S 
 a p p . u s e ( ' / u p l o a d s ' ,   c o r s ( { 
     o r i g i n :   p r o c e s s . e n v . C O R S _ O R I G I N   | |   ' h t t p : / / l o c a l h o s t : 3 0 0 0 ' , 
     c r e d e n t i a l s :   t r u e 
 } ) ,   ( r e q ,   r e s ,   n e x t )   = >   { 
     / /   H e a d e r s   e s p e c � f i c o s   p a r a   i m � g e n e s 
     r e s . h e a d e r ( ' A c c e s s - C o n t r o l - A l l o w - O r i g i n ' ,   p r o c e s s . e n v . C O R S _ O R I G I N   | |   ' h t t p : / / l o c a l h o s t : 3 0 0 0 ' ) ; 
     r e s . h e a d e r ( ' A c c e s s - C o n t r o l - A l l o w - C r e d e n t i a l s ' ,   ' t r u e ' ) ; 
     r e s . h e a d e r ( ' C r o s s - O r i g i n - R e s o u r c e - P o l i c y ' ,   ' c r o s s - o r i g i n ' ) ; 
     n e x t ( ) ; 
 } ,   e x p r e s s . s t a t i c ( ' u p l o a d s ' ) ) ; 
 ` 
 
 # # # #   * * 2 .   I n c l u i r   C a m p o   d e   A r c h i v o   e n   B a c k e n d : * * 
 ` j a v a s c r i p t 
 / /   E n   c r e a c i � n : 
 c o n s t   {   n o m b r e s ,   d n i ,   e m a i l ,   t e l e f o n o ,   f e c h a _ n a c i m i e n t o ,   f o t o ,   r o l ,   c l a v e   }   =   r e q . b o d y ; 
 
 / /   E n   a c t u a l i z a c i � n : 
 f o t o   =   C O A L E S C E ( \ ,   f o t o ) 
 ` 
 
 - - - 
 
 # # #   * *   C H E C K L I S T   D E   S U B I D A   D E   A R C H I V O S * * 
 
 P a r a   c a d a   m a n t e n i m i e n t o   c o n   a r c h i v o s : 
 -   [   ]   * * I m p o r t a r   f i l e S e r v i c e * *   e n   e l   c o m p o n e n t e 
 -   [   ]   * * V a l i d a r   t i p o   d e   a r c h i v o * *   ( i m a g e n ,   d o c u m e n t o ,   e t c . ) 
 -   [   ]   * * V a l i d a r   t a m a � o * *   d e l   a r c h i v o 
 -   [   ]   * * C r e a r   p r e v i e w   i n m e d i a t o * *   c o n   F i l e R e a d e r 
 -   [   ]   * * S u b i r   a r c h i v o   r e a l * *   c o n   f i l e S e r v i c e . u p l o a d F i l e ( ) 
 -   [   ]   * * G u a r d a r   n o m b r e   d e l   a r c h i v o * *   e n   f o r m D a t a 
 -   [   ]   * * M a n e j a r   e r r o r e s * *   c o n   t o a s t   n o t i f i c a t i o n s 
 -   [   ]   * * C o n s t r u i r   U R L s * *   d e   i m a g e n   c o r r e c t a m e n t e 
 -   [   ]   * * M o s t r a r   i m � g e n e s * *   e n   g r i l l a   y   f o r m u l a r i o s 
 -   [   ]   * * C o n f i g u r a r   C O R S * *   e n   b a c k e n d 
 -   [   ]   * * I n c l u i r   c a m p o   a r c h i v o * *   e n   b a c k e n d 
 
 - - - 
 
 # #     * * 1 4 .   P A T R � N   D E   E L I M I N A C I � N * * 
 
 # # #   * * O b j e t i v o : * * 
 E s t a b l e c e r   u n   p a t r � n   u n i f i c a d o   p a r a   l a   e l i m i n a c i � n   d e   r e g i s t r o s ,   d e f i n i e n d o   c l a r a m e n t e   e l   t i p o   d e   e l i m i n a c i � n . 
 
 - - - 
 
 # # #   * *   T I P O S   D E   E L I M I N A C I � N * * 
 
 # # # #   * * 1 .   E l i m i n a c i � n   C o m p l e t a   ( H a r d   D e l e t e ) : * * 
 ` j a v a s c r i p t 
 / /   B a c k e n d   -   E l i m i n a r   c o m p l e t a m e n t e 
 a w a i t   q u e r y ( ' D E L E T E   F R O M   t a b l a   W H E R E   i d   =   \ ' ,   [ i d ] ) ; 
 
 / /   F r o n t e n d   -   M e n s a j e   c l a r o 
 t i t l e = \ E l i m i n a r 
 
 [ E n t i d a d ] 
 
 P e r m a n e n t e m e n t e \ 
 m e s s a g e = \ � E s t � 
 
 s e g u r o 
 
 d e 
 
 q u e 
 
 d e s e a 
 
 E L I M I N A R 
 
 P E R M A N E N T E M E N T E 
 
 e s t e 
 
 [ e n t i d a d ] ? 
 
 E l 
 
 [ e n t i d a d ] 
 
 s e r � 
 
 b o r r a d o 
 
 c o m p l e t a m e n t e 
 
 d e 
 
 l a 
 
 b a s e 
 
 d e 
 
 d a t o s 
 
 y 
 
 e s t a 
 
 a c c i � n 
 
 N O 
 
 s e 
 
 p u e d e 
 
 d e s h a c e r . \ 
 ` 
 
 # # # #   * * 2 .   E l i m i n a c i � n   S u a v e   ( S o f t   D e l e t e ) : * * 
 ` j a v a s c r i p t 
 / /   B a c k e n d   -   M a r c a r   c o m o   i n a c t i v o 
 a w a i t   q u e r y ( ' U P D A T E   t a b l a   S E T   a c t i v o   =   f a l s e ,   u p d a t e d _ a t   =   N O W ( )   W H E R E   i d   =   \ ' ,   [ i d ] ) ; 
 
 / /   F r o n t e n d   -   M e n s a j e   c l a r o 
 t i t l e = \ D e s a c t i v a r 
 
 [ E n t i d a d ] \ 
 m e s s a g e = \ � E s t � 
 
 s e g u r o 
 
 d e 
 
 q u e 
 
 d e s e a 
 
 d e s a c t i v a r 
 
 e s t e 
 
 [ e n t i d a d ] ? 
 
 E l 
 
 [ e n t i d a d ] 
 
 s e 
 
 m a r c a r � 
 
 c o m o 
 
 i n a c t i v o 
 
 p e r o 
 
 p e r m a n e c e r � 
 
 e n 
 
 l a 
 
 b a s e 
 
 d e 
 
 d a t o s . \ 
 ` 
 
 - - - 
 
 # # #   * *   I M P L E M E N T A C I � N   F R O N T E N D * * 
 
 # # # #   * * 1 .   F u n c i � n   d e   E l i m i n a c i � n : * * 
 ` j a v a s c r i p t 
 c o n s t   h a n d l e C o n f i r m D e l e t e   =   a s y n c   ( )   = >   { 
     t r y   { 
         a w a i t   e n t i t y S e r v i c e . d e l e t e E n t i t y ( i t e m T o D e l e t e ) ; 
         t o a s t . s u c c e s s ( ' [ E n t i d a d ]   e l i m i n a d o   p e r m a n e n t e m e n t e   d e   l a   b a s e   d e   d a t o s ' ) ; 
         s e t C o n f i r m D i a l o g O p e n ( f a l s e ) ; 
         s e t I t e m T o D e l e t e ( n u l l ) ; 
         a w a i t   l o a d D a t a ( ) ; 
     }   c a t c h   ( e r r o r )   { 
         t o a s t . e r r o r ( ' E r r o r   a l   e l i m i n a r   e l   [ e n t i d a d ] ' ) ; 
     } 
 } ; 
 ` 
 
 # # # #   * * 2 .   D i � l o g o   d e   C o n f i r m a c i � n : * * 
 ` j a v a s c r i p t 
 < C o n f i r m D i a l o g 
     o p e n = { c o n f i r m D i a l o g O p e n } 
     o n C l o s e = { ( )   = >   s e t C o n f i r m D i a l o g O p e n ( f a l s e ) } 
     o n C o n f i r m = { h a n d l e C o n f i r m D e l e t e } 
     t i t l e = \ E l i m i n a r 
 
 [ E n t i d a d ] 
 
 P e r m a n e n t e m e n t e \ 
     m e s s a g e = \ � E s t � 
 
 s e g u r o 
 
 d e 
 
 q u e 
 
 d e s e a 
 
 E L I M I N A R 
 
 P E R M A N E N T E M E N T E 
 
 e s t e 
 
 [ e n t i d a d ] ? 
 
 E l 
 
 [ e n t i d a d ] 
 
 s e r � 
 
 b o r r a d o 
 
 c o m p l e t a m e n t e 
 
 d e 
 
 l a 
 
 b a s e 
 
 d e 
 
 d a t o s 
 
 y 
 
 e s t a 
 
 a c c i � n 
 
 N O 
 
 s e 
 
 p u e d e 
 
 d e s h a c e r . \ 
     c o n f i r m T e x t = \ E l i m i n a r \ 
     c a n c e l T e x t = \ C a n c e l a r \ 
     t y p e = \ e r r o r \ 
 / > 
 ` 
 
 - - - 
 
 # # #   * *   I M P L E M E N T A C I � N   B A C K E N D * * 
 
 # # # #   * * 1 .   E n d p o i n t   d e   E l i m i n a c i � n : * * 
 ` j a v a s c r i p t 
 / /   D E L E T E   / a p i / e n t i d a d / : i d 
 r o u t e r . d e l e t e ( ' / : i d ' ,   a u t h e n t i c a t e T o k e n ,   r e q u i r e A d m i n ,   a s y n c   ( r e q ,   r e s )   = >   { 
     t r y   { 
         c o n s t   {   i d   }   =   r e q . p a r a m s ; 
 
         / /   V e r i f i c a r   s i   e x i s t e 
         c o n s t   c h e c k   =   a w a i t   q u e r y ( ' S E L E C T   i d   F R O M   t a b l a   W H E R E   i d   =   \ ' ,   [ i d ] ) ; 
         i f   ( c h e c k . r o w s . l e n g t h   = = =   0 )   { 
             r e t u r n   r e s . s t a t u s ( 4 0 4 ) . j s o n ( { 
                 s u c c e s s :   f a l s e , 
                 m e s s a g e :   ' [ E n t i d a d ]   n o   e n c o n t r a d o ' 
             } ) ; 
         } 
 
         / /   P r o t e c c i o n e s   d e   s e g u r i d a d 
         i f   ( r e q . u s e r . i d   = = =   p a r s e I n t ( i d ) )   { 
             r e t u r n   r e s . s t a t u s ( 4 0 0 ) . j s o n ( { 
                 s u c c e s s :   f a l s e , 
                 m e s s a g e :   ' N o   p u e d e s   e l i m i n a r   t u   p r o p i o   [ e n t i d a d ] ' 
             } ) ; 
         } 
 
         / /   E l i m i n a r   c o m p l e t a m e n t e 
         a w a i t   q u e r y ( ' D E L E T E   F R O M   t a b l a   W H E R E   i d   =   \ ' ,   [ i d ] ) ; 
 
         r e s . j s o n ( { 
             s u c c e s s :   t r u e , 
             m e s s a g e :   ' [ E n t i d a d ]   e l i m i n a d o   e x i t o s a m e n t e ' 
         } ) ; 
 
     }   c a t c h   ( e r r o r )   { 
         c o n s o l e . e r r o r ( ' E r r o r   e l i m i n a n d o   [ e n t i d a d ] : ' ,   e r r o r ) ; 
         r e s . s t a t u s ( 5 0 0 ) . j s o n ( { 
             s u c c e s s :   f a l s e , 
             m e s s a g e :   ' E r r o r   i n t e r n o   d e l   s e r v i d o r ' 
         } ) ; 
     } 
 } ) ; 
 ` 
 
 - - - 
 
 # # #   * *   C H E C K L I S T   D E   E L I M I N A C I � N * * 
 
 P a r a   c a d a   m a n t e n i m i e n t o : 
 -   [   ]   * * D e f i n i r   t i p o   d e   e l i m i n a c i � n * *   ( h a r d   d e l e t e   v s   s o f t   d e l e t e ) 
 -   [   ]   * * M e n s a j e s   c l a r o s * *   s o b r e   e l   t i p o   d e   e l i m i n a c i � n 
 -   [   ]   * * C o n f i r m a c i � n   e x p l � c i t a * *   a n t e s   d e   e l i m i n a r 
 -   [   ]   * * P r o t e c c i o n e s   d e   s e g u r i d a d * *   i m p l e m e n t a d a s 
 -   [   ]   * * V e r i f i c a c i � n   d e   e x i s t e n c i a * *   a n t e s   d e   e l i m i n a r 
 -   [   ]   * * M a n e j o   d e   e r r o r e s * *   c o m p l e t o 
 -   [   ]   * * A c t u a l i z a c i � n   a u t o m � t i c a * *   d e   l a   l i s t a 
 -   [   ]   * * M e n s a j e s   i n f o r m a t i v o s * *   s o b r e   l a   a c c i � n 
 -   [   ]   * * V a l i d a c i � n   d e   p e r m i s o s * *   ( s o l o   a d m i n i s t r a d o r e s ) 
 -   [   ]   * * P r e v e n c i � n   d e   a u t o - e l i m i n a c i � n * *   s i   a p l i c a 
 
 - - - 
 
 # # #   * *   R E G L A S   D E   E L I M I N A C I � N * * 
 
 # # # #   * * O B L I G A T O R I O : * * 
 1 .   * * D e f i n i r   c l a r a m e n t e * *   e l   t i p o   d e   e l i m i n a c i � n 
 2 .   * * M e n s a j e s   e x p l � c i t o s * *   s o b r e   l a   a c c i � n 
 3 .   * * C o n f i r m a c i � n   o b l i g a t o r i a * *   d e l   u s u a r i o 
 4 .   * * P r o t e c c i o n e s   d e   s e g u r i d a d * *   b � s i c a s 
 5 .   * * M a n e j o   d e   e r r o r e s * *   r o b u s t o 
 
 # # # #   * * R E C O M E N D A D O : * * 
 1 .   * * L o g s   d e   e l i m i n a c i � n * *   p a r a   a u d i t o r � a 
 2 .   * * V a l i d a c i o n e s   a d i c i o n a l e s * *   s e g � n   e l   c o n t e x t o 
 3 .   * * N o t i f i c a c i o n e s * *   a   u s u a r i o s   r e l a c i o n a d o s 
 4 .   * * B a c k u p   a u t o m � t i c o * *   a n t e s   d e   e l i m i n a c i � n   c r � t i c a 
 
 - - - 
 
 * * F e c h a   d e   e s t a b l e c i m i e n t o : * *   2 0 2 4 - 1 2 - 1 9 
 * * V e r s i � n : * *   1 . 0 
 * * E s t a d o : * *     P a t r o n e s   d e   s u b i d a   d e   a r c h i v o s   y   e l i m i n a c i � n   e s t a b l e c i d o s   y   d o c u m e n t a d o s 
 
 
 
 - - - 
 
 # #     * * 1 3 .   P A T R � N   D E   S U B I D A   D E   A R C H I V O S * * 
 
 # # #   * * O b j e t i v o : * * 
 E s t a b l e c e r   u n   p a t r � n   u n i f i c a d o   p a r a   l a   s u b i d a   d e   a r c h i v o s   ( f o t o s ,   d o c u m e n t o s ,   e t c . )   e n   t o d o s   l o s   m a n t e n i m i e n t o s . 
 
 - - - 
 
 # # #   * *   I M P L E M E N T A C I � N   F R O N T E N D * * 
 
 # # # #   * * 1 .   F u n c i � n   d e   S u b i d a   d e   A r c h i v o s : * * 
 ` j a v a s c r i p t 
 / /   F u n c i � n   p a r a   m a n e j a r   s u b i d a   d e   i m a g e n 
 c o n s t   h a n d l e I m a g e U p l o a d   =   a s y n c   ( e v e n t )   = >   { 
     c o n s t   f i l e   =   e v e n t . t a r g e t . f i l e s [ 0 ] ; 
     i f   ( f i l e )   { 
         / /   V a l i d a r   t i p o   d e   a r c h i v o 
         i f   ( ! f i l e . t y p e . s t a r t s W i t h ( ' i m a g e / ' ) )   { 
             t o a s t . e r r o r ( ' P o r   f a v o r   s e l e c c i o n a   u n   a r c h i v o   d e   i m a g e n   v � l i d o ' ) ; 
             r e t u r n ; 
         } 
 
         / /   V a l i d a r   t a m a � o   ( m � x i m o   2 M B ) 
         i f   ( f i l e . s i z e   >   2   *   1 0 2 4   *   1 0 2 4 )   { 
             t o a s t . e r r o r ( ' L a   i m a g e n   d e b e   s e r   m e n o r   a   2 M B ' ) ; 
             r e t u r n ; 
         } 
 
         / /   C r e a r   p r e v i e w   i n m e d i a t o 
         c o n s t   r e a d e r   =   n e w   F i l e R e a d e r ( ) ; 
         r e a d e r . o n l o a d   =   ( e )   = >   { 
             s e t P r e v i e w I m a g e ( e . t a r g e t . r e s u l t ) ; 
         } ; 
         r e a d e r . r e a d A s D a t a U R L ( f i l e ) ; 
 
         / /   S u b i r   a r c h i v o   a l   s e r v i d o r 
         t r y   { 
             s e t L o a d i n g ( t r u e ) ; 
             c o n s t   r e s p o n s e   =   a w a i t   f i l e S e r v i c e . u p l o a d F i l e ( f i l e ,   ' p r o f i l e ' ) ; 
             
             i f   ( r e s p o n s e . s u c c e s s )   { 
                 s e t F o r m D a t a ( p r e v   = >   ( { 
                     . . . p r e v , 
                     f o t o :   r e s p o n s e . f i l e n a m e   / /   G u a r d a r   n o m b r e   d e l   a r c h i v o   s u b i d o 
                 } ) ) ; 
                 t o a s t . s u c c e s s ( ' F o t o   s u b i d a   c o r r e c t a m e n t e ' ) ; 
             }   e l s e   { 
                 t o a s t . e r r o r ( ' E r r o r   a l   s u b i r   l a   f o t o ' ) ; 
                 s e t P r e v i e w I m a g e ( ' ' ) ;   / /   L i m p i a r   p r e v i e w   s i   f a l l a 
             } 
         }   c a t c h   ( e r r o r )   { 
             c o n s o l e . e r r o r ( ' E r r o r   u p l o a d i n g   f i l e : ' ,   e r r o r ) ; 
             t o a s t . e r r o r ( ' E r r o r   a l   s u b i r   l a   f o t o ' ) ; 
             s e t P r e v i e w I m a g e ( ' ' ) ;   / /   L i m p i a r   p r e v i e w   s i   f a l l a 
         }   f i n a l l y   { 
             s e t L o a d i n g ( f a l s e ) ; 
         } 
     } 
 } ; 
 ` 
 
 # # # #   * * 2 .   F u n c i � n   p a r a   C o n s t r u i r   U R L s   d e   I m a g e n : * * 
 ` j a v a s c r i p t 
 / /   F u n c i � n   p a r a   c o n s t r u i r   U R L   d e   i m a g e n 
 c o n s t   g e t I m a g e U r l   =   ( f i l e n a m e )   = >   { 
     i f   ( ! f i l e n a m e )   r e t u r n   n u l l ; 
     / /   S i   y a   e s   u n a   U R L   c o m p l e t a ,   d e v o l v e r l a   t a l   c o m o   e s t � 
     i f   ( f i l e n a m e . s t a r t s W i t h ( ' h t t p ' ) )   r e t u r n   f i l e n a m e ; 
     / /   C o n s t r u i r   U R L   d e l   s e r v i d o r 
     r e t u r n   \ \ / u p l o a d s / \ \ ; 
 } ; 
 ` 
 
 # # # #   * * 3 .   U s o   e n   C o m p o n e n t e s : * * 
 ` j a v a s c r i p t 
 / /   E n   A v a t a r / I m a g e : 
 < A v a t a r   s r c = { g e t I m a g e U r l ( u s u a r i o . f o t o ) }   / > 
 
 / /   E n   p r e v i e w   d e   f o r m u l a r i o : 
 { p r e v i e w I m a g e   & &   ( 
     < i m g   s r c = { p r e v i e w I m a g e }   a l t = \ 
 
 P r e v i e w \   s t y l e = { {   w i d t h :   1 0 0 ,   h e i g h t :   1 0 0   } }   / > 
 ) } 
 ` 
 
 - - - 
 
 # # #   * *   I M P L E M E N T A C I � N   B A C K E N D * * 
 
 # # # #   * * 1 .   C o n f i g u r a c i � n   d e   C O R S   p a r a   A r c h i v o s : * * 
 ` j a v a s c r i p t 
 / /   E n   s e r v e r . j s 
 a p p . u s e ( h e l m e t ( { 
     c r o s s O r i g i n R e s o u r c e P o l i c y :   {   p o l i c y :   \ c r o s s - o r i g i n \   } , 
     c r o s s O r i g i n E m b e d d e r P o l i c y :   f a l s e 
 } ) ) ; 
 
 / /   S e r v i r   a r c h i v o s   e s t � t i c o s   c o n   C O R S 
 a p p . u s e ( ' / u p l o a d s ' ,   c o r s ( { 
     o r i g i n :   p r o c e s s . e n v . C O R S _ O R I G I N   | |   ' h t t p : / / l o c a l h o s t : 3 0 0 0 ' , 
     c r e d e n t i a l s :   t r u e 
 } ) ,   ( r e q ,   r e s ,   n e x t )   = >   { 
     / /   H e a d e r s   e s p e c � f i c o s   p a r a   i m � g e n e s 
     r e s . h e a d e r ( ' A c c e s s - C o n t r o l - A l l o w - O r i g i n ' ,   p r o c e s s . e n v . C O R S _ O R I G I N   | |   ' h t t p : / / l o c a l h o s t : 3 0 0 0 ' ) ; 
     r e s . h e a d e r ( ' A c c e s s - C o n t r o l - A l l o w - C r e d e n t i a l s ' ,   ' t r u e ' ) ; 
     r e s . h e a d e r ( ' C r o s s - O r i g i n - R e s o u r c e - P o l i c y ' ,   ' c r o s s - o r i g i n ' ) ; 
     n e x t ( ) ; 
 } ,   e x p r e s s . s t a t i c ( ' u p l o a d s ' ) ) ; 
 ` 
 
 # # # #   * * 2 .   I n c l u i r   C a m p o   d e   A r c h i v o   e n   B a c k e n d : * * 
 ` j a v a s c r i p t 
 / /   E n   c r e a c i � n : 
 c o n s t   {   n o m b r e s ,   d n i ,   e m a i l ,   t e l e f o n o ,   f e c h a _ n a c i m i e n t o ,   f o t o ,   r o l ,   c l a v e   }   =   r e q . b o d y ; 
 
 / /   E n   a c t u a l i z a c i � n : 
 f o t o   =   C O A L E S C E ( \ ,   f o t o ) 
 ` 
 
 - - - 
 
 # # #   * *   C H E C K L I S T   D E   S U B I D A   D E   A R C H I V O S * * 
 
 P a r a   c a d a   m a n t e n i m i e n t o   c o n   a r c h i v o s : 
 -   [   ]   * * I m p o r t a r   f i l e S e r v i c e * *   e n   e l   c o m p o n e n t e 
 -   [   ]   * * V a l i d a r   t i p o   d e   a r c h i v o * *   ( i m a g e n ,   d o c u m e n t o ,   e t c . ) 
 -   [   ]   * * V a l i d a r   t a m a � o * *   d e l   a r c h i v o 
 -   [   ]   * * C r e a r   p r e v i e w   i n m e d i a t o * *   c o n   F i l e R e a d e r 
 -   [   ]   * * S u b i r   a r c h i v o   r e a l * *   c o n   f i l e S e r v i c e . u p l o a d F i l e ( ) 
 -   [   ]   * * G u a r d a r   n o m b r e   d e l   a r c h i v o * *   e n   f o r m D a t a 
 -   [   ]   * * M a n e j a r   e r r o r e s * *   c o n   t o a s t   n o t i f i c a t i o n s 
 -   [   ]   * * C o n s t r u i r   U R L s * *   d e   i m a g e n   c o r r e c t a m e n t e 
 -   [   ]   * * M o s t r a r   i m � g e n e s * *   e n   g r i l l a   y   f o r m u l a r i o s 
 -   [   ]   * * C o n f i g u r a r   C O R S * *   e n   b a c k e n d 
 -   [   ]   * * I n c l u i r   c a m p o   a r c h i v o * *   e n   b a c k e n d 
 
 - - - 
 
 # #     * * 1 4 .   P A T R � N   D E   E L I M I N A C I � N * * 
 
 # # #   * * O b j e t i v o : * * 
 E s t a b l e c e r   u n   p a t r � n   u n i f i c a d o   p a r a   l a   e l i m i n a c i � n   d e   r e g i s t r o s ,   d e f i n i e n d o   c l a r a m e n t e   e l   t i p o   d e   e l i m i n a c i � n . 
 
 - - - 
 
 # # #   * *   T I P O S   D E   E L I M I N A C I � N * * 
 
 # # # #   * * 1 .   E l i m i n a c i � n   C o m p l e t a   ( H a r d   D e l e t e ) : * * 
 ` j a v a s c r i p t 
 / /   B a c k e n d   -   E l i m i n a r   c o m p l e t a m e n t e 
 a w a i t   q u e r y ( ' D E L E T E   F R O M   t a b l a   W H E R E   i d   =   \ ' ,   [ i d ] ) ; 
 
 / /   F r o n t e n d   -   M e n s a j e   c l a r o 
 t i t l e = \ E l i m i n a r 
 
 [ E n t i d a d ] 
 
 P e r m a n e n t e m e n t e \ 
 m e s s a g e = \ � E s t � 
 
 s e g u r o 
 
 d e 
 
 q u e 
 
 d e s e a 
 
 E L I M I N A R 
 
 P E R M A N E N T E M E N T E 
 
 e s t e 
 
 [ e n t i d a d ] ? 
 
 E l 
 
 [ e n t i d a d ] 
 
 s e r � 
 
 b o r r a d o 
 
 c o m p l e t a m e n t e 
 
 d e 
 
 l a 
 
 b a s e 
 
 d e 
 
 d a t o s 
 
 y 
 
 e s t a 
 
 a c c i � n 
 
 N O 
 
 s e 
 
 p u e d e 
 
 d e s h a c e r . \ 
 ` 
 
 # # # #   * * 2 .   E l i m i n a c i � n   S u a v e   ( S o f t   D e l e t e ) : * * 
 ` j a v a s c r i p t 
 / /   B a c k e n d   -   M a r c a r   c o m o   i n a c t i v o 
 a w a i t   q u e r y ( ' U P D A T E   t a b l a   S E T   a c t i v o   =   f a l s e ,   u p d a t e d _ a t   =   N O W ( )   W H E R E   i d   =   \ ' ,   [ i d ] ) ; 
 
 / /   F r o n t e n d   -   M e n s a j e   c l a r o 
 t i t l e = \ D e s a c t i v a r 
 
 [ E n t i d a d ] \ 
 m e s s a g e = \ � E s t � 
 
 s e g u r o 
 
 d e 
 
 q u e 
 
 d e s e a 
 
 d e s a c t i v a r 
 
 e s t e 
 
 [ e n t i d a d ] ? 
 
 E l 
 
 [ e n t i d a d ] 
 
 s e 
 
 m a r c a r � 
 
 c o m o 
 
 i n a c t i v o 
 
 p e r o 
 
 p e r m a n e c e r � 
 
 e n 
 
 l a 
 
 b a s e 
 
 d e 
 
 d a t o s . \ 
 ` 
 
 - - - 
 
 # # #   * *   I M P L E M E N T A C I � N   F R O N T E N D * * 
 
 # # # #   * * 1 .   F u n c i � n   d e   E l i m i n a c i � n : * * 
 ` j a v a s c r i p t 
 c o n s t   h a n d l e C o n f i r m D e l e t e   =   a s y n c   ( )   = >   { 
     t r y   { 
         a w a i t   e n t i t y S e r v i c e . d e l e t e E n t i t y ( i t e m T o D e l e t e ) ; 
         t o a s t . s u c c e s s ( ' [ E n t i d a d ]   e l i m i n a d o   p e r m a n e n t e m e n t e   d e   l a   b a s e   d e   d a t o s ' ) ; 
         s e t C o n f i r m D i a l o g O p e n ( f a l s e ) ; 
         s e t I t e m T o D e l e t e ( n u l l ) ; 
         a w a i t   l o a d D a t a ( ) ; 
     }   c a t c h   ( e r r o r )   { 
         t o a s t . e r r o r ( ' E r r o r   a l   e l i m i n a r   e l   [ e n t i d a d ] ' ) ; 
     } 
 } ; 
 ` 
 
 # # # #   * * 2 .   D i � l o g o   d e   C o n f i r m a c i � n : * * 
 ` j a v a s c r i p t 
 < C o n f i r m D i a l o g 
     o p e n = { c o n f i r m D i a l o g O p e n } 
     o n C l o s e = { ( )   = >   s e t C o n f i r m D i a l o g O p e n ( f a l s e ) } 
     o n C o n f i r m = { h a n d l e C o n f i r m D e l e t e } 
     t i t l e = \ E l i m i n a r 
 
 [ E n t i d a d ] 
 
 P e r m a n e n t e m e n t e \ 
     m e s s a g e = \ � E s t � 
 
 s e g u r o 
 
 d e 
 
 q u e 
 
 d e s e a 
 
 E L I M I N A R 
 
 P E R M A N E N T E M E N T E 
 
 e s t e 
 
 [ e n t i d a d ] ? 
 
 E l 
 
 [ e n t i d a d ] 
 
 s e r � 
 
 b o r r a d o 
 
 c o m p l e t a m e n t e 
 
 d e 
 
 l a 
 
 b a s e 
 
 d e 
 
 d a t o s 
 
 y 
 
 e s t a 
 
 a c c i � n 
 
 N O 
 
 s e 
 
 p u e d e 
 
 d e s h a c e r . \ 
     c o n f i r m T e x t = \ E l i m i n a r \ 
     c a n c e l T e x t = \ C a n c e l a r \ 
     t y p e = \ e r r o r \ 
 / > 
 ` 
 
 - - - 
 
 # # #   * *   I M P L E M E N T A C I � N   B A C K E N D * * 
 
 # # # #   * * 1 .   E n d p o i n t   d e   E l i m i n a c i � n : * * 
 ` j a v a s c r i p t 
 / /   D E L E T E   / a p i / e n t i d a d / : i d 
 r o u t e r . d e l e t e ( ' / : i d ' ,   a u t h e n t i c a t e T o k e n ,   r e q u i r e A d m i n ,   a s y n c   ( r e q ,   r e s )   = >   { 
     t r y   { 
         c o n s t   {   i d   }   =   r e q . p a r a m s ; 
 
         / /   V e r i f i c a r   s i   e x i s t e 
         c o n s t   c h e c k   =   a w a i t   q u e r y ( ' S E L E C T   i d   F R O M   t a b l a   W H E R E   i d   =   \ ' ,   [ i d ] ) ; 
         i f   ( c h e c k . r o w s . l e n g t h   = = =   0 )   { 
             r e t u r n   r e s . s t a t u s ( 4 0 4 ) . j s o n ( { 
                 s u c c e s s :   f a l s e , 
                 m e s s a g e :   ' [ E n t i d a d ]   n o   e n c o n t r a d o ' 
             } ) ; 
         } 
 
         / /   P r o t e c c i o n e s   d e   s e g u r i d a d 
         i f   ( r e q . u s e r . i d   = = =   p a r s e I n t ( i d ) )   { 
             r e t u r n   r e s . s t a t u s ( 4 0 0 ) . j s o n ( { 
                 s u c c e s s :   f a l s e , 
                 m e s s a g e :   ' N o   p u e d e s   e l i m i n a r   t u   p r o p i o   [ e n t i d a d ] ' 
             } ) ; 
         } 
 
         / /   E l i m i n a r   c o m p l e t a m e n t e 
         a w a i t   q u e r y ( ' D E L E T E   F R O M   t a b l a   W H E R E   i d   =   \ ' ,   [ i d ] ) ; 
 
         r e s . j s o n ( { 
             s u c c e s s :   t r u e , 
             m e s s a g e :   ' [ E n t i d a d ]   e l i m i n a d o   e x i t o s a m e n t e ' 
         } ) ; 
 
     }   c a t c h   ( e r r o r )   { 
         c o n s o l e . e r r o r ( ' E r r o r   e l i m i n a n d o   [ e n t i d a d ] : ' ,   e r r o r ) ; 
         r e s . s t a t u s ( 5 0 0 ) . j s o n ( { 
             s u c c e s s :   f a l s e , 
             m e s s a g e :   ' E r r o r   i n t e r n o   d e l   s e r v i d o r ' 
         } ) ; 
     } 
 } ) ; 
 ` 
 
 - - - 
 
 # # #   * *   C H E C K L I S T   D E   E L I M I N A C I � N * * 
 
 P a r a   c a d a   m a n t e n i m i e n t o : 
 -   [   ]   * * D e f i n i r   t i p o   d e   e l i m i n a c i � n * *   ( h a r d   d e l e t e   v s   s o f t   d e l e t e ) 
 -   [   ]   * * M e n s a j e s   c l a r o s * *   s o b r e   e l   t i p o   d e   e l i m i n a c i � n 
 -   [   ]   * * C o n f i r m a c i � n   e x p l � c i t a * *   a n t e s   d e   e l i m i n a r 
 -   [   ]   * * P r o t e c c i o n e s   d e   s e g u r i d a d * *   i m p l e m e n t a d a s 
 -   [   ]   * * V e r i f i c a c i � n   d e   e x i s t e n c i a * *   a n t e s   d e   e l i m i n a r 
 -   [   ]   * * M a n e j o   d e   e r r o r e s * *   c o m p l e t o 
 -   [   ]   * * A c t u a l i z a c i � n   a u t o m � t i c a * *   d e   l a   l i s t a 
 -   [   ]   * * M e n s a j e s   i n f o r m a t i v o s * *   s o b r e   l a   a c c i � n 
 -   [   ]   * * V a l i d a c i � n   d e   p e r m i s o s * *   ( s o l o   a d m i n i s t r a d o r e s ) 
 -   [   ]   * * P r e v e n c i � n   d e   a u t o - e l i m i n a c i � n * *   s i   a p l i c a 
 
 - - - 
 
 # # #   * *   R E G L A S   D E   E L I M I N A C I � N * * 
 
 # # # #   * * O B L I G A T O R I O : * * 
 1 .   * * D e f i n i r   c l a r a m e n t e * *   e l   t i p o   d e   e l i m i n a c i � n 
 2 .   * * M e n s a j e s   e x p l � c i t o s * *   s o b r e   l a   a c c i � n 
 3 .   * * C o n f i r m a c i � n   o b l i g a t o r i a * *   d e l   u s u a r i o 
 4 .   * * P r o t e c c i o n e s   d e   s e g u r i d a d * *   b � s i c a s 
 5 .   * * M a n e j o   d e   e r r o r e s * *   r o b u s t o 
 
 # # # #   * * R E C O M E N D A D O : * * 
 1 .   * * L o g s   d e   e l i m i n a c i � n * *   p a r a   a u d i t o r � a 
 2 .   * * V a l i d a c i o n e s   a d i c i o n a l e s * *   s e g � n   e l   c o n t e x t o 
 3 .   * * N o t i f i c a c i o n e s * *   a   u s u a r i o s   r e l a c i o n a d o s 
 4 .   * * B a c k u p   a u t o m � t i c o * *   a n t e s   d e   e l i m i n a c i � n   c r � t i c a 
 
 - - - 
 
 * * F e c h a   d e   e s t a b l e c i m i e n t o : * *   2 0 2 4 - 1 2 - 1 9 
 * * V e r s i � n : * *   1 . 0 
 * * E s t a d o : * *     P a t r o n e s   d e   s u b i d a   d e   a r c h i v o s   y   e l i m i n a c i � n   e s t a b l e c i d o s   y   d o c u m e n t a d o s 
 
 
