import { useQuery, useMutation, useQueryClient } from 'react-query';
import { message } from 'antd';
import vehiculoService from '../api/vehiculos';

export function useVehiculos(params = {}) {
  return useQuery(
    ['vehiculos', params],
    async () => {
      try {
        const data = await vehiculoService.getVehiculos(params);
        console.log('API Response:', data);
        return data;
      } catch (error) {
        console.error('Error in useVehiculos:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          params
        });
        throw error;
      }
    },
    {
      onError: (error) => {
        const errorMessage = error.response?.data?.message || 'Error al cargar los vehículos';
        message.error(errorMessage);
        console.error('Error en useVehiculos:', error);
      },
      retry: 1,
      refetchOnWindowFocus: false
    }
  );
}

export function useVehiculo(id) {
  return useQuery(
    ['vehiculo', id],
    () => vehiculoService.getVehiculoById(id),
    {
      enabled: !!id,
      onError: (error) => {
        message.error('Error al cargar el vehículo');
        console.error('Error en useVehiculo:', error);
      },
    }
  );
}

export function useCreateVehiculo() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (vehiculoData) => vehiculoService.createVehiculo(vehiculoData),
    {
      onSuccess: () => {
        message.success('Vehículo creado correctamente');
        queryClient.invalidateQueries('vehiculos');
      },
      onError: (error) => {
        message.error('Error al crear el vehículo');
        console.error('Error en useCreateVehiculo:', error);
      },
    }
  );
}

export function useUpdateVehiculo() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, ...vehiculoData }) => vehiculoService.updateVehiculo(id, vehiculoData),
    {
      onSuccess: (_, variables) => {
        message.success('Vehículo actualizado correctamente');
        queryClient.invalidateQueries(['vehiculo', variables.id]);
        queryClient.invalidateQueries('vehiculos');
      },
      onError: (error) => {
        message.error('Error al actualizar el vehículo');
        console.error('Error en useUpdateVehiculo:', error);
      },
    }
  );
}

export function useDeleteVehiculo() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => vehiculoService.deleteVehiculo(id),
    {
      onSuccess: () => {
        message.success('Vehículo eliminado correctamente');
        queryClient.invalidateQueries('vehiculos');
      },
      onError: (error) => {
        message.error('Error al eliminar el vehículo');
        console.error('Error en useDeleteVehiculo:', error);
      },
    }
  );
}

export function useVehiculosPorGeneracion(generacionId) {
  return useQuery(
    ['vehiculos', 'generacion', generacionId],
    () => vehiculoService.getVehiculosPorGeneracion(generacionId),
    {
      enabled: !!generacionId,
      onError: (error) => {
        message.error('Error al cargar los vehículos de la generación');
        console.error('Error en useVehiculosPorGeneracion:', error);
      },
    }
  );
}
