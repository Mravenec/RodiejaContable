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
      const response = await api.get('/v1/ventas-empleados/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de ventas:', error);
      throw error;
    }
  }

  // Obtener ventas por empleado en un rango de fechas
  async getVentasPorRangoFechas(fechaInicio, fechaFin, empleado = null) {
    try {
      const params = { fechaInicio, fechaFin };
      if (empleado) params.empleado = empleado;
      
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
      const params = empleado ? { empleado } : {};
      const response = await api.get(`/v1/ventas-empleados/mensual/${anio}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ventas mensuales para el año ${anio}:`, error);
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

export default new VentasEmpleadosService();
