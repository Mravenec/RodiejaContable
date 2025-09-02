import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  Typography, 
  Space,
  Statistic,
  Avatar,
  Progress,
  Tag
} from 'antd';
import { 
  BarChartOutlined, 
  PieChartOutlined, 
  LineChartOutlined, 
  DollarOutlined, 
  CarOutlined, 
  ShoppingCartOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Reportes = () => {
  const [rangoFechas, setRangoFechas] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
  // Datos de ejemplo para reportes
  const ventasPorMes = [
    { mes: 'Ene', ventas: 3, monto: 1250000 },
    { mes: 'Feb', ventas: 5, monto: 1850000 },
    { mes: 'Mar', ventas: 4, monto: 1500000 },
    { mes: 'Abr', ventas: 6, monto: 2200000 },
    { mes: 'May', ventas: 7, monto: 2600000 },
    { mes: 'Jun', ventas: 8, monto: 2950000 },
    { mes: 'Jul', ventas: 6, monto: 2250000 },
    { mes: 'Ago', ventas: 5, monto: 1950000 },
    { mes: 'Sep', ventas: 7, monto: 2550000 },
    { mes: 'Oct', ventas: 9, monto: 3200000 },
    { mes: 'Nov', ventas: 0, monto: 0 },
    { mes: 'Dic', ventas: 0, monto: 0 },
  ];
  
  const ventasPorModelo = [
    { modelo: 'Toyota Corolla', cantidad: 12, porcentaje: 24 },
    { modelo: 'Honda Civic', cantidad: 10, porcentaje: 20 },
    { modelo: 'Nissan Sentra', cantidad: 8, porcentaje: 16 },
    { modelo: 'Volkswagen Jetta', cantidad: 7, porcentaje: 14 },
    { modelo: 'Mazda 3', cantidad: 6, porcentaje: 12 },
    { modelo: 'Otras marcas', cantidad: 7, porcentaje: 14 },
  ];
  
  const metricas = {
    totalVentas: 50,
    totalIngresos: 18500000,
    promedioVenta: 370000,
    vehiculosStock: 24,
    tasaConversion: 68,
    clientesNuevos: 42,
    clientesRecurrentes: 8,
  };
  
  const ventasRecientes = [
    {
      id: 'VTA-2023-105',
      fecha: '2023-10-25',
      cliente: 'Juan Pérez',
      vehiculo: 'Toyota Corolla 2021',
      vendedor: 'Ana García',
      monto: 450000,
      estado: 'completado',
    },
    {
      id: 'VTA-2023-104',
      fecha: '2023-10-24',
      cliente: 'Empresa XYZ',
      vehiculo: 'Nissan Sentra 2022',
      vendedor: 'Carlos López',
      monto: 380000,
      estado: 'pendiente',
    },
    {
      id: 'VTA-2023-103',
      fecha: '2023-10-23',
      cliente: 'María Rodríguez',
      vehiculo: 'Honda Civic 2020',
      vendedor: 'Ana García',
      monto: 320000,
      estado: 'completado',
    },
    {
      id: 'VTA-2023-102',
      fecha: '2023-10-22',
      cliente: 'Roberto Sánchez',
      vehiculo: 'Mazda 3 2021',
      vendedor: 'Pedro Martínez',
      monto: 350000,
      estado: 'cancelado',
    },
    {
      id: 'VTA-2023-101',
      fecha: '2023-10-21',
      cliente: 'Laura González',
      vehiculo: 'Volkswagen Jetta 2022',
      vendedor: 'Carlos López',
      monto: 400000,
      estado: 'completado',
    },
  ];
  
  const columnsVentas = [
    {
      title: 'ID Venta',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
    },
    {
      title: 'Vehículo',
      dataIndex: 'vehiculo',
      key: 'vehiculo',
    },
    {
      title: 'Vendedor',
      dataIndex: 'vendedor',
      key: 'vendedor',
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => (
        <Text strong>${monto.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        const estadoConfig = {
          completado: { color: 'success', text: 'Completado' },
          pendiente: { color: 'processing', text: 'Pendiente' },
          cancelado: { color: 'error', text: 'Cancelado' },
        };
        
        const config = estadoConfig[estado] || { color: 'default', text: estado };
        
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
  ];
  
  const aplicarFiltros = () => {
    console.log('Aplicando filtros:', { rangoFechas, filtroTipo, filtroEstado });
    // Lógica para aplicar filtros
  };
  
  const limpiarFiltros = () => {
    setRangoFechas(null);
    setFiltroTipo('todos');
    setFiltroEstado('todos');
    // Lógica para limpiar filtros
  };
  
  const exportarReporte = (formato) => {
    console.log(`Exportando reporte en formato ${formato}`);
    // Lógica para exportar reporte
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>Reportes y Análisis</Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => exportarReporte('excel')}>
            Exportar a Excel
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => exportarReporte('pdf')}>
            Generar PDF
          </Button>
        </Space>
      </div>
      
      {/* Filtros */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <div>Rango de fechas:</div>
            <RangePicker 
              style={{ width: '100%' }} 
              value={rangoFechas}
              onChange={setRangoFechas}
            />
          </Col>
          <Col xs={24} md={6}>
            <div>Tipo de reporte:</div>
            <Select 
              style={{ width: '100%' }} 
              value={filtroTipo}
              onChange={setFiltroTipo}
            >
              <Option value="todos">Todos los reportes</Option>
              <Option value="ventas">Ventas</Option>
              <Option value="inventario">Inventario</Option>
              <Option value="financiero">Financiero</Option>
              <Option value="clientes">Clientes</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <div>Estado:</div>
            <Select 
              style={{ width: '100%' }} 
              value={filtroEstado}
              onChange={setFiltroEstado}
            >
              <Option value="todos">Todos los estados</Option>
              <Option value="completado">Completados</Option>
              <Option value="pendiente">Pendientes</Option>
              <Option value="cancelado">Cancelados</Option>
            </Select>
          </Col>
          <Col xs={24} md={6} style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <Button 
              type="primary" 
              icon={<FilterOutlined />}
              onClick={aplicarFiltros}
              block
            >
              Aplicar Filtros
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={limpiarFiltros}
            />
          </Col>
        </Row>
      </Card>
      
      {/* Métricas principales */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ventas Totales"
              value={metricas.totalVentas}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              suffix="unidades"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ingresos Totales"
              value={metricas.totalIngresos}
              precision={2}
              prefix="₡"
              suffix=""
              prefixCls="ant-statistic-content-value"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Vehículos en Stock"
              value={metricas.vehiculosStock}
              prefix={<CarOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tasa de Conversión"
              value={metricas.tasaConversion}
              suffix="%"
              prefix={<DollarOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Pestañas de reportes */}
      <Tabs defaultActiveKey="resumen">
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Resumen General
            </span>
          }
          key="resumen"
        >
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={16}>
              <Card 
                title="Ventas Mensuales" 
                extra={
                  <Select defaultValue="2023" style={{ width: 120 }}>
                    <Option value="2023">2023</Option>
                    <Option value="2022">2022</Option>
                    <Option value="2021">2021</Option>
                  </Select>
                }
              >
                <div style={{ height: '300px', textAlign: 'center' }}>
                  <img 
                    src="https://via.placeholder.com/800x300?text=Gráfico+de+Ventas+Mensuales" 
                    alt="Ventas Mensuales" 
                    style={{ maxWidth: '100%', maxHeight: '250px' }}
                  />
                </div>
                <Table 
                  columns={[
                    { title: 'Mes', dataIndex: 'mes', key: 'mes' },
                    { 
                      title: 'Ventas', 
                      dataIndex: 'ventas', 
                      key: 'ventas',
                      sorter: (a, b) => a.ventas - b.ventas,
                    },
                    { 
                      title: 'Monto Total', 
                      dataIndex: 'monto', 
                      key: 'monto',
                      render: (monto) => `$${monto.toLocaleString()}`,
                      sorter: (a, b) => a.monto - b.monto,
                    },
                  ]} 
                  dataSource={ventasPorMes} 
                  size="small"
                  pagination={false}
                  rowKey="mes"
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Ventas por Modelo">
                <div style={{ height: '300px', marginBottom: 16, textAlign: 'center' }}>
                  <img 
                    src="https://via.placeholder.com/400x300?text=Gráfico+de+Ventas+por+Modelo" 
                    alt="Ventas por Modelo" 
                    style={{ maxWidth: '100%', maxHeight: '250px' }}
                  />
                </div>
                {ventasPorModelo.map((item, index) => (
                  <div key={index} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>{item.modelo}</Text>
                      <Text strong>{item.cantidad} unidades</Text>
                    </div>
                    <Progress 
                      percent={item.porcentaje} 
                      showInfo={false} 
                      strokeColor={index % 2 === 0 ? '#1890ff' : '#52c41a'}
                    />
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
          
          <Card title="Ventas Recientes" style={{ marginTop: 16 }}>
            <Table 
              columns={columnsVentas} 
              dataSource={ventasRecientes} 
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <PieChartOutlined />
              Inventario
            </span>
          }
          key="inventario"
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4}>Reportes de Inventario</Title>
            <Text type="secondary">Análisis de niveles de inventario, rotación y más</Text>
            <div style={{ marginTop: 24 }}>
              <img 
                src="https://via.placeholder.com/800x400?text=Reportes+de+Inventario" 
                alt="Reportes de Inventario" 
                style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
              />
            </div>
          </div>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Financiero
            </span>
          }
          key="financiero"
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4}>Reportes Financieros</Title>
            <Text type="secondary">Estados financieros, flujo de caja y análisis de rentabilidad</Text>
            <div style={{ marginTop: 24 }}>
              <img 
                src="https://via.placeholder.com/800x400?text=Reportes+Financieros" 
                alt="Reportes Financieros" 
                style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
              />
            </div>
          </div>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              Rendimiento
            </span>
          }
          key="rendimiento"
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4}>Rendimiento y Métricas</Title>
            <Text type="secondary">Métricas de rendimiento, KPI y análisis comparativos</Text>
            <div style={{ marginTop: 24 }}>
              <img 
                src="https://via.placeholder.com/800x400?text=Métricas+de+Rendimiento" 
                alt="Métricas de Rendimiento" 
                style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Reportes;
