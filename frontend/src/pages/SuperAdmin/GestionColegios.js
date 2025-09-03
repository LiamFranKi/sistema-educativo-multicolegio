import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const GestionColegios = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Colegios
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá gestionar todos los colegios del sistema, incluyendo:
          </Typography>
          <ul>
            <li>Crear nuevos colegios</li>
            <li>Editar información de colegios existentes</li>
            <li>Configurar colores y logos</li>
            <li>Gestionar años escolares</li>
            <li>Activar/desactivar colegios</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GestionColegios;
