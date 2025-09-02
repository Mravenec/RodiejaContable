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

  Row,
  Col,
  Drawer,
  Grid,
  Dropdown,
  Menu
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  FilterOutlined,

  ToolOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;

const Inventario = () => {
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);
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
      responsive: ['md'],
      ellipsis: true,
      render: (text) => <Text strong style={{ whiteSpace: 'nowrap' }}>{text}</Text>,
    },
    {
      title: 'Producto',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 250,
      render: (text, record) => (
        <div style={{ minWidth: '200px' }}>
          <div style={{ 
            fontWeight: 500, 
            whiteSpace: 'normal',
            wordBreak: 'break-word'
          }}>
            {text}
          </div>
          <Text 
            type="secondary" 
            style={{ 
              fontSize: '12px', 
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'break-word'
            }}
          >
            {record.descripcion}
          </Text>
          {!screens.md && (
            <Space size="small" style={{ marginTop: 4, flexWrap: 'wrap', rowGap: '4px' }}>
              <Tag 
                color={record.estado === 'disponible' ? 'success' : record.estado === 'bajo_stock' ? 'warning' : 'error'}
                style={{ margin: 0 }}
              >
                {record.estado === 'disponible' ? 'Disponible' : record.estado === 'bajo_stock' ? 'Bajo stock' : 'Agotado'}
              </Tag>
              <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>ID: {record.id}</Text>
            </Space>
          )}
        </div>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
      width: 140,
      responsive: ['md'],
      ellipsis: true,
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
      responsive: ['sm'],
      align: 'center',
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
      responsive: ['md'],
      align: 'center',
      render: (text) => <Tag color="blue" style={{ margin: 0 }}>{text}</Tag>,
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      width: 120,
      responsive: ['sm'],
      align: 'right',
      render: (text) => formatCurrency(text),
      sorter: (a, b) => a.precio - b.precio,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 120,
      responsive: ['md'],
      align: 'center',
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
      width: 100,
      fixed: screens.md ? false : 'right',
      align: 'center',
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item 
              key="view" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/inventario/${record.id}`)}
            >
              Ver detalles
            </Menu.Item>
            <Menu.Item 
              key="edit" 
              icon={<EditOutlined />}
              onClick={() => navigate(`/inventario/editar/${record.id}`)}
            >
              Editar
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item 
              key="delete" 
              icon={<DeleteOutlined />}
              danger
              onClick={() => console.log('Eliminar', record.id)}
            >
              Eliminar
            </Menu.Item>
          </Menu>
        );
        
        return screens.md ? (
          <Space size="middle">
            <Button 
              type="link" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/inventario/${record.id}`)}
            />
            <Button 
              type="link" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/inventario/editar/${record.id}`)}
            />
          </Space>
        ) : (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
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
    <div className="inventario-container" style={{ padding: screens.xs ? '8px' : '16px' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: screens.xs ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: screens.xs ? 'stretch' : 'center', 
        marginBottom: 16,
        gap: screens.xs ? '12px' : '16px'
      }}>
        <Title level={3} style={{ marginBottom: screens.xs ? 0 : undefined }}>Inventario de Repuestos</Title>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!screens.md && (
            <Button 
              icon={<FilterOutlined />}
              onClick={() => setFilterVisible(true)}
            >
              Filtros
            </Button>
          )}
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/inventario/nuevo')}
            block={screens.xs}
          >
            {screens.xs ? 'Nuevo' : 'Nuevo Repuesto'}
          </Button>
        </div>
      </div>
      
      <Card 
        bodyStyle={{
          padding: screens.xs ? '12px' : '24px',
          overflowX: 'auto'
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Search
                placeholder="Buscar repuestos..."
                allowClear
                enterButton={<SearchOutlined />}
                size={screens.xs ? 'middle' : 'large'}
                onSearch={handleSearch}
              />
            </Col>
            
            {screens.md && (
              <Col xs={24} md={16} style={{ textAlign: 'right' }}>
                <Space wrap>
                  <Select
                    placeholder="Estado"
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
                    placeholder="Categoría"
                    style={{ width: 160 }}
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
                    placeholder="Ubicación"
                    style={{ width: 140 }}
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
                    Limpiar
                  </Button>
                </Space>
              </Col>
            )}
          </Row>
        </div>
        
        <div style={{ minWidth: '100%', display: 'inline-block' }}>
        <Table 
          columns={columns} 
          dataSource={dataSource} 
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} repuestos`,
            size: screens.xs ? 'small' : 'default',
            showLessItems: screens.xs,
            simple: screens.xs,
            position: ['bottomCenter']
          }}
          scroll={{ x: 'max-content' }}
          size={screens.xs ? 'small' : 'middle'}
          className="inventory-table"
          style={{
            minWidth: '100%',
            tableLayout: 'fixed'
          }}
        />
      </div>
      </Card>
      
      <div style={{ marginTop: 16, textAlign: screens.xs ? 'center' : 'right' }}>
        <Text type="secondary">Mostrando {dataSource.length} repuestos en inventario</Text>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Filtros"
        placement="right"
        onClose={() => setFilterVisible(false)}
        visible={filterVisible}
        width={300}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Estado</Text>
            <Select
              placeholder="Seleccionar estado"
              style={{ width: '100%' }}
              allowClear
              value={filtros.estado}
              onChange={(value) => handleFilterChange('estado', value)}
            >
              <Option value="disponible">Disponible</Option>
              <Option value="agotado">Agotado</Option>
              <Option value="bajo_stock">Bajo stock</Option>
              <Option value="en_uso">En uso</Option>
            </Select>
          </div>
          
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Categoría</Text>
            <Select
              placeholder="Seleccionar categoría"
              style={{ width: '100%' }}
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
          </div>
          
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Ubicación</Text>
            <Select
              placeholder="Seleccionar ubicación"
              style={{ width: '100%' }}
              allowClear
              value={filtros.ubicacion}
              onChange={(value) => handleFilterChange('ubicacion', value)}
            >
              <Option value="A">Almacén A</Option>
              <Option value="B">Almacén B</Option>
              <Option value="C">Almacén C</Option>
            </Select>
          </div>
          
          <Button 
            type="primary" 
            block
            onClick={() => setFilterVisible(false)}
            style={{ marginTop: 16 }}
          >
            Aplicar Filtros
          </Button>
          
          <Button 
            block
            onClick={() => {
              clearFilters();
              setFilterVisible(false);
            }}
          >
            Limpiar Filtros
          </Button>
        </Space>
      </Drawer>
      
      <style jsx global>{
        `
        .inventory-table {
          width: 100% !important;
        }
        
        .inventory-table .ant-table {
          font-size: ${screens.xs ? '13px' : '14px'};
        }
        
        .inventory-table .ant-table-thead > tr > th,
        .inventory-table .ant-table-tbody > tr > td {
          padding: ${screens.xs ? '8px' : '12px 16px'} !important;
          word-break: break-word;
        }
        
        .inventory-table .ant-table-thead > tr > th {
          white-space: nowrap;
          background: #fafafa;
          font-weight: 600;
        }
        
        .inventory-table .ant-table-tbody > tr > td {
          vertical-align: top;
        }
        
        .inventory-table .ant-table-pagination {
          margin: 16px 8px !important;
        }
        
        /* Ensure text is readable in status tags */
        .inventory-table .ant-tag {
          margin: 2px 0;
          white-space: nowrap;
        }
        
        /* Make sure action buttons are properly spaced */
        .inventory-table .ant-space {
          gap: ${screens.xs ? '4px' : '8px'} !important;
        }
        
        /* Improve mobile view */
        @media (max-width: 768px) {
          .inventory-table .ant-table-thead > tr > th,
          .inventory-table .ant-table-tbody > tr > td {
            padding: 8px !important;
            font-size: 13px;
          }
          
          .inventory-table .ant-table-thead > tr > th {
            white-space: nowrap;
            font-size: 12px;
          }
          
          .inventory-table .ant-table-tbody > tr > td {
            font-size: 13px;
          }
          
          .inventory-table .ant-btn {
            min-width: 24px;
            padding: 0 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default Inventario;
