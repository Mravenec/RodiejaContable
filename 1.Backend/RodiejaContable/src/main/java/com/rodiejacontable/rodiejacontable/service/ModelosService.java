package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.Modelos;
import com.rodiejacontable.rodiejacontable.exception.ResourceAlreadyExistsException;
import com.rodiejacontable.rodiejacontable.exception.ResourceNotFoundException;
import com.rodiejacontable.rodiejacontable.repository.ModelosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ModelosService {

    @Autowired
    private ModelosRepository modelosRepository;
    
    public List<Modelos> findAll() {
        return modelosRepository.findAll();
    }
    
    public List<Modelos> findByMarcaId(Integer marcaId) {
        return modelosRepository.findByMarcaId(marcaId);
    }
    
    public List<Modelos> findActivosByMarcaId(Integer marcaId) {
        return modelosRepository.findActivosByMarcaId(marcaId);
    }
    
    public Modelos findById(Integer id) {
        return modelosRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Modelo no encontrado con ID: " + id));
    }
    
    @Transactional
    public Modelos create(Modelos modelo) {
        // Validar que no exista un modelo con el mismo nombre para la misma marca
        if (modelosRepository.existsByNombreAndMarcaId(modelo.getNombre(), modelo.getMarcaId())) {
            throw new ResourceAlreadyExistsException("Ya existe un modelo con el nombre: " + modelo.getNombre() + " para esta marca");
        }
        
        // Establecer valores por defecto
        if (modelo.getActivo() == null) {
            modelo.setActivo((byte) 1);
        }
        
        if (modelo.getFechaCreacion() == null) {
            modelo.setFechaCreacion(LocalDateTime.now());
        }
        
        return modelosRepository.save(modelo);
    }
    
    @Transactional
    public Modelos update(Integer id, Modelos modelo) {
        // Verificar que el modelo exista
        Modelos existingModelo = findById(id);
        
        // Si se está cambiando el nombre, validar que no exista otro con el mismo nombre en la misma marca
        if (!existingModelo.getNombre().equals(modelo.getNombre()) || 
            !existingModelo.getMarcaId().equals(modelo.getMarcaId())) {
                
            if (modelosRepository.existsByNombreAndMarcaId(modelo.getNombre(), modelo.getMarcaId())) {
                throw new ResourceAlreadyExistsException("Ya existe un modelo con el nombre: " + modelo.getNombre() + " para esta marca");
            }
        }
        
        // Actualizar los campos modificables
        existingModelo.setMarcaId(modelo.getMarcaId());
        existingModelo.setNombre(modelo.getNombre());
        existingModelo.setActivo(modelo.getActivo() != null ? modelo.getActivo() : existingModelo.getActivo());
        
        return modelosRepository.update(existingModelo);
    }
    
    @Transactional
    public void delete(Integer id) {
        // Verificar que el modelo exista
        findById(id);
        
        // Eliminar el modelo
        modelosRepository.delete(id);
    }
}
