import api from './axios';

class VehiculoService {
  // Obtener todos los vehículos agrupados por marca y generación
  async getVehiculosAgrupados() {
    try {
      // Obtener todos los vehículos completos
      const response = await api.get('/v1/vehiculos');
      const vehiculos = response.data;
      
      // Agrupar por marca y generación
      const marcasMap = new Map();
      
      vehiculos.forEach(vehiculo => {
        if (!marcasMap.has(vehiculo.marcaId)) {
          marcasMap.set(vehiculo.marcaId, {
            id: vehiculo.marcaId,
            nombre: vehiculo.marcaNombre,
            generaciones: new Map()
          });
        }
        
        const marca = marcasMap.get(vehiculo.marcaId);
        
        if (!marca.generaciones.has(vehiculo.generacionId)) {
          marca.generaciones.set(vehiculo.generacionId, {
            id: vehiculo.generacionId,
            nombre: vehiculo.generacionNombre,
            vehiculos: []
          });
        }
        
        const generacion = marca.generaciones.get(vehiculo.generacionId);
        
        generacion.vehiculos.push({
          id: vehiculo.id,
          modelo: vehiculo.modeloNombre,
          año: vehiculo.anio,
          precio: vehiculo.precioVenta,
          estado: vehiculo.estado,
          descripcion: vehiculo.descripcion,
          color: vehiculo.color,
          kilometraje: vehiculo.kilometraje,
          placa: vehiculo.placa,
          vin: vehiculo.vin
        });
      });
      
      // Convertir los mapas a arrays
      return Array.from(marcasMap.values()).map(marca => ({
        ...marca,
        generaciones: Array.from(marca.generaciones.values())
      }));
    } catch (error) {
      console.error('Error al obtener vehículos agrupados:', error);
      throw error;
    }
  }
  
  // Obtener un vehículo por su ID
  async getVehiculoPorId(id) {
    try {
      const response = await api.get(`/v1/vehiculos/${id}`);
      const vehiculo = response.data;
      
      return {
        id: vehiculo.id,
        modelo: vehiculo.modeloNombre,
        año: vehiculo.anio,
        precio: vehiculo.precioVenta,
        estado: vehiculo.estado,
        descripcion: vehiculo.descripcion,
        color: vehiculo.color,
        kilometraje: vehiculo.kilometraje,
        placa: vehiculo.placa,
        vin: vehiculo.vin,
        marcaId: vehiculo.marcaId,
        marcaNombre: vehiculo.marcaNombre,
        generacionId: vehiculo.generacionId,
        generacionNombre: vehiculo.generacionNombre
      };
    } catch (error) {
      console.error('Error al obtener el vehículo:', error);
      throw error;
    }
  }
  
  // Crear un nuevo vehículo
  async crearVehiculo(vehiculoData) {
    try {
      const response = await api.post('/v1/vehiculos', vehiculoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el vehículo:', error);
      throw error;
    }
  }
  
  // Actualizar un vehículo existente
  async actualizarVehiculo(id, vehiculoData) {
    try {
      const response = await api.put(`/v1/vehiculos/${id}`, vehiculoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      throw error;
    }
  }
  
  // Eliminar un vehículo
  async eliminarVehiculo(id) {
    try {
      await api.delete(`/v1/vehiculos/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
      throw error;
    }
  }
  
  // Obtener transacciones de un vehículo
  async getTransaccionesVehiculo(vehiculoId) {
    try {
      const response = await api.get('/transacciones', {
        params: {
          vehiculoId: vehiculoId,
          sort: 'fecha,desc'
        }
      });
      
      return response.data.map(transaccion => ({
        id: transaccion.id,
        fecha: transaccion.fecha,
        tipo: transaccion.tipo,
        monto: transaccion.monto,
        descripcion: transaccion.descripcion,
        estado: transaccion.estado
      }));
    } catch (error) {
      console.error('Error al obtener transacciones del vehículo:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new VehiculoService();
