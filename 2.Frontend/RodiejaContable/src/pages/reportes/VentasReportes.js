import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Typography, 
  Button, 
  Space,
  Statistic,
  Select,
  DatePicker,
  Tag,
  message,
  Spin,
  Empty,
  Modal,
  Form,
  InputNumber,
  Input
} from 'antd';
import { 
  ShoppingCartOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  FileTextOutlined,
  PrinterOutlined,
  UserOutlined,
  BarChartOutlined,
  DollarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  InboxOutlined
} from '@ant-design/icons';
import moment from 'moment';
import ventasEmpleadosService from '../../api/ventasEmpleados';
import { formatCurrency } from '../../utils/formatters';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const VentasReportes = () => {
  // Estados para datos y carga
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [empleados, setEmpleados] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [loading, setLoading] = useState({
    ventas: false,
    estadisticas: false,
    empleados: false,
    exportar: false
  });
  const [filtros, setFiltros] = useState({
    fechaInicio: null,
    fechaFin: null,
    estado: 'todos',
    vendedor: null,
    busqueda: '',
    tipoProducto: null
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Tipos de productos y estados
  const tiposProducto = [
    { value: 'VEHICULO', label: 'Vehículo' },
    { value: 'REPUESTO', label: 'Repuesto' },
    { value: 'SERVICIO', label: 'Servicio' }
  ];

  const estadosVenta = [
    { value: 'completado', label: 'Completado', color: 'success' },
    { value: 'pendiente', label: 'Pendiente', color: 'processing' },
    { value: 'cancelado', label: 'Cancelado', color: 'error' },
    { value: 'reembolsado', label: 'Reembolsado', color: 'warning' }
  ];
  
  // Columnas para la tabla de ventas por empleado
  const columnsVentasEmpleados = [
    {
      title: 'Empleado',
      dataIndex: 'empleado',
      key: 'empleado',
      render: (text) => <Text strong>{text}</Text>,
      width: 150,
      fixed: 'left',
      sorter: (a, b) => a.empleado.localeCompare(b.empleado)
    },
    {
      title: 'Total Transacciones',
      dataIndex: 'totalTransacciones',
      key: 'totalTransacciones',
      align: 'center',
      sorter: (a, b) => a.totalTransacciones - b.totalTransacciones,
      width: 120
    },
    {
      title: 'Ventas',
      dataIndex: 'transaccionesVenta',
      key: 'transaccionesVenta',
      align: 'center',
      sorter: (a, b) => a.transaccionesVenta - b.transaccionesVenta,
      width: 100
    },
    {
      title: 'Total Ventas',
      dataIndex: 'totalVentas',
      key: 'totalVentas',
      render: (value) => (
        <Text strong>₡{new Intl.NumberFormat('es-CR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value)}</Text>
      ),
      align: 'right',
      sorter: (a, b) => a.totalVentas - b.totalVentas,
      width: 150
    },
    {
      title: 'Comisiones',
      dataIndex: 'totalComisiones',
      key: 'totalComisiones',
      render: (value) => (
        <Text type={value > 0 ? 'success' : 'default'}>
          {value !== null ? `₡${new Intl.NumberFormat('es-CR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value)}` : 'N/A'}
        </Text>
      ),
      align: 'right',
      sorter: (a, b) => (a.totalComisiones || 0) - (b.totalComisiones || 0),
      width: 150
    },
    {
      title: 'Promedio Venta',
      dataIndex: 'promedioVenta',
      key: 'promedioVenta',
      render: (value) => (
        <Text>₡{new Intl.NumberFormat('es-CR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value || 0)}</Text>
      ),
      align: 'right',
      sorter: (a, b) => (a.promedioVenta || 0) - (b.promedioVenta || 0),
      width: 150
    },
    {
      title: '% Comisión',
      dataIndex: 'porcentajeComision',
      key: 'porcentajeComision',
      render: (value) => (
        <Text>{value !== null ? `${value.toFixed(2)}%` : 'N/A'}</Text>
      ),
      align: 'right',
      sorter: (a, b) => (a.porcentajeComision || 0) - (b.porcentajeComision || 0),
      width: 120
    }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Efecto para cargar datos cuando cambian los filtros
  useEffect(() => {
    cargarVentas();
    cargarEstadisticas();
  }, [filtros, pagination.current, pagination.pageSize]);

  // Función para cargar datos iniciales
  const cargarDatosIniciales = async () => {
    try {
      setLoading(prev => ({ ...prev, empleados: true }));
      const [empleadosRes] = await Promise.all([
        ventasEmpleadosService.getEmpleadosConVentas()
      ]);
      setEmpleados(empleadosRes);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      message.error('Error al cargar datos iniciales');
    } finally {
      setLoading(prev => ({ ...prev, empleados: false }));
    }
  };

  // Función para cargar ventas por empleado con filtros
  const cargarVentas = async () => {
    try {
      setLoading(prev => ({ ...prev, ventas: true }));
      
      const params = {};

      // Si hay fechas, las formateamos
      if (filtros.fechaInicio && filtros.fechaFin) {
        params.fechaInicio = filtros.fechaInicio.format('YYYY-MM-DD');
        params.fechaFin = filtros.fechaFin.format('YYYY-MM-DD');
      }

      // Cargar datos de ventas por empleado
      const response = await ventasEmpleadosService.getVentasPorEmpleado(params);
      
      // Filtrar empleados sin ventas si es necesario
      const datosFiltrados = response.filter(emp => emp.totalTransacciones > 0);
      
      setVentas(datosFiltrados);
      setPagination({
        ...pagination,
        total: datosFiltrados.length
      });
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      message.error('Error al cargar las ventas');
    } finally {
      setLoading(prev => ({ ...prev, ventas: false }));
    }
  };

  // Función para cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      setLoading(prev => ({ ...prev, estadisticas: true }));
      const params = {};
      
      if (filtros.fechaInicio && filtros.fechaFin) {
        params.fechaInicio = filtros.fechaInicio.format('YYYY-MM-DD');
        params.fechaFin = filtros.fechaFin.format('YYYY-MM-DD');
      }
      
      if (filtros.vendedor) {
        params.vendedorId = filtros.vendedor;
      }
      
      const data = await ventasEmpleadosService.getEstadisticasVentas(params);
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      message.error('Error al cargar estadísticas');
    } finally {
      setLoading(prev => ({ ...prev, estadisticas: false }));
    }
  };

  // Manejador de cambio de página
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  // Aplicar filtros
  const aplicarFiltros = (values) => {
    setFiltros(prev => ({
      ...prev,
      ...values
    }));
    setPagination(prev => ({
      ...prev,
      current: 1 // Volver a la primera página al aplicar nuevos filtros
    }));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: null,
      fechaFin: null,
      estado: 'todos',
      vendedor: null,
      busqueda: '',
      tipoProducto: null
    });
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0
    });
  };

  // Exportar a Excel
  const exportarAExcel = async () => {
    try {
      setLoading(prev => ({ ...prev, exportar: true }));
      
      const response = await ventasEmpleadosService.exportarReporteExcel();
      
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-ventas-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Reporte exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar el reporte:', error);
      message.error('Error al exportar el reporte');
    } finally {
      setLoading(prev => ({ ...prev, exportar: false }));
    }
  };

  // Exportar reporte
  const exportarReporte = async (formato) => {
    try {
      setLoading(prev => ({ ...prev, exportando: true }));
      
      const params = { ...filtros, formato };
      
      // Formatear fechas para la exportación
      if (params.fechaInicio && params.fechaFin) {
        params.fechaInicio = params.fechaInicio.format('YYYY-MM-DD');
        params.fechaFin = params.fechaFin.format('YYYY-MM-DD');
        delete params.rangoFechas; // Eliminar el rango si existe
      }
      
      const blob = await ventasEmpleadosService.exportarReporte(formato, params);
      
      // Crear enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-ventas-${moment().format('YYYYMMDD-HHmmss')}.${formato}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success(`Reporte exportado exitosamente como ${formato.toUpperCase()}`);
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      message.error('Error al exportar el reporte');
    } finally {
      setLoading(prev => ({ ...prev, exportando: false }));
    }
  };

  // Ver detalle de venta
  const verDetalleVenta = (venta) => {
    form.setFieldsValue({
      ...venta,
      fecha: moment(venta.fecha),
      vendedor: venta.vendedor?.nombreCompleto,
      cliente: venta.cliente?.nombreCompleto,
      montoTotal: formatCurrency(venta.montoTotal)
    });
    setModalVisible(true);
  };

  // Obtener métricas de las estadísticas
  const totalVentas = estadisticas?.totalVentas || 0;
  const totalIngresos = estadisticas?.ingresosTotales || 0;
  const ventasCompletadas = estadisticas?.ventasCompletadas || 0;
  const tasaConversion = estadisticas?.tasaConversion || 0;
  const promedioVenta = estadisticas?.promedioVenta || 0;
  const totalClientes = estadisticas?.totalClientes || 0;

  return (
    <div className="ventas-reportes">
      {/* Encabezado */}
      <div className="page-header">
        <Title level={3}>
          <BarChartOutlined style={{ marginRight: 8 }} />
          Reportes de Ventas
        </Title>
        <Space>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={() => exportarReporte('excel')}
            loading={loading.exportando}
            disabled={loading.ventas}
          >
            Exportar a Excel
          </Button>
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={() => exportarReporte('pdf')}
            loading={loading.exportando}
            disabled={loading.ventas}
          >
            Imprimir Reporte
          </Button>
        </Space>
      </div>
      
      {/* Filtros */}
      <Card 
        className="filtros-card" 
        title={
          <Space>
            <FilterOutlined />
            <span>Filtros de Búsqueda</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <div className="filter-label">Rango de fechas:</div>
            <RangePicker 
              style={{ width: '100%' }} 
              value={[filtros.fechaInicio, filtros.fechaFin]}
              onChange={(dates) => {
                if (dates && dates.length === 2) {
                  aplicarFiltros({ 
                    fechaInicio: dates[0], 
                    fechaFin: dates[1] 
                  });
                } else {
                  aplicarFiltros({ 
                    fechaInicio: null, 
                    fechaFin: null 
                  });
                }
              }}
              format="DD/MM/YYYY"
              allowClear
            />
          </Col>
          
          <Col xs={24} md={6}>
            <div className="filter-label">Vendedor:</div>
            <Select
              style={{ width: '100%' }}
              placeholder="Seleccionar vendedor"
              value={filtros.vendedor}
              onChange={(value) => aplicarFiltros({ vendedor: value })}
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              loading={loading.empleados}
            >
              <Option value={null}>Todos los vendedores</Option>
              {empleados.map(empleado => (
                <Option key={empleado.id} value={empleado.id}>
                  {empleado.nombreCompleto}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={24} md={6}>
            <div className="filter-label">Estado:</div>
            <Select
              style={{ width: '100%' }}
              value={filtros.estado}
              onChange={(value) => aplicarFiltros({ estado: value })}
            >
              <Option value="todos">Todos los estados</Option>
              {estadosVenta.map(estado => (
                <Option key={estado.value} value={estado.value}>
                  {estado.label}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={24} md={6}>
            <div className="filter-label">Tipo de producto:</div>
            <Select
              style={{ width: '100%' }}
              placeholder="Todos los tipos"
              value={filtros.tipoProducto}
              onChange={(value) => aplicarFiltros({ tipoProducto: value })}
              allowClear
            >
              <Option value={null}>Todos los tipos</Option>
              {tiposProducto.map(tipo => (
                <Option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </Option>
              ))}
            </Select>
          </Col>
          
          <Col xs={24} md={18}>
            <div className="filter-label">Buscar:</div>
            <Search
              placeholder="Buscar por ID, cliente, producto, etc."
              allowClear
              enterButton="Buscar"
              value={filtros.busqueda}
              onChange={(e) => aplicarFiltros({ busqueda: e.target.value })}
              onSearch={(value) => aplicarFiltros({ busqueda: value })}
              loading={loading.ventas}
            />
          </Col>
          
          <Col xs={24} md={6} style={{ display: 'flex', gap: '8px', marginTop: 24 }}>
            <Button 
              type="default" 
              icon={<ReloadOutlined />}
              onClick={limpiarFiltros}
              block
              disabled={loading.ventas}
            >
              Limpiar Filtros
            </Button>
          </Col>
        </Row>
      </Card>
      
      {/* Métricas principales */}
      <Spin spinning={loading.estadisticas}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ventas Totales"
                value={totalVentas}
                prefix={<ShoppingCartOutlined style={{ color: '#1890ff', marginRight: 8 }} />}
                suffix={totalVentas === 1 ? 'unidad' : 'unidades'}
                valueStyle={{ color: '#1890ff', fontSize: '1.5rem' }}
                loading={loading.estadisticas}
                formatter={value => new Intl.NumberFormat('es-CR').format(value)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ingresos Totales"
                value={totalIngresos}
                precision={2}
                prefix="₡"
                valueStyle={{ color: '#52c41a', fontSize: '1.5rem' }}
                loading={loading.estadisticas}
                formatter={value => new Intl.NumberFormat('es-CR', {
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(value)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ventas Completadas"
                value={ventasCompletadas}
                prefix={<CheckCircleOutlined style={{ color: '#722ed1', marginRight: 8 }} />}
                valueStyle={{ color: '#722ed1', fontSize: '1.5rem' }}
                loading={loading.estadisticas}
                formatter={value => new Intl.NumberFormat('es-CR').format(value)}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tasa de Conversión"
                value={tasaConversion}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#fa8c16', fontSize: '1.5rem' }}
                loading={loading.estadisticas}
                formatter={value => new Intl.NumberFormat('es-CR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(value)}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
      
      {/* Tabla de ventas */}
      <Card 
        title={
          <Space>
            <TeamOutlined />
            <span>Ventas por Empleado</span>
            {filtros.vendedor && (
              <Tag color="blue">
                Filtrado por: {empleados.find(e => e.id === filtros.vendedor)?.nombreCompleto || 'Vendedor'}
              </Tag>
            )}
          </Space>
        }
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={exportarAExcel}
              loading={loading.exportar}
            >
              Exportar
            </Button>
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setModalVisible(true)}
            >
              Filtros
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={cargarDatosIniciales}
              loading={loading.ventas}
            >
              Actualizar
            </Button>
          </Space>
        }
      >
        <Table
          columns={columnsVentasEmpleados}
          dataSource={ventas}
          rowKey="empleado"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`
          }}
          onChange={handleTableChange}
          loading={loading.ventas}
          scroll={{ x: 1000 }}
          bordered
          size="middle"
          locale={{
            emptyText: (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={
                  <span>
                    <InboxOutlined style={{ fontSize: 20, color: '#999', marginRight: 8 }} />
                    No hay datos de ventas por empleado
                  </span>
                }
              />
            )
          }}
        />
      </Card>

      {/* Modal para ver detalles de venta */}
      <Modal
        title="Detalle de Venta"
        visible={!!ventaSeleccionada}
        onCancel={() => setVentaSeleccionada(null)}
        footer={null}
        width={700}
      >
        <Form
          layout="vertical"
          initialValues={ventaSeleccionada || {}}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="ID de Venta" name="id">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Fecha" name="fecha">
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Vendedor" name={['vendedor', 'nombreCompleto']}>
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Cliente" name={['cliente', 'nombreCompleto']}>
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="Monto Total" name="montoTotal">
            <Input 
              readOnly 
              style={{ fontWeight: 'bold' }} 
              prefix="₡"
              value={ventaSeleccionada?.montoTotal ? new Intl.NumberFormat('es-CR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(ventaSeleccionada.montoTotal) : '0.00'}
            />
          </Form.Item>
          
          <Form.Item label="Estado" name="estado">
            <Input readOnly />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Estilos */}
      <style jsx global>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .filter-label {
          margin-bottom: 4px;
          font-weight: 500;
        }
        
        .ventas-table-card :global(.ant-card-head) {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .ventas-table-card :global(.ant-table-thead > tr > th) {
          background: #fafafa;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .ventas-table-card :global(.ant-table) {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default VentasReportes;
