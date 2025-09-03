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
  School,
  PostAdd,
  VideoLibrary,
  TrendingUp,
  PlayArrow,
  Assignment,
} from '@mui/icons-material';

const AlumnoDashboard = () => {
  const [stats] = useState({
    cursosInscritos: 0,
    clasesCompletadas: 0,
    publicacionesNuevas: 0,
    progresoGeneral: 0,
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
        Dashboard Estudiante
      </Typography>

      {/* Estadísticas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cursos Inscritos"
            value={stats.cursosInscritos}
            icon={<School />}
            color="primary"
            subtitle="Cursos activos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Clases Completadas"
            value={stats.clasesCompletadas}
            icon={<VideoLibrary />}
            color="secondary"
            subtitle="Videos vistos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Publicaciones Nuevas"
            value={stats.publicacionesNuevas}
            icon={<PostAdd />}
            color="success"
            subtitle="Sin leer"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Progreso General"
            value={`${stats.progresoGeneral}%`}
            icon={<TrendingUp />}
            color="warning"
            subtitle="Completado"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Mis cursos */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mis Cursos
              </Typography>

              <List>
                <ListItem divider>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText
                    primary="Matemáticas - 5to Grado"
                    secondary="Docente: María González"
                  />
                  <Box sx={{ width: 100, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      75% completado
                    </Typography>
                  </Box>
                  <Button size="small" startIcon={<PlayArrow />}>
                    Continuar
                  </Button>
                </ListItem>

                <ListItem divider>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ciencias - 5to Grado"
                    secondary="Docente: Carlos Pérez"
                  />
                  <Box sx={{ width: 100, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={45}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      45% completado
                    </Typography>
                  </Box>
                  <Button size="small" startIcon={<PlayArrow />}>
                    Continuar
                  </Button>
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText
                    primary="Historia - 5to Grado"
                    secondary="Docente: Ana Rodríguez"
                  />
                  <Box sx={{ width: 100, mr: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={90}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      90% completado
                    </Typography>
                  </Box>
                  <Button size="small" startIcon={<PlayArrow />}>
                    Continuar
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
                <ListItem button component="a" href="/cursos">
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText primary="Ver Mis Cursos" />
                </ListItem>

                <ListItem button component="a" href="/publicaciones">
                  <ListItemIcon>
                    <PostAdd />
                  </ListItemIcon>
                  <ListItemText primary="Ver Publicaciones" />
                </ListItem>

                <ListItem button component="a" href="/tareas">
                  <ListItemIcon>
                    <Assignment />
                  </ListItemIcon>
                  <ListItemText primary="Mis Tareas" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AlumnoDashboard;
