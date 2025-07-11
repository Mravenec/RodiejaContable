import { useMutation } from 'react-query';
import { message } from 'antd';
import reportesService from '../api/reportes';

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
