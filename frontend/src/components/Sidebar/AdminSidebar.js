import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useConfiguracion } from '../../contexts/ConfiguracionContext';
import { useUser } from '../../contexts/UserContext';
import { getImageUrl } from '../../utils/imageUtils';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Assignment as MatriculasIcon,
  People as PeopleIcon,
  AccountCircle as AvatarsIcon,
  Grade as GradosIcon,
  Category as AreasIcon,
  School as CursosIcon,
  Subject as AsignaturasIcon,
  Article as PublicacionesIcon,
  Event as EventosIcon,
  Announcement as ComunicadosIcon,
  Message as MensajesIcon,
  Warning as AlertasIcon,
  Notifications as NotificacionesIcon,
  Assessment as ReportesIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#1e3a8a', // Azul oscuro similar al de la imagen
    borderRight: '1px solid #1e40af',
    '&::-webkit-scrollbar': {
      width: '3px', // Scrollbar aún más delgado
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '2px',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.5)',
      },
    },
  },
}));

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Mi Perfil', icon: <PersonIcon />, path: '/perfil' },
    { text: 'Matrículas', icon: <MatriculasIcon />, path: '/dashboard/matriculas' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/dashboard/usuarios' },
    { text: 'Avatars', icon: <AvatarsIcon />, path: '/dashboard/avatars' },
    { text: 'Grados', icon: <GradosIcon />, path: '/dashboard/grados' },
    { text: 'Areas', icon: <AreasIcon />, path: '/dashboard/areas' },
    { text: 'Cursos', icon: <CursosIcon />, path: '/dashboard/cursos' },
    { text: 'Asignaturas', icon: <AsignaturasIcon />, path: '/dashboard/asignaturas' },
    { text: 'Publicaciones', icon: <PublicacionesIcon />, path: '/dashboard/publicaciones' },
    { text: 'Eventos', icon: <EventosIcon />, path: '/dashboard/eventos' },
    { text: 'Comunicados', icon: <ComunicadosIcon />, path: '/dashboard/comunicados' },
    { text: 'Mensajes', icon: <MensajesIcon />, path: '/dashboard/mensajes' },
    { text: 'Alertas', icon: <AlertasIcon />, path: '/dashboard/alertas' },
    { text: 'Notificaciones', icon: <NotificacionesIcon />, path: '/dashboard/notificaciones' },
    { text: 'Reportes', icon: <ReportesIcon />, path: '/dashboard/reportes' },
    { text: 'Configuración', icon: <SettingsIcon />, path: '/dashboard/configuracion' },
  ];

const AdminSidebar = ({ open, onDrawerToggle, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { colegio } = useConfiguracion();
  const { user } = useUser();

  const handleNavigation = (path) => {
    navigate(path);
    // Cerrar sidebar en móvil después de navegar
    if (isMobile) {
      onDrawerToggle && onDrawerToggle();
    }
  };

  const isSelected = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  return (
    <StyledDrawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={onDrawerToggle}
    >
      <Box sx={{ 
        p: 2, 
        textAlign: 'center', 
        borderBottom: '1px solid #1e40af',
        background: 'rgba(30, 64, 175, 0.3)',
      }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 1,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {user?.foto ? (
            <img
              src={getImageUrl(user.foto)}
              alt="Foto del usuario"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              onError={(e) => {
                console.error('Error cargando foto de usuario:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 40, color: 'white' }} />
          )}
        </Avatar>
        <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 0.5 }}>
          {user?.nombres && user?.apellidos
            ? `${user.nombres} ${user.apellidos}`
            : user?.nombres || 'Administrador'
          }
        </Typography>
        <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
          ADMINISTRADOR
        </Typography>
      </Box>

      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={isSelected(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mx: 1,
                borderRadius: 1,
                color: 'white',
                py: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(59, 130, 246, 0.3)', // Azul claro para seleccionado
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.4)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'white',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.9rem',
                    fontWeight: isSelected(item.path) ? 600 : 400,
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 'auto', borderColor: '#1e40af' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: 1,
              color: 'rgba(255, 255, 255, 0.8)',
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: 'white',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Cerrar Sesión" 
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.9rem',
                  fontWeight: 400,
                }
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </StyledDrawer>
  );
};

export default AdminSidebar;
