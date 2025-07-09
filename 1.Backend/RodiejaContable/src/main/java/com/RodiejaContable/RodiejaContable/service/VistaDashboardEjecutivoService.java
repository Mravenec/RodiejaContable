package com.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.VistaDashboardEjecutivo;
import com.rodiejacontable.repository.VistaDashboardEjecutivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class VistaDashboardEjecutivoService {

    @Autowired
    private VistaDashboardEjecutivoRepository repository;
    
    public List<VistaDashboardEjecutivo> getDashboardData() {
        return repository.findAll();
    }
    
    public VistaDashboardEjecutivo getDashboardBySeccion(String seccion) {
        return repository.findBySeccion(seccion);
    }
    
    @SuppressWarnings("unchecked")
    public Map<String, Object> getResumenGeneral() {
        Map<String, Object> resumen = new java.util.HashMap<>();
        
        try {
            // Totales generales
            resumen.put("totalInversion", getSafeBigDecimal(repository.getTotalInversion()));
            resumen.put("totalIngresos", getSafeBigDecimal(repository.getTotalIngresos()));
            resumen.put("totalEgresos", getSafeBigDecimal(repository.getTotalEgresos()));
            resumen.put("balanceNeto", calculateBalanceNeto());
            
            // Resumen de vehículos
            Map<String, Object> vehiculos = new HashMap<>();
            vehiculos.put("total", repository.getTotalVehiculos() != null ? repository.getTotalVehiculos() : 0L);
            vehiculos.put("disponibles", repository.getTotalVehiculosDisponibles() != null ? repository.getTotalVehiculosDisponibles() : 0L);
            vehiculos.put("vendidos", repository.getTotalVehiculosVendidos() != null ? repository.getTotalVehiculosVendidos() : 0L);
            resumen.put("vehiculos", vehiculos);
            
            // Resumen de repuestos
            Map<String, Object> repuestos = new HashMap<>();
            Long totalRepuestos = repository.getTotalRepuestos() != null ? repository.getTotalRepuestos() : 0L;
            Long repuestosStock = repository.getTotalRepuestosStock() != null ? repository.getTotalRepuestosStock() : 0L;
            repuestos.put("total", totalRepuestos);
            repuestos.put("enStock", repuestosStock);
            repuestos.put("vendidos", Math.max(0, totalRepuestos - repuestosStock));
            resumen.put("repuestos", repuestos);
            
            // Métricas financieras
            Map<String, Object> metricas = new HashMap<>();
            metricas.put("roiPromedio", getSafeBigDecimal(repository.getRoiPromedio()));
            metricas.put("margenBeneficio", calculateMargenBeneficio());
            resumen.put("metricas", metricas);
        } catch (Exception e) {
            // Log the error and return an empty map or handle it appropriately
            e.printStackTrace();
            return new HashMap<>();
        }
        
        return resumen;
    }
    
    private BigDecimal calculateBalanceNeto() {
        BigDecimal ingresos = getSafeBigDecimal(repository.getTotalIngresos());
        BigDecimal egresos = getSafeBigDecimal(repository.getTotalEgresos());
        return ingresos.subtract(egresos);
    }
    
    private BigDecimal calculateMargenBeneficio() {
        BigDecimal ingresos = getSafeBigDecimal(repository.getTotalIngresos());
        BigDecimal egresos = getSafeBigDecimal(repository.getTotalEgresos());
        
        if (ingresos.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return ingresos.subtract(egresos)
                      .divide(ingresos, 4, RoundingMode.HALF_UP)
                      .multiply(BigDecimal.valueOf(100));
    }
    
    private BigDecimal getSafeBigDecimal(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }
        try {
            return value.setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }
    
    public Map<String, Object> getMetricasPorSeccion() {
        Map<String, Object> metricas = new HashMap<>();
        List<VistaDashboardEjecutivo> datos = repository.findAll();
        
        if (datos != null) {
            for (VistaDashboardEjecutivo dato : datos) {
                if (dato != null) {
                    Map<String, Object> seccion = new HashMap<>();
                    seccion.put("totalVehiculos", dato.getTotalVehiculos() != null ? dato.getTotalVehiculos() : 0L);
                    seccion.put("vehiculosDisponibles", dato.getVehiculosDisponibles() != null ? dato.getVehiculosDisponibles() : 0L);
                    seccion.put("vehiculosVendidos", dato.getVehiculosVendidos() != null ? dato.getVehiculosVendidos() : 0L);
                    seccion.put("totalRepuestos", dato.getTotalRepuestos() != null ? dato.getTotalRepuestos() : 0L);
                    seccion.put("repuestosStock", dato.getRepuestosStock() != null ? dato.getRepuestosStock() : 0L);
                    seccion.put("inversionTotal", getSafeBigDecimal(dato.getInversionTotal()));
                    seccion.put("ingresosTotales", getSafeBigDecimal(dato.getIngresosTotales()));
                    seccion.put("egresosTotales", getSafeBigDecimal(dato.getEgresosTotales()));
                    seccion.put("balanceNetoTotal", getSafeBigDecimal(dato.getBalanceNetoTotal()));
                    seccion.put("roiPromedio", getSafeBigDecimal(dato.getRoiPromedio()));
                    
                    if (dato.getSeccion() != null) {
                        metricas.put(dato.getSeccion(), seccion);
                    }
                }
            }
        }
        
        return metricas;
    }
}
