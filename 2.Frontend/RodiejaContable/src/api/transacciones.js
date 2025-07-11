import api from './axios';

const transaccionService = {
  // Obtener todas las transacciones con filtros opcionales
  async getTransacciones(filtros = {}) {
    try {
      // Asegurarse de que los valores numéricos sean números
      const params = { ...filtros };
      
      if (params.vehiculo_id) params.vehiculo_id = Number(params.vehiculo_id);
      if (params.monto_min) params.monto_min = parseFloat(params.monto_min);
      if (params.monto_max) params.monto_max = parseFloat(params.monto_max);
      
      const response = await api.get('/transacciones', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      throw error;
    }
  },

  // Obtener una transacción por ID
  async getTransaccionById(id) {
    try {
      const response = await api.get(`/transacciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva transacción
  async createTransaccion(transaccionData) {
    try {
      // Asegurar que los campos numéricos sean números
      const payload = {
        ...transaccionData,
        vehiculo_id: transaccionData.vehiculo_id ? Number(transaccionData.vehiculo_id) : null,
        repuesto_id: transaccionData.repuesto_id ? Number(transaccionData.repuesto_id) : null,
        monto: parseFloat(transaccionData.monto),
        fecha: transaccionData.fecha || new Date().toISOString().split('T')[0],
        notas: transaccionData.notas || ''
      };
      
      const response = await api.post('/transacciones', payload);
      return response.data;
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      throw error;
    }
  },

  // Actualizar una transacción existente
  async updateTransaccion(id, transaccionData) {
    try {
      // Asegurar que los campos numéricos sean números
      const payload = {
        ...transaccionData,
        vehiculo_id: transaccionData.vehiculo_id ? Number(transaccionData.vehiculo_id) : null,
        repuesto_id: transaccionData.repuesto_id ? Number(transaccionData.repuesto_id) : null,
        monto: parseFloat(transaccionData.monto)
      };
      
      const response = await api.put(`/transacciones/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una transacción
  async deleteTransaccion(id) {
    try {
      const response = await api.delete(`/transacciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la transacción con ID ${id}:`, error);
      throw error;
    }
  },

  // Métodos específicos para tipos de transacciones
  async getIngresos(filtros = {}) {
    return this.getTransacciones({ ...filtros, tipo: 'INGRESO' });
  },

  async getGastos(filtros = {}) {
    return this.getTransacciones({ ...filtros, tipo: 'GASTO' });
  },

  async getComisiones(filtros = {}) {
    return this.getTransacciones({ ...filtros, tipo: 'COMISION' });
  },

  // Métodos para obtener totales
  async getTotalesPorTipo(fechaInicio = null, fechaFin = null) {
    try {
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;
      
      const response = await api.get('/transacciones/totales-por-tipo', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener totales por tipo:', error);
      throw error;
    }
  },

  async getBalanceGeneral(fechaInicio = null, fechaFin = null) {
    try {
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;
      
      const response = await api.get('/transacciones/balance-general', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener el balance general:', error);
      throw error;
    }
  }
};

export default transaccionService;
