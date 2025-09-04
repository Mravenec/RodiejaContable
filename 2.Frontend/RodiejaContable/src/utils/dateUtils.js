/**
 * Formatea una fecha en formato legible
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} Fecha formateada o mensaje de error
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Error de formato';
  }
};

/**
 * Valida y formatea un año
 * @param {number|string} year - Año a validar
 * @returns {number|string} Año validado o mensaje de error
 */
export const formatYear = (year) => {
  if (!year && year !== 0) return 'N/A';
  const numYear = Number(year);
  return isNaN(numYear) || numYear < 1900 || numYear > 2100 ? 'Año inválido' : numYear;
};
