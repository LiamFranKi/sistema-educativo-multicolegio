import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { cursosService, fileService } from '../../../services/apiService';
import Swal from 'sweetalert2';

const CursosForm = ({ open, onClose, onSaveSuccess, curso = null, niveles = [] }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    abreviatura: '',
    nivel_id: '',
    activo: true,
    imagen: null
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar datos del curso si está en modo edición
  useEffect(() => {
    if (curso) {
      setFormData({
        nombre: curso.nombre || '',
        descripcion: curso.descripcion || '',
        abreviatura: curso.abreviatura || '',
        nivel_id: curso.nivel_id || '',
        activo: curso.activo !== undefined ? curso.activo : true,
        imagen: curso.imagen || null
      });
    } else {
      // Resetear formulario para nuevo curso
      setFormData({
        nombre: '',
        descripcion: '',
        abreviatura: '',
        nivel_id: '',
        activo: true,
        imagen: null
      });
    }
    setErrors({});
  }, [curso, open]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Error', 'Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WEBP)', 'error');
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error', 'El archivo no debe superar los 5MB', 'error');
        return;
      }

      // Subir archivo al servidor
      try {
        setLoading(true);
        const response = await fileService.uploadFile(file, 'cursos');

        if (response.success) {
          setFormData(prev => ({
            ...prev,
            imagen: response.filename // Guardar el nombre del archivo subido
          }));
          Swal.fire('Éxito', 'Imagen subida correctamente', 'success');
        } else {
          Swal.fire('Error', 'Error al subir la imagen', 'error');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        Swal.fire('Error', 'Error al subir la imagen', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.abreviatura.trim()) {
      newErrors.abreviatura = 'La abreviatura es obligatoria';
    } else if (formData.abreviatura.length > 20) {
      newErrors.abreviatura = 'La abreviatura no puede superar 20 caracteres';
    }

    if (!formData.nivel_id) {
      newErrors.nivel_id = 'El nivel es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let response;

      if (curso) {
        // Actualizar curso existente
        response = await cursosService.updateCurso(curso.id, formData);
      } else {
        // Crear nuevo curso
        response = await cursosService.createCurso(formData);
      }

      if (response.success) {
        onSaveSuccess();
        await Swal.fire(
          'Éxito',
          curso ? 'Curso actualizado exitosamente' : 'Curso creado exitosamente',
          'success'
        );
      } else {
        await Swal.fire('Error', response.message || 'Error al guardar el curso', 'error');
      }
    } catch (error) {
      console.error('Error guardando curso:', error);

      // Manejar errores específicos del backend
      if (error.response?.data?.message) {
        await Swal.fire('Error', error.response.data.message, 'error');
      } else {
        await Swal.fire('Error', 'Error al guardar el curso', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para construir URL de imagen
  const getImageUrl = (imagen) => {
    if (!imagen) return null;
    return `http://localhost:5000/uploads/${imagen}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h6">
            {curso ? 'Editar Curso' : 'Nuevo Curso'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Columna izquierda - Datos básicos */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del Curso"
                  value={formData.nombre}
                  onChange={handleInputChange('nombre')}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  sx={{ mt: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Abreviatura"
                  value={formData.abreviatura}
                  onChange={handleInputChange('abreviatura')}
                  error={!!errors.abreviatura}
                  helperText={errors.abreviatura || 'Ej: MAT, COM, ART'}
                  inputProps={{ maxLength: 20 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.nivel_id}>
                  <InputLabel>Nivel Educativo</InputLabel>
                  <Select
                    value={formData.nivel_id}
                    onChange={handleInputChange('nivel_id')}
                    label="Nivel Educativo"
                  >
                    {niveles.map((nivel) => (
                      <MenuItem key={nivel.id} value={nivel.id}>
                        {nivel.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.nivel_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                      {errors.nivel_id}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={handleInputChange('descripcion')}
                  multiline
                  rows={4}
                  helperText="Descripción detallada del curso (opcional)"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.activo}
                    onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.value }))}
                    label="Estado"
                  >
                    <MenuItem value={true}>Activo</MenuItem>
                    <MenuItem value={false}>Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Columna derecha - Imagen */}
          <Grid item xs={12} md={4}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              border: '2px dashed #ccc',
              borderRadius: 2,
              backgroundColor: '#fafafa'
            }}>
              <Typography variant="h6" gutterBottom>
                Imagen del Curso
              </Typography>

              <Avatar
                src={getImageUrl(formData.imagen)}
                alt="Imagen del curso"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  border: '3px solid #e0e0e0'
                }}
              />

              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="curso-image-upload"
                type="file"
                onChange={handleImageChange}
                disabled={loading}
              />

              <label htmlFor="curso-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  disabled={loading}
                  sx={{ mb: 1 }}
                >
                  {loading ? 'Subiendo...' : 'Subir Imagen'}
                </Button>
              </label>

              <Typography variant="caption" color="text.secondary" textAlign="center">
                Formatos: JPG, PNG, GIF, WEBP<br />
                Tamaño máximo: 5MB
              </Typography>

              {formData.imagen && (
                <Button
                  size="small"
                  color="error"
                  onClick={() => setFormData(prev => ({ ...prev, imagen: null }))}
                  sx={{ mt: 1 }}
                >
                  Eliminar Imagen
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Guardando...' : (curso ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CursosForm;
