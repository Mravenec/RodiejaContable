package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.VistaExcelVentasMesCompleta;
import com.rodiejacontable.rodiejacontable.repository.VistaExcelVentasMesCompletaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VistaExcelVentasMesCompletaService {

    @Autowired
    private VistaExcelVentasMesCompletaRepository repository;

    /**
     * Obtiene los datos de la vista para el mes actual.
     * @return Lista de VistaExcelVentasMesCompleta
     */
    public List<VistaExcelVentasMesCompleta> obtenerVistaExcelVentasMesActual() {
        return repository.obtenerVistaExcelVentasMesActual();
    }

    /**
     * Obtiene los datos de la vista para un mes y año específicos.
     * @param anio El año
     * @param mes El mes
     * @return Lista de VistaExcelVentasMesCompleta
     */
    public List<VistaExcelVentasMesCompleta> obtenerVistaExcelVentasMesCompleta(Short anio, Byte mes) {
        return repository.obtenerVistaExcelVentasMesCompleta(anio, mes);
    }
}
