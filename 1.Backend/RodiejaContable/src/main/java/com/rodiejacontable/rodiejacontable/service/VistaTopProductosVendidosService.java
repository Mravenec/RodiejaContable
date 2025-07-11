package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos;
import com.rodiejacontable.rodiejacontable.repository.VistaTopProductosVendidosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class VistaTopProductosVendidosService {

    private final VistaTopProductosVendidosRepository repository;
    private static final List<String> VALID_TIPOS = List.of("Vehículos", "Repuestos");
    private static final int MAX_LIMIT = 1000;

    @Autowired
    public VistaTopProductosVendidosService(VistaTopProductosVendidosRepository repository) {
        this.repository = repository;
    }

    public List<VistaTopProductosVendidos> findAll() {
        return repository.findAll();
    }

    public List<VistaTopProductosVendidos> findByTipoProducto(String tipoProducto) {
        String tipoNormalizado = normalizeTipoProducto(tipoProducto);
        return repository.findByTipoProducto(tipoNormalizado);
    }

    public List<VistaTopProductosVendidos> findTopN(int limit) {
        if (limit <= 0) {
            throw new IllegalArgumentException("El límite debe ser un número positivo");
        }
        if (limit > MAX_LIMIT) {
            throw new IllegalArgumentException("El límite máximo permitido es " + MAX_LIMIT);
        }
        return repository.findTopN(limit);
    }

    public List<String> getDistinctTipoProducto() {
        return repository.findDistinctTipoProducto();
    }

    public Map<String, Object> getEstadisticas() {
        List<VistaTopProductosVendidos> productos = repository.findAll();
        
        long totalProductos = productos.size();
        long totalVentas = productos.stream()
                .mapToLong(VistaTopProductosVendidos::getVecesVendido)
                .sum();
        
        BigDecimal ingresosTotales = productos.stream()
                .map(VistaTopProductosVendidos::getTotalIngresos)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal comisionesTotales = productos.stream()
                .map(VistaTopProductosVendidos::getTotalComisiones)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal promedioVenta = totalVentas > 0 ? 
                ingresosTotales.divide(BigDecimal.valueOf(totalVentas), 2, RoundingMode.HALF_UP) : 
                BigDecimal.ZERO;
        
        return Map.of(
            "totalProductos", totalProductos,
            "totalVentas", totalVentas,
            "ingresosTotales", ingresosTotales.setScale(2, RoundingMode.HALF_UP),
            "comisionesTotales", comisionesTotales.setScale(2, RoundingMode.HALF_UP),
            "promedioVenta", promedioVenta
        );
    }
    
    public List<VistaTopProductosVendidos> buscarConFiltros(
            String tipo, String busqueda, Integer limit) {
        
        // Validate inputs
        if (tipo != null) {
            tipo = tipo.trim();
            if (!tipo.isEmpty()) {
                tipo = normalizeTipoProducto(tipo);
            } else {
                tipo = null;
            }
        }
        
        if (busqueda != null) {
            busqueda = busqueda.trim();
            if (busqueda.isEmpty()) {
                busqueda = null;
            } else if (busqueda.length() < 2) {
                throw new IllegalArgumentException("El término de búsqueda debe tener al menos 2 caracteres");
            }
        }
        
        if (limit != null) {
            if (limit <= 0) {
                throw new IllegalArgumentException("El límite debe ser un número positivo");
            }
            if (limit > MAX_LIMIT) {
                throw new IllegalArgumentException("El límite máximo permitido es " + MAX_LIMIT);
            }
        }
        
        // At least one filter must be provided
        if (tipo == null && busqueda == null) {
            throw new IllegalArgumentException("Se requiere al menos un criterio de búsqueda (tipo o búsqueda)");
        }
        
        return repository.buscarConFiltros(tipo, busqueda, limit);
    }
    
    private String normalizeTipoProducto(String tipo) {
        if (tipo == null || tipo.trim().isEmpty()) {
            throw new IllegalArgumentException("El tipo de producto no puede estar vacío");
        }
        
        // Normalize the input (trim, lowercase, handle singular/plural)
        String normalized = tipo.trim().toLowerCase().replace(" ", "");
        
        // Try to find a match in a more flexible way
        return VALID_TIPOS.stream()
            .filter(validType -> {
                String normalizedValidType = validType.toLowerCase().replace(" ", "");
                String singularValidType = normalizedValidType.endsWith("s") ? 
                    normalizedValidType.substring(0, normalizedValidType.length() - 1) : 
                    normalizedValidType;
                
                return normalized.startsWith(singularValidType) || 
                       normalized.startsWith(normalizedValidType) ||
                       singularValidType.startsWith(normalized) ||
                       normalizedValidType.startsWith(normalized);
            })
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException(
                "Tipo de producto no válido: '" + tipo + "'. Los valores permitidos son: " + 
                String.join(", ", VALID_TIPOS)));
    }
}
