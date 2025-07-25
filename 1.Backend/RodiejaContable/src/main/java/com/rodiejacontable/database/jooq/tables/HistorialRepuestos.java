/*
 * This file is generated by jOOQ.
 */
package com.rodiejacontable.database.jooq.tables;


import com.rodiejacontable.database.jooq.Indexes;
import com.rodiejacontable.database.jooq.Keys;
import com.rodiejacontable.database.jooq.SistemaVehicular;
import com.rodiejacontable.database.jooq.enums.HistorialRepuestosAccion;
import com.rodiejacontable.database.jooq.tables.records.HistorialRepuestosRecord;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Function10;
import org.jooq.Identity;
import org.jooq.Index;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Records;
import org.jooq.Row10;
import org.jooq.Schema;
import org.jooq.SelectField;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class HistorialRepuestos extends TableImpl<HistorialRepuestosRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of
     * <code>sistema_vehicular.historial_repuestos</code>
     */
    public static final HistorialRepuestos HISTORIAL_REPUESTOS = new HistorialRepuestos();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<HistorialRepuestosRecord> getRecordType() {
        return HistorialRepuestosRecord.class;
    }

    /**
     * The column <code>sistema_vehicular.historial_repuestos.id</code>.
     */
    public final TableField<HistorialRepuestosRecord, Integer> ID = createField(DSL.name("id"), SQLDataType.INTEGER.nullable(false).identity(true), this, "");

    /**
     * The column
     * <code>sistema_vehicular.historial_repuestos.repuesto_id</code>.
     */
    public final TableField<HistorialRepuestosRecord, Integer> REPUESTO_ID = createField(DSL.name("repuesto_id"), SQLDataType.INTEGER.nullable(false), this, "");

    /**
     * The column <code>sistema_vehicular.historial_repuestos.accion</code>.
     */
    public final TableField<HistorialRepuestosRecord, HistorialRepuestosAccion> ACCION = createField(DSL.name("accion"), SQLDataType.VARCHAR(6).nullable(false).asEnumDataType(com.rodiejacontable.database.jooq.enums.HistorialRepuestosAccion.class), this, "");

    /**
     * The column
     * <code>sistema_vehicular.historial_repuestos.campo_modificado</code>.
     */
    public final TableField<HistorialRepuestosRecord, String> CAMPO_MODIFICADO = createField(DSL.name("campo_modificado"), SQLDataType.VARCHAR(50).defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.VARCHAR)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.historial_repuestos.valor_anterior</code>.
     */
    public final TableField<HistorialRepuestosRecord, String> VALOR_ANTERIOR = createField(DSL.name("valor_anterior"), SQLDataType.CLOB.defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.CLOB)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.historial_repuestos.valor_nuevo</code>.
     */
    public final TableField<HistorialRepuestosRecord, String> VALOR_NUEVO = createField(DSL.name("valor_nuevo"), SQLDataType.CLOB.defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.CLOB)), this, "");

    /**
     * The column <code>sistema_vehicular.historial_repuestos.usuario</code>.
     */
    public final TableField<HistorialRepuestosRecord, String> USUARIO = createField(DSL.name("usuario"), SQLDataType.VARCHAR(100).defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.VARCHAR)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.historial_repuestos.fecha_cambio</code>.
     */
    public final TableField<HistorialRepuestosRecord, LocalDateTime> FECHA_CAMBIO = createField(DSL.name("fecha_cambio"), SQLDataType.LOCALDATETIME(0).defaultValue(DSL.field(DSL.raw("current_timestamp()"), SQLDataType.LOCALDATETIME)), this, "");

    /**
     * The column <code>sistema_vehicular.historial_repuestos.ip_usuario</code>.
     */
    public final TableField<HistorialRepuestosRecord, String> IP_USUARIO = createField(DSL.name("ip_usuario"), SQLDataType.VARCHAR(45).defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.VARCHAR)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.historial_repuestos.observaciones</code>.
     */
    public final TableField<HistorialRepuestosRecord, String> OBSERVACIONES = createField(DSL.name("observaciones"), SQLDataType.CLOB.defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.CLOB)), this, "");

    private HistorialRepuestos(Name alias, Table<HistorialRepuestosRecord> aliased) {
        this(alias, aliased, null);
    }

    private HistorialRepuestos(Name alias, Table<HistorialRepuestosRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table());
    }

    /**
     * Create an aliased <code>sistema_vehicular.historial_repuestos</code>
     * table reference
     */
    public HistorialRepuestos(String alias) {
        this(DSL.name(alias), HISTORIAL_REPUESTOS);
    }

    /**
     * Create an aliased <code>sistema_vehicular.historial_repuestos</code>
     * table reference
     */
    public HistorialRepuestos(Name alias) {
        this(alias, HISTORIAL_REPUESTOS);
    }

    /**
     * Create a <code>sistema_vehicular.historial_repuestos</code> table
     * reference
     */
    public HistorialRepuestos() {
        this(DSL.name("historial_repuestos"), null);
    }

    public <O extends Record> HistorialRepuestos(Table<O> child, ForeignKey<O, HistorialRepuestosRecord> key) {
        super(child, key, HISTORIAL_REPUESTOS);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : SistemaVehicular.SISTEMA_VEHICULAR;
    }

    @Override
    public List<Index> getIndexes() {
        return Arrays.asList(Indexes.HISTORIAL_REPUESTOS_IDX_ACCION, Indexes.HISTORIAL_REPUESTOS_IDX_REPUESTO_FECHA);
    }

    @Override
    public Identity<HistorialRepuestosRecord, Integer> getIdentity() {
        return (Identity<HistorialRepuestosRecord, Integer>) super.getIdentity();
    }

    @Override
    public UniqueKey<HistorialRepuestosRecord> getPrimaryKey() {
        return Keys.KEY_HISTORIAL_REPUESTOS_PRIMARY;
    }

    @Override
    public List<ForeignKey<HistorialRepuestosRecord, ?>> getReferences() {
        return Arrays.asList(Keys.HISTORIAL_REPUESTOS_IBFK_1);
    }

    private transient InventarioRepuestos _inventarioRepuestos;

    /**
     * Get the implicit join path to the
     * <code>sistema_vehicular.inventario_repuestos</code> table.
     */
    public InventarioRepuestos inventarioRepuestos() {
        if (_inventarioRepuestos == null)
            _inventarioRepuestos = new InventarioRepuestos(this, Keys.HISTORIAL_REPUESTOS_IBFK_1);

        return _inventarioRepuestos;
    }

    @Override
    public HistorialRepuestos as(String alias) {
        return new HistorialRepuestos(DSL.name(alias), this);
    }

    @Override
    public HistorialRepuestos as(Name alias) {
        return new HistorialRepuestos(alias, this);
    }

    @Override
    public HistorialRepuestos as(Table<?> alias) {
        return new HistorialRepuestos(alias.getQualifiedName(), this);
    }

    /**
     * Rename this table
     */
    @Override
    public HistorialRepuestos rename(String name) {
        return new HistorialRepuestos(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public HistorialRepuestos rename(Name name) {
        return new HistorialRepuestos(name, null);
    }

    /**
     * Rename this table
     */
    @Override
    public HistorialRepuestos rename(Table<?> name) {
        return new HistorialRepuestos(name.getQualifiedName(), null);
    }

    // -------------------------------------------------------------------------
    // Row10 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row10<Integer, Integer, HistorialRepuestosAccion, String, String, String, String, LocalDateTime, String, String> fieldsRow() {
        return (Row10) super.fieldsRow();
    }

    /**
     * Convenience mapping calling {@link SelectField#convertFrom(Function)}.
     */
    public <U> SelectField<U> mapping(Function10<? super Integer, ? super Integer, ? super HistorialRepuestosAccion, ? super String, ? super String, ? super String, ? super String, ? super LocalDateTime, ? super String, ? super String, ? extends U> from) {
        return convertFrom(Records.mapping(from));
    }

    /**
     * Convenience mapping calling {@link SelectField#convertFrom(Class,
     * Function)}.
     */
    public <U> SelectField<U> mapping(Class<U> toType, Function10<? super Integer, ? super Integer, ? super HistorialRepuestosAccion, ? super String, ? super String, ? super String, ? super String, ? super LocalDateTime, ? super String, ? super String, ? extends U> from) {
        return convertFrom(toType, Records.mapping(from));
    }
}
