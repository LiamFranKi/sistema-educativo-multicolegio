import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ListItemButton
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Event as EventIcon,
  SupervisorAccount as SupervisorAccountIcon,
  FamilyRestroom as FamilyRestroomIcon,
  SchoolOutlined as SchoolOutlinedIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function DashboardHome() {
  const [stats, setStats] = useState({
    administradores: 0,
    docentes: 0,
    alumnos: 0,
    apoderados: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/usuarios`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats({
            administradores: data.filter(u => u.rol === 'Administrador' && (u.estado === true || u.estado === 'Activo')).length,
            docentes: data.filter(u => u.rol === 'Docente' && (u.estado === true || u.estado === 'Activo')).length,
            alumnos: data.filter(u => u.rol === 'Alumno' && (u.estado === true || u.estado === 'Activo')).length,
            apoderados: data.filter(u => u.rol === 'Apoderado' && (u.estado === true || u.estado === 'Activo')).length
          });
        }
      })
      .catch(() => setStats({ administradores: 0, docentes: 0, alumnos: 0, apoderados: 0 }));
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Estadísticas */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Card sx={{ flex: 1, bgcolor: '#1976d2', color: 'white', height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <SupervisorAccountIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stats.administradores}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Administradores</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, bgcolor: '#dc004e', color: 'white', height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <SchoolIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stats.docentes}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Docentes</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, bgcolor: '#2e7d32', color: 'white', height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <PersonIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stats.alumnos}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Alumnos</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, bgcolor: '#ed6c02', color: 'white', height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <FamilyRestroomIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stats.apoderados}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>Total Apoderados</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Actividad Reciente
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Nuevo docente registrado: Prof. María González"
                  secondary="Hace 2 horas"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <EventIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Reunión de padres programada para el 15 de diciembre"
                  secondary="Hace 1 día"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <AssessmentIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Reportes de evaluación del mes de noviembre disponibles"
                  secondary="Hace 3 días"
                />
              </ListItem>
            </List>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Acciones Rápidas
            </Typography>
            <List>
              <ListItemButton>
                <ListItemIcon>
                  <PeopleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Gestionar Usuarios" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <AssessmentIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary="Ver Reportes" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <EventIcon color="success" />
                </ListItemIcon>
                <ListItemText primary="Configurar Sistema" />
              </ListItemButton>
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardHome; 