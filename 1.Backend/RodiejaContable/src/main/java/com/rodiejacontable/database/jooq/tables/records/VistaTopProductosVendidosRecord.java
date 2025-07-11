/*
 * This file is generated by jOOQ.
 */
package com.rodiejacontable.database.jooq.tables.records;


import com.rodiejacontable.database.jooq.tables.VistaTopProductosVendidos;

import java.math.BigDecimal;

import org.jooq.Field;
import org.jooq.Record6;
import org.jooq.Row6;
import org.jooq.impl.TableRecordImpl;


/**
 * VIEW
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class VistaTopProductosVendidosRecord extends TableRecordImpl<VistaTopProductosVendidosRecord> implements Record6<String, String, Long, BigDecimal, BigDecimal, BigDecimal> {

    private static final long serialVersionUID = 1L;

    /**
     * Setter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.tipo_producto</code>.
     */
    public VistaTopProductosVendidosRecord setTipoProducto(String value) {
        set(0, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.tipo_producto</code>.
     */
    public String getTipoProducto() {
        return (String) get(0);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.producto</code>.
     */
    public VistaTopProductosVendidosRecord setProducto(String value) {
        set(1, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.producto</code>.
     */
    public String getProducto() {
        return (String) get(1);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.veces_vendido</code>.
     */
    public VistaTopProductosVendidosRecord setVecesVendido(Long value) {
        set(2, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.veces_vendido</code>.
     */
    public Long getVecesVendido() {
        return (Long) get(2);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.total_ingresos</code>.
     */
    public VistaTopProductosVendidosRecord setTotalIngresos(BigDecimal value) {
        set(3, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.total_ingresos</code>.
     */
    public BigDecimal getTotalIngresos() {
        return (BigDecimal) get(3);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.promedio_venta</code>.
     */
    public VistaTopProductosVendidosRecord setPromedioVenta(BigDecimal value) {
        set(4, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.promedio_venta</code>.
     */
    public BigDecimal getPromedioVenta() {
        return (BigDecimal) get(4);
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.total_comisiones</code>.
     */
    public VistaTopProductosVendidosRecord setTotalComisiones(BigDecimal value) {
        set(5, value);
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_top_productos_vendidos.total_comisiones</code>.
     */
    public BigDecimal getTotalComisiones() {
        return (BigDecimal) get(5);
    }

    // -------------------------------------------------------------------------
    // Record6 type implementation
    // -------------------------------------------------------------------------

    @Override
    public Row6<String, String, Long, BigDecimal, BigDecimal, BigDecimal> fieldsRow() {
        return (Row6) super.fieldsRow();
    }

    @Override
    public Row6<String, String, Long, BigDecimal, BigDecimal, BigDecimal> valuesRow() {
        return (Row6) super.valuesRow();
    }

    @Override
    public Field<String> field1() {
        return VistaTopProductosVendidos.VISTA_TOP_PRODUCTOS_VENDIDOS.TIPO_PRODUCTO;
    }

    @Override
    public Field<String> field2() {
        return VistaTopProductosVendidos.VISTA_TOP_PRODUCTOS_VENDIDOS.PRODUCTO;
    }

    @Override
    public Field<Long> field3() {
        return VistaTopProductosVendidos.VISTA_TOP_PRODUCTOS_VENDIDOS.VECES_VENDIDO;
    }

    @Override
    public Field<BigDecimal> field4() {
        return VistaTopProductosVendidos.VISTA_TOP_PRODUCTOS_VENDIDOS.TOTAL_INGRESOS;
    }

    @Override
    public Field<BigDecimal> field5() {
        return VistaTopProductosVendidos.VISTA_TOP_PRODUCTOS_VENDIDOS.PROMEDIO_VENTA;
    }

    @Override
    public Field<BigDecimal> field6() {
        return VistaTopProductosVendidos.VISTA_TOP_PRODUCTOS_VENDIDOS.TOTAL_COMISIONES;
    }

    @Override
    public String component1() {
        return getTipoProducto();
    }

    @Override
    public String component2() {
        return getProducto();
    }

    @Override
    public Long component3() {
        return getVecesVendido();
    }

    @Override
    public BigDecimal component4() {
        return getTotalIngresos();
    }

    @Override
    public BigDecimal component5() {
        return getPromedioVenta();
    }

    @Override
    public BigDecimal component6() {
        return getTotalComisiones();
    }

    @Override
    public String value1() {
        return getTipoProducto();
    }

    @Override
    public String value2() {
        return getProducto();
    }

    @Override
    public Long value3() {
        return getVecesVendido();
    }

    @Override
    public BigDecimal value4() {
        return getTotalIngresos();
    }

    @Override
    public BigDecimal value5() {
        return getPromedioVenta();
    }

    @Override
    public BigDecimal value6() {
        return getTotalComisiones();
    }

    @Override
    public VistaTopProductosVendidosRecord value1(String value) {
        setTipoProducto(value);
        return this;
    }

    @Override
    public VistaTopProductosVendidosRecord value2(String value) {
        setProducto(value);
        return this;
    }

    @Override
    public VistaTopProductosVendidosRecord value3(Long value) {
        setVecesVendido(value);
        return this;
    }

    @Override
    public VistaTopProductosVendidosRecord value4(BigDecimal value) {
        setTotalIngresos(value);
        return this;
    }

    @Override
    public VistaTopProductosVendidosRecord value5(BigDecimal value) {
        setPromedioVenta(value);
        return this;
    }

    @Override
    public VistaTopProductosVendidosRecord value6(BigDecimal value) {
        setTotalComisiones(value);
        return this;
    }

    @Override
    public VistaTopProductosVendidosRecord values(String value1, String value2, Long value3, BigDecimal value4, BigDecimal value5, BigDecimal value6) {
        value1(value1);
        value2(value2);
        value3(value3);
        value4(value4);
        value5(value5);
        value6(value6);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached VistaTopProductosVendidosRecord
     */
    public VistaTopProductosVendidosRecord() {
        super(VistaTopProductosVendidos.VISTA_TOP_PRODUCTOS_VENDIDOS);
    }

    /**
     * Create a detached, initialised VistaTopProductosVendidosRecord
     */
    public VistaTopProductosVendidosRecord(String tipoProducto, String producto, Long vecesVendido, BigDecimal totalIngresos, BigDecimal promedioVenta, BigDecimal totalComisiones) {
        super(VistaTopProductosVendidos.VISTA_TOP_PRODUCTOS_VENDIDOS);

        setTipoProducto(tipoProducto);
        setProducto(producto);
        setVecesVendido(vecesVendido);
        setTotalIngresos(totalIngresos);
        setPromedioVenta(promedioVenta);
        setTotalComisiones(totalComisiones);
        resetChangedOnNotNull();
    }

    /**
     * Create a detached, initialised VistaTopProductosVendidosRecord
     */
    public VistaTopProductosVendidosRecord(com.rodiejacontable.database.jooq.tables.pojos.VistaTopProductosVendidos value) {
        super(VistaTopProductosVendidos.VISTA_TOP_PRODUCTOS_VENDIDOS);

        if (value != null) {
            setTipoProducto(value.getTipoProducto());
            setProducto(value.getProducto());
            setVecesVendido(value.getVecesVendido());
            setTotalIngresos(value.getTotalIngresos());
            setPromedioVenta(value.getPromedioVenta());
            setTotalComisiones(value.getTotalComisiones());
            resetChangedOnNotNull();
        }
    }
}
