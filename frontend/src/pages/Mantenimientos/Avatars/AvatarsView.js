import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Face as FaceIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { getImageUrl } from '../../../utils/imageUtils';

const AvatarsView = ({ open, onClose, avatar, onEdit }) => {
  // Función para obtener el color del nivel
  const getNivelColor = (nivel) => {
    if (nivel <= 5) return 'success';
    if (nivel <= 10) return 'info';
    if (nivel <= 15) return 'warning';
    return 'error';
  };

  // Función para obtener el color del estado
  const getEstadoColor = (activo) => {
    return activo ? 'success' : 'default';
  };

  // Función para formatear fecha
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

  // Función para obtener el rango de nivel
  const getNivelRange = (nivel) => {
    if (nivel <= 5) return 'Principiante';
    if (nivel <= 10) return 'Intermedio';
    if (nivel <= 15) return 'Avanzado';
    return 'Experto';
  };

  // Función para obtener el color del rango
  const getRangoColor = (nivel) => {
    if (nivel <= 5) return '#4caf50';
    if (nivel <= 10) return '#2196f3';
    if (nivel <= 15) return '#ff9800';
    return '#f44336';
  };

  if (!avatar) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Avatar
          src={getImageUrl(avatar.imagen, 'avatars')}
          sx={{ width: 48, height: 48 }}
        >
          <FaceIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h6" component="span">
            {avatar.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary" display="block">
            {getNivelRange(avatar.nivel)} - Nivel {avatar.nivel}
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          {onEdit && (
            <IconButton onClick={() => onEdit(avatar)} color="primary">
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Información Principal */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Información Principal"
                avatar={<FaceIcon color="primary" />}
                sx={{ backgroundColor: '#f8f9fa' }}
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Nombre del Avatar
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {avatar.nombre}
                  </Typography>
                </Box>

                {avatar.descripcion && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Descripción
                    </Typography>
                    <Typography variant="body2">
                      {avatar.descripcion}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Género
                  </Typography>
                  <Chip
                    label={avatar.genero}
                    color={avatar.genero === 'Masculino' ? 'primary' : 'secondary'}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Estado
                  </Typography>
                  <Chip
                    label={avatar.activo ? 'Activo' : 'Inactivo'}
                    color={getEstadoColor(avatar.activo)}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Información del Sistema Gamificado */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Sistema Gamificado"
                avatar={<TrophyIcon color="secondary" />}
                sx={{ backgroundColor: '#f8f9fa' }}
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Nivel
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`Nivel ${avatar.nivel}`}
                      color={getNivelColor(avatar.nivel)}
                      size="small"
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: getRangoColor(avatar.nivel),
                        fontWeight: 'medium'
                      }}
                    >
                      {getNivelRange(avatar.nivel)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Puntos Requeridos
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                    <Typography variant="h6" fontWeight="bold" color="#ff9800">
                      {avatar.puntos.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      puntos
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Progresión
                  </Typography>
                  <Box sx={{
                    width: '100%',
                    height: 8,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      width: `${(avatar.nivel / 20) * 100}%`,
                      height: '100%',
                      backgroundColor: getRangoColor(avatar.nivel),
                      transition: 'width 0.3s ease'
                    }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {avatar.nivel} de 20 niveles
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Imagen del Avatar */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Imagen del Avatar"
                avatar={<SchoolIcon color="info" />}
                sx={{ backgroundColor: '#f8f9fa' }}
              />
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Paper
                    elevation={2}
                    sx={{
                      display: 'inline-block',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <Avatar
                      src={getImageUrl(avatar.imagen, 'avatars')}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        border: '3px solid #e0e0e0'
                      }}
                    >
                      <FaceIcon sx={{ fontSize: 60 }} />
                    </Avatar>
                  </Paper>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Imagen del avatar para el sistema gamificado
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Información del Sistema */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Información del Sistema"
                avatar={<CalendarIcon color="action" />}
                sx={{ backgroundColor: '#f8f9fa' }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Fecha de Creación
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(avatar.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UpdateIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Última Actualización
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(avatar.updated_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        {onEdit && (
          <Button onClick={() => onEdit(avatar)} variant="contained" startIcon={<EditIcon />}>
            Editar Avatar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AvatarsView;
