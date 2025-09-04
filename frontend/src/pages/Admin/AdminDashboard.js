import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  CircularProgress,
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
  Person as PersonIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { userService } from '../../services/apiService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    administradores: 0,
    docentes: 0,
    alumnos: 0,
    apoderados: 0,
    tutores: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      console.log('Cargando estadísticas de usuarios...');
      const response = await userService.getUsers();
      console.log('Respuesta completa de la API:', response);

      if (response.success) {
        const usuarios = response.usuarios || [];
        console.log('Usuarios obtenidos:', usuarios);
        console.log('Cantidad de usuarios:', usuarios.length);

        // Debug: mostrar roles de cada usuario
        usuarios.forEach((usuario, index) => {
          console.log(`Usuario ${index + 1}:`, {
            id: usuario.id,
            nombres: usuario.nombres,
            rol: usuario.rol,
            activo: usuario.activo
          });
        });

        // Contar usuarios por rol
        const statsData = {
          administradores: usuarios.filter(u => u.rol === 'Administrador').length,
          docentes: usuarios.filter(u => u.rol === 'Docente').length,
          alumnos: usuarios.filter(u => u.rol === 'Alumno').length,
          apoderados: usuarios.filter(u => u.rol === 'Apoderado').length,
          tutores: usuarios.filter(u => u.rol === 'Tutor').length,
        };

        console.log('Estadísticas calculadas:', statsData);
        setStats(statsData);
      } else {
        console.error('Error en la respuesta de la API:', response);
        toast.error('Error al obtener datos de usuarios');
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      toast.error('Error al cargar estadísticas de usuarios');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Estadísticas */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(5, 1fr)'
        },
        gap: { xs: 1, sm: 2, md: 2 },
        mb: 4,
      }}>
        <Card sx={{ bgcolor: '#1976d2', color: 'white', height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <SupervisorAccountIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stats.administradores}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, textAlign: 'center' }}>Total Administradores</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#dc004e', color: 'white', height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <SchoolIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stats.docentes}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, textAlign: 'center' }}>Total Docentes</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#2e7d32', color: 'white', height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <PersonIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stats.alumnos}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, textAlign: 'center' }}>Total Alumnos</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#ed6c02', color: 'white', height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <FamilyRestroomIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stats.apoderados}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, textAlign: 'center' }}>Total Apoderados</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#9c27b0', color: 'white', height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <SupportIcon sx={{ fontSize: 48, mb: 1, color: 'white' }} />
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>{stats.tutores}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, textAlign: 'center' }}>Total Tutores</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Contenido principal */}
      <Box sx={{
        display: 'flex',
        gap: { xs: 2, sm: 3 },
        flexDirection: { xs: 'column', lg: 'row' }
      }}>
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
};

export default AdminDashboard;
