import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const CursosVirtuales = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Cursos Virtuales
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá gestionar los cursos virtuales, incluyendo:
          </Typography>
          <ul>
            <li>Subir videos de clases</li>
            <li>Crear contenido educativo</li>
            <li>Gestionar progreso de alumnos</li>
            <li>Configurar sistema de aprobación</li>
            <li>Ver estadísticas de visualización</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CursosVirtuales;
