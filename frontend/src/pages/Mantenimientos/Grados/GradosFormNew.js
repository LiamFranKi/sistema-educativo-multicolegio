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
  Grid,
  CircularProgress,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Folder as FolderIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { gradosService, fileService } from '../../../services/apiService';
import Swal from 'sweetalert2';
import { getImageUrl } from '../../../utils/imageUtils';

// Función para formatear el nombre del grado
const getGradoFormattedName = (numero, tipoGrados) => {
  if (tipoGrados === 'Años') {
    const numeroFormateado = numero.toString().padStart(2, '0');
    return `${numeroFormateado} años`;
  } else if (tipoGrados === 'Grados') {
    return `${numero}° grado`;
  }
  return numero.toString();
};

const GradosFormNew = ({ grado, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nivel_id: '',
    numero_grado: '',
    seccion: '',
    anio_escolar: '',
    descripcion: '',
    direccion_archivos: '',
    link_aula_virtual: '',
    foto: 'default-grado.png'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState('');

  // Estados para datos de referencia
  const [niveles, setNiveles] = useState([]);
  const [gradosOptions, setGradosOptions] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [aniosEscolares, setAniosEscolares] = useState([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null);

  const isEdit = Boolean(grado);

  // Cargar datos iniciales siempre
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar datos del grado específico cuando se abre para editar
  useEffect(() => {
    const loadGradoData = async () => {
      if (!grado) return;

      try {
        console.log('Cargando datos del grado para editar:', grado);

        // Cargar grados para el nivel del grado existente PRIMERO
        if (grado.nivel_id) {
          await loadGradosPorNivel(grado.nivel_id);
        }

        // Luego cargar los datos del grado
        setFormData({
          nivel_id: grado.nivel_id || '',
          numero_grado: grado.numero_grado || '',
          seccion: grado.seccion || '',
          anio_escolar: grado.anio_escolar || '',
          descripcion: grado.descripcion || '',
          direccion_archivos: grado.direccion_archivos || '',
          link_aula_virtual: grado.link_aula_virtual || '',
          foto: grado.foto || 'default-grado.png'
        });

        // Establecer imagen de vista previa si existe
        if (grado.foto && grado.foto !== 'default-grado.png') {
          const imageUrl = getImageUrl(grado.foto);
          console.log('URL de imagen construida:', imageUrl);
          setPreviewImage(imageUrl);
        }

      } catch (error) {
        console.error('Error cargando datos del grado:', error);
      }
    };

    if (grado) {
      loadGradoData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grado]);

  const loadInitialData = async () => {
    try {
      console.log('Cargando datos iniciales del formulario de grados...');

      const [nivelesRes, seccionesRes, aniosRes] = await Promise.all([
        gradosService.getNivelesDisponibles(),
        gradosService.getSeccionesDisponibles(),
        gradosService.getAniosEscolares()
      ]);

      console.log('Respuestas de la API:', { nivelesRes, seccionesRes, aniosRes });

      setNiveles(nivelesRes || []);
      setSecciones(seccionesRes || []);
      setAniosEscolares(aniosRes || []);

      // Establecer valores por defecto válidos solo si no estamos editando
      if (!grado) {
        const seccionesDisponibles = seccionesRes || [];
        const aniosDisponibles = aniosRes || [];

        setFormData(prev => ({
          ...prev,
          seccion: seccionesDisponibles.length > 0 ? seccionesDisponibles[0].value : '',
          anio_escolar: aniosDisponibles.length > 0 ? aniosDisponibles[0].anio : ''
        }));
      }

    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      // Asegurar que los arrays no sean undefined
      setNiveles([]);
      setSecciones([]);
      setAniosEscolares([]);

      // Limpiar valores del formulario para evitar warnings MUI
      setFormData(prev => ({
        ...prev,
        seccion: '',
        anio_escolar: ''
      }));

      Swal.fire('Error', 'Error cargando datos iniciales', 'error');
    }
  };


  const loadGradosPorNivel = async (nivelId) => {
    try {
      const gradosOptions = await gradosService.getGradosPorNivel(nivelId);
      setGradosOptions(gradosOptions);

      // Buscar el nivel seleccionado en el array de niveles
      const nivel = niveles.find(n => n.id === parseInt(nivelId));
      setNivelSeleccionado(nivel);
    } catch (error) {
      console.error('Error cargando grados por nivel:', error);
      setGradosOptions([]);
      setNivelSeleccionado(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar errores del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleNivelChange = async (nivelId) => {
    handleInputChange('nivel_id', nivelId);
    handleInputChange('numero_grado', ''); // Limpiar selección de grado

    if (nivelId) {
      await loadGradosPorNivel(nivelId);
    } else {
      setGradosOptions([]);
      setNivelSeleccionado(null);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Por favor selecciona un archivo de imagen válido', 'error');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'La imagen debe ser menor a 5MB', 'error');
      return;
    }

    try {
      setLoading(true);

      // Subir archivo
      const uploadResponse = await fileService.uploadFile(file, 'grados');

      // Actualizar estado
      handleInputChange('foto', uploadResponse.filename);
      setPreviewImage(URL.createObjectURL(file));

      Swal.fire('Éxito', 'Imagen subida correctamente', 'success');

    } catch (error) {
      console.error('Error subiendo imagen:', error);
      Swal.fire('Error', 'Error subiendo la imagen', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nivel_id) {
      newErrors.nivel_id = 'El nivel es requerido';
    }

    if (!formData.numero_grado) {
      newErrors.numero_grado = 'El grado es requerido';
    }

    if (!formData.seccion) {
      newErrors.seccion = 'La sección es requerida';
    }

    if (!formData.anio_escolar) {
      newErrors.anio_escolar = 'El año escolar es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await gradosService.updateGrado(grado.id, formData);
        Swal.fire('Éxito', 'Grado actualizado correctamente', 'success');
      } else {
        await gradosService.createGrado(formData);
        Swal.fire('Éxito', 'Grado creado correctamente', 'success');
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error('Error guardando grado:', error);
      const message = error.response?.data?.message || 'Error guardando el grado';
      Swal.fire('Error', message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = () => {
    if (previewImage) return previewImage;
    if (formData.foto && formData.foto !== 'default-grado.png') {
      return `${process.env.REACT_APP_API_URL}/uploads/${formData.foto}`;
    }
    return null;
  };

  return (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SchoolIcon color="primary" />
          <Typography variant="h6">
            {isEdit ? 'Editar Grado' : 'Nuevo Grado'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Selección de Nivel */}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.nivel_id}>
              <InputLabel id="nivel-label">Nivel Educativo *</InputLabel>
              <Select
                labelId="nivel-label"
                value={formData.nivel_id}
                onChange={(e) => handleNivelChange(e.target.value)}
                label="Nivel Educativo *"
              >
                {(niveles || []).map((nivel) => (
                  <MenuItem key={nivel.id} value={nivel.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ClassIcon fontSize="small" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {nivel.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {nivel.tipo_grados} ({nivel.grado_minimo} - {nivel.grado_maximo})
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.nivel_id && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.nivel_id}
              </Typography>
            )}
          </Grid>

          {/* Selección de Grado */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.numero_grado} disabled={!formData.nivel_id}>
              <InputLabel id="grado-label">Grado *</InputLabel>
              <Select
                labelId="grado-label"
                value={formData.numero_grado}
                onChange={(e) => handleInputChange('numero_grado', e.target.value)}
                label="Grado *"
              >
                {(gradosOptions || []).map((grado) => (
                  <MenuItem key={grado.value} value={grado.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon fontSize="small" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {grado.label}
                        </Typography>
                        {isEdit && grado.value === formData.numero_grado && (
                          <Typography variant="caption" color="text.secondary">
                            Grado actual
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.numero_grado && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.numero_grado}
              </Typography>
            )}
          </Grid>


          {/* Selección de Sección */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.seccion}>
              <InputLabel id="seccion-label">Sección *</InputLabel>
              <Select
                labelId="seccion-label"
                value={formData.seccion}
                onChange={(e) => handleInputChange('seccion', e.target.value)}
                label="Sección *"
              >
                {(secciones || []).map((seccion) => (
                  <MenuItem key={seccion.value} value={seccion.value}>
                    {seccion.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.seccion && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.seccion}
              </Typography>
            )}
          </Grid>

          {/* Año Escolar */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.anio_escolar}>
              <InputLabel id="anio-label">Año Escolar *</InputLabel>
              <Select
                labelId="anio-label"
                value={formData.anio_escolar}
                onChange={(e) => handleInputChange('anio_escolar', e.target.value)}
                label="Año Escolar *"
              >
                {(aniosEscolares || []).map((anio) => (
                  <MenuItem key={anio.anio} value={anio.anio}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={anio.anio === new Date().getFullYear() ? 'bold' : 'normal'}>
                        {anio.anio}
                      </Typography>
                      {anio.anio === new Date().getFullYear() && (
                        <Chip label="Actual" size="small" color="primary" />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.anio_escolar && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {errors.anio_escolar}
              </Typography>
            )}
          </Grid>

          {/* Descripción */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              multiline
              rows={2}
              placeholder="Descripción opcional del grado"
            />
          </Grid>

          <Divider sx={{ my: 2, width: '100%' }} />

          {/* Dirección de Archivos */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dirección de Archivos"
              value={formData.direccion_archivos}
              onChange={(e) => handleInputChange('direccion_archivos', e.target.value)}
              placeholder="Ruta o URL de archivos del grado"
              InputProps={{
                startAdornment: <FolderIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          {/* Link Aula Virtual */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Link Aula Virtual"
              value={formData.link_aula_virtual}
              onChange={(e) => handleInputChange('link_aula_virtual', e.target.value)}
              placeholder="URL del aula virtual"
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>

          <Divider sx={{ my: 2, width: '100%' }} />

          {/* Foto del Grado */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Foto del Grado
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={getImageSrc()}
                sx={{ width: 80, height: 80, border: '2px solid #e0e0e0' }}
              >
                {formData.numero_grado ?
                  (nivelSeleccionado?.tipo_grados === 'Años' ?
                    `${formData.numero_grado.toString().padStart(2, '0')}` :
                    `${formData.numero_grado}°`) :
                  'G'
                }
              </Avatar>
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="foto-upload"
                  type="file"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
                <label htmlFor="foto-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                    disabled={loading}
                    size="small"
                  >
                    {loading ? 'Subiendo...' : 'Subir Foto'}
                  </Button>
                </label>
                <Typography variant="caption" display="block" color="text.secondary">
                  JPG, PNG o GIF (máx. 5MB)
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          startIcon={<CancelIcon />}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
        </Button>
      </DialogActions>
    </>
  );
};

export default GradosFormNew;
