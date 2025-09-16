import React, { useState, useEffect, useCallback } from 'react';
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
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
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  QrCode as QrCodeIcon,
  Security as SecurityIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { userService } from '../../../services/apiService';
import { getUser, getUserRole } from '../../../services/authService';

// Componentes
import UsuarioForm from './UsuarioForm';
import UsuarioView from './UsuarioView';
import UsuarioPermisosForm from './UsuarioPermisosForm';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';

const UsuariosList = () => {
  // Estados siguiendo el patrón CRUD
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'view'
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Estados para menú de opciones
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados para formularios
  const [showPermisosForm, setShowPermisosForm] = useState(false);

  // Estados de paginación
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0
  });

  // Función para cargar datos
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Verificar usuario logueado
      const currentUser = getUser();
      const userRole = getUserRole();
      console.log('Usuario logueado:', currentUser);
      console.log('Rol del usuario:', userRole);
      console.log('Cargando usuarios...', { page: pagination.page + 1, limit: pagination.rowsPerPage, search: searchTerm, rol: roleFilter });

      const response = await userService.getUsers({
        page: pagination.page + 1,
        limit: pagination.rowsPerPage,
        search: searchTerm,
        rol: roleFilter
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
  }, [pagination.page, pagination.rowsPerPage, searchTerm, roleFilter]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, [loadData]);

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

  // Funciones para menú de opciones
  const handleMenuOpen = (event, usuario) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(usuario);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // Función para manejar la actualización de permisos
  const handleUpdatePermisos = useCallback(async (userId, permisosData) => {
    try {
      await userService.updateUserPermissions(userId, permisosData);
      toast.success('Permisos actualizados exitosamente');
      setShowPermisosForm(false);
      setSelectedUser(null);
      handleMenuClose(); // Cerrar el menú
      loadData(); // Recargar la lista
    } catch (error) {
      console.error('Error actualizando permisos:', error);
      if (error?.response?.data) {
        console.error('Respuesta del servidor:', error.response.data);
        toast.error(error.response.data.message || 'Error al actualizar los permisos');
      } else {
        toast.error('Error al actualizar los permisos');
      }
    }
  }, [loadData]);

  const handleMenuAction = (action) => {
    if (selectedUser) {
      switch (action) {
        case 'view':
          handleView(selectedUser);
          handleMenuClose();
          break;
        case 'edit':
          handleEdit(selectedUser);
          handleMenuClose();
          break;
        case 'permissions':
          console.log('Abriendo formulario de permisos para usuario:', selectedUser);
          setShowPermisosForm(true);
          // No cerrar el menú aquí para mantener selectedUser
          break;
        case 'delete':
          handleDelete(selectedUser.id);
          handleMenuClose();
          break;
        case 'qr':
          // Futura funcionalidad: imprimir QR
          toast.success('Funcionalidad de QR próximamente');
          handleMenuClose();
          break;
        default:
          handleMenuClose();
          break;
      }
    }
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

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
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
      'Tutor': 'info',
      'Psicologia': 'info',
      'Secretaria': 'warning',
      'Director': 'secondary',
      'Promotor': 'primary'
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
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<PersonIcon color="primary" sx={{ fontSize: 32 }} />}
          title={
            <Typography variant="h4" component="h1" color="primary">
              Gestión de Usuarios
            </Typography>
          }
          subheader="Administra los usuarios del sistema"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ mr: 1 }}
            >
              Nuevo Usuario
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar usuarios..."
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
                      <IconButton onClick={handleClear} size="small">
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
                <InputLabel id="usuarios-filtro-rol-label">Filtrar por Rol</InputLabel>
                <Select
                  id="usuarios-filtro-rol"
                  name="filtro_rol"
                  labelId="usuarios-filtro-rol-label"
                  value={roleFilter}
                  onChange={handleRoleFilterChange}
                  label="Filtrar por Rol"
                >
                  <MenuItem value="">Todos los roles</MenuItem>
                  <MenuItem value="Administrador">Administrador</MenuItem>
                  <MenuItem value="Docente">Docente</MenuItem>
                  <MenuItem value="Alumno">Alumno</MenuItem>
                  <MenuItem value="Apoderado">Apoderado</MenuItem>
                  <MenuItem value="Tutor">Tutor</MenuItem>
                  <MenuItem value="Psicologia">Psicología</MenuItem>
                  <MenuItem value="Secretaria">Secretaría</MenuItem>
                  <MenuItem value="Director">Director</MenuItem>
                  <MenuItem value="Promotor">Promotor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setRoleFilter('');
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
                <TableRow sx={{ backgroundColor: '#61a7d1' }}>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Foto</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Nombres</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>DNI</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Teléfono</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Rol</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Fecha de Nacimiento</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((usuario) => (
                  <TableRow
                    key={usuario.id}
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
                        src={getImageUrl(usuario.foto)}
                        sx={{ width: 40, height: 40 }}
                      >
                        {usuario.nombres.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {usuario.nombres} {usuario.apellidos}
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
                      <Typography variant="body2">
                        {formatDate(usuario.fecha_nacimiento)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => handleMenuOpen(e, usuario)}
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
            <VisibilityIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Ver Detalles" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Editar Usuario" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('qr')}>
          <ListItemIcon>
            <QrCodeIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Imprimir Código QR" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('permissions')}>
          <ListItemIcon>
            <SecurityIcon color="warning" />
          </ListItemIcon>
          <ListItemText primary="Gestionar Permisos" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Eliminar Usuario" />
        </MenuItem>
      </Menu>

      {/* Formulario de Permisos */}
      <UsuarioPermisosForm
        open={showPermisosForm}
        onClose={() => {
          setShowPermisosForm(false);
          setSelectedUser(null);
          handleMenuClose(); // Cerrar el menú también
        }}
        onSave={handleUpdatePermisos}
        usuario={selectedUser}
      />
    </Box>
  );
};

export default UsuariosList;
