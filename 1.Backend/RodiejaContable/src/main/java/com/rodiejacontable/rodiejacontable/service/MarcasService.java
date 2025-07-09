package com.rodiejacontable.service;

import com.rodiejacontable.database.jooq.tables.pojos.Marcas;
import com.rodiejacontable.exception.ResourceAlreadyExistsException;
import com.rodiejacontable.exception.ResourceNotFoundException;
import com.rodiejacontable.repository.MarcasRepository;
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
        return marcasRepository.findAll();
    }

    public List<Marcas> findAllActivas() {
        return marcasRepository.findAllActivas();
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
        Marcas marca = findById(id);

        // Si se está intentando cambiar el nombre, verificar que no exista otra marca con el nuevo nombre
        if (marcaDetails.getNombre() != null && !marcaDetails.getNombre().equals(marca.getNombre())) {
            if (marcasRepository.existsByNombre(marcaDetails.getNombre())) {
                throw new ResourceAlreadyExistsException("Ya existe una marca con el nombre: " + marcaDetails.getNombre());
            }
            marca.setNombre(marcaDetails.getNombre());
        }

        // Actualizar solo los campos que no son nulos
        if (marcaDetails.getActivo() != null) {
            marca.setActivo(marcaDetails.getActivo());
        }

        return marcasRepository.update(marca);
    }

    @Transactional
    public void delete(Integer id) {
        // Verificar que la marca existe
        findById(id);
        marcasRepository.delete(id);
    }
}
