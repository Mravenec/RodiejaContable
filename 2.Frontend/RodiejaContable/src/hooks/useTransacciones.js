import { useQuery } from 'react-query';
import { message } from 'antd';
import { transaccionService } from '../api/transacciones';

export function useTransacciones(params = {}) {
  return useQuery(
    ['transacciones', params],
    () => transaccionService.getTransacciones(params),
    {
      onError: (error) => {
        message.error('Error al cargar las transacciones');
        console.error('Error en useTransacciones:', error);
      },
      enabled: !params.vehiculoId || !!params.vehiculoId,
    }
  );
}
