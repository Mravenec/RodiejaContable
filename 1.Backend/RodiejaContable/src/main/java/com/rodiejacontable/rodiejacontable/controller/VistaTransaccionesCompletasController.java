package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.rodiejacontable.service.VistaTransaccionesCompletasService;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasCategoria;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasEstado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/transacciones")
public class VistaTransaccionesCompletasController {

    private final VistaTransaccionesCompletasService service;

    @Autowired
    public VistaTransaccionesCompletasController(VistaTransaccionesCompletasService service) {
        this.service = service;
    }

    @GetMapping
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> getAll() {
        return service.findAll();
    }

    @GetMapping("/rango-fechas")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> getByFechaBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return service.findByFechaBetween(fechaInicio, fechaFin);
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<?> getByCategoria(
            @PathVariable String categoria) {
        try {
            VistaTransaccionesCompletasCategoria categoriaEnum = VistaTransaccionesCompletasCategoria.valueOf(categoria.toUpperCase());
            List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> resultados = service.findByCategoria(categoriaEnum);
            return ResponseEntity.ok(resultados);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "error", "Categoría no válida",
                    "message", "Las categorías válidas son: " + 
                             Arrays.stream(VistaTransaccionesCompletasCategoria.values())
                                 .map(Enum::name)
                                 .collect(Collectors.joining(", ")),
                    "categoriaRecibida", categoria
                )
            );
        }
    }

    @GetMapping("/estado/{estado}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> getByEstado(
            @PathVariable VistaTransaccionesCompletasEstado estado) {
        return service.findByEstado(estado);
    }

    @GetMapping("/empleado/{empleado}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> getByEmpleado(
            @PathVariable String empleado) {
        return service.findByEmpleado(empleado);
    }

    @GetMapping("/resumen")
    public Map<String, Object> getResumen(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return service.getResumenPorRangoFechas(fechaInicio, fechaFin);
    }

    @GetMapping("/estadisticas/empleado/{empleado}")
    public Map<String, Object> getEstadisticasEmpleado(@PathVariable String empleado) {
        return service.getEstadisticasPorEmpleado(empleado);
    }
    
    @GetMapping("/cliente/{id}")
    public ResponseEntity<?> getByCliente(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(
            Map.of(
                "status", "error",
                "message", "Filtering transactions by client is not implemented yet.",
                "details", "The database schema does not currently support querying transactions by client. A relationship between transactions/vehicles and clients needs to be established first."
            )
        );
    }
    
    @GetMapping("/monto-minimo/{monto}")
    public ResponseEntity<?> getByMontoMinimo(@PathVariable BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "status", "error",
                    "message", "El monto mínimo no puede ser negativo"
                )
            );
        }
        
        List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> transacciones = 
            service.findByMontoGreaterThanEqual(monto);
            
        if (transacciones.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of(
                    "status", "not_found",
                    "message", "No se encontraron transacciones con un monto mayor o igual a " + monto
                )
            );
        }
        
        return ResponseEntity.ok(transacciones);
    }
    
    @GetMapping("/monto-maximo/{monto}")
    public ResponseEntity<?> getByMontoMaximo(@PathVariable BigDecimal monto) {
        if (monto.compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "status", "error",
                    "message", "El monto máximo no puede ser negativo"
                )
            );
        }
        
        List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> transacciones = 
            service.findByMontoLessThanEqual(monto);
            
        if (transacciones.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of(
                    "status", "not_found",
                    "message", "No se encontraron transacciones con un monto menor o igual a " + monto
                )
            );
        }
        
        return ResponseEntity.ok(transacciones);
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarTransacciones(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        
        try {
            // Convertir parámetros a mayúsculas para búsqueda insensible a mayúsculas/minúsculas
            String categoriaBuscada = categoria != null ? categoria.toUpperCase() : null;
            String estadoBuscado = estado != null ? estado.toUpperCase() : null;
            
            // Validar fechas
            if (fechaInicio != null && fechaFin != null && fechaInicio.isAfter(fechaFin)) {
                return ResponseEntity.badRequest().body(
                    Map.of(
                        "status", "error",
                        "message", "La fecha de inicio no puede ser posterior a la fecha de fin"
                    )
                );
            }
            
            List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> resultados = 
                service.buscarConFiltros(categoriaBuscada, estadoBuscado, fechaInicio, fechaFin);
            
            if (resultados.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of(
                        "status", "not_found",
                        "message", "No se encontraron transacciones con los filtros especificados"
                    )
                );
            }
            
            return ResponseEntity.ok(Map.of(
                "total", resultados.size(),
                "transacciones", resultados
            ));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "status", "error",
                    "message", e.getMessage(),
                    "details", "Verifique los parámetros de búsqueda"
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of(
                    "status", "error",
                    "message", "Error al buscar transacciones: " + e.getMessage()
                )
            );
        }
    }
    
    @GetMapping("/estadisticas")
    public ResponseEntity<?> getEstadisticas() {
        try {
            Map<String, Object> estadisticas = service.getEstadisticas();
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of(
                    "status", "error",
                    "message", "Error al obtener las estadísticas: " + e.getMessage()
                )
            );
        }
    }
    
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<?> getByTipo(@PathVariable String tipo) {
        try {
            // Convertir a mayúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
            String tipoBuscado = tipo.toUpperCase();
            List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> resultados = service.findByTipoTransaccion(tipoBuscado);
            
            if (resultados.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                        "error", "No se encontraron transacciones",
                        "message", String.format("No hay transacciones para el tipo: %s. Asegúrese de usar un tipo válido como 'COMPRA', 'VENTA', etc.", tipoBuscado),
                        "tipoBuscado", tipoBuscado,
                        "sugerencia", "Consulte /api/v1/transacciones/tipos para ver los tipos de transacción disponibles"
                    ));
            }
            return ResponseEntity.ok(Map.of(
                "total", resultados.size(),
                "transacciones", resultados
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Error al buscar transacciones",
                    "message", e.getMessage(),
                    "tipoBuscado", tipo,
                    "detalle", e.toString()
                ));
        }
    }
    
    @GetMapping("/tipos")
    public ResponseEntity<?> getTiposTransaccion() {
        try {
            List<String> tipos = service.findAll().stream()
                .map(t -> t.getTipoTransaccion())
                .distinct()
                .filter(Objects::nonNull)
                .sorted()
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(Map.of(
                "total_tipos", tipos.size(),
                "tipos", tipos
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Error al obtener los tipos de transacción",
                    "message", e.getMessage()
                ));
        }
    }
    
    @GetMapping("/vehiculo/{placa}")
    public ResponseEntity<?> getByVehiculo(@PathVariable String placa) {
        try {
            // Convertir a mayúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas
            String placaBuscada = placa.toUpperCase();
            List<com.rodiejacontable.database.jooq.tables.pojos.VistaTransaccionesCompletas> resultados = service.findByVehiculo(placaBuscada);
            
            if (resultados.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                        "error", "No se encontraron transacciones",
                        "message", String.format("No hay transacciones para el vehículo con placa: %s", placaBuscada),
                        "placaBuscada", placaBuscada
                    ));
            }
            
            return ResponseEntity.ok(Map.of(
                "total", resultados.size(),
                "vehiculo", placaBuscada,
                "transacciones", resultados
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "error", "Error al buscar transacciones del vehículo",
                    "message", e.getMessage(),
                    "placaBuscada", placa
                ));
        }
    }
}
