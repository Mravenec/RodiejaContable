// Datos de ejemplo para simular la API

export const marcas = [
  { id: 1, nombre: 'Toyota', activo: true },
  { id: 2, nombre: 'Honda', activo: true },
  { id: 3, nombre: 'Hyundai', activo: true },
  { id: 4, nombre: 'Ford', activo: true },
  { id: 5, nombre: 'Mitsubishi', activo: true },
  { id: 6, nombre: 'Kia', activo: true },
];

export const modelos = [
  // Toyota
  { id: 1, marca_id: 1, nombre: 'Corolla', activo: true },
  { id: 2, marca_id: 1, nombre: 'Hilux', activo: true },
  // Honda
  { id: 3, marca_id: 2, nombre: 'Civic', activo: true },
  { id: 4, marca_id: 2, nombre: 'CR-V', activo: true },
  // Hyundai
  { id: 5, marca_id: 3, nombre: 'Tucson', activo: true },
  // Ford
  { id: 6, marca_id: 4, nombre: 'Ranger', activo: true },
  // Mitsubishi
  { id: 7, marca_id: 5, nombre: 'L200/Tritón', activo: true },
  // Kia
  { id: 8, marca_id: 6, nombre: 'Sportage', activo: true },
];

export const generaciones = [
  // Toyota Corolla
  { id: 1, modelo_id: 1, nombre: 'Generación 10 (E140/150)', descripcion: '2006-2013', anio_inicio: 2006, anio_fin: 2013, activo: true },
  { id: 2, modelo_id: 1, nombre: 'Generación 11 (E160/170)', descripcion: '2014-2019', anio_inicio: 2014, anio_fin: 2019, activo: true },
  { id: 3, modelo_id: 1, nombre: 'Generación 12 (E210)', descripcion: '2020-presente', anio_inicio: 2020, anio_fin: 2025, activo: true },
  // Toyota Hilux
  { id: 4, modelo_id: 2, nombre: 'Generación 7 (AN10/AN20)', descripcion: '2005-2015', anio_inicio: 2005, anio_fin: 2015, activo: true },
  // Honda Civic
  { id: 5, modelo_id: 3, nombre: 'Generación 10 (FC)', descripcion: '2016-2021', anio_inicio: 2016, anio_fin: 2021, activo: true },
  // Hyundai Tucson
  { id: 6, modelo_id: 5, nombre: 'Generación 4 (NX4)', descripcion: '2021-presente', anio_inicio: 2021, anio_fin: 2025, activo: true },
];

export const vehiculos = [
  {
    id: 1,
    codigo_vehiculo: 'VH-001',
    generacion_id: 2, // Corolla Gen 11
    anio: 2018,
    precio_compra: 12500000,
    costo_grua: 75000,
    comisiones: 150000,
    fecha_ingreso: '2023-05-15',
    estado: 'DISPONIBLE',
    precio_venta: null,
    fecha_venta: null,
    activo: true,
    notas: 'Vehículo en excelente estado, revisión técnica al día',
  },
  {
    id: 2,
    codigo_vehiculo: 'VH-002',
    generacion_id: 5, // Civic Gen 10
    anio: 2019,
    precio_compra: 14500000,
    costo_grua: 80000,
    comisiones: 180000,
    fecha_ingreso: '2023-06-20',
    estado: 'VENDIDO',
    precio_venta: 15800000,
    fecha_venta: '2023-07-10',
    activo: true,
    notas: 'Vendido a cliente frecuente',
  },
];

export const inventario = [
  {
    id: 1,
    codigo_repuesto: 'RP-001',
    vehiculo_origen_id: 2, // Del Civic vendido
    anio_registro: 2023,
    mes_registro: 7,
    codigo_ubicacion: 'C-Z3-PE-V1-E1-P1-CP1-MM1',
    parte_vehiculo: 'MOTOR',
    descripcion: 'Motor completo 1.8L',
    precio_costo: 2500000,
    precio_venta: 3500000,
    precio_mayoreo: 3200000,
    estado: 'STOCK',
  },
  {
    id: 2,
    codigo_repuesto: 'RP-002',
    vehiculo_origen_id: 2, // Del Civic vendido
    anio_registro: 2023,
    mes_registro: 7,
    codigo_ubicacion: 'C-Z3-PE-V1-E2-P2-CP2-MM2',
    parte_vehiculo: 'TRANSMISION',
    descripcion: 'Caja de cambios automática',
    precio_costo: 1800000,
    precio_venta: 2500000,
    precio_mayoreo: 2300000,
    estado: 'VENDIDO',
  },
];

export const empleados = [
  { id: 1, nombre: 'Juan Pérez', activo: true },
  { id: 2, nombre: 'María Rodríguez', activo: true },
  { id: 3, nombre: 'Carlos López', activo: true },
  { id: 4, nombre: 'Ana Martínez', activo: true },
];

export const transacciones = [
  {
    id: 1,
    codigo_transaccion: 'TXN-001',
    fecha: '2023-07-10',
    tipo_transaccion_id: 1, // Venta
    empleado_id: 1,
    vehiculo_id: 2, // Venta del Civic
    repuesto_id: null,
    generacion_id: 5, // Civic Gen 10
    monto: 15800000,
    comision_empleado: 474000, // 3% de comisión
    descripcion: 'Venta de vehículo completo',
    referencia: 'FACT-001',
    estado: 'COMPLETADA',
    activo: true,
  },
  {
    id: 2,
    codigo_transaccion: 'TXN-002',
    fecha: '2023-08-15',
    tipo_transaccion_id: 4, // Venta de repuesto
    empleado_id: 2,
    vehiculo_id: null,
    repuesto_id: 2, // Caja de cambios
    generacion_id: 5, // Civic Gen 10
    monto: 2500000,
    comision_empleado: 75000, // 3% de comisión
    descripcion: 'Venta de caja de cambios automática',
    referencia: 'FACT-002',
    estado: 'COMPLETADA',
    activo: true,
  },
];

export const tiposTransacciones = [
  { id: 1, nombre: 'Venta de vehículo', descripcion: 'Venta de un vehículo completo', categoria: 'INGRESO', activo: true },
  { id: 2, nombre: 'Compra de vehículo', descripcion: 'Compra de un vehículo', categoria: 'EGRESO', activo: true },
  { id: 3, nombre: 'Gastos operativos', descripcion: 'Gastos generales de operación', categoria: 'EGRESO', activo: true },
  { id: 4, nombre: 'Venta de repuesto', descripcion: 'Venta de repuesto individual', categoria: 'INGRESO', activo: true },
  { id: 5, nombre: 'Compra de repuesto', descripcion: 'Compra de repuesto para inventario', categoria: 'EGRESO', activo: true },
];

// Exportar todo como un objeto para facilitar la importación
export default {
  marcas,
  modelos,
  generaciones,
  vehiculos,
  inventario,
  empleados,
  transacciones,
  tiposTransacciones,
};
