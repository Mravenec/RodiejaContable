import api from './axios';

const finanzasService = {
  // Obtener todas las transacciones
  async getTransacciones(params = {}) {
    try {
      const response = await api.get('/finanzas/transacciones', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      throw error;
    }
  },

  // Obtener una transacción por ID
  async getTransaccionById(id) {
    try {
      const response = await api.get(`/finanzas/transacciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva transacción
  async createTransaccion(transaccionData) {
    try {
      const response = await api.post('/finanzas/transacciones', transaccionData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      throw error;
    }
  },

  // Actualizar una transacción existente
  async updateTransaccion(id, transaccionData) {
    try {
      const response = await api.put(`/finanzas/transacciones/${id}`, transaccionData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una transacción
  async deleteTransaccion(id) {
    try {
      const response = await api.delete(`/finanzas/transacciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener resumen financiero
  async getResumenFinanciero(params = {}) {
    try {
      const response = await api.get('/finanzas/resumen', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el resumen financiero:', error);
      throw error;
    }
  },

  // Obtener ventas por empleado
  async getVentasPorEmpleado(params = {}) {
    try {
      const response = await api.get('/finanzas/ventas/empleados', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener las ventas por empleado:', error);
      throw error;
    }
  },

  // Obtener productos más vendidos
  async getProductosMasVendidos(params = {}) {
    try {
      const response = await api.get('/finanzas/productos/mas-vendidos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los productos más vendidos:', error);
      throw error;
    }
  },
};

export default finanzasService;
