import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import VentasEmpleadosService from '../../api/ventasEmpleados';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
  Avatar,
  Progress,
  Tag
} from 'antd';
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
    cargarDatosIniciales();
  }, []);
  
  const cargarDatosIniciales = async () => {
    try {
      // Cargar métricas generales
      setLoading(prev => ({ ...prev, metricas: true }));
      const estadisticas = await VentasEmpleadosService.getEstadisticasVentas();
      setMetricas({
        totalVentas: estadisticas.totalVentas || 0,
        totalIngresos: estadisticas.totalIngresos || 0,
        promedioVenta: estadisticas.promedioVenta || 0,
        vehiculosStock: estadisticas.vehiculosStock || 0,
        tasaConversion: estadisticas.tasaConversion || 0,
      });
      
      // Cargar ventas mensuales
      setLoading(prev => ({ ...prev, ventasMensuales: true }));
      const ventasMensualesData = await VentasEmpleadosService.getVentasMensuales(anioActual);
      setVentasMensuales(ventasMensualesData);
      
      // Cargar top empleados
      setLoading(prev => ({ ...prev, topEmpleados: true }));
      const topEmpleadosData = await VentasEmpleadosService.getTopEmpleados(5);
      setTopEmpleados(topEmpleadosData);
      
      // Cargar ventas recientes
      setLoading(prev => ({ ...prev, ventasRecientes: true }));
      const ventasRecientesData = await VentasEmpleadosService.getVentasPorEmpleado({
        limite: 5,
        ordenarPor: 'fecha',
        orden: 'desc'
      });
      setVentasRecientes(ventasRecientesData);
      
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
      const filtros = {
        formato,
        fechaInicio: rangoFechas?.[0] ? format(rangoFechas[0], 'yyyy-MM-dd') : null,
        fechaFin: rangoFechas?.[1] ? format(rangoFechas[1], 'yyyy-MM-dd') : null,
        tipo: filtroTipo !== 'todos' ? filtroTipo : null,
        estado: filtroEstado !== 'todos' ? filtroEstado : null
      };
      
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
                  <Select defaultValue="2023" style={{ width: 120 }}>
                    {[anioActual, anioActual - 1, anioActual - 2].map(anio => (
                      <Option key={anio} value={anio}>{anio}</Option>
                    ))}
                  </Select>
                }
              >
                <div style={{ height: '300px', textAlign: 'center' }}>
                  <div style={{ textAlign: 'center', color: '#8c8c8c', margin: '20px 0' }}>
                    <BarChartOutlined style={{ fontSize: 60, opacity: 0.3 }} />
                    <p>Gráfico de ventas mensuales</p>
                  </div>
                </div>
                <Table 
                  columns={[
                    { title: 'Mes', dataIndex: 'mes', key: 'mes' },
                    { 
                      title: 'Ventas', 
                      dataIndex: 'ventas', 
                      key: 'ventas',
                      sorter: (a, b) => a.ventas - b.ventas,
                    },
                    { 
                      title: 'Monto Total', 
                      dataIndex: 'monto', 
                      key: 'monto',
                      render: (monto) => `$${(monto || 0).toLocaleString('es-CR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`,
                      sorter: (a, b) => (a.monto || 0) - (b.monto || 0),
                    },
                  ]} 
                  dataSource={ventasMensuales} 
                  size="small"
                  pagination={false}
                  rowKey="mes"
                />
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
                      <Text>{empleado.nombre}</Text>
                      <Text strong>{empleado.totalVentas || 0} ventas</Text>
                    </div>
                    <Progress 
                      percent={empleado.porcentaje || 0} 
                      showInfo={false} 
                      strokeColor={index % 2 === 0 ? '#1890ff' : '#52c41a'}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ${(empleado.montoTotal || 0).toLocaleString('es-CR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{empleado.porcentaje || 0}% del total</Text>
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
