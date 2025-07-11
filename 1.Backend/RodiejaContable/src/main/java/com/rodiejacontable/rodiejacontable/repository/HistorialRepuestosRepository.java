package com.rodiejacontable.rodiejacontable.repository;

import com.rodiejacontable.database.jooq.tables.pojos.HistorialRepuestos;
import com.rodiejacontable.database.jooq.tables.records.HistorialRepuestosRecord;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.rodiejacontable.database.jooq.Tables.HISTORIAL_REPUESTOS;

@Repository
public class HistorialRepuestosRepository {

    private final DSLContext dslContext;

    @Autowired
    public HistorialRepuestosRepository(DSLContext dslContext) {
        this.dslContext = dslContext;
    }

    public HistorialRepuestos save(HistorialRepuestos historial) {
        HistorialRepuestosRecord record = dslContext.newRecord(HISTORIAL_REPUESTOS, historial);
        record.store();
        return record.into(HistorialRepuestos.class);
    }

    public Optional<HistorialRepuestos> findById(Integer id) {
        return dslContext.selectFrom(HISTORIAL_REPUESTOS)
                .where(HISTORIAL_REPUESTOS.ID.eq(id))
                .fetchOptional()
                .map(r -> r.into(HistorialRepuestos.class));
    }

    public List<HistorialRepuestos> findByRepuestoId(Integer repuestoId) {
        return dslContext.selectFrom(HISTORIAL_REPUESTOS)
                .where(HISTORIAL_REPUESTOS.REPUESTO_ID.eq(repuestoId))
                .orderBy(HISTORIAL_REPUESTOS.FECHA_CAMBIO.desc())
                .fetch()
                .into(HistorialRepuestos.class);
    }

    public List<HistorialRepuestos> findAll() {
        return dslContext.selectFrom(HISTORIAL_REPUESTOS)
                .orderBy(HISTORIAL_REPUESTOS.FECHA_CAMBIO.desc())
                .fetch()
                .into(HistorialRepuestos.class);
    }
}
