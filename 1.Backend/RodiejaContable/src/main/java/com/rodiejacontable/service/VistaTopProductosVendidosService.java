package com.rodiejacontable.service;

import com.rodiejacontable.repository.VistaTopProductosVendidosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
public class VistaTopProductosVendidosService {

    private final VistaTopProductosVendidosRepository repository;

    @Autowired
    public VistaTopProductosVendidosService(VistaTopProductosVendidosRepository repository) {
        this.repository = repository;
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> findAll() {
        return repository.findAll();
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> findByTipoProducto(String tipoProducto) {
        return repository.findByTipoProducto(tipoProducto);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> findTopN(int limit) {
        return repository.findTopN(limit);
    }

    public List<String> getDistinctTipoProducto() {
        return repository.findDistinctTipoProducto();
    }

    public Map<String, Object> getEstadisticas() {
        List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> productos = repository.findAll();
        
        long totalProductos = productos.size();
        long totalVentas = productos.stream()
                .mapToLong(com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos::getVecesVendido)
                .sum();
        
        BigDecimal ingresosTotales = productos.stream()
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos::getTotalIngresos)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal comisionesTotales = productos.stream()
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos::getTotalComisiones)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal promedioVenta = totalVentas > 0 ? 
                ingresosTotales.divide(BigDecimal.valueOf(totalVentas), 2, RoundingMode.HALF_UP) : 
                BigDecimal.ZERO;
        
        return Map.of(
            "totalProductos", totalProductos,
            "totalVentas", totalVentas,
            "ingresosTotales", ingresosTotales,
            "comisionesTotales", comisionesTotales,
            "promedioVenta", promedioVenta
        );
    }
}
