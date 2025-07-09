package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.VistaAuditoriaCompleta;
import com.rodiejacontable.service.VistaAuditoriaCompletaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auditoria")
public class VistaAuditoriaCompletaController {

    @Autowired
    private VistaAuditoriaCompletaService auditoriaService;

    /**
     * Obtiene todos los registros de auditoría
     */
    @GetMapping
    public ResponseEntity<List<VistaAuditoriaCompleta>> getAll() {
        return ResponseEntity.ok(auditoriaService.findAll());
    }

    /**
     * Obtiene registros de auditoría por tipo de entidad
     */
    @GetMapping("/tipo-entidad/{tipoEntidad}")
    public ResponseEntity<List<VistaAuditoriaCompleta>> getByTipoEntidad(
            @PathVariable String tipoEntidad) {
        return ResponseEntity.ok(auditoriaService.findByTipoEntidad(tipoEntidad));
    }

    /**
     * Obtiene registros de auditoría por ID de entidad
     */
    @GetMapping("/entidad/{entidadId}")
    public ResponseEntity<List<VistaAuditoriaCompleta>> getByEntidadId(
            @PathVariable String entidadId) {
        return ResponseEntity.ok(auditoriaService.findByEntidadId(entidadId));
    }

    /**
     * Obtiene registros de auditoría por usuario
     */
    @GetMapping("/usuario/{usuario}")
    public ResponseEntity<List<VistaAuditoriaCompleta>> getByUsuario(
            @PathVariable String usuario) {
        return ResponseEntity.ok(auditoriaService.findByUsuario(usuario));
    }

    /**
     * Obtiene registros de auditoría por rango de fechas
     */
    @GetMapping("/fechas")
    public ResponseEntity<List<VistaAuditoriaCompleta>> getByFechaRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(auditoriaService.findByFechaCambioBetween(inicio, fin));
    }

    /**
     * Obtiene registros de auditoría por acción
     */
    @GetMapping("/accion/{accion}")
    public ResponseEntity<List<VistaAuditoriaCompleta>> getByAccion(
            @PathVariable String accion) {
        return ResponseEntity.ok(auditoriaService.findByAccion(accion));
    }

    /**
     * Búsqueda avanzada de registros de auditoría con múltiples filtros
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<VistaAuditoriaCompleta>> buscarAuditoria(
            @RequestParam(required = false) String tipoEntidad,
            @RequestParam(required = false) String entidadId,
            @RequestParam(required = false) String usuario,
            @RequestParam(required = false) String accion,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        
        return ResponseEntity.ok(auditoriaService.buscarAuditoria(
            tipoEntidad, entidadId, usuario, accion, fechaInicio, fechaFin
        ));
    }

    /**
     * Obtiene un resumen de estadísticas de auditoría
     */
    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> getResumenAuditoria() {
        return ResponseEntity.ok(auditoriaService.getResumenAuditoria());
    }

    /**
     * Obtiene estadísticas de auditoría por tipo de entidad
     */
    @GetMapping("/estadisticas/tipo-entidad")
    public ResponseEntity<Map<String, Long>> getEstadisticasPorTipoEntidad() {
        return ResponseEntity.ok(auditoriaService.getEstadisticasPorTipoEntidad());
    }

    /**
     * Obtiene estadísticas de auditoría por acción
     */
    @GetMapping("/estadisticas/accion")
    public ResponseEntity<Map<String, Long>> getEstadisticasPorAccion() {
        return ResponseEntity.ok(auditoriaService.getEstadisticasPorAccion());
    }

    /**
     * Obtiene estadísticas de auditoría por usuario
     */
    @GetMapping("/estadisticas/usuario")
    public ResponseEntity<Map<String, Long>> getEstadisticasPorUsuario() {
        return ResponseEntity.ok(auditoriaService.getEstadisticasPorUsuario());
    }

    /**
     * Obtiene los valores únicos disponibles para los filtros
     */
    @GetMapping("/filtros")
    public ResponseEntity<Map<String, Object>> getFiltrosDisponibles() {
        return ResponseEntity.ok(auditoriaService.getFiltrosDisponibles());
    }
}
