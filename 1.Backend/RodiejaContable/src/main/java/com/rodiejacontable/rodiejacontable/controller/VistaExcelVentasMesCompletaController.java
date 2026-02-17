package com.rodiejacontable.rodiejacontable.controller;

import com.rodiejacontable.database.jooq.tables.pojos.VistaExcelVentasMesCompleta;
import com.rodiejacontable.rodiejacontable.service.VistaExcelVentasMesCompletaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vista-excel-ventas-mes-completa")
public class VistaExcelVentasMesCompletaController {

    @Autowired
    private VistaExcelVentasMesCompletaService service;

    /**
     * Obtiene los datos de la vista para el mes actual.
     */
    @GetMapping("/mes-actual")
    public ResponseEntity<List<VistaExcelVentasMesCompleta>> getVistaExcelVentasMesActual() {
        return ResponseEntity.ok(service.obtenerVistaExcelVentasMesActual());
    }

    /**
     * Obtiene los datos de la vista para un mes y año específicos.
     * @param anio El año
     * @param mes El mes
     */
    @GetMapping("/{anio}/{mes}")
    public ResponseEntity<List<VistaExcelVentasMesCompleta>> getVistaExcelVentasMesCompleta(
            @PathVariable Short anio,
            @PathVariable Byte mes) {
        return ResponseEntity.ok(service.obtenerVistaExcelVentasMesCompleta(anio, mes));
    }
}
