import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  HomeOutlined, 
  CarOutlined, 
  ToolOutlined, 
  DollarOutlined, 
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = [
    { key: '/', icon: <HomeOutlined />, label: 'Inicio' },
    { 
      key: 'vehiculos', 
      icon: <CarOutlined />, 
      label: 'Vehículos',
      children: [
        { key: '/vehiculos', label: 'Lista de Vehículos' },
        { key: '/vehiculos/nuevo', label: 'Nuevo Vehículo' },
      ]
    },
    { 
      key: 'inventario', 
      icon: <ToolOutlined />, 
      label: 'Inventario',
      children: [
        { key: '/inventario', label: 'Lista de Repuestos' },
        { key: '/inventario/nuevo', label: 'Nuevo Repuesto' },
      ]
    },
    { 
      key: 'finanzas', 
      icon: <DollarOutlined />, 
      label: 'Finanzas',
      children: [
        { key: '/finanzas', label: 'Transacciones' },
        { key: '/finanzas/nueva', label: 'Nueva Transacción' },
      ]
    },
    { 
      key: 'reportes', 
      icon: <BarChartOutlined />, 
      label: 'Reportes',
      children: [
        { key: '/reportes/ventas', label: 'Ventas' },
        { key: '/reportes/inventario', label: 'Inventario' },
      ]
    },
    { 
      key: 'configuracion', 
      icon: <SettingOutlined />, 
      label: 'Configuración',
      children: [
        { key: '/configuracion/perfil', label: 'Mi Perfil' },
        { key: '/configuracion/ajustes', label: 'Ajustes' },
      ]
    },
    { 
      key: 'cerrar-sesion', 
      icon: <LogoutOutlined />, 
      label: 'Cerrar Sesión',
      onClick: () => {
        logout();
        navigate('/login');
      }
    },
  ];

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => key !== 'cerrar-sesion' && navigate(key)}
      />
    </Sider>
  );
};

export default Sidebar;
