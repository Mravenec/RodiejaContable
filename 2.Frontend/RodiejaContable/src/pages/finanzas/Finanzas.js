import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Typography, 
  Row, 
  Col, 
  Statistic,
  Tag,
  Tabs,
  Badge,
  Space,
  Menu,
  Dropdown,
  Divider,
  InputNumber,
  Input as AntdInput,
  message
} from 'antd';
import { 
  DollarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  PlusOutlined,
  MoreOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  FileTextOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Search } = AntdInput;
const { Option } = Select;
const { TabPane } = Tabs;

const Finanzas = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    tipo: null,
    categoria: null,
    estado: null,
    rangoFechas: null,
  });
  const [tabActivo, setTabActivo] = useState('transacciones');
  
  // Datos de ejemplo (serán reemplazados con datos reales)
  const transacciones = [
    {
      id: 'TXN-2023-001',
      fecha: '2023-10-25',
      tipo: 'ingreso',
      monto: 450000,
      categoria: 'Venta de vehículo',
      descripcion: 'Venta de Toyota Corolla 2021',
      referencia: 'VTA-2023-045',
      estado: 'completado',
      metodoPago: 'Transferencia',
      cuenta: 'Banco Principal',
    },
    {
      id: 'TXN-2023-002',
      fecha: '2023-10-24',
      tipo: 'egreso',
      monto: 12500,
      categoria: 'Compra de repuestos',
      descripcion: 'Compra de repuestos para inventario',
      referencia: 'CMP-2023-128',
      estado: 'completado',
      metodoPago: 'Tarjeta de crédito',
      cuenta: 'Tarjeta Empresarial',
    },
    {
      id: 'TXN-2023-003',
      fecha: '2023-10-23',
      tipo: 'ingreso',
      monto: 2500,
      categoria: 'Servicio de mantenimiento',
      descripcion: 'Cambio de aceite y filtros',
      referencia: 'SER-2023-078',
      estado: 'pendiente',
      metodoPago: 'Efectivo',
      cuenta: 'Caja Chica',
    },
    {
      id: 'TXN-2023-004',
      fecha: '2023-10-22',
      tipo: 'egreso',
      monto: 8500,
      categoria: 'Gastos de oficina',
      descripcion: 'Material de oficina y suministros',
      referencia: 'GTO-2023-056',
      estado: 'completado',
      metodoPago: 'Transferencia',
      cuenta: 'Banco Principal',
    },
    {
      id: 'TXN-2023-005',
      fecha: '2023-10-21',
      tipo: 'ingreso',
      monto: 320000,
      categoria: 'Venta de vehículo',
      descripcion: 'Venta de Honda Civic 2019',
      referencia: 'VTA-2023-044',
      estado: 'completado',
      metodoPago: 'Crédito',
      cuenta: 'Cuentas por Cobrar',
    },
  ];
  
  const categoriasIngresos = [
    'Venta de vehículo',
    'Servicio de mantenimiento',
    'Financiamiento',
    'Otros ingresos',
  ];
  
  const categoriasEgresos = [
    'Compra de vehículo',
    'Compra de repuestos',
    'Nómina',
    'Servicios',
    'Impuestos',
    'Gastos de oficina',
    'Publicidad',
    'Mantenimiento',
    'Otros gastos',
  ];
  
  const cuentas = [
    'Efectivo',
    'Caja Chica',
    'Banco Principal',
    'Tarjeta de Crédito',
    'Cuentas por Cobrar',
    'Cuentas por Pagar',
  ];
  
  const metodosPago = [
    'Efectivo',
    'Transferencia',
    'Tarjeta de crédito',
    'Tarjeta de débito',
    'Cheque',
    'Crédito',
  ];
  
  const estados = [
    { value: 'completado', label: 'Completado', color: 'success' },
    { value: 'pendiente', label: 'Pendiente', color: 'processing' },
    { value: 'cancelado', label: 'Cancelado', color: 'error' },
    { value: 'reembolsado', label: 'Reembolsado', color: 'default' },
  ];
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      width: 120,
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.referencia}
          </Text>
        </div>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
      width: 180,
      filters: [
        ...categoriasIngresos.map(cat => ({ text: cat, value: cat })),
        ...categoriasEgresos.map(cat => ({ text: cat, value: cat }))
      ],
      onFilter: (value, record) => record.categoria === value,
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      width: 150,
      render: (monto, record) => (
        <Text 
          strong 
          style={{ 
            color: record.tipo === 'ingreso' ? '#52c41a' : '#f5222d' 
          }}
        >
          {record.tipo === 'ingreso' ? '+' : '-'}${monto.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      ),
      sorter: (a, b) => a.monto - b.monto,
    },
    {
      title: 'Método de Pago',
      dataIndex: 'metodoPago',
      key: 'metodoPago',
      width: 150,
      filters: metodosPago.map(metodo => ({ text: metodo, value: metodo })),
      onFilter: (value, record) => record.metodoPago === value,
    },
    {
      title: 'Cuenta',
      dataIndex: 'cuenta',
      key: 'cuenta',
      width: 150,
      filters: cuentas.map(cuenta => ({ text: cuenta, value: cuenta })),
      onFilter: (value, record) => record.cuenta === value,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 130,
      render: (estado) => {
        const estadoInfo = estados.find(e => e.value === estado) || { label: 'Desconocido', color: 'default' };
        return (
          <Tag color={estadoInfo.color}>
            {estadoInfo.label}
          </Tag>
        );
      },
      filters: estados.map(estado => ({ 
        text: estado.label, 
        value: estado.value 
      })),
      onFilter: (value, record) => record.estado === value,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 50,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<FileTextOutlined />}>
                Ver detalles
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />}>
                Editar
              </Menu.Item>
              <Menu.Item key="print" icon={<DownloadOutlined />}>
                Descargar recibo
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
                Eliminar
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];
  
  // Calcular totales
  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso' && t.estado === 'completado')
    .reduce((sum, t) => sum + t.monto, 0);
    
  const totalEgresos = transacciones
    .filter(t => t.tipo === 'egreso' && t.estado === 'completado')
    .reduce((sum, t) => sum + t.monto, 0);
    
  const balance = totalIngresos - totalEgresos;
  
  const handleSearch = (value) => {
    console.log('Buscar:', value);
    // Implementar búsqueda
  };
  
  const handleFilterChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
    // Aplicar filtros
  };
  
  const clearFilters = () => {
    setFiltros({
      tipo: null,
      categoria: null,
      estado: null,
      rangoFechas: null,
    });
  };
  
  const handleTabChange = (key) => {
    setTabActivo(key);
  };
  
  const handleNuevaTransaccion = (tipo) => {
    navigate(`/finanzas/nueva-transaccion?tipo=${tipo}`);
  };
  
  const menu = (
    <Menu>
      <Menu.Item key="ingreso" onClick={() => handleNuevaTransaccion('ingreso')}>
        <ArrowUpOutlined style={{ color: '#52c41a', marginRight: 8 }} />
        Nuevo Ingreso
      </Menu.Item>
      <Menu.Item key="egreso" onClick={() => handleNuevaTransaccion('egreso')}>
        <ArrowDownOutlined style={{ color: '#f5222d', marginRight: 8 }} />
        Nuevo Egreso
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="transferencia" onClick={() => handleNuevaTransaccion('transferencia')}>
        <SwapOutlined style={{ marginRight: 8 }} />
        Transferencia entre Cuentas
      </Menu.Item>
    </Menu>
  );
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>Finanzas</Title>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="primary" icon={<PlusOutlined />}>
            Nueva Transacción
          </Button>
        </Dropdown>
      </div>
      
      {/* Resumen Financiero */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Ingresos"
              value={totalIngresos}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="MXN"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Egresos"
              value={totalEgresos}
              precision={2}
              valueStyle={{ color: '#f5222d' }}
              prefix={<ArrowDownOutlined />}
              suffix="MXN"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Balance"
              value={balance}
              precision={2}
              valueStyle={{ 
                color: balance >= 0 ? '#52c41a' : '#f5222d',
                fontWeight: 'bold'
              }}
              prefix={balance >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="MXN"
            />
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Tabs 
          defaultActiveKey="transacciones" 
          onChange={handleTabChange}
          tabBarExtraContent={
            <Space>
              <RangePicker 
                style={{ width: 250 }}
                value={filtros.rangoFechas}
                onChange={(dates) => handleFilterChange('rangoFechas', dates)}
              />
              <Select
                placeholder="Todas las categorías"
                style={{ width: 200 }}
                allowClear
                value={filtros.categoria}
                onChange={(value) => handleFilterChange('categoria', value)}
              >
                <Option value="ingresos">
                  <div style={{ fontWeight: 'bold' }}>Ingresos</div>
                </Option>
                {categoriasIngresos.map((cat, index) => (
                  <Option key={`ing-${index}`} value={cat}>
                    <div style={{ paddingLeft: '16px' }}>{cat}</div>
                  </Option>
                ))}
                <Option value="egresos">
                  <div style={{ fontWeight: 'bold' }}>Egresos</div>
                </Option>
                {categoriasEgresos.map((cat, index) => (
                  <Option key={`egr-${index}`} value={cat}>
                    <div style={{ paddingLeft: '16px' }}>{cat}</div>
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Todas las cuentas"
                style={{ width: 180 }}
                allowClear
                value={filtros.cuenta}
                onChange={(value) => handleFilterChange('cuenta', value)}
              >
                {cuentas.map((cuenta, index) => (
                  <Option key={index} value={cuenta}>{cuenta}</Option>
                ))}
              </Select>
              <Button icon={<FilterOutlined />} onClick={clearFilters}>
                Limpiar
              </Button>
            </Space>
          }
        >
          <TabPane
            tab={
              <span>
                <TransactionOutlined />
                Transacciones
              </span>
            }
            key="transacciones"
          >
            <div style={{ marginBottom: 16 }}>
              <Search
                placeholder="Buscar transacciones..."
                allowClear
                enterButton={<SearchOutlined />}
                style={{ width: 300 }}
                onSearch={handleSearch}
              />
            </div>
            
            <Table 
              columns={columns} 
              dataSource={transacciones} 
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} transacciones`
              }}
              scroll={{ x: 1500 }}
            />
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Resumen
              </span>
            }
            key="resumen"
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={4} type="secondary">Resumen y Análisis Financiero</Title>
              <Text type="secondary">Gráficos y análisis detallados de ingresos y egresos</Text>
              <div style={{ marginTop: 24 }}>
                <img 
                  src="https://via.placeholder.com/800x400?text=Gráficos+de+Análisis+Financiero" 
                  alt="Análisis Financiero" 
                  style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                />
              </div>
            </div>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <PieChartOutlined />
                Categorías
              </span>
            }
            key="categorias"
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={4} type="secondary">Análisis por Categorías</Title>
              <Text type="secondary">Distribución de ingresos y gastos por categoría</Text>
              <div style={{ marginTop: 24 }}>
                <img 
                  src="https://via.placeholder.com/600x300?text=Gráfico+de+Categorías" 
                  alt="Análisis por Categorías" 
                  style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                />
              </div>
            </div>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <LineChartOutlined />
                Flujo de Caja
              </span>
            }
            key="flujo"
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={4} type="secondary">Flujo de Caja</Title>
              <Text type="secondary">Evolución de ingresos y egresos en el tiempo</Text>
              <div style={{ marginTop: 24 }}>
                <img 
                  src="https://via.placeholder.com/800x300?text=Gráfico+de+Flujo+de+Caja" 
                  alt="Flujo de Caja" 
                  style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>
      
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button type="text" icon={<DownloadOutlined />}>
            Exportar a Excel
          </Button>
          <Button type="text" icon={<FileTextOutlined />}>
            Generar Reporte
          </Button>
        </div>
        <div>
          <Text type="secondary">
            Mostrando {transacciones.length} transacciones
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Finanzas;
