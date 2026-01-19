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
    
    /**
     * Actualiza un modelo existente con validaciones completas
     * 
     * FLUJO DE VALIDACIÓN:
     * 1. Verificar que el modelo existe (ResourceNotFoundException si no)
     * 2. Si cambió nombre o marca, validar que no exista duplicado
     * 3. Actualizar solo los campos modificables
     * 4. Ejecutar actualización en BD
     * 
     * @param id ID del modelo a actualizar
     * @param modelo Objeto con los nuevos datos
     * @return Modelo actualizado desde la base de datos
     * 
     * @throws ResourceNotFoundException si el modelo no existe
     * @throws ResourceAlreadyExistsException si el nuevo nombre ya existe para esa marca
     */
    @Transactional
    public Modelos update(Integer id, Modelos modelo) {
        
        // =====================================================
        // PASO 1: Verificar que el modelo existe
        // =====================================================
        Modelos existingModelo = modelosRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Modelo no encontrado con ID: " + id
                ));
        
        // =====================================================
        // PASO 2: Validar duplicados solo si cambió nombre o marca
        // =====================================================
        // Solo validamos si hay cambios en nombre O en marca
        // Esto optimiza las consultas a BD
        boolean nombreCambio = !existingModelo.getNombre().equals(modelo.getNombre());
        boolean marcaCambio = !existingModelo.getMarcaId().equals(modelo.getMarcaId());
        
        if (nombreCambio || marcaCambio) {
            // Verificar que no exista otro modelo con ese nombre en esa marca
            boolean existe = modelosRepository.existsByNombreAndMarcaId(
                modelo.getNombre(), 
                modelo.getMarcaId()
            );
            
            if (existe) {
                throw new ResourceAlreadyExistsException(
                    "Ya existe un modelo con el nombre '" + modelo.getNombre() + 
                    "' para la marca ID " + modelo.getMarcaId()
                );
            }
        }
        
        // =====================================================
        // PASO 3: Actualizar campos modificables
        // =====================================================
        // IMPORTANTE: Solo actualizamos campos que el usuario puede modificar
        // No tocamos: id, fecha_creacion (son inmutables)
        
        existingModelo.setMarcaId(modelo.getMarcaId());
        existingModelo.setNombre(modelo.getNombre());
        
        // Para el campo activo: usar el valor enviado, o mantener el actual si es null
        existingModelo.setActivo(
            modelo.getActivo() != null ? modelo.getActivo() : existingModelo.getActivo()
        );
        
        // NOTA: fecha_creacion NO se modifica nunca en un update
        
        // =====================================================
        // PASO 4: Ejecutar actualización en base de datos
        // =====================================================
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
