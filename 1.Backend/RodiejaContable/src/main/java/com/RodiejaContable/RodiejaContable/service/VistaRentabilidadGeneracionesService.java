package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.VistaRentabilidadGeneraciones;
import com.rodiejacontable.rodiejacontable.repository.VistaRentabilidadGeneracionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class VistaRentabilidadGeneracionesService {

    @Autowired
    private VistaRentabilidadGeneracionesRepository repository;

    public List<VistaRentabilidadGeneraciones> findAll() {
        return repository.findAll();
    }

    public Optional<VistaRentabilidadGeneraciones> findById(Integer generacionId) {
        return repository.findById(generacionId);
    }

    public List<VistaRentabilidadGeneraciones> findByAnioInicio(Integer anioInicio) {
        return repository.findByAnioInicio(anioInicio);
    }

    public List<VistaRentabilidadGeneraciones> findByAnioFin(Integer anioFin) {
        return repository.findByAnioFin(anioFin);
    }

    public List<VistaRentabilidadGeneraciones> findByRangoAnios(Integer anioInicio, Integer anioFin) {
        if (anioInicio != null && anioFin != null && anioInicio > anioFin) {
            throw new IllegalArgumentException("El año de inicio no puede ser mayor al año de fin");
        }
        return repository.findByRangoAnios(anioInicio, anioFin);
    }

    public List<VistaRentabilidadGeneraciones> findByClasificacionRentabilidad(String clasificacion) {
        return repository.findByClasificacionRentabilidad(clasificacion);
    }

    public List<String> getClasificacionesRentabilidadDisponibles() {
        return repository.findDistinctClasificacionesRentabilidad();
    }

    public List<Integer> getAniosInicioDisponibles() {
        return repository.findDistinctAniosInicio();
    }

    public List<Integer> getAniosFinDisponibles() {
        return repository.findDistinctAniosFin();
    }

    public Map<String, Object> getEstadisticasGenerales() {
        return repository.getEstadisticasGenerales();
    }

    public Map<String, Object> getResumenRentabilidad() {
        List<VistaRentabilidadGeneraciones> generaciones = repository.findAll();
        Map<String, Object> resumen = new HashMap<>();

        if (generaciones.isEmpty()) {
            return resumen;
        }

        // Estadísticas básicas
        resumen.put("totalGeneraciones", generaciones.size());
        
        // Totales
        long totalVehiculos = generaciones.stream()
                .mapToLong(g -> g.getTotalVehiculos() != null ? g.getTotalVehiculos() : 0)
                .sum();
        resumen.put("totalVehiculos", totalVehiculos);

        BigDecimal totalInversion = generaciones.stream()
                .map(g -> g.getTotalInversion() != null ? g.getTotalInversion() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        resumen.put("totalInversion", totalInversion);

        BigDecimal totalIngresos = generaciones.stream()
                .map(g -> g.getTotalIngresos() != null ? g.getTotalIngresos() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        resumen.put("totalIngresos", totalIngresos);

        BigDecimal totalEgresos = generaciones.stream()
                .map(g -> g.getTotalEgresos() != null ? g.getTotalEgresos() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        resumen.put("totalEgresos", totalEgresos);

        BigDecimal balanceNetoTotal = generaciones.stream()
                .map(g -> g.getBalanceNeto() != null ? g.getBalanceNeto() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        resumen.put("balanceNetoTotal", balanceNetoTotal);

        // Promedios
        double promedioRoi = generaciones.stream()
                .filter(g -> g.getRoiPorcentaje() != null)
                .mapToDouble(g -> g.getRoiPorcentaje().doubleValue())
                .average()
                .orElse(0.0);
        resumen.put("promedioRoi", BigDecimal.valueOf(promedioRoi).setScale(2, RoundingMode.HALF_UP));

        // Conteo por clasificación de rentabilidad
        Map<String, Long> conteoPorClasificacion = generaciones.stream()
                .filter(g -> g.getClasificacionRentabilidad() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        VistaRentabilidadGeneraciones::getClasificacionRentabilidad,
                        java.util.stream.Collectors.counting()
                ));
        resumen.put("conteoPorClasificacion", conteoPorClasificacion);

        // Mejor y peor generación por ROI
        generaciones.stream()
                .filter(g -> g.getRoiPorcentaje() != null)
                .max(Comparator.comparing(VistaRentabilidadGeneraciones::getRoiPorcentaje))
                .ifPresent(mejor -> resumen.put("mejorGeneracion", Map.of(
                        "generacion", mejor.getGeneracionCompleta(),
                        "roi", mejor.getRoiPorcentaje()
                )));

        generaciones.stream()
                .filter(g -> g.getRoiPorcentaje() != null)
                .min(Comparator.comparing(VistaRentabilidadGeneraciones::getRoiPorcentaje))
                .ifPresent(peor -> resumen.put("peorGeneracion", Map.of(
                        "generacion", peor.getGeneracionCompleta(),
                        "roi", peor.getRoiPorcentaje()
                )));

        return resumen;
    }

    public Map<String, Object> getEstadisticasPorAnio() {
        List<VistaRentabilidadGeneraciones> generaciones = repository.findAll();
        Map<Integer, Map<String, Object>> estadisticasPorAnio = new TreeMap<>();

        for (VistaRentabilidadGeneraciones gen : generaciones) {
            if (gen.getAnioInicio() == null) continue;
            
            int anio = gen.getAnioInicio();
            Map<String, Object> estadisticas = estadisticasPorAnio.computeIfAbsent(anio, k -> new HashMap<>());
            
            // Inicializar si es necesario
            if (!estadisticas.containsKey("anio")) {
                estadisticas.put("anio", anio);
                estadisticas.put("totalGeneraciones", 0);
                estadisticas.put("totalVehiculos", 0L);
                estadisticas.put("totalInversion", BigDecimal.ZERO);
                estadisticas.put("totalIngresos", BigDecimal.ZERO);
                estadisticas.put("acumuladoRoi", BigDecimal.ZERO);
            }
            
            // Actualizar estadísticas
            estadisticas.put("totalGeneraciones", (Integer)estadisticas.get("totalGeneraciones") + 1);
            estadisticas.put("totalVehiculos", (Long)estadisticas.get("totalVehiculos") + 
                    (gen.getTotalVehiculos() != null ? gen.getTotalVehiculos() : 0));
            
            BigDecimal inversion = gen.getTotalInversion() != null ? gen.getTotalInversion() : BigDecimal.ZERO;
            estadisticas.put("totalInversion", ((BigDecimal)estadisticas.get("totalInversion")).add(inversion));
            
            BigDecimal ingresos = gen.getTotalIngresos() != null ? gen.getTotalIngresos() : BigDecimal.ZERO;
            estadisticas.put("totalIngresos", ((BigDecimal)estadisticas.get("totalIngresos")).add(ingresos));
            
            if (gen.getRoiPorcentaje() != null) {
                BigDecimal acumuladoRoi = (BigDecimal) estadisticas.get("acumuladoRoi");
                estadisticas.put("acumuladoRoi", acumuladoRoi.add(gen.getRoiPorcentaje()));
            }
        }
        
        // Calcular promedios
        for (Map<String, Object> estadisticas : estadisticasPorAnio.values()) {
            int totalGens = (Integer) estadisticas.get("totalGeneraciones");
            BigDecimal acumuladoRoi = (BigDecimal) estadisticas.get("acumuladoRoi");
            
            if (totalGens > 0) {
                BigDecimal promedioRoi = acumuladoRoi.divide(
                    BigDecimal.valueOf(totalGens), 2, RoundingMode.HALF_UP);
                estadisticas.put("promedioRoi", promedioRoi);
            } else {
                estadisticas.put("promedioRoi", BigDecimal.ZERO);
            }
            
            // Eliminar campo temporal
            estadisticas.remove("acumuladoRoi");
        }
        
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("porAnio", new ArrayList<>(estadisticasPorAnio.values()));
        return resultado;
    }
}
