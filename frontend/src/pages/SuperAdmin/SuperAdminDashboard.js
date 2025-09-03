import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
} from '@mui/material';
import {
  School,
  People,
  TrendingUp,
  Notifications,
  Add,
  AdminPanelSettings,
} from '@mui/icons-material';
import { colegioService, userService } from '../../services/apiService';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalColegios: 0,
    totalUsuarios: 0,
    colegiosActivos: 0,
    usuariosActivos: 0,
  });
  const [recentColegios, setRecentColegios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Cargar estadísticas
      const [colegiosResponse, usuariosResponse] = await Promise.all([
        colegioService.getColegios(),
        userService.getUsers(),
      ]);

      if (colegiosResponse.success) {
        const colegios = colegiosResponse.colegios || [];
        setStats(prev => ({
          ...prev,
          totalColegios: colegios.length,
          colegiosActivos: colegios.filter(c => c.activo).length,
        }));
        setRecentColegios(colegios.slice(0, 5));
      }

      if (usuariosResponse.success) {
        const usuarios = usuariosResponse.usuarios || [];
        setStats(prev => ({
          ...prev,
          totalUsuarios: usuarios.length,
          usuariosActivos: usuarios.filter(u => u.activo).length,
        }));
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="body2">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard Superadministrador
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          href="/colegios"
        >
          Nuevo Colegio
        </Button>
      </Box>

      {/* Estadísticas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Colegios"
            value={stats.totalColegios}
            icon={<School />}
            color="primary"
            subtitle={`${stats.colegiosActivos} activos`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Usuarios"
            value={stats.totalUsuarios}
            icon={<People />}
            color="secondary"
            subtitle={`${stats.usuariosActivos} activos`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Colegios Activos"
            value={stats.colegiosActivos}
            icon={<TrendingUp />}
            color="success"
            subtitle="En funcionamiento"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuarios Activos"
            value={stats.usuariosActivos}
            icon={<Notifications />}
            color="warning"
            subtitle="Conectados recientemente"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Colegios recientes */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Colegios Registrados
                </Typography>
                <Button size="small" href="/colegios">
                  Ver todos
                </Button>
              </Box>

              {recentColegios.length > 0 ? (
                <List>
                  {recentColegios.map((colegio) => (
                    <ListItem key={colegio.id} divider>
                      <ListItemIcon>
                        <School color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={colegio.nombre}
                        secondary={`Código: ${colegio.codigo} • Director: ${colegio.director_nombre || 'No asignado'}`}
                      />
                      <Chip
                        label={colegio.activo ? 'Activo' : 'Inactivo'}
                        color={colegio.activo ? 'success' : 'default'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No hay colegios registrados
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Comienza creando el primer colegio del sistema
                  </Typography>
                  <Button variant="contained" startIcon={<Add />} href="/colegios">
                    Crear Colegio
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Acciones rápidas */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones Rápidas
              </Typography>

              <List>
                <ListItem button component="a" href="/colegios">
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText primary="Gestionar Colegios" />
                </ListItem>

                <ListItem button component="a" href="/usuarios">
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText primary="Gestionar Usuarios" />
                </ListItem>

                <ListItem button component="a" href="/configuracion">
                  <ListItemIcon>
                    <AdminPanelSettings />
                  </ListItemIcon>
                  <ListItemText primary="Configuración del Sistema" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;
