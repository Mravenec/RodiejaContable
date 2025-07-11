import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Result
        status="403"
        title="403"
        subTitle="Lo sentimos, no estás autorizado para acceder a esta página."
        extra={
          <>
            <Button type="primary" onClick={() => navigate('/')} style={{ marginRight: '8px' }}>
              Volver al inicio
            </Button>
            <Button onClick={() => navigate('/login')}>
              Iniciar sesión
            </Button>
          </>
        }
      />
    </div>
  );
};

export default Unauthorized;
