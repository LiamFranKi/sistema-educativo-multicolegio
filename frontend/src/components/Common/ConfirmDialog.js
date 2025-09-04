import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import {
  Warning as WarningIcon
} from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Está seguro de que desea realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning" // warning, error, info
}) => {

  // Función para obtener el color según el tipo
  const getTypeColor = (type) => {
    const colors = {
      'warning': 'warning',
      'error': 'error',
      'info': 'info'
    };
    return colors[type] || 'warning';
  };

  // Función para obtener el icono según el tipo
  const getTypeIcon = (type) => {
    return <WarningIcon />; // Por ahora usamos el mismo icono para todos
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: `${getTypeColor(type)}.light`,
              color: `${getTypeColor(type)}.main`,
              mb: 2
            }}
          >
            {React.cloneElement(getTypeIcon(type), {
              sx: { fontSize: 40 }
            })}
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        justifyContent: 'center',
        gap: 2
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getTypeColor(type)}
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
