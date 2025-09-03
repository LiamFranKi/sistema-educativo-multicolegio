import React, { useState } from 'react';
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
  Avatar,

  LinearProgress,
} from '@mui/material';
import {
  FamilyRestroom,
  PostAdd,
  School,
  TrendingUp,
  Visibility,
  Notifications,
} from '@mui/icons-material';

const ApoderadoDashboard = () => {
  const [stats] = useState({
    totalHijos: 0,
    publicacionesNuevas: 0,
    notificacionesPendientes: 0,
    hijosActivos: 0,
  });

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
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Apoderado
      </Typography>

      {/* Estadísticas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mis Hijos"
            value={stats.totalHijos}
            icon={<FamilyRestroom />}
            color="primary"
            subtitle={`${stats.hijosActivos} activos`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Publicaciones Nuevas"
            value={stats.publicacionesNuevas}
            icon={<PostAdd />}
            color="secondary"
            subtitle="Sin leer"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Notificaciones"
            value={stats.notificacionesPendientes}
            icon={<Notifications />}
            color="success"
            subtitle="Pendientes"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Hijos Activos"
            value={stats.hijosActivos}
            icon={<TrendingUp />}
            color="warning"
            subtitle="Conectados hoy"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Mis hijos */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mis Hijos
              </Typography>

              <List>
                <ListItem divider>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText
                    primary="Juan Pérez"
                    secondary="5to Grado • Docente: María González"
                  />
                  <Box sx={{ width: 100, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      85% progreso
                    </Typography>
                  </Box>
                  <Button size="small" startIcon={<Visibility />}>
                    Ver Detalles
                  </Button>
                </ListItem>

                <ListItem divider>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ana Pérez"
                    secondary="3er Grado • Docente: Carlos López"
                  />
                  <Box sx={{ width: 100, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={92}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      92% progreso
                    </Typography>
                  </Box>
                  <Button size="small" startIcon={<Visibility />}>
                    Ver Detalles
                  </Button>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText
                    primary="Luis Pérez"
                    secondary="1er Grado • Docente: Ana Rodríguez"
                  />
                  <Box sx={{ width: 100, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={78}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      78% progreso
                    </Typography>
                  </Box>
                  <Button size="small" startIcon={<Visibility />}>
                    Ver Detalles
                  </Button>
                </ListItem>
              </List>
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
                <ListItem button component="a" href="/hijos">
                  <ListItemIcon>
                    <FamilyRestroom />
                  </ListItemIcon>
                  <ListItemText primary="Ver Mis Hijos" />
                </ListItem>

                <ListItem button component="a" href="/publicaciones">
                  <ListItemIcon>
                    <PostAdd />
                  </ListItemIcon>
                  <ListItemText primary="Ver Publicaciones" />
                </ListItem>

                <ListItem button component="a" href="/notificaciones">
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Notificaciones" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApoderadoDashboard;
