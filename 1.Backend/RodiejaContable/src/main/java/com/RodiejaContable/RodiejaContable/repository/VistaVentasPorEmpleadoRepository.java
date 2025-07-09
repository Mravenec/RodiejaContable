package com.RodiejaContable.RodiejaContable.repository;

import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.rodiejacontable.database.jooq.Tables.VISTA_VENTAS_POR_EMPLEADO;

@Repository
public class VistaVentasPorEmpleadoRepository {

    private final DSLContext dsl;

    public VistaVentasPorEmpleadoRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findAll() {
        return dsl.selectFrom(VISTA_VENTAS_POR_EMPLEADO)
                .orderBy(VISTA_VENTAS_POR_EMPLEADO.TOTAL_VENTAS.desc())
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado.class);
    }

    public Optional<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findByEmpleado(String empleado) {
        return dsl.selectFrom(VISTA_VENTAS_POR_EMPLEADO)
                .where(VISTA_VENTAS_POR_EMPLEADO.EMPLEADO.eq(empleado))
                .fetchOptionalInto(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado.class);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> findTopNVentas(int limit) {
        return dsl.selectFrom(VISTA_VENTAS_POR_EMPLEADO)
                .orderBy(VISTA_VENTAS_POR_EMPLEADO.TOTAL_VENTAS.desc())
                .limit(limit)
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado.class);
    }

    public List<String> findAllEmpleados() {
        return dsl.selectDistinct(VISTA_VENTAS_POR_EMPLEADO.EMPLEADO)
                .from(VISTA_VENTAS_POR_EMPLEADO)
                .orderBy(VISTA_VENTAS_POR_EMPLEADO.EMPLEADO.asc())
                .fetch(VISTA_VENTAS_POR_EMPLEADO.EMPLEADO);
    }
}
