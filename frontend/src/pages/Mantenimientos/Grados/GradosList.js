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
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Class as ClassIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Print as PrintIcon,
  QrCode as QrCodeIcon,
  Assignment as AssignmentIcon,
  ThumbUpAlt as ThumbUpAltIcon
} from '@mui/icons-material';
import { gradosService, nivelesService } from '../../../services/apiService';
import Swal from 'sweetalert2';
import GradosFormNew from './GradosFormNew';
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

  // Estados para menú de opciones
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGrado, setSelectedGrado] = useState(null);

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
      console.log('Grados cargados:', response.grados);
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

  // Funciones para menú de opciones
  const handleMenuOpen = (event, grado) => {
    setAnchorEl(event.currentTarget);
    setSelectedGrado(grado);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGrado(null);
  };

  const handleMenuAction = (action) => {
    if (selectedGrado) {
      switch (action) {
        case 'view':
          handleView(selectedGrado);
          break;
        case 'edit':
          handleEdit(selectedGrado);
          break;
        case 'delete':
          handleDelete(selectedGrado);
          break;
        // Acciones sin funcionalidad implementada: no hacer nada por ahora
        case 'students':
        case 'schedule':
        case 'attendance':
        case 'qr':
        case 'grades':
        case 'remarks':
          break;
        default:
          break;
      }
    }
    handleMenuClose();
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
              <TableRow sx={{ backgroundColor: '#61a7d1' }}>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Foto</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Grado</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Sección</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Año</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Turno</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Nivel</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Alumnos</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grados.map((grado) => (
                <TableRow
                  key={grado.id}
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
                    <Avatar
                      src={grado.foto && grado.foto !== 'default-grado.png' ?
                        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${grado.foto}` :
                        null
                      }
                      sx={{ width: 50, height: 50, mx: 'auto', fontSize: '1.2rem' }}
                    >
                      {(!grado.foto || grado.foto === 'default-grado.png') && (grado.nombre ? grado.nombre.charAt(0).toUpperCase() : 'G')}
                    </Avatar>
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
                      label={grado.seccion || 'Única'}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {grado.anio_escolar}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={grado.turno || 'Mañana'}
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
                    <Typography variant="body2" fontWeight="medium" color="primary">
                      {grado.cantidad_alumnos || 0}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => handleMenuOpen(e, grado)}
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
        <GradosFormNew
          grado={editingGrado}
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

        <MenuItem onClick={() => handleMenuAction('students')}>
          <ListItemIcon>
            <PeopleIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Lista de Estudiantes" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('schedule')}>
          <ListItemIcon>
            <CalendarIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Ver Horario" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('attendance')}>
          <ListItemIcon>
            <ClassIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary="Registro de Asistencia" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('qr')}>
          <ListItemIcon>
            <QrCodeIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Imprimir Códigos QR" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('grades')}>
          <ListItemIcon>
            <AssignmentIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Registro de Notas Detalladas" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('remarks')}>
          <ListItemIcon>
            <ThumbUpAltIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Apreciaciones / Recomendaciones" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Editar Grado" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Eliminar Grado" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default GradosList;
