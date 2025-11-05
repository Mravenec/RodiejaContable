import { useQuery } from 'react-query';
import { message } from 'antd';
import { getTiposTransaccionesByCategoria } from '../api/transacciones';

const fetchTiposByCategoria = async (categoria) => {
  try {
    console.log(`🔍 [API] Obteniendo tipos de transacción para categoría: ${categoria}`);
    
    const tipos = await getTiposTransaccionesByCategoria(categoria);
    
    if (!tipos) {
      console.error('❌ [ERROR] La respuesta de tipos de transacción está vacía');
      return [];
    }
    
    const tiposData = Array.isArray(tipos) ? tipos : [tipos];
    
    if (tiposData.length === 0) {
      console.warn(`⚠️ [ADVERTENCIA] No se encontraron tipos de transacción para la categoría: ${categoria}`);
      return [];
    }
    
    // Mapear los datos para asegurar que tengan la estructura esperada
    const tiposMapeados = tiposData.map(tipo => ({
      id: tipo.id,
      nombre: tipo.nombre || `Tipo ${tipo.id}`,
      categoria: tipo.categoria || categoria,
      descripcion: tipo.descripcion || '',
      activo: tipo.activo !== false,
      ...tipo
    }));
    
    console.log(`✅ [API] ${tiposMapeados.length} tipos de transacción cargados para ${categoria}:`, 
      tiposMapeados.map(t => `${t.id}: ${t.nombre}`).join(', ')
    );
    
    return tiposMapeados;
    
  } catch (error) {
    console.error(`❌ Error al cargar tipos de transacción (${categoria}):`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    message.error(`Error al cargar los tipos de transacción (${categoria})`);
    return [];
  }
};

export const useTiposByCategoria = (categoria) => {
  const query = useQuery(
    ['tiposTransaccion', categoria],
    () => fetchTiposByCategoria(categoria),
    {
      enabled: !!categoria,
      staleTime: 1000 * 60 * 5, // 5 minutos
      onError: (error) => {
        console.error('Error en useQuery de tipos de transacción:', error);
      },
      onSuccess: (data) => {
        console.log(`Datos de tipos de transacción (${categoria}) cargados:`, data);
      }
    }
  );
  
  // Devolver los datos como array vacío si no hay datos
  return {
    ...query,
    data: Array.isArray(query.data) ? query.data : []
  };
};
