import axios from 'axios';
import { getAuthHeaders, removeToken } from './authService';

// Configuración base de axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    console.log('Token enviado:', headers.Authorization ? 'SÍ' : 'NO');
    config.headers.Authorization = headers.Authorization;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (dni, clave) => {
    const response = await api.post('/auth/login', { dni, clave });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Servicios de usuarios
export const userService = {
  getUsers: async (params = {}) => {
    try {
      console.log('Llamando a /usuarios con params:', params);
      const response = await api.get('/usuarios', { params });
      console.log('Respuesta completa de /usuarios:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getUsers service:', error);
      console.error('Error response:', error.response);
      // Devolver un objeto con estructura esperada en caso de error
      return {
        data: [],
        total: 0,
        error: error.message
      };
    }
  },

  getUserById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },

  verifyDNI: async (dni, rol) => {
    const response = await api.get('/usuarios/verificar-dni', {
      params: { dni, rol }
    });
    return response.data;
  },
};



// Servicios de años escolares
export const anioEscolarService = {
  getAniosEscolares: async (params = {}) => {
    const response = await api.get('/anios-escolares', { params });
    return response.data;
  },

  getAnioEscolar: async (id) => {
    const response = await api.get(`/anios-escolares/${id}`);
    return response.data;
  },

  createAnioEscolar: async (anioData) => {
    const response = await api.post('/anios-escolares', anioData);
    return response.data;
  },

  updateAnioEscolar: async (id, anioData) => {
    const response = await api.put(`/anios-escolares/${id}`, anioData);
    return response.data;
  },

  deleteAnioEscolar: async (id) => {
    const response = await api.delete(`/anios-escolares/${id}`);
    return response.data;
  },

  setAnioActual: async (anio) => {
    const response = await api.put('/configuracion/anio-actual', { anio });
    return response.data;
  },
};

// Servicios de publicaciones
export const publicacionService = {
  getPublicaciones: async (params = {}) => {
    const response = await api.get('/publicaciones', { params });
    return response.data;
  },

  createPublicacion: async (publicacionData) => {
    const response = await api.post('/publicaciones', publicacionData);
    return response.data;
  },

  updatePublicacion: async (id, publicacionData) => {
    const response = await api.put(`/publicaciones/${id}`, publicacionData);
    return response.data;
  },

  deletePublicacion: async (id) => {
    const response = await api.delete(`/publicaciones/${id}`);
    return response.data;
  },

  reaccionar: async (id, tipoReaccion) => {
    const response = await api.post(`/publicaciones/${id}/reaccionar`, {
      tipo_reaccion: tipoReaccion
    });
    return response.data;
  },

  comentar: async (id, contenido) => {
    const response = await api.post(`/publicaciones/${id}/comentar`, {
      contenido
    });
    return response.data;
  },
};

// Servicios de notificaciones
export const notificacionService = {
  getNotificaciones: async (params = {}) => {
    const response = await api.get('/notificaciones', { params });
    return response.data;
  },

  getNotificacionesNoLeidas: async () => {
    const response = await api.get('/notificaciones/no-leidas');
    return response.data;
  },

  marcarComoLeida: async (id) => {
    const response = await api.put(`/notificaciones/${id}/leer`);
    return response.data;
  },

  marcarTodasComoLeidas: async () => {
    const response = await api.put('/notificaciones/leer-todas');
    return response.data;
  },

  deleteNotificacion: async (id) => {
    const response = await api.delete(`/notificaciones/${id}`);
    return response.data;
  },

  suscribirWebPush: async (subscription) => {
    const response = await api.post('/notificaciones/suscripcion-web-push', subscription);
    return response.data;
  },
};

