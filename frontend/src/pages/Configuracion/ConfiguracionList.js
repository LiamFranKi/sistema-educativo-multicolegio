import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Settings as SettingsIcon,
  School as SchoolIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { getUser } from '../../services/authService';
import { configuracionService } from '../../services/apiService';
import { fileService } from '../../services/apiService';
import { useConfiguracion } from '../../contexts/ConfiguracionContext';
import { getColegioLogoUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const ConfiguracionList = () => {
  const user = getUser();
  const { colegio, updateColegio } = useConfiguracion();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configuraciones, setConfiguraciones] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    loadConfiguraciones();
  }, []);

  const loadConfiguraciones = async () => {
    try {
      setLoading(true);
      console.log('Cargando configuraciones...');

      const response = await configuracionService.getColegio();
      console.log('Respuesta de configuración:', response);

      if (response.success) {
        updateColegio(response.colegio);
        setFormData(response.colegio);

        // Cargar imagen de preview si existe logo
        if (response.colegio.logo) {
          setPreviewImage(getColegioLogoUrl(response.colegio.logo));
        }
      }
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
      toast.error('Error al cargar configuraciones');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('El archivo no puede ser mayor a 2MB');
      return;
    }

    try {
      const response = await fileService.uploadFile(file, 'profile');

      if (response.success) {
        setFormData(prev => ({
          ...prev,
          logo: response.filename
        }));
        setPreviewImage(getColegioLogoUrl(response.filename));
        toast.success('Logo subido exitosamente');
      }
    } catch (error) {
      console.error('Error subiendo logo:', error);
      toast.error('Error al subir el logo');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await configuracionService.updateColegio(formData);

      if (response.success) {
        // Actualizar el contexto para que el sidebar se actualice automáticamente
        updateColegio({
          nombre: formData.nombre,
          logo: formData.logo
        });

        // Actualizar el estado local con los datos guardados para mostrar cambios inmediatamente
        setFormData(prev => ({
          ...prev,
          ...formData
        }));

        setEditMode(false);
        toast.success('Configuración guardada exitosamente');
      }
    } catch (error) {
      console.error('Error guardando configuración:', error);
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(colegio);
    setEditMode(false);
    if (colegio.logo) {
      setPreviewImage(colegio.logo);
    } else {
      setPreviewImage('');
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" color="primary">
          Configuración del Sistema
        </Typography>
      </Box>

      {/* Información del Colegio */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SchoolIcon color="primary" />
            <Typography variant="h5" component="h2" color="primary">
              Información del Colegio
            </Typography>
            {!editMode && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                sx={{ ml: 'auto' }}
              >
                Editar
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {/* Logo del Colegio */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Logo del Colegio
                </Typography>

                {editMode ? (
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="logo-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="logo-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCameraIcon />}
                        sx={{ mb: 2 }}
                      >
                        Subir Logo
                      </Button>
                    </label>
                  </Box>
                ) : null}

                <Avatar
                  src={previewImage}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    border: '2px solid #e0e0e0'
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 60 }} />
                </Avatar>

                {editMode && formData.logo && (
                  <Typography variant="caption" color="text.secondary">
                    Logo actual: {formData.logo}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Información Básica */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre del Colegio"
                    value={editMode ? formData.nombre || '' : colegio.nombre || ''}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Código"
                    value={editMode ? formData.codigo || '' : colegio.codigo || ''}
                    onChange={(e) => handleInputChange('codigo', e.target.value)}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    value={editMode ? formData.direccion || '' : colegio.direccion || ''}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={editMode ? formData.telefono || '' : colegio.telefono || ''}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={editMode ? formData.email || '' : colegio.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Director"
                    value={editMode ? formData.director || '' : colegio.director || ''}
                    onChange={(e) => handleInputChange('director', e.target.value)}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Configuración de Colores */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PaletteIcon color="primary" />
            <Typography variant="h5" component="h2" color="primary">
              Configuración de Colores
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: editMode ? formData.color_primario || '#1976d2' : colegio.color_primario || '#1976d2',
                    borderRadius: 1,
                    border: '2px solid #e0e0e0'
                  }}
                />
                <TextField
                  fullWidth
                  label="Color Primario"
                  value={editMode ? formData.color_primario || '#1976d2' : colegio.color_primario || '#1976d2'}
                  onChange={(e) => handleInputChange('color_primario', e.target.value)}
                  disabled={!editMode}
                  variant={editMode ? 'outlined' : 'filled'}
                  placeholder="#1976d2"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: editMode ? formData.color_secundario || '#424242' : colegio.color_secundario || '#424242',
                    borderRadius: 1,
                    border: '2px solid #e0e0e0'
                  }}
                />
                <TextField
                  fullWidth
                  label="Color Secundario"
                  value={editMode ? formData.color_secundario || '#424242' : colegio.color_secundario || '#424242'}
                  onChange={(e) => handleInputChange('color_secundario', e.target.value)}
                  disabled={!editMode}
                  variant={editMode ? 'outlined' : 'filled'}
                  placeholder="#424242"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <InfoIcon color="primary" />
            <Typography variant="h5" component="h2" color="primary">
              Información del Sistema
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Año Escolar Actual"
                value={colegio.anio_escolar_actual || '2025'}
                disabled
                variant="filled"
                helperText="Configurado automáticamente"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={colegio.sistema_activo ? 'Activo' : 'Inactivo'}
                  color={colegio.sistema_activo ? 'success' : 'error'}
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  Estado del Sistema
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      {editMode && (
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      )}

      {/* Alerta Informativa */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Nota:</strong> Los cambios en la configuración del colegio se aplicarán inmediatamente
          y afectarán la apariencia del sistema. Los colores se actualizarán en tiempo real.
        </Typography>
      </Alert>
    </Box>
  );
};

export default ConfiguracionList;
