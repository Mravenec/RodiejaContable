import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from './Loading';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated()) {
    // Redirigir al login, pero guardar la ubicación actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles si se especifican
  if (roles.length > 0 && !roles.some(role => hasRole(role))) {
    // Usuario no tiene los roles necesarios, redirigir a página no autorizada
    return <Navigate to="/no-autorizado" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
