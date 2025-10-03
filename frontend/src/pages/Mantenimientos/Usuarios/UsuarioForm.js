import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Grid,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';
// DatePicker removido temporalmente por problemas de compatibilidad
import { toast } from 'react-hot-toast';
import { fileService } from '../../../services/apiService';
import { getImageUrl } from '../../../utils/imageUtils';

const UsuarioForm = ({ open, onClose, onSave, mode, usuario }) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    telefono: '',
    fecha_nacimiento: null,
    direccion: '',
    genero: '',
    estado_civil: '',
    profesion: '',
    foto: '',
    activo: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState('');


  // Opciones para género
  const generos = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' }
  ];

  // Opciones para estado civil
  const estadosCiviles = [
    { value: 'Soltero', label: 'Soltero' },
    { value: 'Casado', label: 'Casado' },
    { value: 'Divorciado', label: 'Divorciado' },
    { value: 'Viudo', label: 'Viudo' },
    { value: 'Conviviente', label: 'Conviviente' }
  ];

  // Cargar datos del usuario cuando se abre en modo edición
  useEffect(() => {
    if (open && mode === 'edit' && usuario) {
      setFormData({
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        dni: usuario.dni || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        fecha_nacimiento: usuario.fecha_nacimiento ? new Date(usuario.fecha_nacimiento) : null,
        direccion: usuario.direccion || '',
        genero: usuario.genero || '',
        estado_civil: usuario.estado_civil || '',
        profesion: usuario.profesion || '',
        foto: usuario.foto || '',
        activo: usuario.activo !== undefined ? usuario.activo : true
      });
      // Construir URL de imagen existente usando getImageUrl
      const existingImageUrl = getImageUrl(usuario.foto);
      setPreviewImage(existingImageUrl);
    } else if (open && mode === 'create') {
      // Resetear formulario para modo crear
      setFormData({
        nombres: '',
        apellidos: '',
        dni: '',
        email: '',
        telefono: '',
        fecha_nacimiento: null,
        direccion: '',
        genero: '',
        estado_civil: '',
        profesion: '',
        foto: '',
        activo: true
      });
      setPreviewImage('');
      setCloudinaryPublicId('');
    }
    setErrors({});
  }, [open, mode, usuario]);

  // Función para manejar cambios en los campos
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
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

  // Función para manejar cambio de fecha
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      fecha_nacimiento: date
    }));

    if (errors.fecha_nacimiento) {
      setErrors(prev => ({
        ...prev,
        fecha_nacimiento: ''
      }));
    }
  };

  // Función para manejar subida de archivo local
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño del archivo (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no puede ser mayor a 5MB');
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }

    try {
      const response = await fileService.uploadFile(file, 'avatar');

      if (response.success) {
        setFormData(prev => ({
          ...prev,
          foto: response.path
        }));
        setPreviewImage(response.url);
        toast.success('Foto subida correctamente');
      } else {
        toast.error('Error al subir la foto');
      }
    } catch (error) {
      console.error('Error subiendo foto:', error);
      toast.error('Error al subir la foto');
    }
  };

  // Función para eliminar foto
  const handleDeletePhoto = () => {
    setFormData(prev => ({
      ...prev,
      foto: ''
    }));
    setPreviewImage('');
    toast.success('Foto eliminada correctamente');
  };

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
    } else if (formData.nombres.trim().length < 2) {
      newErrors.nombres = 'Los nombres deben tener al menos 2 caracteres';
    }

    // Validar DNI
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!/^\d{8}$/.test(formData.dni.trim())) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    // Validar teléfono (opcional pero si se llena debe ser válido)
    if (formData.telefono && !/^\d{9}$/.test(formData.telefono.trim())) {
      newErrors.telefono = 'El teléfono debe tener 9 dígitos';
    }

    // Validar fecha de nacimiento
    if (formData.fecha_nacimiento) {
      const today = new Date();
      const birthDate = new Date(formData.fecha_nacimiento);
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 5 || age > 100) {
        newErrors.fecha_nacimiento = 'La edad debe estar entre 5 y 100 años';
      }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    try {
      // Preparar datos para enviar
      const dataToSend = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim() || null,
        dni: formData.dni.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim() || null,
        fecha_nacimiento: formData.fecha_nacimiento ? formData.fecha_nacimiento.toISOString().split('T')[0] : null,
        direccion: formData.direccion.trim() || null,
        genero: formData.genero || null,
        estado_civil: formData.estado_civil || null,
        profesion: formData.profesion.trim() || null,
        foto: formData.foto,
        activo: formData.activo
      };

      // Solo para usuarios nuevos: asignar contraseña (DNI) y rol (Docente)
      if (mode === 'create') {
        dataToSend.clave = formData.dni.trim(); // Contraseña inicial = DNI
        dataToSend.rol = 'Docente'; // Rol inicial = Docente
      }

      await onSave(dataToSend);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar el modal
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        {/* Header del modal */}
        <DialogTitle sx={{
          p: 3,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              mr: 2,
              p: 1,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {mode === 'create' ? <AddIcon /> : <EditIcon />}
            </Box>
            <Typography variant="h6" color="primary">
              {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
            </Typography>
          </Box>
        </DialogTitle>

        {/* Contenido del formulario */}
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* Sección de foto */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Foto del usuario
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {previewImage && (
                  <Box sx={{ textAlign: 'center' }}>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: 150,
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #ddd'
                      }}
                    />
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={loading}
                    startIcon={<AddIcon />}
                  >
                    Subir Foto
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </Button>
                  {previewImage && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeletePhoto}
                      disabled={loading}
                    >
                      Eliminar
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Grid de campos */}
            <Grid container spacing={3}>

              {/* Nombres */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombres"
                  value={formData.nombres}
                  onChange={handleChange('nombres')}
                  error={!!errors.nombres}
                  helperText={errors.nombres}
                  required
                />
              </Grid>

              {/* Apellidos */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Apellidos"
                  value={formData.apellidos}
                  onChange={handleChange('apellidos')}
                  error={!!errors.apellidos}
                  helperText={errors.apellidos}
                />
              </Grid>

              {/* DNI */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DNI"
                  value={formData.dni}
                  onChange={handleChange('dni')}
                  error={!!errors.dni}
                  helperText={errors.dni}
                  required
                  inputProps={{ maxLength: 8 }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>

              {/* Teléfono */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange('telefono')}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  inputProps={{ maxLength: 9 }}
                />
              </Grid>

              {/* Fecha de nacimiento */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha de nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento ? formData.fecha_nacimiento.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    handleDateChange(date);
                  }}
                  error={!!errors.fecha_nacimiento}
                  helperText={errors.fecha_nacimiento}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Dirección */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={formData.direccion}
                  onChange={handleChange('direccion')}
                  error={!!errors.direccion}
                  helperText={errors.direccion}
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Género */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.genero}>
                  <InputLabel>Género</InputLabel>
                  <Select
                    value={formData.genero}
                    onChange={handleChange('genero')}
                    label="Género"
                  >
                    <MenuItem value="">
                      <em>Seleccionar género</em>
                    </MenuItem>
                    {generos.map((genero) => (
                      <MenuItem key={genero.value} value={genero.value}>
                        {genero.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.genero && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.genero}
                  </Typography>
                )}
              </Grid>

              {/* Estado Civil */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.estado_civil}>
                  <InputLabel>Estado Civil</InputLabel>
                  <Select
                    value={formData.estado_civil}
                    onChange={handleChange('estado_civil')}
                    label="Estado Civil"
                  >
                    <MenuItem value="">
                      <em>Seleccionar estado civil</em>
                    </MenuItem>
                    {estadosCiviles.map((estado) => (
                      <MenuItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.estado_civil && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.estado_civil}
                  </Typography>
                )}
              </Grid>

              {/* Profesión */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Profesión"
                  value={formData.profesion}
                  onChange={handleChange('profesion')}
                  error={!!errors.profesion}
                  helperText={errors.profesion}
                />
              </Grid>





              {/* Estado activo */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.activo}
                      onChange={handleChange('activo')}
                      color="primary"
                    />
                  }
                  label="Usuario activo"
                />
              </Grid>

            </Grid>


          </Box>
        </DialogContent>

        {/* Footer con botones */}
        <DialogActions sx={{
          p: 3,
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa',
          gap: 1
        }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2 }}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default UsuarioForm;
