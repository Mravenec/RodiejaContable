import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/auth';

// Crear el contexto
export const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  // Usuario simulado para desarrollo
  const mockUser = {
    id: 1,
    nombre: 'Usuario de Prueba',
    email: 'test@example.com',
    rol: 'admin'
  };

  const [user, setUser] = useState(mockUser); // Establecer usuario simulado por defecto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar el usuario al iniciar la aplicación
  const loadUser = useCallback(() => {
    try {
      const user = authService.getCurrentUser();
      setUser(user);
      return user;
    } catch (err) {
      console.error('Error al cargar el usuario:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Iniciar sesión simulada
  const login = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular tiempo de espera
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Guardar el token y el usuario en localStorage
      const token = 'mock-jwt-token';
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Actualizar el estado del usuario
      setUser(userData);
      
      return { user: userData, token };
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Error en la autenticación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = useCallback(() => {
    console.log('Ejecutando logout...');
    try {
      // Limpiar solo los datos de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Limpiar el estado del usuario
      setUser(null);
      
      // Devolver una promesa resuelta
      return Promise.resolve();
    } catch (error) {
      console.error('Error al limpiar datos de autenticación:', error);
      return Promise.reject(error);
    }
  }, []);

  // Verificar si el usuario está autenticado
  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  // Verificar si el usuario tiene un rol específico
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Valor del contexto
  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
