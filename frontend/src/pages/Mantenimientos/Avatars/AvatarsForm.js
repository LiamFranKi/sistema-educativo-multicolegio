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
  Switch,
  FormControlLabel,
  Avatar,
  Grid,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Face as FaceIcon,
  Star as StarIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { avatarsService, fileService } from '../../../services/apiService';
import { getImageUrl } from '../../../utils/imageUtils';

const AvatarsForm = ({ open, mode, avatar, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nivel: '',
    puntos: '',
    genero: '',
    activo: true,
    imagen: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    console.log('AvatarsForm useEffect:', { open, mode, avatar });
    if (open) {
      if ((mode === 'edit' || mode === 'view') && avatar) {
        console.log('Cargando datos del avatar:', avatar);
        setFormData({
          nombre: avatar.nombre || '',
          descripcion: avatar.descripcion || '',
          nivel: avatar.nivel || '',
          puntos: avatar.puntos || '',
          genero: avatar.genero || '',
          activo: avatar.activo !== undefined ? avatar.activo : true,
          imagen: avatar.imagen || ''
        });
        setPreviewImage(avatar.imagen ? getImageUrl(avatar.imagen, 'avatars') : null);
      } else {
        console.log('Reseteando formulario para modo:', mode);
        setFormData({
          nombre: '',
          descripcion: '',
          nivel: '',
          puntos: '',
          genero: '',
          activo: true,
          imagen: ''
        });
        setPreviewImage(null);
      }
      setErrors({});
    }
  }, [open, mode, avatar]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.nivel) {
      newErrors.nivel = 'El nivel es requerido';
    } else if (formData.nivel < 1 || formData.nivel > 20) {
      newErrors.nivel = 'El nivel debe estar entre 1 y 20';
    }

    if (!formData.genero) {
      newErrors.genero = 'El género es requerido';
    }

    if (formData.puntos === '' || formData.puntos === null) {
      newErrors.puntos = 'Los puntos son requeridos';
    } else if (formData.puntos < 0) {
      newErrors.puntos = 'Los puntos no pueden ser negativos';
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio en campos
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar cambio de imagen
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Error', 'Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WEBP)', 'error');
        return;
      }

      // Validar tamaño (2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('Error', 'El archivo no puede exceder 2MB', 'error');
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
        const response = await fileService.uploadFile(file, 'avatar');

        if (response.success) {
          setFormData(prev => ({
            ...prev,
            imagen: response.filename // Guardar el nombre del archivo subido
          }));
          Swal.fire('Éxito', 'Imagen subida correctamente', 'success');
        } else {
          Swal.fire('Error', 'Error al subir la imagen', 'error');
          setPreviewImage(''); // Limpiar preview si falla
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        Swal.fire('Error', 'Error al subir la imagen', 'error');
        setPreviewImage(''); // Limpiar preview si falla
      } finally {
        setLoading(false);
      }
    }
  };

  // Eliminar imagen
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imagen: '' }));
    setPreviewImage(null);
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      Swal.fire('Validación', 'Por favor corrige los errores en el formulario', 'warning');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para envío
      const formDataToSend = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        nivel: formData.nivel,
        puntos: formData.puntos,
        genero: formData.genero,
        activo: formData.activo,
        imagen: formData.imagen || 'default-avatar.png'
      };

      let response;
      if (mode === 'create') {
        response = await avatarsService.createAvatar(formDataToSend);
      } else {
        response = await avatarsService.updateAvatar(avatar.id, formDataToSend);
      }

      if (response.success) {
        Swal.fire({
          title: '¡Éxito!',
          text: mode === 'create'
            ? 'Avatar creado exitosamente'
            : 'Avatar actualizado exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        Swal.fire('Error', response.message || 'Error al guardar el avatar', 'error');
      }
    } catch (error) {
      console.error('Error guardando avatar:', error);
      Swal.fire('Error', 'Error al guardar el avatar', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generar opciones de nivel
  const nivelOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <FaceIcon color="primary" />
        <Typography variant="h6" component="span">
          {mode === 'create' ? 'Nuevo Avatar' : 'Editar Avatar'}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ ml: 'auto' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Imagen del avatar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                Imagen del Avatar
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={previewImage}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    border: '2px solid #e0e0e0',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  <FaceIcon sx={{ fontSize: 60, color: '#bdbdbd' }} />
                </Avatar>
                {previewImage && (
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'error.dark'
                      }
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ mt: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="avatar-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    size="small"
                  >
                    {previewImage ? 'Cambiar' : 'Subir'}
                  </Button>
                </label>
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Formatos: JPEG, PNG, GIF, WEBP (máx. 2MB)
              </Typography>
            </Box>
          </Grid>

          {/* Formulario */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Nombre */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Nombre del Avatar"
                  value={formData.nombre}
                  onChange={handleChange('nombre')}
                  error={!!errors.nombre}
                  helperText={errors.nombre || 'Nombre único del avatar'}
                  disabled={mode === 'view'}
                  required
                />
              </Grid>

              {/* Descripción */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={handleChange('descripcion')}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion || 'Descripción opcional del avatar'}
                  disabled={mode === 'view'}
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Nivel y Género */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.nivel} required>
                  <InputLabel>Nivel</InputLabel>
                  <Select
                    value={formData.nivel}
                    onChange={handleChange('nivel')}
                    label="Nivel"
                    disabled={mode === 'view'}
                  >
                    {nivelOptions.map((nivel) => (
                      <MenuItem key={nivel} value={nivel}>
                        Nivel {nivel}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.nivel && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.nivel}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.genero} required>
                  <InputLabel>Género</InputLabel>
                  <Select
                    value={formData.genero}
                    onChange={handleChange('genero')}
                    label="Género"
                    disabled={mode === 'view'}
                  >
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Femenino">Femenino</MenuItem>
                  </Select>
                  {errors.genero && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.genero}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* Puntos */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Puntos Requeridos"
                  type="number"
                  value={formData.puntos}
                  onChange={handleChange('puntos')}
                  error={!!errors.puntos}
                  helperText={errors.puntos || 'Puntos necesarios para obtener este avatar'}
                  disabled={mode === 'view'}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <StarIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Estado */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.activo}
                      onChange={handleChange('activo')}
                      disabled={mode === 'view'}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        Avatar Activo
                      </Typography>
                      <Chip
                        label={formData.activo ? 'Activo' : 'Inactivo'}
                        color={formData.activo ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        {mode !== 'view' && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Guardando...' : mode === 'create' ? 'Crear Avatar' : 'Actualizar Avatar'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AvatarsForm;
