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
    const response = await api.get('/usuarios', { params });
    return response.data;
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

// Servicios de colegios
export const colegioService = {
  getColegios: async () => {
    const response = await api.get('/colegios');
    return response.data;
  },

  getColegioById: async (id) => {
    const response = await api.get(`/colegios/${id}`);
    return response.data;
  },

  createColegio: async (colegioData) => {
    const response = await api.post('/colegios', colegioData);
    return response.data;
  },

  updateColegio: async (id, colegioData) => {
    const response = await api.put(`/colegios/${id}`, colegioData);
    return response.data;
  },

  deleteColegio: async (id) => {
    const response = await api.delete(`/colegios/${id}`);
    return response.data;
  },
};

// Servicios de años escolares
export const anioEscolarService = {
  getAniosEscolares: async (colegioId) => {
    const response = await api.get('/anios-escolares', {
      params: { colegio_id: colegioId }
    });
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

export default api;
