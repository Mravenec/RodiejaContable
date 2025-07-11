package com.rodiejacontable.repository;

import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasCategoria;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasEstado;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import static com.rodiejacontable.database.jooq.Tables.VISTA_TRANSACCIONES_COMPLETAS;

@Repository
public class VistaTransaccionesCompletasRepository {

    private final DSLContext dsl;

    public VistaTransaccionesCompletasRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findAll() {
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.FECHA.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.FECHA.between(fechaInicio, fechaFin))
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.FECHA.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByCategoria(VistaTransaccionesCompletasCategoria categoria) {
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA.eq(categoria))
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.FECHA.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByEstado(VistaTransaccionesCompletasEstado estado) {
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.ESTADO.eq(estado))
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.FECHA.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByEmpleado(String empleado) {
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.EMPLEADO.eq(empleado))
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.FECHA.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
    }

    public BigDecimal getTotalIngresosPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        return dsl.select(DSL.sum(VISTA_TRANSACCIONES_COMPLETAS.MONTO))
                .from(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.FECHA.between(fechaInicio, fechaFin)
                        .and(VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA.eq(VistaTransaccionesCompletasCategoria.INGRESO)))
                .fetchOneInto(BigDecimal.class);
    }

    public BigDecimal getTotalEgresosPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        return dsl.select(DSL.sum(VISTA_TRANSACCIONES_COMPLETAS.MONTO))
                .from(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.FECHA.between(fechaInicio, fechaFin)
                        .and(VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA.eq(VistaTransaccionesCompletasCategoria.EGRESO)))
                .fetchOneInto(BigDecimal.class);
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByTipoTransaccion(String tipo) {
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.TIPO_TRANSACCION.eq(tipo))
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.FECHA.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByVehiculo(String placa) {
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.CODIGO_VEHICULO.eq(placa))
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.FECHA.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByMontoGreaterThanEqual(BigDecimal montoMinimo) {
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.MONTO.greaterOrEqual(montoMinimo))
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.MONTO.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> findByMontoLessThanEqual(BigDecimal montoMaximo) {
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .where(VISTA_TRANSACCIONES_COMPLETAS.MONTO.lessOrEqual(montoMaximo))
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.MONTO.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
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
            VistaTransaccionesCompletasCategoria categoria,
            VistaTransaccionesCompletasEstado estado,
            LocalDate fechaInicio,
            LocalDate fechaFin) {
            
        var condition = DSL.noCondition();
        
        // Aplicar filtros si están presentes
        if (categoria != null) {
            condition = condition.and(VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA.eq(categoria));
        }
        
        if (estado != null) {
            condition = condition.and(VISTA_TRANSACCIONES_COMPLETAS.ESTADO.eq(estado));
        }
        
        if (fechaInicio != null && fechaFin != null) {
            condition = condition.and(VISTA_TRANSACCIONES_COMPLETAS.FECHA.between(fechaInicio, fechaFin));
        } else if (fechaInicio != null) {
            condition = condition.and(VISTA_TRANSACCIONES_COMPLETAS.FECHA.greaterOrEqual(fechaInicio));
        } else if (fechaFin != null) {
            condition = condition.and(VISTA_TRANSACCIONES_COMPLETAS.FECHA.lessOrEqual(fechaFin));
        }
        
        // Construir la consulta con las condiciones
        return dsl.selectFrom(VISTA_TRANSACCIONES_COMPLETAS)
                .where(condition)
                .orderBy(VISTA_TRANSACCIONES_COMPLETAS.FECHA.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas.class);
    }
    
    public Map<String, Object> getEstadisticas() {
        try {
            // Obtener estadísticas generales
            BigDecimal totalIngresos = dsl.select(DSL.coalesce(DSL.sum(VISTA_TRANSACCIONES_COMPLETAS.MONTO), BigDecimal.ZERO))
                    .from(VISTA_TRANSACCIONES_COMPLETAS)
                    .where(VISTA_TRANSACCIONES_COMPLETAS.TIPO_TRANSACCION.eq("INGRESO"))
                    .fetchOneInto(BigDecimal.class);
                    
            BigDecimal totalEgresos = dsl.select(DSL.coalesce(DSL.sum(VISTA_TRANSACCIONES_COMPLETAS.MONTO), BigDecimal.ZERO))
                    .from(VISTA_TRANSACCIONES_COMPLETAS)
                    .where(VISTA_TRANSACCIONES_COMPLETAS.TIPO_TRANSACCION.eq("EGRESO"))
                    .fetchOneInto(BigDecimal.class);
                    
            // Obtener conteo por categoría
            Map<String, Long> conteoPorCategoria = new HashMap<>();
            dsl.select(
                        VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA,
                        DSL.count().as("total"))
                    .from(VISTA_TRANSACCIONES_COMPLETAS)
                    .groupBy(VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA)
                    .fetch()
                    .forEach(record -> {
                        String categoria = record.get(VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA).name();
                        Long total = record.get("total", Long.class);
                        conteoPorCategoria.put(categoria, total);
                    });
                    
            // Obtener total por categoría
            Map<String, BigDecimal> totalPorCategoria = new HashMap<>();
            dsl.select(
                        VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA,
                        DSL.coalesce(DSL.sum(VISTA_TRANSACCIONES_COMPLETAS.MONTO), BigDecimal.ZERO).as("total"))
                    .from(VISTA_TRANSACCIONES_COMPLETAS)
                    .groupBy(VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA)
                    .fetch()
                    .forEach(record -> {
                        String categoria = record.get(VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA).name();
                        BigDecimal total = record.get("total", BigDecimal.class);
                        totalPorCategoria.put(categoria, total != null ? total : BigDecimal.ZERO);
                    });
                    
            // Obtener total por mes del año actual usando una subconsulta para simplificar
            Map<String, BigDecimal> totalPorMes = new HashMap<>();
            dsl.select(
                        DSL.field("DATE_FORMAT({0}, '%Y-%m')", String.class, VISTA_TRANSACCIONES_COMPLETAS.FECHA).as("mes"),
                        DSL.coalesce(DSL.sum(VISTA_TRANSACCIONES_COMPLETAS.MONTO), BigDecimal.ZERO).as("total"))
                    .from(VISTA_TRANSACCIONES_COMPLETAS)
                    .where(DSL.year(VISTA_TRANSACCIONES_COMPLETAS.FECHA).eq(DSL.year(DSL.currentDate())))
                    .groupBy(DSL.field("DATE_FORMAT({0}, '%Y-%m')", VISTA_TRANSACCIONES_COMPLETAS.FECHA))
                    .orderBy(DSL.field("mes"))
                    .fetch()
                    .forEach(record -> {
                        String mes = record.get("mes", String.class);
                        BigDecimal total = record.get("total", BigDecimal.class);
                        totalPorMes.put(mes, total != null ? total : BigDecimal.ZERO);
                    });
                    
            // Obtener transacciones recientes
            List<Map<String, Object>> transaccionesRecientes = dsl.select(
                        VISTA_TRANSACCIONES_COMPLETAS.ID,
                        VISTA_TRANSACCIONES_COMPLETAS.FECHA,
                        VISTA_TRANSACCIONES_COMPLETAS.TIPO_TRANSACCION,
                        VISTA_TRANSACCIONES_COMPLETAS.CATEGORIA,
                        VISTA_TRANSACCIONES_COMPLETAS.MONTO,
                        VISTA_TRANSACCIONES_COMPLETAS.DESCRIPCION)
                    .from(VISTA_TRANSACCIONES_COMPLETAS)
                    .orderBy(VISTA_TRANSACCIONES_COMPLETAS.FECHA.desc())
                    .limit(5)
                    .fetchMaps();
                    
            // Calcular saldo actual
            BigDecimal saldoActual = (totalIngresos != null ? totalIngresos : BigDecimal.ZERO)
                    .subtract(totalEgresos != null ? totalEgresos : BigDecimal.ZERO);
                    
            // Construir respuesta
            Map<String, Object> estadisticas = new HashMap<>();
            estadisticas.put("totalIngresos", totalIngresos != null ? totalIngresos : BigDecimal.ZERO);
            estadisticas.put("totalEgresos", totalEgresos != null ? totalEgresos : BigDecimal.ZERO);
            estadisticas.put("saldoActual", saldoActual);
            estadisticas.put("conteoPorCategoria", conteoPorCategoria);
            estadisticas.put("totalPorCategoria", totalPorCategoria);
            estadisticas.put("totalPorMes", totalPorMes);
            estadisticas.put("transaccionesRecientes", transaccionesRecientes);
            
            return estadisticas;
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            throw new RuntimeException("Error al obtener estadísticas: " + e.getMessage(), e);
        }
    }
}
