package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.database.jooq.enums.TiposTransaccionesCategoria;
import com.rodiejacontable.database.jooq.tables.pojos.TiposTransacciones;
import com.rodiejacontable.rodiejacontable.exception.ResourceAlreadyExistsException;
import com.rodiejacontable.rodiejacontable.exception.ResourceNotFoundException;
import com.rodiejacontable.rodiejacontable.repository.TiposTransaccionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TiposTransaccionesService {

    @Autowired
    private TiposTransaccionesRepository tiposTransaccionesRepository;
    
    public List<TiposTransacciones> findAll() {
        return tiposTransaccionesRepository.findAll();
    }
    
    public List<TiposTransacciones> findByCategoria(TiposTransaccionesCategoria categoria) {
        return tiposTransaccionesRepository.findByCategoria(categoria);
    }
    
    public List<TiposTransacciones> findActivos() {
        return tiposTransaccionesRepository.findActivos();
    }
    
    public TiposTransacciones findById(Integer id) {
        return tiposTransaccionesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de transacción no encontrado con ID: " + id));
    }
    
    @Transactional
    public TiposTransacciones create(TiposTransacciones tipoTransaccion) {
        // Validar que no exista un tipo de transacción con el mismo nombre
        if (tiposTransaccionesRepository.existsByNombre(tipoTransaccion.getNombre())) {
            throw new ResourceAlreadyExistsException("Ya existe un tipo de transacción con el nombre: " + tipoTransaccion.getNombre());
        }
        
        // Establecer valores por defecto si es necesario
        if (tipoTransaccion.getActivo() == null) {
            tipoTransaccion.setActivo((byte) 1);
        }
        
        return tiposTransaccionesRepository.save(tipoTransaccion);
    }
    
    @Transactional
    public TiposTransacciones update(Integer id, TiposTransacciones tipoTransaccion) {
        // Verificar que el tipo de transacción exista
        TiposTransacciones existingTipo = findById(id);
        
        // Si se está cambiando el nombre, validar que no exista otro con el mismo nombre
        if (!existingTipo.getNombre().equals(tipoTransaccion.getNombre()) && 
            tiposTransaccionesRepository.existsByNombre(tipoTransaccion.getNombre())) {
            throw new ResourceAlreadyExistsException("Ya existe un tipo de transacción con el nombre: " + tipoTransaccion.getNombre());
        }
        
        // Actualizar los campos modificables
        existingTipo.setNombre(tipoTransaccion.getNombre());
        existingTipo.setDescripcion(tipoTransaccion.getDescripcion());
        existingTipo.setCategoria(tipoTransaccion.getCategoria());
        existingTipo.setActivo(tipoTransaccion.getActivo() != null ? tipoTransaccion.getActivo() : existingTipo.getActivo());
        
        return tiposTransaccionesRepository.update(existingTipo);
    }
    
    @Transactional
    public void delete(Integer id) {
        // Verificar que el tipo de transacción exista
        findById(id);
        
        // Eliminar el tipo de transacción
        tiposTransaccionesRepository.delete(id);
    }
}
