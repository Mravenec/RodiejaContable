import axios from './axios';

export const generacionesAPI = {
  // Obtener todas las generaciones
  getAll: () => {
    return axios.get('/generaciones');
  },
  
  // Obtener generación por ID
  getById: (id) => {
    return axios.get(`/generaciones/${id}`);
  },
  
  // Obtener generaciones por modelo
  getByModeloId: (modeloId) => {
    return axios.get(`/generaciones/modelo/${modeloId}`);
  },
  
  // Crear nueva generación
  create: (data) => {
    return axios.post('/generaciones', data);
  },
  
  // Actualizar generación
  update: (id, data) => {
    return axios.put(`/generaciones/${id}`, data);
  },
  
  // Eliminar generación
  delete: (id) => {
    return axios.delete(`/generaciones/${id}`);
  }
};

export default generacionesAPI;
