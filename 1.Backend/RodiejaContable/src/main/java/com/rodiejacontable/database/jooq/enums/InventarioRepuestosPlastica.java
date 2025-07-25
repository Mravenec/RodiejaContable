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
public enum InventarioRepuestosPlastica implements EnumType {

    CP1_("CP1-"),

    CP2_("CP2-"),

    CP3_("CP3-"),

    CP4_("CP4-"),

    CP5_("CP5-"),

    CP6_("CP6-"),

    CP7_("CP7-"),

    CP8_("CP8-"),

    CP9_("CP9-"),

    CP10_("CP10-"),

    CP11_("CP11-"),

    CP12_("CP12-"),

    CP13_("CP13-"),

    CP14_("CP14-"),

    CP15_("CP15-"),

    CP16_("CP16-"),

    CP17_("CP17-"),

    CP18_("CP18-"),

    CP19_("CP19-"),

    CP20_("CP20-"),

    CP21_("CP21-"),

    CP22_("CP22-"),

    CP23_("CP23-"),

    CP24_("CP24-"),

    CP25_("CP25-"),

    CP26_("CP26-"),

    CP27_("CP27-"),

    CP28_("CP28-"),

    CP29_("CP29-"),

    CP30_("CP30-"),

    CP31_("CP31-"),

    CP32_("CP32-"),

    CP33_("CP33-"),

    CP34_("CP34-"),

    CP35_("CP35-"),

    CP36_("CP36-"),

    CP37_("CP37-"),

    CP38_("CP38-"),

    CP39_("CP39-"),

    CP40_("CP40-"),

    CP41_("CP41-"),

    CP42_("CP42-"),

    CP43_("CP43-"),

    CP44_("CP44-"),

    CP45_("CP45-"),

    CP46_("CP46-"),

    CP47_("CP47-"),

    CP48_("CP48-"),

    CP49_("CP49-"),

    CP50_("CP50-"),

    CP51_("CP51-"),

    CP52_("CP52-");

    private final String literal;

    private InventarioRepuestosPlastica(String literal) {
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
    public static InventarioRepuestosPlastica lookupLiteral(String literal) {
        return EnumType.lookupLiteral(InventarioRepuestosPlastica.class, literal);
    }
}
