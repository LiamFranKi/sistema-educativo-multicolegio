# PATRÓN DE DISEÑO VISUAL UNIFICADO

## 🎨 Estructura de Diseño Establecida

### **Objetivo:**

Unificar el diseño visual de todos los componentes reutilizables del sistema para mantener consistencia, mejorar la experiencia de usuario y facilitar el mantenimiento del código.

**NOTA IMPORTANTE:** El sistema incluye temas dinámicos basados en la configuración del colegio, sidebar personalizado con información del usuario, barra de título mejorada con iconos de notificaciones y cerrar sesión, y módulo de configuración optimizado con layout compacto y diseño de 2 columnas.

**MÓDULO DE NIVELES EDUCATIVOS:** Implementación completa con configuración avanzada: interfaz de tabla profesional con chips de colores para Tipo Grados (azul) y Tipo Calificación (verde/rojo), formulario optimizado con campos en líneas compactas (sm=4 para básicos, sm=2.4 para calificaciones), comboboxes inteligentes con opciones A-D para cualitativa y 0-20 para cuantitativa, reset automático de valores al cambiar tipo, grilla actualizada sin columna Código y con columna Calificación Final, accesibilidad mejorada con atributos HTML apropiados, y notificaciones con SweetAlert2.
**MÓDULO DE GRADOS EDUCATIVOS:** Diseño alineado al patrón de mantenimiento: header con icono `School`, búsqueda, filtro por nivel (`Select`), botón "Nuevo Grado", tabla con Chips de código/estado y paginación. Formulario con generación automática de `codigo` y helper texts. Incluye campo foto con Avatar circular, imagen por defecto y gestión de imágenes en formulario. **ACTUALIZACIÓN 2025-01-12:** Agregado campo turno con combobox poblado desde tabla turnos, columna Alumnos en grilla (reemplaza Estado) con variable cantidad_alumnos (valor 0) preparada para futuras matriculas, vista de detalles simplificada con información académica destacada (nivel, sección, turno, año escolar), corrección de error 500 eliminando JOIN con tabla matriculas inexistente.

**MÓDULO DE ÁREAS EDUCATIVAS:** Diseño consistente con patrón de mantenimiento: header con icono `Category`, búsqueda por nombre/descripción/código, filtro por estado (`Select`), botón "Nueva Área", tabla con Chips de código/estado y paginación. Formulario con validaciones de códigos únicos y helper texts informativos. Notificaciones con SweetAlert2 y modo vista corregido para mostrar datos del área seleccionada. **ACTUALIZACIÓN 2025-01-12:** Creado componente AreasView.js dedicado para vista de detalles con formato profesional (cards, iconos, información organizada), siguiendo patrón de Grados y Usuarios.

