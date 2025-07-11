// API simulada para desarrollo
import {
  marcas,
  modelos,
  generaciones,
  vehiculos,
  inventario,
  empleados,
  transacciones,
  tiposTransacciones,
} from './mockData';

// Función para simular retraso de red
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para simular respuesta exitosa
const successResponse = (data, status = 200) => ({
  status,
  data,
});

// Función para simular error
const errorResponse = (message, status = 404) => ({
  status,
  error: { message },
});

// Simulación de API
export const mockApi = {
  // ===== VEHÍCULOS =====
  getVehiculos: async () => {
    await delay(500);
    return successResponse(vehiculos);
  },
  
  getVehiculoById: async (id) => {
    await delay(300);
    const vehiculo = vehiculos.find(v => v.id === parseInt(id));
    if (!vehiculo) return errorResponse('Vehículo no encontrado');
    return successResponse(vehiculo);
  },
  
  createVehiculo: async (vehiculoData) => {
    await delay(500);
    const newId = Math.max(...vehiculos.map(v => v.id), 0) + 1;
    const newVehiculo = { ...vehiculoData, id: newId, activo: true };
    vehiculos.push(newVehiculo);
    return successResponse(newVehiculo, 201);
  },
  
  updateVehiculo: async (id, vehiculoData) => {
    await delay(500);
    const index = vehiculos.findIndex(v => v.id === parseInt(id));
    if (index === -1) return errorResponse('Vehículo no encontrado');
    
    const updatedVehiculo = { ...vehiculos[index], ...vehiculoData };
    vehiculos[index] = updatedVehiculo;
    return successResponse(updatedVehiculo);
  },
  
  deleteVehiculo: async (id) => {
    await delay(500);
    const index = vehiculos.findIndex(v => v.id === parseInt(id));
    if (index === -1) return errorResponse('Vehículo no encontrado');
    
    // Borrado lógico
    vehiculos[index].activo = false;
    return successResponse({ id, message: 'Vehículo desactivado correctamente' });
  },
  
  // ===== INVENTARIO =====
  getInventario: async () => {
    await delay(500);
    return successResponse(inventario);
  },
  
  getRepuestoById: async (id) => {
    await delay(300);
    const repuesto = inventario.find(r => r.id === parseInt(id));
    if (!repuesto) return errorResponse('Repuesto no encontrado');
    return successResponse(repuesto);
  },
  
  createRepuesto: async (repuestoData) => {
    await delay(500);
    const newId = Math.max(...inventario.map(r => r.id), 0) + 1;
    const newRepuesto = { ...repuestoData, id: newId, estado: 'STOCK' };
    inventario.push(newRepuesto);
    return successResponse(newRepuesto, 201);
  },
  
  updateRepuesto: async (id, repuestoData) => {
    await delay(500);
    const index = inventario.findIndex(r => r.id === parseInt(id));
    if (index === -1) return errorResponse('Repuesto no encontrado');
    
    const updatedRepuesto = { ...inventario[index], ...repuestoData };
    inventario[index] = updatedRepuesto;
    return successResponse(updatedRepuesto);
  },
  
  // ===== FINANZAS =====
  getTransacciones: async (filtros = {}) => {
    await delay(500);
    let resultado = [...transacciones];
    
    // Aplicar filtros si existen
    if (filtros.fechaInicio) {
      resultado = resultado.filter(t => new Date(t.fecha) >= new Date(filtros.fechaInicio));
    }
    if (filtros.fechaFin) {
      resultado = resultado.filter(t => new Date(t.fecha) <= new Date(filtros.fechaFin));
    }
    if (filtros.tipo) {
      resultado = resultado.filter(t => t.tipo_transaccion_id === parseInt(filtros.tipo));
    }
    
    return successResponse(resultado);
  },
  
  createTransaccion: async (transaccionData) => {
    await delay(500);
    const newId = Math.max(...transacciones.map(t => t.id), 0) + 1;
    const newTransaccion = { 
      ...transaccionData, 
      id: newId, 
      estado: 'COMPLETADA',
      activo: true 
    };
    
    transacciones.push(newTransaccion);
    return successResponse(newTransaccion, 201);
  },
  
  // ===== CATÁLOGOS =====
  getMarcas: async () => {
    await delay(300);
    return successResponse(marcas);
  },
  
  getModelos: async (marcaId) => {
    await delay(300);
    const modelosFiltrados = modelos.filter(m => m.marca_id === parseInt(marcaId));
    return successResponse(modelosFiltrados);
  },
  
  getGeneraciones: async (modeloId) => {
    await delay(300);
    const generacionesFiltradas = generaciones.filter(g => g.modelo_id === parseInt(modeloId));
    return successResponse(generacionesFiltradas);
  },
  
  getVendedores: async () => {
    await delay(300);
    return successResponse(empleados);
  },
  
  getTiposTransacciones: async () => {
    await delay(300);
    return successResponse(tiposTransacciones);
  },
  
  // ===== REPORTES =====
  getResumenFinanciero: async () => {
    await delay(500);
    
    const ingresos = transacciones
      .filter(t => t.estado === 'COMPLETADA' && tiposTransacciones.find(tt => tt.id === t.tipo_transaccion_id)?.categoria === 'INGRESO')
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);
    
    const egresos = transacciones
      .filter(t => t.estado === 'COMPLETADA' && tiposTransacciones.find(tt => tt.id === t.tipo_transaccion_id)?.categoria === 'EGRESO')
      .reduce((sum, t) => sum + parseFloat(t.monto), 0);
    
    const ventasPorVendedor = empleados.map(empleado => {
      const ventas = transacciones.filter(t => 
        t.empleado_id === empleado.id && 
        t.estado === 'COMPLETADA' &&
        tiposTransacciones.find(tt => tt.id === t.tipo_transaccion_id)?.categoria === 'INGRESO'
      );
      
      const totalVentas = ventas.reduce((sum, t) => sum + parseFloat(t.monto), 0);
      const comisiones = ventas.reduce((sum, t) => sum + (parseFloat(t.comision_empleado) || 0), 0);
      
      return {
        vendedor: empleado.nombre,
        cantidadVentas: ventas.length,
        totalVentas,
        comisiones,
      };
    });
    
    return successResponse({
      ingresosTotales: ingresos,
      egresosTotales: egresos,
      balance: ingresos - egresos,
      totalVentas: transacciones.filter(t => 
        t.estado === 'COMPLETADA' && 
        tiposTransacciones.find(tt => tt.id === t.tipo_transaccion_id)?.categoria === 'INGRESO'
      ).length,
      ventasPorVendedor,
    });
  },
};

export default mockApi;
