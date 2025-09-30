import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Divider,
} from '@mui/material';
import {
  Web as WebIcon,
  Visibility as PreviewIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  PhotoLibrary as GalleryIcon,
  Article as ContentIcon,
  ContactMail as ContactIcon,
  QuestionAnswer as FAQIcon,
  Work as WorkIcon,
  School as LevelsIcon,
  Description as DocumentsIcon,
} from '@mui/icons-material';

const PaginaWebDashboard = () => {
  const [loading, setLoading] = useState(false);

  // Secciones de la página web
  const secciones = [
    {
      id: 'home',
      titulo: 'Página Principal',
      descripcion: 'Hero section, mensaje principal y navegación',
      icono: <WebIcon />,
      color: '#2196F3',
      estado: 'activo',
      ultimaModificacion: '2025-01-16'
    },
    {
      id: 'niveles',
      titulo: 'Niveles Educativos',
      descripcion: 'Inicial, Primaria y Secundaria',
      icono: <LevelsIcon />,
      color: '#4CAF50',
      estado: 'pendiente',
      ultimaModificacion: 'Nunca'
    },
    {
      id: 'documentos',
      titulo: 'Documentos',
      descripcion: 'Requisitos, formularios y documentos',
      icono: <DocumentsIcon />,
      color: '#FF9800',
      estado: 'pendiente',
      ultimaModificacion: 'Nunca'
    },
    {
      id: 'faq',
      titulo: 'Preguntas Frecuentes',
      descripcion: 'FAQ y respuestas comunes',
      icono: <FAQIcon />,
      color: '#9C27B0',
      estado: 'pendiente',
      ultimaModificacion: 'Nunca'
    },
    {
      id: 'trabajo',
      titulo: 'Trabaja con Nosotros',
      descripcion: 'Vacantes y oportunidades laborales',
      icono: <WorkIcon />,
      color: '#607D8B',
      estado: 'pendiente',
      ultimaModificacion: 'Nunca'
    },
    {
      id: 'contacto',
      titulo: 'Contacto',
      descripcion: 'Información de contacto y formulario',
      icono: <ContactIcon />,
      color: '#795548',
      estado: 'pendiente',
      ultimaModificacion: 'Nunca'
    }
  ];

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo': return 'success';
      case 'pendiente': return 'warning';
      case 'inactivo': return 'error';
      default: return 'default';
    }
  };

  const handlePreview = () => {
    // Abrir el HTML de la página web en una nueva ventana
    const previewUrl = '/docs/diseños/header-vanguard-real.html';
    window.open(previewUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const handleEditSeccion = (seccionId) => {
    // TODO: Implementar edición de sección
    console.log('Editar sección:', seccionId);
  };

  const handleConfiguracion = () => {
    // TODO: Implementar configuración general
    console.log('Configuración general');
  };

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<WebIcon color="primary" sx={{ fontSize: 32 }} />}
          title={
            <Typography variant="h4" component="h1" color="primary">
              Gestión de Página Web
            </Typography>
          }
          subheader="Administra el contenido de la página web principal del colegio"
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Ver como va quedando" arrow>
                <Button
                  variant="contained"
                  startIcon={<PreviewIcon />}
                  onClick={handlePreview}
                  size="small"
                  color="primary"
                >
                  Ver como va quedando
                </Button>
              </Tooltip>
              <Tooltip title="Configuración" arrow>
                <IconButton
                  color="primary"
                  onClick={handleConfiguracion}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Estado del proyecto:</strong> En desarrollo. La página principal está en construcción.
            Las demás secciones están pendientes de implementación.
          </Alert>

          <Typography variant="body2" color="text.secondary">
            Gestiona el contenido de tu página web de forma fácil y profesional.
            Cada sección se puede editar independientemente y ver en tiempo real.
          </Typography>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Secciones Activas
              </Typography>
              <Typography variant="h4" color="success.main">
                1
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                En Desarrollo
              </Typography>
              <Typography variant="h4" color="warning.main">
                5
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Última Actualización
              </Typography>
              <Typography variant="body2" color="text.primary">
                Hoy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Estado General
              </Typography>
              <Chip label="En Desarrollo" color="warning" size="small" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Secciones */}
      <Card>
        <CardHeader
          title="Secciones de la Página Web"
          subheader="Gestiona cada sección de tu página web"
        />
        <CardContent>
          <Grid container spacing={2}>
            {secciones.map((seccion) => (
              <Grid item xs={12} sm={6} md={4} key={seccion.id}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: `${seccion.color}20`,
                          color: seccion.color,
                          mr: 2
                        }}
                      >
                        {seccion.icono}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3">
                          {seccion.titulo}
                        </Typography>
                        <Chip
                          label={seccion.estado}
                          color={getEstadoColor(seccion.estado)}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {seccion.descripcion}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      Última modificación: {seccion.ultimaModificacion}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditSeccion(seccion.id)}
                        disabled={seccion.estado === 'pendiente'}
                        fullWidth
                      >
                        {seccion.estado === 'pendiente' ? 'Próximamente' : 'Editar'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaginaWebDashboard;


