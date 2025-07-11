package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.database.jooq.enums.HistorialRepuestosAccion;
import com.rodiejacontable.database.jooq.tables.pojos.HistorialRepuestos;
import com.rodiejacontable.rodiejacontable.repository.HistorialRepuestosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HistorialRepuestosService {

    private final HistorialRepuestosRepository historialRepository;

    @Autowired
    public HistorialRepuestosService(HistorialRepuestosRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    @Transactional
    public HistorialRepuestos registrarCambio(
            Integer repuestoId,
            HistorialRepuestosAccion accion,
            String campoModificado,
            String valorAnterior,
            String valorNuevo,
            String usuario,
            String ipUsuario,
            String observaciones) {
        
        HistorialRepuestos historial = new HistorialRepuestos();
        historial.setRepuestoId(repuestoId);
        historial.setAccion(accion);
        historial.setCampoModificado(campoModificado);
        historial.setValorAnterior(valorAnterior);
        historial.setValorNuevo(valorNuevo);
        historial.setUsuario(usuario);
        historial.setFechaCambio(LocalDateTime.now());
        historial.setIpUsuario(ipUsuario);
        historial.setObservaciones(observaciones);
        
        return historialRepository.save(historial);
    }

    public Optional<HistorialRepuestos> obtenerPorId(Integer id) {
        return historialRepository.findById(id);
    }

    public List<HistorialRepuestos> obtenerPorRepuestoId(Integer repuestoId) {
        return historialRepository.findByRepuestoId(repuestoId);
    }

    public List<HistorialRepuestos> obtenerTodoElHistorial() {
        return historialRepository.findAll();
    }
}
