import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Descriptions, 
  Typography, 
  Tabs, 
  Tag, 
  Divider, 
  Row, 
  Col, 
  Statistic,
  Badge,
  Timeline,
  Table,
  Space,
  message,
  InputNumber,
  Popconfirm,
  Input
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ShoppingCartOutlined, 
  PlusOutlined, 
  MinusOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  ToolOutlined,
  BarcodeOutlined,
  AlertOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const RepuestoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cantidadAjuste, setCantidadAjuste] = useState(0);
  const [tipoAjuste, setTipoAjuste] = useState('entrada'); // 'entrada' o 'salida'
  const [motivoAjuste, setMotivoAjuste] = useState('');
  
  // Datos de ejemplo (serán reemplazados con datos reales)
  const [repuesto, setRepuesto] = useState(null);
  const [historialMovimientos, setHistorialMovimientos] = useState([]);
  const [vehiculosCompatibles, setVehiculosCompatibles] = useState([]);
  
  useEffect(() => {
    // Simular carga de datos
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simular llamada a la API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos de ejemplo del repuesto
        const repuestoData = {
          id: id,
          codigo: 'REP-001',
          nombre: 'Pastillas de freno delantero',
          descripcion: 'Juego de pastillas de freno delantero para vehículos compactos',
          categoria: 'Frenos',
          subcategoria: 'Pastillas',
          marca: 'Brembo',
          modelo: 'P06047',
          numeroParte: 'BREM-P06047',
          cantidad: 8,
          cantidadMinima: 4,
          cantidadMaxima: 20,
          precioVenta: 1200,
          precioCosto: 800,
          ubicacion: 'A1-23',
          estado: 'disponible',
          fechaRegistro: '2023-05-15',
          ultimaActualizacion: '2023-10-20',
          proveedor: 'Autopartes MX',
          notas: 'Aplicar descuento del 5% en compras mayores a 10 piezas',
          vehiculosCompatibles: [
            { id: 1, marca: 'Toyota', modelo: 'Corolla', anioInicio: 2014, anioFin: 2019 },
            { id: 2, marca: 'Honda', modelo: 'Civic', anioInicio: 2016, anioFin: 2021 },
            { id: 3, marca: 'Nissan', modelo: 'Sentra', anioInicio: 2015, anioFin: 2020 },
          ]
        };
        
        // Historial de movimientos de ejemplo
        const movimientosData = [
          {
            id: 1,
            fecha: '2023-10-20',
            tipo: 'entrada',
            cantidad: 5,
            cantidadAnterior: 3,
            cantidadNueva: 8,
            motivo: 'Compra a proveedor',
            usuario: 'admin',
            referencia: 'OC-2023-001'
          },
          {
            id: 2,
            fecha: '2023-09-15',
            tipo: 'salida',
            cantidad: 2,
            cantidadAnterior: 5,
            cantidadNueva: 3,
            motivo: 'Uso en reparación',
            usuario: 'mecanico1',
            referencia: 'OT-2023-045'
          },
          {
            id: 3,
            fecha: '2023-08-10',
            tipo: 'entrada',
            cantidad: 5,
            cantidadAnterior: 0,
            cantidadNueva: 5,
            motivo: 'Inventario inicial',
            usuario: 'admin',
            referencia: 'INV-2023-001'
          },
        ];
        
        setRepuesto(repuestoData);
        setHistorialMovimientos(movimientosData);
        setVehiculosCompatibles(repuestoData.vehiculosCompatibles);
        
      } catch (error) {
        console.error('Error al cargar los datos del repuesto:', error);
        message.error('No se pudo cargar la información del repuesto');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const getEstadoTag = (estado) => {
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
  };
  
  const columnsMovimientos = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      width: 120,
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      width: 100,
      render: (tipo) => (
        <Tag color={tipo === 'entrada' ? 'green' : 'red'}>
          {tipo === 'entrada' ? 'Entrada' : 'Salida'}
        </Tag>
      ),
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
      width: 100,
      render: (cantidad, record) => (
        <Text strong style={{ color: record.tipo === 'entrada' ? '#52c41a' : '#f5222d' }}>
          {record.tipo === 'entrada' ? '+' : '-'}{cantidad}
        </Text>
      ),
    },
    {
      title: 'Existencia',
      key: 'existencia',
      width: 150,
      render: (_, record) => (
        <Text>
          {record.cantidadAnterior} → {record.cantidadNueva}
        </Text>
      ),
    },
    {
      title: 'Motivo',
      dataIndex: 'motivo',
      key: 'motivo',
    },
    {
      title: 'Referencia',
      dataIndex: 'referencia',
      key: 'referencia',
      width: 120,
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario',
      key: 'usuario',
      width: 120,
    },
  ];
  
  const columnsVehiculos = [
    {
      title: 'Marca',
      dataIndex: 'marca',
      key: 'marca',
    },
    {
      title: 'Modelo',
      dataIndex: 'modelo',
      key: 'modelo',
    },
    {
      title: 'Años',
      key: 'anios',
      render: (_, record) => (
        <Text>
          {record.anioInicio} - {record.anioFin || 'Actual'}
        </Text>
      ),
    },
  ];
  
  const handleAjusteInventario = (tipo) => {
    // Lógica para ajustar el inventario
    console.log(`Ajuste de inventario: ${tipo} ${cantidadAjuste} unidades`);
    message.success(`Se ha registrado la ${tipo} de ${cantidadAjuste} unidades`);
    setCantidadAjuste(1);
    setMotivoAjuste('');
  };
  
  const handleEliminarRepuesto = () => {
    // Lógica para eliminar el repuesto
    console.log('Eliminar repuesto:', id);
    message.success('El repuesto ha sido eliminado correctamente');
    navigate('/inventario');
  };
  
  if (loading || !repuesto) {
    return <div>Cargando información del repuesto...</div>;
  }
  
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16 }}
        >
          Volver al inventario
        </Button>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>
                  {repuesto.nombre}
                </Title>
                <div>
                  {getEstadoTag(repuesto.estado)}
                </div>
              </div>
            }
            extra={
              <Space>
                <Button 
                  type="default" 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/inventario/editar/${id}`)}
                >
                  Editar
                </Button>
                <Popconfirm
                  title="¿Estás seguro de eliminar este repuesto?"
                  description="Esta acción no se puede deshacer"
                  okText="Sí, eliminar"
                  cancelText="Cancelar"
                  onConfirm={handleEliminarRepuesto}
                >
                  <Button 
                    type="default" 
                    danger
                    icon={<DeleteOutlined />}
                  >
                    Eliminar
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="Información General" key="1">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Código">
                    <Text strong>{repuesto.codigo}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Número de parte">
                    <Text copyable>
                      <BarcodeOutlined style={{ marginRight: 8 }} />
                      {repuesto.numeroParte}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Descripción">
                    {repuesto.descripcion}
                  </Descriptions.Item>
                  <Descriptions.Item label="Categoría">
                    <Tag color="blue">{repuesto.categoria}</Tag>
                    {repuesto.subcategoria && (
                      <Tag color="cyan" style={{ marginLeft: 8 }}>{repuesto.subcategoria}</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Marca">
                    {repuesto.marca}
                  </Descriptions.Item>
                  <Descriptions.Item label="Modelo">
                    {repuesto.modelo}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ubicación">
                    <Tag color="geekblue">{repuesto.ubicacion}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Proveedor">
                    {repuesto.proveedor}
                  </Descriptions.Item>
                  <Descriptions.Item label="Notas">
                    {repuesto.notas || 'Ninguna'}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
              
              <TabPane tab="Existencias y Precios" key="2">
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        title="Cantidad en Inventario"
                        value={repuesto.cantidad}
                        suffix={`/ ${repuesto.cantidadMaxima}`}
                        valueStyle={{
                          color: repuesto.cantidad <= repuesto.cantidadMinima ? '#f5222d' : 
                                repuesto.cantidad <= repuesto.cantidadMinima * 1.5 ? '#faad14' : '#52c41a'
                        }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">Mínimo: {repuesto.cantidadMinima}</Text>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        title="Precio de Venta"
                        value={repuesto.precioVenta}
                        prefix="$"
                        precision={2}
                        valueStyle={{ color: '#52c41a' }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">Costo: ${repuesto.precioCosto.toFixed(2)}</Text>
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        title="Valor en Inventario"
                        value={repuesto.cantidad * repuesto.precioCosto}
                        prefix="$"
                        precision={2}
                        valueStyle={{ color: '#1890ff' }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">Ganancia potencial: 
                          ${((repuesto.precioVenta - repuesto.precioCosto) * repuesto.cantidad).toFixed(2)}
                        </Text>
                      </div>
                    </Card>
                  </Col>
                </Row>
                
                <Divider orientation="left">Ajustar Inventario</Divider>
                
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} md={6}>
                    <div style={{ marginBottom: 8 }}>Cantidad:</div>
                    <InputNumber 
                      min={1}
                      max={tipoAjuste === 'salida' ? repuesto.cantidad : 1000}
                      value={cantidadAjuste}
                      onChange={setCantidadAjuste}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <div style={{ marginBottom: 8 }}>Motivo:</div>
                    <Input 
                      placeholder="Ej: Compra a proveedor, Uso en reparación, etc."
                      value={motivoAjuste}
                      onChange={(e) => setMotivoAjuste(e.target.value)}
                    />
                  </Col>
                  <Col xs={24} md={6} style={{ marginTop: 24 }}>
                    <Space>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => handleAjusteInventario('entrada')}
                        disabled={!motivoAjuste}
                      >
                        Entrada
                      </Button>
                      <Button 
                        type="default" 
                        danger
                        icon={<MinusOutlined />}
                        onClick={() => handleAjusteInventario('salida')}
                        disabled={!motivoAjuste || cantidadAjuste > repuesto.cantidad}
                      >
                        Salida
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane tab="Vehículos Compatibles" key="3">
                <Table 
                  columns={columnsVehiculos} 
                  dataSource={vehiculosCompatibles} 
                  rowKey="id"
                  pagination={false}
                  locale={{ emptyText: 'No hay vehículos compatibles registrados' }}
                />
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <HistoryOutlined />
                    Historial de Movimientos
                  </span>
                } 
                key="4"
              >
                <Table 
                  columns={columnsMovimientos} 
                  dataSource={historialMovimientos} 
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: true }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </div>
        
        <div style={{ width: '300px' }}>
          <Card 
            title="Resumen" 
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f0f2f5' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ 
                width: '100%', 
                height: '200px', 
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                borderRadius: '8px',
                border: '1px dashed #d9d9d9'
              }}>
                <Text type="secondary">Imagen del repuesto</Text>
              </div>
              
              <Title level={4} style={{ margin: '8px 0' }}>{repuesto.nombre}</Title>
              <Text type="secondary">Código: {repuesto.codigo}</Text>
              
              <div style={{ margin: '16px 0' }}>
                <Text strong style={{ fontSize: '24px', color: '#1890ff' }}>
                  ${repuesto.precioVenta.toFixed(2)}
                </Text>
                <div>
                  <Text type="secondary" delete>
                    ${(repuesto.precioVenta * 1.2).toFixed(2)}
                  </Text>
                  <Text type="success" style={{ marginLeft: 8 }}>
                    20% OFF
                  </Text>
                </div>
              </div>
              
              <div style={{ margin: '16px 0', textAlign: 'left' }}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Disponibilidad: </Text>
                  {repuesto.cantidad > 0 ? (
                    <Text style={{ color: '#52c41a' }}>En stock ({repuesto.cantidad} unidades)</Text>
                  ) : (
                    <Text type="danger">Agotado</Text>
                  )}
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Ubicación: </Text>
                  <Tag color="blue">{repuesto.ubicacion}</Tag>
                </div>
                
                <div>
                  <Text strong>Estado: </Text>
                  {getEstadoTag(repuesto.estado)}
                </div>
              </div>
              
              <div style={{ margin: '24px 0' }}>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ShoppingCartOutlined />}
                  block
                  disabled={repuesto.cantidad <= 0}
                >
                  {repuesto.cantidad > 0 ? 'Agregar a Venta' : 'Sin existencias'}
                </Button>
                
                {repuesto.cantidad <= repuesto.cantidadMinima && (
                  <div style={{ marginTop: 16, color: '#faad14' }}>
                    <AlertOutlined />
                    <Text style={{ marginLeft: 8 }}>
                      El inventario está por debajo del mínimo ({repuesto.cantidadMinima} unidades)
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          <Card 
            title="Acciones Rápidas"
            headStyle={{ backgroundColor: '#f0f2f5' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block icon={<PlusOutlined />}>
                Nueva Compra
              </Button>
              <Button block icon={<ToolOutlined />}>
                Usar en Reparación
              </Button>
              <Button block icon={<EditOutlined />}>
                Actualizar Precios
              </Button>
              <Button block danger icon={<DeleteOutlined />}>
                Dar de Baja
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RepuestoDetalle;
