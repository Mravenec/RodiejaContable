package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.rodiejacontable.service.VistaVentasPorEmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ventas-empleados")
public class VistaVentasPorEmpleadoController {

    private final VistaVentasPorEmpleadoService service;

    @Autowired
    public VistaVentasPorEmpleadoController(VistaVentasPorEmpleadoService service) {
        this.service = service;
    }

    @GetMapping
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> getAll() {
        return service.findAll();
    }

    @GetMapping("/{empleado}")
    public ResponseEntity<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> getByEmpleado(
            @PathVariable String empleado) {
        return service.findByEmpleado(empleado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/top/{limit}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> getTopNVentas(
            @PathVariable int limit) {
        return service.findTopNVentas(limit);
    }

    @GetMapping("/empleados")
    public List<String> getAllEmpleados() {
        return service.findAllEmpleados();
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> getEstadisticas() {
        return service.getEstadisticasGenerales();
    }

    @GetMapping("/estadisticas/{empleado}")
    public Map<String, Object> getEstadisticasPorEmpleado(@PathVariable String empleado) {
        return service.getEstadisticasPorEmpleado(empleado);
    }
}
