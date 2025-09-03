import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  School as SchoolIcon
} from '@mui/icons-material';

function Login() {
  const [dni, setDni] = useState('');
  const [clave, setClave] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Primero intentar login normal (admin, docente, alumno)
      let response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, clave }),
      });
      
      let data = await response.json();
      
      // Si el login normal falla, intentar login de apoderado
      if (!response.ok) {
        response = await fetch('http://localhost:4000/api/apoderados/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dni, clave }),
        });
        
        data = await response.json();
        
        if (!response.ok) {
          setError(data.message || 'Credenciales inválidas');
          setLoading(false);
          return;
        }
      }
      
      // Verificar que tenemos los datos necesarios
      if (!data || !data.token) {
        setError('Respuesta inválida del servidor');
        setLoading(false);
        return;
      }
      
      localStorage.setItem('token', data.token);
      
      // Manejar diferentes estructuras de respuesta
      let usuario;
      if (data.usuario) {
        // Estructura de apoderados
        usuario = data.usuario;
      } else if (data.user) {
        // Estructura de usuarios normales
        usuario = data.user;
      } else {
        setError('Datos de usuario no encontrados');
        setLoading(false);
        return;
      }
      
      localStorage.setItem('usuario', JSON.stringify(usuario));
      
      // Disparar evento para que App.js detecte el cambio
      window.dispatchEvent(new Event('userLogin'));
      
      // Redirigir según rol
      const rol = usuario.rol ? usuario.rol.toLowerCase() : '';
      if (rol === 'administrador') {
        window.location.href = '/dashboard';
      } else if (rol === 'docente') {
        window.location.href = '/docente';
      } else if (rol === 'alumno') {
        window.location.href = '/alumno';
      } else if (rol === 'apoderado') {
        window.location.href = '/apoderado';
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError('Error de red o servidor');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f8bbd0 100%)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          minWidth: 340,
          maxWidth: 370,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          background: 'rgba(255,255,255,0.95)'
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2 }}>
          <SchoolIcon sx={{ fontSize: 38 }} />
        </Avatar>
        <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
          Sistema de Gestión Docente
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Inicia sesión con tu DNI y clave
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="DNI"
            variant="outlined"
            margin="normal"
            value={dni}
            onChange={e => setDni(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
            autoFocus
          />
          <TextField
            fullWidth
            label="Clave"
            variant="outlined"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={clave}
            onChange={e => setClave(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2, borderRadius: 2, fontWeight: 'bold', boxShadow: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={26} color="inherit" /> : 'Ingresar'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login; 