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

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    dni: '',
    clave: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collegeData, setCollegeData] = useState({
    nombre: 'Sistema Educativo',
    logo: null
  });

  // Cargar datos del colegio
  useEffect(() => {
    const loadCollegeData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/colegios', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const colegio = data[0];
            setCollegeData({
              nombre: colegio.nombre || 'Sistema Educativo',
              logo: colegio.logo || null
            });
          }
        }
      } catch (error) {
        console.log('Error cargando datos del colegio:', error);
        // Mantener valores por defecto
      }
    };

    loadCollegeData();
  }, []);

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
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
            {collegeData.logo ? (
              <Avatar
                src={collegeData.logo}
                alt="Logo del colegio"
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  border: '3px solid white',
                }}
              />
            ) : (
              <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
            )}
            <Typography variant="h4" component="h1" gutterBottom>
              {collegeData.nombre}
            </Typography>
          </Box>

          {/* Formulario */}
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
              Iniciar Sesión
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
