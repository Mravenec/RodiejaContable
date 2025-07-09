package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.VistaDashboardEjecutivo;
import com.rodiejacontable.service.VistaDashboardEjecutivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard/ejecutivo")
public class VistaDashboardEjecutivoController {

    @Autowired
    private VistaDashboardEjecutivoService dashboardService;

    /**
     * Obtiene todos los datos del dashboard ejecutivo
     */
    @GetMapping
    public ResponseEntity<List<VistaDashboardEjecutivo>> getDashboardData() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }

    /**
     * Obtiene los datos del dashboard para una sección específica
     */
    @GetMapping("/seccion/{seccion}")
    public ResponseEntity<VistaDashboardEjecutivo> getDashboardBySeccion(
            @PathVariable String seccion) {
        VistaDashboardEjecutivo data = dashboardService.getDashboardBySeccion(seccion);
        if (data != null) {
            return ResponseEntity.ok(data);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Obtiene un resumen general con los totales y métricas clave
     */
    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> getResumenGeneral() {
        return ResponseEntity.ok(dashboardService.getResumenGeneral());
    }

    /**
     * Obtiene métricas detalladas por sección
     */
    @GetMapping("/metricas-por-seccion")
    public ResponseEntity<Map<String, Object>> getMetricasPorSeccion() {
        return ResponseEntity.ok(dashboardService.getMetricasPorSeccion());
    }

    /**
     * Obtiene el ROI promedio general
     */
    @GetMapping("/roi-promedio")
    public ResponseEntity<Map<String, Object>> getRoiPromedio() {
        Map<String, Object> response = new java.util.HashMap<>();
        Map<String, Object> resumen = dashboardService.getResumenGeneral();
        Map<String, Object> metricas = (Map<String, Object>) resumen.get("metricas");
        Object roi = metricas != null ? metricas.get("roiPromedio") : 0;
        response.put("roiPromedio", roi != null ? roi : 0);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene el margen de beneficio general
     */
    @GetMapping("/margen-beneficio")
    public ResponseEntity<Map<String, Object>> getMargenBeneficio() {
        Map<String, Object> response = new java.util.HashMap<>();
        Map<String, Object> resumen = dashboardService.getResumenGeneral();
        Map<String, Object> metricas = (Map<String, Object>) resumen.get("metricas");
        Object margen = metricas != null ? metricas.get("margenBeneficio") : 0;
        response.put("margenBeneficio", margen != null ? margen : 0);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtiene estadísticas de vehículos
     */
    @GetMapping("/estadisticas-vehiculos")
    public ResponseEntity<Map<String, Object>> getEstadisticasVehiculos() {
        Map<String, Object> resumen = dashboardService.getResumenGeneral();
        Object vehiculos = resumen.get("vehiculos");
        return ResponseEntity.ok(vehiculos != null ? (Map<String, Object>) vehiculos : new java.util.HashMap<>());
    }

    /**
     * Obtiene estadísticas de repuestos
     */
    @GetMapping("/estadisticas-repuestos")
    public ResponseEntity<Map<String, Object>> getEstadisticasRepuestos() {
        Map<String, Object> resumen = dashboardService.getResumenGeneral();
        Object repuestos = resumen.get("repuestos");
        return ResponseEntity.ok(repuestos != null ? (Map<String, Object>) repuestos : new java.util.HashMap<>());
    }
}
