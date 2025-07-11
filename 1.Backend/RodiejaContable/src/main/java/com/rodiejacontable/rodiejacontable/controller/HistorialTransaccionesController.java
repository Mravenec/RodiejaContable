package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.enums.HistorialTransaccionesAccion;
import com.rodiejacontable.database.jooq.tables.pojos.HistorialTransacciones;
import com.rodiejacontable.rodiejacontable.service.HistorialTransaccionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-transacciones")
public class HistorialTransaccionesController {

    private final HistorialTransaccionesService historialService;

    @Autowired
    public HistorialTransaccionesController(HistorialTransaccionesService historialService) {
        this.historialService = historialService;
    }

    @PostMapping
    public ResponseEntity<HistorialTransacciones> registrarCambio(
            @RequestParam Integer transaccionId,
            @RequestParam HistorialTransaccionesAccion accion,
            @RequestParam String campoModificado,
            @RequestParam(required = false) String valorAnterior,
            @RequestParam(required = false) String valorNuevo,
            @RequestParam String usuario,
            @RequestParam String ipUsuario,
            @RequestParam(required = false) String observaciones) {
        
        HistorialTransacciones historial = historialService.registrarCambio(
                transaccionId, accion, campoModificado, valorAnterior, 
                valorNuevo, usuario, ipUsuario, observaciones);
        
        return ResponseEntity.ok(historial);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistorialTransacciones> obtenerPorId(@PathVariable Integer id) {
        return historialService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/transaccion/{transaccionId}")
    public List<HistorialTransacciones> obtenerPorTransaccionId(@PathVariable Integer transaccionId) {
        return historialService.obtenerPorTransaccionId(transaccionId);
    }

    @GetMapping
    public List<HistorialTransacciones> obtenerTodoElHistorial() {
        return historialService.obtenerTodoElHistorial();
    }
}
