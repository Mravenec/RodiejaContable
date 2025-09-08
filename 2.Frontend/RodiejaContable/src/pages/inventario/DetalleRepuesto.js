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
  Image,
  message,
  Space
} from 'antd';
import { 
  ArrowLeftOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import InventarioService from '../../api/inventario';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DetalleRepuesto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [repuesto, setRepuesto] = useState(null);

  useEffect(() => {
    const fetchRepuesto = async () => {
      try {
        setLoading(true);
        const data = await InventarioService.getRepuestoPorId(id);
        setRepuesto(data);
      } catch (error) {
        console.error('Error al cargar el repuesto:', error);
        message.error('Error al cargar los datos del repuesto');
      } finally {
        setLoading(false);
      }
    };

    fetchRepuesto();
  }, [id]);

  const getEstadoTag = (estado) => {
    const estados = {
      'STOCK': { color: 'blue', icon: <CheckCircleOutlined />, text: 'En Stock' },
      'VENDIDO': { color: 'red', icon: <CloseCircleOutlined />, text: 'Vendido' },
      'AGOTADO': { color: 'orange', text: 'Agotado' },
      'DISPONIBLE': { color: 'green', icon: <CheckCircleOutlined />, text: 'Disponible' },
      'DESARMADO': { color: 'purple', text: 'Desarmado' },
      'REPARACION': { color: 'gold', icon: <SyncOutlined spin />, text: 'En Reparación' }
    };

    const estadoInfo = estados[estado] || { color: 'default', text: estado };
    return (
      <Tag color={estadoInfo.color} icon={estadoInfo.icon}>
        {estadoInfo.text}
      </Tag>
    );
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!repuesto) {
    return <div>No se encontró el repuesto</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Button 
          type="text"
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ marginRight: 16 }}
        >
          Volver
        </Button>
        <Title level={2} style={{ margin: 0 }}>Detalle del Repuesto</Title>
      </div>
      
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Información General" key="1">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Image
                    width={200}
                    src={repuesto.imagenUrl}
                    alt={repuesto.descripcion}
                    fallback="https://via.placeholder.com/200?text=Sin+imagen"
                    style={{ 
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 8,
                      border: '1px solid #f0f0f0'
                    }}
                  />
                </div>
                <Card>
                  <Statistic 
                    title="Precio de Venta" 
                    value={repuesto.precioVentaFormatted || '₡0'}
                    valueStyle={{ color: '#3f8600', fontSize: '1.5rem' }}
                  />
                  <Divider style={{ margin: '16px 0' }} />
                  <Statistic 
                    title="Stock Disponible" 
                    value={repuesto.cantidad} 
                    suffix="unidades"
                    valueStyle={{ color: repuesto.cantidad > 0 ? '#3f8600' : '#cf1322' }}
                  />
                  <Divider style={{ margin: '16px 0' }} />
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Estado:</Text>
                    {getEstadoTag(repuesto.estado)}
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={16}>
                <Descriptions 
                  bordered 
                  column={1}
                  size="middle"
                  labelStyle={{ fontWeight: 'bold', width: '200px' }}
                >
                  <Descriptions.Item label="Código">{repuesto.codigo}</Descriptions.Item>
                  <Descriptions.Item label="Descripción">{repuesto.descripcion}</Descriptions.Item>
                  <Descriptions.Item label="Ubicación">
                    {repuesto.ubicacion || 'No especificada'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Precio de Costo">
                    {repuesto.precioCostoFormatted || '₡0'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Precio de Mayoreo">
                    {repuesto.precioMayoreoFormatted || 'No definido'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Condición">
                    <Tag color={repuesto.condicion === 'NUEVO' ? 'green' : 'orange'}>
                      {repuesto.condicion || 'No especificada'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Código de Ubicación">
                    {repuesto.codigoUbicacion || 'No especificado'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Última Actualización">
                    {new Date(repuesto.fechaActualizacion).toLocaleString()}
                  </Descriptions.Item>
                </Descriptions>

                <Divider>Ubicación Física</Divider>
                <Row gutter={[16, 16]}>
                  {['bodega', 'zona', 'pared', 'malla', 'estante', 'nivel', 'piso'].map((item) => (
                    repuesto[item] && (
                      <Col key={item} xs={12} sm={8} md={6}>
                        <Card size="small" title={item.charAt(0).toUpperCase() + item.slice(1)}>
                          {repuesto[item]}
                        </Card>
                      </Col>
                    )
                  ))}
                </Row>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="Historial" key="2">
            <Card>
              <p>Historial de movimientos del repuesto</p>
              {/* Aquí puedes agregar el historial de movimientos cuando lo implementes */}
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default DetalleRepuesto;
