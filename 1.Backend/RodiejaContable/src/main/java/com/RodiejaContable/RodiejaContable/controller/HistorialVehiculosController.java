package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.enums.HistorialVehiculosAccion;
import com.rodiejacontable.database.jooq.tables.pojos.HistorialVehiculos;
import com.rodiejacontable.service.HistorialVehiculosService;
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

    @PostMapping
    public ResponseEntity<HistorialVehiculos> registrarCambio(
            @RequestParam Integer vehiculoId,
            @RequestParam HistorialVehiculosAccion accion,
            @RequestParam String campoModificado,
            @RequestParam(required = false) String valorAnterior,
            @RequestParam(required = false) String valorNuevo,
            @RequestParam String usuario,
            @RequestParam String ipUsuario,
            @RequestParam(required = false) String observaciones) {
        
        HistorialVehiculos historial = historialService.registrarCambio(
                vehiculoId, accion, campoModificado, valorAnterior, 
                valorNuevo, usuario, ipUsuario, observaciones);
        
        return ResponseEntity.ok(historial);
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
