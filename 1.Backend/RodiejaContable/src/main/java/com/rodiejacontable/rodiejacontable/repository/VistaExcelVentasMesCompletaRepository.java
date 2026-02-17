package com.rodiejacontable.rodiejacontable.repository;

import com.rodiejacontable.database.jooq.tables.pojos.VistaExcelVentasMesCompleta;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.rodiejacontable.database.jooq.tables.VistaExcelVentasMesCompleta.VISTA_EXCEL_VENTAS_MES_COMPLETA;

@Repository
public class VistaExcelVentasMesCompletaRepository {

    private final DSLContext dsl;

    public VistaExcelVentasMesCompletaRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    /**
     * Obtiene los datos de la vista para el mes actual.
     * @return Lista de VistaExcelVentasMesCompleta
     */
    public List<VistaExcelVentasMesCompleta> obtenerVistaExcelVentasMesActual() {
        LocalDate now = LocalDate.now();
        Short anio = (short) now.getYear();
        Byte mes = (byte) now.getMonthValue();

        return dsl.selectFrom(VISTA_EXCEL_VENTAS_MES_COMPLETA)
                .where(VISTA_EXCEL_VENTAS_MES_COMPLETA.ANIO.eq(anio))
                .and(VISTA_EXCEL_VENTAS_MES_COMPLETA.MES.eq(mes))
                .orderBy(VISTA_EXCEL_VENTAS_MES_COMPLETA.FECHA.desc(), VISTA_EXCEL_VENTAS_MES_COMPLETA.NOMBRE_DEL)
                .fetchInto(VistaExcelVentasMesCompleta.class);
    }

    /**
     * Obtiene los datos de la vista para un mes y año específicos.
     * @param anio El año
     * @param mes El mes
     * @return Lista de VistaExcelVentasMesCompleta
     */
    public List<VistaExcelVentasMesCompleta> obtenerVistaExcelVentasMesCompleta(Short anio, Byte mes) {
        return dsl.selectFrom(VISTA_EXCEL_VENTAS_MES_COMPLETA)
                .where(VISTA_EXCEL_VENTAS_MES_COMPLETA.ANIO.eq(anio))
                .and(VISTA_EXCEL_VENTAS_MES_COMPLETA.MES.eq(mes))
                .orderBy(VISTA_EXCEL_VENTAS_MES_COMPLETA.FECHA.desc(), VISTA_EXCEL_VENTAS_MES_COMPLETA.NOMBRE_DEL)
                .fetchInto(VistaExcelVentasMesCompleta.class);
    }
}
