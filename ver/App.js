import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './pages/Login';
import DocenteLayout from './components/Docente/DocenteLayout';
import AlumnoLayout from './components/Alumno/AlumnoLayout';
import ApoderadoLayout from './components/Apoderado/ApoderadoLayout';
import './App.css';

// Importar páginas de apoderados
import ApoderadoDashboard from './pages/ApoderadoDashboard';
import ApoderadoMiPerfil from './pages/ApoderadoMiPerfil';
import ApoderadoAlumnos from './pages/ApoderadoAlumnos';
import PublicacionesApoderado from './pages/PublicacionesApoderado';
import ApoderadoMensajes from './pages/ApoderadoMensajes';
import ApoderadoEventos from './pages/ApoderadoEventos';
import ApoderadoComunicados from './pages/ApoderadoComunicados';
import ApoderadoAlertas from './pages/ApoderadoAlertas';
import SeleccionHijo from './pages/SeleccionHijo';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('usuario'));
  } catch {
    return null;
  }
}

function getRol(user) {
  return user && user.rol ? user.rol.toLowerCase() : '';
}

function App() {
  const [user, setUser] = React.useState(getUser());

  // Detectar cambios en localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUser());
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar eventos personalizados para la misma ventana
    window.addEventListener('userLogin', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
    };
  }, []);

  const rol = getRol(user);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={rol === 'administrador' ? <Dashboard /> : <Navigate to="/" replace />}
            />
            <Route
              path="/docente/*"
              element={rol === 'docente' ? <DocenteLayout /> : <Navigate to="/" replace />}
            />
            <Route
              path="/alumno/*"
              element={rol === 'alumno' ? <AlumnoLayout /> : <Navigate to="/" replace />}
            />
            <Route
              path="/apoderado/*"
              element={rol === 'apoderado' ? <ApoderadoLayout /> : <Navigate to="/" replace />}
            >
              <Route index element={<Navigate to="/apoderado/dashboard" replace />} />
              <Route path="dashboard" element={<ApoderadoDashboard />} />
              <Route path="mi-perfil" element={<ApoderadoMiPerfil />} />
              <Route path="alumnos" element={<ApoderadoAlumnos />} />
              <Route path="seleccion-hijo" element={<SeleccionHijo />} />
              <Route path="publicaciones" element={<PublicacionesApoderado />} />
              <Route path="mensajes" element={<ApoderadoMensajes />} />
              <Route path="eventos" element={<ApoderadoEventos />} />
              <Route path="comunicados" element={<ApoderadoComunicados />} />
              <Route path="alertas" element={<ApoderadoAlertas />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
