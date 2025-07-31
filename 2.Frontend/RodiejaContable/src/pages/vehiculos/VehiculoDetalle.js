import React from 'react';
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
import { useVehiculo } from '../../hooks/useVehiculos';
import { formatCurrency } from '../../utils/formatters';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const VehiculoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch vehicle data
  const { data: vehiculo, isLoading, isError, refetch } = useVehiculo(id);

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
                alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                style={{ width: '100%', borderRadius: '8px' }}
                fallback="https://via.placeholder.com/300x200?text=Imagen+no+disponible"
              />
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ marginBottom: '16px' }}>
                  <Title level={2} style={{ marginBottom: '8px' }}>
                    {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
                  </Title>
                  <Tag color={getEstadoTag(vehiculo.estado).color} style={{ fontSize: '14px', padding: '4px 8px' }}>
                    {getEstadoTag(vehiculo.estado).text}
                  </Tag>
                  <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                    {vehiculo.generacion}
                  </Text>
                  <Text style={{ display: 'block', marginTop: '8px' }}>
                    <strong>Código:</strong> {vehiculo.codigo_vehiculo}
                  </Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Title level={3} style={{ color: '#1890ff', marginBottom: '4px' }}>
                    {formatCurrency(vehiculo.precio_venta || vehiculo.precio_compra)}
                  </Title>
                  <Text type="secondary">
                    Inversión: {formatCurrency(vehiculo.inversion_total)}
                  </Text>
                  {vehiculo.fecha_venta && (
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary">
                        Vendido el: {new Date(vehiculo.fecha_venta).toLocaleDateString()}
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
                <Descriptions.Item label="Año">{vehiculo.anio}</Descriptions.Item>
                <Descriptions.Item label="Código">{vehiculo.codigo_vehiculo}</Descriptions.Item>
                <Descriptions.Item label="Fecha de Ingreso">
                  {new Date(vehiculo.fecha_ingreso).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Estado">
                  <Tag color={getEstadoTag(vehiculo.estado).color}>
                    {getEstadoTag(vehiculo.estado).text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Precio de Compra">
                  {formatCurrency(vehiculo.precio_compra)}
                </Descriptions.Item>
                <Descriptions.Item label="Costo de Grúa">
                  {formatCurrency(vehiculo.costo_grua || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Comisiones">
                  {formatCurrency(vehiculo.comisiones || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Inversión Total">
                  <strong>{formatCurrency(vehiculo.inversion_total)}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Ingresos Totales">
                  {formatCurrency(vehiculo.total_ingresos_vehiculo || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Egresos Totales">
                  {formatCurrency(vehiculo.total_egresos_vehiculo || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Balance Neto" span={2}>
                  <strong style={{
                    color: (vehiculo.balance_neto_vehiculo || 0) >= 0 ? '#52c41a' : '#f5222d'
                  }}>
                    {formatCurrency(vehiculo.balance_neto_vehiculo || 0)}
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item label="Notas" span={2}>
                  {vehiculo.notas || 'Sin notas adicionales.'}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            
            <TabPane tab={
              <span><ToolOutlined /> Repuestos</span>
            } key="2">
              <div style={{ marginTop: '16px' }}>
                {vehiculo.repuestos && vehiculo.repuestos.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="ant-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Código</th>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Descripción</th>
                          <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>Precio Venta</th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehiculo.repuestos.map((repuesto) => (
                          <tr key={repuesto.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '8px' }}>
                              <a onClick={() => navigate(`/inventario/${repuesto.id}`)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                                {repuesto.codigo_repuesto}
                              </a>
                            </td>
                            <td style={{ padding: '8px' }}>{repuesto.descripcion || 'Sin descripción'}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>{formatCurrency(repuesto.precio_venta)}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              <Tag color={repuesto.estado === 'STOCK' ? 'success' : 'default'}>
                                {repuesto.estado === 'STOCK' ? 'Disponible' : 'Vendido'}
                              </Tag>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <ToolOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
                    <p>No hay repuestos registrados para este vehículo.</p>
                    <Button 
                      type="primary" 
                      style={{ marginTop: '16px' }}
                      onClick={() => navigate(`/inventario/nuevo?vehiculoId=${vehiculo.id}`)}
                    >
                      Agregar Repuesto
                    </Button>
                  </div>
                )}
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
                
                {vehiculo.transacciones && vehiculo.transacciones.length > 0 ? (
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
                        {vehiculo.transacciones.map((transaccion) => (
                          <tr key={transaccion.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '8px' }}>{new Date(transaccion.fecha).toLocaleDateString()}</td>
                            <td style={{ padding: '8px' }}>
                              <Tag color={transaccion.categoria === 'INGRESO' ? 'green' : 'red'}>
                                {transaccion.tipo_transaccion}
                              </Tag>
                            </td>
                            <td style={{ 
                              padding: '8px', 
                              textAlign: 'right',
                              color: transaccion.categoria === 'INGRESO' ? '#52c41a' : '#f5222d'
                            }}>
                              {transaccion.categoria === 'INGRESO' ? '+' : '-'}{formatCurrency(transaccion.monto)}
                            </td>
                            <td style={{ padding: '8px' }}>{transaccion.descripcion || 'Sin descripción'}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              <Button 
                                type="link" 
                                size="small"
                                onClick={() => navigate(`/finanzas/transacciones/${transaccion.id}`)}
                              >
                                Ver
                              </Button>
                            </td>
                          </tr>
                        ))}
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
