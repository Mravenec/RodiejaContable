import { useQuery } from 'react-query';
import { message } from 'antd';
import { marcasAPI } from '../api/marcas';

export function useMarcas() {
  return useQuery(
    'marcas',
    async () => {
      try {
        const response = await marcasAPI.getAll();
        return response.data;
      } catch (error) {
        console.error('Error fetching marcas:', error);
        message.error('Error al cargar las marcas');
        throw error;
      }
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos
      refetchOnWindowFocus: false,
    }
  );
}
