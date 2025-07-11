package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.rodiejacontable.service.VistaTopProductosVendidosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/top-productos-vendidos")
public class VistaTopProductosVendidosController {

    private final VistaTopProductosVendidosService service;
    private static final String UNSUPPORTED_FILTER_MSG = "Filtro no soportado. Los filtros soportados son: tipo, busqueda, limit";

    @Autowired
    public VistaTopProductosVendidosController(VistaTopProductosVendidosService service) {
        this.service = service;
    }

    @GetMapping
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> getAll() {
        return service.findAll();
    }

    @GetMapping("/tipo/{tipoProducto}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> getByTipoProducto(
        @PathVariable String tipoProducto) {
        return service.findByTipoProducto(tipoProducto);
    }

    @GetMapping("/top/{limit}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos> getTopN(
        @PathVariable int limit) {
        return service.findTopN(limit);
    }

    @GetMapping("/tipos")
    public List<String> getTiposProducto() {
        return service.getDistinctTipoProducto();
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> getEstadisticas() {
        return service.getEstadisticas();
    }
    
    // Note: Date range filtering is not supported as the view is an aggregation without date information
    // Note: Filtering by marca, modelo, and categoria is not directly supported as these are not fields in the view
    
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarConFiltros(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) Integer limit,
            @RequestParam Map<String, String> allParams) {
        
        // Check for unsupported parameters
        List<String> unsupportedParams = allParams.keySet().stream()
            .filter(key -> !List.of("tipo", "busqueda", "limit", "marca", "modelo", "categoria").contains(key))
            .collect(Collectors.toList());
            
        if (!unsupportedParams.isEmpty()) {
            String errorMsg = String.format("Parámetros no soportados: %s. Los parámetros soportados son: tipo, busqueda, limit", 
                String.join(", ", unsupportedParams));
            return ResponseEntity.badRequest().body(Map.of("error", errorMsg));
        }
        
        // Log a warning for ignored parameters (marca, modelo, categoria)
        List<String> ignoredParams = allParams.keySet().stream()
            .filter(key -> List.of("marca", "modelo", "categoria").contains(key))
            .collect(Collectors.toList());
            
        if (!ignoredParams.isEmpty()) {
            String warningMsg = String.format("Los siguientes filtros no están disponibles en esta versión y serán ignorados: %s", 
                String.join(", ", ignoredParams));
            // Log the warning (you might want to use a proper logger in production)
            System.out.println("Advertencia: " + warningMsg);
        }
        
        try {
            return ResponseEntity.ok(service.buscarConFiltros(tipo, busqueda, limit));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "parametros_soportados", List.of("tipo", "busqueda", "limit")
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al procesar la solicitud: " + e.getMessage(),
                "tipo_error", e.getClass().getSimpleName()
            ));
        }
    }
    
    // Endpoints no soportados
    @GetMapping("/rango-fechas")
    public ResponseEntity<?> getByRangoFechas() {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Filtrado por rango de fechas no está soportado en esta versión"
        ));
    }
    
    @GetMapping("/marca/{marca}")
    public ResponseEntity<?> getByMarca() {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Filtrado por marca no está soportado en esta versión"
        ));
    }
    
    @GetMapping("/modelo/{modelo}")
    public ResponseEntity<?> getByModelo() {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Filtrado por modelo no está soportado en esta versión"
        ));
    }
    
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<?> getByCategoria() {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Filtrado por categoría no está soportado en esta versión"
        ));
    }
}
