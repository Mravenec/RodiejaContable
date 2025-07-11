package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.VistaAnalisisFinancieroMensual;
import com.rodiejacontable.rodiejacontable.service.VistaAnalisisFinancieroMensualService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analisis-financiero")
public class VistaAnalisisFinancieroMensualController {

    @Autowired
    private VistaAnalisisFinancieroMensualService analisisFinancieroService;

    /**
     * Obtiene todos los análisis financieros mensuales disponibles
     */
    @GetMapping
    public ResponseEntity<List<VistaAnalisisFinancieroMensual>> getAll() {
        return ResponseEntity.ok(analisisFinancieroService.findAll());
    }

    /**
     * Obtiene los análisis financieros para un año específico
     */
    @GetMapping("/anio/{anio}")
    public ResponseEntity<List<VistaAnalisisFinancieroMensual>> getByAnio(@PathVariable Integer anio) {
        return ResponseEntity.ok(analisisFinancieroService.findByAnio(anio));
    }

    /**
     * Obtiene el análisis financiero para un año y mes específicos
     */
    @GetMapping("/anio/{anio}/mes/{mes}")
    public ResponseEntity<VistaAnalisisFinancieroMensual> getByAnioAndMes(
            @PathVariable Integer anio, 
            @PathVariable Integer mes) {
        
        VistaAnalisisFinancieroMensual analisis = analisisFinancieroService.findByAnioAndMes(anio, mes);
        if (analisis == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(analisis);
    }

    /**
     * Obtiene un resumen anual consolidado
     */
    @GetMapping("/resumen-anual/{anio}")
    public ResponseEntity<Map<String, Object>> getResumenAnual(@PathVariable Integer anio) {
        Map<String, Object> resumen = analisisFinancieroService.getResumenAnual(anio);
        if (resumen == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resumen);
    }

    /**
     * Obtiene las tendencias financieras a lo largo de los años
     */
    @GetMapping("/tendencias")
    public ResponseEntity<Map<String, Object>> getTendencias() {
        return ResponseEntity.ok(analisisFinancieroService.getTendencias());
    }

    /**
     * Obtiene la lista de años para los que hay datos disponibles
     */
    @GetMapping("/anios-disponibles")
    public ResponseEntity<List<Integer>> getAniosDisponibles() {
        return ResponseEntity.ok(analisisFinancieroService.getAniosDisponibles());
    }

    /**
     * Obtiene el resumen del año actual
     */
    @GetMapping("/resumen-actual")
    public ResponseEntity<Map<String, Object>> getResumenAnioActual() {
        List<Integer> anios = analisisFinancieroService.getAniosDisponibles();
        if (anios.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Obtener el año más reciente
        int anioActual = anios.get(0);
        return getResumenAnual(anioActual);
    }

    /**
     * Obtiene el análisis del mes actual
     */
    @GetMapping("/mes-actual")
    public ResponseEntity<VistaAnalisisFinancieroMensual> getMesActual() {
        java.time.LocalDate ahora = java.time.LocalDate.now();
        int anio = ahora.getYear();
        int mes = ahora.getMonthValue();
        
        VistaAnalisisFinancieroMensual analisis = analisisFinancieroService.findByAnioAndMes(anio, mes);
        if (analisis == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(analisis);
    }

    /**
     * Obtiene los análisis de los últimos N meses
     */
    @GetMapping("/ultimos-meses/{cantidadMeses}")
    public ResponseEntity<List<VistaAnalisisFinancieroMensual>> getUltimosMeses(
            @PathVariable int cantidadMeses) {
        
        List<VistaAnalisisFinancieroMensual> todos = analisisFinancieroService.findAll();
        if (cantidadMeses <= 0 || cantidadMeses > 24) { // Limitamos a 24 meses como máximo
            cantidadMeses = 12; // Valor por defecto
        }
        
        int cantidadARetornar = Math.min(cantidadMeses, todos.size());
        return ResponseEntity.ok(todos.subList(0, cantidadARetornar));
    }
}
