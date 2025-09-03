import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const GestionCursos = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Cursos
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Funcionalidad en Desarrollo
          </Typography>
          <Typography variant="body1">
            Esta página permitirá gestionar los cursos del colegio, incluyendo:
          </Typography>
          <ul>
            <li>Crear nuevos cursos</li>
            <li>Gestionar cursos del sistema</li>
            <li>Crear cursos personalizados</li>
            <li>Asignar cursos a grados</li>
            <li>Configurar asignaturas</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GestionCursos;
