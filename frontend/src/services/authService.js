// Servicio de autenticación
const TOKEN_KEY = 'sistema_educativo_token';
const USER_KEY = 'sistema_educativo_user';

// Obtener token del localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Guardar token en localStorage
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Obtener información del usuario del localStorage
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Guardar información del usuario en localStorage
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Obtener rol del usuario
export const getUserRole = () => {
  const user = getUser();
  return user ? user.rol : null;
};

// Obtener ID del usuario
export const getUserId = () => {
  const user = getUser();
  return user ? user.id : null;
};

// Obtener colegio del usuario (si aplica)
export const getUserColegio = () => {
  const user = getUser();
  return user ? user.colegio_id : null;
};

// Remover token y datos del usuario
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Verificar si el usuario tiene un rol específico
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

// Verificar si el usuario tiene alguno de los roles especificados
export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

// Obtener headers para las peticiones API
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
