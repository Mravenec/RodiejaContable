package com.rodiejacontable.repository;

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
                 .orderBy(MODELOS.NOMBRE.asc())
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
    
    public Modelos update(Modelos modelo) {
        return dsl.update(MODELOS)
                 .set(MODELOS.MARCA_ID, modelo.getMarcaId())
                 .set(MODELOS.NOMBRE, modelo.getNombre())
                 .set(MODELOS.ACTIVO, modelo.getActivo())
                 .where(MODELOS.ID.eq(modelo.getId()))
                 .returning()
                 .fetchOne()
                 .into(Modelos.class);
    }
    
    public boolean delete(Integer id) {
        return dsl.deleteFrom(MODELOS)
                 .where(MODELOS.ID.eq(id))
                 .execute() > 0;
    }
}
