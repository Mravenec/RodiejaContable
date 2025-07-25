/*
 * This file is generated by jOOQ.
 */
package com.rodiejacontable.database.jooq.tables.pojos;


import java.io.Serializable;
import java.math.BigDecimal;


/**
 * VIEW
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class VistaVentasEmpleadoMensual implements Serializable {

    private static final long serialVersionUID = 1L;

    private String empleado;
    private Integer anio;
    private Integer mes;
    private String nombreMes;
    private Long transaccionesVenta;
    private BigDecimal totalVentas;
    private BigDecimal totalComisiones;
    private BigDecimal contribucionNeta;
    private BigDecimal promedioVenta;
    private BigDecimal porcentajeComision;

    public VistaVentasEmpleadoMensual() {}

    public VistaVentasEmpleadoMensual(VistaVentasEmpleadoMensual value) {
        this.empleado = value.empleado;
        this.anio = value.anio;
        this.mes = value.mes;
        this.nombreMes = value.nombreMes;
        this.transaccionesVenta = value.transaccionesVenta;
        this.totalVentas = value.totalVentas;
        this.totalComisiones = value.totalComisiones;
        this.contribucionNeta = value.contribucionNeta;
        this.promedioVenta = value.promedioVenta;
        this.porcentajeComision = value.porcentajeComision;
    }

    public VistaVentasEmpleadoMensual(
        String empleado,
        Integer anio,
        Integer mes,
        String nombreMes,
        Long transaccionesVenta,
        BigDecimal totalVentas,
        BigDecimal totalComisiones,
        BigDecimal contribucionNeta,
        BigDecimal promedioVenta,
        BigDecimal porcentajeComision
    ) {
        this.empleado = empleado;
        this.anio = anio;
        this.mes = mes;
        this.nombreMes = nombreMes;
        this.transaccionesVenta = transaccionesVenta;
        this.totalVentas = totalVentas;
        this.totalComisiones = totalComisiones;
        this.contribucionNeta = contribucionNeta;
        this.promedioVenta = promedioVenta;
        this.porcentajeComision = porcentajeComision;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.empleado</code>.
     */
    public String getEmpleado() {
        return this.empleado;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.empleado</code>.
     */
    public VistaVentasEmpleadoMensual setEmpleado(String empleado) {
        this.empleado = empleado;
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.anio</code>.
     */
    public Integer getAnio() {
        return this.anio;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.anio</code>.
     */
    public VistaVentasEmpleadoMensual setAnio(Integer anio) {
        this.anio = anio;
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.mes</code>.
     */
    public Integer getMes() {
        return this.mes;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.mes</code>.
     */
    public VistaVentasEmpleadoMensual setMes(Integer mes) {
        this.mes = mes;
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.nombre_mes</code>.
     */
    public String getNombreMes() {
        return this.nombreMes;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.nombre_mes</code>.
     */
    public VistaVentasEmpleadoMensual setNombreMes(String nombreMes) {
        this.nombreMes = nombreMes;
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.transacciones_venta</code>.
     */
    public Long getTransaccionesVenta() {
        return this.transaccionesVenta;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.transacciones_venta</code>.
     */
    public VistaVentasEmpleadoMensual setTransaccionesVenta(Long transaccionesVenta) {
        this.transaccionesVenta = transaccionesVenta;
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.total_ventas</code>.
     */
    public BigDecimal getTotalVentas() {
        return this.totalVentas;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.total_ventas</code>.
     */
    public VistaVentasEmpleadoMensual setTotalVentas(BigDecimal totalVentas) {
        this.totalVentas = totalVentas;
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.total_comisiones</code>.
     */
    public BigDecimal getTotalComisiones() {
        return this.totalComisiones;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.total_comisiones</code>.
     */
    public VistaVentasEmpleadoMensual setTotalComisiones(BigDecimal totalComisiones) {
        this.totalComisiones = totalComisiones;
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.contribucion_neta</code>.
     */
    public BigDecimal getContribucionNeta() {
        return this.contribucionNeta;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.contribucion_neta</code>.
     */
    public VistaVentasEmpleadoMensual setContribucionNeta(BigDecimal contribucionNeta) {
        this.contribucionNeta = contribucionNeta;
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.promedio_venta</code>.
     */
    public BigDecimal getPromedioVenta() {
        return this.promedioVenta;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.promedio_venta</code>.
     */
    public VistaVentasEmpleadoMensual setPromedioVenta(BigDecimal promedioVenta) {
        this.promedioVenta = promedioVenta;
        return this;
    }

    /**
     * Getter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.porcentaje_comision</code>.
     */
    public BigDecimal getPorcentajeComision() {
        return this.porcentajeComision;
    }

    /**
     * Setter for
     * <code>sistema_vehicular.vista_ventas_empleado_mensual.porcentaje_comision</code>.
     */
    public VistaVentasEmpleadoMensual setPorcentajeComision(BigDecimal porcentajeComision) {
        this.porcentajeComision = porcentajeComision;
        return this;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        final VistaVentasEmpleadoMensual other = (VistaVentasEmpleadoMensual) obj;
        if (this.empleado == null) {
            if (other.empleado != null)
                return false;
        }
        else if (!this.empleado.equals(other.empleado))
            return false;
        if (this.anio == null) {
            if (other.anio != null)
                return false;
        }
        else if (!this.anio.equals(other.anio))
            return false;
        if (this.mes == null) {
            if (other.mes != null)
                return false;
        }
        else if (!this.mes.equals(other.mes))
            return false;
        if (this.nombreMes == null) {
            if (other.nombreMes != null)
                return false;
        }
        else if (!this.nombreMes.equals(other.nombreMes))
            return false;
        if (this.transaccionesVenta == null) {
            if (other.transaccionesVenta != null)
                return false;
        }
        else if (!this.transaccionesVenta.equals(other.transaccionesVenta))
            return false;
        if (this.totalVentas == null) {
            if (other.totalVentas != null)
                return false;
        }
        else if (!this.totalVentas.equals(other.totalVentas))
            return false;
        if (this.totalComisiones == null) {
            if (other.totalComisiones != null)
                return false;
        }
        else if (!this.totalComisiones.equals(other.totalComisiones))
            return false;
        if (this.contribucionNeta == null) {
            if (other.contribucionNeta != null)
                return false;
        }
        else if (!this.contribucionNeta.equals(other.contribucionNeta))
            return false;
        if (this.promedioVenta == null) {
            if (other.promedioVenta != null)
                return false;
        }
        else if (!this.promedioVenta.equals(other.promedioVenta))
            return false;
        if (this.porcentajeComision == null) {
            if (other.porcentajeComision != null)
                return false;
        }
        else if (!this.porcentajeComision.equals(other.porcentajeComision))
            return false;
        return true;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((this.empleado == null) ? 0 : this.empleado.hashCode());
        result = prime * result + ((this.anio == null) ? 0 : this.anio.hashCode());
        result = prime * result + ((this.mes == null) ? 0 : this.mes.hashCode());
        result = prime * result + ((this.nombreMes == null) ? 0 : this.nombreMes.hashCode());
        result = prime * result + ((this.transaccionesVenta == null) ? 0 : this.transaccionesVenta.hashCode());
        result = prime * result + ((this.totalVentas == null) ? 0 : this.totalVentas.hashCode());
        result = prime * result + ((this.totalComisiones == null) ? 0 : this.totalComisiones.hashCode());
        result = prime * result + ((this.contribucionNeta == null) ? 0 : this.contribucionNeta.hashCode());
        result = prime * result + ((this.promedioVenta == null) ? 0 : this.promedioVenta.hashCode());
        result = prime * result + ((this.porcentajeComision == null) ? 0 : this.porcentajeComision.hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("VistaVentasEmpleadoMensual (");

        sb.append(empleado);
        sb.append(", ").append(anio);
        sb.append(", ").append(mes);
        sb.append(", ").append(nombreMes);
        sb.append(", ").append(transaccionesVenta);
        sb.append(", ").append(totalVentas);
        sb.append(", ").append(totalComisiones);
        sb.append(", ").append(contribucionNeta);
        sb.append(", ").append(promedioVenta);
        sb.append(", ").append(porcentajeComision);

        sb.append(")");
        return sb.toString();
    }
}
