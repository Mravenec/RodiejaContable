import { useState, useCallback } from 'react';
import { message } from 'antd';
import moment from 'moment';
import pagosComisionesService from '../api/pagosComisiones';

const usePagosComisiones = (empleados = []) => {
  const [pagosComisiones, setPagosComisiones] = useState({});
  const [loadingPagos, setLoadingPagos] = useState(false);
  const [pagoModalVisible, setPagoModalVisible] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  // Función para cargar estado de pagos de comisiones
  const cargarEstadoPagos = useCallback(async (anio, mes) => {
    console.log('🔍 [PAGOS] Iniciando cargarEstadoPagos con:', { anio, mes });
    
    if (!anio || !mes) {
      console.log('🔍 [PAGOS] No hay año o mes, limpiando estado');
      setPagosComisiones({});
      return;
    }

    try {
      console.log('🔍 [PAGOS] Haciendo llamada a API de pagos PAGADOS...');
      
      // Solo usar la API de estado PAGADO que sabemos que funciona
      const response = await pagosComisionesService.getPagosPorEstado('PAGADO');
      
      console.log('🔍 [PAGOS] Respuesta PAGADOS:', response);
      
      // Convertir el array de respuestas a un objeto clave-valor
      const estadoPagosMap = {};
      
      if (Array.isArray(response)) {
        console.log('🔍 [PAGOS] Procesando', response.length, 'pagos PAGADOS');
        response.forEach(pago => {
          console.log('🔍 [PAGOS] Procesando pago:', pago);
          
          // Verificar si el pago corresponde al mismo período
          if (pago.anio === anio && pago.mes === mes) {
            console.log('🔍 [PAGOS] Pago coincide con período', anio, mes);
            
            // Buscar el nombre del empleado usando el empleadoId
            const empleado = empleados.find(emp => emp.id === pago.empleadoId);
            console.log('🔍 [PAGOS] Empleado encontrado para ID', pago.empleadoId, ':', empleado);
            
            if (empleado) {
              // Usar el campo correcto 'nombre' que viene de la API
              const nombreEmpleado = empleado.nombre;
              console.log('🔍 [PAGOS] Usando nombre:', nombreEmpleado);
              
              if (nombreEmpleado) {
                estadoPagosMap[nombreEmpleado] = 'PAGADO';
                console.log('🔍 [PAGOS] Mapeado:', nombreEmpleado, '-> PAGADO');
              }
            } else {
              console.warn('⚠️ [PAGOS] No se encontró empleado para ID:', pago.empleadoId);
              console.log('🔍 [PAGOS] Empleados disponibles:', empleados.map(e => ({ id: e.id, nombre: e.nombre })));
            }
          } else {
            console.log('🔍 [PAGOS] Pago no coincide con período:', pago.anio, pago.mes, 'vs', anio, mes);
          }
        });
      } else {
        console.warn('⚠️ [PAGOS] response no es array:', response);
      }
      
      console.log('🔍 [PAGOS] Estado final:', estadoPagosMap);
      setPagosComisiones(estadoPagosMap);
    } catch (error) {
      console.error('❌ [PAGOS] Error al cargar estado de pagos:', error);
      setPagosComisiones({});
    }
  }, [empleados]);

  // Función para procesar pago de comisiones
  const procesarPago = useCallback(async (empleado, anio, mes) => {
    if (!empleado || !anio || !mes) {
      message.error('Información incompleta para procesar el pago');
      return;
    }

    try {
      setLoadingPagos(true);
      
      // Obtener el ID real del empleado desde comisiones pendientes
      let empleadoId = null;
      
      try {
        const comisionesPendientes = await pagosComisionesService.getComisionesPendientes(anio, mes);
        const comisionEmpleado = comisionesPendientes.find(c => c.nombreEmpleado === empleado.empleado);
        
        if (comisionEmpleado && comisionEmpleado.empleadoId) {
          empleadoId = comisionEmpleado.empleadoId;
        }
      } catch (error) {
        console.error('Error al obtener comisiones pendientes:', error);
      }
      
      // Si no encuentra en comisiones pendientes, usar fallback
      if (!empleadoId) {
        const empleadoCompleto = empleados.find(emp => 
          emp.nombre === empleado.empleado
        );
        empleadoId = empleadoCompleto?.id;
      }
      
      if (!empleadoId) {
        message.error(`No se pudo identificar el ID del empleado: ${empleado.empleado}`);
        return;
      }
      
      // Verificar si tiene comisiones pendientes
      const comisionesPendientes = await pagosComisionesService.getComisionesPendientes(anio, mes);
      const tieneComisionesPendientes = comisionesPendientes.some(p => p.empleadoId === empleadoId);
      
      if (!tieneComisionesPendientes) {
        message.warning(`El empleado ${empleado.empleado} no tiene comisiones pendientes para ${moment([anio, mes - 1]).format('MMMM YYYY')}.`);
        return;
      }
      
      // Procesar el pago
      const pagoData = {
        empleadoId: empleadoId,
        anio: anio,
        mes: mes,
        fechaPago: moment().format('YYYY-MM-DD'),
        referencia: `CHEQUE-${empleadoId}-${Date.now()}`,
        notas: `Pago comisiones ${moment([anio, mes - 1]).format('MMMM YYYY')}`
      };

      await pagosComisionesService.registrarPago(pagoData);
      message.success(`Pago de comisiones registrado para ${empleado.empleado}`);
      
      // Actualizar estados
      await cargarEstadoPagos(anio, mes);
      
      setPagoModalVisible(false);
      setEmpleadoSeleccionado(null);
      
      return true; // Indicar que el pago fue exitoso
    } catch (error) {
      console.error('Error al procesar pago:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.mensaje || 'No se puede procesar el pago';
        
        if (errorMessage.includes('No hay comisiones pendientes')) {
          message.warning({
            content: 'Este empleado no tiene comisiones pendientes para este período. Verifique que tenga ventas registradas.',
            duration: 5
          });
        } else if (errorMessage.includes('duplicado')) {
          message.error('El pago ya ha sido registrado para este empleado en este período.');
        } else {
          message.error(errorMessage);
        }
      } else if (error.response?.status === 404) {
        message.error('El servicio de pagos no está disponible. Contacte al administrador.');
      } else {
        message.error('Error al procesar el pago. Intente nuevamente.');
      }
      return false; // Indicar que el pago falló
    } finally {
      setLoadingPagos(false);
    }
  }, [empleados, cargarEstadoPagos]);

  // Función para mostrar diálogo de confirmación de pago
  const mostrarDialogoPago = useCallback((empleado) => {
    setEmpleadoSeleccionado(empleado);
    setPagoModalVisible(true);
  }, []);

  // Función para cancelar diálogo de pago
  const cancelarPago = useCallback(() => {
    setPagoModalVisible(false);
    setEmpleadoSeleccionado(null);
  }, []);

  // Función para obtener el estado de pago de un empleado
  const getEstadoPago = useCallback((nombreEmpleado) => {
    return pagosComisiones[nombreEmpleado] || 'PENDIENTE';
  }, [pagosComisiones]);

  // Función para verificar si un empleado ya está pagado
  const estaPagado = useCallback((nombreEmpleado) => {
    const estado = getEstadoPago(nombreEmpleado);
    return estado === 'PAGADO';
  }, [getEstadoPago]);

  return {
    // Estado
    pagosComisiones,
    loadingPagos,
    pagoModalVisible,
    empleadoSeleccionado,
    
    // Funciones
    cargarEstadoPagos,
    procesarPago,
    mostrarDialogoPago,
    cancelarPago,
    getEstadoPago,
    estaPagado,
    
    // Setters
    setPagoModalVisible,
    setEmpleadoSeleccionado,
  };
};

export default usePagosComisiones;
