package com.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.VISTA_RESUMEN_GENERACIONES;

import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class VistaResumenGeneracionesRepository {

    private final DSLContext dsl;

    public VistaResumenGeneracionesRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findAll() {
        return dsl.selectFrom(VISTA_RESUMEN_GENERACIONES)
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones.class);
    }

    public Optional<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findById(Integer generacionId) {
        return dsl.selectFrom(VISTA_RESUMEN_GENERACIONES)
                .where(VISTA_RESUMEN_GENERACIONES.GENERACION_ID.eq(generacionId))
                .fetchOptionalInto(com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByMarca(String marca) {
        return dsl.selectFrom(VISTA_RESUMEN_GENERACIONES)
                .where(VISTA_RESUMEN_GENERACIONES.MARCA.eq(marca))
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByModelo(String modelo) {
        return dsl.selectFrom(VISTA_RESUMEN_GENERACIONES)
                .where(VISTA_RESUMEN_GENERACIONES.MODELO.eq(modelo))
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByAnioInicio(Integer anioInicio) {
        return dsl.selectFrom(VISTA_RESUMEN_GENERACIONES)
                .where(VISTA_RESUMEN_GENERACIONES.ANIO_INICIO.eq(anioInicio))
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByAnioFin(Integer anioFin) {
        return dsl.selectFrom(VISTA_RESUMEN_GENERACIONES)
                .where(VISTA_RESUMEN_GENERACIONES.ANIO_FIN.eq(anioFin))
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByRangoAnios(Integer anioInicio, Integer anioFin) {
        return dsl.selectFrom(VISTA_RESUMEN_GENERACIONES)
                .where(VISTA_RESUMEN_GENERACIONES.ANIO_INICIO.ge(anioInicio)
                        .and(VISTA_RESUMEN_GENERACIONES.ANIO_FIN.le(anioFin)))
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones.class);
    }

    public List<String> findDistinctMarcas() {
        return dsl.selectDistinct(VISTA_RESUMEN_GENERACIONES.MARCA)
                .from(VISTA_RESUMEN_GENERACIONES)
                .orderBy(VISTA_RESUMEN_GENERACIONES.MARCA)
                .fetch(VISTA_RESUMEN_GENERACIONES.MARCA);
    }

    public List<String> findDistinctModelos() {
        return dsl.selectDistinct(VISTA_RESUMEN_GENERACIONES.MODELO)
                .from(VISTA_RESUMEN_GENERACIONES)
                .orderBy(VISTA_RESUMEN_GENERACIONES.MODELO)
                .fetch(VISTA_RESUMEN_GENERACIONES.MODELO);
    }

    public List<Integer> findDistinctAniosInicio() {
        return dsl.selectDistinct(VISTA_RESUMEN_GENERACIONES.ANIO_INICIO)
                .from(VISTA_RESUMEN_GENERACIONES)
                .orderBy(VISTA_RESUMEN_GENERACIONES.ANIO_INICIO)
                .fetch(VISTA_RESUMEN_GENERACIONES.ANIO_INICIO);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findWithFilters(Map<String, Object> filters) {
        var condition = DSL.noCondition();
        
        if (filters.containsKey("marca")) {
            condition = condition.and(VISTA_RESUMEN_GENERACIONES.MARCA.eq((String) filters.get("marca")));
        }
        if (filters.containsKey("modelo")) {
            condition = condition.and(VISTA_RESUMEN_GENERACIONES.MODELO.eq((String) filters.get("modelo")));
        }
        if (filters.containsKey("anioInicio")) {
            condition = condition.and(VISTA_RESUMEN_GENERACIONES.ANIO_INICIO.eq((Integer) filters.get("anioInicio")));
        }
        if (filters.containsKey("anioFin")) {
            condition = condition.and(VISTA_RESUMEN_GENERACIONES.ANIO_FIN.eq((Integer) filters.get("anioFin")));
        }
        
        return dsl.selectFrom(VISTA_RESUMEN_GENERACIONES)
                .where(condition)
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones.class);
    }

    public Map<String, Object> getEstadisticas() {
        Map<String, Object> estadisticas = new java.util.HashMap<>();
        
        // Total de vehículos
        Long totalVehiculos = dsl.select(DSL.coalesce(DSL.sum(VISTA_RESUMEN_GENERACIONES.TOTAL_VEHICULOS), 0L))
                .from(VISTA_RESUMEN_GENERACIONES)
                .fetchOneInto(Long.class);
        estadisticas.put("totalVehiculos", totalVehiculos);
        
        // Total de repuestos
        Long totalRepuestos = dsl.select(DSL.coalesce(DSL.sum(VISTA_RESUMEN_GENERACIONES.TOTAL_REPUESTOS), 0L))
                .from(VISTA_RESUMEN_GENERACIONES)
                .fetchOneInto(Long.class);
        estadisticas.put("totalRepuestos", totalRepuestos);
        
        // Total de inversión
        BigDecimal totalInversion = dsl.select(DSL.coalesce(DSL.sum(VISTA_RESUMEN_GENERACIONES.TOTAL_INVERSION), BigDecimal.ZERO))
                .from(VISTA_RESUMEN_GENERACIONES)
                .fetchOneInto(BigDecimal.class);
        estadisticas.put("totalInversion", totalInversion);
        
        // Total de ingresos
        BigDecimal totalIngresos = dsl.select(DSL.coalesce(DSL.sum(VISTA_RESUMEN_GENERACIONES.TOTAL_INGRESOS), BigDecimal.ZERO))
                .from(VISTA_RESUMEN_GENERACIONES)
                .fetchOneInto(BigDecimal.class);
        estadisticas.put("totalIngresos", totalIngresos);
        
        // Balance neto total
        BigDecimal balanceNetoTotal = dsl.select(DSL.coalesce(DSL.sum(VISTA_RESUMEN_GENERACIONES.BALANCE_NETO), BigDecimal.ZERO))
                .from(VISTA_RESUMEN_GENERACIONES)
                .fetchOneInto(BigDecimal.class);
        estadisticas.put("balanceNetoTotal", balanceNetoTotal);
        
        // Porcentaje de retorno promedio
        BigDecimal porcentajeRetornoPromedio = dsl.select(DSL.coalesce(DSL.avg(VISTA_RESUMEN_GENERACIONES.PORCENTAJE_RETORNO), BigDecimal.ZERO))
                .from(VISTA_RESUMEN_GENERACIONES)
                .fetchOneInto(BigDecimal.class);
        estadisticas.put("porcentajeRetornoPromedio", porcentajeRetornoPromedio);
        
        return estadisticas;
    }
}
