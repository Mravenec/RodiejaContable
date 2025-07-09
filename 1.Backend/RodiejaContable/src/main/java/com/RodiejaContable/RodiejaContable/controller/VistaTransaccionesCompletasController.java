package com.RodiejaContable.RodiejaContable.controller;

import com.RodiejaContable.RodiejaContable.service.VistaTransaccionesCompletasService;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasCategoria;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasEstado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/transacciones")
public class VistaTransaccionesCompletasController {

    private final VistaTransaccionesCompletasService service;

    @Autowired
    public VistaTransaccionesCompletasController(VistaTransaccionesCompletasService service) {
        this.service = service;
    }

    @GetMapping
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> getAll() {
        return service.findAll();
    }

    @GetMapping("/rango-fechas")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> getByFechaBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return service.findByFechaBetween(fechaInicio, fechaFin);
    }

    @GetMapping("/categoria/{categoria}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> getByCategoria(
            @PathVariable VistaTransaccionesCompletasCategoria categoria) {
        return service.findByCategoria(categoria);
    }

    @GetMapping("/estado/{estado}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> getByEstado(
            @PathVariable VistaTransaccionesCompletasEstado estado) {
        return service.findByEstado(estado);
    }

    @GetMapping("/empleado/{empleado}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> getByEmpleado(
            @PathVariable String empleado) {
        return service.findByEmpleado(empleado);
    }

    @GetMapping("/resumen")
    public Map<String, Object> getResumen(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return service.getResumenPorRangoFechas(fechaInicio, fechaFin);
    }

    @GetMapping("/estadisticas/empleado/{empleado}")
    public Map<String, Object> getEstadisticasEmpleado(@PathVariable String empleado) {
        return service.getEstadisticasPorEmpleado(empleado);
    }
}
