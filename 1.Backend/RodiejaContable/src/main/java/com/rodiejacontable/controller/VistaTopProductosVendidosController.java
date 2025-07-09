package com.rodiejacontable.controller;

import com.rodiejacontable.service.VistaTopProductosVendidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/top-productos-vendidos")
public class VistaTopProductosVendidosController {

    private final VistaTopProductosVendidosService service;

    @Autowired
    public VistaTopProductosVendidosController(VistaTopProductosVendidosService service) {
        this.service = service;
    }

    @GetMapping
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> getAll() {
        return service.findAll();
    }

    @GetMapping("/tipo/{tipoProducto}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> getByTipoProducto(
        @PathVariable String tipoProducto) {
        return service.findByTipoProducto(tipoProducto);
    }

    @GetMapping("/top/{limit}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> getTopN(
        @PathVariable int limit) {
        return service.findTopN(limit);
    }

    @GetMapping("/tipos")
    public List<String> getTiposProducto() {
        return service.getDistinctTipoProducto();
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> getEstadisticas() {
        return service.getEstadisticas();
    }
}
