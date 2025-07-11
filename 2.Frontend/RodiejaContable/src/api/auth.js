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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    // Devolver usuario simulado si no hay usuario en localStorage
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : mockUser;
  },

  getAuthHeader() {
    return { Authorization: 'Bearer mock-jwt-token' };
  },

  isAuthenticated() {
    return true; // Siempre autenticado en modo desarrollo
  },
};
