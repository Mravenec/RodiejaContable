import React, { useState, useEffect, useCallback } from 'react';
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
  Input
} from 'antd';
import { 
  ShoppingCartOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  PrinterOutlined,
  BarChartOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import moment from 'moment';
import ventasEmpleadosService from '../../api/ventasEmpleados';
import { useVistaExcelMesActual, useVistaExcelMesEspecifico, useGenerarReporteVentasExcel } from '../../hooks/useReportes';
import * as XLSX from 'xlsx';

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
  const [vistaExcelMes, setVistaExcelMes] = useState(new Date().getMonth() + 1); // Mes actual (1-12)
  const [vistaExcelAnio, setVistaExcelAnio] = useState(new Date().getFullYear()); // Año actual
  const [loading, setLoading] = useState({
    ventas: false,
    estadisticas: false,
    empleados: false,
    exportar: false,
    exportandoExcel: false
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
        <Text strong>
          {value !== null && value !== undefined 
            ? `₡${new Intl.NumberFormat('es-CR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(value)}`
            : '₡0.00'}
        </Text>
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
          {value !== null && value !== undefined 
            ? `₡${new Intl.NumberFormat('es-CR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(value)}` 
            : 'N/A'}
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
        <Text>
          {value !== null && value !== undefined 
            ? `₡${new Intl.NumberFormat('es-CR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(value)}`
            : '₡0.00'}
        </Text>
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
        <Text>{value !== null && value !== undefined ? `${Number(value).toFixed(2)}%` : 'N/A'}</Text>
      ),
      align: 'right',
      sorter: (a, b) => (a.porcentajeComision || 0) - (b.porcentajeComision || 0),
      width: 120
    }
  ];

  // Función para cargar datos iniciales
  const cargarDatosIniciales = useCallback(async () => {
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
  }, []);

  // Función para cargar ventas por empleado con filtros
  const cargarVentas = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, ventas: true }));
      
      const params = {};

      // Si hay fechas, las formateamos
      if (filtros.fechaInicio && filtros.fechaFin) {
        params.fechaInicio = filtros.fechaInicio.format('YYYY-MM-DD');
        params.fechaFin = filtros.fechaFin.format('YYYY-MM-DD');
      }

      // Cargar datos de ventas por empleado con rango de fechas si aplica
      let response;
      if (filtros.fechaInicio && filtros.fechaFin) {
        response = await ventasEmpleadosService.getVentasPorRangoFechas(
          params.fechaInicio, 
          params.fechaFin, 
          filtros.vendedor || null
        );
      } else {
        response = await ventasEmpleadosService.getVentasPorEmpleado(params);
      }
      
      // Filtrar empleados sin ventas si es necesario
      const datosFiltrados = response.filter(emp => emp.totalTransacciones > 0);
      
      setVentas(datosFiltrados);
      setPagination(prev => ({
        ...prev,
        total: datosFiltrados.length
      }));
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      message.error('Error al cargar las ventas');
      // Vaciar la lista cuando hay error
      setVentas([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(prev => ({ ...prev, ventas: false }));
    }
  }, [filtros]);

  // Función para cargar estadísticas
  const cargarEstadisticas = useCallback(async () => {
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
  }, [filtros]);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  // Efecto para cargar datos cuando cambian los filtros
  useEffect(() => {
    cargarVentas();
    cargarEstadisticas();
  }, [cargarVentas, cargarEstadisticas]);

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

  // // Función para exportar a Excel con múltiples hojas por mes
  // const exportarVistaExcel = async () => {
  //   try {
  //     setLoading(prev => ({ ...prev, exportandoExcel: true }));
      
  //     // Obtener datos actuales
  //     const datosActuales = vistaExcelEspecifico || vistaExcelActual || [];
      
  //     if (!datosActuales || datosActuales.length === 0) {
  //       message.warning('No hay datos para exportar');
  //       return;
  //     }

  //     // Agrupar datos por mes
  //     const datosPorMes = {};
  //     datosActuales.forEach(item => {
  //       const claveMes = `${item.nombreMes}_${item.anio}`;
  //       if (!datosPorMes[claveMes]) {
  //         datosPorMes[claveMes] = [];
  //       }
  //       datosPorMes[claveMes].push(item);
  //     });

  //     // Crear workbook
  //     const wb = XLSX.utils.book_new();

  //     // Procesar cada mes como una hoja diferente
  //     Object.keys(datosPorMes).forEach(claveMes => {
  //       const datosMes = datosPorMes[claveMes];
        
  //       // Preparar datos para la hoja
  //       const datosHoja = datosMes.map((item, index) => ({
  //         '#': index + 1,
  //         'Vendedor': item.nombreDel,
  //         'Descripción': item.descripcionLinea,
  //         'Factura': item.nfactura,
  //         'Precio Unitario': item.precioUnitario,
  //         'Comisión': item.comision,
  //         'Forma de Pago': item.formaDePago,
  //         'Fecha': Array.isArray(item.fecha) 
  //           ? moment([item.fecha[0], item.fecha[1] - 1, item.fecha[2]]).format('DD/MM/YYYY')
  //           : moment(item.fecha).format('DD/MM/YYYY'),
  //         'Ingresos Brutos Vendedor': item.ingresosBrutoAcumuladosVendedor,
  //         'Comisión Acumulada': item.comisionAcumuladaDelVendedor,
  //         'Ingreso Neto Vendedor': item.ingresoNetoVendedor,
  //         'Comisión Acumulada Equipo': item.comisionAcumuladaEquipoMes,
  //         'Ingresos Brutos Equipo': item.ingresosBrutoAcumuladosEquipoMes,
  //         'Ingreso Neto Rodieja': item.ingresoNetoParaRodiejaMes
  //       }));

  //       // Agregar fila de totales al final
  //       const totales = {
  //         '#': 'TOTAL',
  //         'Vendedor': '',
  //         'Descripción': '',
  //         'Factura': '',
  //         'Precio Unitario': datosMes.reduce((sum, item) => sum + item.precioUnitario, 0),
  //         'Comisión': datosMes.reduce((sum, item) => sum + item.comision, 0),
  //         'Forma de Pago': '',
  //         'Fecha': '',
  //         'Ingresos Brutos Vendedor': datosMes[0]?.ingresosBrutoAcumuladosVendedor || 0,
  //         'Comisión Acumulada': datosMes[0]?.comisionAcumuladaDelVendedor || 0,
  //         'Ingreso Neto Vendedor': datosMes[0]?.ingresoNetoVendedor || 0,
  //         'Comisión Acumulada Equipo': datosMes[0]?.comisionAcumuladaEquipoMes || 0,
  //         'Ingresos Brutos Equipo': datosMes[0]?.ingresosBrutoAcumuladosEquipoMes || 0,
  //         'Ingreso Neto Rodieja': datosMes[0]?.ingresoNetoParaRodiejaMes || 0
  //       };
  //       datosHoja.push(totales);

  //       // Crear worksheet
  //       const ws = XLSX.utils.json_to_sheet(datosHoja);
        
  //       // Ajustar anchos de columna
  //       const colWidths = [
  //         { wch: 5 },  // #
  //         { wch: 15 }, // Vendedor
  //         { wch: 30 }, // Descripción
  //         { wch: 20 }, // Factura
  //         { wch: 15 }, // Precio Unitario
  //         { wch: 12 }, // Comisión
  //         { wch: 15 }, // Forma de Pago
  //         { wch: 12 }, // Fecha
  //         { wch: 20 }, // Ingresos Brutos Vendedor
  //         { wch: 18 }, // Comisión Acumulada
  //         { wch: 18 }, // Ingreso Neto Vendedor
  //         { wch: 20 }, // Comisión Acumulada Equipo
  //         { wch: 20 }, // Ingresos Brutos Equipo
  //         { wch: 18 }  // Ingreso Neto Rodieja
  //       ];
  //       ws['!cols'] = colWidths;

  //       // Agregar hoja al workbook
  //       XLSX.utils.book_append_sheet(wb, ws, claveMes.substring(0, 31)); // Limitar nombre de hoja
  //     });

  //     // Generar y descargar archivo
  //     const nombreArchivo = `vista-excel-ventas-${moment().format('YYYYMMDD-HHmmss')}.xlsx`;
  //     XLSX.writeFile(wb, nombreArchivo);
      
  //     message.success('Archivo Excel exportado correctamente');
  //   } catch (error) {
  //     console.error('Error al exportar a Excel:', error);
  //     message.error('Error al exportar a Excel');
  //   } finally {
  //     setLoading(prev => ({ ...prev, exportandoExcel: false }));
  //   }
  // };


  // Obtener métricas de las estadísticas
  const totalVentasCount = estadisticas?.totalVentasCount || estadisticas?.totalTransacciones || 0;
  const totalIngresos = estadisticas?.totalVentas || 0;
  const ventasCompletadas = estadisticas?.totalVentasCount || estadisticas?.totalTransacciones || 0;
  const tasaConversion = estadisticas?.tasaConversion || 0;

  // Hooks para vista Excel
  const { data: vistaExcelActual, isLoading: loadingVistaExcelActual } = useVistaExcelMesActual();
  const { data: vistaExcelEspecifico, isLoading: loadingVistaExcelEspecifico } = useVistaExcelMesEspecifico(
    vistaExcelAnio, 
    vistaExcelMes
  );
  const {  isLoading: exportandoExcel } = useGenerarReporteVentasExcel();

  // Función para exportar a Excel con múltiples hojas
  const exportarAExcelCompleto = () => {
    const datosActuales = vistaExcelEspecifico || vistaExcelActual || [];
    
    if (!datosActuales || datosActuales.length === 0) {
      message.warning('No hay datos para exportar');
      return;
    }

    try {
      // Agrupar datos por mes
      const datosPorMes = {};
      datosActuales.forEach(item => {
        const claveMes = `${item.nombreMes}_${item.anio}`;
        if (!datosPorMes[claveMes]) {
          datosPorMes[claveMes] = [];
        }
        datosPorMes[claveMes].push(item);
      });

      // Debug: Mostrar primeros datos para verificar campos
      console.log('🔍 [DEBUG] Primer item de datos:', datosActuales[0]);
      console.log('🔍 [DEBUG] Campos disponibles:', Object.keys(datosActuales[0] || {}));

      // Crear workbook
      const wb = XLSX.utils.book_new();

      // Crear hojas para cada mes
      Object.keys(datosPorMes).forEach(claveMes => {
        const datos = datosPorMes[claveMes];
        const primerItem = datos[0];
        
        // Preparar datos para la hoja
        const datosHoja = datos.map(item => ({
          'Fecha': Array.isArray(item.fecha) ? 
            `${item.fecha[2]}/${item.fecha[1]}/${item.fecha[0]}` : 
            moment(item.fecha).format('DD/MM/YYYY'),
          'Vendedor': item.nombreDel || '',
          'Descripción/Observación': item.descripcionLinea || '',
          'Forma de Pago': item.formaDePago || '',
          'Ingreso': item.precioUnitario || 0,
          'Comisión Equipo': item.comision || 0
        }));

        // Crear hoja
        
        // Agregar título y subtítulo
        const titulo = `REPORTE DE VENTAS - ${primerItem.nombreMes} ${primerItem.anio}`;
        const comisionFormateada = new Intl.NumberFormat('es-CR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(primerItem.comisionAcumuladaEquipoMes || 0);
        const ingresosFormateados = new Intl.NumberFormat('es-CR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(primerItem.ingresosBrutoAcumuladosEquipoMes || 0);
        const ingresoNetoFormateado = new Intl.NumberFormat('es-CR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(primerItem.ingresoNetoParaRodiejaMes || 0);
        const subtituloComision = `Comisión Acumulada: ₡${comisionFormateada}`;
        const subtituloIngresosBrutos = `Ingresos Brutos: ₡${ingresosFormateados}`;
        const subtituloIngresoNeto = `Ingreso Neto Rodieja: ₡${ingresoNetoFormateado}`;
        
        // Crear array con títulos y datos
        const datosConTitulo = [
          [titulo],
          [subtituloComision, '', '', subtituloIngresosBrutos, '', '', subtituloIngresoNeto, ''],
          [], // Fila vacía
          ['Fecha', 'Vendedor', 'Descripción/Observación', 'Forma de Pago', 'Ingreso', 'Comisión Equipo'],
          ...Object.values(datosHoja).map(row => Object.values(row))
        ];
        
        // Recrear hoja con títulos
        const wsConTitulo = XLSX.utils.aoa_to_sheet(datosConTitulo);
        
        // Agregar colores de fondo a los títulos
        // Color para el título principal (azul oscuro)
        wsConTitulo['A1'].s = {
          fill: { fgColor: { rgb: "FF2E75B6" } },
          font: { sz: 16, bold: true, color: { rgb: "FFFFFFFF" } },
          alignment: { horizontal: "center" }
        };
        
        // Color para el subtítulo (verde) - aplicado a grupos de 3 celdas
        const subtitleStyle = {
          fill: { fgColor: { rgb: "FF70AD47" } },
          font: { sz: 12, bold: true, color: { rgb: "FFFFFFFF" } },
          alignment: { horizontal: "center" }
        };
        
        // Aplicar estilo a las celdas de comisión (A2, B2, C2)
        wsConTitulo['A2'].s = subtitleStyle;
        wsConTitulo['B2'].s = subtitleStyle;
        wsConTitulo['C2'].s = subtitleStyle;
        
        // Aplicar estilo a las celdas de ingresos brutos (D2, E2, F2)
        wsConTitulo['D2'].s = subtitleStyle;
        wsConTitulo['E2'].s = subtitleStyle;
        wsConTitulo['F2'].s = subtitleStyle;
        
        // Aplicar estilo a las celdas de ingreso neto (G2, H2)
        wsConTitulo['G2'].s = subtitleStyle;
        wsConTitulo['H2'].s = subtitleStyle;
        
        // Estilo para los títulos de columnas (negrita)
        const headerStyle = {
          font: { bold: true, sz: 12 },
          fill: { fgColor: { rgb: "FFF2CC" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
        
        // Aplicar estilo de negrita a los títulos de columnas (fila 4)
        const columnHeaders = ['A4', 'B4', 'C4', 'D4', 'E4', 'F4'];
        columnHeaders.forEach(cell => {
          if (wsConTitulo[cell]) {
            wsConTitulo[cell].s = headerStyle;
          } else {
            // Si la celda no existe, crearla con el estilo
            const col = cell.charCodeAt(0) - 65; // Convertir A=0, B=1, etc.
            wsConTitulo[cell] = { 
              v: ['Fecha', 'Vendedor', 'Descripción/Observación', 'Forma de Pago', 'Ingreso', 'Comisión Equipo'][col],
              s: headerStyle 
            };
          }
        });
        
        // Aplicar el estilo a todas las celdas del título (merge effect)
        const range = XLSX.utils.decode_range(wsConTitulo['!ref']);
        for (let col = 0; col <= range.e.c; col++) {
          const cellTitle = XLSX.utils.encode_cell({ r: 0, c: col });
          
          if (col > 0) { // Copiar estilo a otras columnas del título
            wsConTitulo[cellTitle] = { v: '', s: wsConTitulo['A1'].s };
          }
        }
        
        // Ajustar ancho de columnas
        const colWidths = [
          { wch: 12 },  // Fecha
          { wch: 15 },  // Vendedor
          { wch: 40 },  // Descripción/Observación
          { wch: 15 },  // Forma de Pago
          { wch: 15 },  // Ingreso
          { wch: 15 }   // Comisión Equipo
        ];
        wsConTitulo['!cols'] = colWidths;

        // Agregar hoja al workbook
        XLSX.utils.book_append_sheet(wb, wsConTitulo, claveMes);
      });

      // Generar y descargar archivo
      const nombreArchivo = `Reporte_Ventas_Completo_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
      message.success('Reporte exportado exitosamente');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      message.error('Error al exportar el reporte a Excel');
    }
  };

  // Columnas para la tabla de vista Excel
  const columnsVistaExcel = [
     {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (fecha) => {
        if (Array.isArray(fecha) && fecha.length >= 3) {
          return moment([fecha[0], fecha[1] - 1, fecha[2]]).format('DD/MM/YYYY');
        }
        return moment(fecha).format('DD/MM/YYYY');
      },
      width: 120,
      sorter: (a, b) => {
        const dateA = Array.isArray(a.fecha) ? moment([a.fecha[0], a.fecha[1] - 1, a.fecha[2]]) : moment(a.fecha);
        const dateB = Array.isArray(b.fecha) ? moment([b.fecha[0], b.fecha[1] - 1, b.fecha[2]]) : moment(b.fecha);
        return dateA - dateB;
      }
    },
    {
      title: 'Vendedor',
      dataIndex: 'nombreDel',
      key: 'nombreDel',
      width: 120,
      sorter: (a, b) => a.nombreDel.localeCompare(b.nombreDel)
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcionLinea',
      key: 'descripcionLinea',
      width: 200,
      sorter: (a, b) => a.descripcionLinea.localeCompare(b.descripcionLinea)
    },
        {
      title: 'Comisión',
      dataIndex: 'comision',
      key: 'comision',
      render: (value) => (
        <Text type="success">
          ₡{new Intl.NumberFormat('es-CR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value)}
        </Text>
      ),
      align: 'right',
      width: 120,
      sorter: (a, b) => a.comision - b.comision
    },
    {
      title: 'Forma de Pago',
      dataIndex: 'formaDePago',
      key: 'formaDePago',
      width: 120,
      render: (text) => (
        <Tag color={text === 'EFECTIVO' ? 'green' : text === 'TRANSFERENCIA' ? 'blue' : 'default'}>
          {text}
        </Tag>
      ),
      sorter: (a, b) => a.formaDePago.localeCompare(b.formaDePago)
    },
    {
      title: 'Precio Unitario',
      dataIndex: 'precioUnitario',
      key: 'precioUnitario',
      render: (value) => (
        <Text strong>
          ₡{new Intl.NumberFormat('es-CR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value)}
        </Text>
      ),
      align: 'right',
      width: 150,
      sorter: (a, b) => a.precioUnitario - b.precioUnitario
    },


   
    {
      title: 'Mes/Año',
      key: 'periodo',
      render: (record) => `${record.nombreMes} ${record.anio}`,
      width: 100,
      sorter: (a, b) => {
        if (a.anio !== b.anio) return a.anio - b.anio;
        return a.mes - b.mes;
      }
    },
    
  ];

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
                value={totalVentasCount}
                prefix={<ShoppingCartOutlined style={{ color: '#1890ff', marginRight: 8 }} />}
                suffix={totalVentasCount === 1 ? 'venta' : 'ventas'}
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
            {/* Sección Vista Excel de Ventas Mensuales */}
      <Card 
        title={
          <Space>
            <BarChartOutlined />
            <span>Vista Excel de Ventas Mensuales</span>
          </Space>
        }
        extra={
          <Space>
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={exportarAExcelCompleto}
              loading={exportandoExcel}
              type="primary"
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Exportar a Excel
            </Button>
            <Select
              style={{ width: 120 }}
              placeholder="Mes"
              value={vistaExcelMes}
              onChange={(value) => setVistaExcelMes(value)}
              allowClear
            >
              <Option value={1}>Enero</Option>
              <Option value={2}>Febrero</Option>
              <Option value={3}>Marzo</Option>
              <Option value={4}>Abril</Option>
              <Option value={5}>Mayo</Option>
              <Option value={6}>Junio</Option>
              <Option value={7}>Julio</Option>
              <Option value={8}>Agosto</Option>
              <Option value={9}>Septiembre</Option>
              <Option value={10}>Octubre</Option>
              <Option value={11}>Noviembre</Option>
              <Option value={12}>Diciembre</Option>
            </Select>
            <Select
              style={{ width: 100 }}
              placeholder="Año"
              value={vistaExcelAnio}
              onChange={(value) => setVistaExcelAnio(value)}
              allowClear
            >
              <Option value={2024}>2024</Option>
              <Option value={2025}>2025</Option>
              <Option value={2026}>2026</Option>
            </Select>
            <Button 
              type="default" 
              icon={<ReloadOutlined />} 
              onClick={() => {
                setVistaExcelMes(null);
                setVistaExcelAnio(null);
              }}
            >
              Mes Actual
            </Button>
          </Space>
        }
        style={{ marginTop: 24 }}
      >
        <Table
          columns={columnsVistaExcel}
          dataSource={vistaExcelEspecifico || vistaExcelActual || []}
          rowKey="id"
          loading={loadingVistaExcelActual || loadingVistaExcelEspecifico}
          scroll={{ x: 1200 }}
          bordered
          size="middle"
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`
          }}
          locale={{
            emptyText: (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={
                  <span>
                    <InboxOutlined style={{ fontSize: 20, color: '#999', marginRight: 8 }} />
                    {!vistaExcelMes && !vistaExcelAnio 
                      ? 'Selecciona un mes y año específicos o usa "Mes Actual"'
                      : 'No hay datos para el período seleccionado'}
                  </span>
                }
              />
            )
          }}
        />
      </Card>

      
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
              onClick={() => {}}
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
