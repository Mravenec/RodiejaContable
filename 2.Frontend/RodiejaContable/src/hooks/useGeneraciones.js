import { useQuery } from 'react-query';
import { message } from 'antd';
import { generacionesAPI } from '../api/generaciones';

export function useGeneraciones(modeloId, enabled = true) {
  return useQuery(
    ['generaciones', modeloId],
    async () => {
      try {
        if (!modeloId) return [];
        const response = await generacionesAPI.getByModeloId(modeloId);
        return response.data;
      } catch (error) {
        console.error('Error fetching generaciones:', error);
        message.error('Error al cargar las generaciones');
        throw error;
      }
    },
    {
      enabled: !!modeloId && enabled,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
}
