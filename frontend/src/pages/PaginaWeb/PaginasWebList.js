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
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Web as WebIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { webAdminApi } from '../../services/apiService';
import Swal from 'sweetalert2';

const PaginasWebList = () => {
  const navigate = useNavigate();
  const [paginas, setPaginas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // Estados para el menú de opciones
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  const cargarPaginas = async () => {
    try {
      setLoading(true);
      const response = await webAdminApi.getPages();

      if (response.data.success) {
        setPaginas(response.data.data || []);
        setTotal(response.data.data?.length || 0);
      } else {
        setError('Error al cargar las páginas');
      }
    } catch (error) {
      console.error('Error cargando páginas:', error);
      setError('Error al cargar las páginas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPaginas();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para abrir el menú de opciones
  const handleMenuOpen = (event, pagina) => {
    setAnchorEl(event.currentTarget);
    setSelectedPage(pagina);
  };

  // Función para cerrar el menú de opciones
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPage(null);
  };

  // Función para ver detalles
  const handleView = (pagina) => {
    navigate(`/dashboard/pagina-web/paginas/${pagina.id}`);
    handleMenuClose();
  };

  // Función para editar
  const handleEdit = (pagina) => {
    navigate(`/dashboard/pagina-web/paginas/${pagina.id}`);
    handleMenuClose();
  };

  // Función para eliminar
  const handleDelete = async (pagina) => {
    handleMenuClose();

    const result = await Swal.fire({
      title: 'Eliminar Página Permanentemente',
      text: `¿Está seguro de que desea ELIMINAR PERMANENTEMENTE la página "${pagina.titulo}"? Esta acción NO se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d32f2f',
    });

    if (result.isConfirmed) {
      try {
        await webAdminApi.deletePage(pagina.id);
        Swal.fire('Eliminado', 'La página ha sido eliminada permanentemente de la base de datos', 'success');
        cargarPaginas();
      } catch (error) {
        console.error('Error eliminando página:', error);
        Swal.fire('Error', 'No se pudo eliminar la página', 'error');
      }
    }
  };

  // Función para crear nueva página
  const handleCreate = () => {
    navigate('/dashboard/pagina-web/paginas/nueva');
  };

  // Filtrar páginas según el término de búsqueda
  const paginasFiltradas = paginas.filter(pagina =>
    pagina.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pagina.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pagina.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const paginasPaginadas = paginasFiltradas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ overflow: 'hidden', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {/* Header con icono y título */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <WebIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="h6" color="primary">
              Páginas Web
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Nueva Página
          </Button>
        </Box>

        {/* Barra de búsqueda */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            placeholder="Buscar páginas..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ width: 400 }}
          />
        </Box>

        {/* Tabla con formato estándar */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#61a7d1' }}>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Título
                </TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Slug
                </TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Estado
                </TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Fecha de Creación
                </TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginasPaginadas.map((pagina, index) => (
                <TableRow
                  key={pagina.id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#e7f1f8',
                    '&:hover': { backgroundColor: '#ffe6d9 !important' }
                  }}
                >
                  <TableCell align="center">{pagina.titulo}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={pagina.slug}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={pagina.estado}
                      color={pagina.estado === 'publicado' ? 'success' : 'warning'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {new Date(pagina.created_at).toLocaleDateString('es-ES')}
                  </TableCell>
              <TableCell align="center">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => handleMenuOpen(e, pagina)}
                  startIcon={<MoreVertIcon />}
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
          count={paginasFiltradas.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />

        {/* Menú de opciones */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        >
          <MenuItem onClick={() => handleView(selectedPage)}>
            <VisibilityIcon sx={{ mr: 1, color: 'info.main' }} />
            Ver Detalles
          </MenuItem>
          <MenuItem onClick={() => handleEdit(selectedPage)}>
            <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
            Editar Página
          </MenuItem>
          <MenuItem
            onClick={() => handleDelete(selectedPage)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Eliminar Página
          </MenuItem>
        </Menu>
      </Paper>
    </Box>
  );
};

export default PaginasWebList;
