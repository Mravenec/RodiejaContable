import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import VentasEmpleadosService from '../../api/ventasEmpleados';
import { getTransaccionesIngresos } from '../../api/transacciones';
import { format } from 'date-fns';
import { 
  Card, 
  Tabs, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  Typography, 
  Space,
  Statistic,
  Progress,
  Tag
} from 'antd';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChartOutlined, 
  PieChartOutlined, 
  LineChartOutlined, 
  DollarOutlined, 
  CarOutlined, 
  ShoppingCartOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Reportes = () => {
  const [loading, setLoading] = useState({
    ventasMensuales: false,
    topEmpleados: false,
    ventasRecientes: false,
    metricas: false
  });
  const [rangoFechas, setRangoFechas] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [anioActual] = useState(new Date().getFullYear());
  
  // Estados para los datos de la API
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [topEmpleados, setTopEmpleados] = useState([]);
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [metricas, setMetricas] = useState({
    totalVentas: 0,
    totalIngresos: 0,
    promedioVenta: 0,
    vehiculosStock: 0,
    tasaConversion: 0,
  });
  
  // Cargar datos iniciales
  useEffect(() => {
    console.log('Cargando datos iniciales...');
    cargarDatosIniciales();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const cargarDatosIniciales = async () => {
    try {
      console.log('Iniciando carga de datos...');
      
      // Cargar métricas generales
      setLoading(prev => ({ ...prev, metricas: true }));
      try {
        const estadisticas = await VentasEmpleadosService.getEstadisticasVentas();
        console.log('Métricas cargadas:', estadisticas);
        setMetricas({
          totalVentas: estadisticas.totalVentas || 0,
          totalIngresos: estadisticas.totalIngresos || 0,
          promedioVenta: estadisticas.promedioVenta || 0,
          vehiculosStock: estadisticas.vehiculosStock || 0,
          tasaConversion: estadisticas.tasaConversion || 0,
        });
      } catch (error) {
        console.error('Error al cargar métricas:', error);
        // Usar valores por defecto si hay un error
        setMetricas({
          totalVentas: 0,
          totalIngresos: 0,
          promedioVenta: 0,
          vehiculosStock: 0,
          tasaConversion: 0,
        });
      }
      
      // Cargar ventas mensuales con manejo de error 404
      setLoading(prev => ({ ...prev, ventasMensuales: true }));
      try {
        // Usar el endpoint de transacciones de ingresos para obtener datos más detallados
        const transaccionesData = await getTransaccionesIngresos();
        console.log('Transacciones de ingresos crudas:', transaccionesData);
        
        // Agrupar transacciones por mes
        const transaccionesAgrupadasPorMes = agruparTransaccionesPorMes(transaccionesData);
        console.log('Transacciones agrupadas por mes:', transaccionesAgrupadasPorMes);
        
        setVentasMensuales(Array.isArray(transaccionesAgrupadasPorMes) ? transaccionesAgrupadasPorMes : []);
      } catch (error) {
        console.error('Error al cargar ventas mensuales:', error);
        message.warning('No se pudieron cargar los datos de ventas mensuales');
        setVentasMensuales([]);
      }
      
      // Cargar top empleados
      setLoading(prev => ({ ...prev, topEmpleados: true }));
      try {
        const topEmpleadosData = await VentasEmpleadosService.getTopEmpleados(5);
        console.log('Top empleados cargados:', topEmpleadosData);
        
        // Calcular porcentajes reales
        const empleadosConPorcentajes = calcularPorcentajes(topEmpleadosData);
        console.log('Empleados con porcentajes calculados:', empleadosConPorcentajes);
        
        setTopEmpleados(Array.isArray(empleadosConPorcentajes) ? empleadosConPorcentajes : []);
      } catch (error) {
        console.error('Error al cargar top empleados:', error);
        setTopEmpleados([]);
      }
      
      // Cargar ventas recientes
      setLoading(prev => ({ ...prev, ventasRecientes: true }));
      try {
        const ventasRecientesData = await VentasEmpleadosService.getVentasPorEmpleado({
          limite: 5,
          ordenarPor: 'fecha',
          orden: 'desc'
        });
        console.log('Ventas recientes cargadas:', ventasRecientesData);
        setVentasRecientes(Array.isArray(ventasRecientesData) ? ventasRecientesData : []);
      } catch (error) {
        console.error('Error al cargar ventas recientes:', error);
        setVentasRecientes([]);
      }
      
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      message.error('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading({
        ventasMensuales: false,
        topEmpleados: false,
        ventasRecientes: false,
        metricas: false
      });
    }
  };
  
  const columnsVentas = [
    {
      title: 'ID Venta',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
    },
    {
      title: 'Vehículo',
      dataIndex: 'vehiculo',
      key: 'vehiculo',
    },
    {
      title: 'Vendedor',
      dataIndex: 'vendedor',
      key: 'vendedor',
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => (
        <Text strong>
          ${(monto || 0).toLocaleString('es-CR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        const estadoConfig = {
          completado: { color: 'success', text: 'Completado' },
          pendiente: { color: 'processing', text: 'Pendiente' },
          cancelado: { color: 'error', text: 'Cancelado' },
        };
        
        const config = estadoConfig[estado] || { color: 'default', text: estado };
        
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
  ];
  
  const aplicarFiltros = async () => {
    try {
      setLoading({
        ventasMensuales: true,
        topEmpleados: true,
        ventasRecientes: true,
        metricas: true
      });
      
      const filtros = {};
      
      if (rangoFechas && rangoFechas[0] && rangoFechas[1]) {
        filtros.fechaInicio = format(rangoFechas[0], 'yyyy-MM-dd');
        filtros.fechaFin = format(rangoFechas[1], 'yyyy-MM-dd');
      }
      
      if (filtroTipo !== 'todos') {
        filtros.tipo = filtroTipo;
      }
      
      if (filtroEstado !== 'todos') {
        filtros.estado = filtroEstado;
      }
      
      // Aplicar filtros a las consultas
      const [ventasMensualesData, topEmpleadosData, ventasRecientesData, estadisticas] = await Promise.all([
        VentasEmpleadosService.getVentasMensuales(anioActual, filtros),
        VentasEmpleadosService.getTopEmpleados(5, filtros),
        VentasEmpleadosService.getVentasPorEmpleado({
          ...filtros,
          limite: 5,
          ordenarPor: 'fecha',
          orden: 'desc'
        }),
        VentasEmpleadosService.getEstadisticasVentas(filtros)
      ]);
      
      setVentasMensuales(ventasMensualesData);
      setTopEmpleados(topEmpleadosData);
      setVentasRecientes(ventasRecientesData);
      setMetricas({
        totalVentas: estadisticas.totalVentas || 0,
        totalIngresos: estadisticas.totalIngresos || 0,
        promedioVenta: estadisticas.promedioVenta || 0,
        vehiculosStock: estadisticas.vehiculosStock || 0,
        tasaConversion: estadisticas.tasaConversion || 0,
      });
      
      message.success('Filtros aplicados correctamente');
    } catch (error) {
      console.error('Error al aplicar filtros:', error);
      message.error('Error al aplicar los filtros. Por favor, intente nuevamente.');
    } finally {
      setLoading({
        ventasMensuales: false,
        topEmpleados: false,
        ventasRecientes: false,
        metricas: false
      });
    }
  };
  
  const limpiarFiltros = async () => {
    setRangoFechas(null);
    setFiltroTipo('todos');
    setFiltroEstado('todos');
    
    // Recargar datos sin filtros
    await cargarDatosIniciales();
    message.success('Filtros limpiados correctamente');
  };
  
  const exportarReporte = async (formato) => {
    try {
      // const filtros = {
      //   formato,
      //   fechaInicio: rangoFechas?.[0] ? format(rangoFechas[0], 'yyyy-MM-dd') : null,
      //   fechaFin: rangoFechas?.[1] ? format(rangoFechas[1], 'yyyy-MM-dd') : null,
      //   tipo: filtroTipo !== 'todos' ? filtroTipo : null,
      //   estado: filtroEstado !== 'todos' ? filtroEstado : null
      // };
      
      // Aquí iría la lógica para generar el reporte
      // Por ahora, solo mostramos un mensaje
      message.loading({ content: `Generando reporte en formato ${formato.toUpperCase()}...`, key: 'exportar' });
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success({ content: `Reporte generado en formato ${formato.toUpperCase()}`, key: 'exportar' });
      
      // En una implementación real, aquí se descargaría el archivo
      // window.open(`/api/exportar-reporte?${new URLSearchParams(filtros)}`, '_blank');
      
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      message.error({ content: 'Error al generar el reporte', key: 'exportar' });
    }
  };
  
  // Función para calcular porcentajes de ventas
  const calcularPorcentajes = (empleados) => {
    if (!Array.isArray(empleados) || empleados.length === 0) {
      return empleados;
    }
    
    // Calcular el total de ventas de todos los empleados
    const totalVentas = empleados.reduce((total, emp) => {
      return total + (emp.totalTransacciones || emp.transaccionesVenta || 0);
    }, 0);
    
    console.log('Total de ventas para calcular porcentajes:', totalVentas);
    
    // Calcular el porcentaje para cada empleado
    return empleados.map(emp => {
      const ventasEmpleado = emp.totalTransacciones || emp.transaccionesVenta || 0;
      const porcentaje = totalVentas > 0 ? Math.round((ventasEmpleado / totalVentas) * 100) : 0;
      
      console.log(`Empleado ${emp.empleado || emp.nombre}: ${ventasEmpleado} ventas, ${porcentaje}%`);
      
      return {
        ...emp,
        porcentaje: porcentaje
      };
    });
  };
  
  // Función para agrupar transacciones por mes
  const agruparTransaccionesPorMes = (transacciones) => {
    console.log('Agrupando transacciones por mes. Datos recibidos:', transacciones);
    console.log('Tipo de datos:', typeof transacciones);
    console.log('Longitud:', transacciones?.length);
    
    if (!Array.isArray(transacciones) || transacciones.length === 0) {
      console.log('No hay transacciones para agrupar');
      return [];
    }
    
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const agrupado = {};
    
    // Agrupar por mes
    transacciones.forEach((transaccion, index) => {
      console.log(`Procesando transacción ${index + 1}:`, transaccion);
      
      // Extraer mes de la fecha de la transacción
      const fechaTransaccion = transaccion.fecha || transaccion.createdAt;
      console.log(`Fecha extraída: ${fechaTransaccion}`);
      
      if (fechaTransaccion) {
        const fecha = new Date(fechaTransaccion);
        const mesNum = fecha.getMonth() + 1; // getMonth() devuelve 0-11, necesitamos 1-12
        const mesNombre = meses[mesNum - 1];
        const anio = fecha.getFullYear();
        
        console.log(`Transacción del mes ${mesNum} (${mesNombre}) ${anio}`);
        
        if (!agrupado[mesNum]) {
          agrupado[mesNum] = {
            mes: mesNum,
            nombreMes: mesNombre,
            anio: anio,
            totalTransacciones: 0,
            totalVentas: 0,
            totalIngresos: 0,
            totalComisiones: 0
          };
        }
        
        // Sumar valores de la transacción
        const monto = transaccion.monto || 0;
        const comision = transaccion.comision || transaccion.comisionEmpleado || 0;
        
        agrupado[mesNum].totalTransacciones += 1;
        agrupado[mesNum].totalVentas += 1; // Cada transacción es una venta
        agrupado[mesNum].totalIngresos += monto;
        agrupado[mesNum].totalComisiones += comision;
        
        console.log(`Valores sumados - Monto: ${monto}, Comisión: ${comision}`);
      } else {
        console.warn(`Transacción ${index + 1} no tiene fecha válida:`, transaccion);
      }
    });
    
    // Convertir a array y ordenar por mes
    const resultado = Object.values(agrupado).sort((a, b) => a.mes - b.mes);
    console.log('Resultado agrupado por mes:', resultado);
    
    return resultado;
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3}>Reportes y Análisis</Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => exportarReporte('excel')}>
            Exportar a Excel
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => exportarReporte('pdf')}>
            Generar PDF
          </Button>
        </Space>
      </div>
      
      {/* Filtros */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <div>Rango de fechas:</div>
            <RangePicker 
              style={{ width: '100%' }} 
              value={rangoFechas}
              onChange={setRangoFechas}
            />
          </Col>
          <Col xs={24} md={6}>
            <div>Tipo de reporte:</div>
            <Select 
              style={{ width: '100%' }} 
              value={filtroTipo}
              onChange={setFiltroTipo}
            >
              <Option value="todos">Todos los reportes</Option>
              <Option value="ventas">Ventas</Option>
              <Option value="inventario">Inventario</Option>
              <Option value="financiero">Financiero</Option>
              <Option value="clientes">Clientes</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <div>Estado:</div>
            <Select 
              style={{ width: '100%' }} 
              value={filtroEstado}
              onChange={setFiltroEstado}
            >
              <Option value="todos">Todos los estados</Option>
              <Option value="completado">Completados</Option>
              <Option value="pendiente">Pendientes</Option>
              <Option value="cancelado">Cancelados</Option>
            </Select>
          </Col>
          <Col xs={24} md={6} style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <Button 
              type="primary" 
              icon={<FilterOutlined />}
              onClick={aplicarFiltros}
              block
            >
              Aplicar Filtros
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={limpiarFiltros}
            />
          </Col>
        </Row>
      </Card>
      
      {/* Métricas principales */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }} loading={loading.metricas}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ventas Totales"
              value={metricas.totalVentas}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              suffix="unidades"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Ingresos Totales"
              value={metricas.totalIngresos}
              precision={2}
              prefix="₡"
              suffix=""
              prefixCls="ant-statistic-content-value"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Vehículos en Stock"
              value={metricas.vehiculosStock}
              prefix={<CarOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tasa de Conversión"
              value={metricas.tasaConversion}
              suffix="%"
              prefix={<DollarOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Pestañas de reportes */}
      <Tabs defaultActiveKey="resumen" loading={loading.ventasMensuales || loading.topEmpleados || loading.ventasRecientes}>
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Resumen General
            </span>
          }
          key="resumen"
        >
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={16}>
              <Card 
                title="Ventas Mensuales" 
                extra={
                  <Select 
                    defaultValue="2023" 
                    style={{ width: 120 }}
                    onChange={async (value) => {
                      try {
                        setLoading(prev => ({ ...prev, ventasMensuales: true }));
                        // Usar el endpoint de transacciones de ingresos
                        const transaccionesData = await getTransaccionesIngresos();
                        console.log('Transacciones de ingresos para año seleccionado:', transaccionesData);
                        
                        // Filtrar por año si es necesario y agrupar por mes
                        const transaccionesFiltradas = transaccionesData.filter(transaccion => {
                          const fechaTransaccion = transaccion.fecha || transaccion.createdAt;
                          if (fechaTransaccion) {
                            const fecha = new Date(fechaTransaccion);
                            return fecha.getFullYear() === parseInt(value);
                          }
                          return false;
                        });
                        
                        const transaccionesAgrupadasPorMes = agruparTransaccionesPorMes(transaccionesFiltradas);
                        console.log('Transacciones agrupadas por mes:', transaccionesAgrupadasPorMes);
                        
                        setVentasMensuales(Array.isArray(transaccionesAgrupadasPorMes) ? transaccionesAgrupadasPorMes : []);
                      } catch (error) {
                        console.error(`Error al cargar ventas para el año ${value}:`, error);
                        message.warning(`No se pudieron cargar los datos para el año ${value}`);
                        setVentasMensuales([]);
                      } finally {
                        setLoading(prev => ({ ...prev, ventasMensuales: false }));
                      }
                    }}
                  >
                    {Array.from({length: 6}, (_, i) => {
                      const anio = new Date().getFullYear() - i;
                      return (
                        <Option key={anio} value={anio.toString()}>{anio}</Option>
                      );
                    })}
                  </Select>
                }
              >
                {ventasMensuales.length > 0 ? (
                  <div>
                    <div style={{ height: '300px', marginBottom: 16 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={ventasMensuales}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="nombreMes" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip 
                            formatter={(value, name) => {
                              if (name === 'totalTransacciones') {
                                return [`${value} ventas`, 'Ventas'];
                              }
                              if (name === 'totalIngresos') {
                                return [`₡${value.toLocaleString('es-CR')}`, 'Ingresos'];
                              }
                              return [value, name];
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="totalTransacciones" 
                            fill="#1890ff" 
                            name="Ventas"
                          />
                          <Bar 
                            dataKey="totalIngresos" 
                            fill="#52c41a" 
                            name="Ingresos"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <Table 
                      dataSource={ventasMensuales}
                      columns={[
                        { 
                          title: 'Mes', 
                          dataIndex: 'mes', 
                          key: 'mes',
                          render: (text, record) => {
                            // Intentar obtener el mes desde diferentes campos de fecha
                            const fechaVenta = record.fecha || record.fechaTransaccion || record.createdAt;
                            
                            if (fechaVenta) {
                              const fecha = new Date(fechaVenta);
                              const mesNum = fecha.getMonth() + 1;
                              const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                              return meses[mesNum - 1];
                            }
                            
                            // Fallback a los campos existentes
                            const nombreMes = record.nombreMes || record.mesNombre || record.mes;
                            if (nombreMes !== undefined && nombreMes !== null) {
                              if (typeof nombreMes === 'number') {
                                const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                                            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                                return meses[nombreMes - 1] || `Mes ${nombreMes}`;
                              }
                              return nombreMes;
                            }
                            
                            return text ? `Mes ${text}` : 'Sin datos';
                          }
                        },
                        { 
                          title: 'Total Ventas', 
                          dataIndex: 'totalTransacciones', 
                          key: 'totalTransacciones',
                          render: (value, record) => {
                            // Usar el mismo campo que funciona en Top Vendedores
                            const totalVentas = record.totalTransacciones || record.transaccionesVenta || 0;
                            return totalVentas > 0 ? totalVentas.toLocaleString('es-CR') : '0';
                          },
                          sorter: (a, b) => (a.totalTransacciones || 0) - (b.totalTransacciones || 0),
                        },
                        { 
                          title: 'Ingresos Totales', 
                          dataIndex: 'totalIngresos', 
                          key: 'totalIngresos',
                          render: (value) => `₡${(value || 0).toLocaleString('es-CR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}`,
                          sorter: (a, b) => (a.totalIngresos || 0) - (b.totalIngresos || 0),
                        },
                        { 
                          title: 'Año', 
                          dataIndex: 'anio', 
                          key: 'anio',
                        }
                      ]}
                      size="small"
                      pagination={false}
                      rowKey={(record) => `${record.mes}-${record.anio}`}
                    />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#8c8c8c' }}>
                    <BarChartOutlined style={{ fontSize: 40, opacity: 0.5 }} />
                    <p>No hay datos disponibles</p>
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Top Vendedores">
                <div style={{ height: '300px', marginBottom: 16, textAlign: 'center' }}>
                  <div style={{ textAlign: 'center', color: '#8c8c8c', margin: '20px 0' }}>
                    <PieChartOutlined style={{ fontSize: 60, opacity: 0.3 }} />
                    <p>Distribución de ventas por vendedor</p>
                  </div>
                </div>
                {topEmpleados.map((empleado, index) => (
                  <div key={empleado.id || index} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>{empleado.empleado || empleado.nombre || 'Empleado'}</Text>
                      <Text strong>{empleado.totalTransacciones || empleado.transaccionesVenta || 0} ventas</Text>
                    </div>
                    <Progress 
                      percent={empleado.porcentaje || 0} 
                      showInfo={false} 
                      strokeColor={index % 2 === 0 ? '#1890ff' : '#52c41a'}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ₡{(empleado.totalVentas || empleado.totalIngresos || 0).toLocaleString('es-CR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {empleado.porcentaje || 0}% del total
                      </Text>
                    </div>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>
          
          <Card title="Ventas Recientes" style={{ marginTop: 16 }}>
            <Table 
              columns={columnsVentas} 
              dataSource={ventasRecientes} 
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          </Card>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <PieChartOutlined />
              Inventario
            </span>
          }
          key="inventario"
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4}>Reportes de Inventario</Title>
            <Text type="secondary">Análisis de niveles de inventario, rotación y más</Text>
            <div style={{ marginTop: 24 }}>
              <img 
                src="https://via.placeholder.com/800x400?text=Reportes+de+Inventario" 
                alt="Reportes de Inventario" 
                style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
              />
            </div>
          </div>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Financiero
            </span>
          }
          key="financiero"
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4}>Reportes Financieros</Title>
            <Text type="secondary">Estados financieros, flujo de caja y análisis de rentabilidad</Text>
            <div style={{ marginTop: 24 }}>
              <img 
                src="https://via.placeholder.com/800x400?text=Reportes+Financieros" 
                alt="Reportes Financieros" 
                style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
              />
            </div>
          </div>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              Rendimiento
            </span>
          }
          key="rendimiento"
        >
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4}>Rendimiento y Métricas</Title>
            <Text type="secondary">Métricas de rendimiento, KPI y análisis comparativos</Text>
            <div style={{ marginTop: 24 }}>
              <img 
                src="https://via.placeholder.com/800x400?text=Métricas+de+Rendimiento" 
                alt="Métricas de Rendimiento" 
                style={{ maxWidth: '100%', border: '1px solid #f0f0f0', borderRadius: '8px' }}
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Reportes;
