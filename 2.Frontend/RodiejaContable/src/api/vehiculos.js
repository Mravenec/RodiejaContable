import api from './axios';

class VehiculoService {
  // Enable/disable debug logging
  debug = true;
  
  log(...args) {
    if (this.debug) {
      console.log('[VehiculoService]', ...args);
    }
  }
  
  error(...args) {
    console.error('[VehiculoService]', ...args);
  }
  // Obtener todos los vehículos con sus relaciones
  /**
   * Obtiene vehículos en formato plano o jerárquico según los parámetros
   * @param {Object} params - Parámetros de búsqueda
   * @param {boolean} [hierarchical=false] - Si es true, devuelve los datos en formato jerárquico
   * @returns {Promise<Array|Object>} Lista de vehículos o estructura jerárquica
   */
  async getVehiculos(params = {}, hierarchical = false) {
    try {
      this.log(`Fetching ${hierarchical ? 'hierarchical ' : ''}vehicles with params:`, params);
      
      // Si se solicita el formato jerárquico, usamos el nuevo endpoint
      if (hierarchical) {
        const response = await api.get('/vehiculos/jerarquia');
        this.log('Hierarchical vehicles API response:', response.data);
        return response.data?.marcas || [];
      }
      
      // Formato plano (comportamiento original)
      const response = await api.get('/vehiculos', { 
        params,
        paramsSerializer: params => {
          const searchParams = new URLSearchParams();
          for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
              searchParams.append(key, params[key]);
            }
          }
          return searchParams.toString();
        }
      });
      
      this.log('Vehicles API response:', response.data);
      
      if (!Array.isArray(response.data)) {
        this.error('Expected array of vehicles but got:', response.data);
        return [];
      }
      
      const vehiculos = response.data;
      
      // Si no hay vehículos, retornar array vacío
      if (vehiculos.length === 0) {
        this.log('No vehicles found');
        return [];
      }
      
      // Obtenemos las generaciones para cada vehículo
      const vehiculosConRelaciones = [];
      
      for (const vehiculo of vehiculos) {
        try {
          this.log(`Fetching generation for vehicle ${vehiculo.id}, generacionId: ${vehiculo.generacionId}`);
          
          const generacionResponse = await api.get(`/generaciones/${vehiculo.generacionId}`);
          
          const vehiculoConRelacion = {
            ...vehiculo,
            generacion: generacionResponse.data || { id: vehiculo.generacionId }
          };
          
          this.log(`Processed vehicle ${vehiculo.id}:`, vehiculoConRelacion);
          vehiculosConRelaciones.push(vehiculoConRelacion);
          
        } catch (error) {
          this.error(`Error getting generation for vehicle ${vehiculo.id}:`, error);
          
          // Incluir el vehículo aunque falle la generación
          vehiculosConRelaciones.push({
            ...vehiculo,
            generacion: { id: vehiculo.generacionId },
            _error: `Error loading generation: ${error.message}`
          });
        }
      }
      
      this.log(`Successfully processed ${vehiculosConRelaciones.length} vehicles`);
      return vehiculosConRelaciones;
    } catch (error) {
      this.error('Error getting vehicles:', {
        message: error.message,
        config: error.config,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Si es un error 404, retornar array vacío
      if (error.response?.status === 404) {
        this.log('Vehicles endpoint returned 404, returning empty array');
        return [];
      }
      
      // Para otros errores, lanzar el error para que lo maneje React Query
      throw error;
    }
  }

  // Obtener vehículos agrupados jerárquicamente por marca > modelo > generación > vehículo
  async getVehiculosAgrupados() {
    try {
      this.log('Fetching vehicles with hierarchical structure');
      
      // Obtener vehículos con toda la información necesaria
      const response = await api.get('/vehiculos/completo');
      this.log('Hierarchical vehicles API response:', response.data);
      
      if (!response.data) {
        this.error('Invalid response format for hierarchical vehicles');
        return [];
      }
      
      return response.data;
    } catch (error) {
      this.error('Error getting hierarchical vehicles:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 404) {
        this.log('Hierarchical vehicles endpoint not found, falling back to flat structure');
        return [];
      }
      
      throw error;
    }
  }
  
  // Obtener estadísticas financieras por generación
  async getEstadisticasGeneracion(generacionId) {
    try {
      this.log(`Fetching statistics for generation ${generacionId}`);
      const response = await api.get(`/generaciones/${generacionId}/estadisticas`);
      return response.data || {};
    } catch (error) {
      this.error(`Error getting statistics for generation ${generacionId}:`, error);
      throw error;
    }
  }
  
  // Obtener un vehículo por su ID
  async getVehiculoPorId(id) {
    try {
      const response = await api.get(`/vehiculos/${id}`);
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
      const response = await api.post('/vehiculos', vehiculoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el vehículo:', error);
      throw error;
    }
  }
  
  // Actualizar un vehículo existente
  async actualizarVehiculo(id, vehiculoData) {
    try {
      const response = await api.put(`/vehiculos/${id}`, vehiculoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      throw error;
    }
  }
  
  // Eliminar un vehículo
  async eliminarVehiculo(id) {
    try {
      await api.delete(`/vehiculos/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
      throw error;
    }
  }
  
  // Obtener transacciones de un vehículo (versión mejorada)
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
        estado: transaccion.estado,
        tipo_transaccion: transaccion.tipo_transaccion || { nombre: transaccion.tipo, categoria: 'EGRESO' }
      }));
    } catch (error) {
      this.error(`Error al obtener transacciones del vehículo ${vehiculoId}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const vehiculoService = new VehiculoService();
export default vehiculoService;
