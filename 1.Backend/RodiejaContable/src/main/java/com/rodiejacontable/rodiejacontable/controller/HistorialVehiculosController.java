package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.HistorialVehiculos;
import com.rodiejacontable.rodiejacontable.service.HistorialVehiculosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-vehiculos")
public class HistorialVehiculosController {

    private final HistorialVehiculosService historialService;

    @Autowired
    public HistorialVehiculosController(HistorialVehiculosService historialService) {
        this.historialService = historialService;
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<HistorialVehiculos> registrarCambio(
            @RequestBody HistorialVehiculos historial) {
        
        HistorialVehiculos nuevoHistorial = historialService.registrarCambio(
                historial.getVehiculoId(), 
                historial.getAccion(), 
                historial.getCampoModificado(), 
                historial.getValorAnterior(), 
                historial.getValorNuevo(), 
                historial.getUsuario(), 
                historial.getIpUsuario(), 
                historial.getObservaciones());
        
        return ResponseEntity.ok(nuevoHistorial);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistorialVehiculos> obtenerPorId(@PathVariable Integer id) {
        return historialService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/vehiculo/{vehiculoId}")
    public List<HistorialVehiculos> obtenerPorVehiculoId(@PathVariable Integer vehiculoId) {
        return historialService.obtenerPorVehiculoId(vehiculoId);
    }

    @GetMapping
    public List<HistorialVehiculos> obtenerTodo() {
        return historialService.obtenerTodo();
    }
}
