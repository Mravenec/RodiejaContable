import api from './axios';

const vehiculoService = {
  // Obtener todos los vehículos con información completa
  async getVehiculos(params = {}) {
    try {
      const response = await api.get('/vehiculos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      throw error;
    }
  },

  // Obtener un vehículo por ID con información completa
  async getVehiculoById(id) {
    try {
      const response = await api.get(`/vehiculos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el vehículo con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo vehículo
  async createVehiculo(vehiculoData) {
    try {
      // Asegurarse de que los campos numéricos sean números
      const payload = {
        ...vehiculoData,
        generacion_id: Number(vehiculoData.generacion_id),
        anio: Number(vehiculoData.anio),
        precio_compra: parseFloat(vehiculoData.precio_compra),
        costo_grua: parseFloat(vehiculoData.costo_grua || 0),
        comisiones: parseFloat(vehiculoData.comisiones || 0),
        precio_venta: vehiculoData.precio_venta ? parseFloat(vehiculoData.precio_venta) : null,
        fecha_venta: vehiculoData.fecha_venta || null,
        estado: vehiculoData.estado || 'DISPONIBLE',
        notas: vehiculoData.notas || ''
      };
      
      const response = await api.post('/vehiculos', payload);
      return response.data;
    } catch (error) {
      console.error('Error al crear el vehículo:', error);
      throw error;
    }
  },

  // Actualizar un vehículo existente
  async updateVehiculo(id, vehiculoData) {
    try {
      // Asegurarse de que los campos numéricos sean números
      const payload = {
        ...vehiculoData,
        generacion_id: Number(vehiculoData.generacion_id),
        anio: Number(vehiculoData.anio),
        precio_compra: parseFloat(vehiculoData.precio_compra),
        costo_grua: parseFloat(vehiculoData.costo_grua || 0),
        comisiones: parseFloat(vehiculoData.comisiones || 0),
        precio_venta: vehiculoData.precio_venta ? parseFloat(vehiculoData.precio_venta) : null,
        fecha_venta: vehiculoData.fecha_venta || null,
        estado: vehiculoData.estado || 'DISPONIBLE',
        notas: vehiculoData.notas || ''
      };
      
      const response = await api.put(`/vehiculos/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el vehículo con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un vehículo (eliminación lógica)
  async deleteVehiculo(id) {
    try {
      const response = await api.delete(`/vehiculos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el vehículo con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener vehículos por generación
  async getVehiculosPorGeneracion(generacionId) {
    try {
      const response = await api.get(`/vehiculos/generacion/${generacionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener vehículos por generación:', error);
      throw error;
    }
  },
};

export default vehiculoService;
