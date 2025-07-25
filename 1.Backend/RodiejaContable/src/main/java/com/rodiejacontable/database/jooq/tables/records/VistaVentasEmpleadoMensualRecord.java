/*
 * This file is generated by jOOQ.
 */
package com.rodiejacontable.database.jooq.tables.records;


import com.rodiejacontable.database.jooq.tables.VistaVentasEmpleadoMensual;

import java.math.BigDecimal;

import org.jooq.Field;
import org.jooq.Record10;
import org.jooq.Row10;
import org.jooq.impl.TableRecordImpl;


/**
 * VIEW
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class VistaVentasEmpleadoMensualRecord extends TableRecordImpl<VistaVentasEmpleadoMensualRecord> implements Record10<String, Integer, Integer, String, Long, BigDecimal, BigDecimal, BigDecimal, BigDecimal, BigDecimal> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.empleado</code>.
     */
    public VistaVentasEmpleadoMensualRecord setEmpleado(String value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.empleado</code>.
     */
    public String getEmpleado() {
        return (String) get(0);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.anio</code>.
     */
    public VistaVentasEmpleadoMensualRecord setAnio(Integer value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.anio</code>.
     */
    public Integer getAnio() {
        return (Integer) get(1);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.mes</code>.
     */
    public VistaVentasEmpleadoMensualRecord setMes(Integer value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.mes</code>.
     */
    public Integer getMes() {
        return (Integer) get(2);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.nombre_mes</code>.
     */
    public VistaVentasEmpleadoMensualRecord setNombreMes(String value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.nombre_mes</code>.
     */
    public String getNombreMes() {
        return (String) get(3);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.transacciones_venta</code>.
     */
    public VistaVentasEmpleadoMensualRecord setTransaccionesVenta(Long value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.transacciones_venta</code>.
     */
    public Long getTransaccionesVenta() {
        return (Long) get(4);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.total_ventas</code>.
     */
    public VistaVentasEmpleadoMensualRecord setTotalVentas(BigDecimal value) {
        set(5, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.total_ventas</code>.
     */
    public BigDecimal getTotalVentas() {
        return (BigDecimal) get(5);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.total_comisiones</code>.
     */
    public VistaVentasEmpleadoMensualRecord setTotalComisiones(BigDecimal value) {
        set(6, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.total_comisiones</code>.
     */
    public BigDecimal getTotalComisiones() {
        return (BigDecimal) get(6);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.contribucion_neta</code>.
     */
    public VistaVentasEmpleadoMensualRecord setContribucionNeta(BigDecimal value) {
        set(7, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.contribucion_neta</code>.
     */
    public BigDecimal getContribucionNeta() {
        return (BigDecimal) get(7);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.promedio_venta</code>.
     */
    public VistaVentasEmpleadoMensualRecord setPromedioVenta(BigDecimal value) {
        set(8, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.promedio_venta</code>.
     */
    public BigDecimal getPromedioVenta() {
        return (BigDecimal) get(8);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.porcentaje_comision</code>.
     */
    public VistaVentasEmpleadoMensualRecord setPorcentajeComision(BigDecimal value) {
        set(9, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.porcentaje_comision</code>.
     */
    public BigDecimal getPorcentajeComision() {
        return (BigDecimal) get(9);
    }

    // -------------------------------------------------------------------------
    // Record10 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row10<String, Integer, Integer, String, Long, BigDecimal, BigDecimal, BigDecimal, BigDecimal, BigDecimal> fieldsRow() {
        return (Row10) super.fieldsRow();
    }

    @Override
    public Row10<String, Integer, Integer, String, Long, BigDecimal, BigDecimal, BigDecimal, BigDecimal, BigDecimal> valuesRow() {
        return (Row10) super.valuesRow();
    }

    @Override
    public Field<String> field1() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.EMPLEADO;
    }

    @Override
    public Field<Integer> field2() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.ANIO;
    }

    @Override
    public Field<Integer> field3() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.MES;
    }

    @Override
    public Field<String> field4() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.NOMBRE_MES;
    }

    @Override
    public Field<Long> field5() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.TRANSACCIONES_VENTA;
    }

    @Override
    public Field<BigDecimal> field6() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.TOTAL_VENTAS;
    }

    @Override
    public Field<BigDecimal> field7() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.TOTAL_COMISIONES;
    }

    @Override
    public Field<BigDecimal> field8() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.CONTRIBUCION_NETA;
    }

    @Override
    public Field<BigDecimal> field9() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.PROMEDIO_VENTA;
    }

    @Override
    public Field<BigDecimal> field10() {
        return VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL.PORCENTAJE_COMISION;
    }

    @Override
    public String component1() {
        return getEmpleado();
    }

    @Override
    public Integer component2() {
        return getAnio();
    }

    @Override
    public Integer component3() {
        return getMes();
    }

    @Override
    public String component4() {
        return getNombreMes();
    }

    @Override
    public Long component5() {
        return getTransaccionesVenta();
    }

    @Override
    public BigDecimal component6() {
        return getTotalVentas();
    }

    @Override
    public BigDecimal component7() {
        return getTotalComisiones();
    }

    @Override
    public BigDecimal component8() {
        return getContribucionNeta();
    }

    @Override
    public BigDecimal component9() {
        return getPromedioVenta();
    }

    @Override
    public BigDecimal component10() {
        return getPorcentajeComision();
    }

    @Override
    public String value1() {
        return getEmpleado();
    }

    @Override
    public Integer value2() {
        return getAnio();
    }

    @Override
    public Integer value3() {
        return getMes();
    }

    @Override
    public String value4() {
        return getNombreMes();
    }

    @Override
    public Long value5() {
        return getTransaccionesVenta();
    }

    @Override
    public BigDecimal value6() {
        return getTotalVentas();
    }

    @Override
    public BigDecimal value7() {
        return getTotalComisiones();
    }

    @Override
    public BigDecimal value8() {
        return getContribucionNeta();
    }

    @Override
    public BigDecimal value9() {
        return getPromedioVenta();
    }

    @Override
    public BigDecimal value10() {
        return getPorcentajeComision();
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value1(String value) {
        setEmpleado(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value2(Integer value) {
        setAnio(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value3(Integer value) {
        setMes(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value4(String value) {
        setNombreMes(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value5(Long value) {
        setTransaccionesVenta(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value6(BigDecimal value) {
        setTotalVentas(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value7(BigDecimal value) {
        setTotalComisiones(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value8(BigDecimal value) {
        setContribucionNeta(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value9(BigDecimal value) {
        setPromedioVenta(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord value10(BigDecimal value) {
        setPorcentajeComision(value);
        return this;
    }

    @Override
    public VistaVentasEmpleadoMensualRecord values(String value1, Integer value2, Integer value3, String value4, Long value5, BigDecimal value6, BigDecimal value7, BigDecimal value8, BigDecimal value9, BigDecimal value10) {
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
     * Create a detached VistaVentasEmpleadoMensualRecord
     */
    public VistaVentasEmpleadoMensualRecord() {
        super(VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL);
    }

    /**
     * Create a detached, initialised VistaVentasEmpleadoMensualRecord
     */
    public VistaVentasEmpleadoMensualRecord(String empleado, Integer anio, Integer mes, String nombreMes, Long transaccionesVenta, BigDecimal totalVentas, BigDecimal totalComisiones, BigDecimal contribucionNeta, BigDecimal promedioVenta, BigDecimal porcentajeComision) {
        super(VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL);

        setEmpleado(empleado);
        setAnio(anio);
        setMes(mes);
        setNombreMes(nombreMes);
        setTransaccionesVenta(transaccionesVenta);
        setTotalVentas(totalVentas);
        setTotalComisiones(totalComisiones);
        setContribucionNeta(contribucionNeta);
        setPromedioVenta(promedioVenta);
        setPorcentajeComision(porcentajeComision);
        resetChangedOnNotNull();
    }

    /**
     * Create a detached, initialised VistaVentasEmpleadoMensualRecord
     */
    public VistaVentasEmpleadoMensualRecord(com.rodiejacontable.database.jooq.tables.pojos.VistaVentasEmpleadoMensual value) {
        super(VistaVentasEmpleadoMensual.VISTA_VENTAS_EMPLEADO_MENSUAL);

        if (value != null) {
            setEmpleado(value.getEmpleado());
            setAnio(value.getAnio());
            setMes(value.getMes());
            setNombreMes(value.getNombreMes());
            setTransaccionesVenta(value.getTransaccionesVenta());
            setTotalVentas(value.getTotalVentas());
            setTotalComisiones(value.getTotalComisiones());
            setContribucionNeta(value.getContribucionNeta());
            setPromedioVenta(value.getPromedioVenta());
            setPorcentajeComision(value.getPorcentajeComision());
            resetChangedOnNotNull();
        }
    }
}
