package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.enums.VehiculosEstado;
import com.rodiejacontable.database.jooq.tables.pojos.Vehiculos;
import com.rodiejacontable.rodiejacontable.service.VehiculosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
public class VehiculosController {

    @Autowired
    private VehiculosService vehiculosService;
    
    @GetMapping
    public ResponseEntity<List<Vehiculos>> getAll() {
        List<Vehiculos> vehiculos = vehiculosService.findAll();
        return new ResponseEntity<>(vehiculos, HttpStatus.OK);
    }
    
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Vehiculos>> getByEstado(@PathVariable VehiculosEstado estado) {
        List<Vehiculos> vehiculos = vehiculosService.findByEstado(estado);
        return new ResponseEntity<>(vehiculos, HttpStatus.OK);
    }
    
    @GetMapping("/generacion/{generacionId}")
    public ResponseEntity<List<Vehiculos>> getByGeneracionId(@PathVariable Integer generacionId) {
        List<Vehiculos> vehiculos = vehiculosService.findByGeneracionId(generacionId);
        return new ResponseEntity<>(vehiculos, HttpStatus.OK);
    }
    
    @GetMapping("/anio/{anio}")
    public ResponseEntity<List<Vehiculos>> getByAnio(@PathVariable Integer anio) {
        List<Vehiculos> vehiculos = vehiculosService.findByAnio(anio);
        return new ResponseEntity<>(vehiculos, HttpStatus.OK);
    }
    
    @GetMapping("/activos")
    public ResponseEntity<List<Vehiculos>> getActivos() {
        List<Vehiculos> vehiculos = vehiculosService.findActivos();
        return new ResponseEntity<>(vehiculos, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Vehiculos> getById(@PathVariable Integer id) {
        Vehiculos vehiculo = vehiculosService.findById(id);
        return new ResponseEntity<>(vehiculo, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Vehiculos> create(@RequestBody Vehiculos vehiculo) {
        Vehiculos nuevoVehiculo = vehiculosService.create(vehiculo);
        return new ResponseEntity<>(nuevoVehiculo, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Vehiculos> update(
            @PathVariable Integer id, 
            @RequestBody Vehiculos vehiculo) {
        
        vehiculo.setId(id); // Asegurar que el ID del path coincida con el del body
        Vehiculos vehiculoActualizado = vehiculosService.update(id, vehiculo);
        return new ResponseEntity<>(vehiculoActualizado, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        vehiculosService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<Void> updateEstado(
            @PathVariable Integer id,
            @RequestParam VehiculosEstado estado) {
        
        vehiculosService.actualizarEstado(id, estado);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PostMapping("/{id}/vender")
    public ResponseEntity<Void> marcarComoVendido(
            @PathVariable Integer id,
            @RequestParam BigDecimal precioVenta,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaVenta) {
        
        if (fechaVenta == null) {
            fechaVenta = LocalDate.now();
        }
        
        vehiculosService.marcarComoVendido(id, precioVenta, fechaVenta);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/resumen-inventario")
    public ResponseEntity<ResumenInventario> getResumenInventario() {
        List<Vehiculos> vehiculos = vehiculosService.findActivos();
        
        ResumenInventario resumen = new ResumenInventario();
        resumen.setTotalVehiculos(vehiculos.size());
        
        BigDecimal inversionTotal = vehiculos.stream()
                .map(Vehiculos::getInversionTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        resumen.setInversionTotal(inversionTotal);
        
        long disponibles = vehiculos.stream()
                .filter(v -> v.getEstado() == VehiculosEstado.DISPONIBLE)
                .count();
        resumen.setDisponibles((int) disponibles);
        
        long enReparacion = vehiculos.stream()
                .filter(v -> v.getEstado() == VehiculosEstado.REPARACION)
                .count();
        resumen.setEnReparacion((int) enReparacion);
        
        long vendidos = vehiculos.stream()
                .filter(v -> v.getEstado() == VehiculosEstado.VENDIDO)
                .count();
        resumen.setVendidos((int) vendidos);
        
        long desarmados = vehiculos.stream()
                .filter(v -> v.getEstado() == VehiculosEstado.DESARMADO)
                .count();
        resumen.setDesarmados((int) desarmados);
        
        return new ResponseEntity<>(resumen, HttpStatus.OK);
    }
    
    // Clase interna para el resumen de inventario
    public static class ResumenInventario {
        private int totalVehiculos;
        private BigDecimal inversionTotal;
        private int disponibles;
        private int enReparacion;
        private int vendidos;
        private int desarmados;
        
        // Getters y setters
        public int getTotalVehiculos() { return totalVehiculos; }
        public void setTotalVehiculos(int totalVehiculos) { this.totalVehiculos = totalVehiculos; }
        
        public BigDecimal getInversionTotal() { return inversionTotal; }
        public void setInversionTotal(BigDecimal inversionTotal) { this.inversionTotal = inversionTotal; }
        
        public int getDisponibles() { return disponibles; }
        public void setDisponibles(int disponibles) { this.disponibles = disponibles; }
        
        public int getEnReparacion() { return enReparacion; }
        public void setEnReparacion(int enReparacion) { this.enReparacion = enReparacion; }
        
        public int getVendidos() { return vendidos; }
        public void setVendidos(int vendidos) { this.vendidos = vendidos; }
        
        public int getDesarmados() { return desarmados; }
        public void setDesarmados(int desarmados) { this.desarmados = desarmados; }
    }
}
