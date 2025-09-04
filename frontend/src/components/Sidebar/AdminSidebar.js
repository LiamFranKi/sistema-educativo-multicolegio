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
import { getUser } from '../../services/authService';
import { getImageUrl } from '../../utils/imageUtils';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
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
    backgroundColor: '#f5f5f5',
    borderRight: '1px solid #e0e0e0',
  },
}));

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Mi Perfil', icon: <PersonIcon />, path: '/dashboard/mi-perfil' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/dashboard/usuarios' },
    { text: 'Cursos', icon: <SchoolIcon />, path: '/dashboard/cursos' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/dashboard/reportes' },
    { text: 'Configuración', icon: <SettingsIcon />, path: '/dashboard/configuracion' },
  ];

const AdminSidebar = ({ open, onDrawerToggle, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { colegio } = useConfiguracion();
  const user = getUser();

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
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <Avatar
          sx={{
            width: 120, // 60 * 2 = 120 (100% más grande)
            height: 120, // 60 * 2 = 120 (100% más grande)
            mx: 'auto',
            mb: 1,
            bgcolor: 'primary.main',
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
            <AccountCircleIcon sx={{ fontSize: 60 }} />
          )}
        </Avatar>
        <Typography variant="h6" color="primary" fontWeight="bold">
          {user?.nombres || 'Administrador'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Panel Administrativo
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
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isSelected(item.path) ? 'white' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 'auto' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              mx: 1,
              borderRadius: 1,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'white',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </StyledDrawer>
  );
};

export default AdminSidebar;
