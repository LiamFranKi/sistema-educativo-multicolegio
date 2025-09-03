import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const ConfiguracionSistema = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Configuración del Sistema
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá configurar el sistema global, incluyendo:
          </Typography>
          <ul>
            <li>Configuración de notificaciones</li>
            <li>Configuración de archivos y uploads</li>
            <li>Configuración de seguridad</li>
            <li>Configuración de colores del sistema</li>
            <li>Configuración de Web Push</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConfiguracionSistema;