**MÓDULO DE USUARIOS:** Diseño alineado al patrón de mantenimiento: header con icono `Person`, búsqueda por nombre/DNI, filtro por rol (`Select`), botón "Nuevo Usuario", tabla con Chips de rol/estado y paginación. Formulario con validaciones de DNI/email únicos y helper texts informativos. **ACTUALIZACIÓN 2025-01-12:** Agregado campo QR con generación automática (`USR-{timestamp}-{dni}`), visualización QR como imagen (60x60px) al lado de foto del usuario en vista de detalles, formulario con campo QR de solo lectura en modo edición, librería react-qr-code para renderizado de códigos escaneables, diseño optimizado eliminando cards redundantes. **ACTUALIZACIÓN 2025-01-12 (Menú de Opciones):** Implementado menú desplegable "Opciones" reemplazando múltiples iconos de acciones, filtro por rol funcional con valores correctos (Administrador, Docente, Alumno, Apoderado, Tutor), eliminada columna Estado de grilla, diseño de grilla con colores personalizados (cabecera azul #61a7d1, filas alternadas blanco/#e7f1f8, hover naranja #ffe6d9), menú profesional con iconos temáticos y preparado para futuras funcionalidades (QR, Permisos). **ACTUALIZACIÓN 2025-09-16 (Permisos, Roles y Accesibilidad):** Modal de "Gestionar Permisos" que solo edita Rol y Contraseña (contraseña opcional); nuevos roles agregados en selects y chips (`Psicologia`, `Secretaria`, `Director`, `Promotor`); mapeo de colores actualizado; accesibilidad mejorada con `id`/`name` en campos e `InputLabel` asociado por `labelId`; corrección de headings en `DialogTitle` con `component="span"`. **ACTUALIZACIÓN 2025-09-16 (Impresión de Carné QR):** Modal `UsuarioQRPrint` con vista carné (5.5cm x 8.5cm), QR centrado y tamaño controlado en cm (p.ej., 3.3cm), exportación fiel mediante `html2canvas` con opciones de Imprimir y Guardar PDF.

**MÓDULO DE CONFIGURACIÓN:** Diseño unificado con 3 grillas principales (Años Escolares, Niveles Educativos, Turnos Escolares) siguiendo patrón estándar establecido: headers con fondo azul `#61a7d1` y texto blanco negrita, filas alternadas (blanco y `#e7f1f8`), hover naranja suave `#ffe6d9 !important`, botón "Opciones" con menú desplegable contextual. **ACTUALIZACIÓN 2025-01-12:** Implementado formato estándar de grillas con menús específicos por tipo: Años Escolares (Establecer Actual, Activar/Desactivar, Eliminar), Niveles (Editar Nivel, Eliminar Nivel), Turnos (Editar Turno, Eliminar Turno). Eliminadas opciones no esenciales (Reportes, Currículo, Horarios) para mantener menús concisos y funcionales.

**FORMATO ESTÁNDAR DE GRILLAS/TABLAS:** Patrón establecido para todas las grillas futuras del sistema: cabecera azul `#61a7d1` con texto blanco negrita, filas alternadas blanco y `#e7f1f8`, hover `#ffe6d9 !important`, botón "Opciones" con menú desplegable contextual, colores unificados y funcionalidad modular preparada para futuras opciones según necesidades.

**SISTEMA DE GAMIFICACIÓN EDUCATIVA (FUTURO):** Planificación de un sistema de gamificación que convertirá cada bimestre en un "mundo" explorable estilo videojuego, con progresión lineal, elementos lúdicos (retos, puntos, avatares), y experiencia inmersiva para motivar el aprendizaje de los estudiantes.

**PWA (PROGRESSIVE WEB APP) - FUTURO:** Planificación para convertir el sistema web en aplicación móvil instalable con funcionalidad offline, notificaciones push, y experiencia nativa en dispositivos móviles.

**JUEGOS INTERACTIVOS EDUCATIVOS (FUTURO):** Desarrollo de mini-juegos educativos, simuladores virtuales, y elementos lúdicos integrados al sistema de aprendizaje para aumentar el engagement y motivación de los estudiantes.

---

## 🎯 **1. TEMA MATERIAL-UI BASE**

### **Paleta de Colores Estática (Fallback):**

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Azul principal
      light: "#42a5f5", // Azul claro
      dark: "#1565c0", // Azul oscuro
    },
    secondary: {
      main: "#424242", // Gris principal
      light: "#6d6d6d", // Gris claro
      dark: "#1b1b1b", // Gris oscuro
    },
    background: {
      default: "#f5f5f5", // Fondo general
      paper: "#ffffff", // Fondo de tarjetas
    },
    text: {
      primary: "#212121", // Texto principal
      secondary: "#757575", // Texto secundario
    },
    success: {
      main: "#2e7d32", // Verde para éxito
    },
    warning: {
      main: "#ed6c02", // Naranja para advertencias
    },
    error: {
      main: "#d32f2f", // Rojo para errores
    },
    info: {
      main: "#1976d2", // Azul para información
    },
  },
});
```

### **Tema Dinámico (Configuración del Colegio):**

```javascript
// ThemeContext.js - Tema dinámico basado en configuración
const createDynamicTheme = (colegio) => {
  return createTheme({
    palette: {
      primary: {
        main: colegio.color_primario || "#1976d2",
        light: lighten(colegio.color_primario || "#1976d2", 0.3),
        dark: darken(colegio.color_primario || "#1976d2", 0.3),
      },
      secondary: {
        main: colegio.color_secundario || "#424242",
        light: lighten(colegio.color_secundario || "#424242", 0.3),
        dark: darken(colegio.color_secundario || "#424242", 0.3),
      },
      text: {
        primary: "#212121",
        secondary: colegio.color_secundario || "#757575", // Color secundario del colegio
      },
      // ... resto de colores estáticos
    },
  });
};
```

### **Tipografía:**

```javascript
typography: {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontSize: '2.5rem', fontWeight: 500 },
  h2: { fontSize: '2rem', fontWeight: 500 },
  h3: { fontSize: '1.75rem', fontWeight: 500 },
  h4: { fontSize: '1.5rem', fontWeight: 500 },
  h5: { fontSize: '1.25rem', fontWeight: 500 },
  h6: { fontSize: '1rem', fontWeight: 500 },
  body1: { fontSize: '1rem', lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', lineHeight: 1.43 },
  button: { fontSize: '0.875rem', fontWeight: 500, textTransform: 'none' }
}
```

### **Formas y Espaciado:**

```javascript
shape: {
  borderRadius: 8,          // Radio de bordes estándar
},
spacing: 8,                 // Unidad base de espaciado (8px)
```

---

## 🎨 **1.5. COMPONENTES ESPECÍFICOS DEL SISTEMA**

### **A) Sidebar Personalizado (AdminSidebar.js)**

#### **Estructura Visual:**

```javascript
// Sidebar con fondo azul elegante (#0165a1)
const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    backgroundColor: "#0165a1", // Azul elegante
    borderRight: "1px solid #014a7a",
    "&::-webkit-scrollbar": {
      width: "3px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#0165a1", // Mismo color que el fondo
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#0165a1", // Invisible
      "&:hover": {
        background: "#014a7a",
      },
    },
  },
}));

// Información del usuario con padding mejorado
<Box
  sx={{
    p: 2,
    textAlign: "center",
    borderBottom: "1px solid #014a7a",
    background: "rgba(1, 101, 161, 0.3)",
    pt: 4, // Más padding superior
    pb: 2,
    px: 2,
  }}
>
  <Avatar
    sx={{
      width: 120, // 100% más grande que el original (60px)
      height: 120,
      mx: "auto",
      mb: 1,
      bgcolor: "rgba(255, 255, 255, 0.2)",
      border: "2px solid rgba(255, 255, 255, 0.3)",
    }}
  >
    {user?.foto ? (
      <img
        src={getImageUrl(user.foto)}
        alt="Foto del usuario"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
        onError={(e) => {
          console.error("Error cargando foto de usuario:", e.target.src);
          e.target.style.display = "none";
        }}
      />
    ) : (
      <AccountCircleIcon sx={{ fontSize: 60, color: "white" }} />
    )}
  </Avatar>
  <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 0.5 }}>
    {user?.nombres || "Administrador"}
  </Typography>
  <Typography
    variant="body2"
    color="rgba(255, 255, 255, 0.7)"
    sx={{ fontSize: "0.75rem", fontWeight: 500 }}
  >
    ADMINISTRADOR
  </Typography>
