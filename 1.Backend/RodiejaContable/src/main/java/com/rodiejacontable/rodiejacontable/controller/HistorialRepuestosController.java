package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.enums.HistorialRepuestosAccion;
import com.rodiejacontable.database.jooq.tables.pojos.HistorialRepuestos;
import com.rodiejacontable.service.HistorialRepuestosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-repuestos")
public class HistorialRepuestosController {

    private final HistorialRepuestosService historialService;

    @Autowired
    public HistorialRepuestosController(HistorialRepuestosService historialService) {
        this.historialService = historialService;
    }

    @PostMapping
    public ResponseEntity<HistorialRepuestos> registrarCambio(
            @RequestParam Integer repuestoId,
            @RequestParam HistorialRepuestosAccion accion,
            @RequestParam String campoModificado,
            @RequestParam(required = false) String valorAnterior,
            @RequestParam(required = false) String valorNuevo,
            @RequestParam String usuario,
            @RequestParam String ipUsuario,
            @RequestParam(required = false) String observaciones) {
        
        HistorialRepuestos historial = historialService.registrarCambio(
                repuestoId, accion, campoModificado, valorAnterior, 
                valorNuevo, usuario, ipUsuario, observaciones);
        
        return ResponseEntity.ok(historial);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistorialRepuestos> obtenerPorId(@PathVariable Integer id) {
        return historialService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/repuesto/{repuestoId}")
    public List<HistorialRepuestos> obtenerPorRepuestoId(@PathVariable Integer repuestoId) {
        return historialService.obtenerPorRepuestoId(repuestoId);
    }

    @GetMapping
    public List<HistorialRepuestos> obtenerTodoElHistorial() {
        return historialService.obtenerTodoElHistorial();
    }
}
