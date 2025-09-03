import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const MisHijos = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Hijos
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá gestionar la información de los hijos, incluyendo:
          </Typography>
          <ul>
            <li>Ver información de cada hijo</li>
            <li>Ver progreso académico</li>
            <li>Comunicarse con docentes</li>
            <li>Ver calificaciones y tareas</li>
            <li>Gestionar asistencia</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MisHijos;
