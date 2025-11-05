import { useQuery } from 'react-query';
import { message } from 'antd';
import api from '../api/axios';

const fetchEmpleados = async () => {
  try {
    console.log('Solicitando empleados al backend...');
    // Nota: No incluir el prefijo /api ya que ya está en la baseURL
    const response = await api.get('empleados', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Respuesta del servidor (empleados):', {
      status: response.status,
      data: response.data
    });
    
    // Verificar si hay datos y son un array
    if (!Array.isArray(response.data)) {
      console.error('La respuesta no es un array:', response.data);
      return [];
    }
    
    // Filtrar solo empleados activos (activo === 1)
    const empleadosActivos = response.data.filter(empleado => {
      const isActive = empleado.activo === 1 || empleado.activo === true;
      if (!isActive) {
        console.log('Empleado inactivo filtrado:', empleado);
      }
      return isActive;
    });
    
    console.log('Empleados activos encontrados:', empleadosActivos.length);
    
    // Asegurarse de que cada empleado tenga los campos necesarios
    return empleadosActivos.map(empleado => ({
      id: empleado.id,
      nombres: empleado.nombres || empleado.nombre || 'Sin nombre',
      apellidos: empleado.apellidos || '',
      ...empleado
    }));
    
  } catch (error) {
    console.error('Error al obtener empleados:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    message.error('No se pudieron cargar los empleados. Por favor, intente de nuevo.');
    return []; // Retornar array vacío en caso de error
  }
};

export const useEmpleados = () => {
  return useQuery(
    'empleados',
    fetchEmpleados,
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Error en la consulta de empleados:', error);
      },
      onSuccess: (data) => {
        console.log('Datos de empleados cargados correctamente:', data);
      }
    }
  );
};