</Box>;
```

#### **Iconos del Menú con Colores Vibrantes:**

```javascript
// Función para colores vibrantes de iconos
const getIconColor = (iconName) => {
  const colors = {
    Dashboard: "#00E676", // Verde brillante
    "Mi Perfil": "#00B0FF", // Azul brillante
    Matrículas: "#FF6D00", // Naranja vibrante
    Usuarios: "#D500F9", // Púrpura vibrante
    Avatars: "#FF1744", // Rosa vibrante
    Grados: "#00E5FF", // Cian brillante
    Areas: "#FF8F00", // Naranja dorado
    Cursos: "#00C853", // Verde esmeralda
    Asignaturas: "#651FFF", // Índigo vibrante
    Publicaciones: "#FF3D00", // Rojo vibrante
    Eventos: "#76FF03", // Verde lima
    Comunicados: "#FFD600", // Amarillo dorado
    Mensajes: "#00E676", // Verde agua
    Alertas: "#FF1744", // Rojo intenso
    Notificaciones: "#7C4DFF", // Púrpura brillante
    Reportes: "#FF9100", // Naranja intenso
    Configuración: "#00BCD4", // Cian profundo
  };
  return colors[iconName] || "white";
};

// Estilos de iconos con efectos visuales
<ListItemIcon
  sx={{
    color: getIconColor(item.text),
    minWidth: 40,
    "& .MuiSvgIcon-root": {
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.1)",
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
      },
    },
  }}
>
  {item.icon}
</ListItemIcon>;
```

### **B) Barra de Título Mejorada (AdminLayout.js)**

#### **Estructura Visual:**

```javascript
// AppBar con color consistente con el sidebar
<AppBar
  position="fixed"
  sx={{
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    ml: { sm: `${drawerWidth}px` },
    zIndex: (theme) => theme.zIndex.drawer + 1,
    backgroundColor: "#0165a1", // Mismo color que el sidebar
  }}
>
  <Toolbar>
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={handleDrawerToggle}
      sx={{ mr: 2, display: { sm: "none" } }}
    >
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
      {colegio.nombre || "Administración del Colegio"}
    </Typography>

    {/* Iconos de la barra de título */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/* Icono de Notificaciones */}
      <IconButton
        color="inherit"
        aria-label="notificaciones"
        sx={{
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Badge badgeContent={0} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Icono de Cerrar Sesión */}
      <IconButton
        color="inherit"
        aria-label="cerrar sesión"
        onClick={onLogout}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <LogoutIcon />
      </IconButton>
    </Box>
  </Toolbar>
</AppBar>
```

### **C) Página de Login con Tema Dinámico**

#### **Estructura Visual:**

```javascript
// Aplicación de fondo dinámico
<Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      colegio.background_tipo === "imagen"
        ? `url(${colegio.background_imagen}) center/cover no-repeat`
        : colegio.background_color ||
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  }}
>
  {/* Contenido del login con tema dinámico */}
