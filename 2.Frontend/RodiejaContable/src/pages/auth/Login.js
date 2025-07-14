import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // En una aplicación real, aquí se haría la autenticación con el backend
      if (values.username === 'admin' && values.password === 'admin123') {
        const userData = {
          id: 1,
          nombre: 'Administrador',
          email: 'admin@rodiejacontable.com',
          role: 'admin',
        };
        
        // Llamar a login con los datos del usuario
        await login(userData);
        
        // Navegar a la página de destino o al dashboard
        const from = location.state?.from?.pathname || '/';
        message.success('¡Bienvenido de nuevo!');
        navigate(from, { replace: true });
      } else {
        message.error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      message.error('Error al iniciar sesión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Card style={{ width: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Iniciar Sesión</h2>
      
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Por favor ingrese su usuario' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Usuario" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Contraseña"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
            size="large"
          >
            Iniciar Sesión
          </Button>
        </Form.Item>
        
        <div style={{ textAlign: 'center' }}>
          <Link to="/recuperar-contrasena">¿Olvidó su contraseña?</Link>
        </div>
      </Form>
    </Card>
    </div>
  );
};

export default Login;
