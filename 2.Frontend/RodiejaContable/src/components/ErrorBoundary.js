import React, { Component } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '24px',
          flexDirection: 'column',
          textAlign: 'center',
        }}>
          <Result
            status="500"
            title="¡Ups! Algo salió mal"
            subTitle={
              <div>
                <p>Hemos encontrado un error inesperado.</p>
                {process.env.NODE_ENV === 'development' && (
                  <details style={{ whiteSpace: 'pre-wrap', marginTop: '16px' }}>
                    <summary>Detalles del error</summary>
                    <div style={{ textAlign: 'left', marginTop: '8px' }}>
                      <p><strong>Error:</strong> {this.state.error?.toString()}</p>
                      <p><strong>Stack:</strong> {this.state.errorInfo?.componentStack}</p>
                    </div>
                  </details>
                )}
              </div>
            }
            extra={[
              <Button 
                key="home" 
                type="primary" 
                icon={<HomeOutlined />} 
                onClick={() => window.location.href = '/'}
                style={{ marginRight: '8px' }}
              >
                Ir al inicio
              </Button>,
              <Button 
                key="reload" 
                icon={<ReloadOutlined />} 
                onClick={() => window.location.reload()}
              >
                Recargar página
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente de envoltura para usar hooks
const ErrorBoundaryWrapper = (props) => {
  const navigate = useNavigate();
  
  // Función para manejar la navegación al inicio
  const goHome = () => {
    navigate('/');
  };
  
  return <ErrorBoundary {...props} onGoHome={goHome} />;
};

export default ErrorBoundaryWrapper;