// Servicios de archivos
export const fileService = {
  uploadFile: async (file, type = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteFile: async (filename) => {
    const response = await api.delete(`/files/${filename}`);
    return response.data;
  },
};

// Servicios de configuración
export const configuracionService = {
  getConfiguraciones: async () => {
    const response = await api.get('/configuracion');
    return response.data;
  },

  getColegio: async () => {
    const response = await api.get('/configuracion/colegio');
    return response.data;
  },

  updateColegio: async (data) => {
    const response = await api.put('/configuracion/colegio', data);
    return response.data;
  },

  updateConfiguracion: async (clave, valor) => {
    const response = await api.put(`/configuracion/${clave}`, { valor });
    return response.data;
  },
};

// Servicios de niveles educativos
export const nivelesService = {
  getNiveles: async () => {
    const response = await api.get('/niveles');
    return response.data;
  },

  getNivel: async (id) => {
    const response = await api.get(`/niveles/${id}`);
    return response.data;
  },

  createNivel: async (data) => {
    const response = await api.post('/niveles', data);
    return response.data;
  },

  updateNivel: async (id, data) => {
    const response = await api.put(`/niveles/${id}`, data);
    return response.data;
  },

  deleteNivel: async (id) => {
    const response = await api.delete(`/niveles/${id}`);
    return response.data;
  },
};

// Servicios de grados
export const gradosService = {
  getGrados: async (params = {}) => {
    const response = await api.get('/grados', { params });
    return response.data;
  },

  getGrado: async (id) => {
    const response = await api.get(`/grados/${id}`);
    return response.data;
  },

  createGrado: async (gradoData) => {
    const response = await api.post('/grados', gradoData);
    return response.data;
  },

  updateGrado: async (id, gradoData) => {
    const response = await api.put(`/grados/${id}`, gradoData);
    return response.data;
  },

  deleteGrado: async (id) => {
    const response = await api.delete(`/grados/${id}`);
    return response.data;
  },

  getGradosByNivel: async (nivelId) => {
    const response = await api.get(`/grados/nivel/${nivelId}`);
    return response.data;
  },

  // Nuevas funciones para la estructura actualizada
  getNivelesDisponibles: async () => {
    const response = await api.get('/grados/niveles/disponibles');
    return response.data;
  },

  getGradosPorNivel: async (nivelId) => {
    const response = await api.get(`/grados/grados-por-nivel/${nivelId}`);
    return response.data;
  },

  getSeccionesDisponibles: async () => {
    const response = await api.get('/grados/secciones/disponibles');
    return response.data;
  },

  getAniosEscolares: async () => {
    const response = await api.get('/grados/anios-escolares');
    return response.data;
  },

  getTurnosDisponibles: async () => {
    const response = await api.get('/turnos');
    return response.data.turnos || [];
  },
};

// Servicios de áreas educativas
export const areasService = {
  getAreas: async (params = {}) => {
    const response = await api.get('/areas', { params });
    return response.data;
  },

  getArea: async (id) => {
    const response = await api.get(`/areas/${id}`);
    return response.data;
  },

  createArea: async (areaData) => {
    const response = await api.post('/areas', areaData);
    return response.data;
  },

  updateArea: async (id, areaData) => {
    const response = await api.put(`/areas/${id}`, areaData);
    return response.data;
  },

  deleteArea: async (id) => {
    const response = await api.delete(`/areas/${id}`);
    return response.data;
  },
};

// Servicios de turnos
export const turnosService = {
  getTurnos: async (params = {}) => {
    const response = await api.get('/turnos', { params });
    return response.data;
  },

  getTurno: async (id) => {
    const response = await api.get(`/turnos/${id}`);
    return response.data;
  },

  createTurno: async (turnoData) => {
    const response = await api.post('/turnos', turnoData);
    return response.data;
  },

  updateTurno: async (id, turnoData) => {
    const response = await api.put(`/turnos/${id}`, turnoData);
    return response.data;
  },

  deleteTurno: async (id) => {
    const response = await api.delete(`/turnos/${id}`);
    return response.data;
  },
};

export default api;
