// Utilidades para generar grados basados en la configuración de niveles

// Función para generar opciones de grados basadas en un nivel
export const generateGradosOptions = (nivel) => {
  if (!nivel || !nivel.grado_minimo || !nivel.grado_maximo) {
    return [];
  }

  const { tipo_grados, grado_minimo, grado_maximo } = nivel;
  const grados = [];

  for (let i = grado_minimo; i <= grado_maximo; i++) {
    let nombre = '';
    let valor = i;

    if (tipo_grados === 'Años') {
      // Formato: "03 años", "04 años", "05 años"
      const numeroFormateado = i.toString().padStart(2, '0');
      nombre = `${numeroFormateado} años`;
    } else if (tipo_grados === 'Grados') {
      // Formato: "1° grado", "2° grado", "3° grado"
      nombre = `${i}° grado`;
    }

    grados.push({
      value: valor,
      label: nombre,
      numero: i
    });
  }

  return grados;
};

// Función para obtener el nombre formateado de un grado
export const getGradoFormattedName = (numero, tipoGrados) => {
  if (tipoGrados === 'Años') {
    const numeroFormateado = numero.toString().padStart(2, '0');
    return `${numeroFormateado} años`;
  } else if (tipoGrados === 'Grados') {
    return `${numero}° grado`;
  }
  return numero.toString();
};

// Función para validar si un número de grado es válido para un nivel
export const isValidGradoForNivel = (numero, nivel) => {
  if (!nivel || !nivel.grado_minimo || !nivel.grado_maximo) {
    return false;
  }
  return numero >= nivel.grado_minimo && numero <= nivel.grado_maximo;
};

// Función para obtener el código de un grado basado en nivel y número
export const generateGradoCodigo = (nivel, numero, seccion) => {
  if (!nivel || !numero) {
    return '';
  }

  const nivelCodigo = nivel.codigo || 'NIV';
  const numeroFormateado = numero.toString().padStart(2, '0');
  const seccionCodigo = seccion === 'Unica' ? '' : seccion;

  return `${nivelCodigo}${numeroFormateado}${seccionCodigo}`.toUpperCase();
};
