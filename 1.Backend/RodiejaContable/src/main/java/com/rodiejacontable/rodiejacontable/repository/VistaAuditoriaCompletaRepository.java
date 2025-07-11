package com.rodiejacontable.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.VISTA_AUDITORIA_COMPLETA;

import com.rodiejacontable.database.jooq.tables.pojos.VistaAuditoriaCompleta;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class VistaAuditoriaCompletaRepository {

    @Autowired
    private DSLContext dsl;
    
    public List<VistaAuditoriaCompleta> findAll() {
        return dsl.selectFrom(VISTA_AUDITORIA_COMPLETA)
                 .orderBy(VISTA_AUDITORIA_COMPLETA.FECHA_CAMBIO.desc())
                 .fetchInto(VistaAuditoriaCompleta.class);
    }
    
    public List<VistaAuditoriaCompleta> findByTipoEntidad(String tipoEntidad) {
        return dsl.selectFrom(VISTA_AUDITORIA_COMPLETA)
                 .where(VISTA_AUDITORIA_COMPLETA.TIPO_ENTIDAD.eq(tipoEntidad))
                 .orderBy(VISTA_AUDITORIA_COMPLETA.FECHA_CAMBIO.desc())
                 .fetchInto(VistaAuditoriaCompleta.class);
    }
    
    public List<VistaAuditoriaCompleta> findByEntidadId(String entidadId) {
        return dsl.selectFrom(VISTA_AUDITORIA_COMPLETA)
                 .where(VISTA_AUDITORIA_COMPLETA.ENTIDAD_ID.eq(entidadId))
                 .orderBy(VISTA_AUDITORIA_COMPLETA.FECHA_CAMBIO.desc())
                 .fetchInto(VistaAuditoriaCompleta.class);
    }
    
    public List<VistaAuditoriaCompleta> findByUsuario(String usuario) {
        return dsl.selectFrom(VISTA_AUDITORIA_COMPLETA)
                 .where(VISTA_AUDITORIA_COMPLETA.USUARIO.eq(usuario))
                 .orderBy(VISTA_AUDITORIA_COMPLETA.FECHA_CAMBIO.desc())
                 .fetchInto(VistaAuditoriaCompleta.class);
    }
    
    public List<VistaAuditoriaCompleta> findByFechaCambioBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return dsl.selectFrom(VISTA_AUDITORIA_COMPLETA)
                 .where(VISTA_AUDITORIA_COMPLETA.FECHA_CAMBIO.between(fechaInicio, fechaFin))
                 .orderBy(VISTA_AUDITORIA_COMPLETA.FECHA_CAMBIO.desc())
                 .fetchInto(VistaAuditoriaCompleta.class);
    }
    
    public List<VistaAuditoriaCompleta> findByAccion(String accion) {
        return dsl.selectFrom(VISTA_AUDITORIA_COMPLETA)
                 .where(VISTA_AUDITORIA_COMPLETA.ACCION.eq(accion))
                 .orderBy(VISTA_AUDITORIA_COMPLETA.FECHA_CAMBIO.desc())
                 .fetchInto(VistaAuditoriaCompleta.class);
    }
    
    public List<String> findDistinctTiposEntidad() {
        return dsl.selectDistinct(VISTA_AUDITORIA_COMPLETA.TIPO_ENTIDAD)
                 .from(VISTA_AUDITORIA_COMPLETA)
                 .orderBy(VISTA_AUDITORIA_COMPLETA.TIPO_ENTIDAD)
                 .fetchInto(String.class);
    }
    
    public List<String> findDistinctUsuarios() {
        return dsl.selectDistinct(VISTA_AUDITORIA_COMPLETA.USUARIO)
                 .from(VISTA_AUDITORIA_COMPLETA)
                 .orderBy(VISTA_AUDITORIA_COMPLETA.USUARIO)
                 .fetchInto(String.class);
    }
    
    public List<String> findDistinctAcciones() {
        return dsl.selectDistinct(VISTA_AUDITORIA_COMPLETA.ACCION)
                 .from(VISTA_AUDITORIA_COMPLETA)
                 .orderBy(VISTA_AUDITORIA_COMPLETA.ACCION)
                 .fetchInto(String.class);
    }
}
