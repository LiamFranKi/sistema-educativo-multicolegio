import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { areasService } from '../../../services/apiService';

const AreasForm = ({ open, mode, area, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    estado: 'activo',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (open) {
      if ((mode === 'edit' || mode === 'view') && area) {
        setFormData({
          nombre: area.nombre || '',
          descripcion: area.descripcion || '',
          codigo: area.codigo || '',
          estado: area.estado || 'activo',
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          codigo: '',
          estado: 'activo',
        });
      }
      setErrors({});
    }
  }, [open, mode, area]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido';
    } else if (formData.codigo.length > 10) {
      newErrors.codigo = 'El código no puede exceder 10 caracteres';
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio en campos
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      Swal.fire('Validación', 'Por favor corrige los errores en el formulario', 'warning');
      return;
    }

    try {
      setLoading(true);

      let response;
      if (mode === 'edit') {
        response = await areasService.updateArea(area.id, formData);
      } else {
        response = await areasService.createArea(formData);
      }

      if (response.success) {
        Swal.fire(
          mode === 'edit' ? 'Actualizada' : 'Creada',
          mode === 'edit' ? 'El área ha sido actualizada' : 'El área ha sido creada',
          'success'
        );
        onSuccess();
      } else {
        const msg = response.message || 'Error al guardar el área';
        Swal.fire('Error', msg, 'error');
      }
    } catch (error) {
      console.error('Error guardando área:', error);
      const msg = error.response?.data?.message || 'Error al guardar el área';
      Swal.fire('Error', msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Obtener título del diálogo
  const getDialogTitle = () => {
    switch (mode) {
      case 'create':
        return 'Nueva Área Educativa';
      case 'edit':
        return 'Editar Área Educativa';
      case 'view':
        return 'Ver Área Educativa';
      default:
        return 'Área Educativa';
    }
  };

  // Obtener texto del botón
  const getButtonText = () => {
    if (loading) return 'Guardando...';
    switch (mode) {
      case 'create':
        return 'Crear Área';
      case 'edit':
        return 'Actualizar Área';
      default:
        return 'Guardar';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon color="primary" />
          <Typography variant="h6">
            {getDialogTitle()}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Nombre */}
          <TextField
            fullWidth
            label="Nombre del Área"
            value={formData.nombre}
            onChange={handleChange('nombre')}
            error={!!errors.nombre}
            helperText={errors.nombre || 'Nombre de la área educativa (máximo 100 caracteres)'}
            disabled={isReadOnly}
            required
          />

          {/* Código */}
          <TextField
            fullWidth
            label="Código"
            value={formData.codigo}
            onChange={handleChange('codigo')}
            error={!!errors.codigo}
            helperText={errors.codigo || 'Código único para identificar el área (máximo 10 caracteres)'}
            disabled={isReadOnly}
            required
            placeholder="Ej: MAT, COM, ART"
          />

          {/* Descripción */}
          <TextField
            fullWidth
            label="Descripción"
            value={formData.descripcion}
            onChange={handleChange('descripcion')}
            error={!!errors.descripcion}
            helperText={errors.descripcion || 'Descripción opcional del área (máximo 500 caracteres)'}
            disabled={isReadOnly}
            multiline
            rows={3}
            placeholder="Describe brevemente el propósito y contenido del área..."
          />

          {/* Estado */}
          <FormControl fullWidth disabled={isReadOnly}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={formData.estado}
              onChange={handleChange('estado')}
              label="Estado"
            >
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
            </Select>
          </FormControl>

          {/* Información adicional para modo vista */}
          {isReadOnly && area && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Información adicional:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>ID:</strong> {area.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Creado:</strong> {new Date(area.created_at).toLocaleDateString('es-ES')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Actualizado:</strong> {new Date(area.updated_at).toLocaleDateString('es-ES')}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {isReadOnly ? 'Cerrar' : 'Cancelar'}
        </Button>
        {!isReadOnly && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {getButtonText()}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AreasForm;
