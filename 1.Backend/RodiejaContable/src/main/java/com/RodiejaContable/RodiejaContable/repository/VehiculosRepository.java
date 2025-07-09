package com.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.VEHICULOS;

import com.rodiejacontable.database.jooq.enums.VehiculosEstado;
import com.rodiejacontable.database.jooq.tables.pojos.Vehiculos;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class VehiculosRepository {

    @Autowired
    private DSLContext dsl;
    
    public List<Vehiculos> findAll() {
        return dsl.selectFrom(VEHICULOS)
                 .orderBy(VEHICULOS.FECHA_INGRESO.desc())
                 .fetchInto(Vehiculos.class);
    }
    
    public List<Vehiculos> findByEstado(VehiculosEstado estado) {
        return dsl.selectFrom(VEHICULOS)
                 .where(VEHICULOS.ESTADO.eq(estado))
                 .orderBy(VEHICULOS.FECHA_INGRESO.desc())
                 .fetchInto(Vehiculos.class);
    }
    
    public List<Vehiculos> findByGeneracionId(Integer generacionId) {
        return dsl.selectFrom(VEHICULOS)
                 .where(VEHICULOS.GENERACION_ID.eq(generacionId))
                 .orderBy(VEHICULOS.ANIO.desc())
                 .fetchInto(Vehiculos.class);
    }
    
    public List<Vehiculos> findByAnio(Integer anio) {
        return dsl.selectFrom(VEHICULOS)
                 .where(VEHICULOS.ANIO.eq(anio))
                 .orderBy(VEHICULOS.FECHA_INGRESO.desc())
                 .fetchInto(Vehiculos.class);
    }
    
    public List<Vehiculos> findActivos() {
        return dsl.selectFrom(VEHICULOS)
                 .where(VEHICULOS.ACTIVO.eq((byte) 1))
                 .orderBy(VEHICULOS.FECHA_INGRESO.desc())
                 .fetchInto(Vehiculos.class);
    }
    
    public Optional<Vehiculos> findById(Integer id) {
        return dsl.selectFrom(VEHICULOS)
                 .where(VEHICULOS.ID.eq(id))
                 .fetchOptionalInto(Vehiculos.class);
    }
    
    public Optional<Vehiculos> findByCodigoVehiculo(String codigoVehiculo) {
        return dsl.selectFrom(VEHICULOS)
                 .where(VEHICULOS.CODIGO_VEHICULO.eq(codigoVehiculo))
                 .fetchOptionalInto(Vehiculos.class);
    }
    
    public boolean existsByCodigoVehiculo(String codigoVehiculo) {
        return dsl.selectCount()
                 .from(VEHICULOS)
                 .where(VEHICULOS.CODIGO_VEHICULO.eq(codigoVehiculo))
                 .fetchOne(0, Integer.class) > 0;
    }
    
    public Vehiculos save(Vehiculos vehiculo) {
        return dsl.insertInto(VEHICULOS)
                 .set(VEHICULOS.CODIGO_VEHICULO, vehiculo.getCodigoVehiculo())
                 .set(VEHICULOS.GENERACION_ID, vehiculo.getGeneracionId())
                 .set(VEHICULOS.ANIO, vehiculo.getAnio())
                 .set(VEHICULOS.PRECIO_COMPRA, vehiculo.getPrecioCompra())
                 .set(VEHICULOS.COSTO_GRUA, vehiculo.getCostoGrua())
                 .set(VEHICULOS.COMISIONES, vehiculo.getComisiones())
                 .set(VEHICULOS.INVERSION_TOTAL, vehiculo.getInversionTotal())
                 .set(VEHICULOS.FECHA_INGRESO, vehiculo.getFechaIngreso())
                 .set(VEHICULOS.ESTADO, vehiculo.getEstado())
                 .set(VEHICULOS.PRECIO_VENTA, vehiculo.getPrecioVenta())
                 .set(VEHICULOS.FECHA_VENTA, vehiculo.getFechaVenta())
                 .set(VEHICULOS.ACTIVO, vehiculo.getActivo())
                 .set(VEHICULOS.NOTAS, vehiculo.getNotas())
                 .set(VEHICULOS.FECHA_CREACION, vehiculo.getFechaCreacion())
                 .set(VEHICULOS.FECHA_ACTUALIZACION, vehiculo.getFechaActualizacion())
                 .returning()
                 .fetchOne()
                 .into(Vehiculos.class);
    }
    
    public Vehiculos update(Vehiculos vehiculo) {
        return dsl.update(VEHICULOS)
                 .set(VEHICULOS.CODIGO_VEHICULO, vehiculo.getCodigoVehiculo())
                 .set(VEHICULOS.GENERACION_ID, vehiculo.getGeneracionId())
                 .set(VEHICULOS.ANIO, vehiculo.getAnio())
                 .set(VEHICULOS.PRECIO_COMPRA, vehiculo.getPrecioCompra())
                 .set(VEHICULOS.COSTO_GRUA, vehiculo.getCostoGrua())
                 .set(VEHICULOS.COMISIONES, vehiculo.getComisiones())
                 .set(VEHICULOS.INVERSION_TOTAL, vehiculo.getInversionTotal())
                 .set(VEHICULOS.FECHA_INGRESO, vehiculo.getFechaIngreso())
                 .set(VEHICULOS.ESTADO, vehiculo.getEstado())
                 .set(VEHICULOS.PRECIO_VENTA, vehiculo.getPrecioVenta())
                 .set(VEHICULOS.FECHA_VENTA, vehiculo.getFechaVenta())
                 .set(VEHICULOS.ACTIVO, vehiculo.getActivo())
                 .set(VEHICULOS.NOTAS, vehiculo.getNotas())
                 .set(VEHICULOS.FECHA_ACTUALIZACION, vehiculo.getFechaActualizacion())
                 .where(VEHICULOS.ID.eq(vehiculo.getId()))
                 .returning()
                 .fetchOne()
                 .into(Vehiculos.class);
    }
    
    public boolean delete(Integer id) {
        return dsl.deleteFrom(VEHICULOS)
                 .where(VEHICULOS.ID.eq(id))
                 .execute() > 0;
    }
    
    public void actualizarEstado(Integer id, VehiculosEstado estado) {
        dsl.update(VEHICULOS)
           .set(VEHICULOS.ESTADO, estado)
           .set(VEHICULOS.FECHA_ACTUALIZACION, java.time.LocalDateTime.now())
           .where(VEHICULOS.ID.eq(id))
           .execute();
    }
    
    public void marcarComoVendido(Integer id, BigDecimal precioVenta, LocalDate fechaVenta) {
        dsl.update(VEHICULOS)
           .set(VEHICULOS.ESTADO, VehiculosEstado.VENDIDO)
           .set(VEHICULOS.PRECIO_VENTA, precioVenta)
           .set(VEHICULOS.FECHA_VENTA, fechaVenta)
           .set(VEHICULOS.FECHA_ACTUALIZACION, java.time.LocalDateTime.now())
           .where(VEHICULOS.ID.eq(id))
           .execute();
    }
}
