// src/components/VehiculosJerarquicos.jsx
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
  Space,
  message
} from 'antd';
import {
  CarOutlined,
  DownOutlined,
  RightOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

import vehiculoService from '../../api/vehiculos';
import finanzaService from '../../api/finanzas'; // Importar el servicio de finanzas
import { renderEstado } from '../../utils/vehicleUtils';

const { Panel } = Collapse;
const { Text } = Typography;

/* ========================= Helpers ========================= */
const isNullish = (v) => v === null || v === undefined || v === '{null}';
const toNum = (v, d = 0) => (isNullish(v) || v === '' ? d : Number(v));
const toStr = (v, d = '') => (isNullish(v) ? d : String(v));

/** Acepta string ISO, Date, o array [yyyy, m, d, (hh, mm, ss)] */
const arrDateToDate = (arr) => {
  if (!Array.isArray(arr) || arr.length < 3) return null;
  const [y, m, d, hh = 0, mm = 0, ss = 0] = arr.map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, hh, mm, ss);
  return isNaN(dt.getTime()) ? null : dt;
};
const toDate = (v) => {
  if (isNullish(v)) return null;
  if (Array.isArray(v)) return arrDateToDate(v);
  const dt = new Date(String(v));
  return isNaN(dt.getTime()) ? null : dt;
};
const toDateStr = (v) => {
  const dt = toDate(v);
  return dt ? dt.toLocaleDateString() : '-';
};

