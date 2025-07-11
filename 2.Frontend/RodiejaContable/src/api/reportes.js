import api from './axios';

const reportesService = {
  // Generar reporte de inventario
  async generarReporteInventario(params = {}) {
    try {
      const response = await api.get('/reportes/inventario', {
        params,
        responseType: 'blob', // Para manejar la descarga de archivos
      });
      return response.data;
    } catch (error) {
      console.error('Error al generar el reporte de inventario:', error);
      throw error;
    }
  },

  // Generar reporte de ventas
  async generarReporteVentas(params = {}) {
    try {
      const response = await api.get('/reportes/ventas', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error al generar el reporte de ventas:', error);
      throw error;
    }
  },

  // Generar reporte de finanzas
  async generarReporteFinanciero(params = {}) {
    try {
      const response = await api.get('/reportes/financiero', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error al generar el reporte financiero:', error);
      throw error;
    }
  },

  // Generar reporte de vehículos
  async generarReporteVehiculos(params = {}) {
    try {
      const response = await api.get('/reportes/vehiculos', {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error al generar el reporte de vehículos:', error);
      throw error;
    }
  },

  // Función auxiliar para descargar archivos
  descargarArchivo(blob, nombreArchivo) {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nombreArchivo);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  },
};

export default reportesService;
