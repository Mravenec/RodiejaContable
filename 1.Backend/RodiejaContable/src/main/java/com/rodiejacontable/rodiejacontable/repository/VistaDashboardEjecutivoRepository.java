package com.rodiejacontable.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.VISTA_DASHBOARD_EJECUTIVO;

import com.rodiejacontable.database.jooq.tables.pojos.VistaDashboardEjecutivo;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.jooq.Record1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public class VistaDashboardEjecutivoRepository {

    @Autowired
    private DSLContext dsl;
    
    public List<VistaDashboardEjecutivo> findAll() {
        return dsl.selectFrom(VISTA_DASHBOARD_EJECUTIVO)
                 .fetchInto(VistaDashboardEjecutivo.class);
    }
    
    public VistaDashboardEjecutivo findBySeccion(String seccion) {
        return dsl.selectFrom(VISTA_DASHBOARD_EJECUTIVO)
                 .where(VISTA_DASHBOARD_EJECUTIVO.SECCION.eq(seccion))
                 .fetchOneInto(VistaDashboardEjecutivo.class);
    }
    
    public BigDecimal getTotalInversion() {
        Record1<BigDecimal> result = dsl.select(DSL.sum(VISTA_DASHBOARD_EJECUTIVO.INVERSION_TOTAL).as("total"))
                                     .from(VISTA_DASHBOARD_EJECUTIVO)
                                     .fetchOne();
        return result != null ? result.value1() : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalIngresos() {
        Record1<BigDecimal> result = dsl.select(DSL.sum(VISTA_DASHBOARD_EJECUTIVO.INGRESOS_TOTALES).as("total"))
                                     .from(VISTA_DASHBOARD_EJECUTIVO)
                                     .fetchOne();
        return result != null ? result.value1() : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalEgresos() {
        Record1<BigDecimal> result = dsl.select(DSL.sum(VISTA_DASHBOARD_EJECUTIVO.EGRESOS_TOTALES).as("total"))
                                     .from(VISTA_DASHBOARD_EJECUTIVO)
                                     .fetchOne();
        return result != null ? result.value1() : BigDecimal.ZERO;
    }
    
    public Long getTotalVehiculos() {
        Record1<BigDecimal> result = dsl.select(DSL.sum(VISTA_DASHBOARD_EJECUTIVO.TOTAL_VEHICULOS).as("total"))
                                     .from(VISTA_DASHBOARD_EJECUTIVO)
                                     .fetchOne();
        return result != null && result.value1() != null ? result.value1().longValue() : 0L;
    }
    
    public Long getTotalVehiculosDisponibles() {
        Record1<BigDecimal> result = dsl.select(DSL.sum(VISTA_DASHBOARD_EJECUTIVO.VEHICULOS_DISPONIBLES).as("total"))
                                     .from(VISTA_DASHBOARD_EJECUTIVO)
                                     .fetchOne();
        return result != null && result.value1() != null ? result.value1().longValue() : 0L;
    }
    
    public Long getTotalVehiculosVendidos() {
        Record1<BigDecimal> result = dsl.select(DSL.sum(VISTA_DASHBOARD_EJECUTIVO.VEHICULOS_VENDIDOS).as("total"))
                                     .from(VISTA_DASHBOARD_EJECUTIVO)
                                     .fetchOne();
        return result != null && result.value1() != null ? result.value1().longValue() : 0L;
    }
    
    public Long getTotalRepuestos() {
        Record1<BigDecimal> result = dsl.select(DSL.sum(VISTA_DASHBOARD_EJECUTIVO.TOTAL_REPUESTOS).as("total"))
                                     .from(VISTA_DASHBOARD_EJECUTIVO)
                                     .fetchOne();
        return result != null && result.value1() != null ? result.value1().longValue() : 0L;
    }
    
    public Long getTotalRepuestosStock() {
        Record1<BigDecimal> result = dsl.select(DSL.sum(VISTA_DASHBOARD_EJECUTIVO.REPUESTOS_STOCK).as("total"))
                                     .from(VISTA_DASHBOARD_EJECUTIVO)
                                     .fetchOne();
        return result != null && result.value1() != null ? result.value1().longValue() : 0L;
    }
    
    public BigDecimal getRoiPromedio() {
        Record1<BigDecimal> result = dsl.select(DSL.avg(VISTA_DASHBOARD_EJECUTIVO.ROI_PROMEDIO).as("avg_roi"))
                                     .from(VISTA_DASHBOARD_EJECUTIVO)
                                     .fetchOne();
        return result != null ? result.value1() : BigDecimal.ZERO;
    }
}
