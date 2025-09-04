import React, { createContext, useContext, useState, useEffect } from 'react';
import { configuracionService } from '../services/apiService';
import { getColegioLogoUrl } from '../utils/imageUtils';

const ConfiguracionContext = createContext();

export const useConfiguracion = () => {
  const context = useContext(ConfiguracionContext);
  if (!context) {
    throw new Error('useConfiguracion debe ser usado dentro de ConfiguracionProvider');
  }
  return context;
};

export const ConfiguracionProvider = ({ children }) => {
  const [colegio, setColegio] = useState({
    nombre: 'Sistema Educativo',
    logo: null,
    codigo: '',
    direccion: '',
    telefono: '',
    email: '',
    director: '',
    color_primario: '#1976d2',
    color_secundario: '#424242',
    background_tipo: 'color',
    background_color: '#f5f5f5',
    background_imagen: null
  });
  const [loading, setLoading] = useState(true);

  const loadColegioData = async () => {
    try {
      setLoading(true);
      const response = await configuracionService.getColegio();

      if (response.success && response.colegio) {
        console.log('Cargando datos del colegio:', response.colegio);
        const backgroundImageUrl = getColegioLogoUrl(response.colegio.background_imagen);
        console.log('Background image filename:', response.colegio.background_imagen);
        console.log('Background image URL construida:', backgroundImageUrl);

        setColegio({
          nombre: response.colegio.nombre || 'Sistema Educativo',
          logo: getColegioLogoUrl(response.colegio.logo),
          codigo: response.colegio.codigo || '',
          direccion: response.colegio.direccion || '',
          telefono: response.colegio.telefono || '',
          email: response.colegio.email || '',
          director: response.colegio.director || '',
          color_primario: response.colegio.color_primario || '#1976d2',
          color_secundario: response.colegio.color_secundario || '#424242',
          background_tipo: response.colegio.background_tipo || 'color',
          background_color: response.colegio.background_color || '#f5f5f5',
          background_imagen: backgroundImageUrl
        });
      }
    } catch (error) {
      console.error('Error cargando datos del colegio:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateColegio = (newData) => {
    console.log('Actualizando contexto con datos:', newData);
    setColegio(prev => {
      const updated = {
        ...prev,
        ...newData,
        // Asegurar que el logo tenga URL completa si se proporciona
        logo: newData.logo ? getColegioLogoUrl(newData.logo) : prev.logo,
        // Asegurar que la imagen de fondo tenga URL completa si se proporciona
        background_imagen: newData.background_imagen ? getColegioLogoUrl(newData.background_imagen) : prev.background_imagen
      };
      console.log('Contexto actualizado:', updated);
      return updated;
    });
  };

  useEffect(() => {
    loadColegioData();
  }, []);

  const value = {
    colegio,
    loading,
    loadColegioData,
    updateColegio
  };

  return (
    <ConfiguracionContext.Provider value={value}>
      {children}
    </ConfiguracionContext.Provider>
  );
};
