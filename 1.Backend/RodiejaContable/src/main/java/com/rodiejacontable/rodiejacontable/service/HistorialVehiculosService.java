package com.rodiejacontable.service;

import com.rodiejacontable.database.jooq.enums.HistorialVehiculosAccion;
import com.rodiejacontable.database.jooq.tables.pojos.HistorialVehiculos;
import com.rodiejacontable.repository.HistorialVehiculosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HistorialVehiculosService {

    private final HistorialVehiculosRepository historialRepository;

    @Autowired
    public HistorialVehiculosService(HistorialVehiculosRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    @Transactional
    public HistorialVehiculos registrarCambio(
            Integer vehiculoId,
            HistorialVehiculosAccion accion,
            String campoModificado,
            String valorAnterior,
            String valorNuevo,
            String usuario,
            String ipUsuario,
            String observaciones) {
        
        HistorialVehiculos historial = new HistorialVehiculos();
        historial.setVehiculoId(vehiculoId);
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

    public Optional<HistorialVehiculos> obtenerPorId(Integer id) {
        return historialRepository.findById(id);
    }

    public List<HistorialVehiculos> obtenerPorVehiculoId(Integer vehiculoId) {
        return historialRepository.findByVehiculoId(vehiculoId);
    }

    public List<HistorialVehiculos> obtenerTodo() {
        return historialRepository.findAll();
    }
}
