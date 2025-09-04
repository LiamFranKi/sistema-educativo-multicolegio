import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
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
  Chip,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { userService } from '../../../services/apiService';
import { getUser, getUserRole } from '../../../services/authService';

// Componentes
import UsuarioForm from './UsuarioForm';
import UsuarioView from './UsuarioView';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';

const UsuariosList = () => {
  // Estados siguiendo el patrón CRUD
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Estados de paginación
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0
  });

  // Función para cargar datos
  const loadData = async () => {
    setLoading(true);
    try {
      // Verificar usuario logueado
      const currentUser = getUser();
      const userRole = getUserRole();
      console.log('Usuario logueado:', currentUser);
      console.log('Rol del usuario:', userRole);
      console.log('Cargando usuarios...', { page: pagination.page + 1, limit: pagination.rowsPerPage, search: searchTerm });

      const response = await userService.getUsers({
        page: pagination.page + 1,
        limit: pagination.rowsPerPage,
        search: searchTerm
      });

      console.log('Respuesta de la API:', response);

      // Asegurar que siempre sea un array
      // La API devuelve { success: true, usuarios: [...], pagination: {...} }
      const usersData = Array.isArray(response.usuarios) ? response.usuarios :
                       Array.isArray(response.data) ? response.data :
                       Array.isArray(response) ? response : [];

      console.log('Datos de usuarios procesados:', usersData);

      setData(usersData);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || response.total || usersData.length || 0
      }));
    } catch (error) {
      console.error('Error loading users:', error);

      // Si hay error, mostrar datos simulados para desarrollo
      const mockData = [
        {
          id: 1,
          nombres: 'Juan Pérez García',
          dni: '12345678',
          email: 'juan.perez@email.com',
          telefono: '987654321',
          fecha_nacimiento: '1990-05-15',
          foto: '',
          activo: true,
          rol: 'Administrador',
          created_at: '2024-12-19T10:00:00Z'
        },
        {
          id: 2,
          nombres: 'María López Silva',
          dni: '87654321',
          email: 'maria.lopez@email.com',
          telefono: '987654322',
          fecha_nacimiento: '1985-08-20',
          foto: '',
          activo: true,
          rol: 'Docente',
          created_at: '2024-12-19T10:00:00Z'
        },
        {
          id: 3,
          nombres: 'Carlos Rodríguez',
          dni: '11223344',
          email: 'carlos.rodriguez@email.com',
          telefono: '987654323',
          fecha_nacimiento: '2000-03-10',
          foto: '',
          activo: false,
          rol: 'Alumno',
          created_at: '2024-12-19T10:00:00Z'
        }
      ];

      setData(mockData);
      setPagination(prev => ({ ...prev, total: mockData.length }));
      toast.error('Error al cargar los usuarios. Mostrando datos de ejemplo.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.rowsPerPage, searchTerm]);

  // Funciones siguiendo el patrón CRUD
  const handleCreate = () => {
    setSelectedItem(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await userService.deleteUser(itemToDelete);

      toast.success('Usuario eliminado permanentemente de la base de datos');
      setConfirmDialogOpen(false);
      setItemToDelete(null);
      await loadData();
    } catch (error) {
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSave = async (formData) => {
    try {
      if (dialogMode === 'create') {
        await userService.createUser(formData);
        toast.success('Usuario creado correctamente');
      } else {
        await userService.updateUser(selectedItem.id, formData);
        toast.success('Usuario actualizado correctamente');
      }
      handleCloseDialog();
      await loadData();
    } catch (error) {
      toast.error('Error al guardar el usuario');
    }
  };

  // Funciones de búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPagination(prev => ({ ...prev, page: 0 })); // Reset a la primera página
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  // Funciones de paginación
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

  // Función para obtener el color del rol
  const getRoleColor = (rol) => {
    const colors = {
      'Administrador': 'primary',
      'Docente': 'secondary',
      'Alumno': 'success',
      'Apoderado': 'warning',
      'Tutor': 'info'
    };
    return colors[rol] || 'default';
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Función para construir URL de imagen
  const getImageUrl = (filename) => {
    if (!filename) return null;
    // Si ya es una URL completa, devolverla tal como está
    if (filename.startsWith('http')) return filename;
    // Construir URL del servidor
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${filename}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Contenedor principal siguiendo el patrón de diseño */}
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header con título y botón "Nuevo" */}
        <Box sx={{
          p: 3,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5" color="primary">
            Gestión de Usuarios
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ borderRadius: 2 }}
          >
            Nuevo Usuario
          </Button>
        </Box>

        {/* Barra de búsqueda */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            placeholder="Buscar por nombre, DNI o email..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: 400 }}
          />
        </Box>

        {/* Tabla */}
        <TableContainer>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Cargando usuarios...</Typography>
            </Box>
          ) : data.length === 0 ? (
            <Box sx={{
              p: 4,
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>
                No hay usuarios disponibles
              </Typography>
              <Typography variant="body2">
                {searchTerm ? 'No se encontraron usuarios con ese criterio de búsqueda' : 'Comienza creando un nuevo usuario'}
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell align="center">Foto</TableCell>
                  <TableCell align="center">Nombres</TableCell>
                  <TableCell align="center">DNI</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Teléfono</TableCell>
                  <TableCell align="center">Rol</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Fecha de Nacimiento</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((usuario) => (
                  <TableRow
                    key={usuario.id}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <TableCell align="center">
                      <Avatar
                        src={getImageUrl(usuario.foto)}
                        sx={{ width: 40, height: 40 }}
                      >
                        {usuario.nombres.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {usuario.nombres}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {usuario.dni}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {usuario.email}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {usuario.telefono}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={usuario.rol}
                        color={getRoleColor(usuario.rol)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={usuario.activo ? 'Activo' : 'Inactivo'}
                        color={usuario.activo ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {formatDate(usuario.fecha_nacimiento)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(usuario)}
                          sx={{
                            color: 'info.main',
                            '&:hover': { backgroundColor: 'info.light', color: 'white' }
                          }}
                          title="Ver"
                        >
                          <VisibilityIcon />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleEdit(usuario)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                          }}
                          title="Editar"
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleDelete(usuario.id)}
                          sx={{
                            color: 'error.main',
                            '&:hover': { backgroundColor: 'error.light', color: 'white' }
                          }}
                          title="Eliminar"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Paginación */}
        {data.length > 0 && (
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
            sx={{ borderTop: '1px solid #e0e0e0' }}
          />
        )}
      </Paper>

      {/* Modales */}
      <UsuarioForm
        open={dialogOpen && (dialogMode === 'create' || dialogMode === 'edit')}
        onClose={handleCloseDialog}
        onSave={handleSave}
        mode={dialogMode}
        usuario={selectedItem}
      />

      <UsuarioView
        open={dialogOpen && dialogMode === 'view'}
        onClose={handleCloseDialog}
        usuario={selectedItem}
        onEdit={handleEdit}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario Permanentemente"
        message="¿Está seguro de que desea ELIMINAR PERMANENTEMENTE este usuario? El usuario será borrado completamente de la base de datos y esta acción NO se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="error"
      />
    </Box>
  );
};

export default UsuariosList;
