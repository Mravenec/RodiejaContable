package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.records.VistaAuditoriaCompletaRecord;
import com.rodiejacontable.database.jooq.tables.pojos.HistorialVehiculos;
import com.rodiejacontable.service.AuditoriaService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    public AuditoriaController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @GetMapping("/actividad")
    public ResponseEntity<List<VistaAuditoriaCompletaRecord>> getActividadAuditoria(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        
        List<VistaAuditoriaCompletaRecord> actividad = auditoriaService.obtenerActividadAuditoriaPorFechas(fechaInicio, fechaFin);
        return ResponseEntity.ok(actividad);
    }

    @GetMapping("/vehiculo/{vehiculoId}")
    public ResponseEntity<List<HistorialVehiculos>> getHistorialVehiculo(
            @PathVariable Integer vehiculoId) {
        
        List<HistorialVehiculos> historial = auditoriaService.obtenerHistorialVehiculo(vehiculoId);
        return ResponseEntity.ok(historial);
    }
}
