package com.rodiejacontable.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.VISTA_RENTABILIDAD_GENERACIONES;

import java.util.HashMap;
import java.util.Map;

import com.rodiejacontable.database.jooq.tables.pojos.VistaRentabilidadGeneraciones;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public class VistaRentabilidadGeneracionesRepository {

    @Autowired
    private DSLContext dsl;

    public List<VistaRentabilidadGeneraciones> findAll() {
        return dsl.selectFrom(VISTA_RENTABILIDAD_GENERACIONES)
                .fetchInto(VistaRentabilidadGeneraciones.class);
    }

    public Optional<VistaRentabilidadGeneraciones> findById(Integer generacionId) {
        return dsl.selectFrom(VISTA_RENTABILIDAD_GENERACIONES)
                .where(VISTA_RENTABILIDAD_GENERACIONES.GENERACION_ID.eq(generacionId))
                .fetchOptionalInto(VistaRentabilidadGeneraciones.class);
    }

    public List<VistaRentabilidadGeneraciones> findByAnioInicio(Integer anioInicio) {
        return dsl.selectFrom(VISTA_RENTABILIDAD_GENERACIONES)
                .where(VISTA_RENTABILIDAD_GENERACIONES.ANIO_INICIO.eq(anioInicio))
                .fetchInto(VistaRentabilidadGeneraciones.class);
    }

    public List<VistaRentabilidadGeneraciones> findByAnioFin(Integer anioFin) {
        return dsl.selectFrom(VISTA_RENTABILIDAD_GENERACIONES)
                .where(VISTA_RENTABILIDAD_GENERACIONES.ANIO_FIN.eq(anioFin))
                .fetchInto(VistaRentabilidadGeneraciones.class);
    }

    public List<VistaRentabilidadGeneraciones> findByRangoAnios(Integer anioInicio, Integer anioFin) {
        return dsl.selectFrom(VISTA_RENTABILIDAD_GENERACIONES)
                .where(VISTA_RENTABILIDAD_GENERACIONES.ANIO_INICIO.ge(anioInicio)
                        .and(VISTA_RENTABILIDAD_GENERACIONES.ANIO_FIN.le(anioFin)))
                .orderBy(VISTA_RENTABILIDAD_GENERACIONES.ANIO_INICIO.asc())
                .fetchInto(VistaRentabilidadGeneraciones.class);
    }

    public List<VistaRentabilidadGeneraciones> findByClasificacionRentabilidad(String clasificacion) {
        return dsl.selectFrom(VISTA_RENTABILIDAD_GENERACIONES)
                .where(VISTA_RENTABILIDAD_GENERACIONES.CLASIFICACION_RENTABILIDAD.eq(clasificacion))
                .fetchInto(VistaRentabilidadGeneraciones.class);
    }

    public List<String> findDistinctClasificacionesRentabilidad() {
        return dsl.selectDistinct(VISTA_RENTABILIDAD_GENERACIONES.CLASIFICACION_RENTABILIDAD)
                .from(VISTA_RENTABILIDAD_GENERACIONES)
                .where(VISTA_RENTABILIDAD_GENERACIONES.CLASIFICACION_RENTABILIDAD.isNotNull())
                .fetch(VISTA_RENTABILIDAD_GENERACIONES.CLASIFICACION_RENTABILIDAD);
    }

    public List<Integer> findDistinctAniosInicio() {
        return dsl.selectDistinct(VISTA_RENTABILIDAD_GENERACIONES.ANIO_INICIO)
                .from(VISTA_RENTABILIDAD_GENERACIONES)
                .orderBy(VISTA_RENTABILIDAD_GENERACIONES.ANIO_INICIO.desc())
                .fetch(VISTA_RENTABILIDAD_GENERACIONES.ANIO_INICIO);
    }

    public List<Integer> findDistinctAniosFin() {
        return dsl.selectDistinct(VISTA_RENTABILIDAD_GENERACIONES.ANIO_FIN)
                .from(VISTA_RENTABILIDAD_GENERACIONES)
                .orderBy(VISTA_RENTABILIDAD_GENERACIONES.ANIO_FIN.desc())
                .fetch(VISTA_RENTABILIDAD_GENERACIONES.ANIO_FIN);
    }

    public Map<String, Object> getEstadisticasGenerales() {
        Map<String, Object> estadisticas = new HashMap<>();
        
        // Total de generaciones
        Long totalGeneraciones = dsl.selectCount()
                .from(VISTA_RENTABILIDAD_GENERACIONES)
                .fetchOneInto(Long.class);
        estadisticas.put("totalGeneraciones", totalGeneraciones);
        
        // Promedio de ROI
        BigDecimal promedioRoi = dsl.select(DSL.avg(VISTA_RENTABILIDAD_GENERACIONES.ROI_PORCENTAJE))
                .from(VISTA_RENTABILIDAD_GENERACIONES)
                .fetchOneInto(BigDecimal.class);
        estadisticas.put("promedioRoi", promedioRoi);
        
        // Total de vehículos
        Long totalVehiculos = dsl.select(DSL.coalesce(DSL.sum(VISTA_RENTABILIDAD_GENERACIONES.TOTAL_VEHICULOS), 0L))
                .from(VISTA_RENTABILIDAD_GENERACIONES)
                .fetchOneInto(Long.class);
        estadisticas.put("totalVehiculos", totalVehiculos);
        
        // Total de inversión
        BigDecimal totalInversion = dsl.select(DSL.coalesce(DSL.sum(VISTA_RENTABILIDAD_GENERACIONES.TOTAL_INVERSION), BigDecimal.ZERO))
                .from(VISTA_RENTABILIDAD_GENERACIONES)
                .fetchOneInto(BigDecimal.class);
        estadisticas.put("totalInversion", totalInversion);
        
        // Total de ingresos
        BigDecimal totalIngresos = dsl.select(DSL.coalesce(DSL.sum(VISTA_RENTABILIDAD_GENERACIONES.TOTAL_INGRESOS), BigDecimal.ZERO))
                .from(VISTA_RENTABILIDAD_GENERACIONES)
                .fetchOneInto(BigDecimal.class);
        estadisticas.put("totalIngresos", totalIngresos);
        
        // Balance neto total
        BigDecimal balanceNetoTotal = dsl.select(DSL.coalesce(DSL.sum(VISTA_RENTABILIDAD_GENERACIONES.BALANCE_NETO), BigDecimal.ZERO))
                .from(VISTA_RENTABILIDAD_GENERACIONES)
                .fetchOneInto(BigDecimal.class);
        estadisticas.put("balanceNetoTotal", balanceNetoTotal);
        
        return estadisticas;
    }
}
