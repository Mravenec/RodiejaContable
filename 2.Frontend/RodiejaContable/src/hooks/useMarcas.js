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
        const errorMessage = error.response?.data?.message || 'Error al crear la marca';
        message.error(errorMessage);
      }
    }
  );

  // Mutación para actualizar una marca existente
  const updateMarca = useMutation(
    ({ id, ...data }) => marcasAPI.update(id, data),
    {
      // Actualización optimista
      onMutate: async (newMarcaData) => {
        // Cancelar cualquier consulta de marcas en curso
        await queryClient.cancelQueries('marcas');
        
        // Guardar el estado anterior para hacer rollback en caso de error
        const previousMarcas = queryClient.getQueryData('marcas') || [];
        
        // Actualizar el caché de manera optimista
        queryClient.setQueryData('marcas', old => 
          old.map(marca => 
            marca.id === newMarcaData.id ? { ...marca, ...newMarcaData } : marca
          )
        );
        
        return { previousMarcas };
      },
      onError: (error, variables, context) => {
        // Revertir al estado anterior en caso de error
        if (context?.previousMarcas) {
          queryClient.setQueryData('marcas', context.previousMarcas);
        }
        console.error('Error updating marca:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar la marca';
        message.error(errorMessage);
      },
      onSettled: () => {
        // Siempre refetch después de error o éxito
        queryClient.invalidateQueries('marcas');
      },
      onSuccess: () => {
        message.success('Marca actualizada exitosamente');
      }
    }
  );

  return {
    ...marcasQuery,
    createMarca,
    createMarcaMutation: createMarca,
    updateMarca,
    updateMarcaMutation: updateMarca
  };
}

