import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const Publicaciones = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Publicaciones
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá ver las publicaciones de los docentes, incluyendo:
          </Typography>
          <ul>
            <li>Ver publicaciones de mis docentes</li>
            <li>Reaccionar a publicaciones</li>
            <li>Comentar en publicaciones</li>
            <li>Ver archivos adjuntos</li>
            <li>Recibir notificaciones de nuevas publicaciones</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Publicaciones;
