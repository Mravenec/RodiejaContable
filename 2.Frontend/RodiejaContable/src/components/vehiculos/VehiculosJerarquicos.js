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
import {
  renderEstado,
  handleExpand as handleExpandUtil
} from '../../utils/vehicleUtils';

const { Panel } = Collapse;
const { Text } = Typography;

/** Helpers de normalización y formateo */
const isNullish = (v) => v === null || v === undefined || v === '{null}';
const toNum = (v, d = 0) => (isNullish(v) ? d : Number(v));
const toDateStr = (v) => {
  if (isNullish(v)) return '-';
  // JOOQ te manda '2025-07-31' o '2025-07-31T06:08:14'
  const dt = new Date(String(v));
  return isNaN(dt.getTime()) ? String(v) : dt.toLocaleDateString();
};
const toStr = (v, d = '') => (isNullish(v) ? d : String(v));

/**
 * Normaliza a la forma esperada por la UI:
 * [{ id, nombre, modelos:[{ id, nombre, generaciones:[{..., vehiculos:[...] }]}] }]
 * Garantiza arrays y ordena como tus queries (nombre asc, anio_inicio asc, anio asc)
 */
const normalizarEOrdenar = (data) => {
  const marcas = Array.isArray(data?.marcas) ? data.marcas : (Array.isArray(data) ? data : []);
  return marcas
    .map((m) => ({
      id: m.id,
      nombre: toStr(m.nombre, 'Sin marca'),
      activo: toNum(m.activo, 0),
      fecha_creacion: toStr(m.fecha_creacion),
      modelos: Array.isArray(m.modelos) ? m.modelos.map((mo) => ({
        id: mo.id,
        marca_id: mo.marca_id,
        nombre: toStr(mo.nombre, 'Sin modelo'),
        activo: toNum(mo.activo, 0),
        fecha_creacion: toStr(mo.fecha_creacion),
        generaciones: Array.isArray(mo.generaciones) ? mo.generaciones.map((g) => ({
          id: g.id,
          modelo_id: g.modelo_id,
          nombre: toStr(g.nombre, 'Sin generación'),
          descripcion: toStr(g.descripcion),
          anio_inicio: toNum(g.anio_inicio),
          anio_fin: isNullish(g.anio_fin) ? null : Number(g.anio_fin),
          total_inversion: toNum(g.total_inversion),
          total_ingresos: toNum(g.total_ingresos),
          total_egresos: toNum(g.total_egresos),
          balance_neto: toNum(g.balance_neto),
          activo: toNum(g.activo, 0),
          fecha_creacion: toStr(g.fecha_creacion),
          vehiculos: Array.isArray(g.vehiculos) ? g.vehiculos
            .map((v) => ({
              id: v.id,
              codigo_vehiculo: toStr(v.codigo_vehiculo, 'Sin código'),
              generacion_id: v.generacion_id,
              anio: toNum(v.anio),
              precio_compra: toNum(v.precio_compra),
              costo_grua: toNum(v.costo_grua),
              comisiones: toNum(v.comisiones),
              inversion_total: toNum(v.inversion_total),
              costo_recuperado: toNum(v.costo_recuperado),
              costo_pendiente: toNum(v.costo_pendiente),
              fecha_ingreso: toStr(v.fecha_ingreso),
              estado: toStr(v.estado, 'SIN_ESTADO'),
              precio_venta: isNullish(v.precio_venta) ? null : Number(v.precio_venta),
              fecha_venta: isNullish(v.fecha_venta) ? null : v.fecha_venta,
              activo: toNum(v.activo, 0),
              notas: isNullish(v.notas) ? null : String(v.notas),
              fecha_creacion: toStr(v.fecha_creacion),
              fecha_actualizacion: toStr(v.fecha_actualizacion)
            }))
            .sort((a, b) => (a.anio ?? 0) - (b.anio ?? 0))
            : []
        }))
          .sort((a, b) => (a.anio_inicio ?? 0) - (b.anio_inicio ?? 0))
          : []
      })) : []
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((m) => ({
      ...m,
      modelos: m.modelos
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
    }));
};

/**
 * Componente jerárquico
 * Fuente: vehiculoService.getVehiculosAgrupados()
 */
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

      // Guarda raw para debug
      setRawData(response);

      // Normaliza y ordena como tus queries
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

  const columnasTransacciones = useMemo(() => ([
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      width: 120,
      responsive: ['md'],
      render: (fecha) => toDateStr(fecha)
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>{toStr(text, '-')}</div>
          <div>
            <span style={{ marginRight: 8, display: 'inline-block' }}>
              {toDateStr(record?.fecha)}
            </span>
            {record?.tipo_transaccion && (
              <Tag color={record.tipo_transaccion.categoria === 'INGRESO' ? 'green' : 'red'}>
                {toStr(record.tipo_transaccion.nombre, 'Transacción')}
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
        <Text strong style={{ color: record?.tipo_transaccion?.categoria === 'INGRESO' ? 'green' : 'red' }}>
          {record?.tipo_transaccion?.categoria === 'INGRESO' ? '+' : '-'} ${toNum(monto).toLocaleString()}
        </Text>
      )
    }
  ]), []);

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
              setExpandedKeys(prev => ({ ...prev, [vehiculo.id]: !prev[vehiculo.id] }));
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
                      <Text strong>${toNum(vehiculo.inversion_total).toLocaleString()}</Text>
                    </div>
                    {toStr(vehiculo.estado).toUpperCase() === 'VENDIDO' && !isNullish(vehiculo.precio_venta) && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8em' }}><Text type="secondary">Venta</Text></div>
                        <Text strong style={{ color: 'green' }}>
                          ${toNum(vehiculo.precio_venta).toLocaleString()}
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
                        <div style={{ marginTop: 2 }}>${toNum(vehiculo.costo_grua).toLocaleString()}</div>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                      <div>
                        <Text type="secondary" style={{ fontSize: '0.85em' }}>Comisiones</Text>
                        <div style={{ marginTop: 2 }}>${toNum(vehiculo.comisiones).toLocaleString()}</div>
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

  const renderGeneracion = (generacion) => (
    <Card
      key={generacion.id}
      size="small"
      style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden' }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '12px 16px', background: '#f9f9f9', borderBottom: '1px solid #f0f0f0' }}>
        <Row gutter={[8, 8]} align="middle">
          <Col xs={24} md={12}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              <Text strong style={{ fontSize: '1em' }}>{toStr(generacion.nombre, 'Sin generación')}</Text>
              {toStr(generacion.descripcion) && (
                <Text type="secondary" style={{ fontSize: '0.9em' }}>
                  ({generacion.descripcion})
                </Text>
              )}
              <Text type="secondary" style={{ fontSize: '0.85em' }}>
                {generacion.anio_inicio ?? '-'} - {generacion.anio_fin ?? 'Actual'}
              </Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={[8, 8]}>
              <Col xs={12} sm={6}>
                <div>
                  <div style={{ fontSize: '0.75em', color: '#8c8c8c' }}>Inversión</div>
                  <div>${toNum(generacion.total_inversion).toLocaleString()}</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div>
                  <div style={{ fontSize: '0.75em', color: '#8c8c8c' }}>Ingresos</div>
                  <div style={{ color: '#52c41a' }}>${toNum(generacion.total_ingresos).toLocaleString()}</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div>
                  <div style={{ fontSize: '0.75em', color: '#8c8c8c' }}>Egresos</div>
                  <div style={{ color: '#f5222d' }}>${toNum(generacion.total_egresos).toLocaleString()}</div>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div>
                  <div style={{ fontSize: '0.75em', color: '#8c8c8c' }}>Balance</div>
                  <div
                    style={{
                      color: (toNum(generacion.balance_neto) >= 0) ? '#52c41a' : '#f5222d',
                      fontWeight: 500
                    }}
                  >
                    ${Math.abs(toNum(generacion.balance_neto)).toLocaleString()}
                    <span style={{ fontSize: '0.85em', marginLeft: 4 }}>
                      {toNum(generacion.balance_neto) < 0 ? 'Pérdida' : 'Ganancia'}
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

  const renderModelo = (modelo) => (
    <Card
      key={modelo.id}
      className="modelo-item"
      style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '12px 16px', background: '#f5f7fa', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text strong style={{ fontSize: '1.1em' }}>{toStr(modelo.nombre, 'Sin modelo')}</Text>
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

  const renderMarca = (marca) => (
    <Card
      key={marca.id}
      style={{ marginBottom: 24, borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      bodyStyle={{ padding: 0 }}
      className="marca-card"
    >
      <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <CarOutlined style={{ fontSize: '1.2em', color: '#1890ff' }} />
          <Text strong style={{ fontSize: '1.2em' }}>{toStr(marca.nombre, 'Sin marca')}</Text>
        </div>
        <div>
          <Tag color="blue" style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '0.9em', fontWeight: 500 }}>
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
            style={{ margin: '24px 0', padding: '24px 0', borderTop: '1px dashed #f0f0f0' }}
          />
        )}
      </div>
    </Card>
  );

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

      {marcas.map(marca => (
        <Card key={`marca-${marca.id}`} style={{ marginBottom: 16 }} title={toStr(marca.nombre, 'Sin marca')} extra={`${marca.modelos?.length || 0} modelos`}>
          {marca.modelos?.length > 0 ? (
            <Collapse ghost>
              {marca.modelos.map(modelo => (
                <Panel
                  key={`modelo-${modelo.id}`}
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{toStr(modelo.nombre, 'Sin modelo')}</span>
                      <span>{modelo.generaciones?.length || 0} generaciones</span>
                    </div>
                  }
                >
                  {modelo.generaciones?.length > 0 ? (
                    <Collapse ghost>
                      {modelo.generaciones.map(generacion => (
                        <Panel
                          key={`generacion-${generacion.id}`}
                          header={`${toStr(generacion.nombre, 'Sin generación')} (${generacion.anio_inicio ?? '-'} - ${generacion.anio_fin ?? 'Actual'})`}
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
