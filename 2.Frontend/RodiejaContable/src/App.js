import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from 'antd';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Vehiculos from './pages/vehiculos/Vehiculos';
import NuevoVehiculo from './pages/vehiculos/NuevoVehiculo';
import Inventario from './pages/inventario/Inventario';
import NuevoRepuesto from './pages/inventario/NuevoRepuesto';
import Finanzas from './pages/finanzas/Finanzas';
import NuevaTransaccion from './pages/finanzas/NuevaTransaccion';
import Reportes from './pages/reportes/Reportes';

// Componente para rutas privadas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>; // O un componente de carga
  }

  if (!isAuthenticated()) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Componente para rutas de autenticación (login, registro, etc.)
const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated()) {
    // Redirigir al dashboard si ya está autenticado
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={
          <AuthRoute>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '100vh',
              background: '#f0f2f5'
            }}>
              <Login />
            </div>
          </AuthRoute>
        } />
        
        {/* Ruta raíz protegida */}
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        {/* Rutas de vehículos */}
        <Route path="/vehiculos" element={
          <PrivateRoute>
            <Vehiculos />
          </PrivateRoute>
        } />
        
        <Route path="/vehiculos/nuevo" element={
          <PrivateRoute>
            <NuevoVehiculo />
          </PrivateRoute>
        } />
        
        {/* Rutas de inventario */}
        <Route path="/inventario" element={
          <PrivateRoute>
            <Inventario />
          </PrivateRoute>
        } />
        
        <Route path="/inventario/nuevo" element={
          <PrivateRoute>
            <NuevoRepuesto />
          </PrivateRoute>
        } />
        
        {/* Rutas de finanzas */}
        <Route path="/finanzas" element={
          <PrivateRoute>
            <Finanzas />
          </PrivateRoute>
        } />
        
        <Route path="/finanzas/nueva-transaccion" element={
          <PrivateRoute>
            <NuevaTransaccion />
          </PrivateRoute>
        } />
        
        {/* Ruta de reportes */}
        <Route path="/reportes" element={
          <PrivateRoute>
            <Reportes />
          </PrivateRoute>
        } />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
