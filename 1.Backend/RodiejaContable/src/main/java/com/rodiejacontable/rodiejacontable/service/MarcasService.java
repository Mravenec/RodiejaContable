package com.rodiejacontable.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.Marcas;
import com.rodiejacontable.rodiejacontable.exception.ResourceAlreadyExistsException;
import com.rodiejacontable.rodiejacontable.exception.ResourceNotFoundException;
import com.rodiejacontable.rodiejacontable.repository.MarcasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MarcasService {

    @Autowired
    private MarcasRepository marcasRepository;

    public List<Marcas> findAll() {
        System.out.println("MarcasService.findAll() - Calling repository...");
        List<Marcas> result = marcasRepository.findAll();
        
        // Log the order from repository
        System.out.println("MarcasService.findAll() - From repository - First 5: " + 
                         result.stream().limit(5)
                               .map(m -> m.getNombre() + " (ID: " + m.getId() + ")")
                               .collect(java.util.stream.Collectors.toList()));
        
        // The repository should handle the sorting, but we'll add a safety check
        if (result.size() > 1) {
            for (int i = 1; i < result.size(); i++) {
                String prevName = result.get(i-1).getNombre().toLowerCase();
                String currName = result.get(i).getNombre().toLowerCase();
                
                if (prevName.compareTo(currName) > 0) {
                    System.err.println("WARNING: Results are not properly sorted! " + 
                                     prevName + " should come after " + currName);
                    break;
                }
            }
        }
        
        return result;
    }

    public List<Marcas> findAllActivas() {
        System.out.println("MarcasService.findAllActivas() - Calling repository...");
        List<Marcas> result = marcasRepository.findAllActivas();
        
        // Log the order from repository
        System.out.println("MarcasService.findAllActivas() - From repository - First 5: " + 
                         result.stream().limit(5)
                               .map(m -> m.getNombre() + " (ID: " + m.getId() + ")")
                               .collect(java.util.stream.Collectors.toList()));
        
        // The repository should handle the sorting, but we'll add a safety check
        if (result.size() > 1) {
            for (int i = 1; i < result.size(); i++) {
                String prevName = result.get(i-1).getNombre().toLowerCase();
                String currName = result.get(i).getNombre().toLowerCase();
                
                if (prevName.compareTo(currName) > 0) {
                    System.err.println("WARNING: Active results are not properly sorted! " + 
                                     prevName + " should come after " + currName);
                    break;
                }
            }
        }
        
        return result;
    }

    public Marcas findById(Integer id) {
        return marcasRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada con id: " + id));
    }

    @Transactional
    public Marcas create(Marcas marca) {
        // Verificar si ya existe una marca con el mismo nombre
        if (marcasRepository.existsByNombre(marca.getNombre())) {
            throw new ResourceAlreadyExistsException("Ya existe una marca con el nombre: " + marca.getNombre());
        }

        // Establecer valores por defecto
        marca.setFechaCreacion(LocalDateTime.now());
        if (marca.getActivo() == null) {
            marca.setActivo((byte) 1); // Por defecto activo
        }

        return marcasRepository.save(marca);
    }

    @Transactional
    public Marcas update(Integer id, Marcas marcaDetails) {
        System.out.println("=== MarcasService.update() - Starting update for marca ID: " + id + " ===");
        System.out.println("Received marcaDetails: " + marcaDetails);
        
        try {
            Marcas marca = findById(id);
            System.out.println("Found existing marca: " + marca);

            // Si se está intentando cambiar el nombre, verificar que no exista otra marca con el nuevo nombre
            if (marcaDetails.getNombre() != null && !marcaDetails.getNombre().equals(marca.getNombre())) {
                System.out.println("Updating nombre from: " + marca.getNombre() + " to: " + marcaDetails.getNombre());
                if (marcasRepository.existsByNombre(marcaDetails.getNombre())) {
                    String errorMsg = "Ya existe una marca con el nombre: " + marcaDetails.getNombre();
                    System.err.println("Error: " + errorMsg);
                    throw new ResourceAlreadyExistsException(errorMsg);
                }
                marca.setNombre(marcaDetails.getNombre());
            }

            // Actualizar solo los campos que no son nulos
            if (marcaDetails.getActivo() != null) {
                System.out.println("Updating activo from: " + marca.getActivo() + " to: " + marcaDetails.getActivo());
                marca.setActivo(marcaDetails.getActivo());
            }

            System.out.println("Saving updated marca: " + marca);
            Marcas updatedMarca = marcasRepository.update(marca);
            System.out.println("Successfully updated marca: " + updatedMarca);
            return updatedMarca;
        } catch (Exception e) {
            System.err.println("Error in MarcasService.update(): " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public void delete(Integer id) {
        // Verificar que la marca existe
        findById(id);
        marcasRepository.delete(id);
    }
}
