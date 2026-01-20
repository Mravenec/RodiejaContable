package com.rodiejacontable.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.GENERACIONES;
import com.rodiejacontable.database.jooq.tables.pojos.Generaciones;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class GeneracionesRepository {

    @Autowired
    private DSLContext dsl;
    
    // Using static import for GENERACIONES
    
    public List<Generaciones> findAll() {
        return dsl.selectFrom(GENERACIONES)
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.Generaciones.class);
    }
    
    public Optional<Generaciones> findById(Integer id) {
        return dsl.selectFrom(GENERACIONES)
                .where(GENERACIONES.ID.eq(id))
                .fetchOptionalInto(com.rodiejacontable.database.jooq.tables.pojos.Generaciones.class);
    }
    
    public Generaciones save(Generaciones generacion) {
        return dsl.insertInto(GENERACIONES)
                .set(GENERACIONES.MODELO_ID, generacion.getModeloId())
                .set(GENERACIONES.NOMBRE, generacion.getNombre())
                .set(GENERACIONES.DESCRIPCION, generacion.getDescripcion())
                .set(GENERACIONES.ANIO_INICIO, generacion.getAnioInicio())
                .set(GENERACIONES.ANIO_FIN, generacion.getAnioFin())
                .set(GENERACIONES.TOTAL_INVERSION, generacion.getTotalInversion())
                .set(GENERACIONES.TOTAL_INGRESOS, generacion.getTotalIngresos())
                .set(GENERACIONES.TOTAL_EGRESOS, generacion.getTotalEgresos())
                .set(GENERACIONES.BALANCE_NETO, generacion.getBalanceNeto())
                .set(GENERACIONES.ACTIVO, generacion.getActivo())
                .set(GENERACIONES.FECHA_CREACION, generacion.getFechaCreacion())
                .returning()
                .fetchOne()
                .into(com.rodiejacontable.database.jooq.tables.pojos.Generaciones.class);
    }
    
    public Generaciones update(Generaciones generacion) {
        System.out.println("=== GeneracionesRepository.update() - Starting update for generacion ID: " + generacion.getId() + " ===");
        System.out.println("Updating generacion with values - Nombre: " + generacion.getNombre() + ", ModeloId: " + generacion.getModeloId());
        
        try {
            // First, execute the update
            int updated = dsl.update(GENERACIONES)
                    .set(GENERACIONES.MODELO_ID, generacion.getModeloId())
                    .set(GENERACIONES.NOMBRE, generacion.getNombre())
                    .set(GENERACIONES.DESCRIPCION, generacion.getDescripcion())
                    .set(GENERACIONES.ANIO_INICIO, generacion.getAnioInicio())
                    .set(GENERACIONES.ANIO_FIN, generacion.getAnioFin())
                    .set(GENERACIONES.TOTAL_INVERSION, generacion.getTotalInversion())
                    .set(GENERACIONES.TOTAL_INGRESOS, generacion.getTotalIngresos())
                    .set(GENERACIONES.TOTAL_EGRESOS, generacion.getTotalEgresos())
                    .set(GENERACIONES.BALANCE_NETO, generacion.getBalanceNeto())
                    .set(GENERACIONES.ACTIVO, generacion.getActivo())
                    .where(GENERACIONES.ID.eq(generacion.getId()))
                    .execute();
            
            if (updated == 0) {
                throw new RuntimeException("No se pudo actualizar la generación con ID: " + generacion.getId());
            }
            
            // Then fetch the updated generacion
            Generaciones updatedGeneracion = dsl.selectFrom(GENERACIONES)
                    .where(GENERACIONES.ID.eq(generacion.getId()))
                    .fetchOneInto(Generaciones.class);
            
            System.out.println("Successfully updated generacion: " + updatedGeneracion);
            return updatedGeneracion;
        } catch (Exception e) {
            System.err.println("Error in GeneracionesRepository.update(): " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public void delete(Integer id) {
        dsl.deleteFrom(com.rodiejacontable.database.jooq.Tables.GENERACIONES)
           .where(com.rodiejacontable.database.jooq.Tables.GENERACIONES.ID.eq(id))
           .execute();
    }
    
    public List<Generaciones> findByModeloId(Integer modeloId) {
        return dsl.selectFrom(GENERACIONES)
                .where(GENERACIONES.MODELO_ID.eq(modeloId))
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.Generaciones.class);
    }
    
    public List<Generaciones> findByActivo(Byte activo) {
        return dsl.selectFrom(GENERACIONES)
                .where(GENERACIONES.ACTIVO.eq(activo))
                .fetchInto(com.rodiejacontable.database.jooq.tables.pojos.Generaciones.class);
    }
}
