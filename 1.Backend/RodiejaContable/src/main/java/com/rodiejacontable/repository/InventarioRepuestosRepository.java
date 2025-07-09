package com.rodiejacontable.repository;

import com.rodiejacontable.database.jooq.tables.pojos.InventarioRepuestos;
import com.rodiejacontable.database.jooq.tables.records.InventarioRepuestosRecord;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.rodiejacontable.database.jooq.Tables.INVENTARIO_REPUESTOS;

@Repository
public class InventarioRepuestosRepository {

    private final DSLContext dslContext;

    @Autowired
    public InventarioRepuestosRepository(DSLContext dslContext) {
        this.dslContext = dslContext;
    }

    public InventarioRepuestos save(InventarioRepuestos repuesto) {
        InventarioRepuestosRecord record = dslContext.newRecord(INVENTARIO_REPUESTOS, repuesto);
        record.store();
        return record.into(InventarioRepuestos.class);
    }

    public Optional<InventarioRepuestos> findById(Integer id) {
        return dslContext.selectFrom(INVENTARIO_REPUESTOS)
                .where(INVENTARIO_REPUESTOS.ID.eq(id))
                .fetchOptional()
                .map(r -> r.into(InventarioRepuestos.class));
    }

    public List<InventarioRepuestos> findByVehiculoOrigenId(Integer vehiculoId) {
        return dslContext.selectFrom(INVENTARIO_REPUESTOS)
                .where(INVENTARIO_REPUESTOS.VEHICULO_ORIGEN_ID.eq(vehiculoId))
                .orderBy(INVENTARIO_REPUESTOS.CODIGO_REPUESTO.asc())
                .fetch()
                .into(InventarioRepuestos.class);
    }

    public List<InventarioRepuestos> findByCodigoRepuesto(String codigoRepuesto) {
        return dslContext.selectFrom(INVENTARIO_REPUESTOS)
                .where(INVENTARIO_REPUESTOS.CODIGO_REPUESTO.likeIgnoreCase("%" + codigoRepuesto + "%"))
                .orderBy(INVENTARIO_REPUESTOS.CODIGO_REPUESTO.asc())
                .fetch()
                .into(InventarioRepuestos.class);
    }

    public List<InventarioRepuestos> findAll() {
        return dslContext.selectFrom(INVENTARIO_REPUESTOS)
                .orderBy(INVENTARIO_REPUESTOS.CODIGO_REPUESTO.asc())
                .fetch()
                .into(InventarioRepuestos.class);
    }

    public boolean existsByCodigoRepuesto(String codigoRepuesto) {
        return dslContext.fetchExists(
                dslContext.selectOne()
                        .from(INVENTARIO_REPUESTOS)
                        .where(INVENTARIO_REPUESTOS.CODIGO_REPUESTO.eq(codigoRepuesto))
        );
    }

    public void delete(Integer id) {
        dslContext.deleteFrom(INVENTARIO_REPUESTOS)
                .where(INVENTARIO_REPUESTOS.ID.eq(id))
                .execute();
    }
}
