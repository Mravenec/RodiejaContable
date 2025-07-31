import api from './axios';

class InventarioService {
  // Obtener todo el inventario
  async getInventario() {
    try {
      const response = await api.get('/inventario');
      return response.data.map(item => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        descripcion: item.descripcion,
        categoria: item.categoria,
        cantidadDisponible: item.cantidadDisponible,
        cantidadMinima: item.cantidadMinima,
        precioCompra: item.precioCompra,
        precioVenta: item.precioVenta,
        estado: item.estado,
        ubicacion: item.ubicacion,
        vehiculosCompatibles: item.vehiculosCompatibles || [],
        fechaUltimaEntrada: item.fechaUltimaEntrada,
        fechaUltimaSalida: item.fechaUltimaSalida
      }));
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
      throw error;
    }
  }
  
  // Obtener un repuesto por su ID
  async getRepuestoPorId(id) {
    try {
      const response = await api.get(`/inventario/${id}`);
      const item = response.data;
      
      return {
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        descripcion: item.descripcion,
        categoria: item.categoria,
        cantidadDisponible: item.cantidadDisponible,
        cantidadMinima: item.cantidadMinima,
        precioCompra: item.precioCompra,
        precioVenta: item.precioVenta,
        estado: item.estado,
        ubicacion: item.ubicacion,
        vehiculosCompatibles: item.vehiculosCompatibles || [],
        fechaUltimaEntrada: item.fechaUltimaEntrada,
        fechaUltimaSalida: item.fechaUltimaSalida
      };
    } catch (error) {
      console.error('Error al obtener el repuesto:', error);
      throw error;
    }
  }
  
  // Crear un nuevo repuesto
  async crearRepuesto(repuestoData) {
    try {
      const response = await api.post('/inventario_repuestos', repuestoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el repuesto:', error);
      throw error;
    }
  }
  
  // Actualizar un repuesto existente
  async actualizarRepuesto(id, repuestoData) {
    try {
      const response = await api.put(`/inventario_repuestos/${id}`, repuestoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el repuesto:', error);
      throw error;
    }
  }
  
  // Eliminar un repuesto
  async eliminarRepuesto(id) {
    try {
      await api.delete(`/inventario_repuestos/${id}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar el repuesto:', error);
      throw error;
    }
  }
  
  // Obtener historial de movimientos de un repuesto
  async getHistorialRepuesto(id) {
    try {
      const response = await api.get('/historial_repuestos', {
        params: {
          repuestoId: id,
          _sort: 'fecha:desc'
        }
      });
      
      return response.data.map(item => ({
        id: item.id,
        fecha: item.fecha,
        tipo: item.tipo,
        cantidad: item.cantidad,
        motivo: item.motivo,
        usuario: item.usuario,
        observaciones: item.observaciones
      }));
    } catch (error) {
      console.error('Error al obtener el historial del repuesto:', error);
      throw error;
    }
  }
  
  // Obtener repuestos con stock bajo
  async getRepuestosStockBajo() {
    try {
      const response = await api.get('/inventario/critico');
      return response.data.map(item => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        cantidadDisponible: item.cantidadDisponible,
        cantidadMinima: item.cantidadMinima,
        estado: item.estado,
        ubicacion: item.ubicacion
      }));
    } catch (error) {
      console.error('Error al obtener repuestos con stock bajo:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new InventarioService();
