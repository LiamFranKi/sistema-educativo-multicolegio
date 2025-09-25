import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { cursosService } from '../../../services/apiService';
import { getImageUrl } from '../../../utils/imageUtils';
import CursosForm from './CursosForm';
import CursosView from './CursosView';
import Swal from 'sweetalert2';

const CursosList = () => {
  const [cursos, setCursos] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [nivelFilter, setNivelFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  // Estados para modales
  const [mode, setMode] = useState(null); // 'create', 'edit', 'view'
  const [selectedCurso, setSelectedCurso] = useState(null);

  // Estados para menú contextual
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadCursos();
    loadNiveles();
  }, [page, rowsPerPage, searchTerm, nivelFilter, estadoFilter]);

  const loadCursos = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        nivel_id: nivelFilter,
        activo: estadoFilter
      };

      const response = await cursosService.getCursos(params);

      if (response.success) {
        setCursos(response.data);
        setTotal(response.pagination?.total || 0);
        setError(null);
      } else {
        setError(response.message || 'Error al cargar cursos');
      }
    } catch (error) {
      console.error('Error cargando cursos:', error);
      setError('Error al cargar los cursos');
    } finally {
      setLoading(false);
    }
  };

  const loadNiveles = async () => {
    try {
      const response = await cursosService.getNiveles();
      if (response.success) {
        setNiveles(response.data);
      }
    } catch (error) {
      console.error('Error cargando niveles:', error);
    }
  };

  // Handlers de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers de búsqueda y filtros
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleNivelFilterChange = (event) => {
    setNivelFilter(event.target.value);
    setPage(0);
  };

  const handleEstadoFilterChange = (event) => {
    setEstadoFilter(event.target.value);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setNivelFilter('');
    setEstadoFilter('');
    setPage(0);
  };

  // Handlers de menú contextual
  const handleMenuOpen = (event, cursoId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(cursoId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleMenuAction = async (action) => {
    const curso = cursos.find(c => c.id === selectedRowId);
    setSelectedCurso(curso);
    handleMenuClose();

    switch (action) {
      case 'view':
        setMode('view');
        break;
      case 'edit':
        setMode('edit');
        break;
      case 'delete':
        await handleDelete(curso);
        break;
      default:
        break;
    }
  };

  // Handlers de modales
  const handleCreate = () => {
    setSelectedCurso(null);
    setMode('create');
  };

  const handleView = (curso) => {
    setSelectedCurso(curso);
    setMode('view');
  };

  const handleEdit = (curso) => {
    setSelectedCurso(curso);
    setMode('edit');
  };

  const handleDelete = async (curso) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el curso "${curso.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await cursosService.deleteCurso(curso.id);
        if (response.success) {
          await Swal.fire('Eliminado', 'El curso ha sido eliminado exitosamente', 'success');
          loadCursos();
        } else {
          await Swal.fire('Error', response.message || 'Error al eliminar el curso', 'error');
        }
      } catch (error) {
        console.error('Error eliminando curso:', error);
        await Swal.fire('Error', 'Error al eliminar el curso', 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setMode(null);
    setSelectedCurso(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    loadCursos();
  };

  // Función para obtener el color del chip según el estado
  const getEstadoColor = (activo) => {
    return activo ? 'success' : 'error';
  };

  // Función para obtener el texto del estado
  const getEstadoText = (activo) => {
    return activo ? 'Activo' : 'Inactivo';
  };

  // Función para construir URL de imagen
  const buildImageUrl = (imagen) => {
    return getImageUrl(imagen);
  };

  if (loading && cursos.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<SchoolIcon color="primary" sx={{ fontSize: 32 }} />}
          title={
            <Typography variant="h4" component="h1" color="primary">
              Gestión de Cursos
            </Typography>
          }
          subheader="Administra los cursos del sistema educativo"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Búsqueda */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre, descripción o abreviatura..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>

            {/* Filtro por nivel */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Nivel</InputLabel>
                <Select
                  value={nivelFilter}
                  onChange={handleNivelFilterChange}
                  label="Nivel"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {niveles.map((nivel) => (
                    <MenuItem key={nivel.id} value={nivel.id}>
                      {nivel.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Filtro por estado */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estadoFilter}
                  onChange={handleEstadoFilterChange}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Activo</MenuItem>
                  <MenuItem value="false">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Botones */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearSearch}
                  size="small"
                >
                  Limpiar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreate}
                  size="small"
                >
                  Nuevo Curso
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabla */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#61a7d1' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Imagen</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Abreviatura</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nivel</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cursos.map((curso, index) => (
                <TableRow
                  key={curso.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#e7f1f8',
                    '&:hover': { backgroundColor: '#ffe6d9 !important' }
                  }}
                >
                  <TableCell>
                    <Avatar
                      src={buildImageUrl(curso.imagen)}
                      alt={curso.nombre}
                      sx={{ width: 40, height: 40 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {curso.nombre}
                    </Typography>
                    {curso.descripcion && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {curso.descripcion.length > 50
                          ? `${curso.descripcion.substring(0, 50)}...`
                          : curso.descripcion
                        }
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={curso.abreviatura}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={curso.nivel_nombre}
                      size="small"
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getEstadoText(curso.activo)}
                      size="small"
                      color={getEstadoColor(curso.activo)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<MoreVertIcon />}
                      onClick={(e) => handleMenuOpen(e, curso.id)}
                    >
                      Opciones
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <VisibilityIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Ver Detalle" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Editar Curso" />
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Eliminar Curso" />
        </MenuItem>
      </Menu>

      {/* Modales */}
      {mode === 'create' && (
        <CursosForm
          open={true}
          onClose={handleCloseModal}
          onSaveSuccess={handleSaveSuccess}
          niveles={niveles}
        />
      )}

      {mode === 'edit' && selectedCurso && (
        <CursosForm
          open={true}
          onClose={handleCloseModal}
          onSaveSuccess={handleSaveSuccess}
          curso={selectedCurso}
          niveles={niveles}
        />
      )}

      {mode === 'view' && selectedCurso && (
        <CursosView
          open={true}
          onClose={handleCloseModal}
          curso={selectedCurso}
        />
      )}
    </Box>
  );
};

export default CursosList;
