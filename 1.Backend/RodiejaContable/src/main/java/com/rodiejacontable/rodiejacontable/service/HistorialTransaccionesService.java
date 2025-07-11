package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.database.jooq.enums.HistorialTransaccionesAccion;
import com.rodiejacontable.database.jooq.tables.pojos.HistorialTransacciones;
import com.rodiejacontable.rodiejacontable.repository.HistorialTransaccionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HistorialTransaccionesService {

    private final HistorialTransaccionesRepository historialRepository;

    @Autowired
    public HistorialTransaccionesService(HistorialTransaccionesRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    @Transactional
    public HistorialTransacciones registrarCambio(
            Integer transaccionId,
            HistorialTransaccionesAccion accion,
            String campoModificado,
            String valorAnterior,
            String valorNuevo,
            String usuario,
            String ipUsuario,
            String observaciones) {
        
        HistorialTransacciones historial = new HistorialTransacciones();
        historial.setTransaccionId(transaccionId);
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

    public Optional<HistorialTransacciones> obtenerPorId(Integer id) {
        return historialRepository.findById(id);
    }

    public List<HistorialTransacciones> obtenerPorTransaccionId(Integer transaccionId) {
        return historialRepository.findByTransaccionId(transaccionId);
    }

    public List<HistorialTransacciones> obtenerTodoElHistorial() {
        return historialRepository.findAll();
    }
}
