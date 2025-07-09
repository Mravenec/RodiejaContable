package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.rodiejacontable.repository.VistaVehiculosCompletaRepository;
import com.rodiejacontable.database.jooq.enums.VistaVehiculosCompletaEstado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class VistaVehiculosCompletaService {

    private final VistaVehiculosCompletaRepository repository;

    @Autowired
    public VistaVehiculosCompletaService(VistaVehiculosCompletaRepository repository) {
        this.repository = repository;
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> findAll() {
        return repository.findAll();
    }

    public Optional<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> findById(Integer id) {
        return repository.findById(id);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> findByEstado(
            VistaVehiculosCompletaEstado estado) {
        return repository.findByEstado(estado);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> findByMarca(String marca) {
        return repository.findByMarca(marca);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> findByModelo(String modelo) {
        return repository.findByModelo(modelo);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> findByAnio(Integer anio) {
        return repository.findByAnio(anio);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> findByRangoFechasIngreso(
            LocalDate fechaInicio, LocalDate fechaFin) {
        return repository.findByRangoFechasIngreso(fechaInicio, fechaFin);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> findVehiculosVendidos() {
        return repository.findVehiculosVendidos();
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> findVehiculosEnInventario() {
        return repository.findVehiculosEnInventario();
    }

    public List<String> getMarcasDisponibles() {
        return repository.findDistinctMarcas();
    }

    public List<String> getModelosDisponibles() {
        return repository.findDistinctModelos();
    }

    public List<Integer> getAniosDisponibles() {
        return repository.findDistinctAnios();
    }

    public Map<String, Object> getEstadisticasVehiculos() {
        return repository.getEstadisticasGenerales();
    }

    public Map<String, Object> getEstadisticasPorMarca(String marca) {
        List<com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta> vehiculos = repository.findByMarca(marca);
        
        BigDecimal inversionTotal = vehiculos.stream()
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta::getInversionTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal ventasTotales = vehiculos.stream()
                .filter(v -> v.getEstado() == VistaVehiculosCompletaEstado.VENDIDO)
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaVehiculosCompleta::getPrecioVenta)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b != null ? b : BigDecimal.ZERO));
                
        long totalVehiculos = vehiculos.size();
        long vehiculosVendidos = vehiculos.stream()
                .filter(v -> v.getEstado() == VistaVehiculosCompletaEstado.VENDIDO)
                .count();
                
        long vehiculosEnInventario = vehiculos.stream()
                .filter(v -> v.getEstado() == VistaVehiculosCompletaEstado.DISPONIBLE)
                .count();
        
        return Map.of(
                "marca", marca,
                "inversionTotal", inversionTotal,
                "ventasTotales", ventasTotales,
                "gananciaNeta", ventasTotales.subtract(inversionTotal),
                "totalVehiculos", totalVehiculos,
                "vehiculosVendidos", vehiculosVendidos,
                "vehiculosEnInventario", vehiculosEnInventario
        );
    }
}
