import api from './axios';

class DashboardService {
  // Obtener estadísticas generales del dashboard
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/ejecutivo');
      const data = response.data[0]; // Get first item from array response
      
      // Mapear la respuesta del backend al formato esperado por el frontend
      return {
        totalVentas: data.ingresosTotales || 0,
        totalVehiculos: data.totalVehiculos || 0,
        totalRepuestos: data.totalRepuestos || 0,
        totalClientes: 0, // This field might need to be fetched separately
        totalEgresos: data.egresosTotales || 0,
        margenBeneficio: data.balanceNetoTotal || 0,
        roiPromedio: data.roiPromedio || 0
      };
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  }

  // Obtener vehículos más vendidos
  async getVehiculosMasVendidos() {
    try {
      const response = await api.get('/v1/vehiculos/mas-vendidos', {
        params: {
          limit: 5
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículos más vendidos:', error);
      return [];
    }
  }

  // Obtener repuestos más vendidos
  async getRepuestosMasVendidos() {
    try {
      const response = await api.get('/inventario/mas-vendidos', {
        params: {
          limit: 5
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener repuestos más vendidos:', error);
      return [];
    }
  }

  // Obtener ventas mensuales
  async getVentasMensuales() {
    try {
      const response = await api.get('/analisis-financiero');
      return response.data;
    } catch (error) {
      console.error('Error al obtener ventas mensuales:', error);
      return [];
    }
  }

  // Obtener comisiones de vendedores
  async getComisionesVendedores() {
    try {
      const response = await api.get('/v1/ventas-empleados');
      return response.data;
    } catch (error) {
      console.error('Error al obtener comisiones por vendedor:', error);
      return [];
    }
  }

  // Obtener alertas de inventario
  async getAlertasInventario() {
    try {
      const response = await api.get('/inventario/critico');
      return response.data;
    } catch (error) {
      console.error('Error al obtener alertas de inventario:', error);
      return [];
    }
  }
}

// Export a singleton instance
export default new DashboardService();
