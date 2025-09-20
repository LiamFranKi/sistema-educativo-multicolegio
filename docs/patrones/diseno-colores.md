# 🎨 PATRÓN DISEÑO VISUAL - COLORES Y TEMAS

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
    error: {
      main: "#f44336", // Rojo error
    },
    warning: {
      main: "#ff9800", // Naranja advertencia
    },
    success: {
      main: "#4caf50", // Verde éxito
    },
    info: {
      main: "#2196f3", // Azul información
    },
  },
});
```

---

## 🏫 **2. COLORES DINÁMICOS DEL COLEGIO**

### **Sistema de Temas Personalizables:**
```javascript
// Colores del colegio desde configuración
const colegioColors = {
  primary: "#0165a1",     // Color principal del colegio
  secondary: "#ffffff",   // Color secundario
  accent: "#ffc107",      // Color de acento
  background: "#f8f9fa",  // Fondo personalizado
  text: "#212529",        // Texto principal
};

// Tema dinámico basado en colores del colegio
const dynamicTheme = createTheme({
  palette: {
    primary: {
      main: colegioColors.primary,
      light: lightenColor(colegioColors.primary, 0.3),
      dark: darkenColor(colegioColors.primary, 0.3),
    },
    secondary: {
      main: colegioColors.secondary,
    },
    background: {
      default: colegioColors.background,
      paper: "#ffffff",
    },
    text: {
      primary: colegioColors.text,
      secondary: "#6c757d",
    },
  },
});
```

---

## 🎨 **3. COLORES ESTÁNDAR DE COMPONENTES**

### **Grillas y Tablas:**
```javascript
// Colores estándar para todas las grillas
const gridColors = {
  header: {
    backgroundColor: '#61a7d1',
    color: 'white',
    fontWeight: 'bold'
  },
  row: {
    even: 'white',
    odd: '#e7f1f8',
    hover: '#ffe6d9'
  },
  border: '#e0e0e0'
};

// Aplicación en componentes
<TableHead sx={{ backgroundColor: gridColors.header.backgroundColor }}>
  <TableCell sx={{ 
    color: gridColors.header.color, 
    fontWeight: gridColors.header.fontWeight 
  }}>
    Columna
  </TableCell>
</TableHead>

<TableRow 
  hover 
  sx={{ 
    '&:hover': { 
      backgroundColor: `${gridColors.row.hover} !important` 
    } 
  }}
>
```

### **Chips de Estado:**
```javascript
// Colores para chips de estado
const statusColors = {
  activo: 'success',
  inactivo: 'default',
  pendiente: 'warning',
  error: 'error',
  info: 'info'
};

// Uso estándar
<Chip 
  label={item.activo ? 'Activo' : 'Inactivo'}
  color={statusColors[item.activo ? 'activo' : 'inactivo']}
  size="small"
/>
```

### **Botones y Acciones:**
```javascript
// Colores para botones
const buttonColors = {
  primary: '#1976d2',
  secondary: '#424242',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800'
};

// Botón primario
<Button 
  variant="contained" 
  sx={{ 
    backgroundColor: buttonColors.primary,
    '&:hover': { backgroundColor: darkenColor(buttonColors.primary, 0.1) }
  }}
>
  Acción Principal
</Button>
```

---

## 🎭 **4. EFECTOS VISUALES**

### **Sombras y Elevación:**
```javascript
// Sombras estándar
const shadows = {
  card: '0px 2px 8px rgba(0,0,0,0.1)',
  button: '0px 4px 12px rgba(0,0,0,0.15)',
  modal: '0px 8px 32px rgba(0,0,0,0.2)',
  hover: '0px 4px 16px rgba(0,0,0,0.2)'
};

// Aplicación
<Card sx={{ 
  boxShadow: shadows.card,
  '&:hover': { boxShadow: shadows.hover }
}}>
```

### **Transiciones y Animaciones:**
```javascript
// Transiciones estándar
const transitions = {
  fast: '0.2s ease-in-out',
  normal: '0.3s ease-in-out',
  slow: '0.5s ease-in-out'
};

// Aplicación
<Button sx={{
  transition: `all ${transitions.normal}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: shadows.hover
  }
}}>
```

---

## 🌈 **5. COLORES POR MÓDULO**

### **Módulos del Sistema:**
```javascript
const moduleColors = {
  usuarios: {
    primary: '#1976d2',
    icon: 'Person',
    gradient: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
  },
  avatars: {
    primary: '#9c27b0',
    icon: 'Face',
    gradient: 'linear-gradient(135deg, #9c27b0 0%, #e1bee7 100%)'
  },
  grados: {
    primary: '#ff9800',
    icon: 'School',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #ffcc02 100%)'
  },
  areas: {
    primary: '#4caf50',
    icon: 'Category',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
  },
  configuracion: {
    primary: '#607d8b',
    icon: 'Settings',
    gradient: 'linear-gradient(135deg, #607d8b 0%, #90a4ae 100%)'
  }
};

// Uso en headers de módulos
<CardHeader
  avatar={
    <Avatar sx={{ 
      background: moduleColors.avatars.gradient,
      color: 'white'
    }}>
      <FaceIcon />
    </Avatar>
  }
  title={
    <Typography variant="h4" component="h1" color="primary">
      Gestión de Avatars
    </Typography>
  }
/>
```

---

## 📱 **6. RESPONSIVE Y ACCESIBILIDAD**

### **Colores Accesibles:**
```javascript
// Verificar contraste para accesibilidad
const accessibleColors = {
  // Texto sobre fondo claro
  textOnLight: '#212121',
  textOnLightSecondary: '#757575',
  
  // Texto sobre fondo oscuro
  textOnDark: '#ffffff',
  textOnDarkSecondary: '#e0e0e0',
  
  // Colores de estado accesibles
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#0288d1'
};
```

### **Modo Oscuro (Futuro):**
```javascript
// Preparación para modo oscuro
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
});
```

---

## 🎨 **7. UTILIDADES DE COLOR**

### **Funciones Helper:**
```javascript
// Aclarar color
const lightenColor = (color, amount) => {
  // Implementación para aclarar color
};

// Oscurecer color
const darkenColor = (color, amount) => {
  // Implementación para oscurecer color
};

// Obtener color de contraste
const getContrastColor = (backgroundColor) => {
  // Retorna blanco o negro según el fondo
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
};

// Verificar si un color es claro
const isLightColor = (color) => {
  // Implementación para verificar luminosidad
};
```

---

**Última actualización**: 2025-01-16  
**Versión**: 1.0  
**Estado**: ✅ Patrón establecido y funcional
