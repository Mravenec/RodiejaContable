package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.rodiejacontable.exception.EmpleadoNoEncontradoException;
import com.rodiejacontable.rodiejacontable.repository.VistaVentasPorEmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class VistaVentasPorEmpleadoService {

    private final VistaVentasPorEmpleadoRepository repository;

    @Autowired
    public VistaVentasPorEmpleadoService(VistaVentasPorEmpleadoRepository repository) {
        this.repository = repository;
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findAll() {
        return repository.findAll();
    }

    public com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado findByEmpleado(String empleado) {
        return repository.findByEmpleado(empleado)
                .orElseThrow(() -> new EmpleadoNoEncontradoException("No se encontraron ventas para el empleado: " + empleado));
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findTopNVentas(int limit) {
        return repository.findTopNVentas(limit);
    }

    public List<String> findAllEmpleados() {
        return repository.findAllEmpleados();
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findByEmpleadoAndRangoFechas(
            String empleado, LocalDate fechaInicio, LocalDate fechaFin) {
        List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> resultados = 
            repository.findByEmpleadoAndRangoFechas(empleado, fechaInicio, fechaFin);
            
        if (resultados.isEmpty()) {
            throw new EmpleadoNoEncontradoException("No se encontraron registros para el empleado: " + empleado + 
                " en el rango de fechas especificado");
        }
        
        return resultados;
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findByRangoFechas(
            LocalDate fechaInicio, LocalDate fechaFin) {
        return repository.findByRangoFechas(fechaInicio, fechaFin);
    }
    
    @SuppressWarnings("unchecked")
    public Map<String, Object> getEstadisticasGenerales() {
        List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> ventas = repository.findAll();
        
        BigDecimal totalVentas = ventas.stream()
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado::getTotalVentas)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalComisiones = ventas.stream()
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado::getTotalComisiones)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b != null ? b : BigDecimal.ZERO));
                
        long totalTransacciones = ventas.stream()
                .mapToLong(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado::getTotalTransacciones)
                .sum();
                
        long totalVentasCount = ventas.stream()
                .mapToLong(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado::getTransaccionesVenta)
                .sum();
                
        BigDecimal promedioVenta = totalVentasCount > 0 ? 
                totalVentas.divide(BigDecimal.valueOf(totalVentasCount), 2, BigDecimal.ROUND_HALF_UP) : 
                BigDecimal.ZERO;
        
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("totalVentas", totalVentas);
        result.put("totalComisiones", totalComisiones);
        result.put("totalTransacciones", totalTransacciones);
        result.put("totalVentasCount", totalVentasCount);
        result.put("promedioVenta", promedioVenta);
        result.put("totalEmpleados", ventas.size());
        
        return (Map<String, Object>)(Map<?, ?>)result;
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findByTipoProducto(String tipo) {
        return repository.findByTipoProducto(tipo);
    }
    
    /**
     * Obtiene las ventas mensuales por empleado para un año específico
     * @param year Año para el cual se desean obtener las ventas
     * @return Lista de ventas mensuales por empleado
     */
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> getVentasMensualesPorEmpleado(int year) {
        return repository.findVentasMensualesPorEmpleado(year);
    }
    
    /**
     * Compara las ventas entre múltiples empleados en un rango de fechas
     * @param empleados Lista de nombres de empleados a comparar
     * @param fechaInicio Fecha de inicio del rango
     * @param fechaFin Fecha de fin del rango
     * @return Lista de ventas comparativas por empleado
     */
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> compareVentasEntreEmpleados(
            List<String> empleados, LocalDate fechaInicio, LocalDate fechaFin) {
        if (empleados == null || empleados.isEmpty()) {
            throw new IllegalArgumentException("La lista de empleados no puede estar vacía");
        }
        
        if (fechaInicio == null || fechaFin == null) {
            throw new IllegalArgumentException("Las fechas de inicio y fin son obligatorias");
        }
        
        if (fechaInicio.isAfter(fechaFin)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
        
        List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> resultados = 
            repository.findVentasComparativas(empleados, fechaInicio, fechaFin);
            
        if (resultados.isEmpty()) {
            throw new EmpleadoNoEncontradoException("No se encontraron ventas para los empleados especificados en el rango de fechas proporcionado");
        }
        
        return resultados;
    }
    
    @SuppressWarnings("unchecked")
    public Map<String, Object> getEstadisticasPorEmpleado(String empleado) {
        return repository.findByEmpleado(empleado)
                .map(v -> {
                    Map<String, Object> result = new java.util.HashMap<>();
                    result.put("empleado", v.getEmpleado());
                    result.put("totalVentas", v.getTotalVentas());
                    result.put("totalComisiones", v.getTotalComisiones());
                    result.put("totalTransacciones", v.getTotalTransacciones());
                    result.put("transaccionesVenta", v.getTransaccionesVenta());
                    result.put("promedioVenta", v.getPromedioVenta());
                    result.put("porcentajeComision", v.getPorcentajeComision());
                    return (Map<String, Object>)(Map<?, ?>)result;
                })
                .orElse(createErrorMap("Empleado no encontrado"));
    }
    
    @SuppressWarnings("unchecked")
    private Map<String, Object> createErrorMap(String message) {
        Map<String, Object> errorMap = new java.util.HashMap<>();
        errorMap.put("error", message);
        return (Map<String, Object>)(Map<?, ?>)errorMap;
    }
}
