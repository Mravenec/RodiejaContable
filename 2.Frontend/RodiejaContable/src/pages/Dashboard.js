import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, Typography, Divider } from 'antd';
import { 
  CarOutlined, 
  DollarOutlined, 
  ShoppingCartOutlined, 
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useQuery } from 'react-query';
import { mockApi } from '../api/mockApi';
import { Loading } from '../components/Loading';

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  // Obtener datos del dashboard
  const { data: dashboardData, isLoading, error } = useQuery('dashboard', async () => {
    // En una aplicación real, aquí harías una llamada a tu API
    const [
      { data: vehiculos },
      { data: inventario },
      { data: finanzas },
    ] = await Promise.all([
      mockApi.getVehiculos(),
      mockApi.getInventario(),
      mockApi.getResumenFinanciero(),
    ]);

    return {
      totalVehiculos: vehiculos.length,
      totalRepuestos: inventario.length,
      ingresosTotales: finanzas.ingresosTotales,
      egresosTotales: finanzas.egresosTotales,
      balance: finanzas.balance,
      ventasPorVendedor: finanzas.ventasPorVendedor,
    };
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error al cargar los datos del dashboard</div>;

  const { 
    totalVehiculos = 0, 
    totalRepuestos = 0, 
    ingresosTotales = 0, 
    egresosTotales = 0,
    balance = 0,
    ventasPorVendedor = []
  } = dashboardData || {};

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div>
      <Title level={2}>Panel de Control</Title>
      <Text type="secondary">Resumen general del sistema</Text>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Vehículos en Inventario"
              value={totalVehiculos}
              prefix={<CarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Repuestos en Inventario"
              value={totalRepuestos}
              prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ingresos Totales"
              value={ingresosTotales}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
              formatter={value => formatCurrency(value)}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Egresos Totales"
              value={egresosTotales}
              precision={2}
              valueStyle={{ color: '#f5222d' }}
              prefix={<DollarOutlined />}
              formatter={value => formatCurrency(value)}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Balance General" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Statistic
                title="Balance Actual"
                value={balance}
                precision={2}
                valueStyle={{
                  color: balance >= 0 ? '#52c41a' : '#f5222d',
                  fontSize: '32px',
                  fontWeight: 'bold',
                }}
                prefix={balance >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                formatter={value => formatCurrency(value)}
              />
              <div style={{ marginTop: 16 }}>
                <Text type={balance >= 0 ? 'success' : 'danger'}>
                  {balance >= 0 ? 'Ganancias' : 'Pérdidas'}: {formatCurrency(Math.abs(balance))}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Ventas por Vendedor">
            {ventasPorVendedor.length > 0 ? (
              <div>
                {ventasPorVendedor.map((vendedor, index) => (
                  <div key={index} style={{ marginBottom: 12 }}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <UserOutlined style={{ marginRight: 8 }} />
                        <Text strong>{vendedor.vendedor}</Text>
                      </Col>
                      <Col>
                        <Text strong>{vendedor.cantidadVentas} ventas</Text>
                      </Col>
                      <Col>
                        <Text type="success">
                          {formatCurrency(vendedor.totalVentas)}
                        </Text>
                      </Col>
                    </Row>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">
                        Comisiones: {formatCurrency(vendedor.comisiones)}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">No hay datos de ventas disponibles</Text>
            )}
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Acciones Rápidas">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center' }}
                  onClick={() => navigate('/vehiculos/nuevo')}
                >
                  <CarOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                  <div>Agregar Vehículo</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center' }}
                  onClick={() => navigate('/inventario/nuevo')}
                >
                  <ShoppingCartOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                  <div>Agregar Repuesto</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center' }}
                  onClick={() => navigate('/finanzas/nueva-transaccion')}
                >
                  <DollarOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                  <div>Nueva Transacción</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center' }}
                  onClick={() => navigate('/reportes')}
                >
                  <BarChartOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                  <div>Ver Reportes</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
