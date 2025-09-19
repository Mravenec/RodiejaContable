import axios from './axios';

export const marcasAPI = {
  // Obtener todas las marcas
  getAll: () => {
    return axios.get('/marcas');
  },
  
  // Obtener marca por ID
  getById: (id) => {
    return axios.get(`/marcas/${id}`);
  },
  
  // Crear nueva marca
  create: (data) => {
    return axios.post('/marcas', data);
  },
  
  // Actualizar marca
  update: (id, data) => {
    return axios.put(`/marcas/${id}`, data);
  },
  
  // Eliminar marca
  delete: (id) => {
    return axios.delete(`/marcas/${id}`);
  }
};

export default marcasAPI;
