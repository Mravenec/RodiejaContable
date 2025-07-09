package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.Marcas;
import com.rodiejacontable.exception.ResourceAlreadyExistsException;
import com.rodiejacontable.exception.ResourceNotFoundException;
import com.rodiejacontable.service.MarcasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcasController {

    @Autowired
    private MarcasService marcasService;

    @GetMapping
    public ResponseEntity<List<Marcas>> getAllMarcas() {
        System.out.println("MarcasController.getAllMarcas() - Getting all marcas...");
        List<Marcas> result = marcasService.findAll();
        System.out.println("MarcasController.getAllMarcas() - First 5 items before response: " + 
                         result.stream().limit(5).map(m -> m.getNombre() + " (ID: " + m.getId() + ")")
                               .collect(java.util.stream.Collectors.toList()));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/activas")
    public ResponseEntity<List<Marcas>> getMarcasActivas() {
        System.out.println("MarcasController.getMarcasActivas() - Getting active marcas...");
        List<Marcas> result = marcasService.findAllActivas();
        System.out.println("MarcasController.getMarcasActivas() - First 5 items before response: " + 
                         result.stream().limit(5).map(m -> m.getNombre() + " (ID: " + m.getId() + ")")
                               .collect(java.util.stream.Collectors.toList()));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marcas> getMarcaById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(marcasService.findById(id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createMarca(@RequestBody Marcas marca) {
        try {
            return new ResponseEntity<>(
                marcasService.create(marca), 
                HttpStatus.CREATED
            );
        } catch (ResourceAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear la marca");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMarca(
            @PathVariable Integer id, 
            @RequestBody Marcas marcaDetails) {
        try {
            return ResponseEntity.ok(marcasService.update(id, marcaDetails));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (ResourceAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la marca");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMarca(@PathVariable Integer id) {
        try {
            marcasService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la marca");
        }
    }
}
