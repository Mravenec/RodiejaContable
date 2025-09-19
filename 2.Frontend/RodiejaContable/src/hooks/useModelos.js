import { useQuery } from 'react-query';
import { message } from 'antd';
import { modelosAPI } from '../api/modelos';

export function useModelos(marcaId, enabled = true) {
  return useQuery(
    ['modelos', marcaId],
    async () => {
      try {
        if (!marcaId) return [];
        const response = await modelosAPI.getByMarcaId(marcaId);
        return response.data;
      } catch (error) {
        console.error('Error fetching modelos:', error);
        message.error('Error al cargar los modelos');
        throw error;
      }
    },
    {
      enabled: !!marcaId && enabled,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
}
