import axios from './axios';

const API_URL = '/tipos-transacciones';

export const getTiposTransacciones = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de transacciones:', error);
    throw error;
  }
};

export const getTiposTransaccionesByCategoria = async (categoria) => {
  try {
    const response = await axios.get(`${API_URL}/categoria/${categoria}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener tipos de transacciones para categoría ${categoria}:`, error);
    throw error;
  }
};

export const getTiposTransaccionesActivos = async () => {
  try {
    const response = await axios.get(`${API_URL}/activos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de transacciones activos:', error);
    throw error;
  }
};

export const createTipoTransaccion = async (tipoTransaccionData) => {
  try {
    const response = await axios.post(API_URL, tipoTransaccionData);
    return response.data;
  } catch (error) {
    console.error('Error al crear tipo de transacción:', error);
    throw error;
  }
};
