/*
 * This file is generated by jOOQ.
 */
package com.rodiejacontable.database.jooq.tables;


import com.rodiejacontable.database.jooq.Keys;
import com.rodiejacontable.database.jooq.SistemaVehicular;
import com.rodiejacontable.database.jooq.tables.records.MarcasRecord;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Function4;
import org.jooq.Identity;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Records;
import org.jooq.Row4;
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
public class Marcas extends TableImpl<MarcasRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of <code>sistema_vehicular.marcas</code>
     */
    public static final Marcas MARCAS = new Marcas();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<MarcasRecord> getRecordType() {
        return MarcasRecord.class;
    }

    /**
     * The column <code>sistema_vehicular.marcas.id</code>.
     */
    public final TableField<MarcasRecord, Integer> ID = createField(DSL.name("id"), SQLDataType.INTEGER.nullable(false).identity(true), this, "");

    /**
     * The column <code>sistema_vehicular.marcas.nombre</code>.
     */
    public final TableField<MarcasRecord, String> NOMBRE = createField(DSL.name("nombre"), SQLDataType.VARCHAR(50).nullable(false), this, "");

    /**
     * The column <code>sistema_vehicular.marcas.activo</code>.
     */
    public final TableField<MarcasRecord, Byte> ACTIVO = createField(DSL.name("activo"), SQLDataType.TINYINT.defaultValue(DSL.field(DSL.raw("1"), SQLDataType.TINYINT)), this, "");

    /**
     * The column <code>sistema_vehicular.marcas.fecha_creacion</code>.
     */
    public final TableField<MarcasRecord, LocalDateTime> FECHA_CREACION = createField(DSL.name("fecha_creacion"), SQLDataType.LOCALDATETIME(0).defaultValue(DSL.field(DSL.raw("current_timestamp()"), SQLDataType.LOCALDATETIME)), this, "");

    private Marcas(Name alias, Table<MarcasRecord> aliased) {
        this(alias, aliased, null);
    }

    private Marcas(Name alias, Table<MarcasRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table());
    }

    /**
     * Create an aliased <code>sistema_vehicular.marcas</code> table reference
     */
    public Marcas(String alias) {
        this(DSL.name(alias), MARCAS);
    }

    /**
     * Create an aliased <code>sistema_vehicular.marcas</code> table reference
     */
    public Marcas(Name alias) {
        this(alias, MARCAS);
    }

    /**
     * Create a <code>sistema_vehicular.marcas</code> table reference
     */
    public Marcas() {
        this(DSL.name("marcas"), null);
    }

    public <O extends Record> Marcas(Table<O> child, ForeignKey<O, MarcasRecord> key) {
        super(child, key, MARCAS);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : SistemaVehicular.SISTEMA_VEHICULAR;
    }

    @Override
    public Identity<MarcasRecord, Integer> getIdentity() {
        return (Identity<MarcasRecord, Integer>) super.getIdentity();
    }

    @Override
    public UniqueKey<MarcasRecord> getPrimaryKey() {
        return Keys.KEY_MARCAS_PRIMARY;
    }

    @Override
    public List<UniqueKey<MarcasRecord>> getUniqueKeys() {
        return Arrays.asList(Keys.KEY_MARCAS_NOMBRE);
    }

    @Override
    public Marcas as(String alias) {
        return new Marcas(DSL.name(alias), this);
    }

    @Override
    public Marcas as(Name alias) {
        return new Marcas(alias, this);
    }

    @Override
    public Marcas as(Table<?> alias) {
        return new Marcas(alias.getQualifiedName(), this);
    }

    /**
     * Rename this table
     */
    @Override
    public Marcas rename(String name) {
        return new Marcas(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public Marcas rename(Name name) {
        return new Marcas(name, null);
    }

    /**
     * Rename this table
     */
    @Override
    public Marcas rename(Table<?> name) {
        return new Marcas(name.getQualifiedName(), null);
    }

    // -------------------------------------------------------------------------
    // Row4 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row4<Integer, String, Byte, LocalDateTime> fieldsRow() {
        return (Row4) super.fieldsRow();
    }

    /**
     * Convenience mapping calling {@link SelectField#convertFrom(Function)}.
     */
    public <U> SelectField<U> mapping(Function4<? super Integer, ? super String, ? super Byte, ? super LocalDateTime, ? extends U> from) {
        return convertFrom(Records.mapping(from));
    }

    /**
     * Convenience mapping calling {@link SelectField#convertFrom(Class,
     * Function)}.
     */
    public <U> SelectField<U> mapping(Class<U> toType, Function4<? super Integer, ? super String, ? super Byte, ? super LocalDateTime, ? extends U> from) {
        return convertFrom(toType, Records.mapping(from));
    }
}
