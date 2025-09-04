import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ConfiguracionProvider, useConfiguracion } from './contexts/ConfiguracionContext';
import { DynamicThemeProvider } from './contexts/ThemeContext';

// Componentes de Layout
import Login from './pages/Login';
import AdminLayout from './components/Layout/AdminLayout';
import DocenteLayout from './components/Layout/DocenteLayout';
import AlumnoLayout from './components/Layout/AlumnoLayout';
import ApoderadoLayout from './components/Layout/ApoderadoLayout';

// Servicios
import { getToken, getUserRole, removeToken } from './services/authService';

// Componente interno que usa el contexto
function AppContent() {
  const { colegio } = useConfiguracion();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const role = getUserRole();

      if (token && role) {
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        removeToken();
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    removeToken();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Cargando...
      </Box>
    );
  }


  // Renderizar layout según el rol del usuario
  const renderLayout = () => {
    switch (userRole) {
      case 'Administrador':
        return <AdminLayout onLogout={handleLogout} />;
      case 'Docente':
        return <DocenteLayout onLogout={handleLogout} />;
      case 'Alumno':
        return <AlumnoLayout onLogout={handleLogout} />;
      case 'Apoderado':
        return <ApoderadoLayout onLogout={handleLogout} />;
      case 'Tutor':
        return <DocenteLayout onLogout={handleLogout} />; // Los tutores usan el layout de docente
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAuthenticated ? <Login onLogin={handleLogin} /> : renderLayout()}
    </Box>
  );
}

function App() {
  return (
    <ConfiguracionProvider>
      <DynamicThemeProvider>
        <AppContent />
      </DynamicThemeProvider>
    </ConfiguracionProvider>
  );
}

export default App;
