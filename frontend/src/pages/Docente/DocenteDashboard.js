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
  Chip,
} from '@mui/material';
import {
  People,
  PostAdd,
  VideoLibrary,
  TrendingUp,
  Add,
  School,
} from '@mui/icons-material';

const DocenteDashboard = () => {
  const [stats] = useState({
    totalAlumnos: 0,
    publicacionesHoy: 0,
    cursosActivos: 0,
    alumnosActivos: 0,
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard Docente
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          href="/publicaciones"
        >
          Nueva Publicación
        </Button>
      </Box>

      {/* Estadísticas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mis Alumnos"
            value={stats.totalAlumnos}
            icon={<People />}
            color="primary"
            subtitle={`${stats.alumnosActivos} activos`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Publicaciones Hoy"
            value={stats.publicacionesHoy}
            icon={<PostAdd />}
            color="secondary"
            subtitle="Contenido compartido"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cursos Virtuales"
            value={stats.cursosActivos}
            icon={<VideoLibrary />}
            color="success"
            subtitle="Cursos activos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Alumnos Activos"
            value={stats.alumnosActivos}
            icon={<TrendingUp />}
            color="warning"
            subtitle="Conectados hoy"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Acciones rápidas */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acciones Rápidas
              </Typography>

              <List>
                <ListItem button component="a" href="/alumnos">
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ver Mis Alumnos"
                    secondary="Gestionar estudiantes asignados"
                  />
                </ListItem>

                <ListItem button component="a" href="/publicaciones">
                  <ListItemIcon>
                    <PostAdd />
                  </ListItemIcon>
                  <ListItemText
                    primary="Crear Publicación"
                    secondary="Compartir contenido con alumnos"
                  />
                </ListItem>

                <ListItem button component="a" href="/cursos-virtuales">
                  <ListItemIcon>
                    <VideoLibrary />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cursos Virtuales"
                    secondary="Subir videos y material educativo"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Información del docente */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mi Información
              </Typography>

              <Box textAlign="center" py={2}>
                <School sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6">
                  Docente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Año Escolar 2025
                </Typography>
                <Chip
                  label="Activo"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocenteDashboard;
