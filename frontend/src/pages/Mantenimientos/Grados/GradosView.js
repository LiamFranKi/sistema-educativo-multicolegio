import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Avatar
} from '@mui/material';
import {
  Close as CloseIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  Sort as SortIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon
} from '@mui/icons-material';

const GradosView = ({ grado, nivelNombre, onClose }) => {
  if (!grado) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={grado.foto && grado.foto !== 'default-grado.png' ?
              `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${grado.foto}` :
              null
            }
            sx={{ width: 60, height: 60, fontSize: '1.8rem' }}
          >
            {(!grado.foto || grado.foto === 'default-grado.png') && (grado.nombre ? grado.nombre.charAt(0).toUpperCase() : 'G')}
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              {grado.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detalles del grado educativo
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Grid container spacing={3}>
          {/* Información Principal */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Información Principal"
                avatar={<SchoolIcon color="primary" />}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <CodeIcon color="action" fontSize="small" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Código:
                      </Typography>
                    </Box>
                    <Chip
                      label={grado.codigo}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <SchoolIcon color="action" fontSize="small" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Nivel:
                      </Typography>
                    </Box>
                    <Chip
                      label={nivelNombre}
                      color="secondary"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <SortIcon color="action" fontSize="small" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Orden:
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="medium">
                      {grado.orden}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {grado.activo ? (
                        <ToggleOnIcon color="success" fontSize="small" />
                      ) : (
                        <ToggleOffIcon color="disabled" fontSize="small" />
                      )}
                      <Typography variant="subtitle2" color="text.secondary">
                        Estado:
                      </Typography>
                    </Box>
                    <Chip
                      label={grado.activo ? 'Activo' : 'Inactivo'}
                      color={grado.activo ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Descripción */}
          {grado.descripcion && (
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Descripción"
                  avatar={<SchoolIcon color="primary" />}
                />
                <CardContent>
                  <Typography variant="body1">
                    {grado.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Información de Auditoría */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Información de Auditoría"
                avatar={<CalendarIcon color="primary" />}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Fecha de Creación:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(grado.created_at)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Última Actualización:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(grado.updated_at)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          variant="outlined"
        >
          Cerrar
        </Button>
      </DialogActions>
    </>
  );
};

export default GradosView;
