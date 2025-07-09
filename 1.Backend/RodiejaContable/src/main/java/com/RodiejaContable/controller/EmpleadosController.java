package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.Empleados;
import com.rodiejacontable.service.EmpleadosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadosController {

    @Autowired
    private EmpleadosService empleadoService;

    @GetMapping
    public List<Empleados> getAllEmpleados() {
        return empleadoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleados> getEmpleadoById(@PathVariable Integer id) {
        return ResponseEntity.ok(empleadoService.findById(id));
    }

    @PostMapping
    public Empleados createEmpleado(@RequestBody Empleados empleado) {
        return empleadoService.create(empleado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empleados> updateEmpleado(
            @PathVariable Integer id, 
            @RequestBody Empleados empleadoDetails) {
        return ResponseEntity.ok(empleadoService.update(id, empleadoDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmpleado(@PathVariable Integer id) {
        empleadoService.delete(id);
        return ResponseEntity.ok().build();
    }
}
