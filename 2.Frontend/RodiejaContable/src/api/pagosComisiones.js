import api from './axios';

const pagosComisionesService = {
  // Obtener todos los pagos de comisiones
  getPagosComisiones: async () => {
    const response = await api.get('/pagos-comisiones');
    return response.data;
  },

  // Obtener pago por ID
  getPagoById: async (id) => {
    const response = await api.get(`/pagos-comisiones/${id}`);
    return response.data;
  },

  // Obtener pagos por empleado
  getPagosPorEmpleado: async (empleadoId) => {
    const response = await api.get(`/pagos-comisiones/empleado/${empleadoId}`);
    return response.data;
  },

  // Obtener pagos por período
  getPagosPorPeriodo: async (anio, mes) => {
    const response = await api.get(`/pagos-comisiones/periodo/${anio}/${mes}`);
    return response.data;
  },

  // Obtener pagos por estado
  getPagosPorEstado: async (estado) => {
    const response = await api.get(`/pagos-comisiones/estado/${estado}`);
    return response.data;
  },

  // Obtener estado de pagos para todos los empleados en un período
  getEstadoPagos: async (anio, mes) => {
    const response = await api.get(`/pagos-comisiones/periodo/${anio}/${mes}`);
    return response.data;
  },

  // Listar comisiones pendientes por período
  getComisionesPendientes: async (anio, mes) => {
    const response = await api.get(`/pagos-comisiones/pendientes/${anio}/${mes}`);
    return response.data;
  },

  // Obtener resumen completo del período
  getResumenPeriodo: async (anio, mes) => {
    const response = await api.get(`/pagos-comisiones/resumen/${anio}/${mes}`);
    return response.data;
  },

  // Registrar pago de comisiones para empleado
  registrarPago: async (pagoData) => {
    const response = await api.post('/pagos-comisiones/registrar', pagoData);
    return response.data;
  },

  // Actualizar estado de un pago
  actualizarEstadoPago: async (pagoId, estado) => {
    const response = await api.put(`/pagos-comisiones/${pagoId}/estado`, { estado });
    return response.data;
  },

  // Eliminar un pago
  eliminarPago: async (pagoId) => {
    const response = await api.delete(`/pagos-comisiones/${pagoId}`);
    return response.data;
  }
};

export default pagosComisionesService;
