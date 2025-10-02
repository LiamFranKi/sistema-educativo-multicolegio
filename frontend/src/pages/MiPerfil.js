import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  PhotoCamera,
  Lock,
  Person,
  Email,
  Phone,
  CalendarToday,
  Visibility,
  VisibilityOff,
  Edit,
  Cancel,
  CheckCircle,
  Security,
  AccountCircle,
  Work,
  Badge
} from '@mui/icons-material';
import { getUserId } from '../services/authService';
import { userService, cloudinaryApi } from '../services/apiService';
import { getImageUrl } from '../utils/imageUtils';
import { useUser } from '../contexts/UserContext';
import toast from 'react-hot-toast';

const MiPerfil = () => {
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    dni: '',
    direccion: '',
    genero: '',
    estado_civil: '',
    profesion: '',
    foto: '',
  });
  const [passwordData, setPasswordData] = useState({
    clave_actual: '',
    nueva_clave: '',
    confirmar_clave: '',
  });
  const [errors, setErrors] = useState({});

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      if (user) {
        setFormData({
          nombres: user.nombres || '',
          apellidos: user.apellidos || '',
          email: user.email || '',
          telefono: user.telefono || '',
          fecha_nacimiento: user.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : '',
          dni: user.dni || '',
          direccion: user.direccion || '',
          genero: user.genero || '',
          estado_civil: user.estado_civil || '',
          profesion: user.profesion || '',
          foto: user.foto || '',
        });

        // Limpiar preview si hay foto existente
        if (user.foto) {
          setPreviewImage('');
        }
      }
    } catch (err) {
      console.error('Error cargando datos del usuario:', err);
      toast.error('Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (formData.telefono && !/^[0-9+\-\s()]+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido';
    }

    if (formData.dni && !/^[0-9]{8}$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.clave_actual) {
      newErrors.clave_actual = 'La contraseña actual es obligatoria';
    }

    if (!passwordData.nueva_clave) {
      newErrors.nueva_clave = 'La nueva contraseña es obligatoria';
    } else if (passwordData.nueva_clave.length < 6) {
      newErrors.nueva_clave = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (passwordData.nueva_clave !== passwordData.confirmar_clave) {
      newErrors.confirmar_clave = 'Las contraseñas no coinciden';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setSaving(true);
    try {
      const userId = getUserId();
      const response = await userService.updateUser(userId, formData);

      if (response.success) {
        toast.success('Perfil actualizado correctamente');
        updateUser(response.user); // Actualizar el contexto global
        setEditing(false);
        setPreviewImage('');
      } else {
        toast.error(response.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      toast.error('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setPreviewImage('');
    setErrors({});
    // Recargar datos originales
    loadUserData();
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setSaving(true);
    try {
      const userId = getUserId();
      const response = await userService.updateUser(userId, {
        clave_actual: passwordData.clave_actual,
        nueva_clave: passwordData.nueva_clave,
      });

      if (response.success) {
        toast.success('Contraseña actualizada correctamente');
        setPasswordData({
          clave_actual: '',
          nueva_clave: '',
          confirmar_clave: '',
        });
        setErrors({});
      } else {
        toast.error(response.message || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      toast.error('Error al cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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

    setSaving(true);
    try {
      const response = await cloudinaryApi.uploadFile(file);
      if (response.data.success) {
        const newPhotoUrl = response.data.data.url;

        // Actualizar en la base de datos
        const updateResponse = await userService.updateUser(user.id, { foto: newPhotoUrl });

        if (updateResponse.success) {
          const updatedUser = { ...user, foto: newPhotoUrl };
          updateUser(updatedUser); // Actualizar el contexto global
          setFormData(prev => ({
            ...prev,
            foto: newPhotoUrl
          }));
          toast.success('Foto subida correctamente a Cloudinary');
        } else {
          toast.error('Error actualizando foto en la base de datos');
          setPreviewImage('');
        }
      } else {
        toast.error(response.data.message || 'Error al subir la foto');
        setPreviewImage('');
      }
    } catch (err) {
      console.error('Error subiendo foto:', err);
      toast.error('Error al subir la foto. Intenta nuevamente.');
      setPreviewImage('');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Cargando perfil...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header del perfil */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
            <Person sx={{ mr: 2, verticalAlign: 'middle' }} />
            Mi Perfil
          </Typography>
          {!editing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditing(true)}
              sx={{ borderRadius: 2 }}
            >
              Editar Perfil
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancelEdit}
                disabled={saving}
                sx={{ borderRadius: 2 }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <CheckCircle />}
                onClick={handleSaveProfile}
                disabled={saving}
                sx={{ borderRadius: 2 }}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Box>
          )}
        </Box>

        {/* Información del rol */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            icon={<Badge />}
            label={user?.rol || 'Usuario'}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            icon={<AccountCircle />}
            label={user?.activo ? 'Activo' : 'Inactivo'}
            color={user?.activo ? 'success' : 'error'}
            variant="filled"
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Información del perfil */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                Información Personal
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    disabled={!editing}
                    error={!!errors.nombres}
                    helperText={errors.nombres}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color={editing ? 'primary' : 'disabled'} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { color: editing ? 'primary.main' : 'text.secondary' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color={editing ? 'primary' : 'disabled'} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { color: editing ? 'primary.main' : 'text.secondary' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color={editing ? 'primary' : 'disabled'} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { color: editing ? 'primary.main' : 'text.secondary' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    disabled={!editing}
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color={editing ? 'primary' : 'disabled'} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { color: editing ? 'primary.main' : 'text.secondary' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="DNI"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    disabled={!editing}
                    error={!!errors.dni}
                    helperText={errors.dni}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge color={editing ? 'primary' : 'disabled'} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { color: editing ? 'primary.main' : 'text.secondary' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Nacimiento"
                    name="fecha_nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday color={editing ? 'primary' : 'disabled'} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { color: editing ? 'primary.main' : 'text.secondary' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    disabled={!editing}
                    multiline
                    rows={3}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { color: editing ? 'primary.main' : 'text.secondary' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!editing}>
                    <InputLabel>Género</InputLabel>
                    <Select
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      label="Género"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Seleccionar</MenuItem>
                      <MenuItem value="Masculino">Masculino</MenuItem>
                      <MenuItem value="Femenino">Femenino</MenuItem>
                      <MenuItem value="Otro">Otro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!editing}>
                    <InputLabel>Estado Civil</InputLabel>
                    <Select
                      name="estado_civil"
                      value={formData.estado_civil}
                      onChange={handleInputChange}
                      label="Estado Civil"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Seleccionar</MenuItem>
                      <MenuItem value="Soltero">Soltero</MenuItem>
                      <MenuItem value="Casado">Casado</MenuItem>
                      <MenuItem value="Divorciado">Divorciado</MenuItem>
                      <MenuItem value="Viudo">Viudo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Profesión"
                    name="profesion"
                    value={formData.profesion}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Work color={editing ? 'primary' : 'disabled'} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { color: editing ? 'primary.main' : 'text.secondary' }
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Foto de perfil */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <PhotoCamera sx={{ mr: 1, color: 'primary.main' }} />
                Foto de Perfil
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Avatar
                  src={previewImage || (user?.foto ? getImageUrl(user.foto) : undefined)}
                  sx={{
                    width: 150,
                    height: 150,
                    mx: 'auto',
                    mb: 2,
                    border: '3px solid',
                    borderColor: 'primary.main',
                    boxShadow: 3
                  }}
                >
                  {user?.nombres?.charAt(0) || 'U'}
                </Avatar>
              </Box>

              {editing && (
                <>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handlePhotoUpload}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={saving ? <CircularProgress size={20} /> : <PhotoCamera />}
                      disabled={saving}
                      sx={{ borderRadius: 2, mb: 2 }}
                    >
                      {saving ? 'Subiendo...' : 'Cambiar Foto'}
                    </Button>
                  </label>
                </>
              )}

              {/* Cambio de contraseña */}
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Security sx={{ mr: 1, color: 'primary.main' }} />
                  Cambiar Contraseña
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contraseña Actual"
                      name="clave_actual"
                      type={showPasswords.actual ? 'text' : 'password'}
                      value={passwordData.clave_actual}
                      onChange={handlePasswordChange}
                      error={!!errors.clave_actual}
                      helperText={errors.clave_actual}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('actual')}
                              edge="end"
                            >
                              {showPasswords.actual ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nueva Contraseña"
                      name="nueva_clave"
                      type={showPasswords.nueva ? 'text' : 'password'}
                      value={passwordData.nueva_clave}
                      onChange={handlePasswordChange}
                      error={!!errors.nueva_clave}
                      helperText={errors.nueva_clave}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('nueva')}
                              edge="end"
                            >
                              {showPasswords.nueva ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirmar Contraseña"
                      name="confirmar_clave"
                      type={showPasswords.confirmar ? 'text' : 'password'}
                      value={passwordData.confirmar_clave}
                      onChange={handlePasswordChange}
                      error={!!errors.confirmar_clave}
                      helperText={errors.confirmar_clave}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => togglePasswordVisibility('confirmar')}
                              edge="end"
                            >
                              {showPasswords.confirmar ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={saving ? <CircularProgress size={20} /> : <Lock />}
                    onClick={handleChangePassword}
                    disabled={saving || !passwordData.clave_actual || !passwordData.nueva_clave || !passwordData.confirmar_clave}
                    sx={{ borderRadius: 2 }}
                  >
                    {saving ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default MiPerfil;
