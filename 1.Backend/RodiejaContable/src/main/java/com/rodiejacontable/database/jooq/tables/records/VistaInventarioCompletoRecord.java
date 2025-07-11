/*
 * This file is generated by jOOQ.
 */
package com.rodiejacontable.database.jooq.tables.records;


import com.rodiejacontable.database.jooq.enums.VistaInventarioCompletoEstado;
import com.rodiejacontable.database.jooq.enums.VistaInventarioCompletoParteVehiculo;
import com.rodiejacontable.database.jooq.tables.VistaInventarioCompleto;

import java.math.BigDecimal;

import org.jooq.Field;
import org.jooq.Record19;
import org.jooq.Row19;
import org.jooq.impl.TableRecordImpl;


/**
 * VIEW
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class VistaInventarioCompletoRecord extends TableRecordImpl<VistaInventarioCompletoRecord> implements Record19<Integer, String, String, VistaInventarioCompletoParteVehiculo, String, BigDecimal, BigDecimal, BigDecimal, BigDecimal, BigDecimal, VistaInventarioCompletoEstado, Short, Byte, String, String, String, String, Integer, String> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for <code>sistema_vehicular.vista_inventario_completo.id</code>.
     */
    public VistaInventarioCompletoRecord setId(Integer value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for <code>sistema_vehicular.vista_inventario_completo.id</code>.
     */
    public Integer getId() {
        return (Integer) get(0);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.codigo_repuesto</code>.
     */
    public VistaInventarioCompletoRecord setCodigoRepuesto(String value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.codigo_repuesto</code>.
     */
    public String getCodigoRepuesto() {
        return (String) get(1);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.codigo_ubicacion</code>.
     */
    public VistaInventarioCompletoRecord setCodigoUbicacion(String value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.codigo_ubicacion</code>.
     */
    public String getCodigoUbicacion() {
        return (String) get(2);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.parte_vehiculo</code>.
     */
    public VistaInventarioCompletoRecord setParteVehiculo(VistaInventarioCompletoParteVehiculo value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.parte_vehiculo</code>.
     */
    public VistaInventarioCompletoParteVehiculo getParteVehiculo() {
        return (VistaInventarioCompletoParteVehiculo) get(3);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.descripcion</code>.
     */
    public VistaInventarioCompletoRecord setDescripcion(String value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.descripcion</code>.
     */
    public String getDescripcion() {
        return (String) get(4);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.precio_costo</code>.
     */
    public VistaInventarioCompletoRecord setPrecioCosto(BigDecimal value) {
        set(5, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.precio_costo</code>.
     */
    public BigDecimal getPrecioCosto() {
        return (BigDecimal) get(5);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.precio_venta</code>.
     */
    public VistaInventarioCompletoRecord setPrecioVenta(BigDecimal value) {
        set(6, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.precio_venta</code>.
     */
    public BigDecimal getPrecioVenta() {
        return (BigDecimal) get(6);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.precio_mayoreo</code>.
     */
    public VistaInventarioCompletoRecord setPrecioMayoreo(BigDecimal value) {
        set(7, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.precio_mayoreo</code>.
     */
    public BigDecimal getPrecioMayoreo() {
        return (BigDecimal) get(7);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.formula_15</code>.
     */
    public VistaInventarioCompletoRecord setFormula_15(BigDecimal value) {
        set(8, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.formula_15</code>.
     */
    public BigDecimal getFormula_15() {
        return (BigDecimal) get(8);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.formula_30</code>.
     */
    public VistaInventarioCompletoRecord setFormula_30(BigDecimal value) {
        set(9, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.formula_30</code>.
     */
    public BigDecimal getFormula_30() {
        return (BigDecimal) get(9);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.estado</code>.
     */
    public VistaInventarioCompletoRecord setEstado(VistaInventarioCompletoEstado value) {
        set(10, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.estado</code>.
     */
    public VistaInventarioCompletoEstado getEstado() {
        return (VistaInventarioCompletoEstado) get(10);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.anio_registro</code>.
     */
    public VistaInventarioCompletoRecord setAnioRegistro(Short value) {
        set(11, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.anio_registro</code>.
     */
    public Short getAnioRegistro() {
        return (Short) get(11);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.mes_registro</code>.
     */
    public VistaInventarioCompletoRecord setMesRegistro(Byte value) {
        set(12, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.mes_registro</code>.
     */
    public Byte getMesRegistro() {
        return (Byte) get(12);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.codigo_vehiculo</code>.
     */
    public VistaInventarioCompletoRecord setCodigoVehiculo(String value) {
        set(13, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.codigo_vehiculo</code>.
     */
    public String getCodigoVehiculo() {
        return (String) get(13);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.marca</code>.
     */
    public VistaInventarioCompletoRecord setMarca(String value) {
        set(14, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.marca</code>.
     */
    public String getMarca() {
        return (String) get(14);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.modelo</code>.
     */
    public VistaInventarioCompletoRecord setModelo(String value) {
        set(15, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.modelo</code>.
     */
    public String getModelo() {
        return (String) get(15);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.generacion</code>.
     */
    public VistaInventarioCompletoRecord setGeneracion(String value) {
        set(16, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.generacion</code>.
     */
    public String getGeneracion() {
        return (String) get(16);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.anio_vehiculo</code>.
     */
    public VistaInventarioCompletoRecord setAnioVehiculo(Integer value) {
        set(17, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.anio_vehiculo</code>.
     */
    public Integer getAnioVehiculo() {
        return (Integer) get(17);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_inventario_completo.clave_generacion</code>.
     */
    public VistaInventarioCompletoRecord setClaveGeneracion(String value) {
        set(18, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_inventario_completo.clave_generacion</code>.
     */
    public String getClaveGeneracion() {
        return (String) get(18);
    }

    // -------------------------------------------------------------------------
    // Record19 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row19<Integer, String, String, VistaInventarioCompletoParteVehiculo, String, BigDecimal, BigDecimal, BigDecimal, BigDecimal, BigDecimal, VistaInventarioCompletoEstado, Short, Byte, String, String, String, String, Integer, String> fieldsRow() {
        return (Row19) super.fieldsRow();
    }

    @Override
    public Row19<Integer, String, String, VistaInventarioCompletoParteVehiculo, String, BigDecimal, BigDecimal, BigDecimal, BigDecimal, BigDecimal, VistaInventarioCompletoEstado, Short, Byte, String, String, String, String, Integer, String> valuesRow() {
        return (Row19) super.valuesRow();
    }

    @Override
    public Field<Integer> field1() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.ID;
    }

    @Override
    public Field<String> field2() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.CODIGO_REPUESTO;
    }

    @Override
    public Field<String> field3() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.CODIGO_UBICACION;
    }

    @Override
    public Field<VistaInventarioCompletoParteVehiculo> field4() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.PARTE_VEHICULO;
    }

    @Override
    public Field<String> field5() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.DESCRIPCION;
    }

    @Override
    public Field<BigDecimal> field6() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.PRECIO_COSTO;
    }

    @Override
    public Field<BigDecimal> field7() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.PRECIO_VENTA;
    }

    @Override
    public Field<BigDecimal> field8() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.PRECIO_MAYOREO;
    }

    @Override
    public Field<BigDecimal> field9() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.FORMULA_15;
    }

    @Override
    public Field<BigDecimal> field10() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.FORMULA_30;
    }

    @Override
    public Field<VistaInventarioCompletoEstado> field11() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.ESTADO;
    }

    @Override
    public Field<Short> field12() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.ANIO_REGISTRO;
    }

    @Override
    public Field<Byte> field13() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.MES_REGISTRO;
    }

    @Override
    public Field<String> field14() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.CODIGO_VEHICULO;
    }

    @Override
    public Field<String> field15() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.MARCA;
    }

    @Override
    public Field<String> field16() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.MODELO;
    }

    @Override
    public Field<String> field17() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.GENERACION;
    }

    @Override
    public Field<Integer> field18() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.ANIO_VEHICULO;
    }

    @Override
    public Field<String> field19() {
        return VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO.CLAVE_GENERACION;
    }

    @Override
    public Integer component1() {
        return getId();
    }

    @Override
    public String component2() {
        return getCodigoRepuesto();
    }

    @Override
    public String component3() {
        return getCodigoUbicacion();
    }

    @Override
    public VistaInventarioCompletoParteVehiculo component4() {
        return getParteVehiculo();
    }

    @Override
    public String component5() {
        return getDescripcion();
    }

    @Override
    public BigDecimal component6() {
        return getPrecioCosto();
    }

    @Override
    public BigDecimal component7() {
        return getPrecioVenta();
    }

    @Override
    public BigDecimal component8() {
        return getPrecioMayoreo();
    }

    @Override
    public BigDecimal component9() {
        return getFormula_15();
    }

    @Override
    public BigDecimal component10() {
        return getFormula_30();
    }

    @Override
    public VistaInventarioCompletoEstado component11() {
        return getEstado();
    }

    @Override
    public Short component12() {
        return getAnioRegistro();
    }

    @Override
    public Byte component13() {
        return getMesRegistro();
    }

    @Override
    public String component14() {
        return getCodigoVehiculo();
    }

    @Override
    public String component15() {
        return getMarca();
    }

    @Override
    public String component16() {
        return getModelo();
    }

    @Override
    public String component17() {
        return getGeneracion();
    }

    @Override
    public Integer component18() {
        return getAnioVehiculo();
    }

    @Override
    public String component19() {
        return getClaveGeneracion();
    }

    @Override
    public Integer value1() {
        return getId();
    }

    @Override
    public String value2() {
        return getCodigoRepuesto();
    }

    @Override
    public String value3() {
        return getCodigoUbicacion();
    }

    @Override
    public VistaInventarioCompletoParteVehiculo value4() {
        return getParteVehiculo();
    }

    @Override
    public String value5() {
        return getDescripcion();
    }

    @Override
    public BigDecimal value6() {
        return getPrecioCosto();
    }

    @Override
    public BigDecimal value7() {
        return getPrecioVenta();
    }

    @Override
    public BigDecimal value8() {
        return getPrecioMayoreo();
    }

    @Override
    public BigDecimal value9() {
        return getFormula_15();
    }

    @Override
    public BigDecimal value10() {
        return getFormula_30();
    }

    @Override
    public VistaInventarioCompletoEstado value11() {
        return getEstado();
    }

    @Override
    public Short value12() {
        return getAnioRegistro();
    }

    @Override
    public Byte value13() {
        return getMesRegistro();
    }

    @Override
    public String value14() {
        return getCodigoVehiculo();
    }

    @Override
    public String value15() {
        return getMarca();
    }

    @Override
    public String value16() {
        return getModelo();
    }

    @Override
    public String value17() {
        return getGeneracion();
    }

    @Override
    public Integer value18() {
        return getAnioVehiculo();
    }

    @Override
    public String value19() {
        return getClaveGeneracion();
    }

    @Override
    public VistaInventarioCompletoRecord value1(Integer value) {
        setId(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value2(String value) {
        setCodigoRepuesto(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value3(String value) {
        setCodigoUbicacion(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value4(VistaInventarioCompletoParteVehiculo value) {
        setParteVehiculo(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value5(String value) {
        setDescripcion(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value6(BigDecimal value) {
        setPrecioCosto(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value7(BigDecimal value) {
        setPrecioVenta(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value8(BigDecimal value) {
        setPrecioMayoreo(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value9(BigDecimal value) {
        setFormula_15(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value10(BigDecimal value) {
        setFormula_30(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value11(VistaInventarioCompletoEstado value) {
        setEstado(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value12(Short value) {
        setAnioRegistro(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value13(Byte value) {
        setMesRegistro(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value14(String value) {
        setCodigoVehiculo(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value15(String value) {
        setMarca(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value16(String value) {
        setModelo(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value17(String value) {
        setGeneracion(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value18(Integer value) {
        setAnioVehiculo(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord value19(String value) {
        setClaveGeneracion(value);
        return this;
    }

    @Override
    public VistaInventarioCompletoRecord values(Integer value1, String value2, String value3, VistaInventarioCompletoParteVehiculo value4, String value5, BigDecimal value6, BigDecimal value7, BigDecimal value8, BigDecimal value9, BigDecimal value10, VistaInventarioCompletoEstado value11, Short value12, Byte value13, String value14, String value15, String value16, String value17, Integer value18, String value19) {
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
        value11(value11);
        value12(value12);
        value13(value13);
        value14(value14);
        value15(value15);
        value16(value16);
        value17(value17);
        value18(value18);
        value19(value19);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached VistaInventarioCompletoRecord
     */
    public VistaInventarioCompletoRecord() {
        super(VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO);
    }

    /**
     * Create a detached, initialised VistaInventarioCompletoRecord
     */
    public VistaInventarioCompletoRecord(Integer id, String codigoRepuesto, String codigoUbicacion, VistaInventarioCompletoParteVehiculo parteVehiculo, String descripcion, BigDecimal precioCosto, BigDecimal precioVenta, BigDecimal precioMayoreo, BigDecimal formula_15, BigDecimal formula_30, VistaInventarioCompletoEstado estado, Short anioRegistro, Byte mesRegistro, String codigoVehiculo, String marca, String modelo, String generacion, Integer anioVehiculo, String claveGeneracion) {
        super(VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO);

        setId(id);
        setCodigoRepuesto(codigoRepuesto);
        setCodigoUbicacion(codigoUbicacion);
        setParteVehiculo(parteVehiculo);
        setDescripcion(descripcion);
        setPrecioCosto(precioCosto);
        setPrecioVenta(precioVenta);
        setPrecioMayoreo(precioMayoreo);
        setFormula_15(formula_15);
        setFormula_30(formula_30);
        setEstado(estado);
        setAnioRegistro(anioRegistro);
        setMesRegistro(mesRegistro);
        setCodigoVehiculo(codigoVehiculo);
        setMarca(marca);
        setModelo(modelo);
        setGeneracion(generacion);
        setAnioVehiculo(anioVehiculo);
        setClaveGeneracion(claveGeneracion);
        resetChangedOnNotNull();
    }

    /**
     * Create a detached, initialised VistaInventarioCompletoRecord
     */
    public VistaInventarioCompletoRecord(com.rodiejacontable.database.jooq.tables.pojos.VistaInventarioCompleto value) {
        super(VistaInventarioCompleto.VISTA_INVENTARIO_COMPLETO);

        if (value != null) {
            setId(value.getId());
            setCodigoRepuesto(value.getCodigoRepuesto());
            setCodigoUbicacion(value.getCodigoUbicacion());
            setParteVehiculo(value.getParteVehiculo());
            setDescripcion(value.getDescripcion());
            setPrecioCosto(value.getPrecioCosto());
            setPrecioVenta(value.getPrecioVenta());
            setPrecioMayoreo(value.getPrecioMayoreo());
            setFormula_15(value.getFormula_15());
            setFormula_30(value.getFormula_30());
            setEstado(value.getEstado());
            setAnioRegistro(value.getAnioRegistro());
            setMesRegistro(value.getMesRegistro());
            setCodigoVehiculo(value.getCodigoVehiculo());
            setMarca(value.getMarca());
            setModelo(value.getModelo());
            setGeneracion(value.getGeneracion());
            setAnioVehiculo(value.getAnioVehiculo());
            setClaveGeneracion(value.getClaveGeneracion());
            resetChangedOnNotNull();
        }
    }
}
