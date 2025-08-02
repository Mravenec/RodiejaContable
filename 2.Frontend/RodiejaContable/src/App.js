import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from 'antd';
import { HomeOutlined, CarOutlined, ToolOutlined, DollarOutlined, BarChartOutlined } from '@ant-design/icons';

// Componentes de autenticación
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Componentes principales
import Dashboard from './pages/Dashboard';

// Componentes de vehículos
import Vehiculos from './pages/vehiculos/Vehiculos';
import VehiculosJerarquicos from './components/vehiculos/VehiculosJerarquicos';
import NuevoVehiculo from './pages/vehiculos/NuevoVehiculo';
import EditarVehiculo from './pages/vehiculos/EditarVehiculo';
import DetalleVehiculo from './pages/vehiculos/DetalleVehiculo';

// Componentes de inventario
import Inventario from './pages/inventario/Inventario';
import NuevoRepuesto from './pages/inventario/NuevoRepuesto';
import EditarRepuesto from './pages/inventario/EditarRepuesto';
import DetalleRepuesto from './pages/inventario/DetalleRepuesto';

// Componentes de finanzas
import Finanzas from './pages/finanzas/Finanzas';
import NuevaTransaccion from './pages/finanzas/NuevaTransaccion';
import EditarTransaccion from './pages/finanzas/EditarTransaccion';
import DetalleTransaccion from './pages/finanzas/DetalleTransaccion';

// Componentes de reportes
import Reportes from './pages/reportes/Reportes';

// Componentes de configuración
import Perfil from './pages/configuracion/Perfil';
import Configuracion from './pages/configuracion/Configuracion';

// Componentes de utilidad
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Componente de menú lateral
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Componente para rutas privadas
const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene alguno de los roles requeridos
  if (roles.length > 0 && !roles.some(role => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />;
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

// Componente de layout principal
const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
      path: '/',
    },
    {
      key: 'vehiculos',
      icon: <CarOutlined />,
      label: 'Vehículos',
      path: '/vehiculos',
      children: [
        { key: 'nuevo-vehiculo', label: 'Nuevo Vehículo', path: '/vehiculos/nuevo' },
      ],
    },
    {
      key: 'inventario',
      icon: <ToolOutlined />,
      label: 'Inventario',
      path: '/inventario',
      children: [
        { key: 'nuevo-repuesto', label: 'Nuevo Repuesto', path: '/inventario/nuevo' },
      ],
    },
    {
      key: 'finanzas',
      icon: <DollarOutlined />,
      label: 'Finanzas',
      path: '/finanzas',
      children: [
        { key: 'nueva-transaccion', label: 'Nueva Transacción', path: '/finanzas/nueva' },
      ],
    },
    {
      key: 'reportes',
      icon: <BarChartOutlined />,
      label: 'Reportes',
      path: '/reportes',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar menuItems={menuItems} collapsed={collapsed} />
      <Layout style={{ marginLeft: collapsed ? '80px' : '200px', transition: 'margin-left 0.2s' }}>
        <div style={{ height: '64px' }}>
          <Header collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} user={user} />
        </div>
        <Layout.Content style={{ 
          margin: '24px 16px 0', 
          padding: 24,
          minHeight: 'calc(100vh - 180px)',
          background: '#f0f2f5',
          borderRadius: '8px 8px 0 0',
          overflow: 'auto',
          flex: '1 1 auto'
        }}>
          {children}
        </Layout.Content>
        <Layout.Footer style={{ 
          textAlign: 'center', 
          padding: '16px',
          background: '#fff',
          borderTop: '1px solid #f0f0f0',
          margin: '0 16px 16px',
          borderRadius: '0 0 8px 8px',
          position: 'sticky',
          bottom: 0,
          zIndex: 1
        }}>
          Rodieja Contable ©{new Date().getFullYear()} - Todos los derechos reservados
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <Routes>
      {/* Rutas de autenticación */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/registro"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />
      <Route
        path="/olvide-contrasena"
        element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        }
      />
      <Route
        path="/restablecer-contrasena/:token"
        element={
          <AuthRoute>
            <ResetPassword />
          </AuthRoute>
        }
      />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Rutas de vehículos */}
      <Route
        path="/vehiculos"
        element={
          <PrivateRoute>
            <MainLayout>
              <Vehiculos />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/vehiculos/jerarquia"
        element={
          <PrivateRoute>
            <MainLayout>
              <VehiculosJerarquicos />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/vehiculos/nuevo"
        element={
          <PrivateRoute roles={['admin', 'vendedor']}>
            <MainLayout>
              <NuevoVehiculo />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/vehiculos/editar/:id"
        element={
          <PrivateRoute roles={['admin', 'vendedor']}>
            <MainLayout>
              <EditarVehiculo />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/vehiculos/:id"
        element={
          <PrivateRoute>
            <MainLayout>
              <DetalleVehiculo />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Rutas de inventario */}
      <Route
        path="/inventario"
        element={
          <PrivateRoute>
            <MainLayout>
              <Inventario />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/inventario/nuevo"
        element={
          <PrivateRoute roles={['admin', 'inventario']}>
            <MainLayout>
              <NuevoRepuesto />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/inventario/editar/:id"
        element={
          <PrivateRoute roles={['admin', 'inventario']}>
            <MainLayout>
              <EditarRepuesto />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/inventario/:id"
        element={
          <PrivateRoute>
            <MainLayout>
              <DetalleRepuesto />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Rutas de finanzas */}
      <Route
        path="/finanzas"
        element={
          <PrivateRoute>
            <MainLayout>
              <Finanzas />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/finanzas/nueva"
        element={
          <PrivateRoute roles={['admin', 'finanzas']}>
            <MainLayout>
              <NuevaTransaccion />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/finanzas/editar/:id"
        element={
          <PrivateRoute roles={['admin', 'finanzas']}>
            <MainLayout>
              <EditarTransaccion />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/finanzas/:id"
        element={
          <PrivateRoute>
            <MainLayout>
              <DetalleTransaccion />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Rutas de reportes */}
      <Route
        path="/reportes"
        element={
          <PrivateRoute roles={['admin', 'gerente']}>
            <MainLayout>
              <Reportes />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Rutas de configuración */}
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <MainLayout>
              <Perfil />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/configuracion"
        element={
          <PrivateRoute roles={['admin']}>
            <MainLayout>
              <Configuracion />
            </MainLayout>
          </PrivateRoute>
        }
      />

      {/* Rutas de utilidad */}
      <Route
        path="/unauthorized"
        element={
          <MainLayout>
            <Unauthorized />
          </MainLayout>
        }
      />
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
