/*
 * This file is generated by jOOQ.
 */
package com.rodiejacontable.database.jooq.tables;


import com.rodiejacontable.database.jooq.SistemaVehicular;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasCategoria;
import com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasEstado;
import com.rodiejacontable.database.jooq.tables.records.VistaTransaccionesCompletasRecord;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.function.Function;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Function17;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Records;
import org.jooq.Row17;
import org.jooq.Schema;
import org.jooq.SelectField;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;


/**
 * VIEW
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class VistaTransaccionesCompletas extends TableImpl<VistaTransaccionesCompletasRecord> {

    private static final long serialVersionUID = 1L;

    /**
     * The reference instance of
     * <code>sistema_vehicular.vista_transacciones_completas</code>
     */
    public static final VistaTransaccionesCompletas VISTA_TRANSACCIONES_COMPLETAS = new VistaTransaccionesCompletas();

    /**
     * The class holding records for this type
     */
    @Override
    public Class<VistaTransaccionesCompletasRecord> getRecordType() {
        return VistaTransaccionesCompletasRecord.class;
    }

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.id</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, Integer> ID = createField(DSL.name("id"), SQLDataType.INTEGER.nullable(false).defaultValue(DSL.field(DSL.raw("0"), SQLDataType.INTEGER)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.codigo_transaccion</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> CODIGO_TRANSACCION = createField(DSL.name("codigo_transaccion"), SQLDataType.VARCHAR(20).defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.VARCHAR)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.fecha</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, LocalDate> FECHA = createField(DSL.name("fecha"), SQLDataType.LOCALDATE.nullable(false), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.monto</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, BigDecimal> MONTO = createField(DSL.name("monto"), SQLDataType.DECIMAL(12, 2).nullable(false), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.comision_empleado</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, BigDecimal> COMISION_EMPLEADO = createField(DSL.name("comision_empleado"), SQLDataType.DECIMAL(12, 2).defaultValue(DSL.field(DSL.raw("0.00"), SQLDataType.DECIMAL)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.descripcion</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> DESCRIPCION = createField(DSL.name("descripcion"), SQLDataType.CLOB.defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.CLOB)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.referencia</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> REFERENCIA = createField(DSL.name("referencia"), SQLDataType.VARCHAR(100).defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.VARCHAR)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.estado</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, VistaTransaccionesCompletasEstado> ESTADO = createField(DSL.name("estado"), SQLDataType.VARCHAR(10).defaultValue(DSL.field(DSL.raw("'COMPLETADA'"), SQLDataType.VARCHAR)).asEnumDataType(com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasEstado.class), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.tipo_transaccion</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> TIPO_TRANSACCION = createField(DSL.name("tipo_transaccion"), SQLDataType.VARCHAR(50).nullable(false), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.categoria</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, VistaTransaccionesCompletasCategoria> CATEGORIA = createField(DSL.name("categoria"), SQLDataType.VARCHAR(7).nullable(false).asEnumDataType(com.rodiejacontable.database.jooq.enums.VistaTransaccionesCompletasCategoria.class), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.empleado</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> EMPLEADO = createField(DSL.name("empleado"), SQLDataType.VARCHAR(100), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.codigo_vehiculo</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> CODIGO_VEHICULO = createField(DSL.name("codigo_vehiculo"), SQLDataType.VARCHAR(20).defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.VARCHAR)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.codigo_repuesto</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> CODIGO_REPUESTO = createField(DSL.name("codigo_repuesto"), SQLDataType.VARCHAR(100).defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.VARCHAR)), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.marca</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> MARCA = createField(DSL.name("marca"), SQLDataType.VARCHAR(50), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.modelo</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> MODELO = createField(DSL.name("modelo"), SQLDataType.VARCHAR(100), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.generacion</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> GENERACION = createField(DSL.name("generacion"), SQLDataType.VARCHAR(50), this, "");

    /**
     * The column
     * <code>sistema_vehicular.vista_transacciones_completas.clave_generacion</code>.
     */
    public final TableField<VistaTransaccionesCompletasRecord, String> CLAVE_GENERACION = createField(DSL.name("clave_generacion"), SQLDataType.VARCHAR(202).defaultValue(DSL.field(DSL.raw("NULL"), SQLDataType.VARCHAR)), this, "");

    private VistaTransaccionesCompletas(Name alias, Table<VistaTransaccionesCompletasRecord> aliased) {
        this(alias, aliased, null);
    }

    private VistaTransaccionesCompletas(Name alias, Table<VistaTransaccionesCompletasRecord> aliased, Field<?>[] parameters) {
        super(alias, null, aliased, parameters, DSL.comment("VIEW"), TableOptions.view("create view `vista_transacciones_completas` as select `tf`.`id` AS `id`,`tf`.`codigo_transaccion` AS `codigo_transaccion`,`tf`.`fecha` AS `fecha`,`tf`.`monto` AS `monto`,`tf`.`comision_empleado` AS `comision_empleado`,`tf`.`descripcion` AS `descripcion`,`tf`.`referencia` AS `referencia`,`tf`.`estado` AS `estado`,`tt`.`nombre` AS `tipo_transaccion`,`tt`.`categoria` AS `categoria`,`e`.`nombre` AS `empleado`,`v`.`codigo_vehiculo` AS `codigo_vehiculo`,`ir`.`codigo_repuesto` AS `codigo_repuesto`,`vvc`.`marca` AS `marca`,`vvc`.`modelo` AS `modelo`,`vvc`.`generacion` AS `generacion`,`vvc`.`clave_generacion` AS `clave_generacion` from (((((`sistema_vehicular`.`transacciones_financieras` `tf` join `sistema_vehicular`.`tipos_transacciones` `tt` on(`tf`.`tipo_transaccion_id` = `tt`.`id`)) left join `sistema_vehicular`.`empleados` `e` on(`tf`.`empleado_id` = `e`.`id`)) left join `sistema_vehicular`.`vehiculos` `v` on(`tf`.`vehiculo_id` = `v`.`id`)) left join `sistema_vehicular`.`inventario_repuestos` `ir` on(`tf`.`repuesto_id` = `ir`.`id`)) left join `sistema_vehicular`.`vista_vehiculos_completa` `vvc` on(`vvc`.`id` = coalesce(`tf`.`vehiculo_id`,`ir`.`vehiculo_origen_id`))) where `tf`.`activo` = 1"));
    }

    /**
     * Create an aliased
     * <code>sistema_vehicular.vista_transacciones_completas</code> table
     * reference
     */
    public VistaTransaccionesCompletas(String alias) {
        this(DSL.name(alias), VISTA_TRANSACCIONES_COMPLETAS);
    }

    /**
     * Create an aliased
     * <code>sistema_vehicular.vista_transacciones_completas</code> table
     * reference
     */
    public VistaTransaccionesCompletas(Name alias) {
        this(alias, VISTA_TRANSACCIONES_COMPLETAS);
    }

    /**
     * Create a <code>sistema_vehicular.vista_transacciones_completas</code>
     * table reference
     */
    public VistaTransaccionesCompletas() {
        this(DSL.name("vista_transacciones_completas"), null);
    }

    public <O extends Record> VistaTransaccionesCompletas(Table<O> child, ForeignKey<O, VistaTransaccionesCompletasRecord> key) {
        super(child, key, VISTA_TRANSACCIONES_COMPLETAS);
    }

    @Override
    public Schema getSchema() {
        return aliased() ? null : SistemaVehicular.SISTEMA_VEHICULAR;
    }

    @Override
    public VistaTransaccionesCompletas as(String alias) {
        return new VistaTransaccionesCompletas(DSL.name(alias), this);
    }

    @Override
    public VistaTransaccionesCompletas as(Name alias) {
        return new VistaTransaccionesCompletas(alias, this);
    }

    @Override
    public VistaTransaccionesCompletas as(Table<?> alias) {
        return new VistaTransaccionesCompletas(alias.getQualifiedName(), this);
    }

    /**
     * Rename this table
     */
    @Override
    public VistaTransaccionesCompletas rename(String name) {
        return new VistaTransaccionesCompletas(DSL.name(name), null);
    }

    /**
     * Rename this table
     */
    @Override
    public VistaTransaccionesCompletas rename(Name name) {
        return new VistaTransaccionesCompletas(name, null);
    }

    /**
     * Rename this table
     */
    @Override
    public VistaTransaccionesCompletas rename(Table<?> name) {
        return new VistaTransaccionesCompletas(name.getQualifiedName(), null);
    }

    // -------------------------------------------------------------------------
    // Row17 type methods
    // -------------------------------------------------------------------------

    @Override
    public Row17<Integer, String, LocalDate, BigDecimal, BigDecimal, String, String, VistaTransaccionesCompletasEstado, String, VistaTransaccionesCompletasCategoria, String, String, String, String, String, String, String> fieldsRow() {
        return (Row17) super.fieldsRow();
    }

    /**
     * Convenience mapping calling {@link SelectField#convertFrom(Function)}.
     */
    public <U> SelectField<U> mapping(Function17<? super Integer, ? super String, ? super LocalDate, ? super BigDecimal, ? super BigDecimal, ? super String, ? super String, ? super VistaTransaccionesCompletasEstado, ? super String, ? super VistaTransaccionesCompletasCategoria, ? super String, ? super String, ? super String, ? super String, ? super String, ? super String, ? super String, ? extends U> from) {
        return convertFrom(Records.mapping(from));
    }

    /**
     * Convenience mapping calling {@link SelectField#convertFrom(Class,
     * Function)}.
     */
    public <U> SelectField<U> mapping(Class<U> toType, Function17<? super Integer, ? super String, ? super LocalDate, ? super BigDecimal, ? super BigDecimal, ? super String, ? super String, ? super VistaTransaccionesCompletasEstado, ? super String, ? super VistaTransaccionesCompletasCategoria, ? super String, ? super String, ? super String, ? super String, ? super String, ? super String, ? super String, ? extends U> from) {
        return convertFrom(toType, Records.mapping(from));
    }
}
