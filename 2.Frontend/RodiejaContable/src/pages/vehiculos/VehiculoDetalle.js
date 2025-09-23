import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Typography, Tabs, Image, Tag, Divider, Spin, message } from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DollarOutlined, 
  ToolOutlined, 
  FileTextOutlined,
  CarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import vehiculoService from '../../api/vehiculos';
import finanzaService from '../../api/finanzas';
import { formatCurrency } from '../../utils/formatters';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const VehiculoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [vehiculo, setVehiculo] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [loadingTransacciones, setLoadingTransacciones] = useState(false);

  // Load vehicle data
  const loadVehicleData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      // Get vehicle by ID from the flat list
      const vehiculosResponse = await vehiculoService.getVehiculos();
      const vehiculoEncontrado = vehiculosResponse.find(v => v.id === parseInt(id));
      
      if (!vehiculoEncontrado) {
        throw new Error('Vehículo no encontrado');
      }

      console.log('Vehículo encontrado:', vehiculoEncontrado);
      setVehiculo(vehiculoEncontrado);

    } catch (error) {
      console.error('Error loading vehicle:', error);
      setIsError(true);
      message.error(`Error al cargar el vehículo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load transactions for the vehicle
  const loadTransactions = async (vehiculoId) => {
    try {
      setLoadingTransacciones(true);
      const transaccionesData = await finanzaService.getTransaccionesPorVehiculo(vehiculoId);
      console.log('Transacciones cargadas:', transaccionesData);
      setTransacciones(Array.isArray(transaccionesData) ? transaccionesData : []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransacciones([]);
      message.warning('No se pudieron cargar las transacciones del vehículo');
    } finally {
      setLoadingTransacciones(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (id) {
      loadVehicleData();
    }
  }, [id]);

  // Load transactions when vehicle is loaded
  useEffect(() => {
    if (vehiculo?.id) {
      loadTransactions(vehiculo.id);
    }
  }, [vehiculo?.id]);

  const refetch = () => {
    loadVehicleData();
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !vehiculo) {
    return (
      <div style={{ padding: '24px' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/vehiculos')}
        >
          Volver a la lista
        </Button>
        <Card style={{ marginTop: '16px' }}>
          <Title level={4}>No se pudo cargar la información del vehículo</Title>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={() => refetch()}
            style={{ marginTop: '16px' }}
          >
            Reintentar
          </Button>
        </Card>
      </div>
    );
  }
  
  const getEstadoTag = (estado) => {
    const estados = {
      DISPONIBLE: { color: 'success', text: 'Disponible' },
      VENDIDO: { color: 'error', text: 'Vendido' },
      DESARMADO: { color: 'warning', text: 'Desarmado' },
      REPARACION: { color: 'processing', text: 'En Reparación' },
      EN_REPARACION: { color: 'processing', text: 'En reparación' },
      RESERVADO: { color: 'warning', text: 'Reservado' }
    };
    
    const estadoInfo = estados[estado] || { color: 'default', text: 'Desconocido' };
    return <Tag color={estadoInfo.color}>{estadoInfo.text}</Tag>;
  };

  // Format dates safely
  const formatDate = (dateValue) => {
    if (!dateValue) return 'No especificada';
    
    try {
      // Handle array format [year, month, day] from API
      if (Array.isArray(dateValue)) {
        const [year, month, day] = dateValue;
        return new Date(year, month - 1, day).toLocaleDateString();
      }
      
      // Handle string/Date format
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  // Get vehicle brand and model from generation info
  const getMarcaModelo = () => {
    if (vehiculo.generacion?.modelo?.marca?.nombre && vehiculo.generacion?.modelo?.nombre) {
      return {
        marca: vehiculo.generacion.modelo.marca.nombre,
        modelo: vehiculo.generacion.modelo.nombre
      };
    }
    return { marca: 'Marca no disponible', modelo: 'Modelo no disponible' };
  };

  const { marca, modelo } = getMarcaModelo();

  return (
    <div style={{ padding: '24px' }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/vehiculos')}
        style={{ marginBottom: '16px' }}
      >
        Volver a la lista
      </Button>

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ flex: '0 0 300px', marginRight: '24px', marginBottom: '16px' }}>
              <Image
                src={vehiculo.imagenUrl || 'https://via.placeholder.com/300x200?text=Sin+imagen'}
                alt={`${marca} ${modelo}`}
                style={{ width: '100%', borderRadius: '8px' }}
                fallback="https://via.placeholder.com/300x200?text=Imagen+no+disponible"
              />
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ marginBottom: '16px' }}>
                  <Title level={2} style={{ marginBottom: '8px' }}>
                    {marca} {modelo} {vehiculo.anio || 'Sin año'}
                  </Title>
                  {getEstadoTag(vehiculo.estado)}
                  <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                    {vehiculo.generacion?.nombre || 'Generación no especificada'}
                  </Text>
                  <Text style={{ display: 'block', marginTop: '8px' }}>
                    <strong>Código:</strong> {vehiculo.codigoVehiculo || 'Sin código'}
                  </Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Title level={3} style={{ color: '#1890ff', marginBottom: '4px' }}>
                    {formatCurrency(vehiculo.precioVenta || vehiculo.precioCompra || 0)}
                  </Title>
                  <Text type="secondary">
                    Inversión: {formatCurrency(vehiculo.inversionTotal || 0)}
                  </Text>
                  {vehiculo.fechaVenta && (
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary">
                        Vendido el: {formatDate(vehiculo.fechaVenta)}
                      </Text>
                    </div>
                  )}
                  <div style={{ marginTop: '16px' }}>
                    <Button 
                      type="primary" 
                      icon={<EditOutlined />} 
                      style={{ marginRight: '8px', marginBottom: '8px' }}
                      onClick={() => navigate(`/vehiculos/editar/${id}`)}
                    >
                      Editar
                    </Button>
                    {vehiculo.estado !== 'VENDIDO' && (
                      <Button 
                        type="primary" 
                        icon={<DollarOutlined />}
                        onClick={() => navigate(`/finanzas/venta-vehiculo/${id}`)}
                      >
                        Registrar Venta
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultActiveKey="1" style={{ marginTop: '16px', width: '100%' }}>
            <TabPane tab={
              <span><FileTextOutlined /> Información General</span>
            } key="1">
              <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="Año">{vehiculo.anio || 'No especificado'}</Descriptions.Item>
                <Descriptions.Item label="Código">{vehiculo.codigoVehiculo || 'Sin código'}</Descriptions.Item>
                <Descriptions.Item label="Fecha de Ingreso">
                  {formatDate(vehiculo.fechaIngreso)}
                </Descriptions.Item>
                <Descriptions.Item label="Estado">
                  {getEstadoTag(vehiculo.estado)}
                </Descriptions.Item>
                <Descriptions.Item label="Precio de Compra">
                  {formatCurrency(vehiculo.precioCompra || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Costo de Grúa">
                  {formatCurrency(vehiculo.costoGrua || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Comisiones">
                  {formatCurrency(vehiculo.comisiones || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Inversión Total">
                  <strong>{formatCurrency(vehiculo.inversionTotal || 0)}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Costo Recuperado">
                  {formatCurrency(vehiculo.costoRecuperado || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Costo Pendiente">
                  <strong style={{
                    color: (vehiculo.costoPendiente || 0) <= 0 ? '#52c41a' : '#f5222d'
                  }}>
                    {formatCurrency(vehiculo.costoPendiente || 0)}
                  </strong>
                </Descriptions.Item>
                {vehiculo.precioVenta && (
                  <Descriptions.Item label="Precio de Venta">
                    <strong style={{ color: '#52c41a' }}>
                      {formatCurrency(vehiculo.precioVenta)}
                    </strong>
                  </Descriptions.Item>
                )}
                {vehiculo.fechaVenta && (
                  <Descriptions.Item label="Fecha de Venta">
                    {formatDate(vehiculo.fechaVenta)}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Notas" span={2}>
                  {vehiculo.notas || 'Sin notas adicionales.'}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            
            <TabPane tab={
              <span><ToolOutlined /> Repuestos</span>
            } key="2">
              <div style={{ marginTop: '16px' }}>
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <ToolOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
                  <p>Los repuestos se gestionan desde el módulo de Inventario.</p>
                  <Button 
                    type="primary" 
                    style={{ marginTop: '16px' }}
                    onClick={() => navigate(`/inventario/nuevo?vehiculoId=${vehiculo.id}`)}
                  >
                    Agregar Repuesto
                  </Button>
                </div>
              </div>
            </TabPane>
            
            <TabPane tab={
              <span><DollarOutlined /> Transacciones</span>
            } key="3">
              <div style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Historial de transacciones del vehículo</Text>
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => navigate(`/finanzas/transaccion/nueva?vehiculoId=${vehiculo.id}`)}
                  >
                    Nueva Transacción
                  </Button>
                </div>
                
                {loadingTransacciones ? (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <Spin />
                  </div>
                ) : transacciones && transacciones.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="ant-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Fecha</th>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Tipo</th>
                          <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>Monto</th>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Descripción</th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transacciones.map((transaccion) => {
                          const esIngreso = transaccion.tipo_transaccion?.categoria === 'INGRESO' || 
                                           transaccion.categoria === 'INGRESO' ||
                                           transaccion.monto > 0;
                          
                          return (
                            <tr key={transaccion.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                              <td style={{ padding: '8px' }}>{formatDate(transaccion.fecha)}</td>
                              <td style={{ padding: '8px' }}>
                                <Tag color={esIngreso ? 'green' : 'red'}>
                                  {transaccion.tipo_transaccion?.nombre || transaccion.tipo || 'Transacción'}
                                </Tag>
                              </td>
                              <td style={{ 
                                padding: '8px', 
                                textAlign: 'right',
                                color: esIngreso ? '#52c41a' : '#f5222d'
                              }}>
                                {esIngreso ? '+' : '-'}{formatCurrency(Math.abs(transaccion.monto || 0))}
                              </td>
                              <td style={{ padding: '8px' }}>{transaccion.descripcion || 'Sin descripción'}</td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                <Button 
                                  type="link" 
                                  size="small"
                                  onClick={() => navigate(`/finanzas/${transaccion.id}`)}
                                >
                                  Ver
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <DollarOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
                    <p>No hay transacciones registradas para este vehículo.</p>
                    <Button 
                      type="primary" 
                      style={{ marginTop: '16px' }}
                      onClick={() => navigate(`/finanzas/transaccion/nueva?vehiculoId=${vehiculo.id}`)}
                    >
                      Agregar Transacción
                    </Button>
                  </div>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default VehiculoDetalle;