import api from './axios';

class VentasEmpleadosService {
  // Obtener todas las ventas por empleado
  async getVentasPorEmpleado(filtros = {}) {
    try {
      const response = await api.get('/v1/ventas-empleados', { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Error al obtener ventas por empleado:', error);
      throw error;
    }
  }

  // Obtener ventas de un empleado específico
  async getVentasPorEmpleadoEspecifico(nombreEmpleado) {
    try {
      const response = await api.get(`/v1/ventas-empleados/${encodeURIComponent(nombreEmpleado)}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ventas para el empleado ${nombreEmpleado}:`, error);
      throw error;
    }
  }

  // Obtener los N empleados con más ventas
  async getTopEmpleados(limite = 5) {
    try {
      const response = await api.get(`/v1/ventas-empleados/top/${limite}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener top empleados:', error);
      throw error;
    }
  }

  // Obtener lista de todos los empleados con ventas
  async getEmpleadosConVentas() {
    try {
      const response = await api.get('/v1/ventas-empleados/empleados');
      return response.data;
    } catch (error) {
      console.error('Error al obtener lista de empleados con ventas:', error);
      throw error;
    }
  }

  // Obtener estadísticas generales de ventas por empleado
  async getEstadisticasVentas() {
    try {
      console.log('Obteniendo estadísticas de ventas...');
      const response = await api.get('/v1/ventas-empleados/estadisticas');
      console.log('Respuesta de estadísticas de ventas:', response.data);
      
      // Si no hay datos, devolver valores por defecto
      if (!response.data) {
        console.warn('No se recibieron datos de estadísticas, usando valores por defecto');
        return {
          totalVentas: 0,
          totalIngresos: 0,
          promedioVenta: 0,
          vehiculosStock: 0,
          tasaConversion: 0
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de ventas:', error);
      // Devolver valores por defecto en caso de error
      return {
        totalVentas: 0,
        totalIngresos: 0,
        promedioVenta: 0,
        vehiculosStock: 0,
        tasaConversion: 0
      };
    }
  }

  // Obtener ventas por empleado en un rango de fechas
  async getVentasPorRangoFechas(fechaInicio, fechaFin, empleado = null, busqueda = null) {
    try {
      const params = { fechaInicio, fechaFin };
      if (empleado) params.empleado = empleado;
      if (busqueda && busqueda.trim()) params.busqueda = busqueda.trim();
      
      const response = await api.get('/v1/ventas-empleados/rango-fechas', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener ventas por rango de fechas:', error);
      throw error;
    }
  }

  // Obtener ventas por empleado por tipo de producto
  async getVentasPorTipoProducto(tipoProducto, filtros = {}) {
    try {
      const response = await api.get(`/v1/ventas-empleados/tipo-producto/${tipoProducto}`, { params: filtros });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ventas para el tipo de producto ${tipoProducto}:`, error);
      throw error;
    }
  }

  // Obtener comisiones por empleado
  async getComisionesPorEmpleado(filtros = {}) {
    try {
      const response = await api.get('/v1/ventas-empleados/comisiones', { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Error al obtener comisiones por empleado:', error);
      throw error;
    }
  }

  // Obtener ventas por empleado por mes
  async getVentasMensuales(anio, empleado = null) {
    try {
      console.log(`Solicitando ventas mensuales para el año ${anio}${empleado ? `, empleado: ${empleado}` : ''}`);
      const params = empleado ? { empleado } : {};
      
      const response = await api.get(`/v1/ventas-empleados/mensual/${anio}`, { 
        params
      });
      
      console.log(`Respuesta de ventas mensuales (${anio}):`, {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
      
      // Return the actual data from backend
      return response.data || [];
    } catch (error) {
      console.error(`Error al obtener ventas mensuales para el año ${anio}:`, error);
      
      // If it's a 404, return empty array (no data found)
      if (error.response?.status === 404) {
        console.warn(`No se encontraron ventas para el año ${anio}${empleado ? ` y empleado ${empleado}` : ''}`);
        return [];
      }
      
      // For other errors, re-throw to let the component handle it
      throw error;
    }
  }
  
  // Comparativa de ventas entre empleados
  async getComparativaVentas(empleados, fechaInicio, fechaFin) {
    try {
      const params = {
        empleados: Array.isArray(empleados) ? empleados.join(',') : empleados,
        fechaInicio,
        fechaFin
      };
      
      const response = await api.get('/v1/ventas-empleados/comparativa', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener comparativa de ventas:', error);
      throw error;
    }
  }

  // Exportar reporte de ventas
  async exportarReporte(formato, filtros = {}) {
    try {
      const response = await api.get(`/v1/ventas-empleados/exportar`, {
        params: { ...filtros, formato },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error al exportar reporte en formato ${formato}:`, error);
      throw error;
    }
  }
}

const ventasEmpleadosService = new VentasEmpleadosService();
export default ventasEmpleadosService;
