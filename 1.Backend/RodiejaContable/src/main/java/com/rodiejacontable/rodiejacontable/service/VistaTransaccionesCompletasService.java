package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.rodiejacontable.repository.VistaTransaccionesCompletasRepository;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasCategoria;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasEstado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class VistaTransaccionesCompletasService {

    private final VistaTransaccionesCompletasRepository repository;

    @Autowired
    public VistaTransaccionesCompletasService(VistaTransaccionesCompletasRepository repository) {
        this.repository = repository;
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findAll() {
        return repository.findAll();
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByFechaBetween(
            LocalDate fechaInicio, LocalDate fechaFin) {
        return repository.findByFechaBetween(fechaInicio, fechaFin);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByCategoria(
            VistaTransaccionesCompletasCategoria categoria) {
        return repository.findByCategoria(categoria);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByEstado(
            VistaTransaccionesCompletasEstado estado) {
        return repository.findByEstado(estado);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByEmpleado(String empleado) {
        return repository.findByEmpleado(empleado);
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByTipoTransaccion(String tipo) {
        return repository.findByTipoTransaccion(tipo);
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByVehiculo(String placa) {
        return repository.findByVehiculo(placa);
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByMontoGreaterThanEqual(BigDecimal montoMinimo) {
        return repository.findByMontoGreaterThanEqual(montoMinimo);
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByMontoLessThanEqual(BigDecimal montoMaximo) {
        return repository.findByMontoLessThanEqual(montoMaximo);
    }
    
    public Map<String, Object> getEstadisticas() {
        return repository.getEstadisticas();
    }

    public Map<String, Object> getResumenPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        BigDecimal totalIngresos = repository.getTotalIngresosPorRangoFechas(fechaInicio, fechaFin);
        BigDecimal totalEgresos = repository.getTotalEgresosPorRangoFechas(fechaInicio, fechaFin);
        BigDecimal balance = (totalIngresos != null ? totalIngresos : BigDecimal.ZERO)
                .subtract(totalEgresos != null ? totalEgresos : BigDecimal.ZERO);

        return Map.of(
                "fechaInicio", fechaInicio,
                "fechaFin", fechaFin,
                "totalIngresos", totalIngresos != null ? totalIngresos : BigDecimal.ZERO,
                "totalEgresos", totalEgresos != null ? totalEgresos : BigDecimal.ZERO,
                "balance", balance
        );
    }

    public Map<String, Object> getEstadisticasPorEmpleado(String empleado) {
        List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> transacciones = 
            repository.findByEmpleado(empleado);

        BigDecimal totalVentas = transacciones.stream()
                .filter(t -> t.getCategoria() == VistaTransaccionesCompletasCategoria.INGRESO)
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalComisiones = transacciones.stream()
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas::getComisionEmpleado)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b != null ? b : BigDecimal.ZERO));

        long totalTransacciones = transacciones.size();

        return Map.of(
                "empleado", empleado,
                "totalVentas", totalVentas,
                "totalComisiones", totalComisiones,
                "totalTransacciones", totalTransacciones
        );
    }
    
    /**
     * Busca transacciones aplicando múltiples filtros opcionales.
     * 
     * @param categoria Categoría de la transacción (opcional)
     * @param estado Estado de la transacción (opcional)
     * @param fechaInicio Fecha de inicio para el rango de fechas (opcional)
     * @param fechaFin Fecha de fin para el rango de fechas (opcional)
     * @return Lista de transacciones que coinciden con los filtros especificados
     */
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> buscarConFiltros(
            String categoria, 
            String estado, 
            LocalDate fechaInicio, 
            LocalDate fechaFin) {
        
        // Si no hay filtros, devolver todas las transacciones
        if (categoria == null && estado == null && fechaInicio == null && fechaFin == null) {
            return repository.findAll();
        }
        
        // Convertir los parámetros a los tipos correctos
        VistaTransaccionesCompletasCategoria categoriaEnum = null;
        if (categoria != null) {
            try {
                categoriaEnum = VistaTransaccionesCompletasCategoria.valueOf(categoria);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Categoría no válida: " + categoria + 
                    ". Las categorías válidas son: " + 
                    Arrays.toString(VistaTransaccionesCompletasCategoria.values()));
            }
        }
        
        VistaTransaccionesCompletasEstado estadoEnum = null;
        if (estado != null) {
            try {
                estadoEnum = VistaTransaccionesCompletasEstado.valueOf(estado);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Estado no válido: " + estado + 
                    ". Los estados válidos son: " + 
                    Arrays.toString(VistaTransaccionesCompletasEstado.values()));
            }
        }
        
        // Si solo hay un filtro, usar el método específico
        if (categoria != null && estado == null && fechaInicio == null && fechaFin == null) {
            return repository.findByCategoria(categoriaEnum);
        }
        
        if (estado != null && categoria == null && fechaInicio == null && fechaFin == null) {
            return repository.findByEstado(estadoEnum);
        }
        
        if (fechaInicio != null && fechaFin != null && categoria == null && estado == null) {
            return repository.findByFechaBetween(fechaInicio, fechaFin);
        }
        
        // Si hay múltiples filtros, usar el método de búsqueda con múltiples parámetros
        return repository.buscarConFiltros(categoriaEnum, estadoEnum, fechaInicio, fechaFin);
    }
}
