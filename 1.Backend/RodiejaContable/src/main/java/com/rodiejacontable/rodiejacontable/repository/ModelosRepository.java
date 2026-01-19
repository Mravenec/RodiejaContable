package com.rodiejacontable.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.MODELOS;

import com.rodiejacontable.database.jooq.tables.pojos.Modelos;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ModelosRepository {

    @Autowired
    private DSLContext dsl;
    
    public List<Modelos> findAll() {
        return dsl.selectFrom(MODELOS)
                 .orderBy(MODELOS.ID.asc())
                 .fetchInto(Modelos.class);
    }
    
    public List<Modelos> findByMarcaId(Integer marcaId) {
        return dsl.selectFrom(MODELOS)
                 .where(MODELOS.MARCA_ID.eq(marcaId))
                 .orderBy(MODELOS.NOMBRE.asc())
                 .fetchInto(Modelos.class);
    }
    
    public List<Modelos> findActivosByMarcaId(Integer marcaId) {
        return dsl.selectFrom(MODELOS)
                 .where(MODELOS.MARCA_ID.eq(marcaId)
                     .and(MODELOS.ACTIVO.eq((byte) 1)))
                 .orderBy(MODELOS.NOMBRE.asc())
                 .fetchInto(Modelos.class);
    }
    
    public Optional<Modelos> findById(Integer id) {
        return dsl.selectFrom(MODELOS)
                 .where(MODELOS.ID.eq(id))
                 .fetchOptionalInto(Modelos.class);
    }
    
    public Optional<Modelos> findByNombreAndMarcaId(String nombre, Integer marcaId) {
        return dsl.selectFrom(MODELOS)
                 .where(MODELOS.NOMBRE.eq(nombre)
                     .and(MODELOS.MARCA_ID.eq(marcaId)))
                 .fetchOptionalInto(Modelos.class);
    }
    
    public boolean existsByNombreAndMarcaId(String nombre, Integer marcaId) {
        return dsl.selectCount()
                 .from(MODELOS)
                 .where(MODELOS.NOMBRE.eq(nombre)
                     .and(MODELOS.MARCA_ID.eq(marcaId)))
                 .fetchOne(0, Integer.class) > 0;
    }
    
    public Modelos save(Modelos modelo) {
        return dsl.insertInto(MODELOS)
                 .set(MODELOS.MARCA_ID, modelo.getMarcaId())
                 .set(MODELOS.NOMBRE, modelo.getNombre())
                 .set(MODELOS.ACTIVO, modelo.getActivo())
                 .set(MODELOS.FECHA_CREACION, modelo.getFechaCreacion())
                 .returning()
                 .fetchOne()
                 .into(Modelos.class);
    }
    
/**
     * Actualiza un modelo existente en la base de datos
     * 
     * MÉTODOS DE ACTUALIZACIÓN CON jOOQ:
     * 
     * Opción 1: UPDATE manual con set() - MÁS CONTROL Y LEGIBLE
     * Opción 2: Record.store() - MÁS AUTOMÁTICO
     * 
     * Aquí usamos Opción 1 por claridad y control explícito
     * 
     * @param modelo POJO con los datos actualizados (debe incluir ID)
     * @return Modelo actualizado desde la BD
     * 
     * @throws RuntimeException si la actualización falla
     */
    public Modelos update(Modelos modelo) {
        
        // =====================================================
        // MÉTODO 1: UPDATE con DSL manual (RECOMENDADO)
        // =====================================================
        // Este enfoque es más explícito y da mayor control
        
        int rowsAffected = dsl.update(MODELOS)
                // SET: especificamos cada campo a actualizar
                .set(MODELOS.MARCA_ID, modelo.getMarcaId())
                .set(MODELOS.NOMBRE, modelo.getNombre())
                .set(MODELOS.ACTIVO, modelo.getActivo())
                // WHERE: condición para identificar el registro
                .where(MODELOS.ID.eq(modelo.getId()))
                // execute() retorna el número de filas afectadas
                .execute();
        
        // Verificar que se actualizó exactamente 1 registro
        if (rowsAffected != 1) {
            throw new RuntimeException(
                "Error al actualizar modelo ID: " + modelo.getId() + 
                ". Filas afectadas: " + rowsAffected
            );
        }
        
        // =====================================================
        // Retornar el modelo actualizado desde la BD
        // =====================================================
        // Es buena práctica retornar el estado real de la BD
        // por si hay triggers o valores calculados
        return findById(modelo.getId())
                .orElseThrow(() -> new RuntimeException(
                    "Error crítico: modelo desapareció tras actualización"
                ));
    }
    
    public boolean delete(Integer id) {
        return dsl.deleteFrom(MODELOS)
                 .where(MODELOS.ID.eq(id))
                 .execute() > 0;
    }
}
