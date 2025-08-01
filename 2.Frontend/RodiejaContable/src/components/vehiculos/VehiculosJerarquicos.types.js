import PropTypes from 'prop-types';

export const vehiculoShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  codigoVehiculo: PropTypes.string,
  anio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  estado: PropTypes.string.isRequired,
  inversionTotal: PropTypes.number,
  notas: PropTypes.string,
  // Agrega más campos según sea necesario
});

export const transaccionShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  monto: PropTypes.number.isRequired,
  fecha: PropTypes.string.isRequired,
  descripcion: PropTypes.string,
  tipo_transaccion: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nombre: PropTypes.string,
    categoria: PropTypes.oneOf(['INGRESO', 'EGRESO']),
  }),
});

export const generacionShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nombre: PropTypes.string.isRequired,
  descripcion: PropTypes.string,
  anioInicio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anioFin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalInversion: PropTypes.number,
  totalIngresos: PropTypes.number,
  totalEgresos: PropTypes.number,
  balanceNeto: PropTypes.number,
  vehiculos: PropTypes.arrayOf(vehiculoShape),
});

export const modeloShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nombre: PropTypes.string.isRequired,
  generaciones: PropTypes.arrayOf(generacionShape),
});

export const marcaShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nombre: PropTypes.string.isRequired,
  modelos: PropTypes.arrayOf(modeloShape),
});

// Este archivo solo exporta shapes para validación de tipos
// No es necesario exportar PropTypes para el componente principal aquí
