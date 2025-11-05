import { useQuery } from 'react-query';
import { message } from 'antd';
import api from '../api/axios';

const fetchVehiculosActivos = async () => {
  try {
    console.log('🔍 [API] GET /api/vehiculos/activos');
    
    const response = await api.get('vehiculos/activos', {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('📥 [API] Respuesta de /api/vehiculos/activos:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    
    if (!response.data) {
      console.error('❌ [ERROR] La respuesta no contiene datos');
      return [];
    }
    
    const vehiculosData = Array.isArray(response.data) ? response.data : [response.data];
    
    if (vehiculosData.length === 0) {
      console.warn('⚠️ [ADVERTENCIA] No se encontraron vehículos activos');
      return [];
    }
    
    // Mapear los datos para asegurar que tengan la estructura esperada
    const vehiculosMapeados = vehiculosData.map(vehiculo => {
      if (!vehiculo.id) {
        console.warn('⚠️ [ADVERTENCIA] Vehículo sin ID:', vehiculo);
        return null;
      }
      
      return {
        id: vehiculo.id,
        marca: vehiculo.marca || 'Sin marca',
        modelo: vehiculo.modelo || 'Sin modelo',
        placa: vehiculo.placa || 'Sin placa',
        anio: vehiculo.anio || 'N/A',
        color: vehiculo.color || 'No especificado',
        activo: vehiculo.activo !== false,
        ...vehiculo
      };
    }).filter(Boolean);
    
    console.log(`✅ [API] ${vehiculosMapeados.length} vehículos cargados:`, 
      vehiculosMapeados.map(v => `${v.id}: ${v.marca} ${v.modelo} (${v.placa})`).join(', ')
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
