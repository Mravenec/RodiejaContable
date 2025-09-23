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

// Servicio para repuestos
const repuestosService = {
  async getRepuestosPorVehiculo(vehiculoId) {
    try {
      const response = await fetch(`http://localhost:8080/api/inventario-repuestos`);
      const allRepuestos = await response.json();
      return allRepuestos.filter(repuesto => repuesto.vehiculoOrigenId === parseInt(vehiculoId));
    } catch (error) {
      console.error('Error fetching repuestos:', error);
      return [];
    }
  }
};

// Servicio para transacciones
const transaccionesService = {
  async getTransaccionesPorVehiculo(vehiculoId) {
    try {
      console.log('Fetching transactions for vehicle ID:', vehiculoId);
      
      let transaccionesResponse, tiposResponse, allTransacciones, tiposTransaccion;
      
      try {
        [transaccionesResponse, tiposResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/transacciones-financieras`),
          fetch(`http://localhost:8080/api/tipos-transacciones`)
        ]);
        
        if (!transaccionesResponse.ok) {
          throw new Error(`HTTP error! status: ${transaccionesResponse.status}`);
        }
        if (!tiposResponse.ok) {
          throw new Error(`HTTP error! status: ${tiposResponse.status}`);
        }
        
        allTransacciones = await transaccionesResponse.json();
        tiposTransaccion = await tiposResponse.json();
        
        console.log('All transactions from API:', allTransacciones);
        console.log('Transaction types from API:', tiposTransaccion);
        
        if (!Array.isArray(allTransacciones)) {
          console.error('Unexpected transactions format:', allTransacciones);
          allTransacciones = [];
        }
        
        if (!Array.isArray(tiposTransaccion)) {
          console.error('Unexpected transaction types format:', tiposTransaccion);
          tiposTransaccion = [];
        }
      } catch (fetchError) {
        console.error('Error fetching data:', {
          transaccionesUrl: 'http://localhost:8080/api/transacciones-financieras',
          tiposUrl: 'http://localhost:8080/api/tipos-transaccion',
          error: fetchError.message,
          stack: fetchError.stack
        });
        throw fetchError;
      }
      
      // Create a map of tipos for quick lookup
      const tiposMap = tiposTransaccion.reduce((acc, tipo) => {
        acc[tipo.id] = tipo;
        return acc;
      }, {});
      
      console.log('Tipos map:', tiposMap);
      
      // Filter transactions for the specific vehicle with detailed logging
      console.log('All transaction vehicle IDs:', allTransacciones.map(t => ({
        id: t.id,
        vehiculoId: t.vehiculoId,
        tipo: typeof t.vehiculoId,
        match: t.vehiculoId == vehiculoId // loose equality check
      })));
      
      const filteredTransacciones = allTransacciones.filter(transaccion => {
        // Handle both string and number comparisons
        const matches = transaccion.vehiculoId != null && 
                       (transaccion.vehiculoId == vehiculoId || 
                        transaccion.vehiculoId === parseInt(vehiculoId));
        
        console.log(`Transaction ${transaccion.id}:`, {
          transVehiculoId: transaccion.vehiculoId,
          targetVehiculoId: vehiculoId,
          matches
        });
        
        return matches;
      });
      
      console.log('Filtered transactions:', filteredTransacciones);
      
      // Map transactions with their type information
      const vehiculoTransacciones = filteredTransacciones
        .map(transaccion => {
          const tipo = tiposMap[transaccion.tipoTransaccionId] || {
            nombre: 'Tipo desconocido',
            categoria: transaccion.monto > 0 ? 'INGRESO' : 'EGRESO'
          };
          
          return {
            ...transaccion,
            tipo_transaccion: tipo,
            // Ensure we have a proper date string for sorting
            fecha: Array.isArray(transaccion.fecha) 
              ? new Date(transaccion.fecha[0], transaccion.fecha[1] - 1, transaccion.fecha[2])
              : new Date(transaccion.fecha)
          };
        })
        .sort((a, b) => b.fecha - a.fecha); // Sort by date descending
      
      console.log('Processed transactions:', vehiculoTransacciones);
      return vehiculoTransacciones;
    } catch (error) {
      console.error('Error fetching transacciones:', error);
      return [];
    }
  }
};

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const VehiculoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [vehiculo, setVehiculo] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [loadingTransacciones, setLoadingTransacciones] = useState(false);
  const [loadingRepuestos, setLoadingRepuestos] = useState(false);

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
    console.log('Starting to load transactions for vehicle ID:', vehiculoId);
    
    if (!vehiculoId) {
      console.error('No vehicle ID provided to loadTransactions');
      setTransacciones([]);
      return;
    }
    
    try {
      setLoadingTransacciones(true);
      console.log('Calling transaccionesService.getTransaccionesPorVehiculo...');
      
      try {
        const transaccionesData = await transaccionesService.getTransaccionesPorVehiculo(vehiculoId);
        console.log('Raw transactions data from service:', transaccionesData);
        
        const transactionsToSet = Array.isArray(transaccionesData) ? transaccionesData : [];
        console.log('Setting transactions:', transactionsToSet);
        
        setTransacciones(transactionsToSet);
        
        if (transactionsToSet.length === 0) {
          console.log('No transactions found for vehicle ID:', vehiculoId);
          message.info('No se encontraron transacciones para este vehículo');
        }
      } catch (serviceError) {
        console.error('Service error in loadTransactions:', {
          error: serviceError,
          message: serviceError.message,
          stack: serviceError.stack
        });
        setTransacciones([]);
        message.error(`Error al cargar transacciones: ${serviceError.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Unexpected error in loadTransactions:', {
        error,
        message: error.message,
        stack: error.stack
      });
      setTransacciones([]);
      message.error('Error inesperado al cargar las transacciones');
    } finally {
      setLoadingTransacciones(false);
    }
  };

  // Load repuestos for the vehicle
  const loadRepuestos = async (vehiculoId) => {
    try {
      setLoadingRepuestos(true);
      const repuestosData = await repuestosService.getRepuestosPorVehiculo(vehiculoId);
      console.log('Repuestos cargados:', repuestosData);
      setRepuestos(Array.isArray(repuestosData) ? repuestosData : []);
    } catch (error) {
      console.error('Error loading repuestos:', error);
      setRepuestos([]);
      message.warning('No se pudieron cargar los repuestos del vehículo');
    } finally {
      setLoadingRepuestos(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (id) {
      loadVehicleData();
    }
  }, [id]);

  // Load transactions and repuestos when vehicle is loaded
  useEffect(() => {
    if (vehiculo?.id) {
      console.log('Vehicle loaded, loading transactions for ID:', vehiculo.id);
      loadTransactions(vehiculo.id);
      loadRepuestos(vehiculo.id);
    } else {
      console.log('No vehicle ID available yet');
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
  
  // Helper function to get estado tag for repuestos
  const getEstadoRepuestoTag = (estado) => {
    const estados = {
      STOCK: { color: 'success', text: 'Disponible' },
      VENDIDO: { color: 'error', text: 'Vendido' },
      RESERVADO: { color: 'warning', text: 'Reservado' },
      DAÑADO: { color: 'error', text: 'Dañado' }
    };
    
    const estadoInfo = estados[estado] || { color: 'default', text: estado || 'Desconocido' };
    return <Tag color={estadoInfo.color}>{estadoInfo.text}</Tag>;
  };

  // Render transaction type tag
  const renderTipoTransaccion = (tipo) => {
    if (!tipo) {
      return <Tag color="default">No especificado</Tag>;
    }
    
    const isIngreso = tipo.categoria === 'INGRESO';
    const color = isIngreso ? 'green' : 'red';
    const nombre = tipo.nombre || 'Desconocido';
    
    return <Tag color={color}>{nombre}</Tag>;
  };

  // Format currency with color based on context (transaction type or vehicle info)
  const formatCurrencyWithColor = (amount, tipo) => {
    const formattedAmount = new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0
    }).format(amount);
    
    // If tipo is provided, format as transaction (with + or -)
    if (tipo !== undefined) {
      const isIngreso = tipo === 'INGRESO';
      return (
        <span style={{ color: isIngreso ? '#52c41a' : '#f5222d' }}>
          {isIngreso ? '+' : '-'} {formattedAmount}
        </span>
      );
    }
    
    // Default formatting for vehicle info (no sign, default color)
    return formattedAmount;
  };

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
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Repuestos extraídos de este vehículo</Text>
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => navigate(`/inventario/nuevo?vehiculoId=${vehiculo.id}`)}
                  >
                    Agregar Repuesto
                  </Button>
                </div>

                {loadingRepuestos ? (
                  <div style={{ textAlign: 'center', padding: '24px' }}>
                    <Spin />
                  </div>
                ) : repuestos && repuestos.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="ant-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Código</th>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Parte</th>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Descripción</th>
                          <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>Precio Venta</th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>Estado</th>
                          <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>Ubicación</th>
                          <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {repuestos.map((repuesto) => (
                          <tr key={repuesto.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '8px' }}>
                              <Button
                                type="link"
                                style={{ padding: 0, height: 'auto' }}
                                onClick={() => navigate(`/inventario/${repuesto.id}`)}
                              >
                                {repuesto.codigoRepuesto || 'Sin código'}
                              </Button>
                            </td>
                            <td style={{ padding: '8px' }}>
                              <Tag color="blue">{repuesto.parteVehiculo || 'N/A'}</Tag>
                            </td>
                            <td style={{ padding: '8px' }}>{repuesto.descripcion || 'Sin descripción'}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>
                              {formatCurrency(repuesto.precioVenta || 0)}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              {getEstadoRepuestoTag(repuesto.estado)}
                            </td>
                            <td style={{ padding: '8px', fontSize: '0.85em' }}>
                              {repuesto.codigoUbicacion || 'Sin ubicación'}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              <Button 
                                type="link" 
                                size="small"
                                onClick={() => navigate(`/inventario/${repuesto.id}`)}
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
                          // Determine if it's an income or expense
                          const tipo = transaccion.tipo_transaccion || {};
                          const esIngreso = tipo.categoria === 'INGRESO' || 
                                         (tipo.nombre && tipo.nombre.toLowerCase().includes('venta')) ||
                                         transaccion.monto > 0;
                          
                          // Format the date
                          const fecha = Array.isArray(transaccion.fecha) 
                            ? new Date(transaccion.fecha[0], transaccion.fecha[1] - 1, transaccion.fecha[2])
                            : new Date(transaccion.fecha);
                          
                          return (
                            <tr key={transaccion.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                              <td style={{ padding: '8px' }}>{formatDate(transaccion.fecha)}</td>
                              <td style={{ padding: '8px' }}>{renderTipoTransaccion(transaccion.tipo_transaccion)}</td>
                              <td style={{ padding: '8px', textAlign: 'right' }}>
                                {formatCurrencyWithColor(transaccion.monto, transaccion.tipo_transaccion?.categoria)}
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