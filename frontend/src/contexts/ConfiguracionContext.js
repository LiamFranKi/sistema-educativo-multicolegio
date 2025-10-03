import React, { createContext, useContext, useState, useEffect } from 'react';
import { configuracionService, anioEscolarService } from '../services/apiService';
import { getColegioLogoUrl, getFondoLoginUrl } from '../utils/imageUtils';

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
    background_imagen: null,
    anio_escolar_actual: 2025
  });
  const [aniosEscolares, setAniosEscolares] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadColegioData = async () => {
    try {
      setLoading(true);
      const response = await configuracionService.getColegio();

      if (response.success && response.colegio) {
        console.log('Cargando datos del colegio:', response.colegio);

        // Construir URL de imagen de fondo con mejor manejo de errores
        let backgroundImageUrl = null;
        if (response.colegio.background_imagen) {
          backgroundImageUrl = getFondoLoginUrl(response.colegio.background_imagen);
          console.log('Background image filename:', response.colegio.background_imagen);
          console.log('Background image URL construida:', backgroundImageUrl);

          // Verificar si la imagen existe
          if (backgroundImageUrl) {
            const img = new Image();
            img.onload = () => console.log('✅ Imagen de fondo cargada correctamente');
            img.onerror = () => console.error('❌ Error cargando imagen de fondo:', backgroundImageUrl);
            img.src = backgroundImageUrl;
          }
        }

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
          background_imagen: backgroundImageUrl,
          anio_escolar_actual: response.colegio.anio_escolar_actual || 2025
        });
      }
    } catch (error) {
      console.error('Error cargando datos del colegio:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAniosEscolares = async () => {
    try {
      const response = await anioEscolarService.getAniosEscolares();
      if (response.success) {
        setAniosEscolares(response.anios_escolares || []);
      }
    } catch (error) {
      console.error('Error cargando años escolares:', error);
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

  const createAnioEscolar = async (anioData) => {
    try {
      const response = await anioEscolarService.createAnioEscolar(anioData);
      if (response.success) {
        // Actualizar estado local inmediatamente
        setAniosEscolares(prev => [...prev, response.anio_escolar]);
        console.log('Año escolar agregado al estado local');
        return response;
      }
      return response;
    } catch (error) {
      console.error('Error creando año escolar:', error);
      throw error;
    }
  };

  const updateAnioEscolar = async (id, anioData) => {
    try {
      const response = await anioEscolarService.updateAnioEscolar(id, anioData);
      if (response.success) {
        // Actualizar estado local inmediatamente
        setAniosEscolares(prev =>
          prev.map(anio =>
            anio.id === id ? { ...anio, ...response.anio_escolar } : anio
          )
        );
        console.log('Año escolar actualizado en el estado local');
        return response;
      }
      return response;
    } catch (error) {
      console.error('Error actualizando año escolar:', error);
      throw error;
    }
  };

  const deleteAnioEscolar = async (id) => {
    try {
      const response = await anioEscolarService.deleteAnioEscolar(id);
      if (response.success) {
        // Actualizar estado local inmediatamente
        setAniosEscolares(prev => prev.filter(anio => anio.id !== id));
        console.log('Año escolar eliminado del estado local');
        return response;
      }
      return response;
    } catch (error) {
      console.error('Error eliminando año escolar:', error);
      throw error;
    }
  };

  const setAnioActual = async (anio) => {
    try {
      const response = await anioEscolarService.setAnioActual(anio);
      if (response.success) {
        setColegio(prev => ({
          ...prev,
          anio_escolar_actual: anio
        }));
        return response;
      }
      return response;
    } catch (error) {
      console.error('Error estableciendo año actual:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadColegioData();
    loadAniosEscolares();
  }, []);

  const value = {
    colegio,
    aniosEscolares,
    loading,
    loadColegioData,
    loadAniosEscolares,
    updateColegio,
    createAnioEscolar,
    updateAnioEscolar,
    deleteAnioEscolar,
    setAnioActual
  };

  return (
    <ConfiguracionContext.Provider value={value}>
      {children}
    </ConfiguracionContext.Provider>
  );
};
