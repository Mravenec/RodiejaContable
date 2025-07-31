import api from './axios';

export const finanzaService = {
  // Get all financial transactions with optional filters
  getTransacciones: async (filters = {}) => {
    try {
      const response = await api.get('/finanzas/transacciones', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single transaction by ID
  getTransaccionById: async (id) => {
    try {
      const response = await api.get(`/finanzas/transacciones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new transaction
  createTransaccion: async (transaccionData) => {
    try {
      const response = await api.post('/finanzas/transacciones', transaccionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update an existing transaction
  updateTransaccion: async (id, transaccionData) => {
    try {
      const response = await api.put(`/finanzas/transacciones/${id}`, transaccionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a transaction
  deleteTransaccion: async (id) => {
    try {
      const response = await api.delete(`/finanzas/transacciones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get financial summary
  getResumenFinanciero: async (params = {}) => {
    try {
      const response = await api.get('/finanzas/resumen', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get financial metrics
  getMetricasFinancieras: async (params = {}) => {
    try {
      const response = await api.get('/finanzas/metricas', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get transactions by type (ingreso/egreso)
  getTransaccionesByTipo: async (tipo, params = {}) => {
    try {
      const response = await api.get(`/finanzas/transacciones/tipo/${tipo}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get transactions by date range
  getTransaccionesByDateRange: async (fechaInicio, fechaFin, params = {}) => {
    try {
      const response = await api.get('/finanzas/transacciones/rango-fechas', {
        params: { fechaInicio, fechaFin, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default finanzaService;
