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
    logo: null
  });
  const [loading, setLoading] = useState(true);

  const loadColegioData = async () => {
    try {
      setLoading(true);
      const response = await configuracionService.getColegio();

      if (response.success && response.colegio) {
        setColegio({
          nombre: response.colegio.nombre || 'Sistema Educativo',
          logo: getColegioLogoUrl(response.colegio.logo)
        });
      }
    } catch (error) {
      console.error('Error cargando datos del colegio:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateColegio = (newData) => {
    setColegio(prev => ({
      ...prev,
      ...newData,
      // Asegurar que el logo tenga URL completa
      logo: newData.logo ? getColegioLogoUrl(newData.logo) : prev.logo
    }));
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
