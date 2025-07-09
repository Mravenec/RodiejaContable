package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.Generaciones;
import com.rodiejacontable.service.GeneracionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/generaciones")
public class GeneracionesController {

    @Autowired
    private GeneracionesService generacionService;

    @GetMapping
    public List<Generaciones> getAllGeneraciones() {
        return generacionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Generaciones> getGeneracionById(@PathVariable Integer id) {
        return ResponseEntity.ok(generacionService.findById(id));
    }

    @PostMapping
    public Generaciones createGeneracion(@RequestBody Generaciones generacion) {
        return generacionService.create(generacion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Generaciones> updateGeneracion(
            @PathVariable Integer id, 
            @RequestBody Generaciones generacionDetails) {
        return ResponseEntity.ok(generacionService.update(id, generacionDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGeneracion(@PathVariable Integer id) {
        generacionService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/modelo/{modeloId}")
    public List<Generaciones> getGeneracionesByModeloId(@PathVariable Integer modeloId) {
        return generacionService.findByModeloId(modeloId);
    }

    @GetMapping("/activo/{activo}")
    public List<Generaciones> getGeneracionesActivas(@RequestParam(defaultValue = "1") Byte activo) {
        return generacionService.findByActivo(activo);
    }
}
