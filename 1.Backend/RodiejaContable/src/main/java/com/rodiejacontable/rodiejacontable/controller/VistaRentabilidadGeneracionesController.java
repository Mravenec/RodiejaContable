package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.VistaRentabilidadGeneraciones;
import com.rodiejacontable.rodiejacontable.service.VistaRentabilidadGeneracionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rentabilidad-generaciones")
public class VistaRentabilidadGeneracionesController {

    @Autowired
    private VistaRentabilidadGeneracionesService rentabilidadService;

    @GetMapping
    public List<VistaRentabilidadGeneraciones> getAll() {
        return rentabilidadService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VistaRentabilidadGeneraciones> getById(@PathVariable Integer id) {
        return rentabilidadService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/anio-inicio/{anio}")
    public List<VistaRentabilidadGeneraciones> getByAnioInicio(@PathVariable Integer anio) {
        return rentabilidadService.findByAnioInicio(anio);
    }

    @GetMapping("/anio-fin/{anio}")
    public List<VistaRentabilidadGeneraciones> getByAnioFin(@PathVariable Integer anio) {
        return rentabilidadService.findByAnioFin(anio);
    }

    @GetMapping("/rango-anios")
    public List<VistaRentabilidadGeneraciones> getByRangoAnios(
            @RequestParam(required = false) Integer anioInicio,
            @RequestParam(required = false) Integer anioFin) {
        return rentabilidadService.findByRangoAnios(anioInicio, anioFin);
    }

    @GetMapping("/clasificacion/{clasificacion}")
    public List<VistaRentabilidadGeneraciones> getByClasificacionRentabilidad(
            @PathVariable String clasificacion) {
        return rentabilidadService.findByClasificacionRentabilidad(clasificacion);
    }

    @GetMapping("/opciones/clasificaciones")
    public List<String> getClasificacionesRentabilidad() {
        return rentabilidadService.getClasificacionesRentabilidadDisponibles();
    }

    @GetMapping("/opciones/anios-inicio")
    public List<Integer> getAniosInicio() {
        return rentabilidadService.getAniosInicioDisponibles();
    }

    @GetMapping("/opciones/anios-fin")
    public List<Integer> getAniosFin() {
        return rentabilidadService.getAniosFinDisponibles();
    }

    @GetMapping("/resumen")
    public Map<String, Object> getResumenRentabilidad() {
        return rentabilidadService.getResumenRentabilidad();
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> getEstadisticas() {
        return rentabilidadService.getEstadisticasGenerales();
    }

    @GetMapping("/estadisticas/por-anio")
    public Map<String, Object> getEstadisticasPorAnio() {
        return rentabilidadService.getEstadisticasPorAnio();
    }

    @GetMapping("/kpis")
    public Map<String, Object> getKpis() {
        Map<String, Object> estadisticas = rentabilidadService.getEstadisticasGenerales();
        Map<String, Object> kpis = new HashMap<>();
        
        // KPI 1: Rentabilidad promedio
        BigDecimal rentabilidadPromedio = (BigDecimal) estadisticas.get("promedioRoi");
        kpis.put("rentabilidadPromedio", rentabilidadPromedio != null ? 
                rentabilidadPromedio.setScale(2, RoundingMode.HALF_UP) + "%" : "N/A");
        
        // KPI 2: Total de vehículos
        Long totalVehiculos = (Long) estadisticas.get("totalVehiculos");
        kpis.put("totalVehiculos", totalVehiculos != null ? totalVehiculos : 0);
        
        // KPI 3: Retorno de inversión total
        BigDecimal totalInversion = (BigDecimal) estadisticas.get("totalInversion");
        BigDecimal totalIngresos = (BigDecimal) estadisticas.get("totalIngresos");
        if (totalInversion != null && totalIngresos != null && totalInversion.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal roiTotal = totalIngresos.subtract(totalInversion)
                    .divide(totalInversion, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            kpis.put("roiTotal", roiTotal.setScale(2, RoundingMode.HALF_UP) + "%");
        } else {
            kpis.put("roiTotal", "N/A");
        }
        
        // KPI 4: Balance neto total
        BigDecimal balanceNeto = (BigDecimal) estadisticas.get("balanceNetoTotal");
        kpis.put("balanceNetoTotal", balanceNeto != null ? 
                "₡" + balanceNeto.setScale(2, RoundingMode.HALF_UP) : "N/A");
        
        return kpis;
    }
}
