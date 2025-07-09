package com.RodiejaContable.RodiejaContable.repository;

import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasCategoria;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasEstado;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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
}
