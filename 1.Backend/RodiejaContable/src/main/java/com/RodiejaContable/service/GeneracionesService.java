package com.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.Generaciones;
import com.rodiejacontable.exception.ResourceNotFoundException;
import com.rodiejacontable.repository.GeneracionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class GeneracionesService {

    @Autowired
    private GeneracionesRepository generacionRepository;
    
    public List<Generaciones> findAll() {
        return generacionRepository.findAll();
    }
    
    public Generaciones findById(Integer id) {
        return generacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Generación no encontrada con id: " + id));
    }
    
    public Generaciones create(Generaciones generacion) {
        // Validar que el año de inicio no sea mayor al año de fin
        if (generacion.getAnioFin() != null && 
            generacion.getAnioInicio() > generacion.getAnioFin()) {
            throw new IllegalArgumentException("El año de inicio no puede ser mayor al año de fin");
        }
        
        // Establecer valores por defecto
        generacion.setFechaCreacion(LocalDateTime.now());
        generacion.setActivo((byte) 1);
        
        // Calcular balance neto si no está establecido
        if (generacion.getBalanceNeto() == null) {
            BigDecimal totalIngresos = generacion.getTotalIngresos() != null ? generacion.getTotalIngresos() : BigDecimal.ZERO;
            BigDecimal totalEgresos = generacion.getTotalEgresos() != null ? generacion.getTotalEgresos() : BigDecimal.ZERO;
            generacion.setBalanceNeto(totalIngresos.subtract(totalEgresos));
        }
        
        return generacionRepository.save(generacion);
    }
    
    public Generaciones update(Integer id, Generaciones generacionDetails) {
        Generaciones generacion = findById(id);
        
        // Actualizar solo los campos no nulos
        if (generacionDetails.getModeloId() != null) {
            generacion.setModeloId(generacionDetails.getModeloId());
        }
        if (generacionDetails.getNombre() != null) {
            generacion.setNombre(generacionDetails.getNombre());
        }
        if (generacionDetails.getDescripcion() != null) {
            generacion.setDescripcion(generacionDetails.getDescripcion());
        }
        if (generacionDetails.getAnioInicio() != null) {
            generacion.setAnioInicio(generacionDetails.getAnioInicio());
        }
        if (generacionDetails.getAnioFin() != null) {
            generacion.setAnioFin(generacionDetails.getAnioFin());
        }
        if (generacionDetails.getTotalInversion() != null) {
            generacion.setTotalInversion(generacionDetails.getTotalInversion());
        }
        if (generacionDetails.getTotalIngresos() != null) {
            generacion.setTotalIngresos(generacionDetails.getTotalIngresos());
        }
        if (generacionDetails.getTotalEgresos() != null) {
            generacion.setTotalEgresos(generacionDetails.getTotalEgresos());
        }
        
        // Recalcular balance neto si hay cambios en ingresos o egresos
        if (generacionDetails.getTotalIngresos() != null || generacionDetails.getTotalEgresos() != null) {
            BigDecimal totalIngresos = generacion.getTotalIngresos() != null ? generacion.getTotalIngresos() : BigDecimal.ZERO;
            BigDecimal totalEgresos = generacion.getTotalEgresos() != null ? generacion.getTotalEgresos() : BigDecimal.ZERO;
            generacion.setBalanceNeto(totalIngresos.subtract(totalEgresos));
        } else if (generacionDetails.getBalanceNeto() != null) {
            generacion.setBalanceNeto(generacionDetails.getBalanceNeto());
        }
        
        if (generacionDetails.getActivo() != null) {
            generacion.setActivo(generacionDetails.getActivo());
        }
        
        return generacionRepository.update(generacion);
    }
    
    public void delete(Integer id) {
        Generaciones generacion = findById(id);
        generacionRepository.delete(generacion.getId());
    }
    
    public List<Generaciones> findByModeloId(Integer modeloId) {
        return generacionRepository.findByModeloId(modeloId);
    }
    
    public List<Generaciones> findByActivo(Byte activo) {
        return generacionRepository.findByActivo(activo);
    }
}
