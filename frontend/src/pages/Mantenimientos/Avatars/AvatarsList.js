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
  Divider,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Face as FaceIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { avatarsService } from '../../../services/apiService';
import AvatarsForm from './AvatarsForm';
import AvatarsView from './AvatarsView';
import { getImageUrl } from '../../../utils/imageUtils';

const AvatarsList = () => {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nivelFilter, setNivelFilter] = useState('');
  const [generoFilter, setGeneroFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [mode, setMode] = useState(null); // 'create', 'edit', 'view'
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [avatarToDelete, setAvatarToDelete] = useState(null);

  // Estados para menú de opciones
  const [anchorEl, setAnchorEl] = useState(null);

  // Cargar avatars
  const loadAvatars = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined,
        nivel: nivelFilter || undefined,
        genero: generoFilter || undefined,
      };

      const response = await avatarsService.getAvatars(params);

      if (response.success) {
        setAvatars(response.data || []);
        setTotalItems(response.pagination?.total || 0);
      } else {
        setError(response.message || 'Error al cargar avatars');
      }
    } catch (error) {
      console.error('Error cargando avatars:', error);
      setError('Error al cargar los avatars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvatars();
  }, [page, rowsPerPage, searchTerm, nivelFilter, generoFilter]);

  // Manejar búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('');
    setNivelFilter('');
    setGeneroFilter('');
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

  // Abrir formulario de creación
  const handleCreate = () => {
    setSelectedAvatar(null);
    setMode('create');
  };

  // Abrir formulario de edición
  const handleEdit = (avatar) => {
    console.log('handleEdit llamado con avatar:', avatar);
    setSelectedAvatar(avatar);
    setMode('edit');
    console.log('Estados establecidos - selectedAvatar:', avatar, 'mode: edit');
  };

  // Abrir vista de detalle
  const handleView = (avatar) => {
    console.log('handleView llamado con avatar:', avatar);
    setSelectedAvatar(avatar);
    setMode('view');
    console.log('Estados establecidos - selectedAvatar:', avatar, 'mode: view');
  };

  // Cerrar formulario/vista
  const handleClose = () => {
    setMode(null);
    setSelectedAvatar(null);
    handleMenuClose(); // Asegurar que el menú se cierre
    loadAvatars();
  };

  // Manejar menú de opciones
  const handleMenuOpen = (event, avatar) => {
    setAnchorEl(event.currentTarget);
    setSelectedAvatar(avatar);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAvatar(null);
  };

  // Manejar acciones del menú
  const handleMenuAction = (action) => {
    const avatar = selectedAvatar; // Capturar el avatar antes de cerrar el menú
    console.log('handleMenuAction:', { action, avatar, selectedAvatar });
    handleMenuClose(); // Cerrar menú primero

    switch (action) {
      case 'view':
        console.log('Abriendo vista para avatar:', avatar);
        handleView(avatar);
        break;
      case 'edit':
        console.log('Abriendo edición para avatar:', avatar);
        handleEdit(avatar);
        break;
      case 'delete':
        handleDelete(avatar);
        break;
      default:
        break;
    }
  };

  // Manejar eliminación
  const handleDelete = (avatar) => {
    setAvatarToDelete(avatar);
    setDeleteDialog(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    try {
      const response = await avatarsService.deleteAvatar(avatarToDelete.id);

      if (response.success) {
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El avatar ha sido eliminado exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        loadAvatars();
      } else {
        Swal.fire({
          title: 'Error',
          text: response.message || 'Error al eliminar el avatar',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error eliminando avatar:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al eliminar el avatar',
        icon: 'error'
      });
    } finally {
      setDeleteDialog(false);
      setAvatarToDelete(null);
    }
  };

  // Obtener color del chip según el nivel
  const getNivelColor = (nivel) => {
    if (nivel <= 5) return 'success';
    if (nivel <= 10) return 'info';
    if (nivel <= 15) return 'warning';
    return 'error';
  };


  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<FaceIcon sx={{ fontSize: 32, color: '#1976d2' }} />}
          title={
            <Typography variant="h4" component="h1" color="primary">
              Gestión de Avatars
            </Typography>
          }
          subheader="Administra los avatars del sistema gamificado"
          sx={{ backgroundColor: '#f5f5f5' }}
        />
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Búsqueda */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={handleSearch}
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
                  onChange={(e) => setNivelFilter(e.target.value)}
                  label="Nivel"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((nivel) => (
                    <MenuItem key={nivel} value={nivel}>
                      Nivel {nivel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Filtro por género */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Género</InputLabel>
                <Select
                  value={generoFilter}
                  onChange={(e) => setGeneroFilter(e.target.value)}
                  label="Género"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
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
                  Nuevo Avatar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#61a7d1' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Avatar</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nivel</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Género</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Puntos</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Alert severity="error">{error}</Alert>
                  </TableCell>
                </TableRow>
              ) : avatars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron avatars
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                avatars.map((avatar, index) => (
                  <TableRow
                    key={avatar.id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? 'white' : '#e7f1f8',
                      '&:hover': {
                        backgroundColor: '#ffe6d9 !important',
                        '& .MuiTableCell-root': {
                          backgroundColor: '#ffe6d9 !important'
                        }
                      }
                    }}
                  >
                    <TableCell>
                      <Avatar
                        src={getImageUrl(avatar.imagen, 'avatars')}
                        alt={avatar.nombre}
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {avatar.nombre}
                      </Typography>
                      {avatar.descripcion && (
                        <Typography variant="caption" color="text.secondary">
                          {avatar.descripcion.length > 50
                            ? `${avatar.descripcion.substring(0, 50)}...`
                            : avatar.descripcion
                          }
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`Nivel ${avatar.nivel}`}
                        color={getNivelColor(avatar.nivel)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={avatar.genero}
                        color={avatar.genero === 'Masculino' ? 'primary' : 'secondary'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                        <Typography variant="body2" fontWeight="medium">
                          {avatar.puntos.toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => handleMenuOpen(e, avatar)}
                        endIcon={<MoreVertIcon />}
                        sx={{
                          minWidth: 'auto',
                          px: 1,
                          py: 0.5,
                          fontSize: '0.75rem',
                          textTransform: 'none'
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
          component="div"
          count={totalItems}
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

        <MenuItem onClick={() => handleMenuAction('edit')}>
          <ListItemIcon>
            <EditIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Editar Avatar" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Eliminar Avatar" />
        </MenuItem>
      </Menu>

      {/* Formulario/Vista */}
      {(mode === 'create' || mode === 'edit' || mode === 'view') && (
        <AvatarsForm
          open={mode === 'create' || mode === 'edit'}
          onClose={handleClose}
          avatar={selectedAvatar}
          mode={mode}
        />
      )}

      {mode === 'view' && (
        <AvatarsView
          open={mode === 'view'}
          onClose={handleClose}
          avatar={selectedAvatar}
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el avatar "{avatarToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvatarsList;
