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
  CardHeader
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import QRCode from 'react-qr-code';

const UsuarioView = ({ open, onClose, usuario, onEdit }) => {
  // Función para obtener el color del rol
  const getRoleColor = (rol) => {
    const colors = {
      'Administrador': 'primary',
      'Docente': 'secondary',
      'Alumno': 'success',
      'Apoderado': 'warning',
      'Tutor': 'info',
      'Psicologia': 'info',
      'Secretaria': 'warning',
      'Director': 'secondary',
      'Promotor': 'primary'
    };
    return colors[rol] || 'default';
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // Función para formatear fecha de creación
  const formatCreatedDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para construir URL de imagen
  const getImageUrl = (filename) => {
    if (!filename) return null;
    // Si ya es una URL completa (Cloudinary o cualquier otra), devolverla tal como está
    if (filename.startsWith('http')) return filename;
    // Construir URL del servidor local (fallback para imágenes antiguas)
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${filename}`;
  };

  if (!usuario) return null;

  const age = calculateAge(usuario.fecha_nacimiento);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      {/* Header del modal */}
      <DialogTitle sx={{
        p: 3,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" component="span" color="primary">
          Información del Usuario
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Contenido */}
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Sección de foto y datos básicos */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={getImageUrl(usuario.foto)}
                sx={{ width: 100, height: 100, fontSize: '2rem' }}
              >
                {(usuario.nombres?.charAt(0) || '') + (usuario.apellidos?.charAt(0) || '')}
              </Avatar>
              {usuario.qr_code && (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <Box sx={{
                    p: 1,
                    bgcolor: 'white',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <QRCode
                      value={usuario.qr_code}
                      size={60}
                      style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    QR
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {usuario.nombres} {usuario.apellidos}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                <Chip
                  label={usuario.rol}
                  color={getRoleColor(usuario.rol)}
                  variant="outlined"
                  size="medium"
                />
                <Chip
                  label={usuario.activo ? 'Activo' : 'Inactivo'}
                  color={usuario.activo ? 'success' : 'error'}
                  size="medium"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                DNI: {usuario.dni}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Información detallada */}
          <Grid container spacing={3}>

            {/* Información personal */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Información Personal
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nombres
                  </Typography>
                  <Typography variant="body1">
                    {usuario.nombres}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Apellidos
                  </Typography>
                  <Typography variant="body1">
                    {usuario.apellidos || 'No especificados'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    DNI
                  </Typography>
                  <Typography variant="body1">
                    {usuario.dni}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {usuario.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1">
                    {usuario.telefono || 'No especificado'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de nacimiento
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(usuario.fecha_nacimiento)}
                    {age && (
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({age} años)
                      </Typography>
                    )}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dirección
                  </Typography>
                  <Typography variant="body1">
                    {usuario.direccion || 'No especificada'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Género
                  </Typography>
                  <Typography variant="body1">
                    {usuario.genero || 'No especificado'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Estado Civil
                  </Typography>
                  <Typography variant="body1">
                    {usuario.estado_civil || 'No especificado'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Profesión
                  </Typography>
                  <Typography variant="body1">
                    {usuario.profesion || 'No especificada'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Información del sistema */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                Información del Sistema
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rol
                  </Typography>
                  <Chip
                    label={usuario.rol}
                    color={getRoleColor(usuario.rol)}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Estado
                  </Typography>
                  <Chip
                    label={usuario.activo ? 'Activo' : 'Inactivo'}
                    color={usuario.activo ? 'success' : 'error'}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de registro
                  </Typography>
                  <Typography variant="body1">
                    {formatCreatedDate(usuario.created_at)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Última actualización
                  </Typography>
                  <Typography variant="body1">
                    {formatCreatedDate(usuario.updated_at)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    ID del usuario
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                    #{usuario.id}
                  </Typography>
                </Box>

                {usuario.qr_code && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Código QR
                    </Typography>
                    <Typography variant="body1" sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: 'primary.main',
                      fontWeight: 'medium',
                      mb: 1
                    }}>
                      {usuario.qr_code}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

          </Grid>


        </Box>
      </DialogContent>

      {/* Footer con botones */}
      <DialogActions sx={{
        p: 3,
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        gap: 1
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cerrar
        </Button>
        <Button
          onClick={() => onEdit(usuario)}
          variant="contained"
          startIcon={<EditIcon />}
          sx={{ borderRadius: 2 }}
        >
          Editar Usuario
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioView;
