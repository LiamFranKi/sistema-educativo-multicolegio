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
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
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
  const [collegeData, setCollegeData] = React.useState({
    nombre: 'Cargando...',
    logo: null
  });

  // Cargar datos del colegio
  React.useEffect(() => {
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
              nombre: colegio.nombre || 'Sistema Docentes',
              logo: colegio.logo || null
            });
          } else {
            setCollegeData({
              nombre: 'Sistema Docentes',
              logo: null
            });
          }
        }
      } catch (error) {
        console.log('Error cargando datos del colegio:', error);
        setCollegeData({
          nombre: 'Sistema Docentes',
          logo: null
        });
      }
    };

    loadCollegeData();
  }, []);

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
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 1,
            bgcolor: 'primary.main',
          }}
        >
          {collegeData.logo ? (
            <img
              src={collegeData.logo}
              alt="Logo del colegio"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            <SchoolIcon sx={{ fontSize: 30 }} />
          )}
        </Avatar>
        <Typography variant="h6" color="primary" fontWeight="bold">
          {collegeData.nombre}
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
