import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Card, 
  Table, 
  Collapse, 
  Button, 
  Spin, 
  Empty, 
  Typography, 
  Tag,
  Row,
  Col,
  Space
} from 'antd';
import { 
  CarOutlined, 
  DownOutlined, 
  RightOutlined,
  InfoCircleOutlined,
  ReloadOutlined 
} from '@ant-design/icons';

import vehiculoService from '../../api/vehiculos';
import { 
  renderEstado, 
  handleExpand as handleExpandUtil 
} from '../../utils/vehicleUtils';

// Mock data para desarrollo
const MOCK_VEHICULOS = {
  marcas: [
    {
      id: 1,
      nombre: 'Toyota',
      modelos: [
        {
          id: 101,
          nombre: 'Corolla',
          generaciones: [
            {
              id: 1001,
              nombre: 'Generación 12 (2018-2022)',
              vehiculos: [
                { id: 10001, año: 2020, precio: 25000, estado: 'disponible' },
                { id: 10002, año: 2021, precio: 27000, estado: 'vendido' }
              ]
            },
            {
              id: 1002,
              nombre: 'Generación 11 (2013-2018)',
              vehiculos: [
                { id: 10003, año: 2015, precio: 18000, estado: 'disponible' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      nombre: 'Honda',
      modelos: [
        {
          id: 201,
          nombre: 'Civic',
          generaciones: [
            {
              id: 2001,
              nombre: '10ma Generación (2015-2021)',
              vehiculos: [
                { id: 20001, año: 2018, precio: 22000, estado: 'disponible' },
                { id: 20002, año: 2020, precio: 24000, estado: 'disponible' }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const { Panel } = Collapse;
const { Text } = Typography;

/**
 * Componente que muestra una vista jerárquica de vehículos agrupados por marca, modelo y generación.
 * Permite ver detalles de cada vehículo y sus transacciones asociadas.
 */
const VehiculosJerarquicos = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marcas, setMarcas] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [transacciones, setTransacciones] = useState({});
  const [loadingTransacciones, setLoadingTransacciones] = useState({});
  const [rawData, setRawData] = useState(null);
  const [showRawData, setShowRawData] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  /**
   * Procesa los datos de marcas para asegurar la estructura correcta
   * @param {Object|Array} data - Datos de entrada que pueden ser un objeto o array
   * @returns {Array} Datos de marcas procesados con estructura jerárquica
   */
  const procesarDatosMarcas = (data) => {
    console.log('[DEBUG] Procesando datos en procesarDatosMarcas:', data);
    
    // Si los datos son nulos o indefinidos
    if (!data) {
      console.warn('No se recibieron datos en procesarDatosMarcas');
      return [];
    }

    // Función para procesar un array de marcas
    const procesarArrayMarcas = (marcasArray) => {
      if (!Array.isArray(marcasArray)) return [];
      
      return marcasArray
        .filter(marca => marca && typeof marca === 'object')
        .map(marca => ({
          ...marca,
          key: `marca-${marca.id || Math.random()}`,
          nombre: marca.nombre || 'Sin nombre',
          modelos: Array.isArray(marca.modelos) 
            ? marca.modelos
                .filter(modelo => modelo && typeof modelo === 'object')
                .map(modelo => ({
                  ...modelo,
                  key: `modelo-${modelo.id || Math.random()}`,
                  nombre: modelo.nombre || 'Sin nombre',
                  generaciones: Array.isArray(modelo.generaciones)
                    ? modelo.generaciones
                        .filter(generacion => generacion && typeof generacion === 'object')
                        .map(generacion => ({
                          ...generacion,
                          key: `generacion-${generacion.id || Math.random()}`,
                          nombre: generacion.nombre || 'Sin nombre',
                          vehiculos: Array.isArray(generacion.vehiculos)
                            ? generacion.vehiculos
                                .filter(v => v && typeof v === 'object')
                                .map(v => ({
                                  ...v,
                                  key: `vehiculo-${v.id || Math.random()}`,
                                  codigo_vehiculo: v.codigo_vehiculo || 'Sin código'
                                }))
                            : []
                        }))
                    : []
                }))
            : []
        }));
    };

    // Si los datos son un array, asumimos que es un array de marcas
    if (Array.isArray(data)) {
      console.log('[DEBUG] Los datos son un array, procesando como array de marcas');
      const marcasProcesadas = procesarArrayMarcas(data);
      console.log('[DEBUG] Marcas procesadas:', marcasProcesadas);
      return marcasProcesadas;
    }
    
    // Si es un objeto con propiedad 'marcas'
    if (data.marcas && Array.isArray(data.marcas)) {
      console.log('[DEBUG] Datos contienen propiedad "marcas"');
      const marcasProcesadas = procesarArrayMarcas(data.marcas);
      console.log('[DEBUG] Marcas procesadas:', marcasProcesadas);
      return marcasProcesadas;
    }
    
    // Si es un objeto pero no tiene la estructura esperada, intentar extraer marcas
    if (typeof data === 'object' && !Array.isArray(data)) {
      console.log('[DEBUG] Los datos son un objeto, buscando estructura alternativa');
      
      // Buscar cualquier propiedad que sea un array que podría contener las marcas
      const possibleMarcas = Object.values(data).find(
        val => Array.isArray(val) && val.length > 0 && val[0].modelos
      );
      
      if (possibleMarcas) {
        console.log('[DEBUG] Se encontró un array de marcas en una propiedad del objeto');
        return procesarArrayMarcas(possibleMarcas);
      }
      
      // Si no encontramos marcas directamente, buscar cualquier array que pueda contener vehículos
      const anyArray = Object.values(data).find(
        val => Array.isArray(val) && val.length > 0
      );
      
      if (anyArray) {
        console.log('[DEBUG] Se encontró un array en los datos, intentando procesar como marcas');
        return procesarArrayMarcas(anyArray);
      }
    }
    
    console.warn('Formato de datos inesperado en procesarDatosMarcas:', data);
    return [];
  };

  /**
   * Carga los datos jerárquicos de vehículos desde el servidor
   */
  // Función para convertir datos planos a jerárquicos
  const convertirPlanoAJerarquico = (flatData) => {
    if (!Array.isArray(flatData)) return [];
    
    const marcasMap = new Map();
    
    flatData.forEach(vehiculo => {
      if (!vehiculo) return;
      
      // Asegurar que el vehículo tenga los campos necesarios
      const vehiculoProcesado = {
        ...vehiculo,
        key: `vehiculo-${vehiculo.id || Math.random()}`,
        codigo_vehiculo: vehiculo.codigo_vehiculo || 'Sin código'
      };
      
      // Obtener o crear la marca
      const marcaId = vehiculo.marca_id || 'default';
      if (!marcasMap.has(marcaId)) {
        marcasMap.set(marcaId, {
          id: marcaId,
          nombre: vehiculo.marca_nombre || 'Sin marca',
          key: `marca-${marcaId}`,
          modelos: new Map()
        });
      }
      
      const marca = marcasMap.get(marcaId);
      
      // Obtener o crear el modelo
      const modeloId = vehiculo.modelo_id || 'default';
      if (!marca.modelos.has(modeloId)) {
        marca.modelos.set(modeloId, {
          id: modeloId,
          nombre: vehiculo.modelo_nombre || 'Sin modelo',
          key: `modelo-${modeloId}`,
          generaciones: new Map()
        });
      }
      
      const modelo = marca.modelos.get(modeloId);
      
      // Obtener o crear la generación
      const generacionId = vehiculo.generacion_id || 'default';
      if (!modelo.generaciones.has(generacionId)) {
        modelo.generaciones.set(generacionId, {
          id: generacionId,
          nombre: vehiculo.generacion_nombre || 'Sin generación',
          key: `generacion-${generacionId}`,
          vehiculos: []
        });
      }
      
      // Agregar el vehículo a la generación
      const generacion = modelo.generaciones.get(generacionId);
      generacion.vehiculos.push(vehiculoProcesado);
    });
    
    // Convertir los Maps a arrays anidados
    return Array.from(marcasMap.values()).map(marca => ({
      ...marca,
      modelos: Array.from(marca.modelos.values()).map(modelo => ({
        ...modelo,
        generaciones: Array.from(modelo.generaciones.values())
      }))
    }));
  };
  
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setRawData(null);
      setShowRawData(false);
      setMarcas([]);
      
      console.log('[DEBUG] Iniciando carga de datos...');
      
      // Usar datos de prueba directamente
      console.log('[DEBUG] Usando datos de prueba...');
      const data = MOCK_VEHICULOS;
      
      // Procesar los datos
      console.log('[DEBUG] Procesando datos de prueba...');
      const marcasProcesadas = procesarDatosMarcas(data);
      
      if (!marcasProcesadas || marcasProcesadas.length === 0) {
        throw new Error('No se encontraron vehículos en los datos de prueba');
      }
      
      console.log('[DEBUG] Datos de prueba procesados correctamente:', marcasProcesadas);
      
      setMarcas(marcasProcesadas);
      setRawData(data);
      setError('Modo de demostración: mostrando datos de prueba. El servidor no está disponible.');
      setShowRawData(true);
      setLoading(false);
    } catch (err) {
      const errorDetails = {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      };
      
      console.error('[ERROR] Error al cargar vehículos:', errorDetails);
      setError(`Error al cargar los datos: ${err.message || 'Error desconocido'}`);
      
      // En desarrollo, mostrar más detalles del error
      if (process.env.NODE_ENV === 'development') {
        console.error('Detalles completos del error:', errorDetails);
      }
    } finally {
      console.log('[DEBUG] Finalizando carga de datos, estableciendo loading=false');
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  /**
   * Maneja la expansión de un vehículo para cargar sus transacciones
   * @param {string|number} vehiculoId - ID del vehículo
   * @param {boolean} expanded - Indica si el panel está expandido
   */
  const handleExpand = useCallback((vehiculoId, expanded) => {
    handleExpandUtil(
      vehiculoId,
      expanded,
      transacciones,
      setTransacciones,
      setLoadingTransacciones,
      vehiculoService
    );
  }, [transacciones]);
  
  // Columnas para la tabla de transacciones
  const columnasTransacciones = useMemo(() => [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      width: 120,
      responsive: ['md'],
      render: (fecha) => new Date(fecha).toLocaleDateString()
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            {text}
          </div>
          <div>
            <span style={{ marginRight: 8, display: 'inline-block' }}>
              {new Date(record.fecha).toLocaleDateString()}
            </span>
            {record.tipo_transaccion && (
              <Tag color={record.tipo_transaccion.categoria === 'INGRESO' ? 'green' : 'red'}>
                {record.tipo_transaccion.nombre}
              </Tag>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      align: 'right',
      render: (monto, record) => (
        <Text strong style={{ color: record.tipo_transaccion?.categoria === 'INGRESO' ? 'green' : 'red' }}>
          {record.tipo_transaccion?.categoria === 'INGRESO' ? '+' : '-'} ${monto.toLocaleString()}
        </Text>
      )
    }
  ], []);

  /**
   * Renderiza el contenido de un vehículo
   * @param {Object} vehiculo - Datos del vehículo
   * @returns {JSX.Element} Componente del vehículo
   */
  const renderVehiculo = (vehiculo) => {
    const tieneTransacciones = transacciones[vehiculo.id]?.length > 0;
    const cargando = loadingTransacciones[vehiculo.id];

    return (
      <Collapse
        ghost
        expandIcon={({ isActive }) => (
          <Button 
            type="text" 
            size="small" 
            icon={isActive ? <DownOutlined /> : <RightOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleExpand(vehiculo.id, !expandedKeys[vehiculo.id]);
              setExpandedKeys(prev => ({
                ...prev,
                [vehiculo.id]: !prev[vehiculo.id]
              }));
            }}
          />
        )}
        className="vehiculo-collapse"
      >
        <Panel
          key={vehiculo.id}
          header={
            <div className="vehiculo-header" style={{ width: '100%' }}>
              <Row gutter={[8, 8]} align="middle" wrap={false}>
                <Col flex="none">
                  <CarOutlined style={{ fontSize: '16px' }} />
                </Col>
                <Col flex="auto" style={{ minWidth: 0 }}>
                  <div style={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginRight: '8px'
                  }}>
                    <Text strong>{vehiculo.codigo_vehiculo || 'Sin código'}</Text>
                    <Text type="secondary" style={{ marginLeft: '8px' }}>{vehiculo.anio}</Text>
                    <span style={{ marginLeft: '8px' }}>{renderEstado(vehiculo.estado)}</span>
                  </div>
                </Col>
                <Col flex="none">
                  <Space wrap size={[8, 8]} style={{ justifyContent: 'flex-end' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8em' }}><Text type="secondary">Inversión</Text></div>
                      <Text strong>${vehiculo.inversion_total?.toLocaleString() || '0'}</Text>
                    </div>
                    {vehiculo.estado === 'VENDIDO' && vehiculo.precio_venta && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8em' }}><Text type="secondary">Venta</Text></div>
                        <Text strong style={{ color: 'green' }}>
                          ${vehiculo.precio_venta.toLocaleString()}
                        </Text>
                      </div>
                    )}
                  </Space>
                </Col>
              </Row>
            </div>
          }
        >
          {cargando ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <Spin size="small" />
              <div style={{ marginTop: 8 }}>Cargando transacciones...</div>
            </div>
          ) : (
            <div className="vehiculo-detalle" style={{ padding: '8px 0' }}>
              <Card size="small" style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Detalles del vehículo</Text>
                  <Row gutter={[16, 8]}>
                    <Col xs={24} sm={12} md={8}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '0.85em' }}>Fecha de ingreso</Text>
                        <div style={{ marginTop: 2 }}>{new Date(vehiculo.fecha_ingreso).toLocaleDateString()}</div>
                      </div>
                    </Col>
                    {vehiculo.fecha_venta && (
                      <Col xs={24} sm={12} md={8}>
                        <div>
                          <Text type="secondary" style={{ fontSize: '0.85em' }}>Fecha de venta</Text>
                          <div style={{ marginTop: 2 }}>{new Date(vehiculo.fecha_venta).toLocaleDateString()}</div>
                        </div>
                      </Col>
                    )}
                    <Col xs={12} sm={6} md={4}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '0.85em' }}>Costo grúa</Text>
                        <div style={{ marginTop: 2 }}>${vehiculo.costo_grua?.toLocaleString() || '0'}</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '0.85em' }}>Comisiones</Text>
                        <div style={{ marginTop: 2 }}>${vehiculo.comisiones?.toLocaleString() || '0'}</div>
                      </div>
                    </Col>
                  </Row>
                  {vehiculo.notas && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #f0f0f0' }}>
                      <Text type="secondary" style={{ fontSize: '0.85em' }}>Notas</Text>
                      <div style={{ marginTop: 4 }}>{vehiculo.notas}</div>
                    </div>
                  )}
                </div>
              </Card>

              <Card size="small">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <CarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  <Text strong>Transacciones</Text>
                  <Tag style={{ marginLeft: 8, borderRadius: 10 }}>
                    {tieneTransacciones ? transacciones[vehiculo.id].length : '0'}
                  </Tag>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <Table
                    size="small"
                    columns={columnasTransacciones}
                    dataSource={tieneTransacciones ? transacciones[vehiculo.id] : []}
                    rowKey="id"
                    pagination={false}
                    bordered
                    style={{ minWidth: '600px' }}
                    locale={{
                      emptyText: (
                        <Empty 
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <span>
                              <InfoCircleOutlined style={{ marginRight: 4 }} />
                              No hay transacciones registradas
                            </span>
                          }
                        />
                      )
                    }}
                  />
                </div>
              </Card>
            </div>
          )}
        </Panel>
      </Collapse>
    );
  };

  /**
   * Renderiza una generación con sus vehículos
   * @param {Object} generacion - Datos de la generación
   * @returns {JSX.Element} Componente de la generación
   */
  const renderGeneracion = (generacion) => (
    <Card 
      key={generacion.id} 
      size="small" 
      style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden' }}
      bodyStyle={{ padding: 0 }}
    >
      <div 
        style={{
          padding: '12px 16px',
          background: '#f9f9f9',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Row gutter={[8, 8]} align="middle">
          <Col xs={24} md={12}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              <Text strong style={{ fontSize: '1em' }}>{generacion.nombre}</Text>
              {generacion.descripcion && (
                <Text type="secondary" style={{ fontSize: '0.9em' }}>
                  ({generacion.descripcion})
                </Text>
              )}
              <Text type="secondary" style={{ fontSize: '0.85em' }}>
                {generacion.anio_inicio} - {generacion.anio_fin || 'Actual'}
              </Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={[8, 8]}>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <div style={{ fontSize: '0.75em', color: '#8c8c8c' }}>Inversión</div>
                  <div>${generacion.total_inversion?.toLocaleString() || '0'}</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <div style={{ fontSize: '0.75em', color: '#8c8c8c' }}>Ingresos</div>
                  <div style={{ color: '#52c41a' }}>${generacion.total_ingresos?.toLocaleString() || '0'}</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <div style={{ fontSize: '0.75em', color: '#8c8c8c' }}>Egresos</div>
                  <div style={{ color: '#f5222d' }}>${generacion.total_egresos?.toLocaleString() || '0'}</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <div style={{ fontSize: '0.75em', color: '#8c8c8c' }}>Balance</div>
                  <div 
                    style={{ 
                      color: (generacion.balance_neto || 0) >= 0 ? '#52c41a' : '#f5222d',
                      fontWeight: 500
                    }}
                  >
                    ${Math.abs(generacion.balance_neto || 0).toLocaleString()}
                    <span style={{ fontSize: '0.85em', marginLeft: 4 }}>
                      {(generacion.balance_neto || 0) < 0 ? 'Pérdida' : 'Ganancia'}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      
      <div className="vehiculos-list" style={{ padding: '12px 16px' }}>
        {generacion.vehiculos?.length > 0 ? (
          generacion.vehiculos.map(vehiculo => (
            <div key={vehiculo.id} className="vehiculo-item" style={{ marginBottom: 12 }}>
              {renderVehiculo(vehiculo)}
            </div>
          ))
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ fontSize: '0.9em' }}>
                <InfoCircleOutlined style={{ marginRight: 4 }} />
                No hay vehículos registrados
              </span>
            }
            style={{ margin: '16px 0', padding: '16px 0' }}
          />
        )}
      </div>
    </Card>
  );

  /**
   * Renderiza un modelo con sus generaciones
   * @param {Object} modelo - Datos del modelo
   * @returns {JSX.Element} Componente del modelo
   */
  const renderModelo = (modelo) => (
    <Card 
      key={modelo.id} 
      className="modelo-item" 
      style={{ 
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div 
        style={{
          padding: '12px 16px',
          background: '#f5f7fa',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text strong style={{ fontSize: '1.1em' }}>{modelo.nombre}</Text>
        <Tag color="blue" style={{ marginLeft: 8, borderRadius: 10 }}>
          {modelo.generaciones?.length || 0} {modelo.generaciones?.length === 1 ? 'generación' : 'generaciones'}
        </Tag>
      </div>
      
      <div className="generaciones-list">
        {modelo.generaciones?.length > 0 ? (
          <div style={{ padding: '8px 8px 0' }}>
            {modelo.generaciones.map(renderGeneracion)}
          </div>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ fontSize: '0.9em' }}>
                <InfoCircleOutlined style={{ marginRight: 4 }} />
                No hay generaciones registradas
              </span>
            }
            style={{ margin: '24px 0', padding: '24px 0' }}
          />
        )}
      </div>
    </Card>
  );

  /**
   * Renderiza una marca con sus modelos
   * @param {Object} marca - Datos de la marca
   * @returns {JSX.Element} Componente de la marca
   */
  const renderMarca = (marca) => (
    <Card 
      key={marca.id}
      style={{
        marginBottom: 24,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
      bodyStyle={{ padding: 0 }}
      className="marca-card"
    >
      <div 
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <CarOutlined style={{ fontSize: '1.2em', color: '#1890ff' }} />
          <Text strong style={{ fontSize: '1.2em' }}>{marca.nombre}</Text>
        </div>
        <div>
          <Tag color="blue" style={{ 
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '0.9em',
            fontWeight: 500
          }}>
            {marca.modelos?.length || 0} {marca.modelos?.length === 1 ? 'modelo' : 'modelos'}
          </Tag>
        </div>
      </div>
      
      <div className="modelos-list" style={{ padding: '8px' }}>
        {marca.modelos?.length > 0 ? (
          <div style={{ marginTop: '4px' }}>
            {marca.modelos.map(renderModelo)}
          </div>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ fontSize: '0.9em' }}>
                <InfoCircleOutlined style={{ marginRight: 4 }} />
                No hay modelos registrados
              </span>
            }
            style={{ 
              margin: '24px 0', 
              padding: '24px 0',
              borderTop: '1px dashed #f0f0f0'
            }}
          />
        )}
      </div>
    </Card>
  );

  // Mostrar estado de carga
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '300px',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          {retryCount > 0 ? 'Reintentando cargar los datos...' : 'Cargando vehículos...'}
        </div>
      </div>
    );
  }

  // Renderizado principal del componente
  return (
    <div className="vehiculos-jerarquicos">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Vehículos</h1>
            <Text type="secondary">
              Vista jerárquica de vehículos agrupados por marca, modelo y generación
            </Text>
          </div>
          {rawData && (
            <Button 
              type="link" 
              onClick={() => setShowRawData(!showRawData)}
              icon={<InfoCircleOutlined />}
            >
              {showRawData ? 'Ocultar datos en bruto' : 'Mostrar datos en bruto'}
            </Button>
          )}
        </div>
        
        {showRawData && (
          <div style={{ 
            marginTop: 16, 
            padding: 16, 
            background: '#f5f5f5', 
            borderRadius: 4,
            maxHeight: 400,
            overflow: 'auto'
          }}>
            <pre style={{ margin: 0 }}>{JSON.stringify(rawData, null, 2)}</pre>
          </div>
        )}
      </div>
      
      {marcas.map(marca => (
        <Card 
          key={`marca-${marca.id}`} 
          style={{ marginBottom: 16 }}
          title={marca.nombre}
          extra={`${marca.modelos?.length || 0} modelos`}
        >
          {marca.modelos?.length > 0 ? (
            <Collapse ghost>
              {marca.modelos.map(modelo => (
                <Panel 
                  key={`modelo-${modelo.id}`}
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{modelo.nombre}</span>
                      <span>{modelo.generaciones?.length || 0} generaciones</span>
                    </div>
                  }
                >
                  {modelo.generaciones?.length > 0 ? (
                    <Collapse ghost>
                      {modelo.generaciones.map(generacion => (
                        <Panel
                          key={`generacion-${generacion.id}`}
                          header={`${generacion.nombre} (${generacion.anio_inicio} - ${generacion.anio_fin || 'Actual'})`}
                        >
                          {generacion.vehiculos?.length > 0 ? (
                            <div style={{ marginLeft: 24 }}>
                              {generacion.vehiculos.map(vehiculo => (
                                <div key={vehiculo.id} style={{ marginBottom: 16 }}>
                                  {renderVehiculo(vehiculo)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Empty 
                              description="No hay vehículos en esta generación" 
                              image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            />
                          )}
                        </Panel>
                      ))}
                    </Collapse>
                  ) : (
                    <Empty 
                      description="No hay generaciones para este modelo" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    />
                  )}
                </Panel>
              ))}
            </Collapse>
          ) : (
            <Empty 
              description="No hay modelos para esta marca" 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          )}
        </Card>
      ))}
    </div>
  );
};

// Prop Types para validación de props
VehiculosJerarquicos.propTypes = {
  // No hay props requeridas actualmente, pero se pueden agregar en el futuro
};

// Documentación de tipos para el componente
/**
 * @typedef {Object} Vehiculo
 * @property {number|string} id - ID único del vehículo
 * @property {string} codigoVehiculo - Código único del vehículo
 * @property {number} anio - Año del vehículo
 * @property {string} estado - Estado actual del vehículo
 * @property {number} inversionTotal - Inversión total en el vehículo
 * @property {string} [notas] - Notas adicionales sobre el vehículo
 */

/**
 * @typedef {Object} Transaccion
 * @property {number|string} id - ID único de la transacción
 * @property {number} monto - Monto de la transacción
 * @property {string} fecha - Fecha de la transacción
 * @property {string} descripcion - Descripción de la transacción
 * @property {Object} tipo_transaccion - Tipo de transacción
 * @property {string} tipo_transaccion.nombre - Nombre del tipo de transacción
 * @property {'INGRESO'|'EGRESO'} tipo_transaccion.categoria - Categoría de la transacción
 */

export default VehiculosJerarquicos;
