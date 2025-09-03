import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const MisCursos = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Cursos
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá ver y gestionar los cursos asignados, incluyendo:
          </Typography>
          <ul>
            <li>Ver lista de cursos inscritos</li>
            <li>Acceder a videos de clases</li>
            <li>Ver progreso de cada curso</li>
            <li>Completar tareas y evaluaciones</li>
            <li>Ver calificaciones</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MisCursos;
