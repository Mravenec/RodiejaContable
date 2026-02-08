import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, Typography, Divider, message } from 'antd';
import { 
  CarOutlined, 
  DollarOutlined, 
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BarChartOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Loading } from '../components/Loading';
import { dashboardService } from '../api';
import vehiculoService from '../api/vehiculos';
import ventasEmpleadosService from '../api/ventasEmpleados'; // Importar como en VentasReportes.js
import { formatCurrency } from '../utils/formatters';

console.log('=== DASHBOARD.JS IMPORTADO ===');
console.log('Versión Dashboard.js:', '1.0.0');

const { Title, Text } = Typography;

const Dashboard = () => {
  console.log('=== DASHBOARD COMPONENT MONTADO ===');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalVentas: 0,
    totalVehiculos: 0,
    totalRepuestos: 0,
    totalClientes: 0,
    totalEgresos: 0,
    margenBeneficio: 0,
    roiPromedio: 0,
    ventasMensuales: [],
    vehiculosMasVendidos: [],
    repuestosMasVendidos: [],
    comisiones: [],
    vehiculosActivos: [],
    repuestosCriticos: []
  });
  
  // Fetch dashboard data
  useEffect(() => {
    console.log('=== useEffect INICIADO ===');
    const fetchDashboardData = async () => {
      try {
        console.log('=== INICIANDO fetchDashboardData ===');
        setLoading(true);
        
        // Fetch dashboard stats
        console.log('Fetching dashboard stats...');
        const stats = await dashboardService.getDashboardStats();
        console.log('Dashboard stats obtenidos:', stats);
        
        // Fetch additional data in parallel
        console.log('Fetching datos adicionales en paralelo...');
        const [
          ventasMensuales, 
          vehiculosMasVendidos, 
          repuestosMasVendidos,
          comisiones,
          vehiculosActivos,
          repuestosCriticos
        ] = await Promise.all([
          dashboardService.getVentasMensuales(),
          dashboardService.getVehiculosMasVendidos(),
          dashboardService.getRepuestosMasVendidos(),
          ventasEmpleadosService.getVentasPorEmpleado(), // Usar mismo servicio que VentasReportes.js
          vehiculoService.getVehiculosActivos(),
          dashboardService.getAlertasInventario()
        ]);
        
        console.log('Datos adicionales obtenidos:', {
          ventasMensuales: ventasMensuales?.length || 0,
          vehiculosMasVendidos: vehiculosMasVendidos?.length || 0,
          repuestosMasVendidos: repuestosMasVendidos?.length || 0,
          comisiones: comisiones?.length || 0,
          vehiculosActivos: vehiculosActivos?.length || 0,
          repuestosCriticos: repuestosCriticos?.length || 0
        });

        // Logging detallado de comisiones
        if (comisiones && comisiones.length > 0) {
          console.log('=== ESTRUCTURA DE COMISIONES ===');
          console.log('Primera comisión:', comisiones[0]);
          console.log('Campos disponibles:', Object.keys(comisiones[0]));
          
          // Filtrar solo empleados con ventas reales (transacciones > 0)
          const comisionesConVentas = comisiones.filter(c => 
            (c.totalTransacciones || c.total_transacciones || 0) > 0
          );
          console.log('Comisiones con ventas reales:', comisionesConVentas.length);
          
          // Actualizar el estado con los datos filtrados
          setDashboardData({
            ...stats,
            ventasMensuales: Array.isArray(ventasMensuales) ? ventasMensuales : [],
            vehiculosMasVendidos: Array.isArray(vehiculosMasVendidos) ? vehiculosMasVendidos : [],
            repuestosMasVendidos: Array.isArray(repuestosMasVendidos) ? repuestosMasVendidos : [],
            comisiones: Array.isArray(comisionesConVentas) ? comisionesConVentas : [], // Usar datos filtrados
            vehiculosActivos: Array.isArray(vehiculosActivos) ? vehiculosActivos : [],
            repuestosCriticos: Array.isArray(repuestosCriticos) ? repuestosCriticos : []
          });
        } else {
          console.log('=== NO HAY DATOS DE COMISIONES ===');
          setDashboardData({
            ...stats,
            ventasMensuales: Array.isArray(ventasMensuales) ? ventasMensuales : [],
            vehiculosMasVendidos: Array.isArray(vehiculosMasVendidos) ? vehiculosMasVendidos : [],
            repuestosMasVendidos: Array.isArray(repuestosMasVendidos) ? repuestosMasVendidos : [],
            comisiones: Array.isArray(comisiones) ? comisiones : [],
            vehiculosActivos: Array.isArray(vehiculosActivos) ? vehiculosActivos : [],
            repuestosCriticos: Array.isArray(repuestosCriticos) ? repuestosCriticos : []
          });
        }
      } catch (error) {
        console.error('=== ERROR EN fetchDashboardData ===', error);
        console.error('Error completo:', error);
        message.error('Error al cargar datos del dashboard');
      } finally {
        console.log('=== fetchDashboardData FINALIZADO ===');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  const {
    totalVentas: ingresosTotales,
    totalEgresos: egresosTotales,
    totalVehiculos,
    totalRepuestos,
    ventasMensuales,
    vehiculosMasVendidos,
    repuestosMasVendidos,
    comisiones: ventasPorEmpleado,
    vehiculosActivos,
    repuestosCriticos
  } = dashboardData;
  
  // Calcular valores derivados
  const balance = ingresosTotales - egresosTotales;
  const vehiculosEnVenta = vehiculosActivos?.filter(v => v.estado === 'DISPONIBLE').length || 0;
  const repuestosBajoStock = repuestosCriticos?.length || 0;
  
  // Calcular estadísticas de ventas reales
const ahora = new Date();
const anioActual = ahora.getFullYear();
const mesActual = ahora.getMonth() + 1; // Los meses van de 1-12
console.log('🔥 AÑO/MES ACTUAL BUSCADO:', anioActual, mesActual);

// Buscar el mes actual en los datos - CORREGIDO: buscar por año y mes por separado
const ventasMesActual = ventasMensuales.find(v => {
  console.log(`🔥 Verificando registro: anio=${v.anio}, mes=${v.mes} ¿Coincide con ${anioActual}/${mesActual}? ${v.anio === anioActual && v.mes === mesActual}`);
  return v.anio === anioActual && v.mes === mesActual;
});

// Buscar el mes anterior en los datos
let anioAnterior = anioActual;
let mesAnterior = mesActual - 1;
if (mesAnterior === 0) {
  mesAnterior = 12;
  anioAnterior = anioActual - 1;
}

const mesAnteriorData = ventasMensuales.find(v => {
  console.log(`🔥 Verificando mes anterior: anio=${v.anio}, mes=${v.mes} ¿Coincide con ${anioAnterior}/${mesAnterior}? ${v.anio === anioAnterior && v.mes === mesAnterior}`);
  return v.anio === anioAnterior && v.mes === mesAnterior;
});

// Calcular ventas de empleados del mes actual
const ventasEmpleadosMesActual = ventasPorEmpleado
  .filter(v => v.totalVentas > 0)
  .reduce((total, empleado) => total + empleado.totalVentas, 0);

// Calcular ventas de empleados del mes anterior (simulado - necesitaríamos datos históricos)
const ventasEmpleadosMesAnterior = 0; // Por ahora 0 hasta tener datos históricos

console.log('🔥 VENTAS MENSUALES COMPLETAS:', ventasMensuales);
console.log('🔥 VENTAS MES ACTUAL ENCONTRADO:', ventasMesActual);
console.log('🔥 VENTAS MES ANTERIOR ENCONTRADO:', mesAnteriorData);
console.log('🔥 VENTAS POR EMPLEADO:', ventasPorEmpleado);
console.log('🔥 SUMA VENTAS EMPLEADOS MES ACTUAL:', ventasEmpleadosMesActual);

// ✅ CORRECCIÓN: Usar ventas de empleados en lugar de ingresos totales
const estadisticasVentas = {
  ingresos_mes_actual: ventasMesActual?.totalIngresosNetos || 0,  // ← Ingresos completos
  egresos_mes_actual: ventasMesActual?.totalEgresos || 0,        // ← Egresos completos
  ventas_mes_actual: ventasEmpleadosMesActual || 0,              // ← VENTAS REALES DE EMPLEADOS
  vehiculos_vendidos_mes: ventasMesActual?.vehiculosVendidos || 0, // ← Vehículos vendidos
  repuestos_vendidos_mes: ventasMesActual?.repuestosVendidos || 0, // ← Repuestos vendidos
  variacion_ventas: ventasEmpleadosMesAnterior > 0 ? 
    ((ventasEmpleadosMesActual || 0) - ventasEmpleadosMesAnterior) / ventasEmpleadosMesAnterior * 100 : 0
};

// Log para debugging (opcional - puedes eliminarlo en producción)
console.log('=== ESTADÍSTICAS DE VENTAS ===');
console.log('Año/mes actual buscado:', anioActual, mesActual);
console.log('Año/mes anterior buscado:', anioAnterior, mesAnterior);
console.log('Datos mes actual encontrados:', ventasMesActual);
console.log('Datos mes anterior encontrados:', mesAnteriorData);
console.log('Ventas empleados mes actual:', ventasEmpleadosMesActual);
console.log('Estadísticas calculadas:', estadisticasVentas);


  return (
    <div className="dashboard-container" style={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
      <Title level={2} style={{ marginBottom: '24px', fontSize: { xs: '20px', sm: '24px' } }}>Panel de Control</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
            <Statistic
              title="Vehículos en Inventario"
              value={totalVehiculos}
              prefix={<CarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ fontSize: { xs: '18px', sm: '22px', md: '24px' } }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">{vehiculosEnVenta} disponibles para venta</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
            <Statistic
              title="Repuestos en Inventario"
              value={totalRepuestos}
              prefix={<ToolOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ fontSize: { xs: '18px', sm: '22px', md: '24px' } }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type={repuestosBajoStock > 0 ? 'danger' : 'secondary'}>
                {repuestosBajoStock} con stock bajo
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
            <Statistic
              title="Ingresos Totales"
              value={ingresosTotales}
              precision={2}
              valueStyle={{ 
                color: '#52c41a',
                fontSize: { xs: '18px', sm: '22px', md: '24px' }
              }}
              prefix={<DollarOutlined />}
              formatter={value => formatCurrency(value)}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="success">
                Último mes: {formatCurrency(estadisticasVentas.ingresos_mes_actual || 0)}
              </Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}>
            <Statistic
              title="Egresos Totales"
              value={egresosTotales}
              precision={2}
              valueStyle={{ 
                color: '#f5222d',
                fontSize: { xs: '18px', sm: '22px', md: '24px' }
              }}
              prefix={<DollarOutlined />}
              formatter={value => formatCurrency(value)}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="danger">
                Último mes: {formatCurrency(estadisticasVentas.egresos_mes_actual || 0)}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Balance General"
            bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}
          >
            <div style={{ textAlign: 'center' }}>
              <Statistic
                title="Balance Actual"
                value={balance}
                precision={2}
                valueStyle={{
                  color: balance >= 0 ? '#52c41a' : '#f5222d',
                  fontSize: { xs: '20px', sm: '22px', md: '24px' },
                  marginBottom: '16px'
                }}
                prefix={balance >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                formatter={value => formatCurrency(value)}
              />
              <div style={{ marginTop: 16 }}>
                <Text type={balance >= 0 ? 'success' : 'danger'}>
                  {balance >= 0 ? 'Ganancias' : 'Pérdidas'}: {formatCurrency(Math.abs(balance))}
                </Text>
              </div>
              
              <Divider style={{ margin: { xs: '12px 0', sm: '16px 0' } }} />
              
              <Row gutter={[8, 16]}>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Vehículos más vendidos"
                    value={vehiculosMasVendidos.length}
                    valueStyle={{ fontSize: { xs: '18px', sm: '20px', md: '22px' } }}
                    prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                  />
                  <div style={{ marginTop: 8, textAlign: 'left', paddingLeft: 8 }}>
                    {vehiculosMasVendidos.length > 0 ? (
                      vehiculosMasVendidos.slice(0, 3).map((item, index) => (
                        <div key={index} style={{ marginBottom: 4 }}>
                          <Text 
                            ellipsis={{ tooltip: `${item.nombre || item.codigo_vehiculo || 'Sin nombre'} (${item.cantidad || 1})` }}
                            style={{ 
                              maxWidth: '100%', 
                              display: 'inline-block',
                              fontSize: { xs: '12px', sm: '14px' }
                            }}
                          >
                            {item.nombre || item.codigo_vehiculo || 'Sin nombre'} ({item.cantidad || 1})
                          </Text>
                        </div>
                      ))
                    ) : (
                      <Text type="secondary" style={{ fontSize: { xs: '12px', sm: '14px' } }}>
                        No hay vehículos vendidos
                      </Text>
                    )}
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Repuestos más vendidos"
                    value={repuestosMasVendidos.length}
                    valueStyle={{ fontSize: { xs: '18px', sm: '20px', md: '22px' } }}
                    prefix={<ToolOutlined style={{ color: '#722ed1' }} />}
                  />
                  <div style={{ marginTop: 8, textAlign: 'left', paddingLeft: 8 }}>
                    {repuestosMasVendidos.length > 0 ? (
                      repuestosMasVendidos.slice(0, 3).map((item, index) => (
                        <div key={index} style={{ marginBottom: 4 }}>
                          <Text 
                            ellipsis={{ tooltip: `${item.nombre || item.descripcion || item.parte_vehiculo || 'Sin descripción'} (${item.cantidad || 1})` }}
                            style={{ 
                              maxWidth: '100%', 
                              display: 'inline-block',
                              fontSize: { xs: '12px', sm: '14px' }
                            }}
                          >
                            {item.nombre || item.descripcion || item.parte_vehiculo || 'Sin descripción'} ({item.cantidad || 1})
                          </Text>
                        </div>
                      ))
                    ) : (
                      <Text type="secondary" style={{ fontSize: { xs: '12px', sm: '14px' } }}>
                        No hay repuestos vendidos
                      </Text>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title="Comisiones del Mes"
            bodyStyle={{ padding: { xs: '12px', sm: '16px', md: '24px' } }}
          >
            {ventasPorEmpleado && ventasPorEmpleado.length > 0 ? (
              <div>
                {ventasPorEmpleado.map((comision, index) => (
                  <div key={index} style={{ 
                    marginBottom: 12,
                    padding: { xs: '8px', sm: '12px' },
                    backgroundColor: { xs: '#f9f9f9', sm: 'transparent' },
                    borderRadius: '4px'
                  }}>
                    <Row gutter={[8, 8]} align="middle">
                      <Col xs={24} sm={10}>
                        <UserOutlined style={{ marginRight: 8 }} />
                        <Text strong style={{ fontSize: { xs: '13px', sm: '14px' } }}>
                          {comision.empleado || comision.nombreEmpleado || comision.nombre_empleado || 'Empleado'}
                        </Text>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Text strong style={{ fontSize: { xs: '12px', sm: '14px' } }}>
                          {comision.totalTransacciones || comision.total_transacciones || 0} {window.innerWidth < 576 ? 'trans.' : 'transacciones'}
                        </Text>
                      </Col>
                      <Col xs={12} sm={8} style={{ textAlign: { xs: 'right', sm: 'left' } }}>
                        <Text type="success" style={{ fontSize: { xs: '13px', sm: '14px' } }}>
                          {formatCurrency(comision.totalComisiones || comision.total_comision || 0)}
                        </Text>
                      </Col>
                      <Col xs={24}>
                        <Text type="secondary" style={{ fontSize: { xs: '12px', sm: '13px' } }}>
                          Ventas: {formatCurrency(comision.totalVentas || comision.total_ventas || 0)}
                        </Text>
                      </Col>
                    </Row>
                  </div>
                ))}
              </div>
            ) : (
              <Text type="secondary">No hay datos de comisiones disponibles</Text>
            )}
            
            <Divider style={{ margin: { xs: '12px 0', sm: '16px 0' } }} />
            
            <div>
              <Title level={5} style={{ marginBottom: 16, fontSize: { xs: '16px', sm: '18px' } }}>
                Estadísticas de Ventas
              </Title>
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Card size="small" bodyStyle={{ padding: '12px 16px' }}>
                    <Statistic
                      title="Ventas del Mes"
                      value={estadisticasVentas.ventas_mes_actual || 0}
                      prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                      valueStyle={{ 
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 500
                      }}
                      formatter={value => formatCurrency(value)}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card size="small" bodyStyle={{ padding: '12px 16px' }}>
                    <Statistic
                      title="Vehículos Vendidos"
                      value={estadisticasVentas.vehiculos_vendidos_mes || 0}
                      prefix={<CarOutlined style={{ color: '#1890ff' }} />}
                      valueStyle={{ 
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 500
                      }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card size="small" bodyStyle={{ padding: '12px 16px' }}>
                    <Statistic
                      title="Repuestos Vendidos"
                      value={estadisticasVentas.repuestos_vendidos_mes || 0}
                      prefix={<ToolOutlined style={{ color: '#722ed1' }} />}
                      valueStyle={{ 
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 500
                      }}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Text type="secondary">
                    Comparación con el mes anterior: {estadisticasVentas.variacion_ventas || 0}%
                    {estadisticasVentas.variacion_ventas > 0 ? (
                      <ArrowUpOutlined style={{ color: '#52c41a', marginLeft: 4 }} />
                    ) : estadisticasVentas.variacion_ventas < 0 ? (
                      <ArrowDownOutlined style={{ color: '#f5222d', marginLeft: 4 }} />
                    ) : null}
                  </Text>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16, marginBottom: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '16px',
                fontWeight: 500
              }}>
                <span>Acciones Rápidas</span>
              </div>
            }
            headStyle={{
              borderBottom: 'none',
              padding: '16px 24px',
              backgroundColor: '#fafafa',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px'
            }}
            bodyStyle={{
              padding: '16px 24px',
              backgroundColor: '#fff',
              borderBottomLeftRadius: '8px',
              borderBottomRightRadius: '8px'
            }}
            style={{
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
              border: '1px solid #f0f0f0',
              borderRadius: '8px'
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ 
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}
                  bodyStyle={{
                    padding: '16px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                  }}
                  onClick={() => navigate('/vehiculos/nuevo')}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#e6f7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <CarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  </div>
                  <div style={{ 
                    fontWeight: 500,
                    fontSize: '15px',
                    color: 'rgba(0, 0, 0, 0.85)'
                  }}>
                    Agregar Vehículo
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ 
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}
                  bodyStyle={{
                    padding: '16px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                  }}
                  onClick={() => navigate('/inventario/nuevo')}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#f9f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <ToolOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                  </div>
                  <div style={{ 
                    fontWeight: 500,
                    fontSize: '15px',
                    color: 'rgba(0, 0, 0, 0.85)'
                  }}>
                    Agregar Repuesto
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ 
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}
                  bodyStyle={{
                    padding: '16px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                  }}
                  onClick={() => navigate('/finanzas/nueva-transaccion')}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#f6ffed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <DollarOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  </div>
                  <div style={{ 
                    fontWeight: 500,
                    fontSize: '15px',
                    color: 'rgba(0, 0, 0, 0.85)'
                  }}>
                    Nueva Transacción
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card 
                  hoverable 
                  style={{ 
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '120px'
                  }}
                  bodyStyle={{
                    padding: '16px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                  }}
                  onClick={() => navigate('/reportes')}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#e6fffb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <BarChartOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />
                  </div>
                  <div style={{ 
                    fontWeight: 500,
                    fontSize: '15px',
                    color: 'rgba(0, 0, 0, 0.85)'
                  }}>
                    Ver Reportes
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
