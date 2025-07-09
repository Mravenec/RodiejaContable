package com.rodiejacontable.repository;

import com.rodiejacontable.database.jooq.routines.SpActividadAuditoriaFecha;
import com.rodiejacontable.database.jooq.routines.SpHistorialVehiculo;
import com.rodiejacontable.database.jooq.tables.records.VistaAuditoriaCompletaRecord;
import com.rodiejacontable.database.jooq.tables.pojos.HistorialVehiculos;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.rodiejacontable.database.jooq.Tables.VISTA_AUDITORIA_COMPLETA;

@Repository
public class AuditoriaRepository {

    private final DSLContext dsl;

    public AuditoriaRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<VistaAuditoriaCompletaRecord> obtenerActividadAuditoriaPorFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        SpActividadAuditoriaFecha sp = new SpActividadAuditoriaFecha();
        sp.setPFechaInicio(fechaInicio);
        sp.setPFechaFin(fechaFin);
        sp.execute(dsl.configuration());
        
        return dsl.selectFrom(VISTA_AUDITORIA_COMPLETA)
                .where(VISTA_AUDITORIA_COMPLETA.FECHA_CAMBIO.between(
                        fechaInicio.atStartOfDay(),
                        fechaFin.plusDays(1).atStartOfDay()
                ))
                .orderBy(VISTA_AUDITORIA_COMPLETA.FECHA_CAMBIO.desc())
                .fetchInto(VistaAuditoriaCompletaRecord.class);
    }

    public List<HistorialVehiculos> obtenerHistorialVehiculo(Integer vehiculoId) {
        SpHistorialVehiculo sp = new SpHistorialVehiculo();
        sp.setPVehiculoId(vehiculoId);
        sp.execute(dsl.configuration());
        
        return dsl.selectFrom(com.rodiejacontable.database.jooq.Tables.HISTORIAL_VEHICULOS)
                .where(com.rodiejacontable.database.jooq.Tables.HISTORIAL_VEHICULOS.VEHICULO_ID.eq(vehiculoId))
                .orderBy(com.rodiejacontable.database.jooq.Tables.HISTORIAL_VEHICULOS.FECHA_CAMBIO.desc())
                .fetchInto(HistorialVehiculos.class);
    }
}
