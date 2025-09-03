import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { PhotoCamera, Save, Lock } from '@mui/icons-material';
import { getUser, getUserId } from '../services/authService';
import { userService, fileService } from '../services/apiService';

const MiPerfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    nombres: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
  });
  const [passwordData, setPasswordData] = useState({
    clave_actual: '',
    nueva_clave: '',
    confirmar_clave: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userId = getUserId();
      const response = await userService.getUserById(userId);
      if (response.success) {
        setUser(response.user);
        setFormData({
          nombres: response.user.nombres || '',
          email: response.user.email || '',
          telefono: response.user.telefono || '',
          fecha_nacimiento: response.user.fecha_nacimiento || '',
        });
      }
    } catch (err) {
      setError('Error al cargar los datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const userId = getUserId();
      const response = await userService.updateUser(userId, formData);

      if (response.success) {
        setSuccess('Perfil actualizado correctamente');
        setUser(response.user);
      } else {
        setError(response.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      setError('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.nueva_clave !== passwordData.confirmar_clave) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const userId = getUserId();
      const response = await userService.updateUser(userId, {
        clave_actual: passwordData.clave_actual,
        nueva_clave: passwordData.nueva_clave,
      });

      if (response.success) {
        setSuccess('Contraseña actualizada correctamente');
        setPasswordData({
          clave_actual: '',
          nueva_clave: '',
          confirmar_clave: '',
        });
      } else {
        setError(response.message || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      setError('Error al cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fileService.uploadFile(file, 'profile');
      if (response.success) {
        const userId = getUserId();
        await userService.updateUser(userId, { foto: response.filename });
        setSuccess('Foto actualizada correctamente');
        loadUserData(); // Recargar datos
      } else {
        setError('Error al subir la foto');
      }
    } catch (err) {
      setError('Error al subir la foto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mi Perfil
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Información del perfil */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información Personal
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombres Completos"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    margin="normal"
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
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    margin="normal"
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
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} /> : 'Guardar Cambios'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Foto de perfil */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Foto de Perfil
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Avatar
                  src={user?.foto ? `/uploads/${user.foto}` : undefined}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                >
                  {user?.nombres?.charAt(0) || 'U'}
                </Avatar>
              </Box>

              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                type="file"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  disabled={saving}
                >
                  Cambiar Foto
                </Button>
              </label>
            </CardContent>
          </Card>
        </Grid>

        {/* Cambio de contraseña */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cambiar Contraseña
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Contraseña Actual"
                    name="clave_actual"
                    type="password"
                    value={passwordData.clave_actual}
                    onChange={handlePasswordChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Nueva Contraseña"
                    name="nueva_clave"
                    type="password"
                    value={passwordData.nueva_clave}
                    onChange={handlePasswordChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Confirmar Contraseña"
                    name="confirmar_clave"
                    type="password"
                    value={passwordData.confirmar_clave}
                    onChange={handlePasswordChange}
                    margin="normal"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Lock />}
                  onClick={handleChangePassword}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={20} /> : 'Cambiar Contraseña'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MiPerfil;
