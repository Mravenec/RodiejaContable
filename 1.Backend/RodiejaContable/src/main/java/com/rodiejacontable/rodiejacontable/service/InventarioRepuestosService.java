package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.InventarioRepuestos;
import com.rodiejacontable.rodiejacontable.repository.InventarioRepuestosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InventarioRepuestosService {

    private final InventarioRepuestosRepository inventarioRepuestosRepository;

    @Autowired
    public InventarioRepuestosService(InventarioRepuestosRepository inventarioRepuestosRepository) {
        this.inventarioRepuestosRepository = inventarioRepuestosRepository;
    }

    @Transactional
    public InventarioRepuestos crearRepuesto(InventarioRepuestos repuesto) {
        if (inventarioRepuestosRepository.existsByCodigoRepuesto(repuesto.getCodigoRepuesto())) {
            throw new IllegalStateException("Ya existe un repuesto con el código: " + repuesto.getCodigoRepuesto());
        }
        
        repuesto.setFechaCreacion(LocalDateTime.now());
        repuesto.setFechaActualizacion(LocalDateTime.now());
        
        return inventarioRepuestosRepository.save(repuesto);
    }

    @Transactional
    public InventarioRepuestos actualizarRepuesto(Integer id, InventarioRepuestos repuestoActualizado) {
        InventarioRepuestos repuestoExistente = obtenerPorId(id)
                .orElseThrow(() -> new IllegalStateException("No se encontró el repuesto con ID: " + id));

        // Actualizar campos permitidos
        if (repuestoActualizado.getCodigoRepuesto() != null) {
            repuestoExistente.setCodigoRepuesto(repuestoActualizado.getCodigoRepuesto());
        }
        if (repuestoActualizado.getVehiculoOrigenId() != null) {
            repuestoExistente.setVehiculoOrigenId(repuestoActualizado.getVehiculoOrigenId());
        }
        if (repuestoActualizado.getAnioRegistro() != null) {
            repuestoExistente.setAnioRegistro(repuestoActualizado.getAnioRegistro());
        }
        if (repuestoActualizado.getMesRegistro() != null) {
            repuestoExistente.setMesRegistro(repuestoActualizado.getMesRegistro());
        }
        if (repuestoActualizado.getCodigoUbicacion() != null) {
            repuestoExistente.setCodigoUbicacion(repuestoActualizado.getCodigoUbicacion());
        }
        if (repuestoActualizado.getImagenUrl() != null) {
            repuestoExistente.setImagenUrl(repuestoActualizado.getImagenUrl());
        }
        if (repuestoActualizado.getParteVehiculo() != null) {
            repuestoExistente.setParteVehiculo(repuestoActualizado.getParteVehiculo());
        }
        if (repuestoActualizado.getDescripcion() != null) {
            repuestoExistente.setDescripcion(repuestoActualizado.getDescripcion());
        }
        if (repuestoActualizado.getPrecioCosto() != null) {
            repuestoExistente.setPrecioCosto(repuestoActualizado.getPrecioCosto());
        }
        if (repuestoActualizado.getPrecioVenta() != null) {
            repuestoExistente.setPrecioVenta(repuestoActualizado.getPrecioVenta());
        }
        if (repuestoActualizado.getPrecioMayoreo() != null) {
            repuestoExistente.setPrecioMayoreo(repuestoActualizado.getPrecioMayoreo());
        }
        if (repuestoActualizado.getFormula_15() != null) {
            repuestoExistente.setFormula_15(repuestoActualizado.getFormula_15());
        }
        if (repuestoActualizado.getFormula_30() != null) {
            repuestoExistente.setFormula_30(repuestoActualizado.getFormula_30());
        }
        if (repuestoActualizado.getBodega() != null) {
            repuestoExistente.setBodega(repuestoActualizado.getBodega());
        }
        // Los campos ubicadoEnVehiculo_1 y ubicadoEnVehiculo_2 no existen en la tabla inventario_repuestos
        // Si son necesarios, deben ser agregados a la tabla y regeneradas las clases JOOQ
        if (repuestoActualizado.getZona() != null) {
            repuestoExistente.setZona(repuestoActualizado.getZona());
        }
        if (repuestoActualizado.getPared() != null) {
            repuestoExistente.setPared(repuestoActualizado.getPared());
        }
        if (repuestoActualizado.getMalla() != null) {
            repuestoExistente.setMalla(repuestoActualizado.getMalla());
        }
        if (repuestoActualizado.getEstante() != null) {
            repuestoExistente.setEstante(repuestoActualizado.getEstante());
        }
        if (repuestoActualizado.getPiso() != null) {
            repuestoExistente.setPiso(repuestoActualizado.getPiso());
        }
        if (repuestoActualizado.getPlastica() != null) {
            repuestoExistente.setPlastica(repuestoActualizado.getPlastica());
        }
        if (repuestoActualizado.getCarton() != null) {
            repuestoExistente.setCarton(repuestoActualizado.getCarton());
        }
        if (repuestoActualizado.getPosicion() != null) {
            repuestoExistente.setPosicion(repuestoActualizado.getPosicion());
        }
        if (repuestoActualizado.getEstado() != null) {
            repuestoExistente.setEstado(repuestoActualizado.getEstado());
        }
        
        repuestoExistente.setFechaActualizacion(LocalDateTime.now());
        
        return inventarioRepuestosRepository.save(repuestoExistente);
    }

    public Optional<InventarioRepuestos> obtenerPorId(Integer id) {
        return inventarioRepuestosRepository.findById(id);
    }

    public List<InventarioRepuestos> obtenerPorVehiculoOrigenId(Integer vehiculoId) {
        return inventarioRepuestosRepository.findByVehiculoOrigenId(vehiculoId);
    }

    public List<InventarioRepuestos> buscarPorCodigoRepuesto(String codigoRepuesto) {
        return inventarioRepuestosRepository.findByCodigoRepuesto(codigoRepuesto);
    }

    public List<InventarioRepuestos> obtenerTodos() {
        return inventarioRepuestosRepository.findAll();
    }

    @Transactional
    public void eliminarRepuesto(Integer id) {
        if (!inventarioRepuestosRepository.findById(id).isPresent()) {
            throw new IllegalStateException("No se encontró el repuesto con ID: " + id);
        }
        inventarioRepuestosRepository.delete(id);
    }
}
