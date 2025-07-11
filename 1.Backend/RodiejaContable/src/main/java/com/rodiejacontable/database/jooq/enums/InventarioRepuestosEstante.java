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
public enum InventarioRepuestosEstante implements EnumType {

    E1("E1"),

    E2("E2"),

    E3("E3"),

    E4("E4"),

    E5("E5"),

    E6("E6");

    private final String literal;

    private InventarioRepuestosEstante(String literal) {
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
    public static InventarioRepuestosEstante lookupLiteral(String literal) {
        return EnumType.lookupLiteral(InventarioRepuestosEstante.class, literal);
    }
}
