import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const MisAlumnos = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Alumnos
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá gestionar los alumnos asignados, incluyendo:
          </Typography>
          <ul>
            <li>Ver lista de alumnos asignados</li>
            <li>Ver información detallada de cada alumno</li>
            <li>Gestionar matrículas</li>
            <li>Ver progreso académico</li>
            <li>Comunicarse con apoderados</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MisAlumnos;
