import api from './axios';

const inventarioService = {
  // =============================================
  // MÉTODOS PARA REPUESTOS
  // =============================================
  
  // Obtener todos los repuestos con filtros opcionales
  async getRepuestos(filtros = {}) {
    try {
      const params = { ...filtros };
      
      // Convertir valores numéricos
      if (params.vehiculo_id) params.vehiculo_id = Number(params.vehiculo_id);
      if (params.categoria_id) params.categoria_id = Number(params.categoria_id);
      if (params.stock_min) params.stock_min = Number(params.stock_min);
      if (params.stock_max) params.stock_max = Number(params.stock_max);
      if (params.precio_min) params.precio_min = parseFloat(params.precio_min);
      if (params.precio_max) params.precio_max = parseFloat(params.precio_max);
      
      const response = await api.get('/inventario/repuestos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener repuestos:', error);
      throw error;
    }
  },

  // Obtener un repuesto por ID con información completa
  async getRepuestoById(id) {
    try {
      const response = await api.get(`/inventario/repuestos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el repuesto con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo repuesto
  async createRepuesto(repuestoData) {
    try {
      // Asegurar que los campos numéricos sean números
      const payload = {
        ...repuestoData,
        vehiculo_id: repuestoData.vehiculo_id ? Number(repuestoData.vehiculo_id) : null,
        categoria_id: repuestoData.categoria_id ? Number(repuestoData.categoria_id) : null,
        stock: repuestoData.stock ? Number(repuestoData.stock) : 0,
        stock_minimo: repuestoData.stock_minimo ? Number(repuestoData.stock_minimo) : 0,
        precio_compra: parseFloat(repuestoData.precio_compra || 0),
        precio_venta: parseFloat(repuestoData.precio_venta || 0),
        ubicacion: repuestoData.ubicacion || 'ALMACEN PRINCIPAL',
        estado: repuestoData.estado || 'DISPONIBLE',
        notas: repuestoData.notas || ''
      };
      
      const response = await api.post('/inventario/repuestos', payload);
      return response.data;
    } catch (error) {
      console.error('Error al crear el repuesto:', error);
      throw error;
    }
  },

  // Actualizar un repuesto existente
  async updateRepuesto(id, repuestoData) {
    try {
      // Asegurar que los campos numéricos sean números
      const payload = {
        ...repuestoData,
        vehiculo_id: repuestoData.vehiculo_id ? Number(repuestoData.vehiculo_id) : null,
        categoria_id: repuestoData.categoria_id ? Number(repuestoData.categoria_id) : null,
        stock: repuestoData.stock !== undefined ? Number(repuestoData.stock) : undefined,
        stock_minimo: repuestoData.stock_minimo !== undefined ? Number(repuestoData.stock_minimo) : undefined,
        precio_compra: repuestoData.precio_compra !== undefined ? parseFloat(repuestoData.precio_compra) : undefined,
        precio_venta: repuestoData.precio_venta !== undefined ? parseFloat(repuestoData.precio_venta) : undefined
      };
      
      const response = await api.put(`/inventario/repuestos/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el repuesto con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un repuesto (eliminación lógica)
  async deleteRepuesto(id) {
    try {
      const response = await api.delete(`/inventario/repuestos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el repuesto con ID ${id}:`, error);
      throw error;
    }
  },

  // Actualizar el stock de un repuesto
  async actualizarStock(id, cantidad, motivo = 'AJUSTE', notas = '') {
    try {
      const response = await api.patch(
        `/inventario/repuestos/${id}/stock`, 
        { 
          cantidad: Number(cantidad),
          motivo,
          notas
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el stock del repuesto con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener movimientos de inventario de un repuesto
  async getMovimientosRepuesto(repuestoId, params = {}) {
    try {
      const response = await api.get(
        `/inventario/repuestos/${repuestoId}/movimientos`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener movimientos del repuesto ${repuestoId}:`, error);
      throw error;
    }
  },

  // =============================================
  // MÉTODOS PARA CATEGORÍAS DE REPUESTOS
  // =============================================
  
  // Obtener todas las categorías de repuestos
  async getCategoriasRepuestos() {
    try {
      const response = await api.get('/inventario/categorias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías de repuestos:', error);
      throw error;
    }
  },

  // Crear una nueva categoría de repuesto
  async createCategoriaRepuesto(categoriaData) {
    try {
      const response = await api.post('/inventario/categorias', {
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion || '',
        activa: categoriaData.activa !== false // Por defecto true si no se especifica
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear categoría de repuesto:', error);
      throw error;
    }
  },

  // Actualizar una categoría de repuesto existente
  async updateCategoriaRepuesto(id, categoriaData) {
    try {
      const response = await api.put(`/inventario/categorias/${id}`, categoriaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la categoría con ID ${id}:`, error);
      throw error;
    }
  },

  // =============================================
  // MÉTODOS PARA INVENTARIO FÍSICO
  // =============================================
  
  // Realizar un conteo físico de inventario
  async realizarConteoFisico(conteoData) {
    try {
      const response = await api.post('/inventario/conteo-fisico', conteoData);
      return response.data;
    } catch (error) {
      console.error('Error al realizar conteo físico:', error);
      throw error;
    }
  },

  // Obtener historial de conteos físicos
  async getHistorialConteos(params = {}) {
    try {
      const response = await api.get('/inventario/conteo-fisico/historial', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de conteos:', error);
      throw error;
    }
  },

  // =============================================
  // MÉTODOS PARA REPORTES
  // =============================================
  
  // Obtener reporte de inventario
  async getReporteInventario(params = {}) {
    try {
      const response = await api.get('/inventario/reportes/inventario', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de inventario:', error);
      throw error;
    }
  },

  // Obtener reporte de repuestos críticos (stock bajo mínimo)
  async getRepuestosCriticos(params = {}) {
    try {
      const response = await api.get('/inventario/reportes/criticos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener repuestos críticos:', error);
      throw error;
    }
  },

  // Obtener reporte de movimientos de inventario
  async getReporteMovimientos(params = {}) {
    try {
      const response = await api.get('/inventario/reportes/movimientos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de movimientos:', error);
      throw error;
    }
  }
};

export default inventarioService;
