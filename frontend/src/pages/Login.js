import React, { useState, useEffect } from 'react';
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Avatar,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { authService } from '../services/apiService';
import { setToken, setUser } from '../services/authService';
import { getColegioLogoUrl, getFondoLoginUrl } from '../utils/imageUtils';
import { useConfiguracion } from '../contexts/ConfiguracionContext';

const Login = ({ onLogin }) => {
  const { colegio } = useConfiguracion();
  const [formData, setFormData] = useState({
    dni: '',
    clave: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Configuración estática del fondo del login (temporal hasta arreglar BD)
  const loginBackground = {
    tipo: 'color',
    color: '#9c2626',
    imagen: null
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.dni, formData.clave);

      if (response.success) {
        // Guardar token y datos del usuario
        setToken(response.token);
        setUser(response.user);

        // Notificar al componente padre
        onLogin(response.user.rol);
      } else {
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Error de conexión. Verifica tu conexión a internet.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Usar configuración del colegio (Cloudinary o local)
  const backgroundTipo = colegio.background_tipo || loginBackground.tipo;
  const backgroundImagen = getFondoLoginUrl(colegio.background_imagen);
  const backgroundColor = colegio.background_color || loginBackground.color;

  const loginBackgroundSx = backgroundTipo === 'imagen' && backgroundImagen
    ? {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        backgroundImage: `url(${backgroundImagen})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }
    : {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        backgroundColor: backgroundColor,
      };

  return (
    <Box sx={loginBackgroundSx}>
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
              textAlign: 'center',
              py: 4,
            }}
          >
            {colegio.logo ? (
              <Avatar
                src={colegio.logo}
                alt="Logo del colegio"
                sx={{
                  width: 95,
                  height: 95,
                  mx: 'auto',
                  mb: 2,
                  border: '3px solid white',
                }}
              />
            ) : (
              <SchoolIcon sx={{ fontSize: 71, mb: 2 }} />
            )}
                                    <Typography variant="h4" component="h1" gutterBottom>
              {colegio.nombre}
            </Typography>
          </Box>

          {/* Formulario */}
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3, fontSize: '1.2rem' }}>
              Intranet Educativa
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="username"
                autoFocus
                inputProps={{
                  maxLength: 8,
                  pattern: '[0-9]*',
                }}
                helperText="Ingresa tu número de DNI"
              />

              <TextField
                fullWidth
                label="Contraseña"
                name="clave"
                type="password"
                value={formData.clave}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="current-password"
                helperText="Ingresa tu contraseña"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </Box>


          </CardContent>
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
            © 2025 SystemWALA
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
