import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Typography,
  Badge,
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  FilterOutlined,
  BarcodeOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Inventario = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    estado: null,
    categoria: null,
    ubicacion: null,
  });
  
  // Datos de ejemplo (serán reemplazados con datos reales)
  const dataSource = [
    {
      id: 'REP001',
      nombre: 'Frenos delanteros',
      descripcion: 'Juego de pastillas de freno delantero',
      categoria: 'Frenos',
      marca: 'Brembo',
      modelo: 'P06047',
      cantidad: 4,
      minimo: 2,
      precio: 1200,
      costo: 800,
      ubicacion: 'A1-23',
      estado: 'disponible',
      vehiculo: 'Toyota Corolla 2021',
      proveedor: 'Autopartes MX',
    },
    {
      id: 'REP002',
      nombre: 'Aceite de motor',
      descripcion: 'Aceite sintético 5W-30',
      categoria: 'Lubricantes',
      marca: 'Mobil',
      modelo: '1',
      cantidad: 12,
      minimo: 5,
      precio: 350,
      costo: 250,
      ubicacion: 'B2-15',
      estado: 'disponible',
      vehiculo: 'Varios',
      proveedor: 'Lubricantes Premium',
    },
    {
      id: 'REP003',
      nombre: 'Batería',
      descripcion: 'Batería de 12V 60Ah',
      categoria: 'Eléctrico',
      marca: 'ACDelco',
      modelo: '24F-AGM',
      cantidad: 1,
      minimo: 2,
      precio: 4200,
      costo: 3200,
      ubicacion: 'C3-07',
      estado: 'bajo_stock',
      vehiculo: 'Honda Civic 2019',
      proveedor: 'Baterías del Norte',
    },
  ];
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.descripcion}</Text>
        </div>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
      width: 120,
      filters: [
        { text: 'Frenos', value: 'Frenos' },
        { text: 'Lubricantes', value: 'Lubricantes' },
        { text: 'Eléctrico', value: 'Eléctrico' },
      ],
      onFilter: (value, record) => record.categoria === value,
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      width: 120,
      render: (text, record) => (
        <div>
          <Text strong style={{ color: text <= record.minimo ? '#f5222d' : '#52c41a' }}>
            {text} {text === 1 ? 'unidad' : 'unidades'}
          </Text>
          {text <= record.minimo && (
            <div style={{ fontSize: '12px', color: '#f5222d' }}>Stock mínimo: {record.minimo}</div>
          )}
        </div>
      ),
      sorter: (a, b) => a.cantidad - b.cantidad,
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacion',
      key: 'ubicacion',
      width: 100,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      width: 120,
      render: (text) => `$${text.toLocaleString()}`,
      sorter: (a, b) => a.precio - b.precio,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 140,
      render: (estado) => {
        const estados = {
          disponible: {
            color: 'success',
            text: 'Disponible',
            icon: <CheckCircleOutlined />
          },
          agotado: {
            color: 'error',
            text: 'Agotado',
            icon: <CloseCircleOutlined />
          },
          bajo_stock: {
            color: 'warning',
            text: 'Bajo stock',
            icon: <SyncOutlined spin />
          },
          en_uso: {
            color: 'processing',
            text: 'En uso',
            icon: <ToolOutlined />
          }
        };
        
        const estadoInfo = estados[estado] || { color: 'default', text: 'Desconocido', icon: null };
        
        return (
          <Tag color={estadoInfo.color} icon={estadoInfo.icon}>
            {estadoInfo.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Disponible', value: 'disponible' },
        { text: 'Agotado', value: 'agotado' },
        { text: 'Bajo stock', value: 'bajo_stock' },
        { text: 'En uso', value: 'en_uso' },
      ],
      onFilter: (value, record) => record.estado === value,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            size="small"
            onClick={() => navigate(`/inventario/${record.id}`)}
          >
            Ver
          </Button>
          <Button 
            type="link" 
            size="small"
            onClick={() => navigate(`/inventario/editar/${record.id}`)}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

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
      estado: null,
      categoria: null,
      ubicacion: null,
    });
    // Limpiar filtros
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>Inventario de Repuestos</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/inventario/nuevo')}
        >
          Nuevo Repuesto
        </Button>
      </div>
      
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Search
                placeholder="Buscar por nombre, descripción o código..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
              />
            </Col>
            
            <Col xs={24} md={16} style={{ textAlign: 'right' }}>
              <Space wrap>
                <Select
                  placeholder="Filtrar por estado"
                  style={{ width: 150 }}
                  allowClear
                  value={filtros.estado}
                  onChange={(value) => handleFilterChange('estado', value)}
                >
                  <Option value="disponible">Disponible</Option>
                  <Option value="agotado">Agotado</Option>
                  <Option value="bajo_stock">Bajo stock</Option>
                  <Option value="en_uso">En uso</Option>
                </Select>
                
                <Select
                  placeholder="Filtrar por categoría"
                  style={{ width: 180 }}
                  allowClear
                  value={filtros.categoria}
                  onChange={(value) => handleFilterChange('categoria', value)}
                >
                  <Option value="Frenos">Frenos</Option>
                  <Option value="Lubricantes">Lubricantes</Option>
                  <Option value="Eléctrico">Eléctrico</Option>
                  <Option value="Motor">Motor</Option>
                  <Option value="Suspensión">Suspensión</Option>
                  <Option value="Transmisión">Transmisión</Option>
                </Select>
                
                <Select
                  placeholder="Filtrar por ubicación"
                  style={{ width: 150 }}
                  allowClear
                  value={filtros.ubicacion}
                  onChange={(value) => handleFilterChange('ubicacion', value)}
                >
                  <Option value="A">Almacén A</Option>
                  <Option value="B">Almacén B</Option>
                  <Option value="C">Almacén C</Option>
                </Select>
                
                <Button 
                  icon={<FilterOutlined />} 
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={dataSource} 
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} repuestos`
          }}
          scroll={{ x: true }}
        />
      </Card>
      
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Text type="secondary">Mostrando {dataSource.length} repuestos en inventario</Text>
      </div>
    </div>
  );
};

export default Inventario;
