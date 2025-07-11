import React from 'react';
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

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Datos de ejemplo para el dashboard
  const data = {
    totalVentas: 125000,
    totalVehiculos: 8,
    totalRepuestos: 45,
    totalClientes: 32,
    ventasMensuales: [
      { mes: 'Ene', ventas: 12000 },
      { mes: 'Feb', ventas: 19000 },
      { mes: 'Mar', ventas: 15000 },
      { mes: 'Abr', ventas: 18000 },
      { mes: 'May', ventas: 21000 },
      { mes: 'Jun', ventas: 25000 },
      { mes: 'Jul', ventas: 15000 },
    ],
    vehiculosMasVendidos: [
      { id: 1, modelo: 'Toyota Corolla', cantidad: 5 },
      { id: 2, modelo: 'Honda Civic', cantidad: 4 },
      { id: 3, modelo: 'Nissan Sentra', cantidad: 3 },
    ],
    repuestosMasVendidos: [
      { id: 1, nombre: 'Filtro de aceite', cantidad: 15 },
      { id: 2, nombre: 'Pastillas de freno', cantidad: 12 },
      { id: 3, nombre: 'Aceite de motor', cantidad: 10 },
    ],
    comisiones: [
      { id: 1, nombre: 'Juan Pérez', monto: 2500 },
      { id: 2, nombre: 'María López', monto: 1800 },
      { id: 3, nombre: 'Carlos Gómez', monto: 1500 },
    ]
  };

  const isLoading = false;
  
  // Simular carga de datos
  React.useEffect(() => {
    console.log('Cargando datos del dashboard...');
  }, []);

  if (isLoading) return <Loading />;

  const { 
    totalVehiculos, 
    totalRepuestos, 
    totalVentas: ingresosTotales, 
    totalClientes,
    totalEgresos: egresosTotales = 50000,
    ventasMensuales = [],
    vehiculosMasVendidos = [],
    repuestosMasVendidos = [],
    comisiones = []
  } = data;
  
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
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">{vehiculosEnVenta} disponibles para venta</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Repuestos en Inventario"
              value={totalRepuestos}
              prefix={<ToolOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type={repuestosBajoStock > 0 ? 'danger' : 'secondary'}>
                {repuestosBajoStock} con stock bajo
              </Text>
            </div>
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
            <div style={{ marginTop: 8 }}>
              <Text type="success">
                Último mes: {formatCurrency(estadisticasVentas.ingresos_mes_actual || 0)}
              </Text>
            </div>
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
            <div style={{ marginTop: 8 }}>
              <Text type="danger">
                Último mes: {formatCurrency(estadisticasVentas.egresos_mes_actual || 0)}
              </Text>
            </div>
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
              
              <Divider />
              
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Vehículos más vendidos"
                    value={vehiculosMasVendidos.length}
                    prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                  />
                  <div style={{ marginTop: 8, textAlign: 'left', paddingLeft: 8 }}>
                    {vehiculosMasVendidos.slice(0, 3).map((item, index) => (
                      <div key={index} style={{ marginBottom: 4 }}>
                        <Text ellipsis style={{ maxWidth: '100%', display: 'inline-block' }}>
                          {item.nombre} ({item.cantidad})
                        </Text>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Repuestos más vendidos"
                    value={repuestosMasVendidos.length}
                    prefix={<ToolOutlined style={{ color: '#722ed1' }} />}
                  />
                  <div style={{ marginTop: 8, textAlign: 'left', paddingLeft: 8 }}>
                    {repuestosMasVendidos.slice(0, 3).map((item, index) => (
                      <div key={index} style={{ marginBottom: 4 }}>
                        <Text ellipsis style={{ maxWidth: '100%', display: 'inline-block' }}>
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
        
        <Col xs={24} md={12}>
          <Card title="Comisiones del Mes">
            {comisiones && comisiones.length > 0 ? (
              <div>
                {comisiones.map((comision, index) => (
                  <div key={index} style={{ marginBottom: 12 }}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <UserOutlined style={{ marginRight: 8 }} />
                        <Text strong>{comision.nombre_empleado}</Text>
                      </Col>
                      <Col>
                        <Text strong>{comision.total_transacciones} transacciones</Text>
                      </Col>
                      <Col>
                        <Text type="success">
                          {formatCurrency(comision.total_comision)}
                        </Text>
                      </Col>
                    </Row>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">
                        Ventas: {formatCurrency(comision.total_ventas)}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">No hay datos de comisiones disponibles</Text>
            )}
            
            <Divider />
            
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>Estadísticas de Ventas</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Ventas del Mes"
                    value={estadisticasVentas.ventas_mes_actual || 0}
                    prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ fontSize: '18px' }}
                    formatter={value => formatCurrency(value)}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Vehículos Vendidos"
                    value={estadisticasVentas.vehiculos_vendidos_mes || 0}
                    prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                    valueStyle={{ fontSize: '18px' }}
                  />
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
