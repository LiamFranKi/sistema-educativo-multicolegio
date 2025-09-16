import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Security as SecurityIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const UsuarioPermisosForm = ({ open, onClose, onSave, usuario }) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    clave: '',
    confirmar_clave: '',
    rol: 'Docente'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    clave: false,
    confirmar_clave: false
  });

  // Roles permitidos
  const roles = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Docente', label: 'Docente' },
    { value: 'Alumno', label: 'Alumno' },
    { value: 'Apoderado', label: 'Apoderado' },
    { value: 'Tutor', label: 'Tutor' },
    { value: 'Psicologia', label: 'Psicología' },
    { value: 'Secretaria', label: 'Secretaría' },
    { value: 'Director', label: 'Director' },
    { value: 'Promotor', label: 'Promotor' }
  ];

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    console.log('UsuarioPermisosForm - useEffect:', { open, usuario });
    if (open && usuario) {
      setFormData({
        clave: '',
        confirmar_clave: '',
        rol: usuario.rol || 'Docente'
      });
      setErrors({});
    }
  }, [open, usuario]);

  // Función para manejar cambios en los campos
  const handleChange = useCallback((field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  // Función para alternar visibilidad de contraseñas
  const togglePasswordVisibility = useCallback((field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar contraseña solo si se proporciona
    if (formData.clave && formData.clave.length < 6) {
      newErrors.clave = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña solo si se proporciona contraseña
    if (formData.clave && !formData.confirmar_clave) {
      newErrors.confirmar_clave = 'Debe confirmar la contraseña';
    } else if (formData.clave && formData.confirmar_clave && formData.clave !== formData.confirmar_clave) {
      newErrors.confirmar_clave = 'Las contraseñas no coinciden';
    }

    // Validar rol
    if (!formData.rol) {
      newErrors.rol = 'El rol es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    try {
      // Preparar datos para enviar
      const dataToSend = {
        rol: formData.rol
      };

      // Solo agregar contraseña si se proporciona
      if (formData.clave && formData.clave.trim() !== '') {
        dataToSend.clave = formData.clave;
      }

      console.log('Enviando datos de permisos:', dataToSend);
      await onSave(usuario.id, dataToSend);
    } catch (error) {
      console.error('Error actualizando permisos:', error);
    } finally {
      setLoading(false);
    }
  }, [formData, usuario, onSave]);

  // Función para cerrar el modal
  const handleClose = useCallback(() => {
    setFormData({
      clave: '',
      confirmar_clave: '',
      rol: 'Docente'
    });
    setErrors({});
    setShowPasswords({
      clave: false,
      confirmar_clave: false
    });
    onClose();
  }, [onClose]);

  if (!usuario) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{
        p: 3,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          <Typography variant="h6" component="span" color="primary">
            Gestionar Permisos: {usuario.nombres} {usuario.apellidos}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Contenido */}
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Información del usuario */}
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Usuario:</strong> {usuario.nombres} {usuario.apellidos}<br/>
              <strong>DNI:</strong> {usuario.dni}<br/>
              <strong>Email:</strong> {usuario.email}
            </Typography>
          </Alert>

          {/* Campo Rol */}
          <FormControl fullWidth error={!!errors.rol} required>
            <InputLabel id="permisos-rol-label">Rol del Usuario</InputLabel>
            <Select
              id="permisos-rol"
              name="rol"
              labelId="permisos-rol-label"
              value={formData.rol}
              onChange={handleChange('rol')}
              label="Rol del Usuario"
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
            {errors.rol && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {errors.rol}
              </Typography>
            )}
          </FormControl>

          {/* Campo Nueva Contraseña */}
          <TextField
            fullWidth
            label="Nueva Contraseña"
            id="permisos-clave"
            name="clave"
            type={showPasswords.clave ? 'text' : 'password'}
            value={formData.clave}
            onChange={handleChange('clave')}
            error={!!errors.clave}
            helperText={errors.clave || 'Opcional - Dejar en blanco para mantener la contraseña actual'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('clave')}
                    edge="end"
                  >
                    {showPasswords.clave ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {/* Campo Confirmar Contraseña */}
          <TextField
            fullWidth
            label="Confirmar Nueva Contraseña"
            id="permisos-confirmar-clave"
            name="confirmar_clave"
            type={showPasswords.confirmar_clave ? 'text' : 'password'}
            value={formData.confirmar_clave}
            onChange={handleChange('confirmar_clave')}
            error={!!errors.confirmar_clave}
            helperText={errors.confirmar_clave || 'Solo si cambias la contraseña'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirmar_clave')}
                    edge="end"
                  >
                    {showPasswords.confirmar_clave ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

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
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
          sx={{ borderRadius: 2 }}
        >
          {loading ? 'Actualizando...' : 'Actualizar Permisos'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(UsuarioPermisosForm);
