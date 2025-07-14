// Servicio de autenticación simulado para desarrollo
const mockUser = {
  id: 1,
  nombre: 'Usuario de Prueba',
  email: 'test@example.com',
  rol: 'admin'
};

export const authService = {
  async login(credentials) {
    console.log('Iniciando sesión con credenciales simuladas');
    
    // Simular tiempo de espera
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular credenciales incorrectas
    if (credentials.email === 'error@example.com') {
      throw new Error('Credenciales incorrectas');
    }
    
    // Devolver usuario simulado
    const userData = {
      user: mockUser,
      token: 'mock-jwt-token'
    };
    
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    
    console.log('Usuario autenticado (simulado):', userData.user);
    return userData;
  },

  logout() {
    try {
      console.log('Ejecutando logout...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear(); // Limpiar sessionStorage por si acaso
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error en authService.logout:', error);
      return Promise.reject(error);
    }
  },

  getCurrentUser() {
    // Verificar si hay un token primero
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Si hay token, intentar obtener el usuario
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getAuthHeader() {
    return { Authorization: 'Bearer mock-jwt-token' };
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token; // Devuelve true si hay un token, false en caso contrario
  },
};
