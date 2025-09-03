import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  School,
  People,
  Settings,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings,
} from '@mui/icons-material';

const SuperAdminSidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
    },
    {
      text: 'Gestión de Colegios',
      icon: <School />,
      path: '/colegios',
    },
    {
      text: 'Gestión de Usuarios',
      icon: <People />,
      path: '/usuarios',
    },
    {
      text: 'Configuración del Sistema',
      icon: <Settings />,
      path: '/configuracion',
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawerWidth = open ? 240 : 60;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          backgroundColor: 'white',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      {/* Header del Sidebar */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          minHeight: 64,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {open ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminPanelSettings sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Super Admin
            </Typography>
          </Box>
        ) : (
          <AdminPanelSettings sx={{ color: 'primary.main' }} />
        )}
      </Box>

      {/* Lista de navegación */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                color: isActive(item.path) ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: isActive(item.path) ? 'primary.dark' : 'action.hover',
                },
                minHeight: 48,
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'white' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Información del rol */}
      {open && (
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" align="center">
            Rol: Superadministrador
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default SuperAdminSidebar;
