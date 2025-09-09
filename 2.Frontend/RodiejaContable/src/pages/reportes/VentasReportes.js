import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Typography, 
  Button, 
  Space,
  Statistic,
  Select,
  DatePicker,
  Tag
} from 'antd';
import { 
  ShoppingCartOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  FileTextOutlined,
  PrinterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const VentasReportes = () => {
  const [rangoFechas, setRangoFechas] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
  // Datos de ejemplo para reportes de ventas
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
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
      sorter: (a, b) => a.cliente.localeCompare(b.cliente),
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
      sorter: (a, b) => a.vendedor.localeCompare(b.vendedor),
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => (
        <Text strong>₡{monto.toLocaleString()}</Text>
      ),
      sorter: (a, b) => a.monto - b.monto,
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
      filters: [
        { text: 'Completado', value: 'completado' },
        { text: 'Pendiente', value: 'pendiente' },
        { text: 'Cancelado', value: 'cancelado' },
      ],
      onFilter: (value, record) => record.estado === value,
    },
  ];

  const aplicarFiltros = () => {
    console.log('Aplicando filtros:', { rangoFechas, filtroEstado });
    // Lógica para aplicar filtros
  };
  
  const limpiarFiltros = () => {
    setRangoFechas(null);
    setFiltroEstado('todos');
    // Lógica para limpiar filtros
  };
  
  const exportarReporte = (formato) => {
    console.log(`Exportando reporte de ventas en formato ${formato}`);
    // Lógica para exportar reporte
  };

  // Calcular métricas
  const totalVentas = ventasRecientes.length;
  const totalIngresos = ventasRecientes.reduce((sum, venta) => sum + venta.monto, 0);
  const ventasCompletadas = ventasRecientes.filter(v => v.estado === 'completado').length;
  const tasaConversion = totalVentas > 0 ? Math.round((ventasCompletadas / totalVentas) * 100) : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>Reportes de Ventas</Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => exportarReporte('excel')}>
            Exportar a Excel
          </Button>
          <Button type="primary" icon={<PrinterOutlined />} onClick={() => exportarReporte('pdf')}>
            Imprimir Reporte
          </Button>
        </Space>
      </div>
      
      {/* Filtros */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <div>Rango de fechas:</div>
            <RangePicker 
              style={{ width: '100%' }} 
              value={rangoFechas}
              onChange={setRangoFechas}
            />
          </Col>
          <Col xs={24} md={8}>
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
          <Col xs={24} md={8} style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
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
              value={totalVentas}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              suffix="unidades"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ingresos Totales"
              value={totalIngresos}
              precision={2}
              prefix="₡"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ventas Completadas"
              value={ventasCompletadas}
              prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tasa de Conversión"
              value={tasaConversion}
              suffix="%"
              prefix={<FileTextOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Tabla de ventas */}
      <Card title="Ventas Recientes">
        <Table 
          columns={columnsVentas} 
          dataSource={ventasRecientes} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="middle"
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default VentasReportes;
