import { useMutation, useQuery } from 'react-query';
import { message } from 'antd';
import reportesService from '../api/reportes';
import { transaccionesCompletasService } from '../api/transaccionesCompletas';

export function useGenerarReporteInventario() {
  return useMutation(
    (params = {}) => reportesService.generarReporteInventario(params),
    {
      onSuccess: (data, variables) => {
        const nombreArchivo = `reporte-inventario-${new Date().toISOString().split('T')[0]}.xlsx`;
        reportesService.descargarArchivo(data, nombreArchivo);
        message.success('Reporte de inventario generado correctamente');
      },
      onError: (error) => {
        message.error('Error al generar el reporte de inventario');
        console.error('Error en useGenerarReporteInventario:', error);
      },
    }
  );
}

export function useGenerarReporteVentas() {
  return useMutation(
    (params = {}) => reportesService.generarReporteVentas(params),
    {
      onSuccess: (data, variables) => {
        const nombreArchivo = `reporte-ventas-${new Date().toISOString().split('T')[0]}.xlsx`;
        reportesService.descargarArchivo(data, nombreArchivo);
        message.success('Reporte de ventas generado correctamente');
      },
      onError: (error) => {
        message.error('Error al generar el reporte de ventas');
        console.error('Error en useGenerarReporteVentas:', error);
      },
    }
  );
}

export function useGenerarReporteVentasExcel() {
  return useMutation(
    async ({ anio, mes }) => {
      if (anio && mes) {
        return await transaccionesCompletasService.getVistaExcelMesEspecifico(anio, mes);
      } else {
        return await transaccionesCompletasService.getVistaExcelMesActual();
      }
    },
    {
      onSuccess: (data, variables) => {
        const nombreArchivo = `reporte-ventas-completo-${variables.anio || 'actual'}-${variables.mes || 'actual'}.xlsx`;
        reportesService.descargarArchivo(data, nombreArchivo);
        message.success('Reporte de ventas completo generado correctamente');
      },
      onError: (error) => {
        message.error('Error al generar el reporte de ventas completo');
        console.error('Error en useGenerarReporteVentasExcel:', error);
      },
    }
  );
}

export function useGenerarReporteFinanciero() {
  return useMutation(
    (params = {}) => reportesService.generarReporteFinanciero(params),
    {
      onSuccess: (data, variables) => {
        const nombreArchivo = `reporte-financiero-${new Date().toISOString().split('T')[0]}.xlsx`;
        reportesService.descargarArchivo(data, nombreArchivo);
        message.success('Reporte financiero generado correctamente');
      },
      onError: (error) => {
        message.error('Error al generar el reporte financiero');
        console.error('Error en useGenerarReporteFinanciero:', error);
      },
    }
  );
}

export function useGenerarReporteVehiculos() {
  return useMutation(
    (params = {}) => reportesService.generarReporteVehiculos(params),
    {
      onSuccess: (data, variables) => {
        const nombreArchivo = `reporte-vehiculos-${new Date().toISOString().split('T')[0]}.xlsx`;
        reportesService.descargarArchivo(data, nombreArchivo);
        message.success('Reporte de vehículos generado correctamente');
      },
      onError: (error) => {
        message.error('Error al generar el reporte de vehículos');
        console.error('Error en useGenerarReporteVehiculos:', error);
      },
    }
  );
}

export function useVistaExcelMesActual() {
  return useQuery(
    'vista-excel-mes-actual',
    () => transaccionesCompletasService.getVistaExcelMesActual(),
    {
      onError: (error) => {
        message.error('Error al cargar la vista Excel del mes actual');
        console.error('Error en useVistaExcelMesActual:', error);
      },
    }
  );
}

export function useVistaExcelMesEspecifico(anio, mes) {
  return useQuery(
    ['vista-excel-mes-especifico', anio, mes],
    () => transaccionesCompletasService.getVistaExcelMesEspecifico(anio, mes),
    {
      enabled: !!anio && !!mes,
      onError: (error) => {
        message.error('Error al cargar la vista Excel del mes específico');
        console.error('Error en useVistaExcelMesEspecifico:', error);
      },
    }
  );
}
