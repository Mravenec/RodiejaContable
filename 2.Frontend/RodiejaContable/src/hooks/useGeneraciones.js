import { useQuery } from 'react-query';
import { message } from 'antd';
import { generacionesAPI } from '../api/generaciones';

export function useGeneraciones(modeloId, enabled = true) {
  console.log('useGeneraciones - modeloId:', modeloId, 'enabled:', enabled);
  
  return useQuery(
    ['generaciones', modeloId],
    async () => {
      console.log('Iniciando fetch de generaciones para modeloId:', modeloId);
      try {
        if (!modeloId) {
          console.log('No hay modeloId, retornando array vacío');
          return [];
        }
        console.log('Realizando petición a la API para modeloId:', modeloId);
        const response = await generacionesAPI.getByModeloId(modeloId);
        console.log('Respuesta de la API (generaciones):', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching generaciones:', error);
        if (error.response) {
          console.error('Detalles del error:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
        }
        message.error('Error al cargar las generaciones: ' + (error.message || 'Error desconocido'));
        throw error;
      }
    },
    {
      enabled: !!modeloId && enabled,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Error en useQuery (generaciones):', error);
      },
      onSettled: (data, error) => {
        console.log('useGeneraciones - onSettled - data:', data, 'error:', error);
      }
    }
  );
}
