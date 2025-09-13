// src/components/VehiculosJerarquicos.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  message,
  Input
} from 'antd';
import {
  CarOutlined,
  DownOutlined,
  UpOutlined,
  RightOutlined,
  InfoCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';

import vehiculoService from '../../api/vehiculos';
import finanzaService from '../../api/finanzas'; // Importar el servicio de finanzas
import { getTiposTransacciones } from '../../api/transacciones'; // Importar el servicio de tipos de transacciones
import generacionesAPI from '../../api/generaciones'; // ✅ NUEVO: import del API de generaciones
import { renderEstado } from '../../utils/vehicleUtils';

const { Panel } = Collapse;
const { Text } = Typography;

/* ========================= Helpers ========================= */
const isNullish = (v) => v === null || v === undefined || v === '{null}';
const toNum = (v, d = 0) => (isNullish(v) || v === '' ? d : Number(v));
const toStr = (v, d = '') => (isNullish(v) ? d : String(v));

// Formatear monto con separadores de miles y símbolo de colones
const formatMonto = (monto) => {
  if (monto === null || monto === undefined || isNaN(monto)) return '₡0';
  return `₡${parseFloat(monto).toLocaleString('es-CR')}`;
};

// Objetos para almacenar los tipos de transacciones
let categoriaPorTipoId = {};
let nombreTipoTransaccion = {};
let tiposTransaccionesCargados = false;

// Helpers para transacciones
const getCategoriaTransaccion = (record) => {
  // Primero intenta obtener la categoría del mapeo por ID
  if (record?.tipoTransaccionId && categoriaPorTipoId[record.tipoTransaccionId]) {
    return categoriaPorTipoId[record.tipoTransaccionId];
  }
  // Si no hay ID o no está en el mapeo, intenta obtener la categoría de otros campos
  return toStr(
    record?.tipo_transaccion?.categoria ?? record?.categoria ?? record?.tipo,
    ''
  ).toUpperCase();
};

const esIngreso = (record) => getCategoriaTransaccion(record) === 'INGRESO';

const getNombreTipoTransaccion = (record) => {
  // Primero intenta obtener el nombre del mapeo por ID
  if (record?.tipoTransaccionId && nombreTipoTransaccion[record.tipoTransaccionId]) {
    return nombreTipoTransaccion[record.tipoTransaccionId];
  }
  // Si no hay ID o no está en el mapeo, intenta obtener el nombre de otros campos
  return toStr(
    record?.tipo_transaccion?.nombre ?? record?.tipo_nombre ?? record?.tipo ?? 'Transacción',
    'Transacción'
  );
};

const getMontoTransaccion = (record) => {
  return Math.abs(toNum(record?.monto ?? record?.valor ?? record?.importe, 0));
};

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
/**
 * @param {any} data respuesta del servicio de vehículos agrupados (marcas->modelos->generaciones->vehículos)
 * @param {Object} genIdx índices de /generaciones: { byId:Map, byModelName:Map, byModelYears:Map }
 */
const normalizarEOrdenar = (data, genIdx = { byId: new Map(), byModelName: new Map(), byModelYears: new Map() }) => {
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

  // ✅ CORREGIDO: normGeneracion recibe el modeloId del padre para indexar bien
  const normGeneracion = (g, parentModeloId) => {
    const idGen = g.id ?? g.generacion_id;
    const modeloId = g.modelo_id ?? g.modeloId ?? parentModeloId;
    const nombre = g.nombre;

    // 1) por id
    let fromApi = !isNullish(idGen) ? genIdx.byId.get(idGen) : undefined;

    // 2) por (modeloId|nombre)
    if (!fromApi && !isNullish(modeloId) && nombre) {
      fromApi = genIdx.byModelName.get(`${modeloId}|${String(nombre).toLowerCase()}`);
    }

    // 3) por (modeloId|anioInicio|anioFin)
    if (!fromApi) {
      const aI = g.anio_inicio ?? g.anioInicio;
      const aF = g.anio_fin ?? g.anioFin;
      if (!isNullish(modeloId) && !isNullish(aI) && !isNullish(aF)) {
        fromApi = genIdx.byModelYears.get(`${modeloId}|${aI}|${aF}`);
      }
    }

    // Valores finales priorizando fromApi
    const anioInicio = !isNullish(fromApi?.anioInicio) ? fromApi.anioInicio : (g.anio_inicio ?? g.anioInicio);
    const anioFin = !isNullish(fromApi?.anioFin) ? fromApi.anioFin : (g.anio_fin ?? g.anioFin);

    const totalInversion = !isNullish(fromApi?.totalInversion) ? fromApi.totalInversion : (g.total_inversion ?? g.totalInversion);
    const totalIngresos = !isNullish(fromApi?.totalIngresos) ? fromApi.totalIngresos : (g.total_ingresos ?? g.totalIngresos);
    const totalEgresos  = !isNullish(fromApi?.totalEgresos)  ? fromApi.totalEgresos  : (g.total_egresos  ?? g.totalEgresos);
    const balanceNeto   = !isNullish(fromApi?.balanceNeto)   ? fromApi.balanceNeto   : (g.balance_neto   ?? g.balanceNeto);

    return {
      id: idGen ?? fromApi?.id,
      modelo_id: modeloId ?? fromApi?.modeloId,
      nombre: toStr(nombre ?? fromApi?.nombre, 'Sin generación'),
      descripcion: toStr(g.descripcion ?? fromApi?.descripcion, ''), // ✅ se muestra abajo
      anio_inicio: isNullish(anioInicio) ? undefined : Number(anioInicio),
      anio_fin: isNullish(anioFin) ? null : Number(anioFin),
      total_inversion: toNum(totalInversion),
      total_ingresos: toNum(totalIngresos),
      total_egresos: toNum(totalEgresos),
      balance_neto: toNum(balanceNeto),
      activo: toNum(g.activo ?? fromApi?.activo, 0),
      fecha_creacion: toStr(g.fecha_creacion ?? g.fechaCreacion ?? fromApi?.fechaCreacion),
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
    generaciones: (Array.isArray(mo.generaciones) ? mo.generaciones.map((g) => normGeneracion(g, mo.id)) : []) // ✅ pasa parentModeloId
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
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [marcas, setMarcas] = useState([]);
  const [filteredMarcas, setFilteredMarcas] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [transacciones, setTransacciones] = useState({});
  const [loadingTransacciones, setLoadingTransacciones] = useState({});
  const [showRawData, setShowRawData] = useState(false);
  const [rawData, setRawData] = useState(null);
  
  // State for search and expanded sections
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrandKeys, setActiveBrandKeys] = useState([]);
  const [expandedModelsByMarca, setExpandedModelsByMarca] = useState({});
  const [expandedGensByModelo, setExpandedGensByModelo] = useState({});
  const vehiculoRefs = useRef({});
  const [vehiculoMatchId, setVehiculoMatchId] = useState(null);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);

      // ✅ Traemos ambas fuentes en paralelo:
      // - Vehículos agrupados (estructura jerárquica)
      // - Generaciones (totales ya calculados por BD)
      const [vehResp, genResp] = await Promise.all([
        vehiculoService.getVehiculosAgrupados(),
        generacionesAPI.getAll().catch(() => null)
      ]);

      if (!vehResp) throw new Error('Respuesta vacía del servidor');

      // Soportar axios (data) o respuesta directa
      const vehData = vehResp?.data ?? vehResp;
      const gensList = genResp ? (genResp.data ?? genResp) : [];

      // 🔑 Índices por ID y claves alternativas para resolver correctamente cada generación
      const byId = new Map();
      const byModelName = new Map();   // clave: `${modeloId}|${nombreLower}`
      const byModelYears = new Map();  // clave: `${modeloId}|${anioInicio}|${anioFin}`

      gensList.forEach((g) => {
        const id = g.id;
        const modeloId = g.modeloId ?? g.modelo_id;
        const nombre = (g.nombre ?? '').toLowerCase();
        const anioInicio = g.anioInicio ?? g.anio_inicio;
        const anioFin = g.anioFin ?? g.anio_fin;

        const obj = {
          id,
          modeloId,
          nombre: g.nombre,
          descripcion: g.descripcion,
          anioInicio: toNum(anioInicio, undefined),
          anioFin: toNum(anioFin, undefined),
          totalInversion: toNum(g.totalInversion ?? g.total_inversion),
          totalIngresos: toNum(g.totalIngresos ?? g.total_ingresos),
          totalEgresos: toNum(g.totalEgresos ?? g.total_egresos),
          balanceNeto: toNum(g.balanceNeto ?? g.balance_neto),
          activo: g.activo,
          fechaCreacion: g.fechaCreacion ?? g.fecha_creacion
        };

        if (!isNullish(id)) byId.set(id, obj);
        if (!isNullish(modeloId) && nombre) byModelName.set(`${modeloId}|${nombre}`, obj);
        if (!isNullish(modeloId) && !isNullish(anioInicio) && !isNullish(anioFin)) {
          byModelYears.set(`${modeloId}|${anioInicio}|${anioFin}`, obj);
        }
      });

      setRawData({ vehiculosAgrupados: vehData, generaciones: gensList });

      // ✅ Normalizamos e INYECTAMOS los totales por generación, resolviendo por id o claves alternativas
      const datos = normalizarEOrdenar(vehData, { byId, byModelName, byModelYears });

      if (!datos.length) {
        message.info('No se encontraron vehículos para mostrar');
      }
      setMarcas(datos);
      setFilteredMarcas(datos); // Initialize filtered list with all brands
    } catch (error) {
      console.error('Error al cargar los vehículos/generaciones:', error);
      message.error(`Error al cargar los datos: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Find a vehicle by its code in the hierarchy
  const findVehiclePath = useCallback((codigo, marcasList) => {
    if (!codigo) return null;
    
    const normalizedQuery = codigo.trim().toLowerCase();
    
    for (const marca of marcasList) {
      for (const modelo of (marca.modelos || [])) {
        for (const generacion of (modelo.generaciones || [])) {
          for (const vehiculo of (generacion.vehiculos || [])) {
            const vehiculoCodigo = (vehiculo.codigo_vehiculo || '').toLowerCase();
            if (vehiculoCodigo === normalizedQuery) {
              return { marca, modelo, generacion, vehiculo };
            }
          }
        }
      }
    }
    return null;
  }, []);

  // Handle search input changes
  const handleSearch = useCallback((value) => {
    if (!value) {
      setFilteredMarcas(marcas);
      setSearchQuery('');
      return;
    }

    const query = value.trim().toLowerCase();
    setSearchQuery(query);

    // If it looks like a vehicle code (e.g., TOYA-001)
    if (/^[a-z]{2,4}-\d{2,4}$/i.test(query)) {
      const match = findVehiclePath(query, marcas);
      if (match) {
        const { marca, modelo, generacion, vehiculo } = match;
        
        // Set active brand and expand the hierarchy
        setActiveBrandKeys([`marca-${marca.id}`]);
        setExpandedModelsByMarca(prev => ({
          ...prev,
          [marca.id]: [...(prev[marca.id] || []), modelo.id]
        }));
        setExpandedGensByModelo(prev => ({
          ...prev,
          [modelo.id]: [...(prev[modelo.id] || []), generacion.id]
        }));
        
        // Expand the vehicle and scroll to it
        setTimeout(() => {
          setExpandedKeys(prev => ({ ...prev, [vehiculo.id]: true }));
          setVehiculoMatchId(vehiculo.id);
          
          // Scroll to the matched vehicle
          if (vehiculoRefs.current[vehiculo.id]) {
            vehiculoRefs.current[vehiculo.id].scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
          
          // Remove highlight after 3 seconds
          setTimeout(() => setVehiculoMatchId(null), 3000);
        }, 100);
      } else {
        message.warning(`No se encontró ningún vehículo con el código: ${query}`);
      }
    } else {
      // Filter brands by name
      const filtered = marcas.filter(marca => 
        marca.nombre.toLowerCase().includes(query)
      );
      setFilteredMarcas(filtered);
      
      // Auto-expand matching brands
      if (filtered.length > 0) {
        setActiveBrandKeys(filtered.map(m => `marca-${m.id}`));
      }
    }
  }, [marcas, findVehiclePath]);

  // Update filtered list when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMarcas(marcas);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = marcas.filter(marca => 
        marca.nombre.toLowerCase().includes(query) ||
        (marca.modelos || []).some(modelo => 
          modelo.nombre.toLowerCase().includes(query) ||
          (modelo.generaciones || []).some(generacion =>
            generacion.nombre.toLowerCase().includes(query) ||
            (generacion.vehiculos || []).some(vehiculo =>
              (vehiculo.codigo_vehiculo || '').toLowerCase().includes(query)
            )
          )
        )
      );
      setFilteredMarcas(filtered);
    }
  }, [searchQuery, marcas]);

  // Toggle brand expansion
  const toggleBrand = useCallback((marcaId) => {
    setActiveBrandKeys(prev => 
      prev.includes(`marca-${marcaId}`)
        ? prev.filter(key => key !== `marca-${marcaId}`)
        : [...prev, `marca-${marcaId}`]
    );
  }, []);

  // Toggle model expansion
  const toggleModel = useCallback((marcaId, modeloId) => {
    setExpandedModelsByMarca(prev => ({
      ...prev,
      [marcaId]: prev[marcaId]?.includes(modeloId)
        ? prev[marcaId].filter(id => id !== modeloId)
        : [...(prev[marcaId] || []), modeloId]
    }));
  }, []);

  // Toggle generation expansion
  const toggleGeneration = useCallback((modeloId, generacionId) => {
    setExpandedGensByModelo(prev => ({
      ...prev,
      [modeloId]: prev[modeloId]?.includes(generacionId)
        ? prev[modeloId].filter(id => id !== generacionId)
        : [...(prev[modeloId] || []), generacionId]
    }));
  }, []);

  useEffect(() => {
    cargarDatos(); // ✅ aquí es donde cambiamos el estado con la data fusionada
  }, [cargarDatos]);

  // Cargar tipos de transacciones al montar el componente
  useEffect(() => {
    const cargarTiposTransacciones = async () => {
      try {
        setLoadingTipos(true);
        const tipos = await getTiposTransacciones();
        
        // Actualizar los mapeos de tipos de transacción
        const nuevoCategoriaPorTipoId = {};
        const nuevoNombreTipoTransaccion = {};
        
        tipos.forEach(tipo => {
          if (tipo.activo) {
            nuevoCategoriaPorTipoId[tipo.id] = tipo.categoria;
            nuevoNombreTipoTransaccion[tipo.id] = tipo.nombre;
          }
        });
        
        categoriaPorTipoId = nuevoCategoriaPorTipoId;
        nombreTipoTransaccion = nuevoNombreTipoTransaccion;
        tiposTransaccionesCargados = true;
        
      } catch (error) {
        console.error('Error al cargar tipos de transacciones:', error);
        message.error('Error al cargar los tipos de transacciones');
      } finally {
        setLoadingTipos(false);
      }
    };

    if (!tiposTransaccionesCargados) {
      cargarTiposTransacciones();
    }
  }, []);

  // Cargar vehículos después de que los tipos de transacciones estén listos
  useEffect(() => {
    if (tiposTransaccionesCargados) {
      cargarDatos(); // ✅ recarga para asegurar fusión completa
    }
  }, [tiposTransaccionesCargados, cargarDatos]);

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

      // Ordenar por fecha (más reciente primero)
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
        const fechaTransaccion = fecha || record.fecha_transaccion || record.fechaTransaccion;
        return toDateStr(fechaTransaccion);
      }
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text, record) => {
        const descripcion = text || record.concepto || record.detalle || '-';
        const fechaTransaccion = record.fecha || record.fecha_transaccion || record.fechaTransaccion;
        const ingreso = esIngreso(record);
        
        return (
          <div>
            <div style={{ marginBottom: 4 }}>{toStr(descripcion, '-')}</div>
            <div>
              <span style={{ marginRight: 8, display: 'inline-block' }}>
                {toDateStr(fechaTransaccion)}
              </span>
              <Tag color={ingreso ? 'green' : 'red'}>
                {ingreso ? 'INGRESO' : 'EGRESO'}
              </Tag>
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
      render: (_monto, record) => {
        const ingreso = esIngreso(record);
        const monto = getMontoTransaccion(record);
        const signo = ingreso ? '+' : '-';
        
        return (
          <Text strong style={{ color: ingreso ? 'green' : 'red' }}>
            {signo} {formatMonto(monto).replace('₡', '')}
          </Text>
        );
      }
    }
  ]), []);

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

  // Render a single vehicle card
  const renderVehiculoCard = (vehiculo, generacion, modelo, marca) => {
    const estaExpandido = expandedKeys[vehiculo.id];
    const esVehiculoDestacado = vehiculoMatchId === vehiculo.id;
    
    return (
      <div 
        key={`veh-${vehiculo.id}`} 
        ref={el => (vehiculoRefs.current[vehiculo.id] = el)}
        style={{
          marginBottom: 16,
          transition: 'all 0.3s ease',
          borderLeft: esVehiculoDestacado ? '4px solid #1890ff' : '4px solid transparent',
          paddingLeft: 8,
          backgroundColor: esVehiculoDestacado ? '#f0f9ff' : 'transparent',
          borderRadius: 4
        }}
      >
        {renderVehiculo(vehiculo)}
      </div>
    );
  };

  // Render a generation with its vehicles (MOSTRAR solamente, sin cálculos)
  const renderGeneracion = (generacion, modelo, marca) => {
    const isExpanded = expandedGensByModelo[modelo.id]?.includes(generacion.id);
  
    const totalInversion = generacion.total_inversion || 0;
    const totalVentas = generacion.total_ingresos || 0;
    const totalEgresos = generacion.total_egresos || 0;
    const balanceNeto = generacion.balance_neto || 0;
  
    const balanceColor = balanceNeto > 0 ? '#52c41a' : balanceNeto < 0 ? '#f5222d' : 'inherit';
  
    const genName = generacion.nombre || 'Sin nombre';
    const years = `${generacion.anio_inicio || '?'}-${isNullish(generacion.anio_fin) ? 'Actual' : generacion.anio_fin}`;
    const descripcion = generacion.descripcion || '';
  
    return (
      <div key={`gen-${generacion.id}`} style={{ marginBottom: 16 }}>
        <div
          onClick={() => toggleGeneration(modelo.id, generacion.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 16px',
            background: '#f9f9f9',
            borderRadius: 4,
            cursor: 'pointer',
            marginBottom: 8,
            borderLeft: '3px solid #1890ff',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: '1.05em' }}>{genName}</Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>({years})</Text>
            </div>
            <div style={{ textAlign: 'right', marginRight: 24 }}>
              <div style={{ fontSize: '0.85em', color: '#666' }}>Vehículos</div>
              <Text strong>{generacion.vehiculos?.length || 0}</Text>
            </div>
            {isExpanded ? <UpOutlined style={{ marginLeft: 8 }} /> : <DownOutlined style={{ marginLeft: 8 }} />}
          </div>

          {/* ✅ Descripción de la generación (solo mostrar, viene del API) */}
          {descripcion && (
            <div style={{ marginTop: 2 }}>
              <Text type="secondary" style={{ fontSize: '0.9em' }}>{descripcion}</Text>
            </div>
          )}
  
          {/* Resumen financiero: SOLO mostrar lo del endpoint */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px dashed #e8e8e8'
          }}>
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '0.8em', color: '#666' }}>Inversión</div>
              <div style={{ fontWeight: 500 }}>{formatMonto(totalInversion)}</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '0.8em', color: '#666' }}>Ingresos</div>
              <div style={{ color: '#52c41a', fontWeight: 500 }}>{formatMonto(totalVentas)}</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '0.8em', color: '#666' }}>Egresos</div>
              <div style={{ color: '#f5222d', fontWeight: 500 }}>{formatMonto(totalEgresos)}</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '100px' }}>
              <div style={{ fontSize: '0.8em', color: '#666' }}>Balance Neto</div>
              <div style={{ color: balanceColor, fontWeight: 700 }}>{formatMonto(balanceNeto)}</div>
            </div>
          </div>
        </div>
  
        {isExpanded && generacion.vehiculos?.length > 0 && (
          <div style={{ marginLeft: 16 }}>
            {generacion.vehiculos.map(vehiculo =>
              renderVehiculoCard(vehiculo, generacion, modelo, marca)
            )}
          </div>
        )}
      </div>
    );
  };

  // Render a model with its generations
  const renderModelo = (modelo, marca) => {
    const isExpanded = expandedModelsByMarca[marca.id]?.includes(modelo.id);
    
    return (
      <div key={`mod-${modelo.id}`} style={{ marginBottom: 16 }}>
        <div 
          onClick={() => toggleModel(marca.id, modelo.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            background: '#f0f0f0',
            borderRadius: 4,
            cursor: 'pointer',
            marginBottom: 8
          }}
        >
          <div style={{ flex: 1 }}>
            <Text strong>{modelo.nombre || 'Sin modelo'}</Text>
          </div>
          <div>
            <Text type="secondary">
              {modelo.generaciones?.length || 0} generación{modelo.generaciones?.length !== 1 ? 'es' : ''}
            </Text>
            {isExpanded ? <UpOutlined style={{ marginLeft: 8 }} /> : <DownOutlined style={{ marginLeft: 8 }} />}
          </div>
        </div>
        
        {isExpanded && modelo.generaciones?.length > 0 && (
          <div style={{ marginLeft: 16 }}>
            {modelo.generaciones.map(generacion => 
              renderGeneracion(generacion, modelo, marca)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading || loadingTipos || !tiposTransaccionesCargados) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '300px', padding: '40px 20px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
          {loading ? 'Cargando vehículos...' : 
           loadingTipos ? 'Cargando tipos de transacciones...' : 
           'Inicializando...'}
        </div>
      </div>
    );
  }

  return (
    <div className="vehiculos-jerarquicos">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h1>Vehículos</h1>
            <Text type="secondary">Vista jerárquica de vehículos agrupados por marca, modelo y generación</Text>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input.Search
              placeholder="Buscar por marca, modelo o código..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              style={{ width: 300 }}
              onChange={(e) => handleSearch(e.target.value)}
              value={searchQuery}
            />
            {rawData && (
              <Button onClick={() => setShowRawData(!showRawData)} icon={<InfoCircleOutlined />}>
                {showRawData ? 'Ocultar datos' : 'Ver datos'}
              </Button>
            )}
          </div>
        </div>
        
        {showRawData && (
          <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 4, maxHeight: 400, overflow: 'auto' }}>
            <pre style={{ margin: 0 }}>{JSON.stringify(rawData, null, 2)}</pre>
          </div>
        )}
      </div>

      {filteredMarcas.length > 0 ? (
        <Collapse 
          activeKey={activeBrandKeys}
          onChange={(keys) => setActiveBrandKeys(keys)}
          expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
          style={{ background: 'transparent', border: 'none' }}
          className="marcas-collapse"
        >
          {filteredMarcas.map((marca) => (
            <Panel 
              key={`marca-${marca.id}`}
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <Text strong>{marca.nombre || 'Sin marca'}</Text>
                  <div>
                    <Text type="secondary" style={{ marginRight: 24 }}>
                      {marca.modelos?.length || 0} modelo{marca.modelos?.length !== 1 ? 's' : ''}
                    </Text>
                  </div>
                </div>
              }
              style={{
                background: '#fff',
                marginBottom: 16,
                borderRadius: 4,
                border: '1px solid #f0f0f0',
                overflow: 'hidden'
              }}
            >
              {marca.modelos?.length > 0 ? (
                <div style={{ marginLeft: 8 }}>
                  {marca.modelos.map(modelo => renderModelo(modelo, marca))}
                </div>
              ) : (
                <Empty 
                  description="No hay modelos para esta marca" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  style={{ margin: '16px 0' }}
                />
              )}
            </Panel>
          ))}
        </Collapse>
      ) : (
        <Card>
          <Empty 
            description={
              <span>
                <InfoCircleOutlined style={{ marginRight: 4 }} />
                No se encontraron vehículos que coincidan con la búsqueda
              </span>
            } 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        </Card>
      )}
    </div>
  );
};

export default VehiculosJerarquicos;
