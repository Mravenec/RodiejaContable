import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Typography, Tabs, Image, Tag, Divider } from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DollarOutlined, 
  ToolOutlined, 
  FileTextOutlined,
  CarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const VehiculoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Datos de ejemplo (serán reemplazados con datos reales)
  const vehiculo = {
    id: id,
    marca: 'Toyota',
    modelo: 'Corolla',
    generacion: 'Generación 12 (2020-2023)',
    anio: 2021,
    precio: 450000,
    costo: 380000,
    estado: 'disponible',
    descripcion: 'Vehículo en excelentes condiciones, único dueño, sin choques.',
    caracteristicas: [
      'Transmisión automática',
      'Aire acondicionado',
      'Vidrios eléctricos',
      'Espejos eléctricos',
      'Bluetooth',
      'Cámara de reversa',
      'Sensores de estacionamiento'
    ],
    fechaIngreso: '2023-01-15',
    kilometraje: 25000,
    color: 'Blanco',
    placa: 'ABC-1234',
    vin: 'JT2BG22K6W0149609'
  };
  
  const getEstadoTag = (estado) => {
    const estados = {
      disponible: { color: 'success', text: 'Disponible' },
      vendido: { color: 'error', text: 'Vendido' },
      en_reparacion: { color: 'processing', text: 'En reparación' },
      reservado: { color: 'warning', text: 'Reservado' }
    };
    
    const estadoInfo = estados[estado] || { color: 'default', text: 'Desconocido' };
    return <Tag color={estadoInfo.color}>{estadoInfo.text}</Tag>;
  };

  return (
    <div>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Volver
      </Button>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <Title level={3} style={{ margin: 0 }}>
                {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
              </Title>
              <div>
                {getEstadoTag(vehiculo.estado)}
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <Image
                width="100%"
                height={200}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
                src="https://via.placeholder.com/800x400?text=Imagen+del+vehículo"
                alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                fallback="https://via.placeholder.com/800x400?text=Imagen+no+disponible"
              />
            </div>
            
            <Tabs defaultActiveKey="1">
              <TabPane tab="Detalles" key="1">
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Marca">{vehiculo.marca}</Descriptions.Item>
                  <Descriptions.Item label="Modelo">{vehiculo.modelo}</Descriptions.Item>
                  <Descriptions.Item label="Generación">{vehiculo.generacion}</Descriptions.Item>
                  <Descriptions.Item label="Año">{vehiculo.anio}</Descriptions.Item>
                  <Descriptions.Item label="Precio de venta">
                    <Text strong>${vehiculo.precio.toLocaleString()}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Costo">
                    <Text>${vehiculo.costo.toLocaleString()}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Kilometraje">{vehiculo.kilometraje.toLocaleString()} km</Descriptions.Item>
                  <Descriptions.Item label="Color">{vehiculo.color}</Descriptions.Item>
                  <Descriptions.Item label="Placas">{vehiculo.placa}</Descriptions.Item>
                  <Descriptions.Item label="Número de serie (VIN)">
                    <Text code>{vehiculo.vin}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Fecha de ingreso">{vehiculo.fechaIngreso}</Descriptions.Item>
                </Descriptions>
              </TabPane>
              
              <TabPane tab="Descripción" key="2">
                <Card>
                  <Text>{vehiculo.descripcion}</Text>
                  
                  <Divider orientation="left">Características</Divider>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {vehiculo.caracteristicas.map((caracteristica, index) => (
                      <Tag key={index} icon={<CarOutlined />} color="blue">
                        {caracteristica}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </TabPane>
              
              <TabPane tab="Historial" key="3">
                <Card>
                  <Text>Aquí irá el historial de movimientos y mantenimientos del vehículo.</Text>
                </Card>
              </TabPane>
            </Tabs>
            
            <div style={{ marginTop: '24px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button 
                type="primary" 
                icon={<DollarOutlined />} 
                onClick={() => navigate(`/ventas/nueva?vehiculoId=${vehiculo.id}`)}
              >
                Vender
              </Button>
              <Button 
                type="default" 
                icon={<ToolOutlined />}
                onClick={() => navigate(`/servicios/nuevo?vehiculoId=${vehiculo.id}`)}
              >
                Agregar Servicio
              </Button>
              <Button 
                type="default" 
                icon={<FileTextOutlined />}
              >
                Ver Documentos
              </Button>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => navigate(`/vehiculos/editar/${vehiculo.id}`)}
              >
                Editar
              </Button>
            </div>
          </Card>
        </div>
        
        <div style={{ width: '300px' }}>
          <Card title="Información Financiera" style={{ marginBottom: '16px' }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Inversión Total">
                <Text strong>${vehiculo.costo.toLocaleString()}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Precio de Venta">
                <Text strong>${vehiculo.precio.toLocaleString()}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ganancia Esperada">
                <Text strong type="success">
                  ${(vehiculo.precio - vehiculo.costo).toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="ROI">
                <Text strong type="success">
                  {((vehiculo.precio - vehiculo.costo) / vehiculo.costo * 100).toFixed(2)}%
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
          
          <Card title="Acciones Rápidas">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button block>Generar Cotización</Button>
              <Button block type="dashed">Agregar a Favoritos</Button>
              <Button block danger>Dar de Baja</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VehiculoDetalle;
