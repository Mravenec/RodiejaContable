package com.RodiejaContable.RodiejaContable.controller;

// Using fully qualified class name to avoid ambiguity
import com.RodiejaContable.RodiejaContable.service.VistaResumenGeneracionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/resumen-generaciones")
public class VistaResumenGeneracionesController {

    private final VistaResumenGeneracionesService service;

    @Autowired
    public VistaResumenGeneracionesController(VistaResumenGeneracionesService service) {
        this.service = service;
    }

    @GetMapping
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> getById(@PathVariable Integer id) {
        Optional<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> generacion = service.findById(id);
        return generacion.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/marca/{marca}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> getByMarca(@PathVariable String marca) {
        return service.findByMarca(marca);
    }

    @GetMapping("/modelo/{modelo}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> getByModelo(@PathVariable String modelo) {
        return service.findByModelo(modelo);
    }

    @GetMapping("/anio-inicio/{anioInicio}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> getByAnioInicio(@PathVariable Integer anioInicio) {
        return service.findByAnioInicio(anioInicio);
    }

    @GetMapping("/anio-fin/{anioFin}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> getByAnioFin(@PathVariable Integer anioFin) {
        return service.findByAnioFin(anioFin);
    }

    @GetMapping("/rango-anios")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> getByRangoAnios(
            @RequestParam Integer anioInicio,
            @RequestParam Integer anioFin) {
        return service.findByRangoAnios(anioInicio, anioFin);
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> getEstadisticas() {
        return service.getEstadisticas();
    }

    @GetMapping("/kpis")
    public Map<String, Object> getKpis() {
        return service.getKpis();
    }

    @GetMapping("/filtros")
    public Map<String, Object> getFiltros() {
        return service.getFiltros();
    }

    @GetMapping("/resumen-por-marca")
    public List<Map<String, Object>> getResumenPorMarca() {
        return service.getResumenPorMarca();
    }
}
