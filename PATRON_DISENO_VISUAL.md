# PATRÓN DE DISEÑO VISUAL UNIFICADO

## 🎨 Estructura de Diseño Establecida

### **Objetivo:**

Unificar el diseño visual de todos los componentes reutilizables del sistema para mantener consistencia, mejorar la experiencia de usuario y facilitar el mantenimiento del código.

---

## 🎯 **1. TEMA MATERIAL-UI BASE**

### **Paleta de Colores:**

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
