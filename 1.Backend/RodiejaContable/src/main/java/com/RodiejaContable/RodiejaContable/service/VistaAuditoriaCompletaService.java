package com.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.VistaAuditoriaCompleta;
import com.rodiejacontable.repository.VistaAuditoriaCompletaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VistaAuditoriaCompletaService {

    @Autowired
    private VistaAuditoriaCompletaRepository repository;
    
    public List<VistaAuditoriaCompleta> findAll() {
        return repository.findAll();
    }
    
    public List<VistaAuditoriaCompleta> findByTipoEntidad(String tipoEntidad) {
        return repository.findByTipoEntidad(tipoEntidad);
    }
    
    public List<VistaAuditoriaCompleta> findByEntidadId(String entidadId) {
        return repository.findByEntidadId(entidadId);
    }
    
    public List<VistaAuditoriaCompleta> findByUsuario(String usuario) {
        return repository.findByUsuario(usuario);
    }
    
    public List<VistaAuditoriaCompleta> findByFechaCambioBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return repository.findByFechaCambioBetween(fechaInicio, fechaFin);
    }
    
    public List<VistaAuditoriaCompleta> findByAccion(String accion) {
        return repository.findByAccion(accion);
    }
    
    public List<VistaAuditoriaCompleta> buscarAuditoria(
            String tipoEntidad, 
            String entidadId, 
            String usuario, 
            String accion,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin) {
        
        return repository.findAll().stream()
            .filter(audit -> tipoEntidad == null || audit.getTipoEntidad().equals(tipoEntidad))
            .filter(audit -> entidadId == null || audit.getEntidadId().equals(entidadId))
            .filter(audit -> usuario == null || audit.getUsuario().equals(usuario))
            .filter(audit -> accion == null || audit.getAccion().equals(accion))
            .filter(audit -> fechaInicio == null || !audit.getFechaCambio().isBefore(fechaInicio))
            .filter(audit -> fechaFin == null || !audit.getFechaCambio().isAfter(fechaFin))
            .collect(Collectors.toList());
    }
    
    public Map<String, Object> getFiltrosDisponibles() {
        return Map.of(
            "tiposEntidad", repository.findDistinctTiposEntidad(),
            "usuarios", repository.findDistinctUsuarios(),
            "acciones", repository.findDistinctAcciones()
        );
    }
    
    public Map<String, Long> getEstadisticasPorTipoEntidad() {
        return repository.findAll().stream()
            .collect(Collectors.groupingBy(
                VistaAuditoriaCompleta::getTipoEntidad,
                Collectors.counting()
            ));
    }
    
    public Map<String, Long> getEstadisticasPorAccion() {
        return repository.findAll().stream()
            .collect(Collectors.groupingBy(
                VistaAuditoriaCompleta::getAccion,
                Collectors.counting()
            ));
    }
    
    public Map<String, Long> getEstadisticasPorUsuario() {
        return repository.findAll().stream()
            .collect(Collectors.groupingBy(
                VistaAuditoriaCompleta::getUsuario,
                Collectors.counting()
            ));
    }
    
    public Map<String, Object> getResumenAuditoria() {
        Map<String, Object> resumen = new java.util.HashMap<>();
        resumen.put("totalRegistros", repository.findAll().size());
        resumen.put("porTipoEntidad", getEstadisticasPorTipoEntidad());
        resumen.put("porAccion", getEstadisticasPorAccion());
        resumen.put("porUsuario", getEstadisticasPorUsuario());
        resumen.put("filtrosDisponibles", getFiltrosDisponibles());
        return resumen;
    }
}
