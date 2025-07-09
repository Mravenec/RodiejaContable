package com.rodiejacontable.rodiejacontable.repository;

import org.jooq.DSLContext;
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
}
