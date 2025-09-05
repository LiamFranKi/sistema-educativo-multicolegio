import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getUserId } from '../services/authService';
import { userService } from '../services/apiService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (userId) {
        const response = await userService.getUserById(userId);
        if (response.success) {
          setUser(response.user);
          // Actualizar también el localStorage para mantener consistencia
          localStorage.setItem('usuario', JSON.stringify(response.user));
        }
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    // Actualizar también el localStorage
    localStorage.setItem('usuario', JSON.stringify(updatedUser));
  };

  const refreshUser = () => {
    loadUserData();
  };

  useEffect(() => {
    // Cargar datos iniciales del usuario
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
    } else {
      loadUserData();
    }
  }, []);

  const value = {
    user,
    loading,
    loadUserData,
    updateUser,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
