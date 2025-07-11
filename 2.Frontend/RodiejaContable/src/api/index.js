// Re-exportar todos los servicios de API
export * from './auth';
export * from './vehiculos';
export * from './inventario';
export * from './finanzas';
export * from './reportes';
export * from './catalogoVehiculos';

// Exportar la instancia de axios configurada
export { default as api } from './axios';
