import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Image as ImageIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { getUser } from '../../services/authService';
import { configuracionService } from '../../services/apiService';
import { fileService } from '../../services/apiService';
import { useConfiguracion } from '../../contexts/ConfiguracionContext';
import { getColegioLogoUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const ConfiguracionList = () => {
  const {
    colegio,
    aniosEscolares,
    updateColegio,
    createAnioEscolar,
    updateAnioEscolar,
    deleteAnioEscolar,
    setAnioActual
  } = useConfiguracion();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState('');

  // Estados para gestión de años escolares
  const [anioEscolarMode, setAnioEscolarMode] = useState(false);
  const [nuevoAnio, setNuevoAnio] = useState('');

  const loadConfiguraciones = async () => {
    try {
      setLoading(true);
      console.log('Cargando configuraciones...');

      const response = await configuracionService.getColegio();
      console.log('Respuesta de configuración:', response);

      if (response.success) {
        updateColegio(response.colegio);

        // Inicializar formData con URLs completas para imágenes
        const formDataWithUrls = {
          ...response.colegio,
          logo: response.colegio.logo ? getColegioLogoUrl(response.colegio.logo) : '',
          background_imagen: response.colegio.background_imagen ? getColegioLogoUrl(response.colegio.background_imagen) : ''
        };
        setFormData(formDataWithUrls);

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

  useEffect(() => {
    loadConfiguraciones();
  }, []);

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

  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen de fondo debe ser menor a 5MB');
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten archivos de imagen');
      return;
    }

    try {
      const response = await fileService.uploadFile(file, 'background');

      if (response.success) {
        const imageUrl = getColegioLogoUrl(response.filename);
        console.log('Imagen subida - filename:', response.filename);
        console.log('Imagen subida - URL construida:', imageUrl);
        setFormData(prev => ({
          ...prev,
          background_imagen: imageUrl
        }));
        toast.success('Imagen de fondo subida exitosamente');
      }
    } catch (error) {
      console.error('Error subiendo imagen de fondo:', error);
      toast.error('Error al subir la imagen de fondo');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      console.log('Datos que se van a enviar:', formData);

      // Preparar datos para envío (convertir URLs completas a filenames)
      const dataToSend = {
        ...formData,
        logo: formData.logo ? formData.logo.split('/').pop() : formData.logo,
        background_imagen: formData.background_imagen ? formData.background_imagen.split('/').pop() : formData.background_imagen
      };

      console.log('Datos procesados para envío:', dataToSend);

      const response = await configuracionService.updateColegio(dataToSend);

      if (response.success) {
        // Actualizar el contexto con todos los datos guardados
        updateColegio({
          nombre: formData.nombre,
          logo: formData.logo,
          codigo: formData.codigo,
          direccion: formData.direccion,
          telefono: formData.telefono,
          email: formData.email,
          director: formData.director,
          color_primario: formData.color_primario,
          color_secundario: formData.color_secundario,
          background_tipo: formData.background_tipo,
          background_color: formData.background_color,
          background_imagen: formData.background_imagen
        });

        // Forzar actualización del contexto para que el login se actualice inmediatamente
        // Esto asegura que todos los componentes que usan el contexto se re-rendericen

        // Sincronizar formData con los datos actualizados del contexto
        // Usar los datos que se acaban de guardar, no mezclar con colegio
        setFormData({
          ...formData
        });

        // Salir del modo edición
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
    // Inicializar formData con URLs completas para imágenes
    const formDataWithUrls = {
      ...colegio,
      logo: colegio.logo ? getColegioLogoUrl(colegio.logo) : '',
      background_imagen: colegio.background_imagen ? getColegioLogoUrl(colegio.background_imagen) : ''
    };
    setFormData(formDataWithUrls);
    setEditMode(false);
    if (colegio.logo) {
      setPreviewImage(colegio.logo);
    } else {
      setPreviewImage('');
    }
  };

  // Funciones para gestión de años escolares
  const handleCrearAnioEscolar = async () => {
    if (!nuevoAnio || isNaN(nuevoAnio)) {
      toast.error('Por favor ingrese un año válido');
      return;
    }

    const anio = parseInt(nuevoAnio);
    if (anio < 2020 || anio > 2030) {
      toast.error('El año debe estar entre 2020 y 2030');
      return;
    }

    try {
      const response = await createAnioEscolar({ anio });
      if (response.success) {
        toast.success('Año escolar creado exitosamente');
        setNuevoAnio('');
        setAnioEscolarMode(false);
      } else {
        toast.error(response.message || 'Error al crear año escolar');
      }
    } catch (error) {
      console.error('Error creando año escolar:', error);
      toast.error('Error al crear año escolar');
    }
  };

  const handleActualizarAnioEscolar = async (id, activo) => {
    try {
      const response = await updateAnioEscolar(id, { activo });
      if (response.success) {
        toast.success('Año escolar actualizado exitosamente');
      } else {
        toast.error(response.message || 'Error al actualizar año escolar');
      }
    } catch (error) {
      console.error('Error actualizando año escolar:', error);
      toast.error('Error al actualizar año escolar');
    }
  };

  const handleEliminarAnioEscolar = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar PERMANENTEMENTE este año escolar? Esta acción no se puede deshacer.')) {
      try {
        const response = await deleteAnioEscolar(id);
        if (response.success) {
          toast.success('Año escolar eliminado permanentemente');
        } else {
          toast.error(response.message || 'Error al eliminar año escolar');
        }
      } catch (error) {
        console.error('Error eliminando año escolar:', error);
        toast.error('Error al eliminar año escolar');
      }
    }
  };

  const handleSetAnioActual = async (anio) => {
    try {
      const response = await setAnioActual(anio);
      if (response.success) {
        toast.success(`Año escolar ${anio} establecido como actual`);
      } else {
        toast.error(response.message || 'Error al establecer año actual');
      }
    } catch (error) {
      console.error('Error estableciendo año actual:', error);
      toast.error('Error al establecer año actual');
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
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SettingsIcon sx={{ fontSize: 24, color: 'primary.main' }} />
        <Typography variant="h5" component="h1" color="primary">
          Configuración del Sistema
        </Typography>
      </Box>

      {/* Información del Colegio */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="h6" component="h2" color="primary">
              Información del Colegio
            </Typography>
            {!editMode && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                sx={{ ml: 'auto' }}
              >
                Editar
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {/* Logo del Colegio */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" gutterBottom>
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
                        size="small"
                        component="span"
                        startIcon={<PhotoCameraIcon />}
                        sx={{ mb: 1.5 }}
                      >
                        Subir Logo
                      </Button>
                    </label>
                  </Box>
                ) : null}

                <Avatar
                  src={previewImage}
                  sx={{
                    width: editMode ? 80 : 160, // 200% más grande en modo lectura
                    height: editMode ? 80 : 160, // 200% más grande en modo lectura
                    mx: 'auto',
                    mb: 1.5,
                    border: '2px solid #e0e0e0'
                  }}
                >
                  <SchoolIcon sx={{ fontSize: editMode ? 40 : 80 }} />
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
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
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
                    size="small"
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
                    size="small"
                    label="Dirección"
                    value={editMode ? formData.direccion || '' : colegio.direccion || ''}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    disabled={!editMode}
                    variant={editMode ? 'outlined' : 'filled'}
                    multiline
                    rows={1}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
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
                    size="small"
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
                    size="small"
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

      {/* Configuración de Colores y Fondo - 2 Columnas */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Columna 1: Configuración de Colores */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 200 }}>
            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <PaletteIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="h6" component="h2" color="primary">
                  Configuración de Colores
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Grid container spacing={1.5}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          backgroundColor: editMode ? formData.color_primario || '#1976d2' : colegio.color_primario || '#1976d2',
                          borderRadius: 1,
                          border: '2px solid #e0e0e0'
                        }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label="Color Primario"
                        value={editMode ? formData.color_primario || '#1976d2' : colegio.color_primario || '#1976d2'}
                        onChange={(e) => handleInputChange('color_primario', e.target.value)}
                        disabled={!editMode}
                        variant={editMode ? 'outlined' : 'filled'}
                        placeholder="#1976d2"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          backgroundColor: editMode ? formData.color_secundario || '#424242' : colegio.color_secundario || '#424242',
                          borderRadius: 1,
                          border: '2px solid #e0e0e0'
                        }}
                      />
                      <TextField
                        fullWidth
                        size="small"
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
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna 2: Configuración de Fondo */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 200 }}>
            <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <ImageIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="h6" component="h2" color="primary">
                  Configuración de Fondo del Login
                </Typography>
              </Box>

              <Divider sx={{ mb: 1.5 }} />

              <Box sx={{ flex: 1 }}>
                <Grid container spacing={1.5}>
                {/* Columna 1: Controles */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Tipo de Fondo</InputLabel>
                      <Select
                        value={editMode ? formData.background_tipo || 'color' : colegio.background_tipo || 'color'}
                        onChange={(e) => handleInputChange('background_tipo', e.target.value)}
                        disabled={!editMode}
                        variant={editMode ? 'outlined' : 'filled'}
                      >
                        <MenuItem value="color">Color</MenuItem>
                        <MenuItem value="imagen">Imagen</MenuItem>
                      </Select>
                    </FormControl>

                    {((editMode ? formData.background_tipo : colegio.background_tipo) === 'color') ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1,
                            backgroundColor: editMode ? formData.background_color : colegio.background_color,
                            border: '2px solid #e0e0e0',
                            cursor: editMode ? 'pointer' : 'default'
                          }}
                          onClick={editMode ? () => document.getElementById('background-color-picker').click() : undefined}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Color de Fondo"
                          value={editMode ? formData.background_color || '#f5f5f5' : colegio.background_color || '#f5f5f5'}
                          onChange={(e) => handleInputChange('background_color', e.target.value)}
                          disabled={!editMode}
                          variant={editMode ? 'outlined' : 'filled'}
                          type="color"
                          inputProps={{ id: 'background-color-picker' }}
                        />
                      </Box>
                    ) : (
                      <Box>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="background-image-upload"
                          type="file"
                          onChange={handleBackgroundImageUpload}
                        />
                        <label htmlFor="background-image-upload">
                          <Button
                            variant="outlined"
                            size="small"
                            component="span"
                            startIcon={<PhotoCameraIcon />}
                            disabled={!editMode}
                            fullWidth
                          >
                            Subir Imagen de Fondo
                          </Button>
                        </label>
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Columna 2: Vista previa */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', height: '100%', minHeight: 140, pt: 1 }}>
                    {(editMode ? formData.background_imagen : colegio.background_imagen) ? (
                      <Box sx={{ textAlign: 'center', width: '100%' }}>
                        {(() => {
                          const imageSrc = editMode ? formData.background_imagen : colegio.background_imagen;
                          console.log('Vista previa - editMode:', editMode);
                          console.log('Vista previa - formData.background_imagen:', formData.background_imagen);
                          console.log('Vista previa - colegio.background_imagen:', colegio.background_imagen);
                          console.log('Vista previa - imageSrc final:', imageSrc);
                          return (
                            <img
                              src={imageSrc}
                              alt="Vista previa del fondo"
                              style={{
                                maxWidth: '100%',
                                maxHeight: 100,
                                borderRadius: 8,
                                border: '2px solid #e0e0e0',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                console.error('Error cargando imagen de vista previa:', e.target.src);
                                e.target.style.display = 'none';
                              }}
                              onLoad={() => {
                                console.log('Imagen de vista previa cargada correctamente');
                              }}
                            />
                          );
                        })()}
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        <ImageIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                          {editMode ? 'Seleccione una imagen para ver la vista previa' : 'No hay imagen de fondo configurada'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gestión de Años Escolares */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <CalendarIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="h6" component="h2" color="primary">
              Gestión de Años Escolares
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setAnioEscolarMode(!anioEscolarMode)}
              sx={{ ml: 'auto' }}
            >
              {anioEscolarMode ? 'Cancelar' : 'Nuevo Año'}
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Formulario para crear nuevo año */}
          {anioEscolarMode && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Crear Nuevo Año Escolar
              </Typography>
              <Grid container spacing={1.5} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Año"
                    type="number"
                    value={nuevoAnio}
                    onChange={(e) => setNuevoAnio(e.target.value)}
                    placeholder="2025"
                    inputProps={{ min: 2020, max: 2030 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleCrearAnioEscolar}
                      disabled={!nuevoAnio}
                    >
                      Crear
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setAnioEscolarMode(false);
                        setNuevoAnio('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Lista de años escolares */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Años Escolares Disponibles
            </Typography>
            {aniosEscolares.length === 0 ? (
              <Alert severity="info">
                No hay años escolares registrados. Cree uno nuevo para comenzar.
              </Alert>
            ) : (
              <Grid container spacing={1.5}>
                {aniosEscolares.map((anio) => (
                  <Grid item xs={12} sm={6} md={4} key={anio.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        border: anio.anio === colegio.anio_escolar_actual ? '2px solid' : '1px solid',
                        borderColor: anio.anio === colegio.anio_escolar_actual ? 'primary.main' : 'divider'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="subtitle1">
                          {anio.anio}
                        </Typography>
                        {anio.anio === colegio.anio_escolar_actual && (
                          <CheckCircleIcon color="primary" sx={{ fontSize: 18 }} />
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                        <Chip
                          label={anio.activo ? 'Activo' : 'Inactivo'}
                          color={anio.activo ? 'success' : 'default'}
                          size="small"
                        />
                        {anio.anio === colegio.anio_escolar_actual && (
                          <Chip
                            label="Actual"
                            color="primary"
                            size="small"
                          />
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {anio.anio !== colegio.anio_escolar_actual && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleSetAnioActual(anio.anio)}
                            disabled={!anio.activo}
                          >
                            Establecer Actual
                          </Button>
                        )}

                        <Button
                          size="small"
                          variant="outlined"
                          color={anio.activo ? 'warning' : 'success'}
                          onClick={() => handleActualizarAnioEscolar(anio.id, !anio.activo)}
                        >
                          {anio.activo ? 'Desactivar' : 'Activar'}
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleEliminarAnioEscolar(anio.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </CardContent>
      </Card>


      {/* Botones de Acción */}
      {editMode && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Box>
      )}

      {/* Alerta Informativa */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Nota:</strong> Los cambios en la configuración del colegio se aplicarán inmediatamente
          y afectarán la apariencia del sistema. Los colores se actualizarán en tiempo real.
        </Typography>
      </Alert>
    </Box>
  );
};

export default ConfiguracionList;
