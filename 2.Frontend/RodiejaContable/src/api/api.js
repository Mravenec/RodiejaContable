import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL del backend (simulada)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Servicios para Vehículos
export const vehiculoService = {
  // Obtener todos los vehículos
  getAll: () => api.get('/vehiculos'),
  
  // Obtener vehículo por ID
  getById: (id) => api.get(`/vehiculos/${id}`),
  
  // Crear nuevo vehículo
  create: (vehiculoData) => api.post('/vehiculos', vehiculoData),
  
  // Actualizar vehículo
  update: (id, vehiculoData) => api.put(`/vehiculos/${id}`, vehiculoData),
  
  // Eliminar vehículo
  delete: (id) => api.delete(`/vehiculos/${id}`),
  
  // Obtener vehículos por generación
  getByGeneracion: (generacionId) => api.get(`/vehiculos/generacion/${generacionId}`),
};

// Servicios para Inventario
export const inventarioService = {
  // Obtener todos los repuestos
  getAll: () => api.get('/inventario'),
  
  // Obtener repuesto por ID
  getById: (id) => api.get(`/inventario/${id}`),
  
  // Crear nuevo repuesto
  create: (repuestoData) => api.post('/inventario', repuestoData),
  
  // Actualizar repuesto
  update: (id, repuestoData) => api.put(`/inventario/${id}`, repuestoData),
  
  // Eliminar repuesto
  delete: (id) => api.delete(`/inventario/${id}`),
  
  // Obtener repuestos por vehículo
  getByVehiculo: (vehiculoId) => api.get(`/inventario/vehiculo/${vehiculoId}`),
};

// Servicios para Finanzas
export const finanzasService = {
  // Obtener todas las transacciones
  getTransacciones: (filtros = {}) => api.get('/finanzas/transacciones', { params: filtros }),
  
  // Crear nueva transacción
  createTransaccion: (transaccionData) => api.post('/finanzas/transacciones', transaccionData),
  
  // Obtener resumen financiero
  getResumen: () => api.get('/finanzas/resumen'),
  
  // Obtener comisiones por vendedor
  getComisionesVendedores: (filtros = {}) => 
    api.get('/finanzas/comisiones-vendedores', { params: filtros }),
};

// Servicios para Catálogos
export const catalogosService = {
  // Obtener marcas
  getMarcas: () => api.get('/catalogos/marcas'),
  
  // Obtener modelos por marca
  getModelos: (marcaId) => api.get(`/catalogos/marcas/${marcaId}/modelos`),
  
  // Obtener generaciones por modelo
  getGeneraciones: (modeloId) => api.get(`/catalogos/modelos/${modeloId}/generaciones`),
  
  // Obtener vendedores
  getVendedores: () => api.get('/catalogos/vendedores'),
};

export default api;
