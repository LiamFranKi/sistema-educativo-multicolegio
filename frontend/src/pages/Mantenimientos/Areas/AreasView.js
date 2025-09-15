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
  Category as CategoryIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const AreasView = ({ area, onClose }) => {
  if (!area) return null;

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
            sx={{
              width: 60,
              height: 60,
              fontSize: '1.8rem',
              bgcolor: 'primary.main'
            }}
          >
            <CategoryIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div">
              {area.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detalles del área educativa
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
                avatar={<CategoryIcon color="primary" />}
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
                      label={area.codigo}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {area.estado === 'activo' ? (
                        <ToggleOnIcon color="success" fontSize="small" />
                      ) : (
                        <ToggleOffIcon color="disabled" fontSize="small" />
                      )}
                      <Typography variant="subtitle2" color="text.secondary">
                        Estado:
                      </Typography>
                    </Box>
                    <Chip
                      label={area.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      color={area.estado === 'activo' ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Descripción */}
          {area.descripcion && (
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Descripción"
                  avatar={<DescriptionIcon color="primary" />}
                />
                <CardContent>
                  <Typography variant="body1">
                    {area.descripcion}
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
                      {formatDate(area.created_at)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Última Actualización:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(area.updated_at)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      ID del Área:
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      #{area.id}
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

export default AreasView;
