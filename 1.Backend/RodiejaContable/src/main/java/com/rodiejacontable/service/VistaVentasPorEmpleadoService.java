package com.rodiejacontable.service;

import com.rodiejacontable.repository.VistaVentasPorEmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    public Optional<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findByEmpleado(String empleado) {
        return repository.findByEmpleado(empleado);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findTopNVentas(int limit) {
        return repository.findTopNVentas(limit);
    }

    public List<String> findAllEmpleados() {
        return repository.findAllEmpleados();
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
