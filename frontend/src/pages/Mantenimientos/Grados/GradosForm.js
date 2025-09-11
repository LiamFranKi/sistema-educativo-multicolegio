import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  IconButton
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { gradosService } from '../../../services/apiService';
import Swal from 'sweetalert2';

const GradosForm = ({ grado, niveles, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    nivel_id: '',
    orden: 1,
    activo: true,
    foto: 'default-grado.png'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(grado);

  useEffect(() => {
    if (grado) {
      setFormData({
        nombre: grado.nombre || '',
        descripcion: grado.descripcion || '',
        codigo: grado.codigo || '',
        nivel_id: grado.nivel_id || '',
        orden: grado.orden || 1,
        activo: grado.activo !== undefined ? grado.activo : true,
        foto: grado.foto || 'default-grado.png'
      });
    }
  }, [grado]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido';
    } else if (!/^[A-Z]{3}-\d{2}$/.test(formData.codigo)) {
      newErrors.codigo = 'El código debe tener el formato XXX-XX (ej: PRI-01)';
    }

    if (!formData.nivel_id) {
      newErrors.nivel_id = 'El nivel es requerido';
    }

    if (!formData.orden || formData.orden < 1) {
      newErrors.orden = 'El orden debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCodigo = (nivelId, orden) => {
    const nivel = niveles.find(n => n.id === parseInt(nivelId));
    if (!nivel) return '';
    
    const prefijos = {
      'Inicial': 'INI',
      'Primaria': 'PRI',
      'Secundaria': 'SEC'
    };
    
    const prefijo = prefijos[nivel.nombre] || 'GEN';
    const numero = orden.toString().padStart(2, '0');
    return `${prefijo}-${numero}`;
  };

  const handleNivelChange = (event) => {
    const nivelId = event.target.value;
    setFormData(prev => ({
      ...prev,
      nivel_id: nivelId,
      codigo: generateCodigo(nivelId, prev.orden)
    }));
  };

  const handleOrdenChange = (event) => {
    const orden = parseInt(event.target.value) || 1;
    setFormData(prev => ({
      ...prev,
      orden: orden,
      codigo: generateCodigo(prev.nivel_id, orden)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      if (isEdit) {
        await gradosService.updateGrado(grado.id, formData);
        Swal.fire('Actualizado', 'El grado ha sido actualizado exitosamente', 'success');
      } else {
        await gradosService.createGrado(formData);
        Swal.fire('Creado', 'El grado ha sido creado exitosamente', 'success');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error guardando grado:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar el grado';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>
        <Typography variant="h5" component="div">
          {isEdit ? 'Editar Grado' : 'Nuevo Grado'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEdit ? 'Modifica la información del grado' : 'Completa la información del nuevo grado'}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Grado"
                value={formData.nombre}
                onChange={handleInputChange('nombre')}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre || 'Ej: 1° Grado, 03 años, 1° Año'}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Código"
                value={formData.codigo}
                onChange={handleInputChange('codigo')}
                error={Boolean(errors.codigo)}
                helperText={errors.codigo || 'Se genera automáticamente'}
                required
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={Boolean(errors.nivel_id)}>
                <InputLabel>Nivel Educativo</InputLabel>
                <Select
                  value={formData.nivel_id}
                  onChange={handleNivelChange}
                  label="Nivel Educativo"
                >
                  {niveles.map((nivel) => (
                    <MenuItem key={nivel.id} value={nivel.id}>
                      {nivel.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.nivel_id && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.nivel_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Orden"
                type="number"
                value={formData.orden}
                onChange={handleOrdenChange}
                error={Boolean(errors.orden)}
                helperText={errors.orden || 'Orden dentro del nivel'}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                value={formData.descripcion}
                onChange={handleInputChange('descripcion')}
                multiline
                rows={3}
                helperText="Descripción opcional del grado"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  src={formData.foto ? `/uploads/${formData.foto}` : '/default-grado.png'}
                  sx={{ width: 80, height: 80 }}
                />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Foto del Grado
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Imagen representativa del grado educativo
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="foto-upload"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData(prev => ({ ...prev, foto: file.name }));
                      }
                    }}
                  />
                  <label htmlFor="foto-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCameraIcon />}
                      size="small"
                    >
                      Cambiar Foto
                    </Button>
                  </label>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.activo}
                    onChange={handleInputChange('activo')}
                    color="primary"
                  />
                }
                label="Grado activo"
              />
            </Grid>
          </Grid>

          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Por favor corrige los errores antes de continuar
            </Alert>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          startIcon={<CancelIcon />}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={loading}
        >
          {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </>
  );
};

export default GradosForm;
