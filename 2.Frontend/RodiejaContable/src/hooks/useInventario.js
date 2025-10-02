import { useQuery, useMutation, useQueryClient } from 'react-query';
import { message } from 'antd';
import inventarioService from '../api/inventario';

export function useRepuestos(params = {}) {
  return useQuery(
    ['repuestos', params],
    () => inventarioService.getRepuestos(params),
    {
      onError: (error) => {
        message.error('Error al cargar los repuestos');
        console.error('Error en useRepuestos:', error);
      },
    }
  );
}

export function useRepuesto(id) {
  return useQuery(
    ['repuesto', id],
    () => inventarioService.getRepuestoPorId(id),
    {
      enabled: !!id,
      onError: (error) => {
        message.error('Error al cargar el repuesto');
        console.error('Error en useRepuesto:', error);
      },
    }
  );
}

export function useCreateRepuesto() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (repuestoData) => inventarioService.crearRepuesto(repuestoData),
    {
      onSuccess: () => {
        message.success('Repuesto creado correctamente');
        queryClient.invalidateQueries('repuestos');
      },
      onError: (error) => {
        message.error('Error al crear el repuesto');
        console.error('Error en useCreateRepuesto:', error);
      },
    }
  );
}

// ✅ NUEVO: Hook para crear repuestos SIN vehículo origen
export function useCreateRepuestoSinVehiculo() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (repuestoData) => inventarioService.crearRepuestoSinVehiculo(repuestoData),
    {
      onSuccess: () => {
        message.success('Repuesto creado correctamente sin vehículo origen');
        queryClient.invalidateQueries('repuestos');
      },
      onError: (error) => {
        message.error('Error al crear el repuesto sin vehículo');
        console.error('Error en useCreateRepuestoSinVehiculo:', error);
      },
    }
  );
}

export function useUpdateRepuesto() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, ...repuestoData }) => inventarioService.actualizarRepuesto(id, repuestoData),
    {
      onSuccess: (_, variables) => {
        message.success('Repuesto actualizado correctamente');
        queryClient.invalidateQueries(['repuesto', variables.id]);
        queryClient.invalidateQueries('repuestos');
      },
      onError: (error) => {
        message.error('Error al actualizar el repuesto');
        console.error('Error en useUpdateRepuesto:', error);
      },
    }
  );
}

export function useDeleteRepuesto() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => inventarioService.eliminarRepuesto(id),
    {
      onSuccess: () => {
        message.success('Repuesto eliminado correctamente');
        queryClient.invalidateQueries('repuestos');
      },
      onError: (error) => {
        message.error('Error al eliminar el repuesto');
        console.error('Error en useDeleteRepuesto:', error);
      },
    }
  );
}

export function useRepuestosPorVehiculo(vehiculoId) {
  return useQuery(
    ['repuestos', 'vehiculo', vehiculoId],
    () => inventarioService.getRepuestosPorVehiculo(vehiculoId),
    {
      enabled: !!vehiculoId,
      onError: (error) => {
        message.error('Error al cargar los repuestos del vehículo');
        console.error('Error en useRepuestosPorVehiculo:', error);
      },
    }
  );
}

export function useActualizarStock() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, cantidad }) => inventarioService.actualizarStock(id, cantidad),
    {
      onSuccess: (_, variables) => {
        message.success('Stock actualizado correctamente');
        queryClient.invalidateQueries(['repuesto', variables.id]);
        queryClient.invalidateQueries('repuestos');
      },
      onError: (error) => {
        message.error('Error al actualizar el stock');
        console.error('Error en useActualizarStock:', error);
      },
    }
  );
}