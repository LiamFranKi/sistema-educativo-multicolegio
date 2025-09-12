// Array de secciones disponibles para grados
// Este array se usa en múltiples partes del sistema

export const SECCIONES_DISPONIBLES = [
  { value: 'Unica', label: 'Única', orden: 1 },
  { value: 'A', label: 'A', orden: 2 },
  { value: 'B', label: 'B', orden: 3 },
  { value: 'C', label: 'C', orden: 4 },
  { value: 'D', label: 'D', orden: 5 },
  { value: 'E', label: 'E', orden: 6 },
  { value: 'F', label: 'F', orden: 7 }
];

// Función para obtener las secciones como opciones para select
export const getSeccionesOptions = () => {
  return SECCIONES_DISPONIBLES.map(seccion => ({
    value: seccion.value,
    label: seccion.label
  }));
};

// Función para validar si una sección es válida
export const isValidSeccion = (seccion) => {
  return SECCIONES_DISPONIBLES.some(s => s.value === seccion);
};

// Función para obtener el orden de una sección
export const getSeccionOrden = (seccion) => {
  const seccionData = SECCIONES_DISPONIBLES.find(s => s.value === seccion);
  return seccionData ? seccionData.orden : 999;
};
