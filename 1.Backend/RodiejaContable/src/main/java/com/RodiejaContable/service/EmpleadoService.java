package com.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.Empleados;
import com.rodiejacontable.exception.ResourceNotFoundException;
import com.rodiejacontable.repository.EmpleadosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EmpleadosService {

    @Autowired
    private EmpleadosRepository empleadoRepository;
    
    public List<Empleados> findAll() {
        return empleadoRepository.findAll();
    }
    
    public Empleados findById(Integer id) {
        return empleadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con id: " + id));
    }
    
    public Empleados create(Empleados empleado) {
        empleado.setFechaCreacion(LocalDateTime.now());
        empleado.setActivo((byte) 1); // Por defecto activo
        return empleadoRepository.save(empleado);
    }
    
    public Empleados update(Integer id, Empleados empleadoDetails) {
        Empleado empleado = findById(id);
        
        empleado.setNombre(empleadoDetails.getNombre() != null ? empleadoDetails.getNombre() : empleado.getNombre());
        empleado.setActivo(empleadoDetails.getActivo() != null ? empleadoDetails.getActivo() : empleado.getActivo());
        
        return empleadoRepository.update(empleado);
    }
    
    public void delete(Integer id) {
        Empleado empleado = findById(id);
        empleadoRepository.delete(empleado.getId());
    }
}
