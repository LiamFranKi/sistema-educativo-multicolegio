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
            Esta página permitirá gestionar los usuarios del colegio, incluyendo:
          </Typography>
          <ul>
            <li>Crear nuevos docentes, alumnos y apoderados</li>
            <li>Editar información de usuarios</li>
            <li>Gestionar matrículas</li>
            <li>Asignar grados y cursos</li>
            <li>Activar/desactivar usuarios</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GestionUsuarios;
