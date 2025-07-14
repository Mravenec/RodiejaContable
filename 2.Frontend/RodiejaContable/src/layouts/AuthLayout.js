import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Typography } from 'antd';

const { Content, Footer } = Layout;
const { Title } = Typography;

const AuthLayout = () => {
  return (
    <Layout style={{ minHeight: '100%' }}>
      <Content style={{ padding: '24px', height: '100%' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '400px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Title level={2} style={{ color: '#1890ff' }}>Rodieja Contable</Title>
            <p style={{ color: '#666' }}>Sistema de Gestión Vehicular</p>
          </div>
          
          <Outlet />
          
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: '#999', fontSize: '12px' }}>
              © {new Date().getFullYear()} Rodieja Contable. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        <p style={{ color: '#999', margin: 0 }}>
          Versión 1.0.0
        </p>
      </Footer>
    </Layout>
  );
};

export default AuthLayout;
