package com.rodiejacontable.rodiejacontable.repository;

import com.rodiejacontable.database.jooq.enums.PagosComisionesEstado;
import com.rodiejacontable.database.jooq.tables.PagosComisiones;
import com.rodiejacontable.database.jooq.tables.records.PagosComisionesRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class PagosComisionesRepository {

    private final DSLContext dsl;

    public PagosComisionesRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public Optional<PagosComisionesRecord> findByEmpleadoIdAndPeriodo(Integer empleadoId, Integer anio, Integer mes) {
        return dsl.selectFrom(PagosComisiones.PAGOS_COMISIONES)
                .where(PagosComisiones.PAGOS_COMISIONES.EMPLEADO_ID.eq(empleadoId))
                .and(PagosComisiones.PAGOS_COMISIONES.ANIO.eq(anio))
                .and(PagosComisiones.PAGOS_COMISIONES.MES.eq(mes))
                .fetchOptional();
    }

    public List<PagosComisionesRecord> findByEmpleadoId(Integer empleadoId) {
        return dsl.selectFrom(PagosComisiones.PAGOS_COMISIONES)
                .where(PagosComisiones.PAGOS_COMISIONES.EMPLEADO_ID.eq(empleadoId))
                .orderBy(PagosComisiones.PAGOS_COMISIONES.ANIO.desc(), 
                        PagosComisiones.PAGOS_COMISIONES.MES.desc())
                .fetch();
    }

    public List<PagosComisionesRecord> findByPeriodo(Integer anio, Integer mes) {
        return dsl.selectFrom(PagosComisiones.PAGOS_COMISIONES)
                .where(PagosComisiones.PAGOS_COMISIONES.ANIO.eq(anio))
                .and(PagosComisiones.PAGOS_COMISIONES.MES.eq(mes))
                .orderBy(PagosComisiones.PAGOS_COMISIONES.TOTAL_COMISIONES.desc())
                .fetch();
    }

    public List<PagosComisionesRecord> findByEstado(String estado) {
        PagosComisionesEstado estadoEnum = PagosComisionesEstado.valueOf(estado.toUpperCase());
        return dsl.selectFrom(PagosComisiones.PAGOS_COMISIONES)
                .where(PagosComisiones.PAGOS_COMISIONES.ESTADO.eq(estadoEnum))
                .orderBy(PagosComisiones.PAGOS_COMISIONES.FECHA_PAGO.desc())
                .fetch();
    }

    public List<PagosComisionesRecord> findAll() {
        return dsl.selectFrom(PagosComisiones.PAGOS_COMISIONES)
                .orderBy(PagosComisiones.PAGOS_COMISIONES.FECHA_PAGO.desc())
                .fetch();
    }

    public PagosComisionesRecord save(PagosComisionesRecord record) {
        if (record.getId() == null) {
            return dsl.insertInto(PagosComisiones.PAGOS_COMISIONES)
                    .set(record)
                    .returning()
                    .fetchOne();
        } else {
            dsl.update(PagosComisiones.PAGOS_COMISIONES)
                    .set(record)
                    .where(PagosComisiones.PAGOS_COMISIONES.ID.eq(record.getId()))
                    .execute();
            return record;
        }
    }

    public void deleteById(Integer id) {
        dsl.deleteFrom(PagosComisiones.PAGOS_COMISIONES)
                .where(PagosComisiones.PAGOS_COMISIONES.ID.eq(id))
                .execute();
    }

    public boolean existsByEmpleadoIdAndPeriodo(Integer empleadoId, Integer anio, Integer mes) {
        return dsl.fetchExists(
                dsl.selectOne()
                        .from(PagosComisiones.PAGOS_COMISIONES)
                        .where(PagosComisiones.PAGOS_COMISIONES.EMPLEADO_ID.eq(empleadoId))
                        .and(PagosComisiones.PAGOS_COMISIONES.ANIO.eq(anio))
                        .and(PagosComisiones.PAGOS_COMISIONES.MES.eq(mes))
        );
    }
}
