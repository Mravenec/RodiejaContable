package com.rodiejacontable.service;

// Using fully qualified class name to avoid ambiguity
import com.rodiejacontable.repository.VistaResumenGeneracionesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class VistaResumenGeneracionesService {

    private final VistaResumenGeneracionesRepository repository;

    @Autowired
    public VistaResumenGeneracionesService(VistaResumenGeneracionesRepository repository) {
        this.repository = repository;
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findAll() {
        return repository.findAll();
    }

    public Optional<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findById(Integer generacionId) {
        return repository.findById(generacionId);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByMarca(String marca) {
        return repository.findByMarca(marca);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByModelo(String modelo) {
        return repository.findByModelo(modelo);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByAnioInicio(Integer anioInicio) {
        return repository.findByAnioInicio(anioInicio);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByAnioFin(Integer anioFin) {
        return repository.findByAnioFin(anioFin);
    }

    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByRangoAnios(Integer anioInicio, Integer anioFin) {
        if (anioInicio > anioFin) {
            throw new IllegalArgumentException("El año de inicio no puede ser mayor al año de fin");
        }
        return repository.findByRangoAnios(anioInicio, anioFin);
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByMotor(String motor) {
        if (motor == null || motor.trim().isEmpty()) {
            throw new IllegalArgumentException("El parámetro 'motor' no puede estar vacío");
        }
        return repository.findByMotor(motor.trim());
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByTransmision(String transmision) {
        if (transmision == null || transmision.trim().isEmpty()) {
            throw new IllegalArgumentException("El parámetro 'transmision' no puede estar vacío");
        }
        return repository.findByTransmision(transmision.trim());
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> findByCombustible(String combustible) {
        if (combustible == null || combustible.trim().isEmpty()) {
            throw new IllegalArgumentException("El parámetro 'combustible' no puede estar vacío");
        }
        return repository.findByCombustible(combustible.trim());
    }
    
    public List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> buscarGeneraciones(
            String marca, 
            String modelo, 
            Integer anioInicio, 
            Integer anioFin) {
        return repository.buscarGeneraciones(marca, modelo, anioInicio, anioFin);
    }

    public Map<String, Object> getEstadisticas() {
        return repository.getEstadisticas();
    }

    public Map<String, Object> getKpis() {
        Map<String, Object> estadisticas = repository.getEstadisticas();
        Map<String, Object> kpis = new HashMap<>();

        // KPI 1: Total de vehículos
        Long totalVehiculos = (Long) estadisticas.get("totalVehiculos");
        kpis.put("totalVehiculos", totalVehiculos != null ? totalVehiculos : 0);

        // KPI 2: Total de repuestos
        Long totalRepuestos = (Long) estadisticas.get("totalRepuestos");
        kpis.put("totalRepuestos", totalRepuestos != null ? totalRepuestos : 0);

        // KPI 3: Inversión total
        BigDecimal totalInversion = (BigDecimal) estadisticas.get("totalInversion");
        kpis.put("totalInversion", totalInversion != null ? 
                "₡" + totalInversion.setScale(2, RoundingMode.HALF_UP) : "₡0.00");

        // KPI 4: Ingresos totales
        BigDecimal totalIngresos = (BigDecimal) estadisticas.get("totalIngresos");
        kpis.put("totalIngresos", totalIngresos != null ? 
                "₡" + totalIngresos.setScale(2, RoundingMode.HALF_UP) : "₡0.00");

        // KPI 5: Balance neto total
        BigDecimal balanceNetoTotal = (BigDecimal) estadisticas.get("balanceNetoTotal");
        kpis.put("balanceNetoTotal", balanceNetoTotal != null ? 
                "₡" + balanceNetoTotal.setScale(2, RoundingMode.HALF_UP) : "₡0.00");

        // KPI 6: Retorno sobre inversión promedio
        BigDecimal porcentajeRetornoPromedio = (BigDecimal) estadisticas.get("porcentajeRetornoPromedio");
        kpis.put("porcentajeRetornoPromedio", porcentajeRetornoPromedio != null ? 
                porcentajeRetornoPromedio.setScale(2, RoundingMode.HALF_UP) + "%" : "0.00%");

        return kpis;
    }

    public Map<String, Object> getFiltros() {
        Map<String, Object> filtros = new HashMap<>();
        
        // Obtener marcas únicas
        filtros.put("marcas", repository.findDistinctMarcas());
        
        // Obtener modelos únicos
        filtros.put("modelos", repository.findDistinctModelos());
        
        // Obtener años de inicio únicos
        filtros.put("aniosInicio", repository.findDistinctAniosInicio());
        
        return filtros;
    }

    public List<Map<String, Object>> getResumenPorMarca() {
        List<com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones> generaciones = repository.findAll();
        Map<String, Map<String, Object>> resumenPorMarca = new HashMap<>();
        
        for (com.rodiejacontable.database.jooq.tables.pojos.VistaResumenGeneraciones generacion : generaciones) {
            String marca = generacion.getMarca();
            
            if (!resumenPorMarca.containsKey(marca)) {
                Map<String, Object> resumen = new HashMap<>();
                resumen.put("marca", marca);
                resumen.put("totalVehiculos", 0L);
                resumen.put("totalInversion", BigDecimal.ZERO);
                resumen.put("totalIngresos", BigDecimal.ZERO);
                resumen.put("balanceNeto", BigDecimal.ZERO);
                resumenPorMarca.put(marca, resumen);
            }
            
            Map<String, Object> resumen = resumenPorMarca.get(marca);
            resumen.put("totalVehiculos", (Long) resumen.get("totalVehiculos") + generacion.getTotalVehiculos());
            resumen.put("totalInversion", ((BigDecimal) resumen.get("totalInversion")).add(generacion.getTotalInversion() != null ? generacion.getTotalInversion() : BigDecimal.ZERO));
            resumen.put("totalIngresos", ((BigDecimal) resumen.get("totalIngresos")).add(generacion.getTotalIngresos() != null ? generacion.getTotalIngresos() : BigDecimal.ZERO));
            resumen.put("balanceNeto", ((BigDecimal) resumen.get("balanceNeto")).add(generacion.getBalanceNeto() != null ? generacion.getBalanceNeto() : BigDecimal.ZERO));
        }
        
        List<Map<String, Object>> resultado = new ArrayList<>(resumenPorMarca.values());
        
        // Calcular ROI para cada marca
        for (Map<String, Object> resumen : resultado) {
            BigDecimal totalInversion = (BigDecimal) resumen.get("totalInversion");
            BigDecimal balanceNeto = (BigDecimal) resumen.get("balanceNeto");
            
            if (totalInversion.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal roi = balanceNeto.divide(totalInversion, 4, RoundingMode.HALF_UP)
                                         .multiply(BigDecimal.valueOf(100));
                resumen.put("roi", roi.setScale(2, RoundingMode.HALF_UP) + "%");
            } else {
                resumen.put("roi", "0.00%");
            }
            
            // Formatear valores monetarios
            resumen.put("totalInversion", "₡" + ((BigDecimal) resumen.get("totalInversion")).setScale(2, RoundingMode.HALF_UP));
            resumen.put("totalIngresos", "₡" + ((BigDecimal) resumen.get("totalIngresos")).setScale(2, RoundingMode.HALF_UP));
            resumen.put("balanceNeto", "₡" + ((BigDecimal) resumen.get("balanceNeto")).setScale(2, RoundingMode.HALF_UP));
        }
        
        return resultado;
    }
}
