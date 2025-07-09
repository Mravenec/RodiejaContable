package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.enums.TiposTransaccionesCategoria;
import com.rodiejacontable.database.jooq.tables.pojos.TiposTransacciones;
import com.rodiejacontable.service.TiposTransaccionesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-transacciones")
public class TiposTransaccionesController {

    @Autowired
    private TiposTransaccionesService tiposTransaccionesService;
    
    @GetMapping
    public ResponseEntity<List<TiposTransacciones>> getAll() {
        List<TiposTransacciones> tipos = tiposTransaccionesService.findAll();
        return new ResponseEntity<>(tipos, HttpStatus.OK);
    }
    
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<TiposTransacciones>> getByCategoria(
            @PathVariable TiposTransaccionesCategoria categoria) {
        List<TiposTransacciones> tipos = tiposTransaccionesService.findByCategoria(categoria);
        return new ResponseEntity<>(tipos, HttpStatus.OK);
    }
    
    @GetMapping("/activos")
    public ResponseEntity<List<TiposTransacciones>> getActivos() {
        List<TiposTransacciones> tipos = tiposTransaccionesService.findActivos();
        return new ResponseEntity<>(tipos, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TiposTransacciones> getById(@PathVariable Integer id) {
        TiposTransacciones tipo = tiposTransaccionesService.findById(id);
        return new ResponseEntity<>(tipo, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<TiposTransacciones> create(@RequestBody TiposTransacciones tipoTransaccion) {
        TiposTransacciones nuevoTipo = tiposTransaccionesService.create(tipoTransaccion);
        return new ResponseEntity<>(nuevoTipo, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TiposTransacciones> update(
            @PathVariable Integer id, 
            @RequestBody TiposTransacciones tipoTransaccion) {
        tipoTransaccion.setId(id); // Asegurar que el ID del path coincida con el del body
        TiposTransacciones tipoActualizado = tiposTransaccionesService.update(id, tipoTransaccion);
        return new ResponseEntity<>(tipoActualizado, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        tiposTransaccionesService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
