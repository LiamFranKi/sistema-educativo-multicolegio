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
  Avatar,
  IconButton,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
// DatePicker removido temporalmente por problemas de compatibilidad
import { toast } from 'react-hot-toast';
import { fileService } from '../../../services/apiService';

const UsuarioForm = ({ open, onClose, onSave, mode, usuario }) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    dni: '',
    email: '',
    telefono: '',
    fecha_nacimiento: null,
    clave: '',
    confirmar_clave: '',
    foto: '',
    activo: true,
    rol: 'Alumno'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState('');
  const [changePassword, setChangePassword] = useState(false);

  // Roles permitidos
  const roles = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Docente', label: 'Docente' },
    { value: 'Alumno', label: 'Alumno' },
    { value: 'Apoderado', label: 'Apoderado' },
    { value: 'Tutor', label: 'Tutor' }
  ];

  // Cargar datos del usuario cuando se abre en modo edición
  useEffect(() => {
    if (open && mode === 'edit' && usuario) {
      setFormData({
        nombres: usuario.nombres || '',
        dni: usuario.dni || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        fecha_nacimiento: usuario.fecha_nacimiento ? new Date(usuario.fecha_nacimiento) : null,
        clave: '',
        confirmar_clave: '',
        foto: usuario.foto || '',
        activo: usuario.activo !== undefined ? usuario.activo : true,
        rol: usuario.rol || 'Alumno'
      });
      // Construir URL de imagen existente
      const existingImageUrl = usuario.foto ?
        (usuario.foto.startsWith('http') ? usuario.foto :
         `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${usuario.foto}`) : '';
      setPreviewImage(existingImageUrl);
    } else if (open && mode === 'create') {
      // Resetear formulario para modo crear
      setFormData({
        nombres: '',
        dni: '',
        email: '',
        telefono: '',
        fecha_nacimiento: null,
        clave: '',
        confirmar_clave: '',
        foto: '',
        activo: true,
        rol: 'Alumno'
      });
      setPreviewImage('');
    }
    setErrors({});
    setChangePassword(false);
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

  // Función para manejar subida de imagen
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 2MB');
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
        const response = await fileService.uploadFile(file, 'profile');

        if (response.success) {
          setFormData(prev => ({
            ...prev,
            foto: response.filename // Guardar el nombre del archivo subido
          }));
          toast.success('Foto subida correctamente');
        } else {
          toast.error('Error al subir la foto');
          setPreviewImage(''); // Limpiar preview si falla
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Error al subir la foto');
        setPreviewImage(''); // Limpiar preview si falla
      } finally {
        setLoading(false);
      }
    }
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

    // Validar contraseña (solo en modo crear o si se quiere cambiar)
    if (mode === 'create' || changePassword) {
      if (!formData.clave) {
        newErrors.clave = 'La contraseña es obligatoria';
      } else if (formData.clave.length < 6) {
        newErrors.clave = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (formData.clave !== formData.confirmar_clave) {
        newErrors.confirmar_clave = 'Las contraseñas no coinciden';
      }
    }

    // Validar rol
    if (!formData.rol) {
      newErrors.rol = 'El rol es obligatorio';
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
        dni: formData.dni.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim() || null,
        fecha_nacimiento: formData.fecha_nacimiento ? formData.fecha_nacimiento.toISOString().split('T')[0] : null,
        foto: formData.foto,
        activo: formData.activo,
        rol: formData.rol
      };

      // Solo incluir contraseña si se está creando o si se quiere cambiar
      if (mode === 'create' || changePassword) {
        dataToSend.clave = formData.clave;
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                src={previewImage}
                sx={{ width: 80, height: 80 }}
              >
                {formData.nombres.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Foto del usuario
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="photo-upload">
                  <IconButton
                    color="primary"
                    component="span"
                    size="small"
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </Box>
            </Box>

            {/* Grid de campos */}
            <Grid container spacing={3}>

              {/* Nombres */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombres completos"
                  value={formData.nombres}
                  onChange={handleChange('nombres')}
                  error={!!errors.nombres}
                  helperText={errors.nombres}
                  required
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

              {/* Rol */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.rol} required>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    value={formData.rol}
                    onChange={handleChange('rol')}
                    label="Rol"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.rol && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.rol}
                  </Typography>
                )}
              </Grid>

              {/* Contraseña - Solo en modo crear o si se quiere cambiar */}
              {(mode === 'create' || changePassword) && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={mode === 'create' ? 'Contraseña' : 'Nueva contraseña'}
                      type="password"
                      value={formData.clave}
                      onChange={handleChange('clave')}
                      error={!!errors.clave}
                      helperText={errors.clave}
                      required={mode === 'create' || changePassword}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Confirmar contraseña"
                      type="password"
                      value={formData.confirmar_clave}
                      onChange={handleChange('confirmar_clave')}
                      error={!!errors.confirmar_clave}
                      helperText={errors.confirmar_clave}
                      required={mode === 'create' || changePassword}
                    />
                  </Grid>
                </>
              )}

              {/* Botón para cambiar contraseña en modo edición */}
              {mode === 'edit' && !changePassword && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setChangePassword(true)}
                    sx={{ mb: 2 }}
                  >
                    Cambiar Contraseña
                  </Button>
                </Grid>
              )}

              {/* Botón para cancelar cambio de contraseña */}
              {mode === 'edit' && changePassword && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setChangePassword(false);
                      setFormData(prev => ({ ...prev, clave: '', confirmar_clave: '' }));
                      setErrors(prev => ({ ...prev, clave: '', confirmar_clave: '' }));
                    }}
                    sx={{ mb: 2 }}
                  >
                    Cancelar Cambio de Contraseña
                  </Button>
                </Grid>
              )}

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

            {/* Mensaje informativo para modo edición */}
            {mode === 'edit' && !changePassword && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Usa el botón "Cambiar Contraseña" si deseas modificar la contraseña del usuario
              </Alert>
            )}

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
