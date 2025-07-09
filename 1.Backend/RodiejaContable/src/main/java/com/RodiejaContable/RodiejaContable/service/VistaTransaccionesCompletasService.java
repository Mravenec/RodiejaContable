package com.RodiejaContable.RodiejaContable.service;

import com.RodiejaContable.RodiejaContable.repository.VistaTransaccionesCompletasRepository;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasCategoria;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasEstado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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
}
