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
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment
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
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { getUser } from '../../services/authService';
import { configuracionService, nivelesService } from '../../services/apiService';
import { fileService } from '../../services/apiService';
import { useConfiguracion } from '../../contexts/ConfiguracionContext';
import { getColegioLogoUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

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
  const [anioSearchTerm, setAnioSearchTerm] = useState('');
  const [anioPagination, setAnioPagination] = useState({
    page: 0,
    rowsPerPage: 5
  });

  // Estados para gestión de niveles
  const [niveles, setNiveles] = useState([]);
  const [loadingNiveles, setLoadingNiveles] = useState(true);
  const [nivelMode, setNivelMode] = useState(false);
  const [editingNivel, setEditingNivel] = useState(null);
  const [nivelForm, setNivelForm] = useState({
    nombre: '',
    descripcion: '',
    codigo: '',
    orden: 0,
    tipo_grados: 'Grados',
    grado_minimo: 1,
    grado_maximo: 10,
    tipo_calificacion: 'Cuantitativa',
    calificacion_final: 'Promedio',
    nota_minima: '0',
    nota_maxima: '20',
    nota_aprobatoria: '11'
  });
  const [nivelSearchTerm, setNivelSearchTerm] = useState('');
  const [nivelPagination, setNivelPagination] = useState({
    page: 0,
    rowsPerPage: 5
  });

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

  const loadNiveles = async () => {
    try {
      setLoadingNiveles(true);
      console.log('Cargando niveles educativos...');

      const response = await nivelesService.getNiveles();
      console.log('Respuesta de niveles:', response);

      if (response.success) {
        setNiveles(response.niveles);
      }
    } catch (error) {
      console.error('Error cargando niveles:', error);
      toast.error('Error al cargar niveles educativos');
    } finally {
      setLoadingNiveles(false);
    }
  };

  // Funciones para CRUD de niveles
  const handleNivelInputChange = (field, value) => {
    setNivelForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateNivel = () => {
    setEditingNivel(null);
    setNivelForm({
      nombre: '',
      descripcion: '',
      codigo: '',
      orden: niveles.length + 1,
      tipo_grados: 'Grados',
      grado_minimo: 1,
      grado_maximo: 10,
      tipo_calificacion: 'Cuantitativa',
      calificacion_final: 'Promedio',
      nota_minima: '0',
      nota_maxima: '20',
      nota_aprobatoria: '11'
    });
    setNivelMode(true);
  };

  const handleEditNivel = (nivel) => {
    setEditingNivel(nivel);
    setNivelForm({
      nombre: nivel.nombre,
      descripcion: nivel.descripcion || '',
      codigo: nivel.codigo,
      orden: nivel.orden,
      tipo_grados: nivel.tipo_grados || 'Grados',
      grado_minimo: nivel.grado_minimo || 1,
      grado_maximo: nivel.grado_maximo || 10,
      tipo_calificacion: nivel.tipo_calificacion || 'Cuantitativa',
      calificacion_final: nivel.calificacion_final || 'Promedio',
      nota_minima: nivel.nota_minima || '0',
      nota_maxima: nivel.nota_maxima || '20',
      nota_aprobatoria: nivel.nota_aprobatoria || '11'
    });
    setNivelMode(true);
  };

  const handleSaveNivel = async () => {
    try {
      setSaving(true);

      // Validaciones
      if (!nivelForm.nombre.trim()) {
        toast.error('El nombre es requerido');
        return;
      }
      if (!nivelForm.codigo.trim()) {
        toast.error('El código es requerido');
        return;
      }

      if (editingNivel) {
        // Actualizar nivel existente
        const response = await nivelesService.updateNivel(editingNivel.id, nivelForm);
        if (response.success) {
          toast.success('Nivel actualizado exitosamente');
          await loadNiveles();
          setNivelMode(false);
          setEditingNivel(null);
        }
      } else {
        // Crear nuevo nivel
        const response = await nivelesService.createNivel(nivelForm);
        if (response.success) {
          toast.success('Nivel creado exitosamente');
          await loadNiveles();
          setNivelMode(false);
        }
      }
    } catch (error) {
      console.error('Error guardando nivel:', error);
      toast.error('Error al guardar nivel');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNivel = async (nivel) => {
    try {
      const confirmed = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar el nivel "${nivel.nombre}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (confirmed.isConfirmed) {
        setSaving(true);
        const response = await nivelesService.deleteNivel(nivel.id);
        if (response.success) {
          toast.success('Nivel eliminado exitosamente');
          await loadNiveles();
        }
      }
    } catch (error) {
      console.error('Error eliminando nivel:', error);
      toast.error('Error al eliminar nivel');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelNivel = () => {
    setNivelMode(false);
    setEditingNivel(null);
    setNivelForm({
      nombre: '',
      descripcion: '',
      codigo: '',
      orden: 0
    });
  };

  // Funciones de búsqueda y paginación para niveles
  const handleNivelSearch = (event) => {
    setNivelSearchTerm(event.target.value);
    setNivelPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleNivelClear = () => {
    setNivelSearchTerm('');
  };

  const handleNivelChangePage = (event, newPage) => {
    setNivelPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleNivelChangeRowsPerPage = (event) => {
    setNivelPagination(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  // Filtrar niveles según término de búsqueda
  const filteredNiveles = niveles.filter(nivel =>
    nivel.nombre.toLowerCase().includes(nivelSearchTerm.toLowerCase()) ||
    nivel.codigo.toLowerCase().includes(nivelSearchTerm.toLowerCase()) ||
    (nivel.descripcion && nivel.descripcion.toLowerCase().includes(nivelSearchTerm.toLowerCase()))
  );

  // Obtener niveles paginados
  const paginatedNiveles = filteredNiveles.slice(
    nivelPagination.page * nivelPagination.rowsPerPage,
    nivelPagination.page * nivelPagination.rowsPerPage + nivelPagination.rowsPerPage
  );

  // Funciones de búsqueda y paginación para años escolares
  const handleAnioSearch = (event) => {
    setAnioSearchTerm(event.target.value);
    setAnioPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleAnioClear = () => {
    setAnioSearchTerm('');
  };

  const handleAnioChangePage = (event, newPage) => {
    setAnioPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleAnioChangeRowsPerPage = (event) => {
    setAnioPagination(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  // Filtrar años escolares según término de búsqueda y ordenar por año descendente
  const filteredAnios = aniosEscolares
    .filter(anio =>
      anio.anio.toString().includes(anioSearchTerm) ||
      (anio.activo ? 'activo' : 'inactivo').includes(anioSearchTerm.toLowerCase())
    )
    .sort((a, b) => b.anio - a.anio); // Ordenar por año descendente

  // Obtener años escolares paginados
  const paginatedAnios = filteredAnios.slice(
    anioPagination.page * anioPagination.rowsPerPage,
    anioPagination.page * anioPagination.rowsPerPage + anioPagination.rowsPerPage
  );

  useEffect(() => {
    loadConfiguraciones();
    loadNiveles();
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
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              {editMode ? (
                <>
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
                </>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                >
                  Editar
                </Button>
              )}
            </Box>
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

          {/* Alerta informativa para la sección de Información del Colegio */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Nota:</strong> Los cambios en la configuración del colegio se aplicarán inmediatamente
              y afectarán la apariencia del sistema. Los colores se actualizarán en tiempo real.
            </Typography>
          </Alert>
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

      {/* Gestión de Niveles Educativos */}
      <Paper sx={{ mb: 2, overflow: 'hidden', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {/* Header con título y botón "Nuevo" */}
        <Box sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SchoolIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="h6" color="primary">
              Niveles Educativos
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNivel}
            size="small"
            disabled={saving}
            sx={{ borderRadius: 2 }}
          >
            Nuevo Nivel
          </Button>
        </Box>

        {/* Formulario de creación/edición */}
        {nivelMode && (
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              {editingNivel ? 'Editar Nivel' : 'Nuevo Nivel'}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nombre del Nivel"
                  value={nivelForm.nombre}
                  onChange={(e) => handleNivelInputChange('nombre', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Código"
                  value={nivelForm.codigo}
                  onChange={(e) => handleNivelInputChange('codigo', e.target.value.toUpperCase())}
                  size="small"
                  required
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Orden"
                  type="number"
                  value={nivelForm.orden}
                  onChange={(e) => handleNivelInputChange('orden', parseInt(e.target.value) || 0)}
                  size="small"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={nivelForm.descripcion}
                  onChange={(e) => handleNivelInputChange('descripcion', e.target.value)}
                  size="small"
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Nuevos campos para configuración de niveles */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Configuración de Grados
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo Grados</InputLabel>
                  <Select
                    value={nivelForm.tipo_grados}
                    onChange={(e) => handleNivelInputChange('tipo_grados', e.target.value)}
                    label="Tipo Grados"
                  >
                    <MenuItem value="Grados">Grados</MenuItem>
                    <MenuItem value="Años">Años</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Grado Mínimo</InputLabel>
                  <Select
                    value={nivelForm.grado_minimo}
                    onChange={(e) => handleNivelInputChange('grado_minimo', parseInt(e.target.value))}
                    label="Grado Mínimo"
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <MenuItem key={i} value={i}>{i}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Grado Máximo</InputLabel>
                  <Select
                    value={nivelForm.grado_maximo}
                    onChange={(e) => handleNivelInputChange('grado_maximo', parseInt(e.target.value))}
                    label="Grado Máximo"
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <MenuItem key={i} value={i}>{i}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Configuración de Calificaciones
                  </Typography>
                </Divider>
              </Grid>

              {/* Todos los campos de calificaciones en la misma línea */}
              <Grid item xs={12} sm={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo Calificación</InputLabel>
                  <Select
                    value={nivelForm.tipo_calificacion}
                    onChange={(e) => {
                      const newType = e.target.value;
                      handleNivelInputChange('tipo_calificacion', newType);

                      // Reset valores de notas según el tipo
                      if (newType === 'Cualitativa') {
                        handleNivelInputChange('nota_minima', 'D');
                        handleNivelInputChange('nota_maxima', 'A');
                        handleNivelInputChange('nota_aprobatoria', 'B');
                      } else {
                        handleNivelInputChange('nota_minima', '0');
                        handleNivelInputChange('nota_maxima', '20');
                        handleNivelInputChange('nota_aprobatoria', '11');
                      }
                    }}
                    label="Tipo Calificación"
                  >
                    <MenuItem value="Cualitativa">Cualitativa</MenuItem>
                    <MenuItem value="Cuantitativa">Cuantitativa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Calificación Final</InputLabel>
                  <Select
                    value={nivelForm.calificacion_final}
                    onChange={(e) => handleNivelInputChange('calificacion_final', e.target.value)}
                    label="Calificación Final"
                  >
                    <MenuItem value="Promedio">Promedio</MenuItem>
                    <MenuItem value="Porcentaje">Porcentaje</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Nota Mínima</InputLabel>
                  <Select
                    value={nivelForm.nota_minima}
                    onChange={(e) => handleNivelInputChange('nota_minima', e.target.value)}
                    label="Nota Mínima"
                  >
                    {/* Opciones Cualitativas */}
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                    {/* Opciones Cuantitativas */}
                    {Array.from({ length: 21 }, (_, i) => (
                      <MenuItem key={i} value={i.toString()}>{i}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Nota Máxima</InputLabel>
                  <Select
                    value={nivelForm.nota_maxima}
                    onChange={(e) => handleNivelInputChange('nota_maxima', e.target.value)}
                    label="Nota Máxima"
                  >
                    {/* Opciones Cualitativas */}
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                    {/* Opciones Cuantitativas */}
                    {Array.from({ length: 21 }, (_, i) => (
                      <MenuItem key={i} value={i.toString()}>{i}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Nota Aprobatoria</InputLabel>
                  <Select
                    value={nivelForm.nota_aprobatoria}
                    onChange={(e) => handleNivelInputChange('nota_aprobatoria', e.target.value)}
                    label="Nota Aprobatoria"
                  >
                    {/* Opciones Cualitativas */}
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                    {/* Opciones Cuantitativas */}
                    {Array.from({ length: 21 }, (_, i) => (
                      <MenuItem key={i} value={i.toString()}>{i}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSaveNivel}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={16} /> : <CheckCircleIcon />}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancelNivel}
                disabled={saving}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        )}

        {/* Barra de búsqueda */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            placeholder="Buscar por nombre, código o descripción..."
            variant="outlined"
            size="small"
            value={nivelSearchTerm}
            onChange={handleNivelSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: nivelSearchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleNivelClear}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: 400 }}
          />
        </Box>

        {/* Tabla */}
        <TableContainer>
          {loadingNiveles ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Cargando niveles...</Typography>
            </Box>
          ) : filteredNiveles.length === 0 ? (
            <Box sx={{
              p: 4,
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>
                No hay niveles disponibles
              </Typography>
              <Typography variant="body2">
                {nivelSearchTerm ? 'No se encontraron niveles con ese criterio de búsqueda' : 'Comienza creando un nuevo nivel'}
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell align="center">Orden</TableCell>
                  <TableCell align="center">Nombre</TableCell>
                  <TableCell align="center">Tipo Grados</TableCell>
                  <TableCell align="center">Grados</TableCell>
                  <TableCell align="center">Tipo Calificación</TableCell>
                  <TableCell align="center">Calificación Final</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedNiveles.map((nivel) => (
                  <TableRow
                    key={nivel.id}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {nivel.orden}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {nivel.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={nivel.tipo_grados || 'Grados'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {nivel.grado_minimo || 1} - {nivel.grado_maximo || 10}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={nivel.tipo_calificacion || 'Cuantitativa'}
                        size="small"
                        color={nivel.tipo_calificacion === 'Cualitativa' ? 'secondary' : 'success'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {nivel.calificacion_final || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={nivel.activo ? 'Activo' : 'Inactivo'}
                        color={nivel.activo ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditNivel(nivel)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteNivel(nivel)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Paginación */}
        {filteredNiveles.length > 0 && (
          <TablePagination
            component="div"
            count={filteredNiveles.length}
            page={nivelPagination.page}
            onPageChange={handleNivelChangePage}
            rowsPerPage={nivelPagination.rowsPerPage}
            onRowsPerPageChange={handleNivelChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        )}

        {/* Alerta informativa */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Nota:</strong> Los niveles educativos definen la estructura académica del colegio.
              Cada nivel puede contener múltiples grados y cursos.
            </Typography>
          </Alert>
        </Box>
      </Paper>

      {/* Gestión de Años Escolares */}
      <Paper sx={{ mb: 2, overflow: 'hidden', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {/* Header con título y botón "Nuevo" */}
        <Box sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="h6" color="primary">
              Gestión de Años Escolares
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAnioEscolarMode(!anioEscolarMode)}
            size="small"
            disabled={saving}
            sx={{ borderRadius: 2 }}
          >
            {anioEscolarMode ? 'Cancelar' : 'Nuevo Año'}
          </Button>
        </Box>

        {/* Formulario de creación */}
        {anioEscolarMode && (
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              Crear Nuevo Año Escolar
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Año"
                  type="number"
                  value={nuevoAnio}
                  onChange={(e) => setNuevoAnio(e.target.value)}
                  placeholder="2025"
                  size="small"
                  inputProps={{ min: 2020, max: 2030 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleCrearAnioEscolar}
                    disabled={!nuevoAnio || saving}
                    startIcon={saving ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                  >
                    {saving ? 'Creando...' : 'Crear'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setAnioEscolarMode(false);
                      setNuevoAnio('');
                    }}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Barra de búsqueda */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            placeholder="Buscar por año o estado..."
            variant="outlined"
            size="small"
            value={anioSearchTerm}
            onChange={handleAnioSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: anioSearchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleAnioClear}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: 400 }}
          />
        </Box>

        {/* Tabla */}
        <TableContainer>
          {aniosEscolares.length === 0 ? (
            <Box sx={{
              p: 4,
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>
                No hay años escolares registrados
              </Typography>
              <Typography variant="body2">
                {anioSearchTerm ? 'No se encontraron años con ese criterio de búsqueda' : 'Comienza creando un nuevo año escolar'}
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell align="center">Año</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Año Actual</TableCell>
                  <TableCell align="center">Fecha de Creación</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAnios.map((anio) => (
                  <TableRow
                    key={anio.id}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                      '&:hover': { backgroundColor: '#e3f2fd' },
                      ...(anio.anio === colegio.anio_escolar_actual && {
                        backgroundColor: '#e3f2fd',
                        borderLeft: '4px solid #1976d2'
                      })
                    }}
                  >
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {anio.anio}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={anio.activo ? 'Activo' : 'Inactivo'}
                        color={anio.activo ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {anio.anio === colegio.anio_escolar_actual ? (
                        <Chip
                          label="Año Actual"
                          color="primary"
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {new Date(anio.created_at).toLocaleDateString('es-ES')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {anio.anio !== colegio.anio_escolar_actual && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleSetAnioActual(anio.anio)}
                            disabled={!anio.activo || saving}
                            sx={{ minWidth: 'auto', px: 1 }}
                          >
                            Establecer Actual
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          color={anio.activo ? 'warning' : 'success'}
                          onClick={() => handleActualizarAnioEscolar(anio.id, !anio.activo)}
                          disabled={saving}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          {anio.activo ? 'Desactivar' : 'Activar'}
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleEliminarAnioEscolar(anio.id)}
                          disabled={saving}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Paginación */}
        {filteredAnios.length > 0 && (
          <TablePagination
            component="div"
            count={filteredAnios.length}
            page={anioPagination.page}
            onPageChange={handleAnioChangePage}
            rowsPerPage={anioPagination.rowsPerPage}
            onRowsPerPageChange={handleAnioChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        )}

        {/* Alerta informativa */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Nota:</strong> Solo puede haber un año escolar actual activo.
              Al establecer un nuevo año como actual, el anterior se desactivará automáticamente.
            </Typography>
          </Alert>
        </Box>
      </Paper>



    </Box>
  );
};

export default ConfiguracionList;
