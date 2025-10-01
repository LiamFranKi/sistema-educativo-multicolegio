# 🎯 PATRÓN CRUD - COMPONENTES FRONTEND

## 📋 **1. COMPONENTE LISTA (List.js)**

### **Estructura Estándar:**
```javascript
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  CircularProgress,
  Alert,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  [Icono] as [Icono]Icon,
} from '@mui/icons-material';

const [Modulo]List = () => {
  // Estados
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Handlers
  const handleSearch = (event) => setSearchTerm(event.target.value);
  const handleFilter = (event) => setFilterValue(event.target.value);
  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };
  
  return (
    <Box>
      {/* Header */}
      <Paper sx={{ mb: 3 }}>
        <Toolbar>
          <[Icono]Icon sx={{ mr: 2 }} color="primary" />
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }} color="primary">
            Gestión de [Módulo]
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/[modulo]/nuevo')}
          >
            Nuevo [Módulo]
          </Button>
        </Toolbar>
      </Paper>

      {/* Grilla */}
      <Paper>
        {/* Búsqueda y Filtros */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Buscar"
            value={searchTerm}
              onChange={handleSearch}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filtro</InputLabel>
              <Select value={filterValue} onChange={handleFilter}>
                <MenuItem value="">Todos</MenuItem>
                {/* Opciones específicas del módulo */}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={handleCreate}>
              Nuevo [Módulo]
            </Button>
          </Box>
          
          {/* Tabla */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#61a7d1' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} hover sx={{ '&:hover': { backgroundColor: '#ffe6d9' } }}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.activo ? 'Activo' : 'Inactivo'}
                        color={item.activo ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={(e) => handleMenuOpen(e, item)}
                        endIcon={<MoreVertIcon />}
                      >
                        Opciones
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Menú Contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon><ViewIcon color="info" /></ListItemIcon>
          <ListItemText primary="Ver Detalle" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon><EditIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Editar [Módulo]" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
          <ListItemText primary="Eliminar [Módulo]" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
```

---

## 📝 **2. COMPONENTE FORMULARIO (Form.js)**

### **Estructura Estándar:**
```javascript
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, FormControl, InputLabel, Select,
  MenuItem, Switch, FormControlLabel, Box, Typography
} from '@mui/material';

const [Modulo]Form = ({ open, mode, item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleSubmit = async () => {
    // Validaciones
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      if (mode === 'create') {
        await [modulo]Service.create[Modulo](formData);
      } else {
        await [modulo]Service.update[Modulo](item.id, formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error guardando:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Nuevo [Módulo]' : 
         mode === 'edit' ? 'Editar [Módulo]' : 'Ver [Módulo]'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              error={!!errors.nombre}
              helperText={errors.nombre}
              disabled={mode === 'view'}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange('descripcion')}
              disabled={mode === 'view'}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.activo}
                  onChange={handleChange('activo')}
                  disabled={mode === 'view'}
                />
              }
              label="Activo"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {mode !== 'view' && (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
          >
            {mode === 'create' ? 'Crear' : 'Actualizar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
```

---

## 👁️ **3. COMPONENTE VISTA (View.js)**

### **Estructura Estándar:**
```javascript
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, Typography, Box, Chip, Avatar
} from '@mui/material';

const [Modulo]View = ({ open, item, onClose }) => {
  if (!item) return null;
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="h2">
          Detalles del [Módulo]
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {item.nombre}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Estado
              </Typography>
              <Chip 
                label={item.activo ? 'Activo' : 'Inactivo'}
                color={item.activo ? 'success' : 'default'}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Descripción
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {item.descripcion || 'Sin descripción'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};
```

---

## 🎨 **4. ESTILOS Y COLORES ESTÁNDAR**

### **Colores de Grilla:**
```javascript
// Cabecera de tabla
backgroundColor: '#61a7d1'

// Filas alternadas
backgroundColor: '#e7f1f8' // Filas pares
backgroundColor: 'white'    // Filas impares

// Hover
'&:hover': { backgroundColor: '#ffe6d9 !important' }

// Chips de estado
<Chip 
  label="Activo" 
  color="success" 
  size="small" 
/>
<Chip 
  label="Inactivo" 
  color="default" 
  size="small" 
/>
```

### **Títulos de Módulos:**
```javascript
<Typography variant="h4" component="h1" color="primary">
  Gestión de [Módulo]
</Typography>
```

---

**Última actualización**: 2025-01-16  
**Versión**: 1.0  
**Estado**: ✅ Patrón establecido y funcional



