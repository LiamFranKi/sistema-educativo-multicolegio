import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const GestionUsuarios = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Usuarios
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá gestionar todos los usuarios del sistema, incluyendo:
          </Typography>
          <ul>
            <li>Crear nuevos usuarios</li>
            <li>Editar información de usuarios</li>
            <li>Asignar roles y permisos</li>
            <li>Gestionar matrículas</li>
            <li>Activar/desactivar usuarios</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GestionUsuarios;
