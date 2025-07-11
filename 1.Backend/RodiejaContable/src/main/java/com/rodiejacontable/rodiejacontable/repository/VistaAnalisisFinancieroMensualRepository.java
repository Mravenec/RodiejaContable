package com.rodiejacontable.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.VISTA_ANALISIS_FINANCIERO_MENSUAL;

import com.rodiejacontable.database.jooq.tables.pojos.VistaAnalisisFinancieroMensual;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class VistaAnalisisFinancieroMensualRepository {

    @Autowired
    private DSLContext dsl;
    
    public List<VistaAnalisisFinancieroMensual> findAll() {
        return dsl.selectFrom(VISTA_ANALISIS_FINANCIERO_MENSUAL)
                 .orderBy(
                     VISTA_ANALISIS_FINANCIERO_MENSUAL.ANIO.desc(),
                     VISTA_ANALISIS_FINANCIERO_MENSUAL.MES.desc()
                 )
                 .fetchInto(VistaAnalisisFinancieroMensual.class);
    }
    
    public List<VistaAnalisisFinancieroMensual> findByAnio(Integer anio) {
        return dsl.selectFrom(VISTA_ANALISIS_FINANCIERO_MENSUAL)
                 .where(VISTA_ANALISIS_FINANCIERO_MENSUAL.ANIO.eq(anio))
                 .orderBy(VISTA_ANALISIS_FINANCIERO_MENSUAL.MES.desc())
                 .fetchInto(VistaAnalisisFinancieroMensual.class);
    }
    
    public List<VistaAnalisisFinancieroMensual> findByAnioAndMes(Integer anio, Integer mes) {
        return dsl.selectFrom(VISTA_ANALISIS_FINANCIERO_MENSUAL)
                 .where(VISTA_ANALISIS_FINANCIERO_MENSUAL.ANIO.eq(anio)
                     .and(VISTA_ANALISIS_FINANCIERO_MENSUAL.MES.eq(mes)))
                 .fetchInto(VistaAnalisisFinancieroMensual.class);
    }
    
    public List<Integer> findDistinctYears() {
        return dsl.selectDistinct(VISTA_ANALISIS_FINANCIERO_MENSUAL.ANIO)
                 .from(VISTA_ANALISIS_FINANCIERO_MENSUAL)
                 .orderBy(VISTA_ANALISIS_FINANCIERO_MENSUAL.ANIO.desc())
                 .fetchInto(Integer.class);
    }
}
