import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import finanzaService from '../../api/finanzas';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Typography, 
  Row, 
  Col, 
  Statistic,
  Tag,
  Tabs,
  Badge,
  Space,
  Menu,
  Dropdown,
  Divider,
  InputNumber,
  Input as AntdInput,
  message
} from 'antd';
import { formatCurrency } from '../../utils/formatters';
import { 
  DollarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  PlusOutlined,
  MoreOutlined,
  ReloadOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  EditOutlined,
  DeleteOutlined,
  SwapOutlined,
  FileTextOutlined,
  TransactionOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Search } = AntdInput;
const { Option } = Select;
const { TabPane } = Tabs;

const Finanzas = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    transacciones: false,
    resumen: false
  });
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: null,
    categoria: null,
    estado: null,
    rangoFechas: [moment().startOf('month'), moment().endOf('day')],
    busqueda: ''
  });
  const [tabActivo, setTabActivo] = useState('transacciones');
  const [transacciones, setTransacciones] = useState([]);
  const [resumen, setResumen] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0
  });

  // Constantes para filtros
  const categoriasIngresos = [
    'Venta de vehículo',
    'Servicio de mantenimiento',
    'Financiamiento',
    'Otros ingresos',
  ];
  
  const categoriasEgresos = [
    'Compra de vehículo',
    'Compra de repuestos',
    'Nómina',
    'Servicios',
    'Impuestos',
    'Gastos de oficina',
    'Publicidad',
    'Mantenimiento',
    'Otros gastos',
  ];
  
  const cuentas = [
    'Efectivo',
    'Caja Chica',
    'Banco Principal',
    'Tarjeta de Crédito',
    'Cuentas por Cobrar',
    'Cuentas por Pagar',
  ];
  
  const metodosPago = [
    'Efectivo',
    'Transferencia',
    'Tarjeta de crédito',
    'Tarjeta de débito',
    'Cheque',
    'Crédito',
  ];
  
  const estados = [
    { value: 'COMPLETADA', label: 'Completada', color: 'success' },
    { value: 'PENDIENTE', label: 'Pendiente', color: 'processing' },
    { value: 'CANCELADA', label: 'Cancelada', color: 'error' },
  ];
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      width: 120,
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.referencia}
          </Text>
        </div>
      ),
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
      width: 180,
      filters: [
        ...categoriasIngresos.map(cat => ({ text: cat, value: cat })),
        ...categoriasEgresos.map(cat => ({ text: cat, value: cat }))
      ],
      onFilter: (value, record) => record.categoria === value,
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      width: 150,
      render: (monto, record) => {
        const esIngreso = record.tipo === 'ingreso';
        const color = esIngreso ? '#52c41a' : '#f5222d';
        const signo = esIngreso ? '+' : '-';
        
        return (
          <Text strong style={{ color }}>
            {signo}{formatCurrency(monto)}
          </Text>
        );
      },
      sorter: (a, b) => a.monto - b.monto,
    },
    {
      title: 'Método de Pago',
      dataIndex: 'metodoPago',
      key: 'metodoPago',
      width: 150,
      filters: metodosPago.map(metodo => ({ text: metodo, value: metodo })),
      onFilter: (value, record) => record.metodoPago === value,
    },
    {
      title: 'Cuenta',
      dataIndex: 'cuenta',
      key: 'cuenta',
      width: 150,
      filters: cuentas.map(cuenta => ({ text: cuenta, value: cuenta })),
      onFilter: (value, record) => record.cuenta === value,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 130,
      render: (estado) => {
        const estadoInfo = estados.find(e => e.value === estado) || { label: 'Desconocido', color: 'default' };
        return (
          <Tag color={estadoInfo.color}>
            {estadoInfo.label}
          </Tag>
        );
      },
      filters: estados.map(estado => ({ 
        text: estado.label, 
        value: estado.value 
      })),
      onFilter: (value, record) => record.estado === value,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 50,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<FileTextOutlined />}>
                Ver detalles
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />}>
                Editar
              </Menu.Item>
              <Menu.Item key="print" icon={<DownloadOutlined />}>
                Descargar recibo
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
                Eliminar
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];
  
  // Obtener transacciones
  const obtenerTransacciones = async () => {
    try {
      setLoading(prev => ({ ...prev, transacciones: true }));
      setError(null);
      
      const { rangoFechas, busqueda, tipo, categoria, estado, searchFields } = filtros;
      const [fechaInicio, fechaFin] = rangoFechas || [null, null];
      
      // Construir parámetros de consulta
      const params = {
        tipo: tipo || undefined,
        categoria: categoria || undefined,
        estado: estado || undefined,
        fechaInicio: fechaInicio ? fechaInicio.format('YYYY-MM-DD') : undefined,
        fechaFin: fechaFin ? fechaFin.format('YYYY-MM-DD') : undefined,
        search: busqueda || undefined,
        searchFields: searchFields || undefined
      };
      
      // Limpiar parámetros undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      // Obtener transacciones
      const data = await finanzaService.getTransacciones(params);
      
      // Mapear datos de la API al formato esperado por el componente
      const transaccionesMapeadas = Array.isArray(data) ? data.map(transaccion => {
        // Determinar el tipo basado en la categoría
        const esIngreso = transaccion?.categoria === 'INGRESO';
        const tipo = esIngreso ? 'ingreso' : 'egreso';
        
        // Formatear fecha
        const fechaFormateada = transaccion?.fecha 
          ? moment(transaccion.fecha).format('DD/MM/YYYY') 
          : 'Fecha no disponible';
        
        // Obtener el monto como número
        const monto = parseFloat(transaccion?.monto) || 0;
        
        return {
          id: transaccion?.codigo_transaccion || transaccion?.id || 'N/A',
          fecha: fechaFormateada,
          descripcion: transaccion?.descripcion || 'Sin descripción',
          referencia: transaccion?.referencia || '',
          categoria: transaccion?.tipo_transaccion || transaccion?.categoria || 'Sin categoría',
          monto: monto,
          tipo: tipo,
          metodoPago: transaccion?.metodo_pago || 'No especificado',
          cuenta: transaccion?.cuenta || 'No especificada',
          estado: transaccion?.estado || 'PENDIENTE',
          // Campos adicionales para filtros
          codigo_vehiculo: transaccion?.codigo_vehiculo,
          codigo_repuesto: transaccion?.codigo_repuesto,
          marca: transaccion?.marca,
          modelo: transaccion?.modelo,
          generacion: transaccion?.generacion
        };
      }) : [];
      
      setTransacciones(transaccionesMapeadas);
      
    } catch (err) {
      console.error('Error al obtener transacciones:', err);
      const errorMessage = err?.message || 'Error al cargar las transacciones';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, transacciones: false }));
    }
  };

  // Obtener resumen financiero
  const obtenerResumenFinanciero = async () => {
    try {
      setLoading(prev => ({ ...prev, resumen: true }));
      setError(null);
      
      const { rangoFechas } = filtros;
      const [fechaInicio, fechaFin] = rangoFechas || [null, null];
      
      // Construir parámetros de consulta
      const params = {
        fechaInicio: fechaInicio ? fechaInicio.format('YYYY-MM-DD') : undefined,
        fechaFin: fechaFin ? fechaFin.format('YYYY-MM-DD') : undefined,
        estado: 'COMPLETADA' // Solo transacciones completadas para el resumen
      };
      
      // Limpiar parámetros undefined
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      // Obtener transacciones completadas para el resumen
      const transacciones = await finanzaService.getTransacciones(params);
      
      // Calcular totales
      const totales = Array.isArray(transacciones) ? transacciones.reduce((acc, t) => {
        const monto = parseFloat(t.monto) || 0;
        if (t.categoria === 'INGRESO') {
          acc.ingresos += monto;
        } else if (t.categoria === 'EGRESO') {
          acc.egresos += monto;
        }
        return acc;
      }, { ingresos: 0, egresos: 0 }) : { ingresos: 0, egresos: 0 };
      
      // Actualizar el estado con los totales
      setResumen({
        ingresos: totales.ingresos,
        egresos: totales.egresos,
        balance: totales.ingresos - totales.egresos
      });
      
    } catch (err) {
      console.error('Error al obtener resumen financiero:', err);
      const errorMessage = err?.message || 'Error al cargar el resumen financiero';
      setError(errorMessage);
      message.error(errorMessage);
      
      // Establecer valores por defecto en caso de error
      setResumen({
        ingresos: 0,
        egresos: 0,
        balance: 0
      });
    } finally {
      setLoading(prev => ({ ...prev, resumen: false }));
    }
  };

  // Cargar datos cuando cambian los filtros o la pestaña
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (tabActivo === 'transacciones') {
          await obtenerTransacciones();
        } else if (tabActivo === 'resumen') {
          await obtenerResumenFinanciero();
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        message.error('Error al cargar los datos. Por favor, intente nuevamente.');
      }
    };
    
    cargarDatos();
    
    // Limpiar el error cuando se desmonta el componente
    return () => {
      setError(null);
    };
  }, [filtros, tabActivo]);

  // Desestructurar resumen para facilitar el acceso
  const { ingresos: totalIngresos, egresos: totalEgresos, balance } = resumen;
  
  const handleSearch = (value) => {
    setFiltros(prev => ({
      ...prev,
      busqueda: value,
      searchFields: 'codigo_transaccion,descripcion,referencia,codigo_vehiculo,codigo_repuesto,marca,modelo,generacion'
    }));
  };
  
  const handleFilterChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const clearFilters = () => {
    setFiltros({
      tipo: null,
      categoria: null,
      estado: null,
      rangoFechas: [moment().startOf('month'), moment().endOf('day')],
      busqueda: ''
    });
  };
  
  const handleTabChange = (key) => {
    setTabActivo(key);
  };
  
  const handleNuevaTransaccion = (tipo) => {
    if (tipo === 'ingreso') {
      navigate('/finanzas/nueva-transaccion?tipo=INGRESO');
    } else if (tipo === 'egreso') {
      navigate('/finanzas/nueva-transaccion?tipo=EGRESO');
    } else if (tipo === 'transferencia') {
      navigate('/finanzas/transferencia');
    }
  };

  const handleEditarTransaccion = (id) => {
    navigate(`/finanzas/editar/${id}`);
  };

  const handleEliminarTransaccion = async (id) => {
    try {
      await finanzaService.deleteTransaccion(id);
      message.success('Transacción eliminada correctamente');
      await obtenerTransacciones();
    } catch (error) {
      console.error('Error al eliminar la transacción:', error);
      message.error('Error al eliminar la transacción');
    }
  };
  
  const menu = (
    <Menu>
      <Menu.Item key="ingreso" onClick={() => handleNuevaTransaccion('ingreso')}>
        <ArrowUpOutlined style={{ color: '#52c41a', marginRight: 8 }} />
        Nuevo Ingreso
      </Menu.Item>
      <Menu.Item key="egreso" onClick={() => handleNuevaTransaccion('egreso')}>
        <ArrowDownOutlined style={{ color: '#f5222d', marginRight: 8 }} />
        Nuevo Egreso
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="transferencia" onClick={() => handleNuevaTransaccion('transferencia')}>
        <SwapOutlined style={{ marginRight: 8 }} />
        Transferencia entre Cuentas
      </Menu.Item>
    </Menu>
  );

  // Mapear los datos de la API al formato esperado por la tabla
  const mapearTransacciones = (data) => {
    return data.map(transaccion => ({
      ...transaccion,
      tipo: transaccion.tipo?.toLowerCase() || '',
      estado: transaccion.estado?.toLowerCase() || ''
    }));
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>Finanzas</Title>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="primary" icon={<PlusOutlined />}>
            Nueva Transacción
          </Button>
        </Dropdown>
      </div>
      
      {/* Resumen Financiero */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Ingresos"
              value={totalIngresos}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
              suffix="CRC"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Egresos"
              value={totalEgresos}
              precision={2}
              valueStyle={{ color: '#f5222d' }}
              prefix={<ArrowDownOutlined />}
              suffix="CRC"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Balance"
              value={balance}
              precision={2}
              valueStyle={{ 
                color: balance >= 0 ? '#52c41a' : '#f5222d',
                fontWeight: 'bold'
              }}
              prefix={balance >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="CRC"
            />
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Tabs 
          defaultActiveKey="transacciones" 
          onChange={handleTabChange}
          tabBarExtraContent={
            <Space>
              <RangePicker 
                style={{ width: 250 }}
                value={filtros.rangoFechas}
                onChange={(dates) => handleFilterChange('rangoFechas', dates)}
              />
              <Select
                placeholder="Todas las categorías"
                style={{ width: 200 }}
                allowClear
                value={filtros.categoria}
                onChange={(value) => handleFilterChange('categoria', value)}
              >
                <Option value="ingresos">
                  <div style={{ fontWeight: 'bold' }}>Ingresos</div>
                </Option>
                {categoriasIngresos.map((cat, index) => (
                  <Option key={`ing-${index}`} value={cat}>
                    <div style={{ paddingLeft: '16px' }}>{cat}</div>
                  </Option>
                ))}
                <Option value="egresos">
                  <div style={{ fontWeight: 'bold' }}>Egresos</div>
                </Option>
                {categoriasEgresos.map((cat, index) => (
                  <Option key={`egr-${index}`} value={cat}>
                    <div style={{ paddingLeft: '16px' }}>{cat}</div>
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Todas las cuentas"
                style={{ width: 180 }}
                allowClear
                value={filtros.cuenta}
                onChange={(value) => handleFilterChange('cuenta', value)}
              >
                {cuentas.map((cuenta, index) => (
                  <Option key={index} value={cuenta}>{cuenta}</Option>
                ))}
              </Select>
              <Button icon={<FilterOutlined />} onClick={clearFilters}>
                Limpiar
              </Button>
            </Space>
          }
        >
          <TabPane
            tab={
              <span>
                <TransactionOutlined />
                Transacciones
              </span>
            }
            key="transacciones"
          >
            <div style={{ marginBottom: 16 }}>
              <Search
                placeholder="Buscar transacciones..."
                allowClear
                enterButton={<SearchOutlined />}
                style={{ width: 300 }}
                onSearch={handleSearch}
              />
            </div>
            
            <Table 
              columns={columns} 
              dataSource={mapearTransacciones(transacciones)} 
              rowKey="id"
              loading={loading.transacciones}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} transacciones`
              }}
              scroll={{ x: 1500 }}
              locale={{
                emptyText: error || 'No hay transacciones para mostrar'
              }}
            />
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Resumen
              </span>
            }
            key="resumen"
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={4} type="secondary">Resumen y Análisis Financiero</Title>
              <Text type="secondary">Gráficos y análisis detallados de ingresos y egresos</Text>
              <div style={{ marginTop: 24 }}>
                <img 
                  src="https://via.placeholder.com/800x400?text=Gráficos+de+Análisis+Financiero" 
                  alt="Análisis Financiero" 
                  style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                />
              </div>
            </div>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <PieChartOutlined />
                Categorías
              </span>
            }
            key="categorias"
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={4} type="secondary">Análisis por Categorías</Title>
              <Text type="secondary">Distribución de ingresos y gastos por categoría</Text>
              <div style={{ marginTop: 24 }}>
                <img 
                  src="https://via.placeholder.com/600x300?text=Gráfico+de+Categorías" 
                  alt="Análisis por Categorías" 
                  style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                />
              </div>
            </div>
          </TabPane>
          
          <TabPane
            tab={
              <span>
                <LineChartOutlined />
                Flujo de Caja
              </span>
            }
            key="flujo"
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Title level={4} type="secondary">Flujo de Caja</Title>
              <Text type="secondary">Evolución de ingresos y egresos en el tiempo</Text>
              <div style={{ marginTop: 24 }}>
                <img 
                  src="https://via.placeholder.com/800x300?text=Gráfico+de+Flujo+de+Caja" 
                  alt="Flujo de Caja" 
                  style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>
      
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button 
            type="text" 
            icon={<DownloadOutlined />}
            onClick={() => message.info('Exportando datos a Excel...')}
            loading={loading.transacciones}
          >
            Exportar a Excel
          </Button>
          <Button 
            type="text" 
            icon={<FileTextOutlined />}
            onClick={() => message.info('Generando reporte...')}
            loading={loading.transacciones}
          >
            Generar Reporte
          </Button>
        </div>
        <div>
          <Text type="secondary">
            Mostrando {transacciones.length} transacci{transacciones.length === 1 ? 'ón' : 'ones'}
            {filtros.rangoFechas && ` del ${filtros.rangoFechas[0].format('DD/MM/YYYY')} al ${filtros.rangoFechas[1].format('DD/MM/YYYY')}`}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Finanzas;
