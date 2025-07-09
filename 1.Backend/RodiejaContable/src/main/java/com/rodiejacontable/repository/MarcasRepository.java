package com.rodiejacontable.repository;

import static com.rodiejacontable.database.jooq.Tables.MARCAS;

import com.rodiejacontable.database.jooq.tables.pojos.Marcas;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class MarcasRepository {

    @Autowired
    private DSLContext dsl;
    
    public List<Marcas> findAll() {
        System.out.println("\n=== MarcasRepository.findAll() - Starting query ===");
        
        try {
            // Log the SQL query before execution
            String sql = dsl.select()
                    .from(MARCAS)
                    .orderBy(
                        MARCAS.ID.asc()
                    )
                    .getSQL();
            
            System.out.println("Executing SQL Query: " + sql);
            
            // Execute the query with explicit sorting by ID
            List<Marcas> result = dsl.select()
                    .from(MARCAS)
                    .orderBy(
                        MARCAS.ID.asc()
                    )
                    .fetchInto(Marcas.class);
            
            // Log the results
            System.out.println("\nQuery Results (" + result.size() + " items):");
            result.forEach(m -> System.out.println("  - ID: " + m.getId() + ", Nombre: " + m.getNombre()));
            
            // Verify sorting by ID
            boolean isSorted = true;
            for (int i = 1; i < result.size(); i++) {
                if (result.get(i-1).getId() > result.get(i).getId()) {
                    isSorted = false;
                    System.err.println("  !!! Sorting issue between IDs: " + 
                            result.get(i-1).getId() + " and " + result.get(i).getId());
                }
            }
            System.out.println("Sorting by ID verification: " + (isSorted ? "PASSED" : "FAILED"));
            
            return result;
        } catch (Exception e) {
            System.err.println("Error in findAll(): " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public List<Marcas> findAllActivas() {
        System.out.println("\n=== MarcasRepository.findAllActivas() - Starting query ===");
        
        try {
            // Log the SQL query before execution
            String sql = dsl.select()
                    .from(MARCAS)
                    .where(MARCAS.ACTIVO.eq((byte) 1))
                    .orderBy(
                        MARCAS.ID.asc()
                    )
                    .getSQL();
            
            System.out.println("Executing SQL Query: " + sql);
            
            // Execute the query with explicit sorting by ID
            List<Marcas> result = dsl.select()
                    .from(MARCAS)
                    .where(MARCAS.ACTIVO.eq((byte) 1))
                    .orderBy(
                        MARCAS.ID.asc()
                    )
                    .fetchInto(Marcas.class);
            
            // Log the results
            System.out.println("\nQuery Results (" + result.size() + " active items):");
            result.forEach(m -> System.out.println("  - ID: " + m.getId() + ", Nombre: " + m.getNombre()));
            
            // Verify sorting by ID
            boolean isSorted = true;
            for (int i = 1; i < result.size(); i++) {
                if (result.get(i-1).getId() > result.get(i).getId()) {
                    isSorted = false;
                    System.err.println("  !!! Sorting issue between IDs: " + 
                            result.get(i-1).getId() + " and " + result.get(i).getId());
                }
            }
            System.out.println("Sorting by ID verification: " + (isSorted ? "PASSED" : "FAILED"));
            
            return result;
        } catch (Exception e) {
            System.err.println("Error in findAllActivas(): " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    public Optional<Marcas> findById(Integer id) {
        return dsl.selectFrom(MARCAS)
                 .where(MARCAS.ID.eq(id))
                 .fetchOptionalInto(Marcas.class);
    }
    
    public Optional<Marcas> findByNombre(String nombre) {
        return dsl.selectFrom(MARCAS)
                 .where(MARCAS.NOMBRE.eq(nombre))
                 .fetchOptionalInto(Marcas.class);
    }
    
    public Marcas save(Marcas marca) {
        return dsl.insertInto(MARCAS)
                 .set(MARCAS.NOMBRE, marca.getNombre())
                 .set(MARCAS.ACTIVO, marca.getActivo())
                 .set(MARCAS.FECHA_CREACION, marca.getFechaCreacion())
                 .returning()
                 .fetchOne()
                 .into(Marcas.class);
    }
    
    public Marcas update(Marcas marca) {
        return dsl.update(MARCAS)
                 .set(MARCAS.NOMBRE, marca.getNombre())
                 .set(MARCAS.ACTIVO, marca.getActivo())
                 .where(MARCAS.ID.eq(marca.getId()))
                 .returning()
                 .fetchOne()
                 .into(Marcas.class);
    }
    
    public void delete(Integer id) {
        dsl.deleteFrom(MARCAS)
          .where(MARCAS.ID.eq(id))
          .execute();
    }
    
    public boolean existsByNombre(String nombre) {
        return dsl.fetchExists(
            dsl.selectOne()
               .from(MARCAS)
               .where(MARCAS.NOMBRE.eq(nombre))
        );
    }
}
