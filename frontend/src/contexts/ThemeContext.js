import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useConfiguracion } from './ConfiguracionContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de DynamicThemeProvider');
  }
  return context;
};

export const DynamicThemeProvider = ({ children }) => {
  const { colegio } = useConfiguracion();
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    // Crear tema dinámico basado en los colores del colegio
    const dynamicTheme = createTheme({
      palette: {
        primary: {
          main: colegio.color_primario || '#0165a1',
          light: lightenColor(colegio.color_primario || '#0165a1', 0.3),
          dark: darkenColor(colegio.color_primario || '#0165a1', 0.3),
        },
        secondary: {
          main: colegio.color_secundario || '#424242',
          light: lightenColor(colegio.color_secundario || '#424242', 0.3),
          dark: darkenColor(colegio.color_secundario || '#424242', 0.3),
        },
        background: {
          // Mantener fondo global por defecto para dashboard; el login maneja su propio fondo
          default: colegio.background_color || '#f5f5f5',
          paper: '#ffffff',
        },
        text: {
          primary: '#212121',
          secondary: colegio.color_secundario || '#757575',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '2.5rem',
          fontWeight: 500,
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 500,
        },
        h3: {
          fontSize: '1.75rem',
          fontWeight: 500,
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 500,
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 500,
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 8,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
          },
        },
      },
    });

    setTheme(dynamicTheme);
  }, [colegio.color_primario, colegio.color_secundario]);

  // Función para aclarar un color
  const lightenColor = (color, amount) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  // Función para oscurecer un color
  const darkenColor = (color, amount) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
      (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
      (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
  };

  if (!theme) {
    return null; // O un spinner de carga
  }

  return (
    <ThemeContext.Provider value={{ theme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
