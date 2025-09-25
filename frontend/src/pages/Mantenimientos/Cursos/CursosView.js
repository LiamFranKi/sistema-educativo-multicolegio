import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const CursosView = ({ open, onClose, curso }) => {
  if (!curso) return null;

  // Función para construir URL de imagen
  const getImageUrl = (imagen) => {
    if (!imagen) return '/default-course.png';
    return `http://localhost:5000/uploads/${imagen}`;
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h6">
            Detalle del Curso
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Columna izquierda - Información principal */}
          <Grid item xs={12} md={8}>
            {/* Información básica */}
            <Card sx={{ mb: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{
                  color: '#1976d2',
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  {curso.nombre}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Abreviatura
                      </Typography>
                      <Chip
                        label={curso.abreviatura}
                        color="primary"
                        variant="outlined"
                        size="medium"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Nivel Educativo
                      </Typography>
                      <Chip
                        label={curso.nivel_nombre}
                        color="secondary"
                        size="medium"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Estado
                      </Typography>
                      <Chip
                        icon={curso.activo ? <CheckCircleIcon /> : <CancelIcon />}
                        label={curso.activo ? 'Activo' : 'Inactivo'}
                        color={curso.activo ? 'success' : 'error'}
                        size="medium"
                      />
                    </Box>
                  </Grid>
                </Grid>

                {curso.descripcion && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Descripción
                      </Typography>
                      <Typography variant="body1" sx={{
                        lineHeight: 1.6,
                        backgroundColor: '#f8f9fa',
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid #e9ecef'
                      }}>
                        {curso.descripcion}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Información de fechas */}
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{
                  color: '#1976d2',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <CalendarIcon sx={{ mr: 1 }} />
                  Información del Sistema
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Fecha de Creación
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(curso.created_at)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Última Actualización
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(curso.updated_at)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Columna derecha - Imagen y detalles visuales */}
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 2, height: 'fit-content' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                  Imagen del Curso
                </Typography>

                <Avatar
                  src={getImageUrl(curso.imagen)}
                  alt={curso.nombre}
                  sx={{
                    width: 150,
                    height: 150,
                    mx: 'auto',
                    mb: 2,
                    border: '4px solid #e0e0e0',
                    boxShadow: 3
                  }}
                />

                {!curso.imagen && (
                  <Typography variant="caption" color="text.secondary">
                    Imagen por defecto
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card sx={{ boxShadow: 2, mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                  Detalles Adicionales
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    ID del Curso
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5',
                    p: 1,
                    borderRadius: 1
                  }}>
                    #{curso.id}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    ID del Nivel
                  </Typography>
                  <Typography variant="body2" sx={{
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5',
                    p: 1,
                    borderRadius: 1
                  }}>
                    #{curso.nivel_id}
                  </Typography>
                </Box>

                {curso.imagen && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Archivo de Imagen
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontFamily: 'monospace',
                      backgroundColor: '#f5f5f5',
                      p: 1,
                      borderRadius: 1,
                      wordBreak: 'break-all'
                    }}>
                      {curso.imagen}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CursosView;


