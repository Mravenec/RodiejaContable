package com.rodiejacontable.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.TIPOS_TRANSACCIONES;

import com.rodiejacontable.database.jooq.enums.TiposTransaccionesCategoria;
import com.rodiejacontable.database.jooq.tables.pojos.TiposTransacciones;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TiposTransaccionesRepository {

    @Autowired
    private DSLContext dsl;
    
    public List<TiposTransacciones> findAll() {
        return dsl.selectFrom(TIPOS_TRANSACCIONES)
                 .orderBy(TIPOS_TRANSACCIONES.NOMBRE.asc())
                 .fetchInto(TiposTransacciones.class);
    }
    
    public List<TiposTransacciones> findByCategoria(TiposTransaccionesCategoria categoria) {
        return dsl.selectFrom(TIPOS_TRANSACCIONES)
                 .where(TIPOS_TRANSACCIONES.CATEGORIA.eq(categoria))
                 .orderBy(TIPOS_TRANSACCIONES.NOMBRE.asc())
                 .fetchInto(TiposTransacciones.class);
    }
    
    public List<TiposTransacciones> findActivos() {
        return dsl.selectFrom(TIPOS_TRANSACCIONES)
                 .where(TIPOS_TRANSACCIONES.ACTIVO.eq((byte) 1))
                 .orderBy(TIPOS_TRANSACCIONES.NOMBRE.asc())
                 .fetchInto(TiposTransacciones.class);
    }
    
    public Optional<TiposTransacciones> findById(Integer id) {
        return dsl.selectFrom(TIPOS_TRANSACCIONES)
                 .where(TIPOS_TRANSACCIONES.ID.eq(id))
                 .fetchOptionalInto(TiposTransacciones.class);
    }
    
    public Optional<TiposTransacciones> findByNombre(String nombre) {
        return dsl.selectFrom(TIPOS_TRANSACCIONES)
                 .where(TIPOS_TRANSACCIONES.NOMBRE.eq(nombre))
                 .fetchOptionalInto(TiposTransacciones.class);
    }
    
    public boolean existsByNombre(String nombre) {
        return dsl.selectCount()
                 .from(TIPOS_TRANSACCIONES)
                 .where(TIPOS_TRANSACCIONES.NOMBRE.eq(nombre))
                 .fetchOne(0, Integer.class) > 0;
    }
    
    public TiposTransacciones save(TiposTransacciones tipoTransaccion) {
        return dsl.insertInto(TIPOS_TRANSACCIONES)
                 .set(TIPOS_TRANSACCIONES.NOMBRE, tipoTransaccion.getNombre())
                 .set(TIPOS_TRANSACCIONES.DESCRIPCION, tipoTransaccion.getDescripcion())
                 .set(TIPOS_TRANSACCIONES.CATEGORIA, tipoTransaccion.getCategoria())
                 .set(TIPOS_TRANSACCIONES.ACTIVO, tipoTransaccion.getActivo())
                 .returning()
                 .fetchOne()
                 .into(TiposTransacciones.class);
    }
    
    public TiposTransacciones update(TiposTransacciones tipoTransaccion) {
        return dsl.update(TIPOS_TRANSACCIONES)
                 .set(TIPOS_TRANSACCIONES.NOMBRE, tipoTransaccion.getNombre())
                 .set(TIPOS_TRANSACCIONES.DESCRIPCION, tipoTransaccion.getDescripcion())
                 .set(TIPOS_TRANSACCIONES.CATEGORIA, tipoTransaccion.getCategoria())
                 .set(TIPOS_TRANSACCIONES.ACTIVO, tipoTransaccion.getActivo())
                 .where(TIPOS_TRANSACCIONES.ID.eq(tipoTransaccion.getId()))
                 .returning()
                 .fetchOne()
                 .into(TiposTransacciones.class);
    }
    
    public boolean delete(Integer id) {
        return dsl.deleteFrom(TIPOS_TRANSACCIONES)
                 .where(TIPOS_TRANSACCIONES.ID.eq(id))
                 .execute() > 0;
    }
}
