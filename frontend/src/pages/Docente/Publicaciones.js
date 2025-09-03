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
            Esta página permitirá gestionar las publicaciones, incluyendo:
          </Typography>
          <ul>
            <li>Crear nuevas publicaciones</li>
            <li>Subir imágenes y archivos</li>
            <li>Ver publicaciones existentes</li>
            <li>Gestionar reacciones y comentarios</li>
            <li>Programar publicaciones</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Publicaciones;
