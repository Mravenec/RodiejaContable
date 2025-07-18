/*
 * This file is generated by jOOQ.
 */
package com.rodiejacontable.database.jooq.enums;


import org.jooq.Catalog;
import org.jooq.EnumType;
import org.jooq.Schema;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public enum InventarioRepuestosCondicion implements EnumType {

    _100_25_("100%-"),

    _50_25_("50%-"),

    _0_25_("0%-");

    private final String literal;

    private InventarioRepuestosCondicion(String literal) {
        this.literal = literal;
    }

    @Override
    public Catalog getCatalog() {
        return null;
    }

    @Override
    public Schema getSchema() {
        return null;
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public String getLiteral() {
        return literal;
    }

    /**
     * Lookup a value of this EnumType by its literal
     */
    public static InventarioRepuestosCondicion lookupLiteral(String literal) {
        return EnumType.lookupLiteral(InventarioRepuestosCondicion.class, literal);
    }
}
