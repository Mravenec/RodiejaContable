package com.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.MARCAS;

import com.rodiejacontable.database.jooq.tables.pojos.Marcas;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class MarcasRepository {

    @Autowired
    private DSLContext dsl;
    
    public List<Marcas> findAll() {
        return dsl.selectFrom(MARCAS)
                 .orderBy(MARCAS.NOMBRE.asc())
                 .fetchInto(Marcas.class);
    }
    
    public List<Marcas> findAllActivas() {
        return dsl.selectFrom(MARCAS)
                 .where(MARCAS.ACTIVO.eq((byte) 1))
                 .orderBy(MARCAS.NOMBRE.asc())
                 .fetchInto(Marcas.class);
    }
    
    public Optional<Marcas> findById(Integer id) {
        return dsl.selectFrom(MARCAS)
                 .where(MARCAS.ID.eq(id))
                 .fetchOptionalInto(Marcas.class);
    }
    
    public Optional<Marcas> findByNombre(String nombre) {
        return dsl.selectFrom(MARCAS)
                 .where(MARCAS.NOMBRE.eq(nombre))
                 .fetchOptionalInto(Marcas.class);
    }
    
    public Marcas save(Marcas marca) {
        return dsl.insertInto(MARCAS)
                 .set(MARCAS.NOMBRE, marca.getNombre())
                 .set(MARCAS.ACTIVO, marca.getActivo())
                 .set(MARCAS.FECHA_CREACION, marca.getFechaCreacion())
                 .returning()
                 .fetchOne()
                 .into(Marcas.class);
    }
    
    public Marcas update(Marcas marca) {
        return dsl.update(MARCAS)
                 .set(MARCAS.NOMBRE, marca.getNombre())
                 .set(MARCAS.ACTIVO, marca.getActivo())
                 .where(MARCAS.ID.eq(marca.getId()))
                 .returning()
                 .fetchOne()
                 .into(Marcas.class);
    }
    
    public void delete(Integer id) {
        dsl.deleteFrom(MARCAS)
          .where(MARCAS.ID.eq(id))
          .execute();
    }
    
    public boolean existsByNombre(String nombre) {
        return dsl.fetchExists(
            dsl.selectOne()
               .from(MARCAS)
               .where(MARCAS.NOMBRE.eq(nombre))
        );
    }
}
