package com.rodiejacontable.rodiejacontable.repository;

import com.rodiejacontable.database.jooq.tables.pojos.HistorialTransacciones;
import com.rodiejacontable.database.jooq.tables.records.HistorialTransaccionesRecord;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.rodiejacontable.database.jooq.Tables.HISTORIAL_TRANSACCIONES;

@Repository
public class HistorialTransaccionesRepository {

    private final DSLContext dslContext;

    @Autowired
    public HistorialTransaccionesRepository(DSLContext dslContext) {
        this.dslContext = dslContext;
    }

    public HistorialTransacciones save(HistorialTransacciones historial) {
        HistorialTransaccionesRecord record = dslContext.newRecord(HISTORIAL_TRANSACCIONES, historial);
        record.store();
        return record.into(HistorialTransacciones.class);
    }

    public Optional<HistorialTransacciones> findById(Integer id) {
        return dslContext.selectFrom(HISTORIAL_TRANSACCIONES)
                .where(HISTORIAL_TRANSACCIONES.ID.eq(id))
                .fetchOptional()
                .map(r -> r.into(HistorialTransacciones.class));
    }

    public List<HistorialTransacciones> findByTransaccionId(Integer transaccionId) {
        return dslContext.selectFrom(HISTORIAL_TRANSACCIONES)
                .where(HISTORIAL_TRANSACCIONES.TRANSACCION_ID.eq(transaccionId))
                .orderBy(HISTORIAL_TRANSACCIONES.FECHA_CAMBIO.desc())
                .fetch()
                .into(HistorialTransacciones.class);
    }

    public List<HistorialTransacciones> findAll() {
        return dslContext.selectFrom(HISTORIAL_TRANSACCIONES)
                .orderBy(HISTORIAL_TRANSACCIONES.FECHA_CAMBIO.desc())
                .fetch()
                .into(HistorialTransacciones.class);
    }
}
