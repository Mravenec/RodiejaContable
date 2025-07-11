import axios from 'axios';

// Configuración de Axios para desarrollo
const api = axios.create({
  baseURL: '/api', // Esto será manejado por el proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para simular respuestas del servidor
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    
    // Agregar token de autorización simulado
    config.headers.Authorization = 'Bearer mock-jwt-token';
    
    return config;
  },
  (error) => {
    console.error('[API] Error en la solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para simular respuestas del servidor
api.interceptors.response.use(
  (response) => {
    console.log('[API] Respuesta recibida:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[API] Error en la respuesta:', error);
    
    // Simular respuesta de error 401 (No autorizado)
    if (error.config?.url?.includes('protegido')) {
      return Promise.reject({
        response: {
          status: 401,
          data: { message: 'No autorizado' }
        }
      });
    }
    
    // Simular respuesta de error 404 (No encontrado)
    if (error.config?.url?.includes('no-existe')) {
      return Promise.reject({
        response: {
          status: 404,
          data: { message: 'Recurso no encontrado' }
        }
      });
    }
    
    // Para otras rutas, simular una respuesta exitosa
    return Promise.resolve({
      data: {
        success: true,
        message: 'Operación simulada exitosamente',
        data: {}
      }
    });
  }
);

export default api;
