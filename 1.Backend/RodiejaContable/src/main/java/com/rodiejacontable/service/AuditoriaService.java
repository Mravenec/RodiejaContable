package com.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.records.VistaAuditoriaCompletaRecord;
import com.rodiejacontable.database.jooq.tables.pojos.HistorialVehiculos;
import com.rodiejacontable.repository.AuditoriaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;

    public AuditoriaService(AuditoriaRepository auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    public List<VistaAuditoriaCompletaRecord> obtenerActividadAuditoriaPorFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        if (fechaInicio == null || fechaFin == null) {
            throw new IllegalArgumentException("Las fechas de inicio y fin son requeridas");
        }
        if (fechaInicio.isAfter(fechaFin)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha fin");
        }
        return auditoriaRepository.obtenerActividadAuditoriaPorFechas(fechaInicio, fechaFin);
    }

    public List<HistorialVehiculos> obtenerHistorialVehiculo(Integer vehiculoId) {
        if (vehiculoId == null || vehiculoId <= 0) {
            throw new IllegalArgumentException("ID de vehículo inválido");
        }
        return auditoriaRepository.obtenerHistorialVehiculo(vehiculoId);
    }
}
