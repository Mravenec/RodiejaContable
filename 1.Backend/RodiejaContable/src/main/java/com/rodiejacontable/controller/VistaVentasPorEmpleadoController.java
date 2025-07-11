package com.rodiejacontable.controller;

import com.rodiejacontable.service.VistaVentasPorEmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;

import com.rodiejacontable.exception.EmpleadoNoEncontradoException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ventas-empleados")
public class VistaVentasPorEmpleadoController {

    private final VistaVentasPorEmpleadoService service;

    @Autowired
    public VistaVentasPorEmpleadoController(VistaVentasPorEmpleadoService service) {
        this.service = service;
    }

    @GetMapping
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> getAll() {
        return service.findAll();
    }

    @GetMapping("/{empleado}")
    public ResponseEntity<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> getByEmpleado(
            @PathVariable String empleado) {
        return ResponseEntity.ok(service.findByEmpleado(empleado));
    }

    @GetMapping("/top/{limit}")
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> getTopNVentas(
            @PathVariable int limit) {
        return service.findTopNVentas(limit);
    }

    @GetMapping("/empleados")
    public List<String> getAllEmpleados() {
        return service.findAllEmpleados();
    }

    @GetMapping("/estadisticas")
    public Map<String, Object> getEstadisticas() {
        return service.getEstadisticasGenerales();
    }
    
    @GetMapping("/rango-fechas")
    public ResponseEntity<?> getVentasPorEmpleadoYRangoFechas(
            @RequestParam(required = false) String empleado,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        
        if (fechaInicio.isAfter(fechaFin)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "La fecha de inicio no puede ser posterior a la fecha de fin");
            return ResponseEntity.badRequest().body(error);
        }
        
        try {
            List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> ventas;
            
            if (empleado != null && !empleado.trim().isEmpty()) {
                // Buscar por empleado específico
                ventas = service.findByEmpleadoAndRangoFechas(empleado, fechaInicio, fechaFin);
            } else {
                // Si no se especifica empleado, devolver todos los registros en el rango de fechas
                ventas = service.findByRangoFechas(fechaInicio, fechaFin);
            }
            
            if (ventas.isEmpty()) {
                String mensaje = empleado != null ? 
                    String.format("No se encontraron registros para el empleado: %s en el rango de fechas especificado", empleado) :
                    "No se encontraron registros en el rango de fechas especificado";
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", mensaje));
            }
            
            return ResponseEntity.ok(ventas);
        } catch (EmpleadoNoEncontradoException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }

    @GetMapping("/estadisticas/{empleado}")
    public Map<String, Object> getEstadisticasPorEmpleado(@PathVariable String empleado) {
        return service.getEstadisticasPorEmpleado(empleado);
    }
    
    @GetMapping("/tipo-producto/{tipo}")
    public ResponseEntity<?> getByTipoProducto(@PathVariable String tipo) {
        try {
            List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> ventas = service.findByTipoProducto(tipo);
            if (ventas.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No se encontraron ventas para el tipo de producto: " + tipo));
            }
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }
    
    /**
     * Obtiene las ventas mensuales por empleado para un año específico
     * @param year Año para el cual se desean obtener las ventas
     * @return Lista de ventas mensuales por empleado
     */
    @GetMapping("/mensual/{year}")
    public ResponseEntity<?> getVentasMensualesPorEmpleado(
            @PathVariable int year) {
        try {
            List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> ventas = service.getVentasMensualesPorEmpleado(year);
            if (ventas.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No se encontraron ventas para el año: " + year));
            }
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }
    
    /**
     * Compara las ventas entre múltiples empleados en un rango de fechas
     * @param empleados Lista de nombres de empleados separados por comas
     * @param fechaInicio Fecha de inicio del rango (formato YYYY-MM-DD)
     * @param fechaFin Fecha de fin del rango (formato YYYY-MM-DD)
     * @return Lista de ventas comparativas por empleado
     */
    @GetMapping("/comparativa")
    public ResponseEntity<?> compararVentasEntreEmpleados(
            @RequestParam(name = "empleados") String empleados,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        
        try {
            // Validar que se hayan proporcionado empleados
            if (empleados == null || empleados.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Debe proporcionar al menos un empleado para la comparación"));
            }
            
            // Dividir la cadena de empleados y limpiar espacios en blanco
            List<String> listaEmpleados = Arrays.stream(empleados.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
                    
            if (listaEmpleados.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "La lista de empleados no puede estar vacía"));
            }
            
            // Validar fechas
            if (fechaInicio.isAfter(fechaFin)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "La fecha de inicio no puede ser posterior a la fecha de fin"));
            }
            
            // Obtener las ventas comparativas
            List<com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado> resultados = 
                service.compareVentasEntreEmpleados(listaEmpleados, fechaInicio, fechaFin);
                
            // Preparar la respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("fechaInicio", fechaInicio.toString());
            response.put("fechaFin", fechaFin.toString());
            response.put("totalEmpleados", resultados.size());
            response.put("empleados", resultados);
            
            // Calcular totales
            BigDecimal totalVentas = resultados.stream()
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado::getTotalVentas)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            BigDecimal totalComisiones = resultados.stream()
                .map(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasPorEmpleado::getTotalComisiones)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b != null ? b : BigDecimal.ZERO));
                
            response.put("totalVentas", totalVentas);
            response.put("totalComisiones", totalComisiones);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (EmpleadoNoEncontradoException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al procesar la solicitud: " + e.getMessage()));
        }
    }
}
