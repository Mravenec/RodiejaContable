package com.rodiejacontable.rodiejacontable.repository;

import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.SelectConditionStep;
import org.jooq.SelectSeekStep1;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.rodiejacontable.database.jooq.Tables.VISTA_TOP_PRODUCTOS_VENDIDOS;

@Repository
public class VistaTopProductosVendidosRepository {

    private final DSLContext dsl;

    public VistaTopProductosVendidosRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> findAll() {
        return dsl.selectFrom(VISTA_TOP_PRODUCTOS_VENDIDOS)
                .orderBy(VISTA_TOP_PRODUCTOS_VENDIDOS.VECES_VENDIDO.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> findByTipoProducto(String tipoProducto) {
        return dsl.selectFrom(VISTA_TOP_PRODUCTOS_VENDIDOS)
                .where(VISTA_TOP_PRODUCTOS_VENDIDOS.TIPO_PRODUCTO.eq(tipoProducto))
                .orderBy(VISTA_TOP_PRODUCTOS_VENDIDOS.VECES_VENDIDO.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> findTopN(int limit) {
        return dsl.selectFrom(VISTA_TOP_PRODUCTOS_VENDIDOS)
                .orderBy(VISTA_TOP_PRODUCTOS_VENDIDOS.VECES_VENDIDO.desc())
                .limit(limit)
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos.class);
    }

    public List<String> findDistinctTipoProducto() {
        return dsl.selectDistinct(VISTA_TOP_PRODUCTOS_VENDIDOS.TIPO_PRODUCTO)
                .from(VISTA_TOP_PRODUCTOS_VENDIDOS)
                .orderBy(VISTA_TOP_PRODUCTOS_VENDIDOS.TIPO_PRODUCTO)
                .fetch(VISTA_TOP_PRODUCTOS_VENDIDOS.TIPO_PRODUCTO);
    }
    
    // Note: Date range filtering is not supported as the view is an aggregation without date information
    
    // Note: Filtering by marca is not directly supported as it's not a field in the view
    // The view only has: TIPO_PRODUCTO, PRODUCTO, VECES_VENDIDO, TOTAL_INGRESOS, PROMEDIO_VENTA, TOTAL_COMISIONES
    
    // Note: Filtering by modelo is not directly supported as it's not a field in the view
    // The view only has: TIPO_PRODUCTO, PRODUCTO, VECES_VENDIDO, TOTAL_INGRESOS, PROMEDIO_VENTA, TOTAL_COMISIONES
    
    // Note: Filtering by categoria is not directly supported as it's not a field in the view
    // The view only has: TIPO_PRODUCTO, PRODUCTO, VECES_VENDIDO, TOTAL_INGRESOS, PROMEDIO_VENTA, TOTAL_COMISIONES
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> buscarConFiltros(
            String tipo, String busqueda, Integer limit) {
        
        // Start with base query
        SelectConditionStep<com.rodiejacontable.database.jooq.tables.records.VistaTopProductosVendidosRecord> query = 
            dsl.selectFrom(VISTA_TOP_PRODUCTOS_VENDIDOS)
              .where(DSL.trueCondition());
        
        // Apply filters if provided
        if (tipo != null && !tipo.trim().isEmpty()) {
            query = query.and(VISTA_TOP_PRODUCTOS_VENDIDOS.TIPO_PRODUCTO.eq(tipo));
        }
        
        if (busqueda != null && !busqueda.trim().isEmpty()) {
            query = query.and(VISTA_TOP_PRODUCTOS_VENDIDOS.PRODUCTO.likeIgnoreCase("%" + busqueda + "%"));
        }
        
        // Apply ordering
        SelectSeekStep1<com.rodiejacontable.database.jooq.tables.records.VistaTopProductosVendidosRecord, Long> orderedQuery = 
            query.orderBy(VISTA_TOP_PRODUCTOS_VENDIDOS.VECES_VENDIDO.desc());
        
        // Apply limit if provided and execute the query
        if (limit != null && limit > 0) {
            return orderedQuery.limit(limit)
                             .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos.class);
        }
        
        return orderedQuery.fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos.class);
    }
}
