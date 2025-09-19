import axios from './axios';
import { message } from 'antd';

export const generacionesAPI = {
  // Obtener todas las generaciones
  getAll: async () => {
    try {
      const response = await axios.get('/generaciones');
      return response;
    } catch (error) {
      console.error('Error en generacionesAPI.getAll:', error);
      message.error('Error al obtener las generaciones');
      throw error;
    }
  },
  
  // Obtener generación por ID
  getById: async (id) => {
    try {
      const response = await axios.get(`/generaciones/${id}`);
      return response;
    } catch (error) {
      console.error(`Error en generacionesAPI.getById(${id}):`, error);
      message.error(`Error al obtener la generación con ID ${id}`);
      throw error;
    }
  },
  
  // Obtener generaciones por modelo
  getByModeloId: async (modeloId) => {
    try {
      console.log(`Solicitando generaciones para modeloId: ${modeloId}`);
      const response = await axios.get(`/generaciones/modelo/${modeloId}`);
      console.log(`Respuesta para modeloId ${modeloId}:`, response.data);
      return response;
    } catch (error) {
      console.error(`Error en generacionesAPI.getByModeloId(${modeloId}):`, error);
      if (error.response) {
        console.error('Detalles del error:', {
          status: error.response.status,
          data: error.response.data,
          config: error.response.config
        });
        
        if (error.response.status === 404) {
          message.warning('No se encontraron generaciones para el modelo seleccionado');
        } else {
          message.error(`Error al cargar las generaciones (${error.response.status})`);
        }
      } else {
        message.error('Error de conexión al cargar las generaciones');
      }
      throw error;
    }
  },
  
  // Crear nueva generación
  create: async (data) => {
    try {
      const response = await axios.post('/generaciones', data);
      message.success('Generación creada exitosamente');
      return response;
    } catch (error) {
      console.error('Error en generacionesAPI.create:', error);
      message.error('Error al crear la generación');
      throw error;
    }
  },
  
  // Actualizar generación
  update: async (id, data) => {
    try {
      const response = await axios.put(`/generaciones/${id}`, data);
      message.success('Generación actualizada exitosamente');
      return response;
    } catch (error) {
      console.error(`Error en generacionesAPI.update(${id}):`, error);
      message.error('Error al actualizar la generación');
      throw error;
    }
  },
  
  // Eliminar generación
  delete: async (id) => {
    try {
      const response = await axios.delete(`/generaciones/${id}`);
      message.success('Generación eliminada exitosamente');
      return response;
    } catch (error) {
      console.error(`Error en generacionesAPI.delete(${id}):`, error);
      message.error('Error al eliminar la generación');
      throw error;
    }
  }
};

export default generacionesAPI;
