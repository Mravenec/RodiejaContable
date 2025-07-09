package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.Modelos;
import com.rodiejacontable.service.ModelosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modelos")
public class ModelosController {

    @Autowired
    private ModelosService modelosService;
    
    @GetMapping
    public ResponseEntity<List<Modelos>> getAll() {
        List<Modelos> modelos = modelosService.findAll();
        return new ResponseEntity<>(modelos, HttpStatus.OK);
    }
    
    @GetMapping("/marca/{marcaId}")
    public ResponseEntity<List<Modelos>> getByMarcaId(@PathVariable Integer marcaId) {
        List<Modelos> modelos = modelosService.findByMarcaId(marcaId);
        return new ResponseEntity<>(modelos, HttpStatus.OK);
    }
    
    @GetMapping("/marca/{marcaId}/activos")
    public ResponseEntity<List<Modelos>> getActivosByMarcaId(@PathVariable Integer marcaId) {
        List<Modelos> modelos = modelosService.findActivosByMarcaId(marcaId);
        return new ResponseEntity<>(modelos, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Modelos> getById(@PathVariable Integer id) {
        Modelos modelo = modelosService.findById(id);
        return new ResponseEntity<>(modelo, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Modelos> create(@RequestBody Modelos modelo) {
        Modelos nuevoModelo = modelosService.create(modelo);
        return new ResponseEntity<>(nuevoModelo, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Modelos> update(@PathVariable Integer id, @RequestBody Modelos modelo) {
        modelo.setId(id); // Asegurar que el ID del path coincida con el del body
        Modelos modeloActualizado = modelosService.update(id, modelo);
        return new ResponseEntity<>(modeloActualizado, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        modelosService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
