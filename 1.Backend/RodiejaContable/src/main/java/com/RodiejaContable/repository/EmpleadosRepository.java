package com.rodiejacontable.repository;

import com.rodiejacontable.database.jooq.tables.Empleados;
import com.rodiejacontable.database.jooq.tables.pojos.Empleados;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class EmpleadosRepository {

    @Autowired
    private DSLContext dsl;
    
    private final Empleados EMPLEADOS = Empleados.EMPLEADOS;
    
    public List<Empleados> findAll() {
        return dsl.selectFrom(EMPLEADOS)
                 .fetchInto(Empleados.class);
    }
    
    public Optional<Empleados> findById(Integer id) {
        return dsl.selectFrom(EMPLEADOS)
                 .where(EMPLEADOS.ID.eq(id))
                 .fetchOptionalInto(Empleados.class);
    }
    
    public Empleados save(Empleados empleado) {
        return dsl.insertInto(EMPLEADOS)
                 .set(EMPLEADOS.NOMBRE, empleado.getNombre())
                 .set(EMPLEADOS.ACTIVO, empleado.getActivo())
                 .set(EMPLEADOS.FECHA_CREACION, empleado.getFechaCreacion())
                 .returning()
                 .fetchOne()
                 .into(Empleados.class);
    }
    
    public Empleados update(Empleados empleado) {
        return dsl.update(EMPLEADOS)
                 .set(EMPLEADOS.NOMBRE, empleado.getNombre())
                 .set(EMPLEADOS.ACTIVO, empleado.getActivo())
                 .where(EMPLEADOS.ID.eq(empleado.getId()))
                 .returning()
                 .fetchOne()
                 .into(Empleados.class);
    }
    
    public void delete(Integer id) {
        dsl.deleteFrom(EMPLEADOS)
           .where(EMPLEADOS.ID.eq(id))
           .execute();
    }
}
