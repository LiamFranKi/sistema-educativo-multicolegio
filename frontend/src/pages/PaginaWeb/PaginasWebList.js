import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as PreviewIcon,
  Web as WebIcon,
} from '@mui/icons-material';
import { webAdminApi } from '../../services/apiService';

const PaginasWebList = () => {
  const navigate = useNavigate();
  const [paginas, setPaginas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarPaginas();
  }, []);

  const cargarPaginas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await webAdminApi.getPages();
      setPaginas(response.data.data || []);
    } catch (err) {
      console.error('Error cargando páginas:', err);
      setError('Error al cargar las páginas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, titulo) => {
    if (!window.confirm(`¿Estás seguro de eliminar la página "${titulo}"?\n\nEsto eliminará todas sus secciones y bloques.`)) {
      return;
    }

    try {
      await webAdminApi.deletePage(id);
      cargarPaginas();
    } catch (err) {
      console.error('Error eliminando página:', err);
      alert('Error al eliminar la página');
    }
  };

  const handlePreview = (slug) => {
    const previewUrl = `${window.location.origin.replace(':3000', ':5000')}/web-preview/header-vanguard-real.html?v=preview&t=${Date.now()}`;
    window.open(previewUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'publicado': return 'success';
      case 'borrador': return 'warning';
      case 'archivado': return 'default';
      default: return 'default';
    }
  };

  const paginasFiltradas = paginas.filter(p =>
    p.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <WebIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" component="h1" color="primary">
                Páginas del Sitio Web
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/dashboard/pagina-web/paginas/nueva')}
            >
              Nueva Página
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Buscador */}
          <TextField
            fullWidth
            placeholder="Buscar por título o slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Título</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Slug</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Última Actualización</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'No se encontraron páginas' : 'No hay páginas registradas'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginasFiltradas.map((pagina) => (
                  <TableRow key={pagina.id} hover>
                    <TableCell align="center">{pagina.id}</TableCell>
                    <TableCell align="center">{pagina.titulo}</TableCell>
                    <TableCell align="center">
                      <code style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>
                        {pagina.slug}
                      </code>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={pagina.estado}
                        color={getEstadoColor(pagina.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {pagina.updated_at ? new Date(pagina.updated_at).toLocaleDateString('es-PE') : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <Tooltip title="Vista Previa" arrow>
                          <IconButton
                            color="info"
                            size="small"
                            onClick={() => handlePreview(pagina.slug)}
                          >
                            <PreviewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar" arrow>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/dashboard/pagina-web/paginas/${pagina.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar" arrow>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(pagina.id, pagina.titulo)}
                            disabled={pagina.slug === 'home'} // No permitir eliminar home
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default PaginasWebList;
