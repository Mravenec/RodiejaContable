import { useQuery, useMutation, useQueryClient } from 'react-query';
import { message } from 'antd';
import { marcasAPI } from '../api/marcas';

export function useMarcas() {
  const queryClient = useQueryClient();
  
  // Query para obtener todas las marcas
  const marcasQuery = useQuery(
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

  // Mutación para crear una nueva marca
  const createMarca = useMutation(
    (nuevaMarca) => marcasAPI.create(nuevaMarca),
    {
      onSuccess: () => {
        // Invalida y vuelve a cargar la lista de marcas
        queryClient.invalidateQueries('marcas');
        message.success('Marca creada exitosamente');
      },
      onError: (error) => {
        console.error('Error creating marca:', error);
        message.error('Error al crear la marca');
      }
    }
  );

  return {
    ...marcasQuery,
    createMarca,
    createMarcaMutation: createMarca
  };
}

