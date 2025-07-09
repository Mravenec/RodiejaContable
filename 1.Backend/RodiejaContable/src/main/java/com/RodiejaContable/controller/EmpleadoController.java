package com.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.Empleado;
import com.rodiejacontable.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    @Autowired
    private EmpleadoService empleadoService;

    @GetMapping
    public List<Empleado> getAllEmpleados() {
        return empleadoService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empleado> getEmpleadoById(@PathVariable Integer id) {
        return ResponseEntity.ok(empleadoService.findById(id));
    }

    @PostMapping
    public Empleado createEmpleado(@RequestBody Empleado empleado) {
        return empleadoService.create(empleado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Empleado> updateEmpleado(
            @PathVariable Integer id, 
            @RequestBody Empleado empleadoDetails) {
        return ResponseEntity.ok(empleadoService.update(id, empleadoDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmpleado(@PathVariable Integer id) {
        empleadoService.delete(id);
        return ResponseEntity.ok().build();
    }
}
