import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Chip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { webAdminApi } from '../../services/apiService';

const PaginaWebForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    slug: '',
    titulo: '',
    estado: 'borrador',
  });

  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (isEdit) {
      cargarPagina();
    }
  }, [id]);

  const cargarPagina = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await webAdminApi.getPageById(id);
      const pagina = response.data.data;

      setFormData({
        slug: pagina.slug || '',
        titulo: pagina.titulo || '',
        estado: pagina.estado || 'borrador',
      });

      setSections(pagina.sections || []);
    } catch (err) {
      console.error('Error cargando página:', err);
      setError('Error al cargar la página');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.slug || !formData.titulo) {
      setError('Slug y título son requeridos');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (isEdit) {
        await webAdminApi.updatePage(id, formData);
      } else {
        await webAdminApi.createPage(formData);
      }

      navigate('/dashboard/pagina-web/paginas');
    } catch (err) {
      console.error('Error guardando página:', err);
      setError(err.response?.data?.message || 'Error al guardar la página');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSection = (sectionId) => {
    navigate(`/dashboard/pagina-web/paginas/${id}/seccion/${sectionId}`);
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
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <IconButton onClick={() => navigate('/dashboard/pagina-web/paginas')}>
              <BackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" color="primary">
              {isEdit ? 'Editar Página' : 'Nueva Página'}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Formulario Principal */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Información General
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Título"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  disabled={saving}
                  helperText="Nombre descriptivo de la página"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  disabled={saving || (isEdit && formData.slug === 'home')}
                  helperText="URL amigable (ej: contacto, niveles)"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    disabled={saving}
                    label="Estado"
                  >
                    <MenuItem value="borrador">Borrador</MenuItem>
                    <MenuItem value="publicado">Publicado</MenuItem>
                    <MenuItem value="archivado">Archivado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard/pagina-web/paginas')}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar Página'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Secciones (solo si es edición) */}
      {isEdit && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Secciones de la Página ({sections.length})
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/dashboard/pagina-web/paginas/${id}/seccion/nueva`)}
              >
                Nueva Sección
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {sections.length === 0 ? (
              <Alert severity="info">
                Esta página no tiene secciones aún. Haz clic en "Nueva Sección" para agregar contenido.
              </Alert>
            ) : (
              sections.map((section) => (
                <Accordion key={section.id} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <Typography sx={{ flexGrow: 1 }}>
                        <strong>{section.titulo}</strong>
                      </Typography>
                      <Chip label={section.layout} size="small" />
                      <Chip label={`${section.blocks?.length || 0} bloques`} size="small" color="primary" />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Key:</strong> {section.key}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Layout:</strong> {section.layout}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Orden:</strong> {section.orden}
                      </Typography>

                      <Box display="flex" gap={1} mt={2}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditSection(section.id)}
                        >
                          Editar Contenido
                        </Button>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PaginaWebForm;
