import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  InputAdornment,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { areasService } from '../../../services/apiService';
import AreasForm from './AreasForm';

const AreasList = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [mode, setMode] = useState(null); // 'create', 'edit', 'view'
  const [selectedArea, setSelectedArea] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);

  // Cargar áreas
  const loadAreas = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        estado: estadoFilter || undefined,
      };

      const response = await areasService.getAreas(params);

      if (response.success) {
        setAreas(response.areas || []);
        setTotalItems(response.pagination?.total || 0);
      } else {
        setError(response.message || 'Error al cargar áreas');
      }
    } catch (error) {
      console.error('Error cargando áreas:', error);
      setError('Error al cargar las áreas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, [page, rowsPerPage, searchTerm, estadoFilter]);

  // Manejar búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset a la primera página
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  // Manejar filtro de estado
  const handleEstadoFilter = (event) => {
    setEstadoFilter(event.target.value);
    setPage(0);
  };

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Abrir formulario para crear
  const handleCreate = () => {
    setSelectedArea(null);
    setMode('create');
  };

  // Abrir formulario para editar
  const handleEdit = (area) => {
    setSelectedArea(area);
    setMode('edit');
  };

  // Abrir vista de detalle
  const handleView = (area) => {
    setSelectedArea(area);
    setMode('view');
  };

  // Confirmar eliminación
  const handleDelete = async (area) => {
    const result = await Swal.fire({
      title: '¿Eliminar Área?',
      text: `¿Estás seguro de que deseas eliminar el área "${area.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      confirmDelete(area);
    }
  };

  // Ejecutar eliminación
  const confirmDelete = async (area) => {
    try {
      setLoading(true);
      const response = await areasService.deleteArea(area.id);

      if (response.success) {
        Swal.fire('Eliminada', 'El área ha sido eliminada exitosamente', 'success');
        loadAreas(); // Recargar lista
      } else {
        const msg = response.message || 'Error al eliminar el área';
        Swal.fire('Error', msg, 'error');
      }
    } catch (error) {
      console.error('Error eliminando área:', error);
      const msg = error.response?.data?.message || 'Error al eliminar el área';
      Swal.fire('Error', msg, 'error');
    } finally {
      setLoading(false);
      setDeleteDialog(false);
      setAreaToDelete(null);
    }
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setMode(null);
    setSelectedArea(null);
  };

  // Manejar éxito del formulario
  const handleFormSuccess = () => {
    handleCloseForm();
    loadAreas(); // Recargar lista
  };

  // Obtener color del chip según estado
  const getEstadoColor = (estado) => {
    return estado === 'activo' ? 'success' : 'default';
  };

  // Obtener texto del estado
  const getEstadoText = (estado) => {
    return estado === 'activo' ? 'Activo' : 'Inactivo';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ mb: 2, overflow: 'hidden', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Box sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CategoryIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="h6" color="primary">
              Gestión de Áreas Educativas
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ borderRadius: 2 }}
          >
            Nueva Área
          </Button>
        </Box>

        {/* Barra de búsqueda y filtros */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buscar por nombre, descripción o código..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon />,
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
              sx={{ width: 400, minWidth: 300 }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={estadoFilter}
                onChange={handleEstadoFilter}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Tabla */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell align="center">Código</TableCell>
                <TableCell align="center">Nombre</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : areas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm || estadoFilter ? 'No se encontraron áreas con los filtros aplicados' : 'No hay áreas registradas'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                areas.map((area) => (
                  <TableRow key={area.id} hover>
                    <TableCell align="center">
                      <Chip
                        label={area.codigo}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {area.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {area.descripcion || 'Sin descripción'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getEstadoText(area.estado)}
                        color={getEstadoColor(area.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleView(area)}
                            color="info"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(area)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(area)}
                            color="error"
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

        {/* Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Formulario */}
      {mode && (
        <AreasForm
          open={!!mode}
          mode={mode}
          area={selectedArea}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Diálogo de confirmación de eliminación (fallback) */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el área "{areaToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => areaToDelete && confirmDelete(areaToDelete)}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AreasList;
