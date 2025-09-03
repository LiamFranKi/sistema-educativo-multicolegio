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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  EmojiEmotions as EmojiEmotionsIcon,
  AssignmentInd as AssignmentIndIcon,
  Class as ClassIcon,
  MenuBook as MenuBookIcon,
  Group as GroupIcon,
  FamilyRestroom as FamilyRestroomIcon,
  PostAdd as PostAddIcon,
  Event as EventIcon,
  Campaign as CampaignIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon,
  Tune as TuneIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  Grade as GradeIcon,
  Store as StoreIcon
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

const docenteMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/docente' },
  { text: 'Mi Perfil', icon: <PersonIcon />, path: '/docente/mi-perfil' },
  { text: 'Avatars', icon: <EmojiEmotionsIcon />, path: '/docente/avatars' },
  { text: 'Matrículas', icon: <AssignmentIndIcon />, path: '/docente/matriculas' },
  { text: 'Grados', icon: <ClassIcon />, path: '/docente/grados' },
  { text: 'Cursos', icon: <SchoolIcon />, path: '/docente/cursos' },
  { text: 'Asignatura', icon: <MenuBookIcon />, path: '/docente/asignatura' },
  // { text: 'Alumnos', icon: <GroupIcon />, path: '/docente/alumnos' },
  // { text: 'Apoderados', icon: <FamilyRestroomIcon />, path: '/docente/apoderados' },
  { text: 'Publicaciones', icon: <PostAddIcon />, path: '/docente/publicaciones' },
  { text: 'Mensajes', icon: <MessageIcon />, path: '/docente/mensajes' },
  { text: 'Eventos', icon: <EventIcon />, path: '/docente/eventos' },
  { text: 'Comunicados', icon: <CampaignIcon />, path: '/docente/comunicados' },
  { text: 'Alertas', icon: <WarningIcon />, path: '/docente/alertas' },
  { text: 'Reportes', icon: <BarChartIcon />, path: '/docente/reportes' },
  { text: 'Configuración', icon: <TuneIcon />, path: '/docente/configuracion' },
];

const alumnoMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/alumno' },
  { text: 'Mi Perfil', icon: <PersonIcon />, path: '/alumno/mi-perfil' },
  { text: 'Mi Avatar', icon: <EmojiEmotionsIcon />, path: '/alumno/mi-avatar' },
  { text: 'Mi Horario', icon: <ScheduleIcon />, path: '/alumno/mi-horario' },
  { text: 'Cursos Asignados', icon: <SchoolIcon />, path: '/alumno/cursos-asignados' },
  { text: 'Notas y Asistencias', icon: <GradeIcon />, path: '/alumno/notas-asistencias' },
  { text: 'Publicaciones', icon: <PostAddIcon />, path: '/alumno/publicaciones' },
  { text: 'Mensajes', icon: <MessageIcon />, path: '/alumno/mensajes' },
  { text: 'Eventos', icon: <EventIcon />, path: '/alumno/eventos' },
  { text: 'Comunicados', icon: <CampaignIcon />, path: '/alumno/comunicados' },
  { text: 'Alertas', icon: <WarningIcon />, path: '/alumno/alertas' },
  { text: 'Tienda de Avatars', icon: <StoreIcon />, path: '/alumno/tienda-avatars' },
];

function Sidebar({ open, onDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar rol del usuario
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem('usuario'));
  } catch {}
  const rol = usuario && usuario.rol ? usuario.rol.toLowerCase() : '';

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isSelected = (path) => {
    // Para dashboard docente y admin
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    if (path === '/docente') {
      return location.pathname === '/docente' || location.pathname === '/docente/';
    }
    if (path === '/alumno') {
      return location.pathname === '/alumno' || location.pathname === '/alumno/';
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  // Menú y título según rol
  let items, panelTitle;
  if (rol === 'docente') {
    items = docenteMenuItems;
    panelTitle = 'Panel Docente';
  } else if (rol === 'alumno') {
    items = alumnoMenuItems;
    panelTitle = 'Panel Alumno';
  } else {
    items = menuItems;
    panelTitle = 'Panel Administrativo';
  }

  return (
    <StyledDrawer
      variant="persistent"
      anchor="left"
      open={open}
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
          <SchoolIcon sx={{ fontSize: 30 }} />
        </Avatar>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Sistema Docentes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {panelTitle}
        </Typography>
      </Box>

      <List sx={{ pt: 1 }}>
        {items.map((item) => (
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
}

export default Sidebar; 