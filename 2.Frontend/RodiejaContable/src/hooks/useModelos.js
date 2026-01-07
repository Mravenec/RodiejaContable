import { useQuery, useMutation, useQueryClient } from 'react-query';
import { message } from 'antd';
import { modelosAPI } from '../api/modelos';

export function useModelos(marcaId, enabled = true) {
  const queryClient = useQueryClient();
  
  // Query para obtener los modelos de una marca
  const modelosQuery = useQuery(
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
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos
      refetchOnWindowFocus: false,
    }
  );

  // Mutación para crear un nuevo modelo
  const createModelo = useMutation(
    (nuevoModelo) => modelosAPI.create(nuevoModelo),
    {
      onSuccess: () => {
        // Invalida y vuelve a cargar la lista de modelos
        queryClient.invalidateQueries(['modelos', marcaId]);
        message.success('Modelo creado exitosamente');
      },
      onError: (error) => {
        console.error('Error creating modelo:', error);
        message.error('Error al crear el modelo');
      }
    }
  );

  return {
    ...modelosQuery,
    createModelo,
    createModeloMutation: createModelo
  };
}