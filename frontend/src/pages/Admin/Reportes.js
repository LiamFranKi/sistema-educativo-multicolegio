import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const Reportes = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reportes y Estadísticas
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá generar reportes y estadísticas del colegio, incluyendo:
          </Typography>
          <ul>
            <li>Reportes de asistencia</li>
            <li>Estadísticas de usuarios</li>
            <li>Reportes de progreso académico</li>
            <li>Estadísticas de uso del sistema</li>
            <li>Reportes de publicaciones</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reportes;
