package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.Modelos;
import com.rodiejacontable.rodiejacontable.exception.ResourceAlreadyExistsException;
import com.rodiejacontable.rodiejacontable.exception.ResourceNotFoundException;
import com.rodiejacontable.rodiejacontable.service.ModelosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

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
    
    /**
     * Actualiza un modelo existente por ID
     * 
     * @param id ID del modelo a actualizar (desde URL path)
     * @param modelo Objeto Modelos con los nuevos datos (desde request body)
     * @return ResponseEntity con el modelo actualizado y HTTP 200 OK
     * 
     * @throws ResourceNotFoundException si el modelo no existe (HTTP 404)
     * @throws ResourceAlreadyExistsException si el nuevo nombre ya existe para esa marca (HTTP 409)
     * 
     * Ejemplo de uso:
     * PUT /api/modelos/1
     * Body: {"marcaId": 1, "nombre": "Corolla Cross", "activo": 1}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Modelos> update(
            @PathVariable Integer id,
            @Valid @RequestBody Modelos modelo) {
        
        // Asegurar que el ID del path coincida con el objeto
        // Esto previene inconsistencias entre URL y body
        modelo.setId(id);
        
        // Delegar la lógica de actualización al servicio
        Modelos modeloActualizado = modelosService.update(id, modelo);
        
        // Retornar el modelo actualizado con status HTTP 200 OK
        return new ResponseEntity<>(modeloActualizado, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        modelosService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