</Box>
```

### **D) Dashboard con Estadísticas Reales**

#### **Estructura Visual:**

```javascript
// Contenedor principal del dashboard
<Box sx={{ p: 3 }}>
  {/* Título del dashboard */}
  <Typography variant="h4" gutterBottom sx={{ mb: 4, color: "primary.main" }}>
    Panel de Administración
  </Typography>

  {/* Grid de estadísticas responsivo */}
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
</Box>
```

#### **Tarjetas de Estadísticas:**

```javascript
// Patrón de tarjeta de estadística
<Card
  sx={{
    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
    color: "white",
    textAlign: "center",
    p: 3,
    borderRadius: 2,
    boxShadow: 3,
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 6,
      transition: "all 0.3s ease",
    },
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

#### **Colores de Tarjetas por Rol:**

```javascript
// Paleta de colores específica para cada rol
const cardStyles = {
  administradores: {
    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)", // Azul
    icon: <AdminPanelSettingsIcon />,
  },
  docentes: {
    background: "linear-gradient(135deg, #dc004e 0%, #c2185b 100%)", // Rojo
    icon: <SchoolIcon />,
  },
  alumnos: {
    background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)", // Verde
    icon: <PeopleIcon />,
  },
  apoderados: {
    background: "linear-gradient(135deg, #ed6c02 0%, #f57c00 100%)", // Naranja
    icon: <FamilyIcon />,
  },
  tutores: {
    background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)", // Morado
    icon: <SupportIcon />,
  },
};
```

#### **Loading State del Dashboard:**

```javascript
// Spinner de carga global
{
  loading && (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Cargando estadísticas...
      </Typography>
    </Box>
  );
}
```

---

## 🧩 **2. COMPONENTES REUTILIZABLES - DISEÑO**

### **A) DataTable - Tabla de Datos**

#### **Estructura Visual:**

```javascript
// Contenedor principal
<Paper
  sx={{
    width: "100%",
    overflow: "hidden",
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  }}
>
  // Header con título y botón "Nuevo"
  <Box
    sx={{
      p: 3,
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Typography variant="h5" color="primary">
      {titulo}
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      sx={{ borderRadius: 2 }}
    >
      Nuevo
    </Button>
  </Box>
  // Barra de búsqueda
  <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
    <TextField
      placeholder="Buscar..."
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
      }}
      sx={{ width: 300 }}
    />
  </Box>
  // Tabla
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          {/* Columnas */}
        </TableRow>
      </TableHead>
      <TableBody>{/* Filas de datos */}</TableBody>
    </Table>
  </TableContainer>
  // Paginación
  <TablePagination
    component="div"
    count={total}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    sx={{ borderTop: "1px solid #e0e0e0" }}
  />
</Paper>
```

#### **Estilos de Filas:**

```javascript
// Fila normal
<TableRow
  hover
  sx={{
    '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
    '&:hover': { backgroundColor: '#e3f2fd' }
  }}
>

// Fila seleccionada
<TableRow
  selected
  sx={{ backgroundColor: '#e3f2fd' }}
>
```

### **B) FormDialog - Modal de Formulario**

#### **Estructura Visual:**

```javascript
<Dialog
  open={open}
  onClose={onClose}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    },
  }}
>
  // Header del modal
  <DialogTitle
    sx={{
      p: 3,
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "#f8f9fa",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Icon sx={{ mr: 2, color: "primary.main" }}>
        {mode === "create" ? <AddIcon /> : <EditIcon />}
      </Icon>
      <Typography variant="h6" color="primary">
        {mode === "create" ? "Nuevo" : "Editar"} {titulo}
      </Typography>
    </Box>
  </DialogTitle>
  // Contenido del formulario
  <DialogContent sx={{ p: 3 }}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Campos del formulario */}
    </Box>
  </DialogContent>
  // Footer con botones
  <DialogActions
    sx={{
      p: 3,
      borderTop: "1px solid #e0e0e0",
      backgroundColor: "#f8f9fa",
      gap: 1,
    }}
  >
    <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
      Cancelar
    </Button>
    <Button
      onClick={onSave}
      variant="contained"
      disabled={loading}
      sx={{ borderRadius: 2 }}
    >
      {loading ? <CircularProgress size={20} /> : "Guardar"}
    </Button>
  </DialogActions>
</Dialog>
```

### **C) ConfirmDialog - Modal de Confirmación**

#### **Estructura Visual:**

```javascript
<Dialog
  open={open}
  onClose={onClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    },
  }}
>
  <DialogContent sx={{ p: 4, textAlign: "center" }}>
    <Box sx={{ mb: 3 }}>
      <WarningIcon
        sx={{
          fontSize: 64,
          color: "warning.main",
          mb: 2,
        }}
      />
    </Box>
    <Typography variant="h6" gutterBottom>
      {titulo}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {mensaje}
    </Typography>
  </DialogContent>

  <DialogActions
    sx={{
      p: 3,
      justifyContent: "center",
      gap: 2,
    }}
  >
    <Button
      onClick={onClose}
      variant="outlined"
      sx={{ borderRadius: 2, minWidth: 100 }}
    >
      Cancelar
    </Button>
    <Button
      onClick={onConfirm}
      variant="contained"
      color="error"
      sx={{ borderRadius: 2, minWidth: 100 }}
    >
      Confirmar
    </Button>
  </DialogActions>
</Dialog>
```

### **D) SearchBar - Barra de Búsqueda**

#### **Estructura Visual:**

```javascript
<Box
  sx={{
    p: 2,
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #e0e0e0",
  }}
>
  <TextField
    placeholder="Buscar..."
    variant="outlined"
    size="small"
    value={searchTerm}
    onChange={handleSearch}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: "text.secondary" }} />
        </InputAdornment>
      ),
      endAdornment: searchTerm && (
        <InputAdornment position="end">
          <IconButton
            size="small"
            onClick={handleClear}
            sx={{ color: "text.secondary" }}
          >
            <ClearIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
    sx={{
      width: 300,
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        backgroundColor: "white",
      },
    }}
  />
</Box>
```

### **E) ActionButtons - Botones de Acción**

#### **Estructura Visual:**

```javascript
<Box sx={{ display: "flex", gap: 1 }}>
  <IconButton
    size="small"
    onClick={() => onView(item)}
    sx={{
      color: "info.main",
      "&:hover": { backgroundColor: "info.light", color: "white" },
    }}
    title="Ver"
  >
    <VisibilityIcon />
  </IconButton>

  <IconButton
    size="small"
    onClick={() => onEdit(item)}
    sx={{
      color: "primary.main",
      "&:hover": { backgroundColor: "primary.light", color: "white" },
    }}
    title="Editar"
  >
    <EditIcon />
  </IconButton>

  <IconButton
    size="small"
    onClick={() => onDelete(item.id)}
    sx={{
      color: "error.main",
      "&:hover": { backgroundColor: "error.light", color: "white" },
    }}
    title="Eliminar"
  >
    <DeleteIcon />
  </IconButton>
</Box>
```

---

## 🎨 **3. ESTILOS ESPECÍFICOS**

### **Botones:**

```javascript
// Botón primario
sx={{
  borderRadius: 2,
  textTransform: 'none',
  fontWeight: 500,
  px: 3,
  py: 1
}}

// Botón secundario
sx={{
  borderRadius: 2,
  textTransform: 'none',
  fontWeight: 500,
  px: 3,
  py: 1,
  borderColor: 'primary.main',
  color: 'primary.main'
}}
```

### **Tarjetas:**

```javascript
sx={{
  borderRadius: 2,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease'
  }
}}
```

### **Campos de Formulario:**

```javascript
sx={{
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'primary.main'
    }
  }
}}
```

### **Modales:**

```javascript
sx={{
  borderRadius: 3,
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  '& .MuiDialog-paper': {
    borderRadius: 3
  }
}}
```

---

## 📱 **4. RESPONSIVE DESIGN**

### **Breakpoints:**

```javascript
// Mobile (xs): 0px - 600px
// Tablet (sm): 600px - 960px
// Desktop (md): 960px - 1280px
// Large (lg): 1280px - 1920px
// XL (xl): 1920px+
```

### **Adaptaciones por Dispositivo:**

```javascript
// DataTable responsive
<TableContainer sx={{
  [theme.breakpoints.down('sm')]: {
    '& .MuiTable-root': {
      fontSize: '0.75rem'
    }
  }
}}>

// FormDialog responsive
<Dialog
  fullWidth
  maxWidth="md"
  sx={{
    [theme.breakpoints.down('sm')]: {
      '& .MuiDialog-paper': {
        margin: 1,
        maxHeight: 'calc(100% - 16px)'
      }
    }
  }}
>
```

---

## 🎯 **5. ESTADOS VISUALES**

### **Loading States:**

```javascript
// Botón con loading
<Button
  disabled={loading}
  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
>
  {loading ? 'Guardando...' : 'Guardar'}
</Button>

// Tabla con loading
{loading ? (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <CircularProgress />
    <Typography sx={{ mt: 2 }}>Cargando datos...</Typography>
  </Box>
) : (
  // Contenido de la tabla
)}
```

### **Empty States:**

```javascript
<Box
  sx={{
    p: 4,
    textAlign: "center",
    color: "text.secondary",
  }}
>
  <InboxIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
  <Typography variant="h6" gutterBottom>
    No hay datos disponibles
  </Typography>
  <Typography variant="body2">{mensajeEmptyState}</Typography>
</Box>
```

### **Error States:**

```javascript
<Alert
  severity="error"
  sx={{
    borderRadius: 2,
    "& .MuiAlert-icon": {
      fontSize: "1.5rem",
    },
  }}
>
  <Typography variant="subtitle2" gutterBottom>
    Error al cargar los datos
  </Typography>
  <Typography variant="body2">{mensajeError}</Typography>
</Alert>
```

---

## 🚀 **6. IMPLEMENTACIÓN**

### **Archivo de Tema Extendido:**

```javascript
// frontend/src/theme/index.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  // ... configuración base existente

  // Componentes personalizados
  components: {
    MuiDataTable: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiFormDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      },
    },
  },
});
```

### **Componentes Base:**

```javascript
// frontend/src/components/Common/DataTable.js
// frontend/src/components/Common/FormDialog.js
// frontend/src/components/Common/ConfirmDialog.js
// frontend/src/components/Common/SearchBar.js
// frontend/src/components/Common/ActionButtons.js
```

---

## ✅ **7. CHECKLIST DE DISEÑO**

- [ ] Tema Material-UI personalizado implementado
- [ ] Componentes reutilizables con estilos unificados
- [ ] Responsive design aplicado
- [ ] Estados visuales (loading, empty, error) definidos
- [ ] Paleta de colores consistente
- [ ] Tipografía estandarizada
- [ ] Espaciado y bordes uniformes
- [ ] Animaciones y transiciones suaves
- [ ] Accesibilidad considerada
- [ ] Documentación visual completa

---

## 🎨 **8. EJEMPLOS VISUALES**

### **DataTable:**

- Header con título y botón "Nuevo"
- Barra de búsqueda integrada
- Tabla con filas alternadas
- Botones de acción por fila
- Paginación en la parte inferior

### **FormDialog:**

- Modal centrado con sombra suave
- Header con icono y título
- Formulario con campos espaciados
- Footer con botones alineados a la derecha

### **ConfirmDialog:**

- Modal pequeño centrado
- Icono de advertencia grande
- Mensaje centrado
- Botones centrados

---

**Fecha de creación:** 2024-12-19
**Versión:** 1.0
**Estado:** ✅ Establecido y listo para implementación

---

## 🔧 **MÓDULO DE CONFIGURACIÓN - DISEÑO**

### **Estructura Visual:**

- **Header:** Icono de configuración + título "Configuración del Sistema"
- **Cards:** Información del Colegio, Configuración de Colores, Información del Sistema
- **Modo Edición:** Botón "Editar" en la esquina superior derecha
- **Botones de Acción:** "Cancelar" y "Guardar Cambios" alineados a la derecha

### **Componentes Específicos:**

- **Avatar del Logo:** 120x120px con borde gris
- **Preview de Colores:** Cuadrados de 40x40px con borde
- **Campos de Texto:** Variante "filled" en modo lectura, "outlined" en edición
- **Alerta Informativa:** Severity "info" al final del formulario

### **Responsive Design:**

- **Desktop:** Grid de 2 columnas (logo + información)
- **Tablet:** Grid de 1 columna con logo centrado
- **Mobile:** Campos apilados verticalmente

### **Estados Visuales:**

- **Cargando:** CircularProgress centrado
- **Guardando:** Botón con spinner y texto "Guardando..."
- **Error:** Toast de error con SweetAlert2
- **Éxito:** Toast de éxito con confirmación

---

## 👤 **MÓDULO MI PERFIL - DISEÑO VISUAL**

### **Estructura Visual Principal:**

```javascript
// Contenedor principal del perfil
<Box sx={{ p: 3 }}>
  {/* Header del perfil con avatar y botón de edición */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 4,
      p: 3,
      backgroundColor: "background.paper",
      borderRadius: 2,
      boxShadow: 1,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: "primary.main" }}>
        {/* Foto del usuario o icono por defecto */}
      </Avatar>
      <Box>
        <Typography variant="h4" color="primary" gutterBottom>
          {user?.nombres && user?.apellidos
            ? `${user.nombres} ${user.apellidos}`
            : user?.nombres || "Usuario"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.rol || "Administrador"}
        </Typography>
      </Box>
    </Box>

    {/* Botón de edición */}
    <Button
      variant={editing ? "outlined" : "contained"}
      startIcon={editing ? <CloseIcon /> : <EditIcon />}
      onClick={editing ? handleCancelEdit : () => setEditing(true)}
      sx={{ borderRadius: 2 }}
    >
      {editing ? "Cancelar" : "Editar Perfil"}
    </Button>
  </Box>
</Box>
```

### **Formulario de Perfil - Layout de 2 Columnas:**

```javascript
// Formulario principal con Grid responsivo
<Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
  <Grid container spacing={3}>
    {/* Columna izquierda - Información personal */}
    <Grid item xs={12} md={6}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "primary.main", mb: 2 }}
      >
        Información Personal
      </Typography>

      {/* Campos de información básica */}
      <TextField
        fullWidth
        label="Nombres"
        value={formData.nombres}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, nombres: e.target.value }))
        }
        disabled={!editing}
        error={!!errors.nombres}
        helperText={errors.nombres}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Apellidos"
        value={formData.apellidos}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, apellidos: e.target.value }))
        }
        disabled={!editing}
        sx={{ mb: 2 }}
      />

      {/* ... más campos */}
    </Grid>

    {/* Columna derecha - Información adicional */}
    <Grid item xs={12} md={6}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "primary.main", mb: 2 }}
      >
        Información Adicional
      </Typography>

      {/* Campos de información adicional */}
      <TextField
        fullWidth
        label="Dirección"
        multiline
        rows={3}
        value={formData.direccion}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, direccion: e.target.value }))
        }
        disabled={!editing}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Género</InputLabel>
        <Select
          value={formData.genero}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, genero: e.target.value }))
          }
          disabled={!editing}
          label="Género"
        >
          <MenuItem value="Masculino">Masculino</MenuItem>
          <MenuItem value="Femenino">Femenino</MenuItem>
          <MenuItem value="Otro">Otro</MenuItem>
        </Select>
      </FormControl>

      {/* ... más campos */}
    </Grid>
  </Grid>
</Paper>
```

### **Sección de Foto de Perfil:**

```javascript
// Sección de foto con preview
<Box sx={{ mt: 3, p: 3, backgroundColor: "grey.50", borderRadius: 2 }}>
  <Typography variant="h6" gutterBottom sx={{ color: "primary.main", mb: 2 }}>
    Foto de Perfil
  </Typography>

  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
    {/* Avatar actual */}
    <Avatar sx={{ width: 100, height: 100, bgcolor: "primary.main" }}>
      {previewImage ? (
        <img
          src={previewImage}
          alt="Preview"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ) : user?.foto ? (
        <img
          src={getImageUrl(user.foto)}
          alt="Foto del usuario"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ) : (
        <AccountCircleIcon sx={{ fontSize: 50 }} />
      )}
    </Avatar>

    {/* Botón de subida */}
    <Box>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="photo-upload"
        type="file"
        onChange={handlePhotoUpload}
        disabled={!editing}
      />
      <label htmlFor="photo-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={!editing}
          sx={{ borderRadius: 2 }}
        >
          {editing ? "Cambiar Foto" : "Ver Foto"}
        </Button>
      </label>
      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, color: "text.secondary" }}
      >
        Máximo 5MB. Formatos: JPG, PNG, GIF
      </Typography>
    </Box>
  </Box>
</Box>
```

### **Sección de Cambio de Contraseña:**

```javascript
// Sección de cambio de contraseña (solo en modo edición)
{
  editing && (
    <Box
      sx={{ mt: 3, p: 3, backgroundColor: "warning.light", borderRadius: 2 }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "warning.dark", mb: 2 }}
      >
        Cambio de Contraseña
      </Typography>

      {!showPasswords ? (
        <Button
          variant="outlined"
          startIcon={<LockIcon />}
          onClick={() => setShowPasswords(true)}
          sx={{ borderRadius: 2 }}
        >
          Cambiar Contraseña
        </Button>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Contraseña Actual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
          />
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
          <TextField
            fullWidth
            label="Confirmar Nueva Contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handlePasswordChange}
              disabled={saving}
              sx={{ borderRadius: 2 }}
            >
              {saving ? <CircularProgress size={20} /> : "Cambiar Contraseña"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowPasswords(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
```

### **Botones de Acción:**

```javascript
// Botones de acción (solo en modo edición)
{
  editing && (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        mt: 4,
        pt: 3,
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Button
        variant="outlined"
        onClick={handleCancelEdit}
        sx={{ borderRadius: 2 }}
      >
        Cancelar
      </Button>
      <Button
        variant="contained"
        onClick={handleSaveProfile}
        disabled={saving}
        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
        sx={{ borderRadius: 2 }}
      >
        {saving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </Box>
  );
}
```

### **Estados Visuales del Perfil:**

```javascript
// Estado de carga
{
  loading && (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Cargando perfil...
      </Typography>
    </Box>
  );
}

// Estado de error
{
  error && (
    <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Error al cargar el perfil
      </Typography>
      <Typography variant="body2">{error}</Typography>
    </Alert>
  );
}
```

### **Responsive Design del Perfil:**

```javascript
// Grid responsivo para el formulario
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    {/* Información personal */}
  </Grid>
  <Grid item xs={12} md={6}>
    {/* Información adicional */}
  </Grid>
</Grid>

// Avatar responsivo
<Avatar
  sx={{
    width: { xs: 60, sm: 80, md: 100 },
    height: { xs: 60, sm: 80, md: 100 },
    mr: { xs: 2, sm: 3 },
  }}
>

// Botones responsivos
<Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 2,
  justifyContent: 'flex-end'
}}>
  <Button variant="outlined">Cancelar</Button>
  <Button variant="contained">Guardar</Button>
</Box>
```

### **Características de Diseño:**

- **Header del Perfil:** Avatar grande (80x80px) con nombre completo y rol
- **Formulario de 2 Columnas:** Información personal a la izquierda, información adicional a la derecha
- **Sección de Foto:** Preview inmediato con botón de subida
- **Cambio de Contraseña:** Sección separada con fondo de advertencia
- **Botones de Acción:** Alineados a la derecha con estados de carga
- **Responsive:** Grid que se adapta a móvil (1 columna) y desktop (2 columnas)
- **Estados Visuales:** Loading, error y éxito con feedback visual claro
- **Validaciones:** Campos con errores resaltados en rojo
- **Modo Edición:** Campos deshabilitados en modo lectura, habilitados en edición

---

## 🎮 **SISTEMA DE GAMIFICACIÓN EDUCATIVA (FUTURO)**

### **Concepto de Diseño:**

El sistema de gamificación transformará la experiencia de aprendizaje en una aventura interactiva estilo videojuego, donde cada bimestre se convierte en un "mundo" explorable.

### **Estructura Visual Propuesta:**

#### **A) Interfaz de Mundo/Mapa**

```javascript
// Componente principal del mundo de aprendizaje
const LearningWorld = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      {/* Mapa del mundo con islas flotantes */}
      <WorldMap>
        {/* Bimestre 1 - Mundo Desbloqueado */}
        <FloatingIsland
          status="unlocked"
          progress={75}
          biome="forest"
          position={{ x: 100, y: 200 }}
        >
          <IslandContent>
            <TempleBuilding />
            <CrystalReward />
            <ProgressIndicator />
          </IslandContent>
        </FloatingIsland>

        {/* Bimestre 2 - Mundo Bloqueado */}
        <FloatingIsland
          status="locked"
          progress={0}
          biome="desert"
          position={{ x: 400, y: 150 }}
        >
          <IslandContent>
            <LockedTemple />
            <LockIcon />
          </IslandContent>
        </FloatingIsland>
      </WorldMap>
    </Box>
  );
};
```

#### **B) Elementos de Gamificación**

```javascript
// Sistema de progreso y recompensas
const GamificationElements = {
  // Barras de progreso
  progressBar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    height: "8px",
    overflow: "hidden",
    "& .MuiLinearProgress-bar": {
      background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
      borderRadius: "20px",
    },
  },

  // Cristales de recompensa
  crystalReward: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(45deg, #00E5FF, #2196F3)",
    borderRadius: "50%",
    boxShadow: "0 0 20px rgba(0, 229, 255, 0.6)",
    animation: "pulse 2s infinite",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "20px",
  },

  // Avatares desbloqueados
  avatarUnlocked: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "3px solid #4CAF50",
    boxShadow: "0 0 15px rgba(76, 175, 80, 0.5)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: "0 0 25px rgba(76, 175, 80, 0.8)",
    },
  },

  // Puntos y logros
  pointsDisplay: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "10px 20px",
    borderRadius: "25px",
    fontSize: "18px",
    fontWeight: "bold",
  },
};
```

#### **C) Estados de Progresión**

```javascript
// Estados visuales para diferentes niveles de completitud
const ProgressStates = {
  locked: {
    opacity: 0.3,
    filter: "grayscale(100%)",
    cursor: "not-allowed",
    "&:hover": {
      transform: "none",
    },
  },

  unlocked: {
    opacity: 1,
    filter: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    },
  },

  inProgress: {
    opacity: 0.8,
    filter: "none",
    cursor: "pointer",
    border: "3px solid #FF9800",
    animation: "glow 2s infinite alternate",
  },

  completed: {
    opacity: 1,
    filter: "none",
    cursor: "pointer",
    border: "3px solid #4CAF50",
    boxShadow: "0 0 20px rgba(76, 175, 80, 0.5)",
  },
};
```

#### **D) Animaciones y Transiciones**

```javascript
// Keyframes para animaciones
const keyframes = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(255, 152, 0, 0.5); }
    100% { box-shadow: 0 0 20px rgba(255, 152, 0, 0.8); }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

// Aplicación de animaciones
const FloatingIsland = styled(Box)({
  animation: "float 3s ease-in-out infinite",
  "&:hover": {
    animation: "none",
    transform: "translateY(-5px)",
  },
});
```

### **Estructura de Datos para Gamificación:**

```javascript
// Estructura de datos para el sistema de gamificación
const GamificationData = {
  student: {
    id: "student_123",
    name: "Juan Pérez",
    level: "Secundaria",
    totalPoints: 1250,
    currentBimestre: 1,
    unlockedAvatars: ["avatar_1", "avatar_3"],
    achievements: ["first_complete", "perfect_score"],
  },

  course: {
    id: "math_001",
    name: "Matemáticas",
    level: "Secundaria",
    bimestres: [
      {
        id: "bimestre_1",
        name: "Números Enteros",
        status: "in_progress", // locked, unlocked, in_progress, completed
        progress: 75,
        world: {
          biome: "forest",
          theme: "green",
          position: { x: 100, y: 200 },
        },
        topics: [
          {
            id: "topic_1",
            name: "Suma y Resta",
            status: "completed",
            points: 100,
          },
          {
            id: "topic_2",
            name: "Multiplicación",
            status: "in_progress",
            points: 50,
          },
        ],
        tasks: [
          {
            id: "task_1",
            name: "Ejercicios Prácticos",
            status: "pending",
            points: 150,
            type: "practice",
          },
        ],
        exams: [
          {
            id: "exam_1",
            name: "Examen Bimestral",
            status: "locked",
            points: 300,
            type: "final",
          },
        ],
      },
    ],
  },
};
```

### **Objetivos de Diseño:**

1. **Inmersión Total**: Ocultar elementos de navegación tradicional
2. **Progresión Visual**: Mostrar claramente el avance del estudiante
3. **Motivación**: Elementos visuales atractivos que incentiven el aprendizaje
4. **Claridad**: Interfaz intuitiva que no confunda al usuario
5. **Responsive**: Adaptable a diferentes tamaños de pantalla
6. **Performance**: Animaciones suaves sin afectar el rendimiento

---

## 📊 **FORMATO DE GRILLA/TABLA PROFESIONAL**

### **Patrón Establecido para Módulos de Configuración:**

El sistema implementa un formato de grilla/tabla profesional para módulos de configuración que optimiza el espacio y mejora la escalabilidad.

### **Estructura de Tabla:**

```jsx
<Paper
  sx={{
    mb: 2,
    overflow: "hidden",
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  }}
>
  {/* Header con título y botón "Nuevo" */}
  <Box
    sx={{
      p: 2,
      borderBottom: "1px solid #e0e0e0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <IconComponent color="primary" sx={{ fontSize: 20 }} />
      <Typography variant="h6" color="primary">
        Título del Módulo
      </Typography>
    </Box>
    <Button variant="contained" startIcon={<AddIcon />} size="small">
      Nuevo Elemento
    </Button>
  </Box>

  {/* Formulario de creación/edición */}
  {mode && (
    <Box
      sx={{
        p: 2,
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "grey.50",
      }}
    >
      {/* Formulario aquí */}
    </Box>
  )}

  {/* Barra de búsqueda */}
  <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
    <TextField
      placeholder="Buscar..."
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: <SearchIcon />,
        endAdornment: <ClearIcon />,
      }}
      sx={{ width: 400 }}
    />
  </Box>

  {/* Tabla */}
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          <TableCell align="center">Columna 1</TableCell>
          <TableCell align="center">Columna 2</TableCell>
          <TableCell align="center">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{/* Filas de datos */}</TableBody>
    </Table>
  </TableContainer>

  {/* Paginación */}
  <TablePagination
    component="div"
    count={totalItems}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[5, 10, 25]}
  />
</Paper>
```

### **Características del Formato:**

1. **Header Unificado**: Título con icono y botón de acción principal
2. **Formulario Contextual**: Creación/edición en la parte superior cuando es necesario
3. **Búsqueda Integrada**: Barra de búsqueda con iconos y funcionalidad de limpiar
4. **Tabla Profesional**: Headers con fondo gris, filas alternadas, hover effects
5. **Paginación Completa**: Control de filas por página y navegación
6. **Menús de Opciones Condicionales**: Menús desplegables según rol del usuario
7. **Estados Visuales**: Resaltado especial para elementos importantes
8. **Responsive**: Adaptable a diferentes tamaños de pantalla

### **Beneficios del Formato:**

- **Ahorro de Espacio**: Más información visible en menos espacio vertical
- **Escalabilidad**: Maneja grandes cantidades de datos eficientemente
- **Consistencia**: Mismo patrón en todos los módulos
- **UX Optimizada**: Navegación intuitiva con búsqueda y paginación
- **Mantenibilidad**: Código reutilizable y fácil de mantener

### **Módulos Implementados:**

- ✅ **Niveles Educativos**: CRUD completo con búsqueda y paginación
- ✅ **Grados Educativos**: CRUD completo con filtro por nivel, Chips de estado/código y generación automática de códigos
- ✅ **Áreas Educativas**: CRUD completo con 12 áreas predefinidas, códigos únicos y filtros por estado
- ✅ **Gestión de Años Escolares**: Con ordenamiento por año descendente

## **MENÚS DE OPCIONES CONDICIONALES POR ROL**

### **Patrón de Menús Desplegables:**

- **Ubicación**: Icono de tres puntos verticales en cada fila de la grilla
- **Comportamiento**: Menú contextual que muestra opciones según el rol del usuario
- **Diseño**: Fondo blanco, sombra sutil, bordes redondeados
- **Íconos**: Material-UI Icons con colores temáticos por tipo de acción

### **Configuración por Rol:**

- **Alumno**: 9 opciones (Ver Información, Imprimir Código QR, Enviar Mensaje, Matrículas Registradas, Padres de Familia, Historial de Pagos, Gestionar Permisos, Editar Usuario, Eliminar Usuario)
- **Docente**: 7 opciones (Ver Información, Imprimir Código QR, Ver Horario, Enviar Mensaje, Gestionar Permisos, Editar Usuario, Eliminar Usuario)
- **Apoderado**: 7 opciones (Ver Información, Imprimir Código QR, Alumnos a Cargo, Enviar Mensaje, Gestionar Permisos, Editar Usuario, Eliminar Usuario)
- **Roles administrativos**: 7 opciones (Administrador, Director, Secretaria, Psicologia, Tutor, Promotor): Ver Información, Imprimir Código QR, Ver Horario, Enviar Mensaje, Gestionar Permisos, Editar Usuario, Eliminar Usuario

### **Estados de Opciones:**

- **Implementadas**: Con funcionalidad completa y navegación
- **Pendientes**: Sin funcionalidad, solo cierran el menú sin errores
- **Críticas**: Color rojo para acciones destructivas (Eliminar)

## **MENÚS DE OPCIONES - ESPECÍFICOS POR MÓDULO**

### Grados (Grilla)

- Orden estándar del menú por fila:
  1. Ver Detalle
  2. Lista de Estudiantes
  3. Ver Horario
  4. Registro de Asistencia
  5. Imprimir Códigos QR
  6. Registro de Notas Detalladas
  7. Apreciaciones / Recomendaciones
  8. Editar Grado
  9. Eliminar Grado
- Estado de acciones:
  - Implementadas: Ver, Editar, Eliminar
  - Pendientes (no-op): Lista de Estudiantes, Ver Horario, Registro de Asistencia, Imprimir Códigos QR, Registro de Notas Detalladas, Apreciaciones / Recomendaciones
- Archivo: `frontend/src/pages/Mantenimientos/Grados/GradosList.js`

### Áreas (Grilla)

- Orden estándar del menú por fila:
  1. Ver Detalle
  2. Cursos del Área
  3. Editar Área
  4. Eliminar Área
- Estado de acciones:
  - Implementadas: Ver, Editar, Eliminar
  - Pendiente (no-op): Cursos del Área
- Archivo: `frontend/src/pages/Mantenimientos/Areas/AreasList.js`
