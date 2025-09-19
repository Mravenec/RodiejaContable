import axios from './axios';

export const modelosAPI = {
  // Obtener todos los modelos
  getAll: () => {
    return axios.get('/modelos');
  },
  
  // Obtener modelos por marca
  getByMarcaId: (marcaId) => {
    return axios.get(`/modelos/marca/${marcaId}`);
  },
  
  // Obtener modelo por ID
  getById: (id) => {
    return axios.get(`/modelos/${id}`);
  },
  
  // Crear nuevo modelo
  create: (data) => {
    return axios.post('/modelos', data);
  },
  
  // Actualizar modelo
  update: (id, data) => {
    return axios.put(`/modelos/${id}`, data);
  },
  
  // Eliminar modelo
  delete: (id) => {
    return axios.delete(`/modelos/${id}`);
  }
};

export default modelosAPI;
