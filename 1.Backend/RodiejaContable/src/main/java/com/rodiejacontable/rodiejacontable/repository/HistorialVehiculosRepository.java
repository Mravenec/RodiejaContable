package com.rodiejacontable.rodiejacontable.repository;

import com.rodiejacontable.database.jooq.tables.pojos.HistorialVehiculos;
import com.rodiejacontable.database.jooq.tables.records.HistorialVehiculosRecord;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.rodiejacontable.database.jooq.Tables.HISTORIAL_VEHICULOS;

@Repository
public class HistorialVehiculosRepository {

    private final DSLContext dslContext;

    @Autowired
    public HistorialVehiculosRepository(DSLContext dslContext) {
        this.dslContext = dslContext;
    }

    public HistorialVehiculos save(HistorialVehiculos historial) {
        HistorialVehiculosRecord record = dslContext.newRecord(HISTORIAL_VEHICULOS, historial);
        record.store();
        return record.into(HistorialVehiculos.class);
    }

    public Optional<HistorialVehiculos> findById(Integer id) {
        return dslContext.selectFrom(HISTORIAL_VEHICULOS)
                .where(HISTORIAL_VEHICULOS.ID.eq(id))
                .fetchOptional()
                .map(r -> r.into(HistorialVehiculos.class));
    }

    public List<HistorialVehiculos> findByVehiculoId(Integer vehiculoId) {
        return dslContext.selectFrom(HISTORIAL_VEHICULOS)
                .where(HISTORIAL_VEHICULOS.VEHICULO_ID.eq(vehiculoId))
                .orderBy(HISTORIAL_VEHICULOS.FECHA_CAMBIO.desc())
                .fetch()
                .into(HistorialVehiculos.class);
    }

    public List<HistorialVehiculos> findAll() {
        return dslContext.selectFrom(HISTORIAL_VEHICULOS)
                .orderBy(HISTORIAL_VEHICULOS.FECHA_CAMBIO.desc())
                .fetch()
                .into(HistorialVehiculos.class);
    }
}