/* ========== Normalización: soporta snake_case y camelCase ========== */
const normalizarEOrdenar = (data) => {
  const marcas = Array.isArray(data?.marcas) ? data.marcas : (Array.isArray(data) ? data : []);

  const normVehiculo = (v) => {
    const codigo = v.codigo_vehiculo ?? v.codigoVehiculo;
    const generacionId = v.generacion_id ?? v.generacionId;
    const precioCompra = v.precio_compra ?? v.precioCompra;
    const costoGrua = v.costo_grua ?? v.costoGrua;
    const inversionTotal = v.inversion_total ?? v.inversionTotal;
    const costoRecuperado = v.costo_recuperado ?? v.costoRecuperado;
    const costoPendiente = v.costo_pendiente ?? v.costoPendiente;
    const fechaIngreso = v.fecha_ingreso ?? v.fechaIngreso;
    const precioVenta = v.precio_venta ?? v.precioVenta;
    const fechaVenta = v.fecha_venta ?? v.fechaVenta;
    const fechaCreacion = v.fecha_creacion ?? v.fechaCreacion;
    const fechaActualizacion = v.fecha_actualizacion ?? v.fechaActualizacion;

    return {
      id: v.id,
      codigo_vehiculo: toStr(codigo, 'Sin código'),
      generacion_id: generacionId,
      anio: toNum(v.anio),
      precio_compra: toNum(precioCompra),
      costo_grua: toNum(costoGrua),
      comisiones: toNum(v.comisiones),
      inversion_total: toNum(inversionTotal),
      costo_recuperado: toNum(costoRecuperado),
      costo_pendiente: toNum(costoPendiente),
      fecha_ingreso: fechaIngreso,
      estado: toStr(v.estado, 'SIN_ESTADO'),
      precio_venta: isNullish(precioVenta) ? null : Number(precioVenta),
      fecha_venta: isNullish(fechaVenta) ? null : fechaVenta,
      activo: toNum(v.activo, 0),
      notas: isNullish(v.notas) ? null : String(v.notas),
      fecha_creacion: fechaCreacion,
      fecha_actualizacion: fechaActualizacion
    };
  };

  const normGeneracion = (g) => {
    const anioInicio = g.anio_inicio ?? g.anioInicio;
    const anioFin = g.anio_fin ?? g.anioFin;
    return {
      id: g.id,
      modelo_id: g.modelo_id,
      nombre: toStr(g.nombre, 'Sin generación'),
      descripcion: toStr(g.descripcion),
      anio_inicio: isNullish(anioInicio) ? undefined : Number(anioInicio),
      anio_fin: isNullish(anioFin) ? null : Number(anioFin),
      total_inversion: toNum(g.total_inversion),
      total_ingresos: toNum(g.total_ingresos),
      total_egresos: toNum(g.total_egresos),
      balance_neto: toNum(g.balance_neto),
      activo: toNum(g.activo, 0),
      fecha_creacion: toStr(g.fecha_creacion ?? g.fechaCreacion),
      vehiculos: (Array.isArray(g.vehiculos) ? g.vehiculos.map(normVehiculo) : [])
        .sort((a, b) => (a.anio ?? 0) - (b.anio ?? 0))
    };
  };

  const normModelo = (mo) => ({
    id: mo.id,
    marca_id: mo.marca_id,
    nombre: toStr(mo.nombre, 'Sin modelo'),
    activo: toNum(mo.activo, 0),
    fecha_creacion: toStr(mo.fecha_creacion ?? mo.fechaCreacion),
    generaciones: (Array.isArray(mo.generaciones) ? mo.generaciones.map(normGeneracion) : [])
      .sort((a, b) => (a.anio_inicio ?? 0) - (b.anio_inicio ?? 0))
  });

  return marcas
    .map((m) => ({
      id: m.id,
      nombre: toStr(m.nombre, 'Sin marca'),
      activo: toNum(m.activo, 0),
      fecha_creacion: toStr(m.fecha_creacion ?? m.fechaCreacion),
      modelos: (Array.isArray(m.modelos) ? m.modelos.map(normModelo) : [])
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
};

/* ========================= Componente ========================= */
const VehiculosJerarquicos = () => {
  const [loading, setLoading] = useState(true);
  const [marcas, setMarcas] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [transacciones, setTransacciones] = useState({});
  const [loadingTransacciones, setLoadingTransacciones] = useState({});
  const [showRawData, setShowRawData] = useState(false);
  const [rawData, setRawData] = useState(null);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await vehiculoService.getVehiculosAgrupados();
      if (!response) throw new Error('Respuesta vacía del servidor');

      setRawData(response);
      const datos = normalizarEOrdenar(response);

      if (!datos.length) {
        message.info('No se encontraron vehículos para mostrar');
      }
      setMarcas(datos);
    } catch (error) {
      console.error('Error al cargar los vehículos:', error);
      message.error(`Error al cargar los vehículos: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Función personalizada para manejar la expansión y carga de transacciones
  const handleExpand = useCallback(async (vehiculoId, expanded) => {
    if (!expanded || transacciones[vehiculoId]) {
      return; // Si no se está expandiendo o ya tenemos las transacciones, no hacer nada
    }

    try {
      setLoadingTransacciones(prev => ({ ...prev, [vehiculoId]: true }));
      
      // Usar el servicio de finanzas para obtener transacciones específicas del vehículo
      const response = await finanzaService.getTransaccionesPorVehiculo(vehiculoId);
      
      // Asegurarse de que tenemos un array, incluso si la respuesta es null/undefined
      const transaccionesNormalizadas = Array.isArray(response) ? response : [];

      // Ordenar por fecha (más reciente primero) - por si acaso el backend no lo hace
      const transaccionesOrdenadas = [...transaccionesNormalizadas].sort((a, b) => {
        const fechaA = toDate(a.fecha || a.fecha_transaccion);
        const fechaB = toDate(b.fecha || b.fecha_transaccion);
        if (!fechaA && !fechaB) return 0;
        if (!fechaA) return 1;
        if (!fechaB) return -1;
        return fechaB.getTime() - fechaA.getTime();
      });

      setTransacciones(prev => ({
        ...prev,
        [vehiculoId]: transaccionesOrdenadas
      }));

    } catch (error) {
      console.error(`Error al cargar transacciones del vehículo ${vehiculoId}:`, error);
      message.error(`Error al cargar transacciones: ${error.message || 'Error desconocido'}`);
      
      // Establecer array vacío en caso de error
      setTransacciones(prev => ({
        ...prev,
        [vehiculoId]: []
      }));
    } finally {
      setLoadingTransacciones(prev => ({ ...prev, [vehiculoId]: false }));
    }
  }, [transacciones]);

  const columnasTransacciones = useMemo(() => ([
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      width: 120,
      responsive: ['md'],
      render: (fecha, record) => {
        // Intentar diferentes campos de fecha
        const fechaTransaccion = fecha || record.fecha_transaccion || record.fechaTransaccion;
        return toDateStr(fechaTransaccion);
      }
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text, record) => {
        // Intentar diferentes campos de descripción
        const descripcion = text || record.concepto || record.detalle || '-';
        const fechaTransaccion = record.fecha || record.fecha_transaccion || record.fechaTransaccion;
        
        return (
          <div>
            <div style={{ marginBottom: 4 }}>{toStr(descripcion, '-')}</div>
            <div>
              <span style={{ marginRight: 8, display: 'inline-block' }}>
                {toDateStr(fechaTransaccion)}
              </span>
              {(record?.tipo_transaccion || record?.tipo) && (
                <Tag color={(record.tipo_transaccion?.categoria || record.categoria || record.tipo) === 'INGRESO' ? 'green' : 'red'}>
                  {toStr(record.tipo_transaccion?.nombre || record.tipo_nombre || record.tipo, 'Transacción')}
                </Tag>
              )}
            </div>
          </div>
        );
      }
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      align: 'right',
      render: (monto, record) => {
        // Intentar diferentes campos de monto
        const montoTransaccion = monto || record.valor || record.importe || 0;
        const categoria = record?.tipo_transaccion?.categoria || record?.categoria || record?.tipo;
        const esIngreso = categoria === 'INGRESO';
        
        return (
          <Text strong style={{ color: esIngreso ? 'green' : 'red' }}>
            {esIngreso ? '+' : '-'} {formatMonto(montoTransaccion).replace('₡', '')}
          </Text>
        );
      }
    }
  ]), []);

  // Formatear monto con separadores de miles y símbolo de colones
  const formatMonto = (monto) => {
    if (monto === null || monto === undefined) return '₡0';
    return `₡${parseFloat(monto).toLocaleString('es-CR')}`;
  };

  const renderVehiculo = (vehiculo) => {
    const tieneTransacciones = transacciones[vehiculo.id]?.length > 0;
    const cargando = loadingTransacciones[vehiculo.id];
    const estaExpandido = expandedKeys[vehiculo.id];

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
              const nuevoEstado = !expandedKeys[vehiculo.id];
              
              // Actualizar estado de expansión
              setExpandedKeys(prev => ({ ...prev, [vehiculo.id]: nuevoEstado }));
              
              // Cargar transacciones si se está expandiendo
              if (nuevoEstado) {
                handleExpand(vehiculo.id, true);
              }
            }}
          />
        )}
        className="vehiculo-collapse"
        activeKey={estaExpandido ? [`veh-${vehiculo.id}`] : []}
      >
        <Panel
          key={`veh-${vehiculo.id}`}
          header={
            <div className="vehiculo-header" style={{ width: '100%' }}>
              <Row gutter={[8, 8]} align="middle" wrap={false}>
                <Col flex="none">
                  <CarOutlined style={{ fontSize: '16px' }} />
                </Col>
                <Col flex="auto" style={{ minWidth: 0 }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '8px' }}>
                    <Text strong>{toStr(vehiculo.codigo_vehiculo, 'Sin código')}</Text>
                    <Text type="secondary" style={{ marginLeft: '8px' }}>{vehiculo.anio ?? '-'}</Text>
                    <span style={{ marginLeft: '8px' }}>{renderEstado(vehiculo.estado)}</span>
                  </div>
                </Col>
                <Col flex="none">
                  <Space wrap size={[8, 8]} style={{ justifyContent: 'flex-end' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8em' }}><Text type="secondary">Inversión</Text></div>
                      <Text strong>{formatMonto(vehiculo.inversion_total)}</Text>
                    </div>
                    {toStr(vehiculo.estado).toUpperCase() === 'VENDIDO' && !isNullish(vehiculo.precio_venta) && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8em' }}><Text type="secondary">Venta</Text></div>
                        <Text strong style={{ color: 'green' }}>
                          {formatMonto(vehiculo.precio_venta)}
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
                        <div style={{ marginTop: 2 }}>{toDateStr(vehiculo.fecha_ingreso)}</div>
                      </div>
                    </Col>
                    {!isNullish(vehiculo.fecha_venta) && (
                      <Col xs={24} sm={12} md={8}>
                        <div>
                          <Text type="secondary" style={{ fontSize: '0.85em' }}>Fecha de venta</Text>
                          <div style={{ marginTop: 2 }}>{toDateStr(vehiculo.fecha_venta)}</div>
                        </div>
                      </Col>
                    )}
                    <Col xs={12} sm={6} md={4}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '0.85em' }}>Costo grúa</Text>
                        <div style={{ marginTop: 2 }}>{formatMonto(vehiculo.costo_grua)}</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '0.85em' }}>Comisiones</Text>
                        <div style={{ marginTop: 2 }}>{formatMonto(vehiculo.comisiones)}</div>
                      </div>
                    </Col>
                  </Row>
                  {!isNullish(vehiculo.notas) && (
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
                    rowKey={(record) => record.id || `${record.fecha}-${record.monto}`}
                    pagination={tieneTransacciones && transacciones[vehiculo.id].length > 10 ? {
                      pageSize: 10,
                      size: 'small',
                      showSizeChanger: false
                    } : false}
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

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '300px', padding: '40px 20px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          Cargando vehículos...
        </div>
      </div>
    );
  }

  return (
    <div className="vehiculos-jerarquicos">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Vehículos</h1>
            <Text type="secondary">Vista jerárquica de vehículos agrupados por marca, modelo y generación</Text>
          </div>
          {rawData && (
            <Button type="link" onClick={() => setShowRawData(!showRawData)} icon={<InfoCircleOutlined />}>
              {showRawData ? 'Ocultar datos en bruto' : 'Mostrar datos en bruto'}
            </Button>
          )}
        </div>
        {showRawData && (
          <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4, maxHeight: 400, overflow: 'auto' }}>
            <pre style={{ margin: 0 }}>{JSON.stringify(rawData, null, 2)}</pre>
          </div>
        )}
      </div>

      {marcas.map((marca) => (
        <Card
          key={`marca-list-${marca.id}`}
          style={{ marginBottom: 16 }}
          title={toStr(marca.nombre, 'Sin marca')}
          extra={`${marca.modelos?.length || 0} modelos`}
        >
          {marca.modelos?.length > 0 ? (
            <Collapse ghost>
              {marca.modelos.map((modelo) => (
                <Panel
                  key={`modelo-panel-${marca.id}-${modelo.id}`}
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{toStr(modelo.nombre, 'Sin modelo')}</span>
                      <span>{modelo.generaciones?.length || 0} generaciones</span>
                    </div>
                  }
                >
                  {modelo.generaciones?.length > 0 ? (
                    <Collapse ghost>
                      {modelo.generaciones.map((generacion) => (
                        <Panel
                          key={`generacion-panel-${modelo.id}-${generacion.id}`}
                          header={`${toStr(generacion.nombre, 'Sin generación')} (${generacion.anio_inicio ?? '-'} - ${generacion.anio_fin ?? 'Actual'})`}
                        >
                          {generacion.vehiculos?.length > 0 ? (
                            <div style={{ marginLeft: 24 }}>
                              {generacion.vehiculos.map((vehiculo) => (
                                <div key={`vehiculo-panel-${generacion.id}-${vehiculo.id}`} style={{ marginBottom: 16 }}>
                                  {renderVehiculo(vehiculo)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Empty description="No hay vehículos en esta generación" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          )}
                        </Panel>
                      ))}
                    </Collapse>
                  ) : (
                    <Empty description="No hay generaciones para este modelo" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Panel>
              ))}
            </Collapse>
          ) : (
            <Empty description="No hay modelos para esta marca" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Card>
      ))}
    </div>
  );
};

export default VehiculosJerarquicos;