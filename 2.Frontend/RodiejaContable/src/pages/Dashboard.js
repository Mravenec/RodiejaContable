import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, Typography, Divider, message, Table } from 'antd';
import { 
  CarOutlined, 
  DollarOutlined, 
  ShoppingCartOutlined, 
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BarChartOutlined,
  ToolOutlined,
  FileTextOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { Loading } from '../components/Loading';
import { dashboardService } from '../api';

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalVentas: 0,
    totalVehiculos: 0,
    totalRepuestos: 0,
    totalClientes: 0,
    totalEgresos: 0,
    margenBeneficio: 0,
    roiPromedio: 0,
    ventasMensuales: [],
    vehiculosMasVendidos: [],
    repuestosMasVendidos: [],
    comisiones: []
  });
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const stats = await dashboardService.getDashboardStats();
        
        // Fetch additional data in parallel
        const [
          ventasMensuales, 
          vehiculosMasVendidos, 
          repuestosMasVendidos,
          comisiones
        ] = await Promise.all([
          dashboardService.getVentasMensuales(),
          dashboardService.getVehiculosMasVendidos(),
          dashboardService.getRepuestosMasVendidos(),
          dashboardService.getComisionesVendedores()
        ]);

        setDashboardData({
          ...stats,
          ventasMensuales: ventasMensuales.data || [],
          vehiculosMasVendidos: vehiculosMasVendidos.data || [],
          repuestosMasVendidos: repuestosMasVendidos.data || [],
          comisiones: comisiones.data || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  const { 
    totalVehiculos, 
    totalRepuestos, 
    totalVentas: ingresosTotales, 
    totalClientes,
    totalEgresos: egresosTotales,
    margenBeneficio,
    roiPromedio,
    ventasMensuales,
    vehiculosMasVendidos,
    repuestosMasVendidos,
    comisiones
  } = dashboardData;
  
  // Calcular valores derivados
  const balance = ingresosTotales - egresosTotales;
  const vehiculosEnVenta = Math.floor(totalVehiculos * 0.8); // Ejemplo: 80% de vehículos en venta
  const repuestosBajoStock = Math.floor(totalRepuestos * 0.2); // Ejemplo: 20% de repuestos con stock bajo
  const estadisticasVentas = {
    total: ingresosTotales,
    promedioMensual: Math.round(ingresosTotales / 12),
    crecimiento: 12.5, // Porcentaje de crecimiento
    meses: ventasMensuales
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="dashboard-container" style={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
      <Title level={2} style={{ marginBottom: '24px', fontSize: { xs: '20px', sm: '24px' } }}>Panel de Control</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
            <Statistic
              title="Vehículos en Inventario"
              value={totalVehiculos}
              prefix={<CarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ fontSize: { xs: '18px', sm: '22px', md: '24px' } }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">{vehiculosEnVenta} disponibles para venta</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
            <Statistic
              title="Repuestos en Inventario"
              value={totalRepuestos}
              prefix={<ToolOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ fontSize: { xs: '18px', sm: '22px', md: '24px' } }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type={repuestosBajoStock > 0 ? 'danger' : 'secondary'}>
                {repuestosBajoStock} con stock bajo
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
            <Statistic
              title="Ingresos Totales"
              value={ingresosTotales}
              precision={2}
              valueStyle={{ 
                color: '#52c41a',
                fontSize: { xs: '18px', sm: '22px', md: '24px' }
              }}
              prefix={<DollarOutlined />}
              formatter={value => formatCurrency(value)}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="success">
                Último mes: {formatCurrency(estadisticasVentas.ingresos_mes_actual || 0)}
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
            <Statistic
              title="Egresos Totales"
              value={egresosTotales}
              precision={2}
              valueStyle={{ 
                color: '#f5222d',
                fontSize: { xs: '18px', sm: '22px', md: '24px' }
              }}
              prefix={<DollarOutlined />}
              formatter={value => formatCurrency(value)}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="danger">
                Último mes: {formatCurrency(estadisticasVentas.egresos_mes_actual || 0)}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Balance General"
            bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}
          >
            <div style={{ textAlign: 'center' }}>
              <Statistic
                title="Balance Actual"
                value={balance}
                precision={2}
                valueStyle={{
                  color: balance >= 0 ? '#52c41a' : '#f5222d',
                  fontSize: { xs: '20px', sm: '22px', md: '24px' },
                  marginBottom: '16px'
                }}
                prefix={balance >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                formatter={value => formatCurrency(value)}
              />
              <div style={{ marginTop: 16 }}>
                <Text type={balance >= 0 ? 'success' : 'danger'}>
                  {balance >= 0 ? 'Ganancias' : 'Pérdidas'}: {formatCurrency(Math.abs(balance))}
                </Text>
              </div>
              
              <Divider style={{ margin: { xs: '12px 0', sm: '16px 0' } }} />
              
              <Row gutter={[8, 16]}>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Vehículos más vendidos"
                    value={vehiculosMasVendidos.length}
                    valueStyle={{ fontSize: { xs: '18px', sm: '20px', md: '22px' } }}
                    prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                  />
                  <div style={{ marginTop: 8, textAlign: 'left', paddingLeft: 8 }}>
                    {vehiculosMasVendidos.slice(0, 3).map((item, index) => (
                      <div key={index} style={{ marginBottom: 4 }}>
                        <Text 
                          ellipsis={{ tooltip: `${item.nombre} (${item.cantidad})` }}
                          style={{ 
                            maxWidth: '100%', 
                            display: 'inline-block',
                            fontSize: { xs: '12px', sm: '14px' }
                          }}
                        >
                          {item.nombre} ({item.cantidad})
                        </Text>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Repuestos más vendidos"
                    value={repuestosMasVendidos.length}
                    valueStyle={{ fontSize: { xs: '18px', sm: '20px', md: '22px' } }}
                    prefix={<ToolOutlined style={{ color: '#722ed1' }} />}
                  />
                  <div style={{ marginTop: 8, textAlign: 'left', paddingLeft: 8 }}>
                    {repuestosMasVendidos.slice(0, 3).map((item, index) => (
                      <div key={index} style={{ marginBottom: 4 }}>
                        <Text 
                          ellipsis={{ tooltip: `${item.nombre} (${item.cantidad})` }}
                          style={{ 
                            maxWidth: '100%', 
                            display: 'inline-block',
                            fontSize: { xs: '12px', sm: '14px' }
                          }}
                        >
                          {item.nombre} ({item.cantidad})
                        </Text>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Comisiones del Mes"
            bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}
          >
            {comisiones && comisiones.length > 0 ? (
              <div>
                {comisiones.map((comision, index) => (
                  <div key={index} style={{ 
                    marginBottom: 12,
                    padding: { xs: '8px', sm: '12px' },
                    backgroundColor: { xs: '#f9f9f9', sm: 'transparent' },
                    borderRadius: '4px'
                  }}>
                    <Row gutter={[8, 8]} align="middle">
                      <Col xs={24} sm={10}>
                        <UserOutlined style={{ marginRight: 8 }} />
                        <Text strong style={{ fontSize: { xs: '13px', sm: '14px' } }}>
                          {comision.nombre_empleado}
                        </Text>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Text strong style={{ fontSize: { xs: '12px', sm: '14px' } }}>
                          {comision.total_transacciones} {window.innerWidth < 576 ? 'trans.' : 'transacciones'}
                        </Text>
                      </Col>
                      <Col xs={12} sm={8} style={{ textAlign: { xs: 'right', sm: 'left' } }}>
                        <Text type="success" style={{ fontSize: { xs: '13px', sm: '14px' } }}>
                          {formatCurrency(comision.total_comision)}
                        </Text>
                      </Col>
                      <Col xs={24}>
                        <Text type="secondary" style={{ fontSize: { xs: '12px', sm: '13px' } }}>
                          Ventas: {formatCurrency(comision.total_ventas)}
                        </Text>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">No hay datos de comisiones disponibles</Text>
            )}
            
            <Divider style={{ margin: { xs: '12px 0', sm: '16px 0' } }} />
            
            <div>
              <Title level={5} style={{ marginBottom: 16, fontSize: { xs: '16px', sm: '18px' } }}>
                Estadísticas de Ventas
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card size="small" bodyStyle={{ padding: '12px 16px' }}>
                    <Statistic
                      title="Ventas del Mes"
                      value={estadisticasVentas.ventas_mes_actual || 0}
                      prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                      valueStyle={{ 
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 500
                      }}
                      formatter={value => formatCurrency(value)}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card size="small" bodyStyle={{ padding: '12px 16px' }}>
                    <Statistic
                      title="Vehículos Vendidos"
                      value={estadisticasVentas.vehiculos_vendidos_mes || 0}
                      prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                      valueStyle={{ 
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 500
                      }}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Text type="secondary">
                    Comparación con el mes anterior: {estadisticasVentas.variacion_ventas || 0}%
                    {estadisticasVentas.variacion_ventas > 0 ? (
                      <ArrowUpOutlined style={{ color: '#52c41a', marginLeft: 4 }} />
                    ) : estadisticasVentas.variacion_ventas < 0 ? (
                      <ArrowDownOutlined style={{ color: '#f5222d', marginLeft: 4 }} />
                    ) : null}
                  </Text>
                </Col>
              </Row>
            </div>
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
                  <CarOutlined style={{ fontSize: 24, marginBottom: 8, color: '#1890ff' }} />
                  <div>Agregar Vehículo</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center' }}
                  onClick={() => navigate('/inventario/nuevo')}
                >
                  <ToolOutlined style={{ fontSize: 24, marginBottom: 8, color: '#722ed1' }} />
                  <div>Agregar Repuesto</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center' }}
                  onClick={() => navigate('/finanzas/nueva-transaccion')}
                >
                  <DollarOutlined style={{ fontSize: 24, marginBottom: 8, color: '#52c41a' }} />
                  <div>Nueva Transacción</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ textAlign: 'center' }}
                  onClick={() => navigate('/reportes')}
                >
                  <FileTextOutlined style={{ fontSize: 24, marginBottom: 8, color: '#fa8c16' }} />
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
