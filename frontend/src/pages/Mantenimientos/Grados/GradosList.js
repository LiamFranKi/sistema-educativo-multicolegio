import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Chip,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { gradosService, nivelesService } from '../../../services/apiService';
import Swal from 'sweetalert2';
import GradosForm from './GradosForm';
import GradosView from './GradosView';

const GradosList = () => {
  const [grados, setGrados] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nivelFilter, setNivelFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0
  });
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingGrado, setEditingGrado] = useState(null);
  const [viewingGrado, setViewingGrado] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadGrados();
    loadNiveles();
  }, [pagination.page, pagination.rowsPerPage, searchTerm, nivelFilter]);

  const loadGrados = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page + 1,
        limit: pagination.rowsPerPage,
        search: searchTerm || undefined,
        nivel_id: nivelFilter || undefined
      };

      const response = await gradosService.getGrados(params);
      setGrados(response.grados);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
      setError(null);
    } catch (err) {
      console.error('Error cargando grados:', err);
      setError('Error cargando los grados');
    } finally {
      setLoading(false);
    }
  };

  const loadNiveles = async () => {
    try {
      const response = await nivelesService.getNiveles();
      setNiveles(response.niveles || response);
    } catch (err) {
      console.error('Error cargando niveles:', err);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleNivelFilter = (event) => {
    setNivelFilter(event.target.value);
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination(prev => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  const handleCreate = () => {
    setEditingGrado(null);
    setFormOpen(true);
  };

  const handleEdit = (grado) => {
    setEditingGrado(grado);
    setFormOpen(true);
  };

  const handleView = (grado) => {
    setViewingGrado(grado);
    setViewOpen(true);
  };

  const handleDelete = async (grado) => {
    const result = await Swal.fire({
      title: '¿Eliminar Grado?',
      text: `¿Estás seguro de que deseas eliminar el grado "${grado.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await gradosService.deleteGrado(grado.id);
        Swal.fire('Eliminado', 'El grado ha sido eliminado exitosamente', 'success');
        loadGrados();
      } catch (error) {
        console.error('Error eliminando grado:', error);
        Swal.fire('Error', 'No se pudo eliminar el grado', 'error');
      }
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingGrado(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadGrados();
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewingGrado(null);
  };

  const getNivelNombre = (nivelId) => {
    const nivel = niveles.find(n => n.id === nivelId);
    return nivel ? nivel.nombre : 'Nivel no encontrado';
  };

  const getNivelColor = (nivelId) => {
    const nivel = niveles.find(n => n.id === nivelId);
    if (!nivel) return 'default';

    const colors = {
      'Inicial': 'primary',
      'Primaria': 'success',
      'Secundaria': 'warning'
    };
    return colors[nivel.nombre] || 'default';
  };

  if (loading && grados.length === 0) {
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
        <CardHeader
          avatar={<SchoolIcon color="primary" sx={{ fontSize: 32 }} />}
          title={
            <Typography variant="h4" component="h1" color="primary">
              Gestión de Grados
            </Typography>
          }
          subheader="Administra los grados educativos del sistema"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ mr: 1 }}
            >
              Nuevo Grado
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar grados..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por Nivel</InputLabel>
                <Select
                  value={nivelFilter}
                  onChange={handleNivelFilter}
                  label="Filtrar por Nivel"
                >
                  <MenuItem value="">Todos los niveles</MenuItem>
                  {niveles.map((nivel) => (
                    <MenuItem key={nivel.id} value={nivel.id}>
                      {nivel.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setNivelFilter('');
                  setSearchTerm('');
                }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Foto</strong></TableCell>
                <TableCell align="center"><strong>Grado</strong></TableCell>
                <TableCell align="center"><strong>Código</strong></TableCell>
                <TableCell align="center"><strong>Nivel</strong></TableCell>
                <TableCell align="center"><strong>Estado</strong></TableCell>
                <TableCell align="center"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grados.map((grado) => (
                <TableRow key={grado.id} hover>
                  <TableCell align="center">
                    <Avatar
                      src={grado.foto ? `/uploads/${grado.foto}` : '/default-grado.png'}
                      sx={{ width: 50, height: 50, mx: 'auto' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" fontWeight="medium">
                      {grado.nombre}
                    </Typography>
                    {grado.descripcion && (
                      <Typography variant="body2" color="text.secondary">
                        {grado.descripcion}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={grado.codigo}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getNivelNombre(grado.nivel_id)}
                      size="small"
                      color={getNivelColor(grado.nivel_id)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={grado.activo ? 'Activo' : 'Inactivo'}
                      size="small"
                      color={grado.activo ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleView(grado)}
                      color="info"
                      title="Ver detalles"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(grado)}
                      color="primary"
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(grado)}
                      color="error"
                      title="Eliminar"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>

      {/* Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
      >
        <GradosForm
          grado={editingGrado}
          niveles={niveles}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={viewOpen}
        onClose={handleViewClose}
        maxWidth="sm"
        fullWidth
      >
        <GradosView
          grado={viewingGrado}
          nivelNombre={viewingGrado ? getNivelNombre(viewingGrado.nivel_id) : ''}
          onClose={handleViewClose}
        />
      </Dialog>
    </Box>
  );
};

export default GradosList;
