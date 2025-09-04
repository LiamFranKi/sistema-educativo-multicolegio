# PATRÓN DE DISEÑO VISUAL UNIFICADO

## 🎨 Estructura de Diseño Establecida

### **Objetivo:**

Unificar el diseño visual de todos los componentes reutilizables del sistema para mantener consistencia, mejorar la experiencia de usuario y facilitar el mantenimiento del código.

**NOTA IMPORTANTE:** El sistema incluye temas dinámicos basados en la configuración del colegio, sidebar personalizado con información del usuario, y barra de título mejorada con iconos de notificaciones y cerrar sesión.

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
// Información del usuario en lugar del colegio
<Box sx={{ p: 2, textAlign: "center", borderBottom: "1px solid #e0e0e0" }}>
  <Avatar
    sx={{
      width: 120, // 100% más grande que el original (60px)
      height: 120,
      mx: "auto",
      mb: 1,
      bgcolor: "primary.main",
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
      <AccountCircleIcon sx={{ fontSize: 60 }} />
    )}
  </Avatar>
  <Typography variant="h6" color="primary" fontWeight="bold">
    {user?.nombres || "Administrador"}
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Panel Administrativo
  </Typography>
</Box>
```

### **B) Barra de Título Mejorada (AdminLayout.js)**

#### **Estructura Visual:**

```javascript
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
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',           // 1 columna en móvil
      sm: 'repeat(2, 1fr)', // 2 columnas en tablet
      md: 'repeat(3, 1fr)', // 3 columnas en desktop
      lg: 'repeat(5, 1fr)'  // 5 columnas en pantalla grande
    },
    gap: { xs: 1, sm: 2, md: 2 },
    mb: 4,
  }}>
    {/* 5 tarjetas de estadísticas */}
  </Box>
</Box>
```

#### **Tarjetas de Estadísticas:**

```javascript
// Patrón de tarjeta de estadística
<Card sx={{ 
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  color: 'white',
  textAlign: 'center',
  p: 3,
  borderRadius: 2,
  boxShadow: 3,
  '&:hover': { 
    transform: 'translateY(-4px)', 
    boxShadow: 6,
    transition: 'all 0.3s ease'
  }
}}>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
    <AdminPanelSettingsIcon sx={{ fontSize: 40, mr: 1 }} />
  </Box>
  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
    {loading ? <CircularProgress size={24} color="inherit" /> : stats.administradores}
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
    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', // Azul
    icon: <AdminPanelSettingsIcon />
  },
  docentes: {
    background: 'linear-gradient(135deg, #dc004e 0%, #c2185b 100%)', // Rojo
    icon: <SchoolIcon />
  },
  alumnos: {
    background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)', // Verde
    icon: <PeopleIcon />
  },
  apoderados: {
    background: 'linear-gradient(135deg, #ed6c02 0%, #f57c00 100%)', // Naranja
    icon: <FamilyIcon />
  },
  tutores: {
    background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', // Morado
    icon: <SupportIcon />
  }
};
```

#### **Loading State del Dashboard:**

```javascript
// Spinner de carga global
{loading && (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: '200px',
    flexDirection: 'column',
    gap: 2
  }}>
    <CircularProgress size={60} />
    <Typography variant="h6" color="text.secondary">
      Cargando estadísticas...
    </Typography>
  </Box>
)}
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
