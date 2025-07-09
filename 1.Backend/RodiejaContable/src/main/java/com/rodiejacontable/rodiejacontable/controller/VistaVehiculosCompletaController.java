package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.rodiejacontable.service.VistaVehiculosCompletaService;
import com.rodiejacontable.database.jooq.enums.VistaVehiculosCompletaEstado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vehiculos")
public class VistaVehiculosCompletaController {

    private final VistaVehiculosCompletaService service;

    @Autowired
    public VistaVehiculosCompletaController(VistaVehiculosCompletaService service) {
        this.service = service;
    }

    @GetMapping
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> getById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> getByEstado(
            @PathVariable VistaVehiculosCompletaEstado estado) {
        return service.findByEstado(estado);
    }

    @GetMapping("/marca/{marca}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> getByMarca(
            @PathVariable String marca) {
        return service.findByMarca(marca);
    }

    @GetMapping("/modelo/{modelo}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> getByModelo(
            @PathVariable String modelo) {
        return service.findByModelo(modelo);
    }

    @GetMapping("/anio/{anio}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> getByAnio(
            @PathVariable Integer anio) {
        return service.findByAnio(anio);
    }

    @GetMapping("/rango-fechas")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> getByRangoFechasIngreso(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return service.findByRangoFechasIngreso(fechaInicio, fechaFin);
    }

    @GetMapping("/vendidos")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> getVehiculosVendidos() {
        return service.findVehiculosVendidos();
    }

    @GetMapping("/inventario")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> getVehiculosEnInventario() {
        return service.findVehiculosEnInventario();
    }

    @GetMapping("/marcas")
    public List<String> getMarcasDisponibles() {
        return service.getMarcasDisponibles();
    }

    @GetMapping("/modelos")
    public List<String> getModelosDisponibles() {
        return service.getModelosDisponibles();
    }

    @GetMapping("/anios")
    public List<Integer> getAniosDisponibles() {
        return service.getAniosDisponibles();
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> getEstadisticas() {
        return service.getEstadisticasVehiculos();
    }

    @GetMapping("/estadisticas/marca/{marca}")
    public Map<String, Object> getEstadisticasPorMarca(@PathVariable String marca) {
        return service.getEstadisticasPorMarca(marca);
    }
}
