package com.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.VistaAnalisisFinancieroMensual;
import com.rodiejacontable.repository.VistaAnalisisFinancieroMensualRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VistaAnalisisFinancieroMensualService {

    @Autowired
    private VistaAnalisisFinancieroMensualRepository repository;
    
    public List<VistaAnalisisFinancieroMensual> findAll() {
        return repository.findAll();
    }
    
    public List<VistaAnalisisFinancieroMensual> findByAnio(Integer anio) {
        return repository.findByAnio(anio);
    }
    
    public VistaAnalisisFinancieroMensual findByAnioAndMes(Integer anio, Integer mes) {
        List<VistaAnalisisFinancieroMensual> resultados = repository.findByAnioAndMes(anio, mes);
        return resultados.isEmpty() ? null : resultados.get(0);
    }
    
    public List<Integer> getAniosDisponibles() {
        return repository.findDistinctYears();
    }
    
    public Map<String, Object> getResumenAnual(Integer anio) {
        List<VistaAnalisisFinancieroMensual> datosAnuales = repository.findByAnio(anio);
        
        if (datosAnuales.isEmpty()) {
            return null;
        }
        
        BigDecimal totalIngresosAnual = datosAnuales.stream()
                .map(VistaAnalisisFinancieroMensual::getTotalIngresos)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal totalEgresosAnual = datosAnuales.stream()
                .map(VistaAnalisisFinancieroMensual::getTotalEgresos)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        Long totalTransaccionesAnual = datosAnuales.stream()
                .mapToLong(VistaAnalisisFinancieroMensual::getTotalTransacciones)
                .sum();
                
        Long totalVehiculosVendidos = datosAnuales.stream()
                .mapToLong(VistaAnalisisFinancieroMensual::getVehiculosVendidos)
                .sum();
                
        Long totalRepuestosVendidos = datosAnuales.stream()
                .mapToLong(VistaAnalisisFinancieroMensual::getRepuestosVendidos)
                .sum();
        
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("anio", anio);
        resultado.put("totalIngresos", totalIngresosAnual);
        resultado.put("totalEgresos", totalEgresosAnual);
        resultado.put("balanceNeto", totalIngresosAnual.subtract(totalEgresosAnual));
        resultado.put("totalTransacciones", totalTransaccionesAnual);
        resultado.put("vehiculosVendidos", totalVehiculosVendidos);
        resultado.put("repuestosVendidos", totalRepuestosVendidos);
        resultado.put("promedioVentaMensual", calcularPromedioMensual(totalIngresosAnual, datosAnuales.size()));
        resultado.put("mesesConDatos", datosAnuales.size());
        
        return resultado;
    }
    
    private BigDecimal calcularPromedioMensual(BigDecimal total, int meses) {
        return meses > 0 ? total.divide(BigDecimal.valueOf(meses), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
    }
    
    public Map<String, Object> getTendencias() {
        List<VistaAnalisisFinancieroMensual> todosLosDatos = repository.findAll();
        
        if (todosLosDatos.isEmpty()) {
            return new HashMap<>();
        }
        
        // Agrupar por año
        Map<Integer, List<VistaAnalisisFinancieroMensual>> datosPorAnio = todosLosDatos.stream()
                .collect(Collectors.groupingBy(VistaAnalisisFinancieroMensual::getAnio));
        
        // Calcular totales por año
        List<Map<String, Object>> tendenciasAnuales = datosPorAnio.entrySet().stream()
                .map(entry -> {
                    int anio = entry.getKey();
                    List<VistaAnalisisFinancieroMensual> datos = entry.getValue();
                    
                    BigDecimal ingresos = datos.stream()
                            .map(VistaAnalisisFinancieroMensual::getTotalIngresos)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                            
                    BigDecimal egresos = datos.stream()
                            .map(VistaAnalisisFinancieroMensual::getTotalEgresos)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    Map<String, Object> anioData = new HashMap<>();
                    anioData.put("anio", anio);
                    anioData.put("ingresos", ingresos);
                    anioData.put("egresos", egresos);
                    anioData.put("balanceNeto", ingresos.subtract(egresos));
                    anioData.put("totalTransacciones", datos.stream().mapToLong(VistaAnalisisFinancieroMensual::getTotalTransacciones).sum());
                    anioData.put("vehiculosVendidos", datos.stream().mapToLong(VistaAnalisisFinancieroMensual::getVehiculosVendidos).sum());
                    anioData.put("repuestosVendidos", datos.stream().mapToLong(VistaAnalisisFinancieroMensual::getRepuestosVendidos).sum());
                    
                    return anioData;
                })
                .sorted(Comparator.comparingInt(m -> (Integer) m.get("anio")))
                .collect(Collectors.toList());
        
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("tendenciasAnuales", tendenciasAnuales);
        resultado.put("totalAniosAnalizados", datosPorAnio.size());
        
        return resultado;
    }
}
