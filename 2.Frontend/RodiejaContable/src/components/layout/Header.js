import React from 'react';
import { Layout, Button, Dropdown, Avatar, Typography } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header: AntdHeader } = Layout;
const { Text } = Typography;

const Header = ({ collapsed, toggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    {
      key: '1',
      label: 'Mi Perfil',
      icon: <UserOutlined />,
      onClick: () => navigate('/configuracion/perfil')
    },
    {
      key: '2',
      label: 'Configuración',
      icon: <SettingOutlined />,
      onClick: () => navigate('/configuracion')
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: 'Cerrar Sesión',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      }
    },
  ];

  return (
    <AntdHeader 
      style={{ 
        padding: 0, 
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        width: '100%',
        zIndex: 1,
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
        paddingLeft: '16px',
        paddingRight: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapse}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <div style={{ marginLeft: 16, fontSize: '18px', fontWeight: 'bold' }}>
          Rodieja Contable
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Dropdown menu={{ items }} trigger={['click']}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '8px' }}>
            <Avatar 
              style={{ backgroundColor: '#1890ff' }} 
              icon={<UserOutlined />} 
            />
            <div style={{ marginLeft: '8px' }}>
              <Text strong>{user?.name || 'Usuario'}</Text>
              <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                {user?.role || 'Administrador'}
              </Text>
            </div>
          </div>
        </Dropdown>
      </div>
    </AntdHeader>
  );
};

export default Header;
