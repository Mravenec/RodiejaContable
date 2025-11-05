import { useQuery } from 'react-query';
import { message } from 'antd';
import vehiculoService from '../api/vehiculos';

const fetchVehiculosActivos = async () => {
  try {
    console.log('🔍 [API] Obteniendo vehículos activos...');
    const vehiculos = await vehiculoService.getVehiculosActivos();
    
    if (!vehiculos) {
      console.error('❌ [ERROR] La respuesta de vehículos está vacía');
      return [];
    }
    
    const vehiculosData = Array.isArray(vehiculos) ? vehiculos : [vehiculos];
    
    if (vehiculosData.length === 0) {
      console.warn('⚠️ [ADVERTENCIA] No se encontraron vehículos activos');
      return [];
    }
    
    // Mapear los datos para asegurar que tengan la estructura esperada
    const vehiculosMapeados = vehiculosData.map(vehiculo => ({
      id: vehiculo.id,
      codigoVehiculo: vehiculo.codigoVehiculo || 'SIN_CODIGO',
      generacionId: vehiculo.generacionId,
      anio: vehiculo.anio || 'N/A',
      placa: vehiculo.codigoVehiculo || 'SIN_PLACA', // Usar codigoVehiculo como placa
      estado: vehiculo.estado || 'DESCONOCIDO',
      activo: vehiculo.activo !== false,
      ...vehiculo
    }));
    
    console.log(`✅ [API] ${vehiculosMapeados.length} vehículos cargados:`, 
      vehiculosMapeados.map(v => `${v.id}: ${v.codigoVehiculo} (${v.anio}) - ${v.estado}`).join(', ')
    );
    
    return vehiculosMapeados;
    
  } catch (error) {
    console.error('Error al obtener vehículos:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    message.error('No se pudieron cargar los vehículos. Por favor, intente de nuevo.');
    return []; // Retornar array vacío en caso de error
  }
};

export const useVehiculosParaTransacciones = () => {
  const { data, isLoading, error } = useQuery(
    'vehiculosActivos',
    fetchVehiculosActivos,
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Error en la consulta de vehículos:', error);
      },
      onSuccess: (data) => {
        console.log('Datos de vehículos cargados correctamente:', data);
      }
    }
  );

  return {
    vehiculos: data || [],
    loadingVehiculos: isLoading,
    errorVehiculos: error || null
  };
};
