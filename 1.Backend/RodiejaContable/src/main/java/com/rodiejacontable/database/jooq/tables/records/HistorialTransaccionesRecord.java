/*
 * This file is generated by jOOQ.
 */
package com.rodiejacontable.database.jooq.tables.records;


import com.rodiejacontable.database.jooq.enums.HistorialTransaccionesAccion;
import com.rodiejacontable.database.jooq.tables.HistorialTransacciones;

import java.time.LocalDateTime;

import org.jooq.Field;
import org.jooq.Record1;
import org.jooq.Record10;
import org.jooq.Row10;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class HistorialTransaccionesRecord extends UpdatableRecordImpl<HistorialTransaccionesRecord> implements Record10<Integer, Integer, HistorialTransaccionesAccion, String, String, String, String, LocalDateTime, String, String> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>sistema_vehicular.historial_transacciones.id</code>.
     */
    public HistorialTransaccionesRecord setId(Integer value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>sistema_vehicular.historial_transacciones.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.historial_transacciones.transaccion_id</code>.
     */
    public HistorialTransaccionesRecord setTransaccionId(Integer value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.historial_transacciones.transaccion_id</code>.
     */
    public Integer getTransaccionId() {
        return (Integer) get(1);
    }

    /**
     * Setter for <code>sistema_vehicular.historial_transacciones.accion</code>.
     */
    public HistorialTransaccionesRecord setAccion(HistorialTransaccionesAccion value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for <code>sistema_vehicular.historial_transacciones.accion</code>.
     */
    public HistorialTransaccionesAccion getAccion() {
        return (HistorialTransaccionesAccion) get(2);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.historial_transacciones.campo_modificado</code>.
     */
    public HistorialTransaccionesRecord setCampoModificado(String value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.historial_transacciones.campo_modificado</code>.
     */
    public String getCampoModificado() {
        return (String) get(3);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.historial_transacciones.valor_anterior</code>.
     */
    public HistorialTransaccionesRecord setValorAnterior(String value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.historial_transacciones.valor_anterior</code>.
     */
    public String getValorAnterior() {
        return (String) get(4);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.historial_transacciones.valor_nuevo</code>.
     */
    public HistorialTransaccionesRecord setValorNuevo(String value) {
        set(5, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.historial_transacciones.valor_nuevo</code>.
     */
    public String getValorNuevo() {
        return (String) get(5);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.historial_transacciones.usuario</code>.
     */
    public HistorialTransaccionesRecord setUsuario(String value) {
        set(6, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.historial_transacciones.usuario</code>.
     */
    public String getUsuario() {
        return (String) get(6);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.historial_transacciones.fecha_cambio</code>.
     */
    public HistorialTransaccionesRecord setFechaCambio(LocalDateTime value) {
        set(7, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.historial_transacciones.fecha_cambio</code>.
     */
    public LocalDateTime getFechaCambio() {
        return (LocalDateTime) get(7);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.historial_transacciones.ip_usuario</code>.
     */
    public HistorialTransaccionesRecord setIpUsuario(String value) {
        set(8, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.historial_transacciones.ip_usuario</code>.
     */
    public String getIpUsuario() {
        return (String) get(8);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.historial_transacciones.observaciones</code>.
     */
    public HistorialTransaccionesRecord setObservaciones(String value) {
        set(9, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.historial_transacciones.observaciones</code>.
     */
    public String getObservaciones() {
        return (String) get(9);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    @Override
    public Record1<Integer> key() {
        return (Record1) super.key();
    }

    // -------------------------------------------------------------------------
    // Record10 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row10<Integer, Integer, HistorialTransaccionesAccion, String, String, String, String, LocalDateTime, String, String> fieldsRow() {
        return (Row10) super.fieldsRow();
    }

    @Override
    public Row10<Integer, Integer, HistorialTransaccionesAccion, String, String, String, String, LocalDateTime, String, String> valuesRow() {
        return (Row10) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.ID;
    }

    @Override
    public Field<Integer> field2() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.TRANSACCION_ID;
    }

    @Override
    public Field<HistorialTransaccionesAccion> field3() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.ACCION;
    }

    @Override
    public Field<String> field4() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.CAMPO_MODIFICADO;
    }

    @Override
    public Field<String> field5() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.VALOR_ANTERIOR;
    }

    @Override
    public Field<String> field6() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.VALOR_NUEVO;
    }

    @Override
    public Field<String> field7() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.USUARIO;
    }

    @Override
    public Field<LocalDateTime> field8() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.FECHA_CAMBIO;
    }

    @Override
    public Field<String> field9() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.IP_USUARIO;
    }

    @Override
    public Field<String> field10() {
        return HistorialTransacciones.HISTORIAL_TRANSACCIONES.OBSERVACIONES;
    }

    @Override
    public Integer component1() {
        return getId();
    }

    @Override
    public Integer component2() {
        return getTransaccionId();
    }

    @Override
    public HistorialTransaccionesAccion component3() {
        return getAccion();
    }

    @Override
    public String component4() {
        return getCampoModificado();
    }

    @Override
    public String component5() {
        return getValorAnterior();
    }

    @Override
    public String component6() {
        return getValorNuevo();
    }

    @Override
    public String component7() {
        return getUsuario();
    }

    @Override
    public LocalDateTime component8() {
        return getFechaCambio();
    }

    @Override
    public String component9() {
        return getIpUsuario();
    }

    @Override
    public String component10() {
        return getObservaciones();
    }

    @Override
    public Integer value1() {
        return getId();
    }

    @Override
    public Integer value2() {
        return getTransaccionId();
    }

    @Override
    public HistorialTransaccionesAccion value3() {
        return getAccion();
    }

    @Override
    public String value4() {
        return getCampoModificado();
    }

    @Override
    public String value5() {
        return getValorAnterior();
    }

    @Override
    public String value6() {
        return getValorNuevo();
    }

    @Override
    public String value7() {
        return getUsuario();
    }

    @Override
    public LocalDateTime value8() {
        return getFechaCambio();
    }

    @Override
    public String value9() {
        return getIpUsuario();
    }

    @Override
    public String value10() {
        return getObservaciones();
    }

    @Override
    public HistorialTransaccionesRecord value1(Integer value) {
        setId(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord value2(Integer value) {
        setTransaccionId(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord value3(HistorialTransaccionesAccion value) {
        setAccion(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord value4(String value) {
        setCampoModificado(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord value5(String value) {
        setValorAnterior(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord value6(String value) {
        setValorNuevo(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord value7(String value) {
        setUsuario(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord value8(LocalDateTime value) {
        setFechaCambio(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord value9(String value) {
        setIpUsuario(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord value10(String value) {
        setObservaciones(value);
        return this;
    }

    @Override
    public HistorialTransaccionesRecord values(Integer value1, Integer value2, HistorialTransaccionesAccion value3, String value4, String value5, String value6, String value7, LocalDateTime value8, String value9, String value10) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        value6(value6);
        value7(value7);
        value8(value8);
        value9(value9);
        value10(value10);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached HistorialTransaccionesRecord
     */
    public HistorialTransaccionesRecord() {
        super(HistorialTransacciones.HISTORIAL_TRANSACCIONES);
    }

    /**
     * Create a detached, initialised HistorialTransaccionesRecord
     */
    public HistorialTransaccionesRecord(Integer id, Integer transaccionId, HistorialTransaccionesAccion accion, String campoModificado, String valorAnterior, String valorNuevo, String usuario, LocalDateTime fechaCambio, String ipUsuario, String observaciones) {
        super(HistorialTransacciones.HISTORIAL_TRANSACCIONES);

        setId(id);
        setTransaccionId(transaccionId);
        setAccion(accion);
        setCampoModificado(campoModificado);
        setValorAnterior(valorAnterior);
        setValorNuevo(valorNuevo);
        setUsuario(usuario);
        setFechaCambio(fechaCambio);
        setIpUsuario(ipUsuario);
        setObservaciones(observaciones);
        resetChangedOnNotNull();
    }

    /**
     * Create a detached, initialised HistorialTransaccionesRecord
     */
    public HistorialTransaccionesRecord(com.rodiejacontable.database.jooq.tables.pojos.HistorialTransacciones value) {
        super(HistorialTransacciones.HISTORIAL_TRANSACCIONES);

        if (value != null) {
            setId(value.getId());
            setTransaccionId(value.getTransaccionId());
            setAccion(value.getAccion());
            setCampoModificado(value.getCampoModificado());
            setValorAnterior(value.getValorAnterior());
            setValorNuevo(value.getValorNuevo());
            setUsuario(value.getUsuario());
            setFechaCambio(value.getFechaCambio());
            setIpUsuario(value.getIpUsuario());
            setObservaciones(value.getObservaciones());
            resetChangedOnNotNull();
        }
    }
}
