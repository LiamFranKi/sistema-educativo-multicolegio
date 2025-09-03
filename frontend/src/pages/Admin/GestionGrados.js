import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const GestionGrados = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Grados
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá gestionar los grados del colegio, incluyendo:
          </Typography>
          <ul>
            <li>Crear nuevos grados</li>
            <li>Editar información de grados</li>
            <li>Asignar docentes a grados</li>
            <li>Gestionar alumnos por grado</li>
            <li>Configurar años escolares</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GestionGrados;
