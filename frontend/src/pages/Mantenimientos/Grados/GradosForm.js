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
import { Save as SaveIcon, Cancel as CancelIcon, PhotoCamera as PhotoCameraIcon, AutoFixHigh as AutoFixHighIcon } from '@mui/icons-material';
import { gradosService, fileService } from '../../../services/apiService';
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
  const [previewImage, setPreviewImage] = useState('');

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
      // Construir URL de imagen existente
      const existingImageUrl = grado.foto && grado.foto !== 'default-grado.png' ?
        (grado.foto.startsWith('http') ? grado.foto :
         `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${grado.foto}`) : '';
      setPreviewImage(existingImageUrl);
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

  // Función para manejar subida de imagen
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor selecciona un archivo de imagen válido'
        });
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La imagen debe ser menor a 2MB'
        });
        return;
      }

      // Crear preview inmediato
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Subir archivo al servidor
      try {
        setLoading(true);
        const response = await fileService.uploadFile(file, 'grados');

        if (response.success) {
          setFormData(prev => ({
            ...prev,
            foto: response.filename // Guardar el nombre del archivo subido
          }));
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Foto subida correctamente'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al subir la foto'
          });
          setPreviewImage(''); // Limpiar preview si falla
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al subir la foto'
        });
        setPreviewImage(''); // Limpiar preview si falla
      } finally {
        setLoading(false);
      }
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
      // Solo generar código automáticamente si el campo está vacío o es el valor por defecto
      codigo: (!prev.codigo || prev.codigo === 'default-grado.png') ? generateCodigo(nivelId, prev.orden) : prev.codigo
    }));
  };

  const handleOrdenChange = (event) => {
    const orden = parseInt(event.target.value) || 1;
    setFormData(prev => ({
      ...prev,
      orden: orden,
      // Solo generar código automáticamente si el campo está vacío o es el valor por defecto
      codigo: (!prev.codigo || prev.codigo === 'default-grado.png') ? generateCodigo(prev.nivel_id, orden) : prev.codigo
    }));
  };

  const handleGenerateCode = () => {
    setFormData(prev => ({
      ...prev,
      codigo: generateCodigo(prev.nivel_id, prev.orden)
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
                id="nombre-grado"
                name="nombre"
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
                id="codigo-grado"
                name="codigo"
                label="Código"
                value={formData.codigo}
                onChange={handleInputChange('codigo')}
                error={Boolean(errors.codigo)}
                helperText={errors.codigo || 'Ingresa un código único para el grado'}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={handleGenerateCode}
                      edge="end"
                      title="Generar código automáticamente"
                      disabled={!formData.nivel_id}
                      aria-label="Generar código automáticamente"
                    >
                      <AutoFixHighIcon />
                    </IconButton>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={Boolean(errors.nivel_id)}>
                <InputLabel id="nivel-educativo-label">Nivel Educativo</InputLabel>
                <Select
                  id="nivel-educativo"
                  name="nivel_id"
                  labelId="nivel-educativo-label"
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
                id="orden-grado"
                name="orden"
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
                id="descripcion-grado"
                name="descripcion"
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
                  src={previewImage || (formData.foto && formData.foto !== 'default-grado.png' ?
                    (formData.foto.startsWith('http') ? formData.foto :
                     `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${formData.foto}`) :
                    null)}
                  sx={{ width: 80, height: 80, fontSize: '2rem' }}
                >
                  {!previewImage && (!formData.foto || formData.foto === 'default-grado.png') && (formData.nombre ? formData.nombre.charAt(0).toUpperCase() : 'G')}
                </Avatar>
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
                    name="foto"
                    type="file"
                    onChange={handleImageUpload}
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
                    id="activo-grado"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange('activo')}
                    color="primary"
                  />
                }
                label="Grado activo"
                htmlFor="activo-grado"
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
