import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton, Typography, useTheme, useMediaQuery, Badge, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useConfiguracion } from '../../contexts/ConfiguracionContext';
import { UserProvider } from '../../contexts/UserContext';

// Páginas del Administrador
import AdminDashboard from '../../pages/Admin/AdminDashboard';
import UsuariosList from '../../pages/Mantenimientos/Usuarios/UsuariosList';
import ConfiguracionList from '../../pages/Configuracion/ConfiguracionList';
import { GradosList } from '../../pages/Mantenimientos/Grados';
import { AreasList } from '../../pages/Mantenimientos/Areas';
import AvatarsList from '../../pages/Mantenimientos/Avatars/AvatarsList';
import Reportes from '../../pages/Admin/Reportes';
import MiPerfil from '../../pages/MiPerfil';

// Componente de Sidebar
import AdminSidebar from '../Sidebar/AdminSidebar';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AdminLayout = ({ onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile); // En móvil empieza cerrado
  const { colegio } = useConfiguracion(); // Obtener datos del colegio

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <UserProvider>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: '#0165a1',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {colegio.nombre || 'Administración del Colegio'}
            </Typography>

            {/* Iconos de la barra de título */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Icono de Notificaciones */}
              <Tooltip title="Notificaciones" arrow>
                <IconButton
                  color="inherit"
                  aria-label="notificaciones"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Badge badgeContent={0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Icono de Cerrar Sesión */}
              <Tooltip title="Cerrar sesión" arrow>
                <IconButton
                  color="inherit"
                  aria-label="cerrar sesión"
                  onClick={onLogout}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
        <AdminSidebar open={open} onDrawerToggle={handleDrawerToggle} onLogout={onLogout} />
        <Box
          component="main"
          open={open}
          sx={{
            flexGrow: 1,
            pt: '80px', // Aumentar padding-top para evitar superposición
            minHeight: '100vh',
            width: '100%',
          }}
        >
          <Box
            sx={{
              maxWidth: 1400,
              margin: '0 auto',
              px: { xs: 1, sm: 2 }, // Menos padding en móvil
              pb: 3,
              width: '100%',
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/dashboard/usuarios" element={<UsuariosList />} />
              <Route path="/dashboard/usuarios/nuevo" element={<UsuariosList />} />
              <Route path="/dashboard/usuarios/editar/:id" element={<UsuariosList />} />
              <Route path="/dashboard/usuarios/ver/:id" element={<UsuariosList />} />
              <Route path="/dashboard/configuracion" element={<ConfiguracionList />} />
              <Route path="/dashboard/grados" element={<GradosList />} />
              <Route path="/dashboard/areas" element={<AreasList />} />
              <Route path="/dashboard/avatars" element={<AvatarsList />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/perfil" element={<MiPerfil />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </UserProvider>
  );
};

export default AdminLayout;
