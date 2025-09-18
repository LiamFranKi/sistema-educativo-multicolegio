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
  Menu,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Category as CategoryIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Print as PrintIcon
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

  // Estados para menú de opciones
  const [anchorEl, setAnchorEl] = useState(null);

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

  // Funciones para menú de opciones
  const handleMenuOpen = (event, area) => {
    setAnchorEl(event.currentTarget);
    setSelectedArea(area);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    if (selectedArea) {
      switch (action) {
        case 'view':
          handleView(selectedArea);
          break;
        case 'edit':
          handleEdit(selectedArea);
          break;
        case 'delete':
          handleDelete(selectedArea);
          break;
        case 'courses':
          // Sin funcionalidad por ahora (no-op)
          break;
        default:
          break;
      }
    }
    handleMenuClose();
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
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<CategoryIcon color="primary" sx={{ fontSize: 32 }} />}
          title={
            <Typography variant="h4" component="h1" color="primary">
              Gestión de Áreas Educativas
            </Typography>
          }
          subheader="Administra las áreas curriculares del sistema"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ mr: 1 }}
            >
              Nueva Área
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar áreas..."
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
                <InputLabel>Filtrar por Estado</InputLabel>
                <Select
                  value={estadoFilter}
                  onChange={handleEstadoFilter}
                  label="Filtrar por Estado"
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setEstadoFilter('');
                  setSearchTerm('');
                }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>


        {/* Tabla */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#61a7d1' }}>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : areas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm || estadoFilter ? 'No se encontraron áreas con los filtros aplicados' : 'No hay áreas registradas'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                areas.map((area) => (
                  <TableRow
                    key={area.id}
                    hover
                    sx={{
                      '&:nth-of-type(even)': { backgroundColor: '#e7f1f8' },
                      '&:nth-of-type(odd)': { backgroundColor: 'white' },
                      '&:hover': {
                        backgroundColor: '#ffe6d9 !important',
                        '& .MuiTableCell-root': {
                          backgroundColor: '#ffe6d9 !important'
                        }
                      }
                    }}
                  >
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
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => handleMenuOpen(e, area)}
                        endIcon={<MoreVertIcon />}
                        sx={{
                          minWidth: 100,
                          textTransform: 'none',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'white',
                            borderColor: 'primary.main'
                          }
                        }}
                      >
                        Opciones
                      </Button>
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

      {/* Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <ViewIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Ver Detalle" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('courses')}>
          <ListItemIcon>
            <BookIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Cursos del Área" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Editar Área" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Eliminar Área" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AreasList;
