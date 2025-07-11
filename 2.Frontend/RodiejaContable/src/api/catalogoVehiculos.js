import api from './axios';

const catalogoVehiculosService = {
  // Marcas
  async getMarcas() {
    try {
      const response = await api.get('/marcas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  },

  async createMarca(marcaData) {
    try {
      const response = await api.post('/marcas', {
        nombre: marcaData.nombre,
        activa: marcaData.activa !== false // Por defecto true si no se especifica
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear marca:', error);
      throw error;
    }
  },

  // Modelos
  async getModelos(marcaId = null) {
    try {
      const params = marcaId ? { marca_id: marcaId } : {};
      const response = await api.get('/modelos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener modelos:', error);
      throw error;
    }
  },

  async createModelo(modeloData) {
    try {
      const response = await api.post('/modelos', {
        marca_id: Number(modeloData.marca_id),
        nombre: modeloData.nombre,
        anio_inicio: Number(modeloData.anio_inicio),
        anio_fin: modeloData.anio_fin ? Number(modeloData.anio_fin) : null,
        activo: modeloData.activo !== false // Por defecto true si no se especifica
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear modelo:', error);
      throw error;
    }
  },

  // Generaciones
  async getGeneraciones(modeloId = null) {
    try {
      const params = modeloId ? { modelo_id: modeloId } : {};
      const response = await api.get('/generaciones', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener generaciones:', error);
      throw error;
    }
  },

  async getGeneracionById(id) {
    try {
      const response = await api.get(`/generaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la generación con ID ${id}:`, error);
      throw error;
    }
  },

  async createGeneracion(generacionData) {
    try {
      const response = await api.post('/generaciones', {
        modelo_id: Number(generacionData.modelo_id),
        nombre: generacionData.nombre,
        anio_inicio: Number(generacionData.anio_inicio),
        anio_fin: generacionData.anio_fin ? Number(generacionData.anio_fin) : null,
        tipo_carroceria: generacionData.tipo_carroceria,
        activa: generacionData.activa !== false // Por defecto true si no se especifica
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear generación:', error);
      throw error;
    }
  },

  // Búsquedas combinadas
  async getModelosConGeneraciones(marcaId) {
    try {
      const modelos = await this.getModelos(marcaId);
      
      // Para cada modelo, obtener sus generaciones
      const modelosConGeneraciones = await Promise.all(
        modelos.map(async (modelo) => {
          const generaciones = await this.getGeneraciones(modelo.id);
          return {
            ...modelo,
            generaciones
          };
        })
      );
      
      return modelosConGeneraciones;
    } catch (error) {
      console.error('Error al obtener modelos con generaciones:', error);
      throw error;
    }
  }
};

export default catalogoVehiculosService;
