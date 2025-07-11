// api.js - Punto de entrada centralizado para todos los servicios de API

// Importar configuración de axios con interceptores
import api from './axios';

// Importar servicios
import * as authService from './auth';
import * as vehiculoService from './vehiculos';
import * as inventarioService from './inventario';
import * as finanzasService from './finanzas';
import * as reportesService from './reportes';
import * as transaccionesService from './transacciones';
import * as catalogoVehiculosService from './catalogoVehiculos';

// Exportar todos los servicios
export {
  api,
  authService,
  vehiculoService,
  inventarioService,
  finanzasService,
  reportesService,
  transaccionesService,
  catalogoVehiculosService
};
